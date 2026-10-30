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
| 3B | Page privée `/admin` où TROOVANTE valide, corrige et publie chaque dépôt | Fait, publication à tester une fois connecté |
| 3C | Mise en situation automatique des photos par IA (service Photoroom), objet conservé | Fait, essayé sur de vraies photos |
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

Les photos reçues des professionnels sont dans **Storage**, espace privé `depots`, un dossier par dépôt. Les images des objets publiés sont dans l'espace public `photos`.

## L'espace privé (`/admin`)

C'est là que se traitent les objets déposés : liste des dépôts, fiche préremplie à corriger, choix des photos, puis **Publier** ou **Refuser**. Publier crée l'objet dans `objets` et le met aussitôt en ligne.

Tant qu'un dépôt est à traiter, on peut y ajouter des photos (5 au maximum), en supprimer définitivement, retirer une mise en situation et choisir la photo principale, celle qui sert à la mise en situation. Une fois l'objet publié, ses photos ne se modifient plus ici.

Pour y entrer, il faut :

1. un compte dans Supabase : **Authentication → Users → Add user**, en cochant « Auto Confirm User » ;
2. que l'adresse de ce compte figure dans `ADMIN_EMAILS` (fichier `.env.local`, adresses séparées par des virgules).

Par précaution, désactiver les inscriptions libres dans Supabase (**Authentication → Sign In / Providers → Allow new users to sign up**).

Pour corriger une fiche déjà publiée ou la retirer du site, modifier sa ligne dans la table `objets` (statut `vendu` pour la retirer).

## La mise en situation par IA (Photoroom)

La mise en situation est facultative : le formulaire de dépôt propose une case, décochée par défaut. Si le professionnel la coche, la photo principale est envoyée au service Photoroom, qui détoure l'objet et génère une pièce autour. Sinon, TROOVANTE peut toujours la lancer à la main depuis la page du dépôt. L'objet n'est pas redessiné : seules sa lumière et sa netteté sont ajustées. L'image arrive dans la page du dépôt, où l'on peut en générer d'autres avec un autre décor, puis choisir celles à publier. Sur la fiche publique, elle porte l'étiquette « Mise en situation » et la photo d'origine reste visible.

- **Activation** : coller la clé du compte Photoroom dans `.env.local`, ligne `PHOTOROOM_API_KEY`, et dans les réglages de Vercel pour le site en ligne. Sans clé, tout fonctionne mais sans mise en situation.
- **Coût** : chaque image générée est facturée 0,10 $. Au-delà de 40 dépôts reçus dans la journée, la génération automatique s'arrête d'elle-même ; elle reste possible à la main depuis la page du dépôt.
- **Essais gratuits** : préfixer la clé par `sandbox_` donne 1 000 images gratuites par mois (100 par jour), avec un filigrane.
- **Décors** : neuf pièces sont décrites dans `src/lib/miseEnSituation.ts`, avec un décor proposé selon la sous-catégorie ou l'univers. Elles ne doivent jamais nommer l'objet, et la réécriture automatique du texte reste désactivée : sinon le service invente des objets dans la pièce.
- **Taille de l'objet** : elle est calculée d'après ses dimensions réelles, dans les limites de chaque type de présentation.
- **Limite** : l'image finale fait 1600 × 2000 pixels, mais la netteté de l'objet dépend de la photo reçue. Les photos de moins d'un million de pixels sont agrandies automatiquement.
- **Contrôle** : l'objet reste vu sous l'angle de la photo d'origine, et une image peut contenir un élément indésirable. Chaque image se vérifie donc avant publication.

## Ce qui est encore factice

- **Tout le contenu** (objets, prix, marchands, téléphone, WhatsApp, e-mail) vient de la maquette et est fictif.
- **Seule la commode Louis XV a des photos et un texte complet** ; les autres fiches affichent « Photo à venir ».
- **Les demandes et les dépôts arrivent dans les tables `demandes` et `depots`**, sans e-mail d'alerte pour l'instant.
- **La plupart des liens du pied de page** n'ont pas encore de page.
- **Les promesses de livraison faites aux acheteurs** (transporteur spécialisé, livraison incluse, retour à notre charge) datent de la maquette et ne correspondent plus à l'expédition par le professionnel.
- **Le site demande aux moteurs de recherche de ne pas le référencer** (réglage dans `src/app/layout.tsx`), à retirer au lancement.

## Organisation du code

| Dossier | Rôle |
|---|---|
| `src/app/` | Les pages : accueil, `univers/[slug]`, `objets/[slug]`, `recherche`, `favoris`, `vendre`, `espace-professionnel` |
| `src/app/actions.ts` | L'enregistrement des demandes des visiteurs |
| `src/app/espace-professionnel/actions.ts` | L'enregistrement des objets déposés par les professionnels |
| `src/app/admin/` | L'espace privé : connexion, liste des dépôts, publication |
| `src/proxy.ts` | Le maintien de la connexion à l'espace privé |
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
