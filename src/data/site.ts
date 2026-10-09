/**
 * Coordonnées et textes communs à tout le site.
 * ATTENTION : valeurs fictives reprises de la maquette, à remplacer avant mise en ligne.
 */
export const site = {
  nom: "TROOVANTE",
  signature: "Chaque objet raconte, votre univers se redessine",
  telephone: "01 84 80 12 34",
  whatsapp: "06 12 34 56 78",
  email: "bonjour@troovante.fr",
  horaires: "Du lundi au samedi, 9h – 19h. Une vraie personne répond.",
  /** Affiché sur la fiche d'un objet qui n'a pas ses propres conditions de livraison. */
  livraisonParDefaut:
    "L’objet est emballé et expédié par le marchand. Les frais de livraison ne sont pas inclus dans le prix : ils vous sont indiqués avant l’achat. Retour accepté 14 jours après réception.",
};

/** « 01 84 80 12 34 » → « tel:+33184801234 » */
export function lienTelephone(numero: string): string {
  return `tel:+33${numero.replace(/\D/g, "").replace(/^0/, "")}`;
}

/** « 06 12 34 56 78 » → « https://wa.me/33612345678 » */
export function lienWhatsapp(numero: string): string {
  return `https://wa.me/33${numero.replace(/\D/g, "").replace(/^0/, "")}`;
}

export type LienPied = { label: string; href?: string };

export const piedDePage: { label: string; liens: LienPied[] }[] = [
  {
    label: "Acheter",
    liens: [
      { label: "Tous les objets" },
      { label: "Nouveautés" },
      { label: "Univers déco" },
      { label: "Nos marchands" },
      { label: "Guide d’achat" },
    ],
  },
  {
    label: "Vendre",
    liens: [
      { label: "Vendre un objet", href: "/vendre" },
      { label: "Nous appeler", href: "/vendre" },
      { label: "Estimation gratuite", href: "/vendre" },
      { label: "Devenir marchand partenaire", href: "/espace-professionnel" },
    ],
  },
  {
    label: "Aide",
    liens: [
      { label: "Nous contacter" },
      { label: "Livraison" },
      { label: "Retours" },
      { label: "Paiement en 3 fois" },
      { label: "Questions fréquentes" },
    ],
  },
  {
    label: "TROOVANTE",
    liens: [
      { label: "Notre sélection" },
      { label: "Nos experts" },
      { label: "Journal" },
      { label: "Recrutement" },
    ],
  },
];

export const mentionsLegales: LienPied[] = [
  { label: "Conditions de vente" },
  { label: "Conditions d’utilisation" },
  { label: "Confidentialité" },
  { label: "Cookies" },
];
