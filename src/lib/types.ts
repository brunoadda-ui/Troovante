/** Les types du catalogue, communs à la base de données et aux données de démonstration. */

export type GroupeFiltres = {
  /** Identifiant utilisé dans l'adresse de la page, par exemple « epoque ». */
  cle: string;
  label: string;
  options: string[];
};

/** Raccourci illustré vers une option de filtre, en haut d'une page univers. */
export type Tuile = {
  label: string;
  image?: string;
  groupe: string;
  option: string;
};

export type Univers = {
  slug: string;
  /** Libellé court, utilisé dans la navigation. */
  nom: string;
  titre: string;
  accroche: string;
  intro: string;
  /** Photo d'ambiance affichée dans le menu. */
  image?: string;
  tuiles: Tuile[];
  filtres: GroupeFiltres[];
};

export type Marchand = {
  id: string;
  slug: string;
  nom: string;
  ville?: string;
  region?: string;
  presentation?: string;
};

export type PhotoObjet = { src: string; alt?: string };

export type Objet = {
  id: string;
  slug: string;
  universSlug: string;
  marchandId?: string;
  nom: string;
  nomCourt?: string;
  /** Lieu et date, par exemple « France, vers 1760 ». */
  origine: string;
  /** Estampille ou signature, par exemple « Estampillée P. Roussel ». */
  signature?: string;
  /** Prix en euros, sans centimes. */
  prix: number;
  /** Valeurs de filtres, rangées par clé de groupe : { epoque: ["XVIIIe siècle"] }. */
  attributs: Record<string, string[]>;
  photos: PhotoObjet[];
  histoire?: string;
  dimensions?: string;
  etat?: string;
  livraison?: string;
  /** Date de mise en ligne (format ISO). */
  publieLe: string;
};

/** Un objet accompagné de son univers et de son marchand. */
export type ObjetComplet = Objet & {
  univers: Univers;
  marchand?: Marchand;
};

export type Catalogue = {
  univers: Univers[];
  marchands: Marchand[];
  objets: ObjetComplet[];
};

/** Ce qu'il faut pour afficher une carte objet (listes, favoris). */
export type CarteObjet = {
  slug: string;
  nom: string;
  meta: string;
  prix: number;
  image?: string;
};
