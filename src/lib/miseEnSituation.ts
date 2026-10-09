import "server-only";
import { STOCKAGE_DEPOTS } from "./depot";
import { lireDepot } from "./depots";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Mise en situation d'un objet déposé : la photo principale envoyée par le
 * professionnel est confiée au service Bria, qui garde l'objet tel quel et
 * génère un décor autour. L'image obtenue est rangée dans le stockage privé
 * du dépôt ; elle ne paraît sur le site que si TROOVANTE la retient au moment
 * de publier.
 *
 * Référence : https://docs.bria.ai/product-shot-editing (Lifestyle Product Shot by Text).
 */

const BRIA_URL = "https://engine.prod.bria-api.com/v1/product/lifestyle_shot_by_text";
const jetonBria = process.env.BRIA_API_TOKEN?.trim() || undefined;

/** Vrai quand la clé Bria est renseignée dans `.env.local`. */
export const briaConfigure = Boolean(jetonBria);

/** Au-delà de ce nombre de dépôts reçus dans la journée, la génération automatique s'arrête (garde-fou de coût). */
const GENERATIONS_AUTO_PAR_JOUR = 40;

type Placement = "bottom_center" | "upper_center";

export type Decor = {
  cle: string;
  label: string;
  /** Où Bria pose l'objet dans l'image : en bas (posé) ou en haut (accroché). */
  placement: Placement;
  /**
   * Le décor, décrit comme une consigne de photographe. Bria ne comprend que
   * l'anglais, sans caractères spéciaux, et conseille 90 à 110 mots.
   */
  description: string;
};

// Tous les décors partagent l'ambiance du visuel d'accueil : appartement
// parisien clair, moulures blanches, parquet en chêne, lumière du jour.
export const DECORS: Decor[] = [
  {
    cle: "salon",
    label: "Salon clair (meuble posé au sol)",
    placement: "bottom_center",
    description:
      "A bright Parisian living room photographed straight on. The product stands on a light herringbone oak parquet floor in front of a white wall with classic plaster moldings and tall wainscoting panels. Soft natural daylight enters from a large window on the left and casts gentle shadows on the floor. The room is calm and uncluttered with warm ivory and cream tones. A pale wool rug lies partly under the product. No other furniture in front of the product and no people. Realistic interior design magazine photography with accurate perspective and natural contact shadows under the product.",
  },
  {
    cle: "console",
    label: "Console en marbre (objet posé)",
    placement: "bottom_center",
    description:
      "The product is resting on the white marble top of an antique console table against a white wall with classic plaster moldings in a bright Parisian apartment. Soft natural daylight comes from a window on the left and creates a gentle shadow behind the product. A few stacked art books lie at the edge of the frame and the background stays softly blurred. Warm ivory and cream tones with a calm and elegant atmosphere. No people. Realistic interior design magazine photography with accurate scale and natural contact shadows under the product.",
  },
  {
    cle: "table",
    label: "Table dressée (arts de la table)",
    placement: "bottom_center",
    description:
      "The product is resting on a solid oak dining table covered with a natural linen runner in a bright Parisian dining room. In the softly blurred background there is a white wall with classic plaster moldings and a tall window letting in gentle daylight from the left. Warm ivory and cream tones with a calm and refined atmosphere. A folded linen napkin lies near the edge of the frame. No people and no food. Realistic lifestyle magazine photography with accurate scale and natural contact shadows under the product.",
  },
  {
    cle: "mur",
    label: "Mur à moulures (pièce accrochée)",
    placement: "upper_center",
    description:
      "The product hangs on a white wall with classic plaster moldings in a bright Parisian living room photographed straight on. Below it stands a low antique wooden console with a small ceramic vase and a stack of art books. Light herringbone oak parquet is visible at the bottom of the frame. Soft natural daylight comes from a window on the left and gives a gentle shadow around the product. Warm ivory and cream tones and a calm gallery atmosphere. No people. Realistic interior design magazine photography with accurate perspective.",
  },
];

/** Décor proposé d'office selon l'univers de l'objet. */
const DECOR_PAR_UNIVERS: Record<string, string> = {
  mobilier: "salon",
  luminaires: "console",
  "arts-de-la-table": "table",
  galerie: "mur",
  createurs: "console",
  curiosites: "console",
};

export function decorParDefaut(universSlug: string | undefined): Decor {
  const cle = (universSlug && DECOR_PAR_UNIVERS[universSlug]) || "console";
  return DECORS.find((decor) => decor.cle === cle) ?? DECORS[0];
}

const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

/**
 * Génère une mise en situation pour un dépôt et l'ajoute en tête de ses
 * images. Ne lève jamais d'erreur : l'état (« en_cours », « terminee »,
 * « echec » avec son motif) est écrit dans le dépôt.
 */
export async function mettreEnSituation(depotId: string, cleDecor?: string): Promise<void> {
  if (!jetonBria) return;

  const depot = await lireDepot(depotId);
  const principale = depot?.photosOrigine[0];
  if (!depot || !principale) return;

  const base = supabaseAdmin();
  const noter = (champs: Record<string, unknown>) => base.from("depots").update(champs).eq("id", depotId);
  await noter({ ia_statut: "en_cours", ia_erreur: null });

  try {
    const decor = DECORS.find((d) => d.cle === cleDecor) ?? decorParDefaut(depot.universSlug);

    // Bria vient chercher la photo lui-même, par une adresse valable dix minutes.
    const lien = await base.storage.from(STOCKAGE_DEPOTS).createSignedUrl(principale, 600);
    if (lien.error) throw new Error(`photo d'origine illisible (${lien.error.message})`);

    const reponse = await fetch(BRIA_URL, {
      method: "POST",
      headers: { api_token: jetonBria, "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: lien.data.signedUrl,
        scene_description: decor.description,
        mode: "high_control",
        // Format 4:5, celui de la photo principale d'une fiche ; environ un million de pixels, comme conseillé.
        placement_type: "manual_placement",
        manual_placement_selection: [decor.placement],
        shot_size: [896, 1120],
        num_results: 1,
        sync: true,
      }),
      signal: AbortSignal.timeout(110_000),
    });
    if (!reponse.ok) {
      throw new Error(`Bria a répondu ${reponse.status} : ${(await reponse.text()).slice(0, 300)}`);
    }

    // Réponse attendue : { result: [[adresse de l'image, graine, identifiant]] }
    const corps = (await reponse.json()) as { result?: unknown[][] };
    const adresse = corps.result?.[0]?.[0];
    if (typeof adresse !== "string" || !adresse.startsWith("http")) {
      throw new Error(`réponse Bria inattendue : ${JSON.stringify(corps).slice(0, 300)}`);
    }

    const image = await fetch(adresse, { signal: AbortSignal.timeout(60_000) });
    if (!image.ok) throw new Error(`image générée illisible (${image.status})`);
    const type = (image.headers.get("content-type") ?? "").split(";")[0];
    const extension = EXTENSIONS[type];
    if (!extension) throw new Error(`format d'image inattendu (${type || "inconnu"})`);

    const chemin = `${depotId}/situation-${Date.now()}-${decor.cle}.${extension}`;
    const envoi = await base.storage
      .from(STOCKAGE_DEPOTS)
      .upload(chemin, await image.arrayBuffer(), { contentType: type });
    if (envoi.error) throw new Error(`enregistrement de l'image impossible (${envoi.error.message})`);

    // La plus récente en tête : c'est elle qui est proposée d'office à la publication.
    const actuel = await lireDepot(depotId);
    const suivi = await noter({
      photos_situation: [chemin, ...(actuel?.photosSituation ?? [])],
      ia_statut: "terminee",
      ia_erreur: null,
    });
    if (suivi.error) throw new Error(`mise à jour du dépôt impossible (${suivi.error.message})`);
  } catch (erreur) {
    const motif = erreur instanceof Error ? erreur.message : String(erreur);
    console.error(`Mise en situation du dépôt ${depotId} impossible :`, motif);
    await noter({ ia_statut: "echec", ia_erreur: motif.slice(0, 500) });
  }
}

/**
 * Génération automatique à la réception d'un dépôt. Elle s'arrête d'elle-même
 * si trop de dépôts arrivent dans la journée : le formulaire est ouvert à
 * tous, et chaque image a un coût. Les dépôts restent alors « en attente » et
 * la génération se lance à la main depuis l'espace privé.
 */
export async function mettreEnSituationAuto(depotId: string): Promise<void> {
  if (!jetonBria) return;
  try {
    const debutDuJour = new Date();
    debutDuJour.setHours(0, 0, 0, 0);
    const { count } = await supabaseAdmin()
      .from("depots")
      .select("id", { count: "exact", head: true })
      .gte("created_at", debutDuJour.toISOString());
    if ((count ?? 0) > GENERATIONS_AUTO_PAR_JOUR) {
      console.warn("Génération automatique suspendue : trop de dépôts reçus aujourd'hui.");
      return;
    }
    await mettreEnSituation(depotId);
  } catch (erreur) {
    console.error("Génération automatique impossible :", erreur);
  }
}
