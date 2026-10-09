/**
 * Catalogue de démonstration, repris de la maquette. Tout est fictif
 * (objets, marchands, prix). Il sert à deux choses :
 *  - afficher le site tant que la base de données n'est pas branchée ;
 *  - remplir la base une première fois (voir scripts/generer-sql.ts).
 *
 * Ce fichier est aussi lu directement par Node pour générer le SQL :
 * ses imports doivent donc rester relatifs, avec l'extension « .ts ».
 */
import { slugifier } from "../lib/slug.ts";
import type { GroupeFiltres, Marchand, Objet, Tuile, Univers } from "../lib/types.ts";

const groupe = (label: string, options: string[]): GroupeFiltres => ({ cle: slugifier(label), label, options });

const tuile = (label: string, groupeLabel: string, option: string, image?: string): Tuile => ({
  label,
  groupe: slugifier(groupeLabel),
  option,
  image,
});

export const demoUnivers: Univers[] = [
  {
    slug: "mobilier",
    nom: "Mobilier",
    titre: "Mobilier ancien",
    accroche: "Des meubles qui ont déjà une vie",
    intro:
      "Commodes estampillées, buffets de campagne, bergères et guéridons : du XVIIIe siècle aux éditions des années 60. Chaque meuble a été vu, daté et vérifié chez le marchand avant d’arriver ici.",
    image: "/images/univers/mobilier.webp",
    tuiles: [
      tuile("Commode", "Catégories", "Commode", "/images/objets/commode-louis-xv-1.webp"),
      tuile("Fauteuil", "Catégories", "Fauteuil & bergère"),
      tuile("Table", "Catégories", "Table & guéridon"),
      tuile("Miroirs", "Catégories", "Miroirs"),
    ],
    filtres: [
      groupe("Catégories", [
        "Commode",
        "Buffet & enfilade",
        "Table & guéridon",
        "Fauteuil & bergère",
        "Chaise",
        "Bibliothèque",
        "Secrétaire",
        "Miroirs",
      ]),
      groupe("Époque", ["XVIIIe siècle", "XIXe siècle", "Art déco", "1950–1970"]),
    ],
  },
  {
    slug: "luminaires",
    nom: "Luminaires",
    titre: "Luminaires vintage",
    accroche: "La lumière qui fait l’intérieur",
    intro:
      "Lustres à pampilles, appliques en opaline, suspensions de designers italiens. Toutes nos pièces sont refaites aux normes électriques actuelles par notre atelier avant expédition.",
    image: "/images/univers/luminaires.webp",
    tuiles: [
      tuile("Lampe à poser", "Catégories", "Lampe à poser"),
      tuile("Applique", "Catégories", "Applique"),
      tuile("Suspension", "Catégories", "Suspension"),
      tuile("Plafonnier", "Catégories", "Plafonnier"),
    ],
    filtres: [
      groupe("Catégories", [
        "Abat-jour",
        "Applique",
        "Lampadaire",
        "Lampe à poser",
        "Lustre",
        "Plafonnier",
        "Suspension",
      ]),
      groupe("Matière", ["Laiton", "Opaline", "Cristal", "Rotin", "Verre soufflé"]),
    ],
  },
  {
    slug: "arts-de-la-table",
    nom: "Arts de la table",
    titre: "Arts de la table",
    accroche: "Recevoir comme autrefois",
    intro:
      "Services en faïence, verres taillés, argenterie poinçonnée et ménagères complètes. Nous vérifions le nombre de pièces, les poinçons et l’état de chaque ensemble avant la mise en ligne.",
    image: "/images/univers/arts-de-la-table.webp",
    tuiles: [
      tuile("Service", "Catégories", "Assiette & service"),
      tuile("Verrerie", "Catégories", "Verre & carafe"),
      tuile("Argenterie", "Catégories", "Argenterie"),
      tuile("Faïence", "Matière", "Faïence"),
    ],
    filtres: [
      groupe("Catégories", [
        "Assiette & service",
        "Verre & carafe",
        "Argenterie",
        "Plat de service",
        "Théière & cafetière",
        "Ménagère",
      ]),
      groupe("Matière", ["Faïence", "Porcelaine", "Cristal", "Argent massif", "Métal argenté"]),
    ],
  },
  {
    slug: "galerie",
    nom: "Galerie",
    titre: "Galerie",
    accroche: "Ce qu’on accroche au mur",
    intro:
      "Huiles sur toile, aquarelles, dessins et gravures anciennes. Chaque œuvre est vendue avec ce que nous savons de sa provenance, sans jamais forcer une attribution.",
    image: "/images/univers/galerie.webp",
    tuiles: [
      tuile("Huile sur toile", "Catégories", "Huile sur toile"),
      tuile("Aquarelle", "Catégories", "Aquarelle & dessin"),
      tuile("Gravure", "Catégories", "Gravure & estampe"),
      tuile("Photographie", "Catégories", "Photographie"),
    ],
    filtres: [
      groupe("Catégories", [
        "Huile sur toile",
        "Aquarelle & dessin",
        "Gravure & estampe",
        "Photographie",
        "Cadre ancien",
      ]),
      groupe("Sujet", ["Paysage", "Portrait", "Nature morte", "Marine", "Abstraction"]),
    ],
  },
  {
    slug: "createurs",
    nom: "Créateurs",
    titre: "Créateurs",
    accroche: "Des noms qu’on reconnaît de loin",
    intro:
      "Ébénistes estampillés, verriers, céramistes et designers du XXe siècle. Nous ne retenons une attribution que si la signature, l’estampille ou la documentation la confirment — sinon nous écrivons « dans le goût de ».",
    image: "/images/univers/createurs.webp",
    tuiles: [
      tuile("Ébénistes", "Discipline", "Ébénisterie"),
      tuile("Verriers", "Discipline", "Verrerie"),
      tuile("Céramistes", "Discipline", "Céramique"),
      tuile("Design XXe", "Discipline", "Mobilier design"),
    ],
    filtres: [
      groupe("Créateurs", [
        "Pierre Roussel",
        "Émile Gallé",
        "Jean Prouvé",
        "Charlotte Perriand",
        "Suzanne Ramié",
        "Gio Ponti",
        "Serge Mouille",
      ]),
      groupe("Discipline", ["Ébénisterie", "Verrerie", "Céramique", "Mobilier design", "Luminaire d’auteur"]),
    ],
  },
  {
    slug: "curiosites",
    nom: "Curiosités",
    titre: "Objets de curiosité",
    accroche: "Ce qui ne rentre dans aucune case",
    intro:
      "Instruments de marine, cabinets de curiosités, sculptures et objets d’atelier. Ce sont souvent nos pièces les plus rares : une seule chance de les voir passer.",
    image: "/images/univers/curiosites.webp",
    tuiles: [
      tuile("Sculpture", "Catégories", "Sculpture"),
      tuile("Instrument", "Catégories", "Instrument scientifique"),
      tuile("Horlogerie", "Catégories", "Horlogerie"),
      tuile("Objet d’atelier", "Catégories", "Objet d’atelier"),
    ],
    filtres: [
      groupe("Catégories", [
        "Sculpture",
        "Instrument scientifique",
        "Marine",
        "Taxidermie",
        "Objet d’atelier",
        "Horlogerie",
      ]),
      groupe("Matière", ["Bronze", "Marbre", "Bois", "Laiton", "Porphyre"]),
    ],
  },
];

const marchand = (nom: string, extra: Partial<Marchand> = {}): Marchand => ({
  id: slugifier(nom),
  slug: slugifier(nom),
  nom,
  ...extra,
});

export const demoMarchands: Marchand[] = [
  marchand("Galerie Bertheau", {
    ville: "Paris",
    region: "Île-de-France",
    presentation: "Antiquaire à Paris depuis 1987, spécialiste du mobilier français du XVIIIe siècle.",
  }),
  marchand("Atelier Marsan"),
  marchand("Maison Delaunay"),
  marchand("Galerie Sainte-Anne"),
  marchand("Atelier Verrier"),
  marchand("Studio Milano"),
  marchand("Studio Nord"),
  marchand("Maison Tessier"),
];

type Details = Partial<
  Pick<Objet, "nomCourt" | "signature" | "photos" | "histoire" | "dimensions" | "etat" | "livraison">
>;

type Brut = [
  univers: string,
  nom: string,
  origine: string,
  marchand: string,
  prix: number,
  attributs: Record<string, string[]>,
  details?: Details,
];

// Dans l'ordre de mise en ligne, du plus récent au plus ancien :
// les huit premiers sont les « Nouvelles trouvailles » de l'accueil.
const bruts: Brut[] = [
  [
    "mobilier",
    "Commode Louis XV en placage de bois de rose",
    "France, vers 1760",
    "Galerie Bertheau",
    4800,
    { categories: ["Commode"], epoque: ["XVIIIe siècle"] },
    {
      nomCourt: "Commode Louis XV",
      signature: "Estampillée P. Roussel",
      photos: [
        { src: "/images/objets/commode-louis-xv-1.webp", alt: "Commode Louis XV en placage de bois de rose, vue d’ensemble" },
        { src: "/images/objets/commode-louis-xv-2.webp", alt: "Commode Louis XV, vue en situation" },
      ],
      histoire:
        "Réalisée à Paris au milieu du XVIIIe siècle, cette commode à façade galbée illustre le goût Louis XV pour les bois exotiques : un placage de bois de rose en frisage, souligné de filets de bois de violette.\n\nElle provient d’un hôtel particulier bordelais et est restée dans la même famille pendant quatre générations. Le marbre brèche d’Alep est celui d’origine.",
      dimensions:
        "Hauteur 85 cm · Largeur 128 cm · Profondeur 60 cm · 62 kg. Deux tiroirs sans traverse, serrure fonctionnelle livrée avec sa clé.",
      etat: "Très bon état d’usage pour son âge. Restaurations anciennes du placage sur le côté droit, visibles à la lumière rasante. Un éclat comblé à l’arrière gauche du marbre. Bronzes d’origine, patine non retouchée.",
    },
  ],
  ["mobilier", "Paire de fauteuils cabriolet en noyer", "France, XIXe siècle", "Atelier Marsan", 2200, { categories: ["Fauteuil & bergère"], epoque: ["XIXe siècle"] }],
  ["mobilier", "Miroir à parecloses en bois doré", "Italie, vers 1880", "Galerie Sainte-Anne", 1450, { categories: ["Miroirs"], epoque: ["XIXe siècle"] }],
  ["luminaires", "Lustre à pampilles de cristal, huit feux", "France, vers 1900", "Galerie Sainte-Anne", 3100, { categories: ["Lustre"], matiere: ["Cristal"] }],
  ["mobilier", "Table basse à plateau de marbre, piètement tulipe", "Édition des années 1960", "Studio Milano", 2900, { categories: ["Table & guéridon"], epoque: ["1950–1970"] }],
  ["curiosites", "Ensemble de quatre colonnes en porphyre", "Italie, XIXe siècle", "Maison Delaunay", 2600, { categories: ["Sculpture"], matiere: ["Porphyre"] }],
  ["mobilier", "Paravent en lamelles de bois courbé", "Milieu du XXe siècle", "Studio Nord", 950, { epoque: ["1950–1970"] }],
  ["mobilier", "Buffet en bois de rose marqueté d’attributs", "France, vers 1780", "Galerie Bertheau", 3400, { categories: ["Buffet & enfilade"], epoque: ["XVIIIe siècle"] }],

  // Mobilier
  ["mobilier", "Guéridon tripode en acajou et laiton", "France, vers 1830", "Maison Delaunay", 1150, { categories: ["Table & guéridon"], epoque: ["XIXe siècle"] }],
  ["mobilier", "Enfilade en chêne cérusé, quatre portes", "France, vers 1955", "Atelier Marsan", 1890, { categories: ["Buffet & enfilade"], epoque: ["1950–1970"] }],
  ["mobilier", "Table de salon en placage de bois de rose", "France, vers 1765", "Galerie Bertheau", 3900, { categories: ["Table & guéridon"], epoque: ["XVIIIe siècle"] }],
  ["mobilier", "Trumeau Louis XVI en bois peint", "France, vers 1785", "Maison Delaunay", 2600, { categories: ["Miroirs"], epoque: ["XVIIIe siècle"] }],
  ["mobilier", "Commode en noyer à façade sinueuse", "Lyon, vers 1750", "Galerie Bertheau", 2700, { categories: ["Commode"], epoque: ["XVIIIe siècle"] }],
  ["mobilier", "Paire de bergères à oreilles", "France, fin XVIIIe", "Galerie Bertheau", 4100, { categories: ["Fauteuil & bergère"], epoque: ["XVIIIe siècle"] }],

  // Luminaires
  ["luminaires", "Suspension en opaline blanche", "France, années 60", "Atelier Verrier", 420, { categories: ["Suspension"], matiere: ["Opaline"] }],
  ["luminaires", "Paire d’appliques en laiton et verre", "Italie, vers 1955", "Studio Milano", 680, { categories: ["Applique"], matiere: ["Laiton"] }],
  ["luminaires", "Lampadaire tripode en teck et lin", "Danemark, années 50", "Studio Nord", 890, { categories: ["Lampadaire"] }],
  ["luminaires", "Plafonnier en rotin tressé", "France, années 70", "Atelier Verrier", 340, { categories: ["Plafonnier"], matiere: ["Rotin"] }],
  ["luminaires", "Lampe à poser en céramique émaillée", "Vallauris, vers 1960", "Galerie Sainte-Anne", 520, { categories: ["Lampe à poser"] }],
  ["luminaires", "Suspension globe en verre dépoli", "Italie, vers 1965", "Studio Milano", 760, { categories: ["Suspension"] }],
  ["luminaires", "Lampe de bureau articulée en acier laqué", "France, vers 1950", "Studio Nord", 450, { categories: ["Lampe à poser"] }],

  // Arts de la table
  ["arts-de-la-table", "Service en faïence de Gien, 24 pièces", "France, vers 1920", "Maison Tessier", 740, { categories: ["Assiette & service"], matiere: ["Faïence"] }],
  ["arts-de-la-table", "Six verres à vin en cristal taillé", "Lorraine, vers 1930", "Galerie Sainte-Anne", 290, { categories: ["Verre & carafe"], matiere: ["Cristal"] }],
  ["arts-de-la-table", "Ménagère en métal argenté, 12 couverts", "France, vers 1950", "Maison Tessier", 560, { categories: ["Ménagère", "Argenterie"], matiere: ["Métal argenté"] }],
  ["arts-de-la-table", "Soupière en porcelaine à filets d’or", "Limoges, vers 1900", "Maison Tessier", 380, { categories: ["Plat de service"], matiere: ["Porcelaine"] }],
  ["arts-de-la-table", "Carafe à whisky et son plateau", "France, années 60", "Atelier Verrier", 210, { categories: ["Verre & carafe"] }],
  ["arts-de-la-table", "Théière en argent massif poinçonné", "Paris, vers 1880", "Galerie Sainte-Anne", 1250, { categories: ["Théière & cafetière", "Argenterie"], matiere: ["Argent massif"] }],
  ["arts-de-la-table", "Paire de plats de service en barbotine", "France, vers 1890", "Maison Tessier", 320, { categories: ["Plat de service"], matiere: ["Faïence"] }],
  ["arts-de-la-table", "Douze assiettes plates en faïence fine", "France, vers 1940", "Maison Tessier", 260, { categories: ["Assiette & service"], matiere: ["Faïence"] }],

  // Galerie
  ["galerie", "Vue de port breton, huile sur toile", "France, vers 1910", "Galerie Sainte-Anne", 1450, { categories: ["Huile sur toile"], sujet: ["Marine"] }],
  ["galerie", "Paysage de Provence, huile sur toile", "France, vers 1930", "Galerie Bertheau", 1800, { categories: ["Huile sur toile"], sujet: ["Paysage"] }],
  ["galerie", "Marine au crépuscule, huile sur panneau", "France, XIXe siècle", "Maison Delaunay", 980, { categories: ["Huile sur toile"], sujet: ["Marine"] }],
  ["galerie", "Bouquet de fleurs des champs, gouache", "France, vers 1940", "Galerie Sainte-Anne", 420, { categories: ["Aquarelle & dessin"], sujet: ["Nature morte"] }],
  ["galerie", "Nature morte aux pivoines, aquarelle", "France, vers 1950", "Galerie Bertheau", 540, { categories: ["Aquarelle & dessin"], sujet: ["Nature morte"] }],
  ["galerie", "Scène de marché, huile sur toile", "France, vers 1890", "Maison Delaunay", 2600, { categories: ["Huile sur toile"] }],
  ["galerie", "Suite de quatre gravures botaniques", "Angleterre, vers 1850", "Galerie Sainte-Anne", 360, { categories: ["Gravure & estampe"] }],
  ["galerie", "Portrait de femme au chignon, fusain", "France, vers 1925", "Galerie Bertheau", 480, { categories: ["Aquarelle & dessin"], sujet: ["Portrait"] }],

  // Créateurs
  ["createurs", "Commode estampillée P. Roussel", "Paris, vers 1760", "Galerie Bertheau", 4800, { createurs: ["Pierre Roussel"], discipline: ["Ébénisterie"] }],
  ["createurs", "Vase soufflé signé Gallé, décor floral", "Nancy, vers 1900", "Atelier Verrier", 2900, { createurs: ["Émile Gallé"], discipline: ["Verrerie"] }],
  ["createurs", "Paire de vases en céramique, atelier Madoura", "Vallauris, vers 1955", "Galerie Sainte-Anne", 1650, { createurs: ["Suzanne Ramié"], discipline: ["Céramique"] }],
  ["createurs", "Chaise Standard en tôle pliée et bois", "France, vers 1950", "Studio Nord", 1380, { createurs: ["Jean Prouvé"], discipline: ["Mobilier design"] }],
  ["createurs", "Bibliothèque en chêne et aluminium laqué", "France, vers 1953", "Studio Nord", 6400, { discipline: ["Mobilier design"] }],
  ["createurs", "Lampe à deux bras en tôle laquée noire", "France, vers 1954", "Studio Milano", 3200, { discipline: ["Luminaire d’auteur"] }],
  ["createurs", "Table basse à plateau de céramique signée", "Italie, vers 1958", "Studio Milano", 2750, { discipline: ["Mobilier design"] }],
  ["createurs", "Coupe en verre irisé, signature à la pointe", "France, vers 1910", "Atelier Verrier", 890, { discipline: ["Verrerie"] }],

  // Curiosités
  ["curiosites", "Globe terrestre sur piètement d’acajou", "France, vers 1890", "Galerie Sainte-Anne", 1900, { categories: ["Instrument scientifique"], matiere: ["Bois"] }],
  ["curiosites", "Sextant de marine dans son coffret", "Angleterre, vers 1900", "Studio Nord", 860, { categories: ["Marine", "Instrument scientifique"], matiere: ["Laiton"] }],
  ["curiosites", "Buste en bronze à patine brune", "France, vers 1870", "Maison Delaunay", 1480, { categories: ["Sculpture"], matiere: ["Bronze"] }],
  ["curiosites", "Cartel d’applique en bronze doré", "Paris, vers 1770", "Galerie Bertheau", 1800, { categories: ["Horlogerie"], matiere: ["Bronze"] }],
  ["curiosites", "Établi de horloger et ses tiroirs", "France, vers 1910", "Studio Nord", 990, { categories: ["Objet d’atelier", "Horlogerie"], matiere: ["Bois"] }],
  ["curiosites", "Maquette de coque de voilier", "France, vers 1940", "Studio Nord", 620, { categories: ["Marine"], matiere: ["Bois"] }],
  ["curiosites", "Microscope de laboratoire en laiton", "Allemagne, vers 1895", "Galerie Sainte-Anne", 740, { categories: ["Instrument scientifique"], matiere: ["Laiton"] }],
];

const UNE_HEURE = 3_600_000;
const maintenant = Date.now();

export const demoObjets: Objet[] = bruts.map(([universSlug, nom, origine, nomMarchand, prix, attributs, details], rang) => ({
  id: slugifier(nom),
  slug: slugifier(nom),
  universSlug,
  marchandId: slugifier(nomMarchand),
  nom,
  origine,
  prix,
  attributs,
  photos: [],
  // Une heure d'écart entre chaque objet, pour garder l'ordre ci-dessus.
  publieLe: new Date(maintenant - rang * UNE_HEURE).toISOString(),
  ...details,
}));
