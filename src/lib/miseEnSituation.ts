import "server-only";
import { STOCKAGE_DEPOTS } from "./depot";
import { lireDepot, type Depot } from "./depots";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Mise en situation d'un objet déposé : la photo principale envoyée par le
 * professionnel est confiée au service Photoroom, qui détoure l'objet et
 * génère une pièce autour. L'objet n'est pas redessiné : seules sa lumière et
 * sa netteté sont ajustées. L'image obtenue est rangée dans le stockage privé
 * du dépôt ; elle ne paraît sur le site que si TROOVANTE la retient au moment
 * de publier.
 *
 * Référence : https://docs.photoroom.com/image-editing-api-plus-plan/ai-backgrounds
 */

const PHOTOROOM_URL = "https://image-api.photoroom.com/v2/edit";
const clePhotoroom = process.env.PHOTOROOM_API_KEY?.trim() || undefined;

/** Modèle de génération conseillé par Photoroom pour le rendu le plus réaliste. */
const MODELE_DECOR = "background-studio-beta-2025-03-17";

/** Vrai quand la clé Photoroom est renseignée dans `.env.local`. */
export const photoroomConfigure = Boolean(clePhotoroom);

/** Au-delà de ce nombre de dépôts reçus dans la journée, la génération automatique s'arrête (garde-fou de coût). */
const GENERATIONS_AUTO_PAR_JOUR = 40;

/** À partir de cette hauteur, un objet est trop grand pour être posé sur un meuble. */
const GRAND_OBJET_CM = 90;

type Pose = "sol" | "surface" | "mur" | "plafond";

type Cadre = {
  /** Portion de pièce visible dans l'image, pour rapporter l'objet à sa taille réelle. */
  hauteurCm: number;
  largeurCm: number;
  /** Part de l'image que l'objet peut occuper, au plus petit et au plus grand. */
  partMin: number;
  partMax: number;
  /** Marge gardée sous l'objet, ou au-dessus pour un objet suspendu. */
  marge: number;
  alignement: "bottom" | "center" | "top";
};

const CADRES: Record<Pose, Cadre> = {
  sol: { hauteurCm: 190, largeurCm: 152, partMin: 0.38, partMax: 0.8, marge: 0.1, alignement: "bottom" },
  surface: { hauteurCm: 70, largeurCm: 56, partMin: 0.38, partMax: 0.62, marge: 0.26, alignement: "bottom" },
  mur: { hauteurCm: 150, largeurCm: 120, partMin: 0.35, partMax: 0.6, marge: 0.26, alignement: "center" },
  plafond: { hauteurCm: 190, largeurCm: 152, partMin: 0.4, partMax: 0.6, marge: 0.02, alignement: "top" },
};

export type Decor = {
  cle: string;
  label: string;
  /** Comment l'objet est présenté, ce qui règle sa place et sa taille dans l'image. */
  pose: Pose;
  /**
   * La pièce, décrite comme une consigne de photographe, en anglais. L'objet
   * n'y est jamais nommé : sinon le service en dessine un second à côté.
   */
  description: string;
};

const STYLE_PHOTO =
  "Editorial interior design photography, eye level, gentle depth of field, photorealistic.";
const SOL_DEGAGE = "The middle of the floor is completely empty, with nothing else placed on it.";

export const DECORS: Decor[] = [
  {
    cle: "salon-parisien",
    label: "Salon parisien clair (posé au sol)",
    pose: "sol",
    description: `A bright Parisian living room with a warm oak herringbone parquet floor, white walls with classic plaster moldings and a tall window with linen curtains on the left. ${SOL_DEGAGE} Soft natural daylight and warm ivory tones. ${STYLE_PHOTO}`,
  },
  {
    cle: "moderniste",
    label: "Appartement moderniste (posé au sol)",
    pose: "sol",
    description: `A refined Paris apartment in a mid-century modernist style with a warm oak herringbone floor. A low travertine sideboard stands against a pale wall under a large abstract painting, and a linen curtain is softly lit by daylight from a tall window on the left. ${SOL_DEGAGE} ${STYLE_PHOTO}`,
  },
  {
    cle: "annees-80",
    label: "Appartement coloré années 1980 (posé au sol)",
    pose: "sol",
    description: `A colourful 1980s Italian design apartment with a pale polished concrete floor and a warm off-white wall. A low curved sofa in dusty pink wool stands at the far right edge of the frame and a large graphic poster hangs on the right. ${SOL_DEGAGE} Soft afternoon daylight comes from the left and falls across the floor. ${STYLE_PHOTO}`,
  },
  {
    cle: "galerie",
    label: "Galerie contemporaine (posé au sol)",
    pose: "sol",
    description: `A calm contemporary gallery apartment with a pale polished concrete floor and a large plain limewashed wall in warm white. A simple oak bench stands at the edge of the frame. ${SOL_DEGAGE} Soft even daylight comes from above. ${STYLE_PHOTO}`,
  },
  {
    cle: "console-travertin",
    label: "Console en travertin (objet posé)",
    pose: "surface",
    description: `A honey coloured travertine console in a calm collector's apartment. Behind it there is a plaster wall in warm greige, a framed charcoal drawing and a small stack of old art books at the edge of the frame. Soft directional daylight from the left falls across the stone. ${STYLE_PHOTO}`,
  },
  {
    cle: "buffet-ancien",
    label: "Buffet ancien, tenture verte (objet posé)",
    pose: "surface",
    description: `A dark walnut antique sideboard in a Belle Epoque apartment. Behind it there is a deep green silk wallpaper, a gilded frame and an old brass candlestick slightly out of focus at the edge of the frame. Soft window light from the left falls on the polished wood. ${STYLE_PHOTO}`,
  },
  {
    cle: "table-lin",
    label: "Table en chêne et lin (arts de la table)",
    pose: "surface",
    description: `A solid oak dining table with a natural linen runner in a bright Parisian dining room. In the softly blurred background there is a white wall with classic moldings and a tall window. A folded linen napkin lies at the edge of the frame. Soft daylight from the left and warm ivory tones. No food. ${STYLE_PHOTO}`,
  },
  {
    cle: "mur-moulures",
    label: "Mur à moulures (pièce accrochée)",
    pose: "mur",
    description: `A white wall with classic plaster moldings in a bright Parisian living room seen straight on. A low antique wooden console stands below at the edge of the frame. Light oak parquet is visible at the bottom. Soft daylight from the left and a calm gallery atmosphere. ${STYLE_PHOTO}`,
  },
  {
    cle: "plafond-moulures",
    label: "Plafond à rosace (pièce suspendue)",
    pose: "plafond",
    description: `A bright Parisian salon with a high white ceiling and an ornate plaster ceiling rose, tall windows on the left, white walls with classic moldings and a warm oak herringbone parquet floor far below. The room is calm and uncluttered. Soft natural daylight and warm ivory tones. ${STYLE_PHOTO}`,
  },
];

/** Décor proposé d'office selon la sous-catégorie ou la discipline choisie au dépôt. */
const DECOR_PAR_ATTRIBUT: Record<string, string> = {
  Miroirs: "mur-moulures",
  Applique: "mur-moulures",
  "Huile sur toile": "mur-moulures",
  "Aquarelle & dessin": "mur-moulures",
  "Gravure & estampe": "mur-moulures",
  Photographie: "mur-moulures",
  "Cadre ancien": "mur-moulures",
  Lustre: "plafond-moulures",
  Plafonnier: "plafond-moulures",
  Suspension: "plafond-moulures",
  Lampadaire: "salon-parisien",
  "Lampe à poser": "console-travertin",
  "Abat-jour": "console-travertin",
  Sculpture: "console-travertin",
  "Mobilier design": "moderniste",
  "1950–1970": "moderniste",
};

/** À défaut, décor proposé selon l'univers de l'objet. */
const DECOR_PAR_UNIVERS: Record<string, string> = {
  mobilier: "salon-parisien",
  luminaires: "console-travertin",
  "arts-de-la-table": "table-lin",
  galerie: "mur-moulures",
  createurs: "console-travertin",
  curiosites: "console-travertin",
};

export function decorParDefaut({ universSlug, attributs, hauteurCm }: Pick<Depot, "universSlug" | "attributs" | "hauteurCm">): Decor {
  // La sous-catégorie est regardée en premier : elle dit mieux comment l'objet se présente que son époque.
  const choix = [...(attributs.categories ?? []), ...Object.values(attributs).flat()];
  const cle =
    choix.map((valeur) => DECOR_PAR_ATTRIBUT[valeur]).find(Boolean) ??
    (universSlug && DECOR_PAR_UNIVERS[universSlug]) ??
    "console-travertin";
  const decor = DECORS.find((d) => d.cle === cle) ?? DECORS[0];
  return decor.pose === "surface" && hauteurCm >= GRAND_OBJET_CM ? DECORS[0] : decor;
}

/** Place de l'objet dans l'image, calculée d'après ses dimensions réelles. */
function placement(pose: Pose, hauteurCm: number, largeurCm: number): Record<string, string> {
  const cadre = CADRES[pose];
  const taille = Math.max(hauteurCm / cadre.hauteurCm, largeurCm / cadre.largeurCm) || 0;
  const part = Math.min(cadre.partMax, Math.max(cadre.partMin, taille));
  const cote = ((1 - part) / 2).toFixed(3);
  const reste = Math.max(0.02, 1 - cadre.marge - part).toFixed(3);
  return {
    paddingLeft: cote,
    paddingRight: cote,
    paddingTop: pose === "plafond" ? cadre.marge.toFixed(3) : reste,
    paddingBottom: pose === "plafond" ? reste : cadre.marge.toFixed(3),
    verticalAlignment: cadre.alignement,
    // Une pièce accrochée que la photo coupe ne doit pas venir se coller au bord de l'image.
    ...(pose === "mur" ? { ignorePaddingAndSnapOnCroppedSides: "false" } : {}),
  };
}

const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

function appelerPhotoroom(cle: string, champs: Record<string, string>): Promise<Response> {
  const formulaire = new FormData();
  for (const [nom, valeur] of Object.entries(champs)) formulaire.append(nom, valeur);
  return fetch(PHOTOROOM_URL, {
    method: "POST",
    headers: { "x-api-key": cle, "pr-ai-background-model-version": MODELE_DECOR },
    body: formulaire,
    signal: AbortSignal.timeout(110_000),
  });
}

/**
 * Génère une mise en situation pour un dépôt et l'ajoute en tête de ses
 * images. Ne lève jamais d'erreur : l'état (« en_cours », « terminee »,
 * « echec » avec son motif) est écrit dans le dépôt.
 */
export async function mettreEnSituation(depotId: string, cleDecor?: string): Promise<void> {
  if (!clePhotoroom) return;

  const depot = await lireDepot(depotId);
  const principale = depot?.photosOrigine[0];
  if (!depot || !principale) return;

  const base = supabaseAdmin();
  const noter = (champs: Record<string, unknown>) => base.from("depots").update(champs).eq("id", depotId);
  await noter({ ia_statut: "en_cours", ia_erreur: null });

  try {
    const decor = DECORS.find((d) => d.cle === cleDecor) ?? decorParDefaut(depot);

    // Photoroom vient chercher la photo lui-même, par une adresse valable dix minutes.
    const lien = await base.storage.from(STOCKAGE_DEPOTS).createSignedUrl(principale, 600);
    if (lien.error) throw new Error(`photo d'origine illisible (${lien.error.message})`);

    const champs = {
      imageUrl: lien.data.signedUrl,
      "background.prompt": decor.description,
      // Sans cela, Photoroom réécrit le texte et ajoute parfois des objets inventés dans la pièce.
      "background.expandPrompt.mode": "ai.never",
      "lighting.mode": "ai.preserve-hue-and-saturation",
      // Format 4:5, celui de la photo principale d'une fiche.
      outputSize: "1600x2000",
      "export.format": "webp",
      ...placement(decor.pose, depot.hauteurCm, depot.largeurCm),
    };

    // L'agrandissement rattrape les petites photos ; Photoroom le refuse au-delà d'un million de pixels.
    let reponse = await appelerPhotoroom(clePhotoroom, { ...champs, "upscale.mode": "ai.fast" });
    if (reponse.status === 400 && (await reponse.clone().text()).includes("too big")) {
      reponse = await appelerPhotoroom(clePhotoroom, champs);
    }
    if (!reponse.ok) {
      throw new Error(`Photoroom a répondu ${reponse.status} : ${(await reponse.text()).slice(0, 300)}`);
    }

    const type = (reponse.headers.get("content-type") ?? "").split(";")[0];
    const extension = EXTENSIONS[type];
    if (!extension) throw new Error(`format d'image inattendu (${type || "inconnu"})`);

    const chemin = `${depotId}/situation-${Date.now()}-${decor.cle}.${extension}`;
    const envoi = await base.storage
      .from(STOCKAGE_DEPOTS)
      .upload(chemin, await reponse.arrayBuffer(), { contentType: type });
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
  if (!clePhotoroom) return;
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
