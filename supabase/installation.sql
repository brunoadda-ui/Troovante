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
revoke all on public.depots from anon, authenticated;
grant all on public.univers, public.marchands, public.objets, public.demandes, public.depots to service_role;

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

-- =====================================================================
-- Catalogue de démonstration (fictif, repris de la maquette).
-- Un univers, un marchand ou un objet déjà présent n'est pas modifié.
-- =====================================================================

insert into public.univers (slug, nom, titre, accroche, intro, image, tuiles, filtres, position) values
  ('mobilier', 'Mobilier', 'Mobilier ancien', 'Des meubles qui ont déjà une vie', 'Commodes estampillées, buffets de campagne, bergères et guéridons : du XVIIIe siècle aux éditions des années 60. Chaque meuble a été vu, daté et vérifié chez le marchand avant d’arriver ici.', '/images/univers/mobilier.webp', '[{"label":"Commode","groupe":"categories","option":"Commode","image":"/images/objets/commode-louis-xv-1.webp"},{"label":"Fauteuil","groupe":"categories","option":"Fauteuil & bergère"},{"label":"Table","groupe":"categories","option":"Table & guéridon"},{"label":"Miroirs","groupe":"categories","option":"Miroirs"}]'::jsonb, '[{"label":"Catégories","options":["Commode","Buffet & enfilade","Table & guéridon","Fauteuil & bergère","Chaise","Bibliothèque","Secrétaire","Miroirs"]},{"label":"Époque","options":["XVIIIe siècle","XIXe siècle","Art déco","1950–1970"]}]'::jsonb, 0)
  on conflict (slug) do nothing;
insert into public.univers (slug, nom, titre, accroche, intro, image, tuiles, filtres, position) values
  ('luminaires', 'Luminaires', 'Luminaires vintage', 'La lumière qui fait l’intérieur', 'Lustres à pampilles, appliques en opaline, suspensions de designers italiens. Toutes nos pièces sont refaites aux normes électriques actuelles par notre atelier avant expédition.', '/images/univers/luminaires.webp', '[{"label":"Lampe à poser","groupe":"categories","option":"Lampe à poser"},{"label":"Applique","groupe":"categories","option":"Applique"},{"label":"Suspension","groupe":"categories","option":"Suspension"},{"label":"Plafonnier","groupe":"categories","option":"Plafonnier"}]'::jsonb, '[{"label":"Catégories","options":["Abat-jour","Applique","Lampadaire","Lampe à poser","Lustre","Plafonnier","Suspension"]},{"label":"Matière","options":["Laiton","Opaline","Cristal","Rotin","Verre soufflé"]}]'::jsonb, 1)
  on conflict (slug) do nothing;
insert into public.univers (slug, nom, titre, accroche, intro, image, tuiles, filtres, position) values
  ('arts-de-la-table', 'Arts de la table', 'Arts de la table', 'Recevoir comme autrefois', 'Services en faïence, verres taillés, argenterie poinçonnée et ménagères complètes. Nous vérifions le nombre de pièces, les poinçons et l’état de chaque ensemble avant la mise en ligne.', '/images/univers/arts-de-la-table.webp', '[{"label":"Service","groupe":"categories","option":"Assiette & service"},{"label":"Verrerie","groupe":"categories","option":"Verre & carafe"},{"label":"Argenterie","groupe":"categories","option":"Argenterie"},{"label":"Faïence","groupe":"matiere","option":"Faïence"}]'::jsonb, '[{"label":"Catégories","options":["Assiette & service","Verre & carafe","Argenterie","Plat de service","Théière & cafetière","Ménagère"]},{"label":"Matière","options":["Faïence","Porcelaine","Cristal","Argent massif","Métal argenté"]}]'::jsonb, 2)
  on conflict (slug) do nothing;
insert into public.univers (slug, nom, titre, accroche, intro, image, tuiles, filtres, position) values
  ('galerie', 'Galerie', 'Galerie', 'Ce qu’on accroche au mur', 'Huiles sur toile, aquarelles, dessins et gravures anciennes. Chaque œuvre est vendue avec ce que nous savons de sa provenance, sans jamais forcer une attribution.', '/images/univers/galerie.webp', '[{"label":"Huile sur toile","groupe":"categories","option":"Huile sur toile"},{"label":"Aquarelle","groupe":"categories","option":"Aquarelle & dessin"},{"label":"Gravure","groupe":"categories","option":"Gravure & estampe"},{"label":"Photographie","groupe":"categories","option":"Photographie"}]'::jsonb, '[{"label":"Catégories","options":["Huile sur toile","Aquarelle & dessin","Gravure & estampe","Photographie","Cadre ancien"]},{"label":"Sujet","options":["Paysage","Portrait","Nature morte","Marine","Abstraction"]}]'::jsonb, 3)
  on conflict (slug) do nothing;
insert into public.univers (slug, nom, titre, accroche, intro, image, tuiles, filtres, position) values
  ('createurs', 'Créateurs', 'Créateurs', 'Des noms qu’on reconnaît de loin', 'Ébénistes estampillés, verriers, céramistes et designers du XXe siècle. Nous ne retenons une attribution que si la signature, l’estampille ou la documentation la confirment — sinon nous écrivons « dans le goût de ».', '/images/univers/createurs.webp', '[{"label":"Ébénistes","groupe":"discipline","option":"Ébénisterie"},{"label":"Verriers","groupe":"discipline","option":"Verrerie"},{"label":"Céramistes","groupe":"discipline","option":"Céramique"},{"label":"Design XXe","groupe":"discipline","option":"Mobilier design"}]'::jsonb, '[{"label":"Créateurs","options":["Pierre Roussel","Émile Gallé","Jean Prouvé","Charlotte Perriand","Suzanne Ramié","Gio Ponti","Serge Mouille"]},{"label":"Discipline","options":["Ébénisterie","Verrerie","Céramique","Mobilier design","Luminaire d’auteur"]}]'::jsonb, 4)
  on conflict (slug) do nothing;
insert into public.univers (slug, nom, titre, accroche, intro, image, tuiles, filtres, position) values
  ('curiosites', 'Curiosités', 'Objets de curiosité', 'Ce qui ne rentre dans aucune case', 'Instruments de marine, cabinets de curiosités, sculptures et objets d’atelier. Ce sont souvent nos pièces les plus rares : une seule chance de les voir passer.', '/images/univers/curiosites.webp', '[{"label":"Sculpture","groupe":"categories","option":"Sculpture"},{"label":"Instrument","groupe":"categories","option":"Instrument scientifique"},{"label":"Horlogerie","groupe":"categories","option":"Horlogerie"},{"label":"Objet d’atelier","groupe":"categories","option":"Objet d’atelier"}]'::jsonb, '[{"label":"Catégories","options":["Sculpture","Instrument scientifique","Marine","Taxidermie","Objet d’atelier","Horlogerie"]},{"label":"Matière","options":["Bronze","Marbre","Bois","Laiton","Porphyre"]}]'::jsonb, 5)
  on conflict (slug) do nothing;

insert into public.marchands (slug, nom, ville, region, presentation) values
  ('galerie-bertheau', 'Galerie Bertheau', 'Paris', 'Île-de-France', 'Antiquaire à Paris depuis 1987, spécialiste du mobilier français du XVIIIe siècle.')
  on conflict (slug) do nothing;
insert into public.marchands (slug, nom, ville, region, presentation) values
  ('atelier-marsan', 'Atelier Marsan', null, null, null)
  on conflict (slug) do nothing;
insert into public.marchands (slug, nom, ville, region, presentation) values
  ('maison-delaunay', 'Maison Delaunay', null, null, null)
  on conflict (slug) do nothing;
insert into public.marchands (slug, nom, ville, region, presentation) values
  ('galerie-sainte-anne', 'Galerie Sainte-Anne', null, null, null)
  on conflict (slug) do nothing;
insert into public.marchands (slug, nom, ville, region, presentation) values
  ('atelier-verrier', 'Atelier Verrier', null, null, null)
  on conflict (slug) do nothing;
insert into public.marchands (slug, nom, ville, region, presentation) values
  ('studio-milano', 'Studio Milano', null, null, null)
  on conflict (slug) do nothing;
insert into public.marchands (slug, nom, ville, region, presentation) values
  ('studio-nord', 'Studio Nord', null, null, null)
  on conflict (slug) do nothing;
insert into public.marchands (slug, nom, ville, region, presentation) values
  ('maison-tessier', 'Maison Tessier', null, null, null)
  on conflict (slug) do nothing;

insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('commode-louis-xv-en-placage-de-bois-de-rose', 'mobilier', (select id from public.marchands where slug = 'galerie-bertheau'), 'Commode Louis XV en placage de bois de rose', 'Commode Louis XV', 'France, vers 1760', 'Estampillée P. Roussel', 4800, 'publie', '{"categories":["Commode"],"epoque":["XVIIIe siècle"]}'::jsonb, '[{"src":"/images/objets/commode-louis-xv-1.webp","alt":"Commode Louis XV en placage de bois de rose, vue d’ensemble"},{"src":"/images/objets/commode-louis-xv-2.webp","alt":"Commode Louis XV, vue en situation"}]'::jsonb, 'Réalisée à Paris au milieu du XVIIIe siècle, cette commode à façade galbée illustre le goût Louis XV pour les bois exotiques : un placage de bois de rose en frisage, souligné de filets de bois de violette.

Elle provient d’un hôtel particulier bordelais et est restée dans la même famille pendant quatre générations. Le marbre brèche d’Alep est celui d’origine.', 'Hauteur 85 cm · Largeur 128 cm · Profondeur 60 cm · 62 kg. Deux tiroirs sans traverse, serrure fonctionnelle livrée avec sa clé.', 'Très bon état d’usage pour son âge. Restaurations anciennes du placage sur le côté droit, visibles à la lumière rasante. Un éclat comblé à l’arrière gauche du marbre. Bronzes d’origine, patine non retouchée.', 'Enlèvement sous 5 jours, livraison en France sous 10 à 15 jours par transporteur spécialisé mobilier. Retour accepté 14 jours après réception, frais de retour à notre charge.', now() - interval '0 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('paire-de-fauteuils-cabriolet-en-noyer', 'mobilier', (select id from public.marchands where slug = 'atelier-marsan'), 'Paire de fauteuils cabriolet en noyer', null, 'France, XIXe siècle', null, 2200, 'publie', '{"categories":["Fauteuil & bergère"],"epoque":["XIXe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '1 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('miroir-a-parecloses-en-bois-dore', 'mobilier', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Miroir à parecloses en bois doré', null, 'Italie, vers 1880', null, 1450, 'publie', '{"categories":["Miroirs"],"epoque":["XIXe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '2 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('lustre-a-pampilles-de-cristal-huit-feux', 'luminaires', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Lustre à pampilles de cristal, huit feux', null, 'France, vers 1900', null, 3100, 'publie', '{"categories":["Lustre"],"matiere":["Cristal"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '3 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('table-basse-a-plateau-de-marbre-pietement-tulipe', 'mobilier', (select id from public.marchands where slug = 'studio-milano'), 'Table basse à plateau de marbre, piètement tulipe', null, 'Édition des années 1960', null, 2900, 'publie', '{"categories":["Table & guéridon"],"epoque":["1950–1970"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '4 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('ensemble-de-quatre-colonnes-en-porphyre', 'curiosites', (select id from public.marchands where slug = 'maison-delaunay'), 'Ensemble de quatre colonnes en porphyre', null, 'Italie, XIXe siècle', null, 2600, 'publie', '{"categories":["Sculpture"],"matiere":["Porphyre"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '5 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('paravent-en-lamelles-de-bois-courbe', 'mobilier', (select id from public.marchands where slug = 'studio-nord'), 'Paravent en lamelles de bois courbé', null, 'Milieu du XXe siècle', null, 950, 'publie', '{"epoque":["1950–1970"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '6 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('buffet-en-bois-de-rose-marquete-d-attributs', 'mobilier', (select id from public.marchands where slug = 'galerie-bertheau'), 'Buffet en bois de rose marqueté d’attributs', null, 'France, vers 1780', null, 3400, 'publie', '{"categories":["Buffet & enfilade"],"epoque":["XVIIIe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '7 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('gueridon-tripode-en-acajou-et-laiton', 'mobilier', (select id from public.marchands where slug = 'maison-delaunay'), 'Guéridon tripode en acajou et laiton', null, 'France, vers 1830', null, 1150, 'publie', '{"categories":["Table & guéridon"],"epoque":["XIXe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '8 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('enfilade-en-chene-ceruse-quatre-portes', 'mobilier', (select id from public.marchands where slug = 'atelier-marsan'), 'Enfilade en chêne cérusé, quatre portes', null, 'France, vers 1955', null, 1890, 'publie', '{"categories":["Buffet & enfilade"],"epoque":["1950–1970"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '9 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('table-de-salon-en-placage-de-bois-de-rose', 'mobilier', (select id from public.marchands where slug = 'galerie-bertheau'), 'Table de salon en placage de bois de rose', null, 'France, vers 1765', null, 3900, 'publie', '{"categories":["Table & guéridon"],"epoque":["XVIIIe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '10 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('trumeau-louis-xvi-en-bois-peint', 'mobilier', (select id from public.marchands where slug = 'maison-delaunay'), 'Trumeau Louis XVI en bois peint', null, 'France, vers 1785', null, 2600, 'publie', '{"categories":["Miroirs"],"epoque":["XVIIIe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '11 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('commode-en-noyer-a-facade-sinueuse', 'mobilier', (select id from public.marchands where slug = 'galerie-bertheau'), 'Commode en noyer à façade sinueuse', null, 'Lyon, vers 1750', null, 2700, 'publie', '{"categories":["Commode"],"epoque":["XVIIIe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '12 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('paire-de-bergeres-a-oreilles', 'mobilier', (select id from public.marchands where slug = 'galerie-bertheau'), 'Paire de bergères à oreilles', null, 'France, fin XVIIIe', null, 4100, 'publie', '{"categories":["Fauteuil & bergère"],"epoque":["XVIIIe siècle"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '13 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('suspension-en-opaline-blanche', 'luminaires', (select id from public.marchands where slug = 'atelier-verrier'), 'Suspension en opaline blanche', null, 'France, années 60', null, 420, 'publie', '{"categories":["Suspension"],"matiere":["Opaline"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '14 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('paire-d-appliques-en-laiton-et-verre', 'luminaires', (select id from public.marchands where slug = 'studio-milano'), 'Paire d’appliques en laiton et verre', null, 'Italie, vers 1955', null, 680, 'publie', '{"categories":["Applique"],"matiere":["Laiton"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '15 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('lampadaire-tripode-en-teck-et-lin', 'luminaires', (select id from public.marchands where slug = 'studio-nord'), 'Lampadaire tripode en teck et lin', null, 'Danemark, années 50', null, 890, 'publie', '{"categories":["Lampadaire"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '16 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('plafonnier-en-rotin-tresse', 'luminaires', (select id from public.marchands where slug = 'atelier-verrier'), 'Plafonnier en rotin tressé', null, 'France, années 70', null, 340, 'publie', '{"categories":["Plafonnier"],"matiere":["Rotin"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '17 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('lampe-a-poser-en-ceramique-emaillee', 'luminaires', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Lampe à poser en céramique émaillée', null, 'Vallauris, vers 1960', null, 520, 'publie', '{"categories":["Lampe à poser"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '18 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('suspension-globe-en-verre-depoli', 'luminaires', (select id from public.marchands where slug = 'studio-milano'), 'Suspension globe en verre dépoli', null, 'Italie, vers 1965', null, 760, 'publie', '{"categories":["Suspension"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '19 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('lampe-de-bureau-articulee-en-acier-laque', 'luminaires', (select id from public.marchands where slug = 'studio-nord'), 'Lampe de bureau articulée en acier laqué', null, 'France, vers 1950', null, 450, 'publie', '{"categories":["Lampe à poser"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '20 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('service-en-faience-de-gien-24-pieces', 'arts-de-la-table', (select id from public.marchands where slug = 'maison-tessier'), 'Service en faïence de Gien, 24 pièces', null, 'France, vers 1920', null, 740, 'publie', '{"categories":["Assiette & service"],"matiere":["Faïence"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '21 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('six-verres-a-vin-en-cristal-taille', 'arts-de-la-table', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Six verres à vin en cristal taillé', null, 'Lorraine, vers 1930', null, 290, 'publie', '{"categories":["Verre & carafe"],"matiere":["Cristal"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '22 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('menagere-en-metal-argente-12-couverts', 'arts-de-la-table', (select id from public.marchands where slug = 'maison-tessier'), 'Ménagère en métal argenté, 12 couverts', null, 'France, vers 1950', null, 560, 'publie', '{"categories":["Ménagère","Argenterie"],"matiere":["Métal argenté"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '23 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('soupiere-en-porcelaine-a-filets-d-or', 'arts-de-la-table', (select id from public.marchands where slug = 'maison-tessier'), 'Soupière en porcelaine à filets d’or', null, 'Limoges, vers 1900', null, 380, 'publie', '{"categories":["Plat de service"],"matiere":["Porcelaine"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '24 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('carafe-a-whisky-et-son-plateau', 'arts-de-la-table', (select id from public.marchands where slug = 'atelier-verrier'), 'Carafe à whisky et son plateau', null, 'France, années 60', null, 210, 'publie', '{"categories":["Verre & carafe"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '25 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('theiere-en-argent-massif-poinconne', 'arts-de-la-table', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Théière en argent massif poinçonné', null, 'Paris, vers 1880', null, 1250, 'publie', '{"categories":["Théière & cafetière","Argenterie"],"matiere":["Argent massif"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '26 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('paire-de-plats-de-service-en-barbotine', 'arts-de-la-table', (select id from public.marchands where slug = 'maison-tessier'), 'Paire de plats de service en barbotine', null, 'France, vers 1890', null, 320, 'publie', '{"categories":["Plat de service"],"matiere":["Faïence"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '27 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('douze-assiettes-plates-en-faience-fine', 'arts-de-la-table', (select id from public.marchands where slug = 'maison-tessier'), 'Douze assiettes plates en faïence fine', null, 'France, vers 1940', null, 260, 'publie', '{"categories":["Assiette & service"],"matiere":["Faïence"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '28 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('vue-de-port-breton-huile-sur-toile', 'galerie', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Vue de port breton, huile sur toile', null, 'France, vers 1910', null, 1450, 'publie', '{"categories":["Huile sur toile"],"sujet":["Marine"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '29 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('paysage-de-provence-huile-sur-toile', 'galerie', (select id from public.marchands where slug = 'galerie-bertheau'), 'Paysage de Provence, huile sur toile', null, 'France, vers 1930', null, 1800, 'publie', '{"categories":["Huile sur toile"],"sujet":["Paysage"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '30 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('marine-au-crepuscule-huile-sur-panneau', 'galerie', (select id from public.marchands where slug = 'maison-delaunay'), 'Marine au crépuscule, huile sur panneau', null, 'France, XIXe siècle', null, 980, 'publie', '{"categories":["Huile sur toile"],"sujet":["Marine"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '31 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('bouquet-de-fleurs-des-champs-gouache', 'galerie', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Bouquet de fleurs des champs, gouache', null, 'France, vers 1940', null, 420, 'publie', '{"categories":["Aquarelle & dessin"],"sujet":["Nature morte"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '32 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('nature-morte-aux-pivoines-aquarelle', 'galerie', (select id from public.marchands where slug = 'galerie-bertheau'), 'Nature morte aux pivoines, aquarelle', null, 'France, vers 1950', null, 540, 'publie', '{"categories":["Aquarelle & dessin"],"sujet":["Nature morte"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '33 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('scene-de-marche-huile-sur-toile', 'galerie', (select id from public.marchands where slug = 'maison-delaunay'), 'Scène de marché, huile sur toile', null, 'France, vers 1890', null, 2600, 'publie', '{"categories":["Huile sur toile"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '34 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('suite-de-quatre-gravures-botaniques', 'galerie', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Suite de quatre gravures botaniques', null, 'Angleterre, vers 1850', null, 360, 'publie', '{"categories":["Gravure & estampe"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '35 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('portrait-de-femme-au-chignon-fusain', 'galerie', (select id from public.marchands where slug = 'galerie-bertheau'), 'Portrait de femme au chignon, fusain', null, 'France, vers 1925', null, 480, 'publie', '{"categories":["Aquarelle & dessin"],"sujet":["Portrait"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '36 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('commode-estampillee-p-roussel', 'createurs', (select id from public.marchands where slug = 'galerie-bertheau'), 'Commode estampillée P. Roussel', null, 'Paris, vers 1760', null, 4800, 'publie', '{"createurs":["Pierre Roussel"],"discipline":["Ébénisterie"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '37 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('vase-souffle-signe-galle-decor-floral', 'createurs', (select id from public.marchands where slug = 'atelier-verrier'), 'Vase soufflé signé Gallé, décor floral', null, 'Nancy, vers 1900', null, 2900, 'publie', '{"createurs":["Émile Gallé"],"discipline":["Verrerie"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '38 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('paire-de-vases-en-ceramique-atelier-madoura', 'createurs', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Paire de vases en céramique, atelier Madoura', null, 'Vallauris, vers 1955', null, 1650, 'publie', '{"createurs":["Suzanne Ramié"],"discipline":["Céramique"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '39 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('chaise-standard-en-tole-pliee-et-bois', 'createurs', (select id from public.marchands where slug = 'studio-nord'), 'Chaise Standard en tôle pliée et bois', null, 'France, vers 1950', null, 1380, 'publie', '{"createurs":["Jean Prouvé"],"discipline":["Mobilier design"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '40 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('bibliotheque-en-chene-et-aluminium-laque', 'createurs', (select id from public.marchands where slug = 'studio-nord'), 'Bibliothèque en chêne et aluminium laqué', null, 'France, vers 1953', null, 6400, 'publie', '{"discipline":["Mobilier design"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '41 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('lampe-a-deux-bras-en-tole-laquee-noire', 'createurs', (select id from public.marchands where slug = 'studio-milano'), 'Lampe à deux bras en tôle laquée noire', null, 'France, vers 1954', null, 3200, 'publie', '{"discipline":["Luminaire d’auteur"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '42 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('table-basse-a-plateau-de-ceramique-signee', 'createurs', (select id from public.marchands where slug = 'studio-milano'), 'Table basse à plateau de céramique signée', null, 'Italie, vers 1958', null, 2750, 'publie', '{"discipline":["Mobilier design"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '43 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('coupe-en-verre-irise-signature-a-la-pointe', 'createurs', (select id from public.marchands where slug = 'atelier-verrier'), 'Coupe en verre irisé, signature à la pointe', null, 'France, vers 1910', null, 890, 'publie', '{"discipline":["Verrerie"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '44 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('globe-terrestre-sur-pietement-d-acajou', 'curiosites', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Globe terrestre sur piètement d’acajou', null, 'France, vers 1890', null, 1900, 'publie', '{"categories":["Instrument scientifique"],"matiere":["Bois"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '45 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('sextant-de-marine-dans-son-coffret', 'curiosites', (select id from public.marchands where slug = 'studio-nord'), 'Sextant de marine dans son coffret', null, 'Angleterre, vers 1900', null, 860, 'publie', '{"categories":["Marine","Instrument scientifique"],"matiere":["Laiton"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '46 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('buste-en-bronze-a-patine-brune', 'curiosites', (select id from public.marchands where slug = 'maison-delaunay'), 'Buste en bronze à patine brune', null, 'France, vers 1870', null, 1480, 'publie', '{"categories":["Sculpture"],"matiere":["Bronze"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '47 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('cartel-d-applique-en-bronze-dore', 'curiosites', (select id from public.marchands where slug = 'galerie-bertheau'), 'Cartel d’applique en bronze doré', null, 'Paris, vers 1770', null, 1800, 'publie', '{"categories":["Horlogerie"],"matiere":["Bronze"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '48 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('etabli-de-horloger-et-ses-tiroirs', 'curiosites', (select id from public.marchands where slug = 'studio-nord'), 'Établi de horloger et ses tiroirs', null, 'France, vers 1910', null, 990, 'publie', '{"categories":["Objet d’atelier","Horlogerie"],"matiere":["Bois"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '49 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('maquette-de-coque-de-voilier', 'curiosites', (select id from public.marchands where slug = 'studio-nord'), 'Maquette de coque de voilier', null, 'France, vers 1940', null, 620, 'publie', '{"categories":["Marine"],"matiere":["Bois"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '50 hours')
  on conflict (slug) do nothing;
insert into public.objets (slug, univers_slug, marchand_id, nom, nom_court, origine, signature, prix, statut, attributs, photos, histoire, dimensions, etat, livraison, publie_le) values
  ('microscope-de-laboratoire-en-laiton', 'curiosites', (select id from public.marchands where slug = 'galerie-sainte-anne'), 'Microscope de laboratoire en laiton', null, 'Allemagne, vers 1895', null, 740, 'publie', '{"categories":["Instrument scientifique"],"matiere":["Laiton"]}'::jsonb, '[]'::jsonb, null, null, null, null, now() - interval '51 hours')
  on conflict (slug) do nothing;
