import { slugifier } from "./slug";
import type { GroupeFiltres, ObjetComplet } from "./types";

/**
 * Filtres, tri et recherche d'une liste d'objets.
 * L'état de la liste (cases cochées, prix, tri…) vit dans l'adresse de la
 * page : on peut donc partager un lien vers une liste filtrée.
 *   /univers/mobilier?categories=commode,miroirs&epoque=xviiie-siecle&prix_max=3000&tri=prix-croissant
 */

export const TRIS = [
  { valeur: "pertinence", label: "Pertinence" },
  { valeur: "nouveautes", label: "Nouveautés" },
  { valeur: "prix-croissant", label: "Prix croissant" },
  { valeur: "prix-decroissant", label: "Prix décroissant" },
] as const;

export type Tri = (typeof TRIS)[number]["valeur"];

/** Nombre d'objets affichés d'abord, puis ajoutés à chaque « Voir plus ». */
export const OBJETS_PAR_PAGE = 8;

export type EtatListe = {
  /** Options cochées, par groupe : { epoque: ["xviiie-siecle"] }. */
  selection: Record<string, string[]>;
  prixMin?: number;
  prixMax?: number;
  tri: Tri;
  /** Nombre d'objets affichés. */
  n: number;
  /** Texte recherché. */
  q: string;
};

export type ParametresPage = Record<string, string | string[] | undefined>;

const premier = (valeur: string | string[] | undefined) => (Array.isArray(valeur) ? valeur[0] : valeur);

/** « 1 500 € » → 1500. Renvoie `undefined` si ce n'est pas un nombre positif. */
export function lireEntier(valeur: string | undefined): number | undefined {
  if (!valeur) return undefined;
  const chiffres = valeur.replace(/[^\d]/g, "");
  if (!chiffres) return undefined;
  const nombre = Number.parseInt(chiffres, 10);
  return Number.isSafeInteger(nombre) ? nombre : undefined;
}

/** Lit l'état de la liste dans l'adresse, en ignorant tout ce qui n'est pas valide. */
export function lireEtat(params: ParametresPage, groupes: GroupeFiltres[] = []): EtatListe {
  const selection: Record<string, string[]> = {};
  for (const groupe of groupes) {
    const brut = premier(params[groupe.cle]);
    if (!brut) continue;
    const connues = new Set(groupe.options.map(slugifier));
    const choisies = brut.split(",").filter((option) => connues.has(option));
    if (choisies.length > 0) selection[groupe.cle] = choisies;
  }

  const tri = TRIS.find((t) => t.valeur === premier(params.tri))?.valeur ?? "pertinence";
  const n = Math.min(Math.max(lireEntier(premier(params.n)) ?? OBJETS_PAR_PAGE, OBJETS_PAR_PAGE), 500);

  return {
    selection,
    prixMin: lireEntier(premier(params.prix_min)),
    prixMax: lireEntier(premier(params.prix_max)),
    tri,
    n,
    q: (premier(params.q) ?? "").trim().slice(0, 100),
  };
}

/** Construit l'adresse d'une liste à partir de son état. */
export function urlListe(chemin: string, etat: Partial<EtatListe>): string {
  const params = new URLSearchParams();
  if (etat.q) params.set("q", etat.q);
  for (const [cle, options] of Object.entries(etat.selection ?? {})) {
    if (options.length > 0) params.set(cle, options.join(","));
  }
  if (etat.prixMin != null) params.set("prix_min", String(etat.prixMin));
  if (etat.prixMax != null) params.set("prix_max", String(etat.prixMax));
  if (etat.tri && etat.tri !== "pertinence") params.set("tri", etat.tri);
  if (etat.n && etat.n > OBJETS_PAR_PAGE) params.set("n", String(etat.n));

  // Les virgules restent lisibles dans l'adresse.
  const requete = params.toString().replace(/%2C/g, ",");
  return requete ? `${chemin}?${requete}` : chemin;
}

/** Adresse d'un univers avec une seule option cochée (tuiles, liens du menu). */
export function urlOption(universSlug: string, groupe: string, option: string): string {
  return urlListe(`/univers/${universSlug}`, { selection: { [groupe]: [slugifier(option)] } });
}

export function aDesFiltres(etat: EtatListe): boolean {
  return Object.keys(etat.selection).length > 0 || etat.prixMin != null || etat.prixMax != null;
}

/**
 * Garde les objets qui respectent les filtres. Dans un même groupe, il suffit
 * d'une option cochée (Commode OU Miroirs) ; entre groupes, il les faut tous
 * (Commode ET XVIIIe siècle).
 */
export function filtrer<T extends ObjetComplet>(objets: T[], etat: EtatListe): T[] {
  const groupes = Object.entries(etat.selection);
  return objets.filter((objet) => {
    if (etat.prixMin != null && objet.prix < etat.prixMin) return false;
    if (etat.prixMax != null && objet.prix > etat.prixMax) return false;
    return groupes.every(([cle, choisies]) => {
      const valeurs = (objet.attributs[cle] ?? []).map(slugifier);
      return choisies.some((option) => valeurs.includes(option));
    });
  });
}

/** « Pertinence » conserve l'ordre reçu (récence, ou score de recherche). */
export function trier<T extends ObjetComplet>(objets: T[], tri: Tri): T[] {
  switch (tri) {
    case "nouveautes":
      return [...objets].sort((a, b) => b.publieLe.localeCompare(a.publieLe));
    case "prix-croissant":
      return [...objets].sort((a, b) => a.prix - b.prix);
    case "prix-decroissant":
      return [...objets].sort((a, b) => b.prix - a.prix);
    default:
      return objets;
  }
}

/** Minuscules sans accents, pour comparer « Époque » et « epoque ». */
const normaliser = (texte: string) =>
  texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/œ/g, "oe");

/**
 * Recherche plein texte : chaque mot saisi doit se retrouver dans le nom de
 * l'objet, son origine, son marchand, son univers ou ses caractéristiques.
 * Les objets dont le nom contient les mots passent en premier.
 */
export function rechercher<T extends ObjetComplet>(objets: T[], q: string): T[] {
  const mots = normaliser(q).split(/[^a-z0-9]+/).filter(Boolean);
  if (mots.length === 0) return [];

  const trouves: { objet: T; score: number }[] = [];
  for (const objet of objets) {
    const nom = normaliser(objet.nom);
    const reste = normaliser(
      [
        objet.origine,
        objet.signature,
        objet.marchand?.nom,
        objet.univers.nom,
        objet.univers.titre,
        ...Object.values(objet.attributs).flat(),
      ]
        .filter(Boolean)
        .join(" "),
    );

    let score = 0;
    const tousPresents = mots.every((mot) => {
      if (nom.includes(mot)) {
        score += 2;
        return true;
      }
      if (reste.includes(mot)) {
        score += 1;
        return true;
      }
      return false;
    });
    if (tousPresents) trouves.push({ objet, score });
  }

  // Le tri est stable : à score égal, l'ordre d'origine (récence) est conservé.
  return trouves.sort((a, b) => b.score - a.score).map((t) => t.objet);
}
