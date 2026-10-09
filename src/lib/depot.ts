/** Règles du dépôt d'objet, partagées par le formulaire (navigateur) et le serveur. */

/** Espace de stockage privé : photos telles qu'envoyées par les professionnels. */
export const STOCKAGE_DEPOTS = "depots";

/** Espace de stockage public : images des objets publiés sur le site. */
export const STOCKAGE_PHOTOS = "photos";

export const PHOTOS_MAX = 5;
export const TAILLE_PHOTO_MAX = 15 * 1024 * 1024;

/** Formats de photo acceptés, et l'extension du fichier enregistré. */
export const FORMATS_PHOTO: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const PROFILS = [
  { valeur: "marchand", label: "Marchand", detail: "Antiquaire, galeriste, brocanteur" },
  { valeur: "createur", label: "Créateur", detail: "Artisan d’art, designer, artiste" },
] as const;

export type Profil = (typeof PROFILS)[number]["valeur"];

/** Ce que le serveur renvoie pour autoriser l'envoi d'une photo vers le stockage. */
export type EnvoiPhoto = { chemin: string; jeton: string };

export type ReponsePreparation =
  | { ok: true; depotId: string; envois: EnvoiPhoto[] }
  | { ok: false; message: string };

export type ReponseDepot = { ok: true } | { ok: false; message: string };
