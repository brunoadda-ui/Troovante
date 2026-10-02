# TROOVANTE — le site

Place de marché d'antiquités et d'objets anciens. Ce dossier contient le code du site.

## Voir le site sur cet ordinateur

Dans un terminal ouvert dans ce dossier :

```bash
npm run dev
```

Puis ouvrir <http://localhost:3000> dans un navigateur. Le site se met à jour tout seul à chaque modification du code. `Ctrl + C` dans le terminal l'arrête.

## Où en est le projet

| Étape | Contenu | État |
|---|---|---|
| 1 | Les 4 écrans de la maquette reconstruits à l'identique, avec une version mobile | Fait |
| 2 | Catalogue vivant : base de données, recherche, filtres, tri, favoris, demandes d'achat et de rappel | Fait, base à brancher (voir ci-dessous) |
| 3 | Espace marchand : connexion, ajout d'objets avec photos, validation par TROOVANTE | À faire |
| 4 | Mise en ligne : nom de domaine, mentions légales, confidentialité, cookies | À faire |

Le paiement en ligne et la commission viendront après, une fois le concept validé.

## Brancher la base de données (Supabase)

Tant que ce n'est pas fait, le site affiche le catalogue de démonstration de `src/data/demo.ts` et les formulaires répondent que la demande n'a pas été enregistrée.

1. Dans Supabase, créer un projet (région en Europe).
2. Ouvrir **SQL Editor**, coller tout le contenu de `supabase/installation.sql`, cliquer **Run**. Cela crée les tables et y met le catalogue de démonstration.
3. Copier `.env.example` en `.env.local` et y coller l'adresse du projet et sa clé **publishable** (jamais la clé « secret »).
4. Relancer `npm run dev`.

Ensuite, le catalogue se modifie dans Supabase (**Table Editor**) :

| Table | Contenu |
|---|---|
| `univers` | Les univers, leurs filtres et leurs tuiles |
| `marchands` | Les marchands (informations publiques) |
| `objets` | Les objets. Seuls ceux dont le `statut` vaut `publie` apparaissent sur le site |
| `demandes` | Les demandes d'achat, questions et demandes de rappel laissées par les visiteurs |

## Ce qui est encore factice

- **Tout le contenu** (objets, prix, marchands, téléphone, WhatsApp, e-mail) vient de la maquette et est fictif.
- **Seule la commode Louis XV a des photos et un texte complet** ; les autres fiches affichent « Photo à venir ».
- **Les demandes arrivent dans la table `demandes`**, sans e-mail d'alerte pour l'instant.
- **« Nos experts », « Aide », « Se connecter »** et la plupart des liens du pied de page n'ont pas encore de page.
- **Le site demande aux moteurs de recherche de ne pas le référencer** (réglage dans `src/app/layout.tsx`), à retirer au lancement.

## Organisation du code

| Dossier | Rôle |
|---|---|
| `src/app/` | Les pages : accueil, `univers/[slug]`, `objets/[slug]`, `recherche`, `favoris`, `vendre` |
| `src/app/actions.ts` | L'enregistrement des demandes des visiteurs |
| `src/app/globals.css` | Le design system : couleurs, polices, espacements |
| `src/components/` | Les briques réutilisées : en-tête, pied de page, carte objet, boutons… |
| `src/lib/` | La lecture du catalogue, les filtres, le tri, la recherche, les favoris |
| `src/data/` | Le catalogue de démonstration et les coordonnées du site |
| `supabase/` | La structure de la base (`schema.sql`) et le fichier à coller dans Supabase (`installation.sql`) |
| `public/images/` | Logo, visuel d'accueil et photos |
| `Troovante/` | L'export d'origine de Claude Design, gardé comme référence visuelle |

## Commandes utiles

```bash
npm run build
```

Vérifie que le site complet se construit sans erreur (à lancer avant une mise en ligne).

```bash
npm run lint
```

Contrôle la qualité du code.

```bash
npm run sql
```

Régénère `supabase/installation.sql` après une modification de `supabase/schema.sql` ou de `src/data/demo.ts`.
