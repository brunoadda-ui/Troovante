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
| 2 | Catalogue vivant : base de données, recherche, filtres, tri, favoris, demande d'achat et rappel par e-mail | À faire |
| 3 | Espace marchand : connexion, ajout d'objets avec photos, validation par TROOVANTE | À faire |
| 4 | Mise en ligne : nom de domaine, mentions légales, confidentialité, cookies | À faire |

Le paiement en ligne et la commission viendront après, une fois le concept validé.

## Ce qui est encore factice

- **Tout le contenu** (objets, prix, marchands, chiffres, téléphone, WhatsApp, e-mail) vient de la maquette et est fictif. Il est regroupé dans `src/data/` pour être remplacé d'un coup.
- **Toutes les cartes objet mènent à la même fiche** (la commode Louis XV), seule fiche détaillée de la maquette.
- **Recherche, filtres, tri, favoris, panier, « Acheter », « Poser une question » et « On vous rappelle »** sont affichés mais pas encore branchés.
- **Le site demande aux moteurs de recherche de ne pas le référencer** (réglage dans `src/app/layout.tsx`), à retirer au lancement.

## Organisation du code

| Dossier | Rôle |
|---|---|
| `src/app/` | Les pages : accueil, `univers/[slug]`, `objets/[slug]`, `vendre` |
| `src/app/globals.css` | Le design system : couleurs, polices, espacements |
| `src/components/` | Les briques réutilisées : en-tête, pied de page, carte objet, boutons… |
| `src/data/` | Le contenu de démonstration (catalogue et coordonnées) |
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
