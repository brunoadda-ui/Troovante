import { connection } from "next/server";
import { cache } from "react";
import { demoMarchands, demoObjets, demoUnivers } from "@/data/demo";
import { slugifier } from "./slug";
import { supabase, supabaseConfigure } from "./supabase";
import type { CarteObjet, Catalogue, Marchand, Objet, ObjetComplet, Univers } from "./types";

/**
 * Lecture du catalogue. Tant que Supabase n'est pas configuré, le site
 * affiche les données de démonstration ; ensuite, il lit la base.
 *
 * Tout le catalogue publié est chargé d'un coup, puis filtré et trié par le
 * serveur (voir filtres.ts). C'est simple et suffisant jusqu'à quelques
 * centaines d'objets ; au-delà, il faudra filtrer directement en base.
 */

type LigneUnivers = {
  slug: string;
  nom: string;
  titre: string;
  accroche: string;
  intro: string;
  image: string | null;
  tuiles: Univers["tuiles"] | null;
  filtres: { label: string; options: string[] }[] | null;
};

type LigneMarchand = {
  id: string;
  slug: string;
  nom: string;
  ville: string | null;
  region: string | null;
  presentation: string | null;
};

type LigneObjet = {
  id: string;
  slug: string;
  univers_slug: string;
  marchand_id: string | null;
  nom: string;
  nom_court: string | null;
  origine: string;
  signature: string | null;
  prix: number;
  attributs: Objet["attributs"] | null;
  photos: Objet["photos"] | null;
  histoire: string | null;
  dimensions: string | null;
  etat: string | null;
  livraison: string | null;
  publie_le: string | null;
  created_at: string;
};

/** Codes d'erreur renvoyés quand une table n'existe pas encore dans la base. */
const TABLE_ABSENTE = new Set(["PGRST205", "42P01"]);

/** Renvoie `null` si la base est branchée mais que ses tables n'ont pas encore été créées. */
async function lireSupabase(): Promise<{ univers: Univers[]; marchands: Marchand[]; objets: Objet[] } | null> {
  // Le catalogue change en base : la page doit être recalculée à chaque visite,
  // et non figée au moment de la mise en ligne.
  await connection();

  const base = supabase();
  const [univers, marchands, objets] = await Promise.all([
    base.from("univers").select("*").order("position"),
    base.from("marchands").select("id, slug, nom, ville, region, presentation"),
    base.from("objets").select("*").eq("statut", "publie").order("publie_le", { ascending: false }),
  ]);

  const erreur = univers.error ?? marchands.error ?? objets.error;
  if (erreur) {
    if (TABLE_ABSENTE.has(erreur.code)) {
      console.warn(
        "Supabase est branché mais ses tables n'existent pas encore : exécuter supabase/installation.sql. " +
          "En attendant, le site affiche le catalogue de démonstration.",
      );
      return null;
    }
    throw new Error(`Lecture du catalogue impossible (Supabase) : ${erreur.message}`);
  }

  return {
    univers: (univers.data as LigneUnivers[]).map((u) => ({
      slug: u.slug,
      nom: u.nom,
      titre: u.titre,
      accroche: u.accroche,
      intro: u.intro,
      image: u.image ?? undefined,
      tuiles: u.tuiles ?? [],
      filtres: (u.filtres ?? []).map((g) => ({ cle: slugifier(g.label), label: g.label, options: g.options })),
    })),
    marchands: (marchands.data as LigneMarchand[]).map((m) => ({
      id: m.id,
      slug: m.slug,
      nom: m.nom,
      ville: m.ville ?? undefined,
      region: m.region ?? undefined,
      presentation: m.presentation ?? undefined,
    })),
    objets: (objets.data as LigneObjet[]).map((o) => ({
      id: o.id,
      slug: o.slug,
      universSlug: o.univers_slug,
      marchandId: o.marchand_id ?? undefined,
      nom: o.nom,
      nomCourt: o.nom_court ?? undefined,
      origine: o.origine,
      signature: o.signature ?? undefined,
      prix: o.prix,
      attributs: o.attributs ?? {},
      photos: o.photos ?? [],
      histoire: o.histoire ?? undefined,
      dimensions: o.dimensions ?? undefined,
      etat: o.etat ?? undefined,
      livraison: o.livraison ?? undefined,
      publieLe: o.publie_le ?? o.created_at,
    })),
  };
}

/** Le catalogue complet. Lu une seule fois par page affichée. */
export const chargerCatalogue = cache(async (): Promise<Catalogue> => {
  const source = (supabaseConfigure ? await lireSupabase() : null) ?? {
    univers: demoUnivers,
    marchands: demoMarchands,
    objets: demoObjets,
  };

  const universParSlug = new Map(source.univers.map((u) => [u.slug, u]));
  const marchandParId = new Map(source.marchands.map((m) => [m.id, m]));

  const objets: ObjetComplet[] = [];
  for (const objet of source.objets) {
    const univers = universParSlug.get(objet.universSlug);
    if (!univers) continue;
    objets.push({ ...objet, univers, marchand: objet.marchandId ? marchandParId.get(objet.marchandId) : undefined });
  }
  // Du plus récent au plus ancien : c'est l'ordre par défaut de toutes les listes.
  objets.sort((a, b) => b.publieLe.localeCompare(a.publieLe));

  return { univers: source.univers, marchands: source.marchands, objets };
});

export async function getUnivers(): Promise<Univers[]> {
  return (await chargerCatalogue()).univers;
}

export async function getUniversParSlug(slug: string): Promise<Univers | undefined> {
  return (await chargerCatalogue()).univers.find((u) => u.slug === slug);
}

export async function getObjetsUnivers(slug: string): Promise<ObjetComplet[]> {
  return (await chargerCatalogue()).objets.filter((o) => o.universSlug === slug);
}

export async function getObjets(): Promise<ObjetComplet[]> {
  return (await chargerCatalogue()).objets;
}

export async function getObjetParSlug(slug: string): Promise<ObjetComplet | undefined> {
  return (await chargerCatalogue()).objets.find((o) => o.slug === slug);
}

export async function getNouveautes(nombre: number): Promise<ObjetComplet[]> {
  return (await chargerCatalogue()).objets.slice(0, nombre);
}

/** Les autres objets du même marchand, du plus récent au plus ancien. */
export async function getDuMemeMarchand(objet: ObjetComplet, nombre: number): Promise<ObjetComplet[]> {
  if (!objet.marchandId) return [];
  return (await chargerCatalogue()).objets
    .filter((o) => o.marchandId === objet.marchandId && o.id !== objet.id)
    .slice(0, nombre);
}

/** Les objets correspondant à une liste de slugs, dans l'ordre demandé. */
export async function getObjetsParSlugs(slugs: string[]): Promise<ObjetComplet[]> {
  const parSlug = new Map((await chargerCatalogue()).objets.map((o) => [o.slug, o]));
  return slugs.flatMap((slug) => parSlug.get(slug) ?? []);
}

export type Chiffres = {
  objets: number;
  marchands: number;
  regions: number;
  /** Objets mis en ligne ces sept derniers jours. */
  nouveautesSemaine: number;
  /** Nombre d'objets par univers. */
  parUnivers: Record<string, number>;
};

export async function getChiffres(): Promise<Chiffres> {
  const { objets } = await chargerCatalogue();
  const ilYaUneSemaine = new Date(Date.now() - 7 * 24 * 3_600_000).toISOString();
  const marchands = new Set<string>();
  const regions = new Set<string>();
  const parUnivers: Record<string, number> = {};

  for (const o of objets) {
    parUnivers[o.universSlug] = (parUnivers[o.universSlug] ?? 0) + 1;
    if (o.marchand) {
      marchands.add(o.marchand.id);
      if (o.marchand.region) regions.add(o.marchand.region);
    }
  }

  return {
    objets: objets.length,
    marchands: marchands.size,
    regions: regions.size,
    nouveautesSemaine: objets.filter((o) => o.publieLe >= ilYaUneSemaine).length,
    parUnivers,
  };
}

/** Résumé d'un objet pour une carte. `avecUnivers` : préciser l'univers plutôt que le marchand. */
export function versCarte(objet: ObjetComplet, avecUnivers = false): CarteObjet {
  const complement = avecUnivers ? [objet.univers.nom, objet.origine] : [objet.origine, objet.marchand?.nom];
  return {
    slug: objet.slug,
    nom: objet.nom,
    meta: complement.filter(Boolean).join(" · "),
    prix: objet.prix,
    image: objet.photos[0]?.src,
  };
}
