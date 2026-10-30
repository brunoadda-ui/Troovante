import "server-only";
import { randomUUID } from "node:crypto";
import {
  FORMATS_PHOTO,
  PHOTOS_MAX,
  STOCKAGE_DEPOTS,
  TAILLE_PHOTO_MAX,
  type ReponseDepot,
  type ReponsePreparation,
} from "./depot";
import { lireDepot } from "./depots";
import { supabaseAdmin } from "./supabaseAdmin";

/**
 * Modification des photos d'un dépôt par TROOVANTE, tant qu'il n'est pas
 * publié : une fois en ligne, l'objet a ses propres copies dans le stockage
 * public. Ces fonctions ne doivent être appelées qu'après `exigerAdmin()`.
 */

const refus = (message: string) => ({ ok: false as const, message });

const REFUS_STATUT = "Ce dépôt n’est plus à traiter : ses photos ne se modifient plus ici.";

async function depotAModifier(depotId: string) {
  const depot = await lireDepot(depotId);
  return depot?.statut === "nouveau" ? depot : undefined;
}

/** Délivre une autorisation d'envoi par photo ajoutée ; le navigateur envoie ensuite les fichiers. */
export async function preparerAjout(
  depotId: string,
  photos: { type: string; taille: number }[],
): Promise<ReponsePreparation> {
  const depot = await depotAModifier(depotId);
  if (!depot) return refus(REFUS_STATUT);
  if (!Array.isArray(photos) || photos.length < 1) return refus("Choisissez au moins une photo.");
  if (depot.photosOrigine.length + photos.length > PHOTOS_MAX) {
    return refus(`Un dépôt compte ${PHOTOS_MAX} photos au maximum.`);
  }
  for (const photo of photos) {
    if (!FORMATS_PHOTO[photo.type]) return refus("Les photos doivent être au format JPEG, PNG ou WebP.");
    if (!(photo.taille > 0) || photo.taille > TAILLE_PHOTO_MAX) {
      return refus("Une photo dépasse la taille maximale de 15 Mo.");
    }
  }

  const stockage = supabaseAdmin().storage.from(STOCKAGE_DEPOTS);
  const envois = [];
  for (const photo of photos) {
    const chemin = `${depot.id}/ajout-${randomUUID()}.${FORMATS_PHOTO[photo.type]}`;
    const { data, error } = await stockage.createSignedUploadUrl(chemin);
    if (error || !data) return refus(`Autorisation d’envoi impossible : ${error?.message ?? "motif inconnu"}`);
    envois.push({ chemin: data.path, jeton: data.token });
  }
  return { ok: true, depotId: depot.id, envois };
}

/** Rattache au dépôt les photos réellement arrivées dans le stockage. */
export async function confirmerAjout(depotId: string, chemins: string[]): Promise<ReponseDepot> {
  const depot = await depotAModifier(depotId);
  if (!depot) return refus(REFUS_STATUT);

  const base = supabaseAdmin();
  const { data: fichiers, error } = await base.storage.from(STOCKAGE_DEPOTS).list(depot.id);
  if (error) return refus(`Lecture des photos impossible : ${error.message}`);
  const presents = new Set((fichiers ?? []).map((fichier) => `${depot.id}/${fichier.name}`));

  const nouvelles = chemins.filter((chemin) => presents.has(chemin) && !depot.photosOrigine.includes(chemin));
  if (nouvelles.length === 0) return refus("Les photos n’ont pas été reçues. Réessayez l’envoi.");

  const suivi = await base
    .from("depots")
    .update({ photos_origine: [...depot.photosOrigine, ...nouvelles].slice(0, PHOTOS_MAX) })
    .eq("id", depot.id);
  if (suivi.error) return refus(`Mise à jour du dépôt impossible : ${suivi.error.message}`);
  return { ok: true };
}

/** Retire définitivement une photo reçue ou une mise en situation. */
export async function supprimerPhoto(depotId: string, chemin: string): Promise<ReponseDepot> {
  const depot = await depotAModifier(depotId);
  if (!depot) return refus(REFUS_STATUT);

  const estOrigine = depot.photosOrigine.includes(chemin);
  if (!estOrigine && !depot.photosSituation.includes(chemin)) return refus("Cette photo n’existe plus.");
  // La mise en situation et la publication ont besoin d'au moins une photo de l'objet.
  if (estOrigine && depot.photosOrigine.length === 1) {
    return refus("C’est la dernière photo de l’objet : ajoutez-en une autre avant de la supprimer.");
  }

  const base = supabaseAdmin();
  const suivi = await base
    .from("depots")
    .update({
      photos_origine: depot.photosOrigine.filter((c) => c !== chemin),
      photos_situation: depot.photosSituation.filter((c) => c !== chemin),
    })
    .eq("id", depot.id);
  if (suivi.error) return refus(`Mise à jour du dépôt impossible : ${suivi.error.message}`);

  // La photo n'est déjà plus rattachée au dépôt : un fichier resté dans le stockage ne gêne rien.
  const retrait = await base.storage.from(STOCKAGE_DEPOTS).remove([chemin]);
  if (retrait.error) console.error("Suppression d'une photo du stockage impossible :", retrait.error.message);
  return { ok: true };
}

/** Met une photo en tête : c'est la photo principale qui sert à la mise en situation. */
export async function mettreEnPrincipale(depotId: string, chemin: string): Promise<ReponseDepot> {
  const depot = await depotAModifier(depotId);
  if (!depot) return refus(REFUS_STATUT);
  if (!depot.photosOrigine.includes(chemin)) return refus("Cette photo n’existe plus.");

  const suivi = await supabaseAdmin()
    .from("depots")
    .update({ photos_origine: [chemin, ...depot.photosOrigine.filter((c) => c !== chemin)] })
    .eq("id", depot.id);
  if (suivi.error) return refus(`Mise à jour du dépôt impossible : ${suivi.error.message}`);
  return { ok: true };
}
