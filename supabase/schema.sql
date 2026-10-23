-- =====================================================================
-- TROOVANTE — structure de la base de données
-- Peut être relancé sans risque : rien n'est effacé ni dupliqué.
-- =====================================================================

-- ---------- Les univers (Mobilier, Luminaires…) ----------
create table if not exists public.univers (
  slug        text primary key,
  nom         text not null,
  titre       text not null,
  accroche    text not null default '',
  intro       text not null default '',
  image       text,
  -- [{ "label": "Commode", "groupe": "categories", "option": "Commode", "image": "…" }]
  tuiles      jsonb not null default '[]',
  -- [{ "label": "Époque", "options": ["XVIIIe siècle", "XIXe siècle"] }]
  filtres     jsonb not null default '[]',
  position    integer not null default 0
);

-- ---------- Les marchands (informations publiques uniquement) ----------
create table if not exists public.marchands (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  nom           text not null,
  ville         text,
  region        text,
  presentation  text,
  created_at    timestamptz not null default now()
);

-- ---------- Les objets ----------
create table if not exists public.objets (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  univers_slug  text not null references public.univers (slug) on update cascade,
  marchand_id   uuid references public.marchands (id) on delete set null,
  nom           text not null,
  nom_court     text,
  origine       text not null default '',
  signature     text,
  prix          integer not null check (prix >= 0),
  -- brouillon → en_validation → publie → vendu (ou refuse)
  statut        text not null default 'brouillon'
                check (statut in ('brouillon', 'en_validation', 'publie', 'vendu', 'refuse')),
  -- { "categories": ["Commode"], "epoque": ["XVIIIe siècle"] }
  attributs     jsonb not null default '{}',
  -- [{ "src": "…", "alt": "…" }] — la première photo est la photo principale
  photos        jsonb not null default '[]',
  histoire      text,
  dimensions    text,
  etat          text,
  livraison     text,
  publie_le     timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists objets_univers_idx on public.objets (univers_slug);
create index if not exists objets_marchand_idx on public.objets (marchand_id);
create index if not exists objets_publication_idx on public.objets (statut, publie_le desc);

-- ---------- Les demandes des visiteurs (achat, question, rappel) ----------
create table if not exists public.demandes (
  id          uuid primary key default gen_random_uuid(),
  type        text not null check (type in ('achat', 'question', 'rappel')),
  objet_id    uuid references public.objets (id) on delete set null,
  objet_nom   text,
  prenom      text not null,
  email       text,
  telephone   text,
  message     text,
  -- nouvelle → traitee
  statut      text not null default 'nouvelle' check (statut in ('nouvelle', 'traitee')),
  created_at  timestamptz not null default now()
);

-- ---------- Les objets déposés par les professionnels (Espace professionnel) ----------
-- Table privée : elle contient les coordonnées du professionnel. Un dépôt ne
-- devient un objet du catalogue qu'après validation par TROOVANTE.
create table if not exists public.depots (
  id                uuid primary key default gen_random_uuid(),
  -- Le professionnel (jamais affiché sur le site)
  profil            text not null check (profil in ('marchand', 'createur')),
  nom               text not null,
  societe           text,
  email             text not null,
  telephone         text not null,
  ville             text,
  -- L'objet, tel que décrit par le professionnel
  titre             text not null,
  univers_slug      text references public.univers (slug) on update cascade on delete set null,
  -- Sous-catégorie et autres listes choisies dans le formulaire : { "categories": ["Commode"], "epoque": [...] }
  attributs         jsonb not null default '{}',
  description       text not null,
  origine           text not null,
  signature         text,
  etat              text not null,
  hauteur_cm        numeric(7, 1) not null check (hauteur_cm > 0),
  largeur_cm        numeric(7, 1) not null check (largeur_cm > 0),
  profondeur_cm     numeric(7, 1) check (profondeur_cm > 0),
  poids_kg          numeric(7, 1) check (poids_kg > 0),
  prix_souhaite     integer not null check (prix_souhaite > 0),
  -- L'engagement d'exclusivité doit avoir été coché
  exclusivite       boolean not null check (exclusivite),
  -- Photos reçues : chemins dans l'espace de stockage privé « depots »
  photos_origine    jsonb not null default '[]',
  -- Mises en situation générées par IA : chemins dans le même espace privé
  photos_situation  jsonb not null default '[]',
  ia_statut         text not null default 'en_attente'
                    check (ia_statut in ('en_attente', 'en_cours', 'terminee', 'echec')),
  ia_erreur         text,
  -- Suivi par TROOVANTE : nouveau → publie (ou refuse)
  statut            text not null default 'nouveau' check (statut in ('nouveau', 'publie', 'refuse')),
  objet_id          uuid references public.objets (id) on delete set null,
  note_interne      text,
  created_at        timestamptz not null default now()
);

-- Colonnes ajoutées après la création de la table : complète une base déjà installée.
alter table public.depots add column if not exists attributs jsonb not null default '{}';

create index if not exists depots_suivi_idx on public.depots (statut, created_at desc);

-- ---------- Le stockage des photos ----------
-- « depots » : privé, photos telles qu'envoyées par les professionnels.
-- « photos » : public, images des objets publiés sur le site.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('depots', 'depots', false, 15728640, array['image/jpeg', 'image/png', 'image/webp']),
  ('photos', 'photos', true, 15728640, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

-- =====================================================================
-- Droits d'accès : le site (visiteur anonyme) ne peut que
--  - lire les univers, les marchands et les objets publiés ;
--  - déposer une demande, sans jamais pouvoir relire celles des autres.
-- Les dépôts des professionnels ne sont accessibles qu'au serveur du site,
-- qui utilise la clé secrète.
-- =====================================================================

alter table public.univers   enable row level security;
alter table public.marchands enable row level security;
alter table public.objets    enable row level security;
alter table public.demandes  enable row level security;
alter table public.depots    enable row level security;

grant usage on schema public to anon, authenticated, service_role;
grant select on public.univers, public.marchands, public.objets to anon, authenticated;
grant insert on public.demandes to anon, authenticated;
grant all on public.univers, public.marchands, public.objets, public.demandes, public.depots to service_role;

-- Chaque règle n'est créée que si elle n'existe pas déjà. Aucune règle n'est
-- écrite pour « depots » : sans règle, la table reste fermée aux visiteurs.
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'Lecture publique des univers') then
    create policy "Lecture publique des univers" on public.univers
      for select to anon, authenticated using (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'Lecture publique des marchands') then
    create policy "Lecture publique des marchands" on public.marchands
      for select to anon, authenticated using (true);
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'Lecture publique des objets publiés') then
    create policy "Lecture publique des objets publiés" on public.objets
      for select to anon, authenticated using (statut = 'publie');
  end if;

  if not exists (select 1 from pg_policies where schemaname = 'public' and policyname = 'Dépôt public des demandes') then
    create policy "Dépôt public des demandes" on public.demandes
      for insert to anon, authenticated with check (statut = 'nouvelle');
  end if;
end $$;
