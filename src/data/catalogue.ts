/**
 * Catalogue de démonstration, repris tel quel de la maquette.
 * Tout est fictif (objets, marchands, chiffres). À l'étape 2, ce fichier
 * sera remplacé par la base de données : seules les fonctions `get…`
 * en bas de fichier sont utilisées par les pages.
 */

export type GroupeFiltres = { label: string; options: string[] };

export type Tuile = { label: string; image?: string };

export type ObjetListe = {
  nom: string;
  origine: string;
  marchand: string;
  prix: number;
  image?: string;
};

export type Univers = {
  slug: string;
  /** Libellé court, utilisé dans la navigation. */
  nom: string;
  titre: string;
  accroche: string;
  intro: string;
  nombreObjets: number;
  /** Photo d'ambiance affichée dans le menu. */
  image: string;
  tuiles: Tuile[];
  filtres: GroupeFiltres[];
  objets: ObjetListe[];
};

export type Nouveaute = {
  nom: string;
  meta: string;
  prix: number;
  /** Légende affichée tant qu'il n'y a pas de photo. */
  legende: string;
  image?: string;
};

export type PhotoObjet = { src?: string; alt: string; legende: string };

export type ObjetDetail = {
  slug: string;
  nom: string;
  nomCourt: string;
  filAriane: string[];
  provenance: string;
  prix: number;
  photoPrincipale: PhotoObjet;
  photosDetail: PhotoObjet[];
  exclusivite: { titre: string; texte: string };
  garanties: { icone: "authenticite" | "paiement" | "livraison"; texte: string }[];
  rubriques: { titre: string; paragraphes: string[] }[];
  duMemeMarchand: { nom: string; meta: string; prix: number; legende: string }[];
};

const univers: Univers[] = [
  {
    slug: "mobilier",
    nom: "Mobilier",
    titre: "Mobilier ancien",
    accroche: "Des meubles qui ont déjà une vie",
    intro:
      "Commodes estampillées, buffets de campagne, bergères et guéridons : du XVIIIe siècle aux éditions des années 60. Chaque meuble a été vu, daté et vérifié chez le marchand avant d’arriver ici.",
    nombreObjets: 1284,
    image: "/images/univers/mobilier.webp",
    tuiles: [
      { label: "Commode", image: "/images/objets/commode-louis-xv-1.webp" },
      { label: "Fauteuil" },
      { label: "Table" },
      { label: "Miroirs" },
    ],
    filtres: [
      {
        label: "Catégories",
        options: [
          "Commode",
          "Buffet & enfilade",
          "Table & guéridon",
          "Fauteuil & bergère",
          "Chaise",
          "Bibliothèque",
          "Secrétaire",
          "Miroirs",
        ],
      },
      { label: "Époque", options: ["XVIIIe siècle", "XIXe siècle", "Art déco", "1950–1970"] },
    ],
    objets: [
      { nom: "Commode Louis XV en placage de bois de rose", origine: "France, vers 1760", marchand: "Galerie Bertheau", prix: 4800 },
      { nom: "Paire de fauteuils cabriolet en noyer", origine: "France, XIXe siècle", marchand: "Atelier Marsan", prix: 2200 },
      { nom: "Buffet en bois de rose marqueté d’attributs", origine: "France, vers 1780", marchand: "Galerie Bertheau", prix: 3400 },
      { nom: "Guéridon tripode en acajou et laiton", origine: "France, vers 1830", marchand: "Maison Delaunay", prix: 1150 },
      { nom: "Enfilade en chêne cérusé, quatre portes", origine: "France, vers 1955", marchand: "Atelier Marsan", prix: 1890 },
      { nom: "Miroir à parecloses en bois doré", origine: "Italie, vers 1880", marchand: "Galerie Sainte-Anne", prix: 1450 },
      { nom: "Table de salon en placage de bois de rose", origine: "France, vers 1765", marchand: "Galerie Bertheau", prix: 3900 },
      { nom: "Trumeau Louis XVI en bois peint", origine: "France, vers 1785", marchand: "Maison Delaunay", prix: 2600 },
    ],
  },
  {
    slug: "luminaires",
    nom: "Luminaires",
    titre: "Luminaires vintage",
    accroche: "La lumière qui fait l’intérieur",
    intro:
      "Lustres à pampilles, appliques en opaline, suspensions de designers italiens. Toutes nos pièces sont refaites aux normes électriques actuelles par notre atelier avant expédition.",
    nombreObjets: 612,
    image: "/images/univers/luminaires.webp",
    tuiles: [{ label: "Lampe à poser" }, { label: "Applique" }, { label: "Suspension" }, { label: "Plafonnier" }],
    filtres: [
      {
        label: "Catégories",
        options: ["Abat-jour", "Applique", "Lampadaire", "Lampe à poser", "Lustre", "Plafonnier", "Suspension"],
      },
      { label: "Matière", options: ["Laiton", "Opaline", "Cristal", "Rotin", "Verre soufflé"] },
    ],
    objets: [
      { nom: "Lustre à pampilles de cristal, huit feux", origine: "France, vers 1900", marchand: "Galerie Sainte-Anne", prix: 3100 },
      { nom: "Suspension en opaline blanche", origine: "France, années 60", marchand: "Atelier Verrier", prix: 420 },
      { nom: "Paire d’appliques en laiton et verre", origine: "Italie, vers 1955", marchand: "Studio Milano", prix: 680 },
      { nom: "Lampadaire tripode en teck et lin", origine: "Danemark, années 50", marchand: "Studio Nord", prix: 890 },
      { nom: "Plafonnier en rotin tressé", origine: "France, années 70", marchand: "Atelier Verrier", prix: 340 },
      { nom: "Lampe à poser en céramique émaillée", origine: "Vallauris, vers 1960", marchand: "Galerie Sainte-Anne", prix: 520 },
      { nom: "Suspension globe en verre dépoli", origine: "Italie, vers 1965", marchand: "Studio Milano", prix: 760 },
      { nom: "Lampe de bureau articulée en acier laqué", origine: "France, vers 1950", marchand: "Studio Nord", prix: 450 },
    ],
  },
  {
    slug: "arts-de-la-table",
    nom: "Arts de la table",
    titre: "Arts de la table",
    accroche: "Recevoir comme autrefois",
    intro:
      "Services en faïence, verres taillés, argenterie poinçonnée et ménagères complètes. Nous vérifions le nombre de pièces, les poinçons et l’état de chaque ensemble avant la mise en ligne.",
    nombreObjets: 938,
    image: "/images/univers/arts-de-la-table.webp",
    tuiles: [{ label: "Service" }, { label: "Verrerie" }, { label: "Argenterie" }, { label: "Faïence" }],
    filtres: [
      {
        label: "Catégories",
        options: [
          "Assiette & service",
          "Verre & carafe",
          "Argenterie",
          "Plat de service",
          "Théière & cafetière",
          "Ménagère",
        ],
      },
      { label: "Matière", options: ["Faïence", "Porcelaine", "Cristal", "Argent massif", "Métal argenté"] },
    ],
    objets: [
      { nom: "Service en faïence de Gien, 24 pièces", origine: "France, vers 1920", marchand: "Maison Tessier", prix: 740 },
      { nom: "Six verres à vin en cristal taillé", origine: "Lorraine, vers 1930", marchand: "Galerie Sainte-Anne", prix: 290 },
      { nom: "Ménagère en métal argenté, 12 couverts", origine: "France, vers 1950", marchand: "Maison Tessier", prix: 560 },
      { nom: "Soupière en porcelaine à filets d’or", origine: "Limoges, vers 1900", marchand: "Maison Tessier", prix: 380 },
      { nom: "Carafe à whisky et son plateau", origine: "France, années 60", marchand: "Atelier Verrier", prix: 210 },
      { nom: "Théière en argent massif poinçonné", origine: "Paris, vers 1880", marchand: "Galerie Sainte-Anne", prix: 1250 },
      { nom: "Paire de plats de service en barbotine", origine: "France, vers 1890", marchand: "Maison Tessier", prix: 320 },
      { nom: "Douze assiettes plates en faïence fine", origine: "France, vers 1940", marchand: "Maison Tessier", prix: 260 },
    ],
  },
  {
    slug: "galerie",
    nom: "Galerie",
    titre: "Galerie",
    accroche: "Ce qu’on accroche au mur",
    intro:
      "Huiles sur toile, aquarelles, dessins et gravures anciennes. Chaque œuvre est vendue avec ce que nous savons de sa provenance, sans jamais forcer une attribution.",
    nombreObjets: 471,
    image: "/images/univers/galerie.webp",
    tuiles: [{ label: "Huile sur toile" }, { label: "Aquarelle" }, { label: "Gravure" }, { label: "Photographie" }],
    filtres: [
      {
        label: "Catégories",
        options: ["Huile sur toile", "Aquarelle & dessin", "Gravure & estampe", "Photographie", "Cadre ancien"],
      },
      { label: "Sujet", options: ["Paysage", "Portrait", "Nature morte", "Marine", "Abstraction"] },
    ],
    objets: [
      { nom: "Vue de port breton, huile sur toile", origine: "France, vers 1910", marchand: "Galerie Sainte-Anne", prix: 1450 },
      { nom: "Paysage de Provence, huile sur toile", origine: "France, vers 1930", marchand: "Galerie Bertheau", prix: 1800 },
      { nom: "Marine au crépuscule, huile sur panneau", origine: "France, XIXe siècle", marchand: "Maison Delaunay", prix: 980 },
      { nom: "Bouquet de fleurs des champs, gouache", origine: "France, vers 1940", marchand: "Galerie Sainte-Anne", prix: 420 },
      { nom: "Nature morte aux pivoines, aquarelle", origine: "France, vers 1950", marchand: "Galerie Bertheau", prix: 540 },
      { nom: "Scène de marché, huile sur toile", origine: "France, vers 1890", marchand: "Maison Delaunay", prix: 2600 },
      { nom: "Suite de quatre gravures botaniques", origine: "Angleterre, vers 1850", marchand: "Galerie Sainte-Anne", prix: 360 },
      { nom: "Portrait de femme au chignon, fusain", origine: "France, vers 1925", marchand: "Galerie Bertheau", prix: 480 },
    ],
  },
  {
    slug: "createurs",
    nom: "Créateurs",
    titre: "Créateurs",
    accroche: "Des noms qu’on reconnaît de loin",
    intro:
      "Ébénistes estampillés, verriers, céramistes et designers du XXe siècle. Nous ne retenons une attribution que si la signature, l’estampille ou la documentation la confirment — sinon nous écrivons « dans le goût de ».",
    nombreObjets: 356,
    image: "/images/univers/createurs.webp",
    tuiles: [{ label: "Ébénistes" }, { label: "Verriers" }, { label: "Céramistes" }, { label: "Design XXe" }],
    filtres: [
      {
        label: "Créateurs",
        options: [
          "Pierre Roussel",
          "Émile Gallé",
          "Jean Prouvé",
          "Charlotte Perriand",
          "Suzanne Ramié",
          "Gio Ponti",
          "Serge Mouille",
        ],
      },
      {
        label: "Discipline",
        options: ["Ébénisterie", "Verrerie", "Céramique", "Mobilier design", "Luminaire d’auteur"],
      },
    ],
    objets: [
      { nom: "Commode estampillée P. Roussel", origine: "Paris, vers 1760", marchand: "Galerie Bertheau", prix: 4800 },
      { nom: "Vase soufflé signé Gallé, décor floral", origine: "Nancy, vers 1900", marchand: "Atelier Verrier", prix: 2900 },
      { nom: "Paire de vases en céramique, atelier Madoura", origine: "Vallauris, vers 1955", marchand: "Galerie Sainte-Anne", prix: 1650 },
      { nom: "Chaise Standard en tôle pliée et bois", origine: "France, vers 1950", marchand: "Studio Nord", prix: 1380 },
      { nom: "Bibliothèque en chêne et aluminium laqué", origine: "France, vers 1953", marchand: "Studio Nord", prix: 6400 },
      { nom: "Lampe à deux bras en tôle laquée noire", origine: "France, vers 1954", marchand: "Studio Milano", prix: 3200 },
      { nom: "Table basse à plateau de céramique signée", origine: "Italie, vers 1958", marchand: "Studio Milano", prix: 2750 },
      { nom: "Coupe en verre irisé, signature à la pointe", origine: "France, vers 1910", marchand: "Atelier Verrier", prix: 890 },
    ],
  },
  {
    slug: "curiosites",
    nom: "Curiosités",
    titre: "Objets de curiosité",
    accroche: "Ce qui ne rentre dans aucune case",
    intro:
      "Instruments de marine, cabinets de curiosités, sculptures et objets d’atelier. Ce sont souvent nos pièces les plus rares : une seule chance de les voir passer.",
    nombreObjets: 294,
    image: "/images/univers/curiosites.webp",
    tuiles: [{ label: "Sculpture" }, { label: "Instrument" }, { label: "Cabinet" }, { label: "Objet d’atelier" }],
    filtres: [
      {
        label: "Catégories",
        options: ["Sculpture", "Instrument scientifique", "Marine", "Taxidermie", "Objet d’atelier", "Horlogerie"],
      },
      { label: "Matière", options: ["Bronze", "Marbre", "Bois", "Laiton", "Porphyre"] },
    ],
    objets: [
      { nom: "Ensemble de quatre colonnes en porphyre", origine: "Italie, XIXe siècle", marchand: "Maison Delaunay", prix: 2600 },
      { nom: "Globe terrestre sur piètement d’acajou", origine: "France, vers 1890", marchand: "Galerie Sainte-Anne", prix: 1900 },
      { nom: "Sextant de marine dans son coffret", origine: "Angleterre, vers 1900", marchand: "Studio Nord", prix: 860 },
      { nom: "Buste en bronze à patine brune", origine: "France, vers 1870", marchand: "Maison Delaunay", prix: 1480 },
      { nom: "Cartel d’applique en bronze doré", origine: "Paris, vers 1770", marchand: "Galerie Bertheau", prix: 1800 },
      { nom: "Établi de horloger et ses tiroirs", origine: "France, vers 1910", marchand: "Studio Nord", prix: 990 },
      { nom: "Maquette de coque de voilier", origine: "France, vers 1940", marchand: "Studio Nord", prix: 620 },
      { nom: "Microscope de laboratoire en laiton", origine: "Allemagne, vers 1895", marchand: "Galerie Sainte-Anne", prix: 740 },
    ],
  },
];

const nouveautes: Nouveaute[] = [
  { nom: "Commode Louis XV en placage de bois de rose", meta: "Mobilier · France, vers 1760", prix: 4800, legende: "Commode — fond gris clair, 4:5" },
  { nom: "Paire de fauteuils cabriolet en noyer", meta: "Sièges · France, XIXe siècle", prix: 2200, legende: "Paire de fauteuils, 4:5" },
  { nom: "Miroir à parecloses en bois doré", meta: "Mobilier · Miroirs · Italie, vers 1880", prix: 1450, legende: "Miroir doré, 4:5" },
  { nom: "Lustre à pampilles de cristal, huit feux", meta: "Luminaires · France, vers 1900", prix: 3100, legende: "Lustre à pampilles, 4:5" },
  { nom: "Table basse à plateau de marbre, piètement tulipe", meta: "Design · Édition des années 1960", prix: 2900, legende: "Table basse marbre, 4:5" },
  { nom: "Ensemble de quatre colonnes en porphyre", meta: "Curiosités · Italie, XIXe siècle", prix: 2600, legende: "Colonnes en porphyre, 4:5" },
  { nom: "Paravent en lamelles de bois courbé", meta: "Mobilier · Milieu du XXe siècle", prix: 950, legende: "Paravent en bois, 4:5" },
  { nom: "Buffet en bois de rose marqueté d’attributs", meta: "Mobilier · France, vers 1780", prix: 3400, legende: "Buffet marqueté, 4:5" },
];

/** La maquette ne détaille qu'un seul objet : toutes les cartes y mènent pour l'instant. */
const objetVedette: ObjetDetail = {
  slug: "commode-louis-xv-bois-de-rose",
  nom: "Commode Louis XV en placage de bois de rose",
  nomCourt: "Commode Louis XV",
  filAriane: ["Mobilier", "Commodes"],
  provenance: "France, vers 1760 · Estampillée P. Roussel · Galerie Bertheau, Paris",
  prix: 4800,
  photoPrincipale: {
    src: "/images/objets/commode-louis-xv-1.webp",
    alt: "Commode Louis XV en placage de bois de rose, vue d’ensemble",
    legende: "Objet sur fond gris clair, 4:5",
  },
  photosDetail: [
    {
      src: "/images/objets/commode-louis-xv-2.webp",
      alt: "Commode Louis XV, détail des bronzes",
      legende: "Détail — bronzes",
    },
    { alt: "Commode Louis XV, détail de la marqueterie", legende: "Détail — marqueterie" },
    { alt: "Commode Louis XV, vue en situation", legende: "Vue en situation" },
  ],
  exclusivite: {
    titre: "Un seul exemplaire disponible",
    texte:
      "Cette commode n’est proposée que sur TROOVANTE. Une fois vendue, elle disparaît du catalogue : nous ne rééditons rien.",
  },
  garanties: [
    { icone: "authenticite", texte: "Authenticité et datation vérifiées par notre expert mobilier" },
    { icone: "paiement", texte: "Paiement sécurisé, remboursé sous 14 jours après réception" },
    { icone: "livraison", texte: "Livraison par transporteur spécialisé, mise en place à l’étage" },
  ],
  rubriques: [
    {
      titre: "Histoire de l’objet",
      paragraphes: [
        "Réalisée à Paris au milieu du XVIIIe siècle, cette commode à façade galbée illustre le goût Louis XV pour les bois exotiques : un placage de bois de rose en frisage, souligné de filets de bois de violette.",
        "Elle provient d’un hôtel particulier bordelais et est restée dans la même famille pendant quatre générations. Le marbre brèche d’Alep est celui d’origine.",
      ],
    },
    {
      titre: "Dimensions et poids",
      paragraphes: [
        "Hauteur 85 cm · Largeur 128 cm · Profondeur 60 cm · 62 kg. Deux tiroirs sans traverse, serrure fonctionnelle livrée avec sa clé.",
      ],
    },
    {
      titre: "État",
      paragraphes: [
        "Très bon état d’usage pour son âge. Restaurations anciennes du placage sur le côté droit, visibles à la lumière rasante. Un éclat comblé à l’arrière gauche du marbre. Bronzes d’origine, patine non retouchée.",
      ],
    },
    {
      titre: "Livraison et retours",
      paragraphes: [
        "Enlèvement sous 5 jours, livraison en France sous 10 à 15 jours par transporteur spécialisé mobilier. Retour accepté 14 jours après réception, frais de retour à notre charge.",
      ],
    },
    {
      titre: "Le marchand",
      paragraphes: [
        "Galerie Bertheau — antiquaire à Paris depuis 1987, spécialiste du mobilier français du XVIIIe siècle. 34 objets confiés en exclusivité à TROOVANTE.",
      ],
    },
  ],
  duMemeMarchand: [
    { nom: "Table de salon en placage de bois de rose", meta: "France, vers 1765", prix: 3900, legende: "Table de salon, 4:5" },
    { nom: "Commode en noyer à façade sinueuse", meta: "Lyon, vers 1750", prix: 2700, legende: "Commode noyer, 4:5" },
    { nom: "Paire de bergères à oreilles", meta: "France, fin XVIIIe", prix: 4100, legende: "Paire de bergères, 4:5" },
    { nom: "Cartel d’applique en bronze doré", meta: "Paris, vers 1770", prix: 1800, legende: "Cartel d’applique, 4:5" },
  ],
};

export function getUnivers(): Univers[] {
  return univers;
}

export function getUniversParSlug(slug: string): Univers | undefined {
  return univers.find((u) => u.slug === slug);
}

export function getNouveautes(): Nouveaute[] {
  return nouveautes;
}

export function getObjetParSlug(slug: string): ObjetDetail | undefined {
  return slug === objetVedette.slug ? objetVedette : undefined;
}

export function getSlugsObjets(): string[] {
  return [objetVedette.slug];
}

/** Adresse de la fiche vers laquelle pointent, pour l'instant, toutes les cartes objet. */
export const lienObjetVedette = `/objets/${objetVedette.slug}`;
