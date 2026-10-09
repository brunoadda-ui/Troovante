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
| 3A | Espace professionnel : page d'information et formulaire de dépôt d'objet (photos, dimensions, prix…) | Fait, à tester sur la base |
| 3B | Page privée où TROOVANTE valide, corrige et publie chaque dépôt | À faire |
| 3C | Mise en situation automatique des photos par IA (service Bria), objet conservé intact | À faire |
| 4 | Mise en ligne : nom de domaine, mentions légales, confidentialité, cookies | À faire |

Le paiement en ligne viendra après, une fois le concept validé.

Conditions annoncées aux professionnels : commission de 5 % à la vente, exclusivité tant que l'objet est en ligne, expédition par le professionnel.

## Brancher la base de données (Supabase)

Tant que ce n'est pas fait, le site affiche le catalogue de démonstration de `src/data/demo.ts` et les formulaires répondent que rien n'a été enregistré.

1. Dans Supabase, créer un projet (région en Europe).
2. Ouvrir **SQL Editor**, coller tout le contenu de `supabase/installation.sql`, cliquer **Run**. Cela crée les tables, les espaces de stockage des photos, et y met le catalogue de démonstration. Ce fichier peut être relancé sans risque : il est à relancer chaque fois qu'il change.
3. Copier `.env.example` en `.env.local` et y coller l'adresse du projet, sa clé **publishable** et sa clé **secret**. La clé secrète donne tous les droits sur la base : elle ne doit figurer nulle part ailleurs.
4. Relancer `npm run dev`.

Ensuite, le contenu se consulte et se modifie dans Supabase (**Table Editor**) :

| Table | Contenu |
|---|---|
| `univers` | Les univers, leurs filtres et leurs tuiles |
| `marchands` | Les marchands (informations publiques) |
| `objets` | Les objets. Seuls ceux dont le `statut` vaut `publie` apparaissent sur le site |
| `demandes` | Les demandes d'achat, questions et demandes de rappel laissées par les visiteurs |
| `depots` | Les objets déposés par les professionnels, avec leurs coordonnées. Table privée |

Les photos reçues des professionnels sont dans **Storage**, espace privé `depots`, un dossier par dépôt.

## Ce qui est encore factice

- **Tout le contenu** (objets, prix, marchands, téléphone, WhatsApp, e-mail) vient de la maquette et est fictif.
- **Seule la commode Louis XV a des photos et un texte complet** ; les autres fiches affichent « Photo à venir ».
- **Les demandes et les dépôts arrivent dans les tables `demandes` et `depots`**, sans e-mail d'alerte pour l'instant.
- **Un dépôt n'est pas encore publiable depuis le site** : la page privée de validation reste à faire.
- **La plupart des liens du pied de page** n'ont pas encore de page.
- **Les promesses de livraison faites aux acheteurs** (transporteur spécialisé, livraison incluse, retour à notre charge) datent de la maquette et ne correspondent plus à l'expédition par le professionnel.
- **Le site demande aux moteurs de recherche de ne pas le référencer** (réglage dans `src/app/layout.tsx`), à retirer au lancement.

## Organisation du code

| Dossier | Rôle |
|---|---|
| `src/app/` | Les pages : accueil, `univers/[slug]`, `objets/[slug]`, `recherche`, `favoris`, `vendre`, `espace-professionnel` |
| `src/app/actions.ts` | L'enregistrement des demandes des visiteurs |
| `src/app/espace-professionnel/actions.ts` | L'enregistrement des objets déposés par les professionnels |
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
