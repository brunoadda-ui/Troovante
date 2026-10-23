/**
 * Réglages de la page d'accueil, modifiables depuis l'espace privé
 * (/admin/reglages). Ils sont gardés dans le fichier reglages/accueil.json,
 * sur l'ordinateur où tourne le site.
 *
 * Ce fichier ne contient que des types et des listes : il est partagé par le
 * serveur et par le formulaire de réglages dans le navigateur.
 */

// ---------------------------------------------------------------------------
// Listes de choix
// ---------------------------------------------------------------------------

/** Polices proposées dans les réglages (chargées dans src/lib/polices.ts). */
export const POLICES = [
  { cle: "cormorant", label: "Cormorant Garamond", genre: "Empattements" },
  { cle: "playfair", label: "Playfair Display", genre: "Empattements" },
  { cle: "ebgaramond", label: "EB Garamond", genre: "Empattements" },
  { cle: "lora", label: "Lora", genre: "Empattements" },
  { cle: "bodoni", label: "Bodoni Moda", genre: "Empattements" },
  { cle: "fraunces", label: "Fraunces", genre: "Empattements" },
  { cle: "dmserif", label: "DM Serif Display", genre: "Empattements" },
  { cle: "inter", label: "Inter", genre: "Sans empattements" },
  { cle: "jost", label: "Jost", genre: "Sans empattements" },
  { cle: "montserrat", label: "Montserrat", genre: "Sans empattements" },
  { cle: "raleway", label: "Raleway", genre: "Sans empattements" },
  { cle: "josefin", label: "Josefin Sans", genre: "Sans empattements" },
  { cle: "worksans", label: "Work Sans", genre: "Sans empattements" },
  { cle: "manrope", label: "Manrope", genre: "Sans empattements" },
] as const;

export type ClePolice = (typeof POLICES)[number]["cle"];

/** Nom de la variable CSS qui porte une police de la liste (déclarée dans src/lib/polices.ts). */
export function variablePolice(cle: ClePolice): string {
  if (cle === "cormorant") return "--font-cormorant";
  if (cle === "jost") return "--font-jost";
  if (cle === "inter") return "--font-inter";
  return `--police-${cle}`;
}

export const GRAISSES = [
  { valeur: 300, label: "Fin" },
  { valeur: 400, label: "Normal" },
  { valeur: 500, label: "Moyen" },
  { valeur: 600, label: "Semi-gras" },
  { valeur: 700, label: "Gras" },
] as const;

export type Graisse = (typeof GRAISSES)[number]["valeur"];

export const TRANSITIONS = [
  { valeur: "fondu", label: "Fondu enchaîné" },
  { valeur: "glissement", label: "Glissement" },
  { valeur: "zoom", label: "Zoom lent (Ken Burns)" },
] as const;

export const HAUTEURS = [
  { valeur: "plein-ecran", label: "Plein écran" },
  { valeur: "grand", label: "Grand (80 % de l’écran)" },
  { valeur: "proportions", label: "Proportions de la photo" },
] as const;

export const POSITIONS = [
  { valeur: "gauche", label: "À gauche" },
  { valeur: "centre", label: "Au centre" },
  { valeur: "bas", label: "En bas à gauche" },
] as const;

export const FORMES_BOUTON = [
  { valeur: "contour", label: "Contour" },
  { valeur: "plein", label: "Plein" },
] as const;

export const SECTIONS = [
  { cle: "engagements", label: "Les trois engagements" },
  { cle: "univers", label: "Parcourir par univers" },
  { cle: "nouveautes", label: "Nouvelles trouvailles" },
  { cle: "styles", label: "Deux façons d’habiter une pièce" },
  { cle: "marchands", label: "Nos marchands" },
] as const;

export type CleSection = (typeof SECTIONS)[number]["cle"];

/** Lien « Espace professionnel » de la barre ; les autres liens sont les univers, repérés par leur slug. */
export const LIEN_ESPACE_PRO = "espace-professionnel";

// ---------------------------------------------------------------------------
// Les réglages
// ---------------------------------------------------------------------------

export type StyleTexte = {
  police: ClePolice;
  /** Taille sur ordinateur, en pixels ; elle se réduit d'elle-même sur téléphone. */
  taille: number;
  graisse: Graisse;
  italique: boolean;
  souligne: boolean;
  capitales: boolean;
  /** Espace entre les lettres, en centièmes de la taille (20 = 0,2 em). */
  espacement: number;
  /** Couleur au format #rrggbb. */
  couleur: string;
};

export type PhotoAccueil = {
  src: string;
  alt: string;
  largeur: number;
  hauteur: number;
  /** Point à garder visible quand la photo est recadrée, en % de la largeur et de la hauteur. */
  cadrageX: number;
  cadrageY: number;
};

export type ReglagesVisuel = {
  photos: PhotoAccueil[];
  diaporama: {
    actif: boolean;
    /** Secondes par photo. */
    duree: number;
    transition: (typeof TRANSITIONS)[number]["valeur"];
    points: boolean;
    fleches: boolean;
    pauseSurvol: boolean;
  };
  hauteur: (typeof HAUTEURS)[number]["valeur"];
  /** Intensité du voile sombre, de 0 à 90. */
  voile: number;
  position: (typeof POSITIONS)[number]["valeur"];
};

export type TexteRegle = { afficher: boolean; texte: string; style: StyleTexte };

/** Le slogan posé sur la photo (« Chaque objet raconte… »), avec ses réglages propres. */
export type SloganRegle = TexteRegle & {
  /** Hauteur de ligne, en centièmes de la taille (110 = 1,1). */
  interligne: number;
  /** Nombre de caractères par ligne au maximum, avant un retour à la ligne automatique. */
  largeur: number;
  /** Intensité de l'ombre portée derrière les lettres, de 0 (aucune) à 100. */
  ombre: number;
};

export type ReglagesTextes = {
  surtitre: TexteRegle;
  /** Le slogan. Un retour à la ligne dans son texte devient un retour à la ligne à l'écran. */
  titre: SloganRegle;
  bouton: TexteRegle & { lien: string; forme: (typeof FORMES_BOUTON)[number]["valeur"] };
};

export type ReglagesApparence = {
  policeTitres: ClePolice;
  tailleTitres: number;
  policeTexte: ClePolice;
  tailleTexte: number;
  couleurAccent: string;
  couleurTexte: string;
  couleurFond: string;
};

export type ReglagesSections = {
  ordre: CleSection[];
  masquees: CleSection[];
  engagements: { titre: string; texte: string }[];
  univers: { titre: string };
  nouveautes: { titre: string; nombre: number; mentionSemaine: boolean };
  styles: {
    titre: string;
    elements: { titre: string; texte: string; lien: string; photo?: string }[];
  };
  marchands: { surtitre: string; titre: string; texte: string; chiffres: boolean; photo?: string };
};

export type ReglagesBarre = {
  /** Sur l'accueil, la barre est posée sur la photo, en blanc, jusqu'au premier défilement. */
  transparente: boolean;
  /** Liens de la barre, dans l'ordre d'affichage : slugs d'univers et « espace-professionnel ». */
  /** « libelle » : titre affiché à la place du nom d'origine (vide ou absent : nom d'origine). */
  liens: { cle: string; afficher: boolean; libelle?: string }[];
  /** « decalage » : retrait du nom depuis le bord gauche de l'écran, en pixels, en plus de la marge de page. */
  nom: { police: ClePolice; taille: number; graisse: Graisse; espacement: number; decalage: number };
  liensStyle: { police: ClePolice; taille: number; graisse: Graisse };
};

export type ReglagesAccueil = {
  visuel: ReglagesVisuel;
  textes: ReglagesTextes;
  apparence: ReglagesApparence;
  sections: ReglagesSections;
  barre: ReglagesBarre;
};

export type RubriqueReglages = keyof ReglagesAccueil;
