import type { ReglagesAccueil, StyleTexte } from "./types";

/**
 * Les réglages d'origine : l'accueil tel qu'il a été conçu. C'est ce que
 * rétablit le bouton « Réglages d'origine » de chaque rubrique, et ce qui
 * s'applique à tout réglage absent du fichier.
 */

const blanc = "#ffffff";

const styleSurtitre: StyleTexte = {
  police: "jost",
  taille: 14,
  graisse: 400,
  italique: false,
  souligne: false,
  capitales: true,
  espacement: 20,
  couleur: blanc,
};

export const REGLAGES_ORIGINE: ReglagesAccueil = {
  visuel: {
    photos: [
      {
        src: "/images/accueil-interieur.webp",
        alt: "Grand séjour aux boiseries baigné de soleil, ouvert sur un jardin",
        largeur: 1672,
        hauteur: 940,
        cadrageX: 42,
        cadrageY: 50,
      },
    ],
    diaporama: { actif: false, duree: 6, transition: "fondu", points: true, fleches: false, pauseSurvol: true },
    hauteur: "plein-ecran",
    voile: 62,
    position: "gauche",
  },
  textes: {
    surtitre: { afficher: true, texte: "Antiquités • Design • Créateurs", style: styleSurtitre },
    titre: {
      afficher: true,
      texte: "Chaque objet raconte,\nvotre univers se redessine",
      style: { ...styleSurtitre, police: "cormorant", taille: 50, graisse: 500, capitales: false, espacement: 0 },
      interligne: 110,
      largeur: 32,
      ombre: 0,
    },
    bouton: {
      afficher: true,
      texte: "Découvrir la sélection",
      lien: "#nouvelles-trouvailles",
      forme: "contour",
      style: { ...styleSurtitre, taille: 16, capitales: false, espacement: 0 },
    },
  },
  apparence: {
    policeTitres: "cormorant",
    tailleTitres: 28,
    policeTexte: "inter",
    tailleTexte: 16,
    couleurAccent: "#8a5a3b",
    couleurTexte: "#111111",
    couleurFond: "#ffffff",
  },
  sections: {
    ordre: ["engagements", "univers", "nouveautes", "styles", "marchands"],
    masquees: [],
    engagements: [
      { titre: "Vérifié par nos experts", texte: "Époque, matériaux et état contrôlés avant mise en ligne." },
      { titre: "Exclusif à TROOVANTE", texte: "Un seul exemplaire, vendu ici et nulle part ailleurs." },
      {
        titre: "Expédié par le marchand",
        texte: "Emballé et envoyé par le professionnel. Frais de livraison en sus, retour 14 jours.",
      },
    ],
    univers: { titre: "Parcourir par univers" },
    nouveautes: { titre: "Nouvelles trouvailles", nombre: 8, mentionSemaine: true },
    styles: {
      titre: "Deux façons d’habiter une pièce",
      elements: [
        { titre: "Art déco", texte: "Laque, palissandre et lignes tendues — 68 objets", lien: "/univers/mobilier" },
        { titre: "Campagne française", texte: "Noyer, chêne ciré et faïence — 91 objets", lien: "/univers/mobilier" },
      ],
    },
    marchands: {
      surtitre: "Nos marchands",
      titre: "Des professionnels choisis un par un",
      texte:
        "Antiquaires, galeristes et brocanteurs installés depuis des années. Nous visitons chaque marchand, nous validons chaque provenance, et nous n’acceptons que des objets qu’ils nous confient en exclusivité.",
      chiffres: true,
    },
  },
  barre: {
    transparente: true,
    liens: [
      { cle: "mobilier", afficher: true, libelle: "MOBILIER" },
      { cle: "luminaires", afficher: true, libelle: "LUMINAIRES" },
      { cle: "arts-de-la-table", afficher: true, libelle: "ARTS DE LA TABLE" },
      { cle: "galerie", afficher: true, libelle: "GALERIE" },
      { cle: "createurs", afficher: true, libelle: "CREATEURS" },
      { cle: "curiosites", afficher: true, libelle: "CURIOSITES" },
      { cle: "espace-professionnel", afficher: true, libelle: "ESPACE PRO" },
    ],
    nom: { police: "jost", taille: 29, graisse: 500, espacement: 21, decalage: 100 },
    liensStyle: { police: "jost", taille: 17, graisse: 400 },
  },
};
