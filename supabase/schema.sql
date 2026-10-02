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

-- =====================================================================
-- Droits d'accès : le site (visiteur anonyme) ne peut que
--  - lire les univers, les marchands et les objets publiés ;
--  - déposer une demande, sans jamais pouvoir relire celles des autres.
-- =====================================================================

alter table public.univers   enable row level security;
alter table public.marchands enable row level security;
alter table public.objets    enable row level security;
alter table public.demandes  enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.univers, public.marchands, public.objets to anon, authenticated;
grant insert on public.demandes to anon, authenticated;

drop policy if exists "Lecture publique des univers" on public.univers;
create policy "Lecture publique des univers" on public.univers
  for select to anon, authenticated using (true);

drop policy if exists "Lecture publique des marchands" on public.marchands;
create policy "Lecture publique des marchands" on public.marchands
  for select to anon, authenticated using (true);

drop policy if exists "Lecture publique des objets publiés" on public.objets;
create policy "Lecture publique des objets publiés" on public.objets
  for select to anon, authenticated using (statut = 'publie');

drop policy if exists "Dépôt public d'une demande" on public.demandes;
create policy "Dépôt public d'une demande" on public.demandes
  for insert to anon, authenticated with check (statut = 'nouvelle');
