import "server-only";
import { STOCKAGE_DEPOTS, type Profil } from "./depot";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Lecture des objets déposés par les professionnels, pour l'espace privé.
 * Tout passe par la clé secrète : ces fonctions ne doivent être appelées
 * qu'après `exigerAdmin()`.
 */

export const STATUTS_DEPOT = ["nouveau", "publie", "refuse"] as const;
export type StatutDepot = (typeof STATUTS_DEPOT)[number];

export type Depot = {
  id: string;
  creeLe: string;
  profil: Profil;
  nom: string;
  societe?: string;
  email: string;
  telephone: string;
  ville?: string;
  titre: string;
  universSlug?: string;
  description: string;
  origine: string;
  signature?: string;
  etat: string;
  hauteurCm: number;
  largeurCm: number;
  profondeurCm?: number;
  poidsKg?: number;
  prixSouhaite: number;
  /** Chemins des photos dans le stockage privé. */
  photosOrigine: string[];
  photosSituation: string[];
  iaStatut: "en_attente" | "en_cours" | "terminee" | "echec";
  iaErreur?: string;
  statut: StatutDepot;
  objetId?: string;
  noteInterne?: string;
};

type Ligne = {
  id: string;
  created_at: string;
  profil: Profil;
  nom: string;
  societe: string | null;
  email: string;
  telephone: string;
  ville: string | null;
  titre: string;
  univers_slug: string | null;
  description: string;
  origine: string;
  signature: string | null;
  etat: string;
  hauteur_cm: number;
  largeur_cm: number;
  profondeur_cm: number | null;
  poids_kg: number | null;
  prix_souhaite: number;
  photos_origine: string[] | null;
  photos_situation: string[] | null;
  ia_statut: Depot["iaStatut"];
  ia_erreur: string | null;
  statut: StatutDepot;
  objet_id: string | null;
  note_interne: string | null;
};

const versDepot = (l: Ligne): Depot => ({
  id: l.id,
  creeLe: l.created_at,
  profil: l.profil,
  nom: l.nom,
  societe: l.societe ?? undefined,
  email: l.email,
  telephone: l.telephone,
  ville: l.ville ?? undefined,
  titre: l.titre,
  universSlug: l.univers_slug ?? undefined,
  description: l.description,
  origine: l.origine,
  signature: l.signature ?? undefined,
  etat: l.etat,
  hauteurCm: Number(l.hauteur_cm),
  largeurCm: Number(l.largeur_cm),
  profondeurCm: l.profondeur_cm == null ? undefined : Number(l.profondeur_cm),
  poidsKg: l.poids_kg == null ? undefined : Number(l.poids_kg),
  prixSouhaite: l.prix_souhaite,
  photosOrigine: l.photos_origine ?? [],
  photosSituation: l.photos_situation ?? [],
  iaStatut: l.ia_statut,
  iaErreur: l.ia_erreur ?? undefined,
  statut: l.statut,
  objetId: l.objet_id ?? undefined,
  noteInterne: l.note_interne ?? undefined,
});

/** Les dépôts d'un statut donné, du plus récent au plus ancien. */
export async function listerDepots(statut: StatutDepot): Promise<Depot[]> {
  const { data, error } = await supabaseAdmin()
    .from("depots")
    .select("*")
    .eq("statut", statut)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(`Lecture des dépôts impossible : ${error.message}`);
  return (data as Ligne[]).map(versDepot);
}

/** Nombre de dépôts par statut, pour les onglets. */
export async function compterDepots(): Promise<Record<StatutDepot, number>> {
  const base = supabaseAdmin();
  const comptes = await Promise.all(
    STATUTS_DEPOT.map((statut) =>
      base.from("depots").select("id", { count: "exact", head: true }).eq("statut", statut),
    ),
  );
  return Object.fromEntries(STATUTS_DEPOT.map((statut, i) => [statut, comptes[i].count ?? 0])) as Record<
    StatutDepot,
    number
  >;
}

export async function lireDepot(id: string): Promise<Depot | undefined> {
  if (!/^[0-9a-f-]{36}$/.test(id)) return undefined;
  const { data, error } = await supabaseAdmin().from("depots").select("*").eq("id", id).maybeSingle();
  if (error) throw new Error(`Lecture du dépôt impossible : ${error.message}`);
  return data ? versDepot(data as Ligne) : undefined;
}

/**
 * Adresses temporaires (une heure) pour afficher des photos du stockage privé.
 * Renvoie un dictionnaire chemin → adresse ; une photo introuvable est absente.
 */
export async function liensPhotosPrivees(chemins: string[]): Promise<Record<string, string>> {
  if (chemins.length === 0) return {};
  const { data, error } = await supabaseAdmin().storage.from(STOCKAGE_DEPOTS).createSignedUrls(chemins, 3600);
  if (error) throw new Error(`Lecture des photos impossible : ${error.message}`);
  const liens: Record<string, string> = {};
  for (const lien of data ?? []) {
    if (lien.path && lien.signedUrl) liens[lien.path] = lien.signedUrl;
  }
  return liens;
}
