"use server";

import { randomUUID } from "node:crypto";
import { getUnivers } from "@/lib/catalogue";
import {
  FORMATS_PHOTO,
  PHOTOS_MAX,
  PROFILS,
  STOCKAGE_DEPOTS,
  TAILLE_PHOTO_MAX,
  type EnvoiPhoto,
  type ReponseDepot,
  type ReponsePreparation,
} from "@/lib/depot";
import { lireEntier } from "@/lib/filtres";
import { supabaseAdmin, supabaseAdminConfigure } from "@/lib/supabaseAdmin";

/**
 * Dépôt d'un objet par un professionnel, en deux temps :
 *  1. `preparerEnvoi` délivre des autorisations d'envoi, une par photo ; le
 *     navigateur envoie alors les photos directement dans le stockage privé ;
 *  2. `enregistrerDepot` contrôle la saisie et crée la ligne dans « depots ».
 */

const NON_BRANCHE =
  "Le dépôt ne peut pas encore être enregistré : la base de données n’est pas complètement branchée.";
const ECHEC = "Votre dépôt n’a pas pu être enregistré. Réessayez, ou appelez-nous.";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const refus = (message: string) => ({ ok: false as const, message });

export async function preparerEnvoi(photos: { type: string; taille: number }[]): Promise<ReponsePreparation> {
  if (!Array.isArray(photos) || photos.length < 1) return refus("Ajoutez au moins une photo de l’objet.");
  if (photos.length > PHOTOS_MAX) return refus(`Vous pouvez envoyer ${PHOTOS_MAX} photos au maximum.`);
  for (const photo of photos) {
    if (!FORMATS_PHOTO[photo.type]) return refus("Les photos doivent être au format JPEG, PNG ou WebP.");
    if (!(photo.taille > 0) || photo.taille > TAILLE_PHOTO_MAX) {
      return refus("Une photo dépasse la taille maximale de 15 Mo.");
    }
  }
  if (!supabaseAdminConfigure) return refus(NON_BRANCHE);

  const depotId = randomUUID();
  const stockage = supabaseAdmin().storage.from(STOCKAGE_DEPOTS);
  const envois: EnvoiPhoto[] = [];

  for (const [rang, photo] of photos.entries()) {
    const chemin = `${depotId}/${rang + 1}.${FORMATS_PHOTO[photo.type]}`;
    const { data, error } = await stockage.createSignedUploadUrl(chemin);
    if (error || !data) {
      console.error("Autorisation d'envoi de photo impossible :", error?.message);
      return refus(ECHEC);
    }
    envois.push({ chemin: data.path, jeton: data.token });
  }

  return { ok: true, depotId, envois };
}

const champ = (formulaire: FormData, nom: string, longueurMax: number) =>
  String(formulaire.get(nom) ?? "")
    .trim()
    .slice(0, longueurMax);

/** « 128,5 » → 128.5. Renvoie `undefined` si ce n'est pas une mesure plausible. */
function lireMesure(valeur: string): number | undefined {
  if (!valeur) return undefined;
  const nombre = Number.parseFloat(valeur.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(nombre) && nombre > 0 && nombre < 100_000 ? Math.round(nombre * 10) / 10 : undefined;
}

export async function enregistrerDepot(formulaire: FormData): Promise<ReponseDepot> {
  // Champ invisible pour un humain : s'il est rempli, c'est un robot. On fait comme si de rien n'était.
  if (champ(formulaire, "site_web", 200)) return { ok: true };

  const profil = champ(formulaire, "profil", 20);
  const nom = champ(formulaire, "nom", 120);
  const societe = champ(formulaire, "societe", 160);
  const email = champ(formulaire, "email", 160);
  const telephone = champ(formulaire, "telephone", 30);
  const ville = champ(formulaire, "ville", 120);
  const titre = champ(formulaire, "titre", 160);
  const universSlug = champ(formulaire, "univers", 80);
  const description = champ(formulaire, "description", 4000);
  const origine = champ(formulaire, "origine", 200);
  const signature = champ(formulaire, "signature", 200);
  const etat = champ(formulaire, "etat", 2000);
  const hauteur = lireMesure(champ(formulaire, "hauteur", 12));
  const largeur = lireMesure(champ(formulaire, "largeur", 12));
  const profondeurSaisie = champ(formulaire, "profondeur", 12);
  const profondeur = lireMesure(profondeurSaisie);
  const poidsSaisi = champ(formulaire, "poids", 12);
  const poids = lireMesure(poidsSaisi);
  const prix = lireEntier(champ(formulaire, "prix", 12));
  const depotId = champ(formulaire, "depotId", 40);

  if (!PROFILS.some((p) => p.valeur === profil)) return refus("Précisez si vous êtes marchand ou créateur.");
  if (!nom) return refus("Indiquez votre nom.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return refus("Cette adresse e-mail ne semble pas valide.");
  const chiffres = telephone.replace(/\D/g, "").length;
  if (chiffres < 9 || chiffres > 15) return refus("Ce numéro de téléphone ne semble pas valide.");
  if (!titre) return refus("Donnez un nom à l’objet.");
  if (!description) return refus("Décrivez l’objet en quelques lignes.");
  if (!origine) return refus("Indiquez l’époque et l’origine de l’objet.");
  if (!etat) return refus("Décrivez l’état de l’objet.");
  if (!hauteur || !largeur) return refus("Indiquez au moins la hauteur et la largeur, en centimètres.");
  if (profondeurSaisie && !profondeur) return refus("La profondeur doit être un nombre, en centimètres.");
  if (poidsSaisi && !poids) return refus("Le poids doit être un nombre, en kilos.");
  if (!prix) return refus("Indiquez le prix de vente souhaité, en euros.");
  if (formulaire.get("exclusivite") !== "on") return refus("L’engagement d’exclusivité est nécessaire pour déposer un objet.");
  if (formulaire.get("professionnel") !== "on") return refus("Le dépôt est réservé aux professionnels.");

  if (!(await getUnivers()).some((u) => u.slug === universSlug)) return refus("Choisissez l’univers de l’objet.");
  if (!UUID.test(depotId)) return refus("Les photos n’ont pas été reçues. Réessayez l’envoi.");
  if (!supabaseAdminConfigure) return refus(NON_BRANCHE);

  // On ne fait pas confiance à la liste de photos annoncée par le navigateur :
  // on regarde ce qui est réellement arrivé dans le stockage.
  const base = supabaseAdmin();
  const { data: fichiers, error: erreurListe } = await base.storage.from(STOCKAGE_DEPOTS).list(depotId);
  if (erreurListe) {
    console.error("Lecture des photos d'un dépôt impossible :", erreurListe.message);
    return refus(ECHEC);
  }
  const photos = (fichiers ?? [])
    .map((fichier) => fichier.name)
    .sort()
    .slice(0, PHOTOS_MAX)
    .map((nomFichier) => `${depotId}/${nomFichier}`);
  if (photos.length === 0) return refus("Les photos n’ont pas été reçues. Réessayez l’envoi.");

  const { error } = await base.from("depots").insert({
    id: depotId,
    profil,
    nom,
    societe: societe || null,
    email,
    telephone,
    ville: ville || null,
    titre,
    univers_slug: universSlug,
    description,
    origine,
    signature: signature || null,
    etat,
    hauteur_cm: hauteur,
    largeur_cm: largeur,
    profondeur_cm: profondeur ?? null,
    poids_kg: poids ?? null,
    prix_souhaite: prix,
    exclusivite: true,
    photos_origine: photos,
  });

  if (error) {
    console.error("Enregistrement d'un dépôt impossible :", error.message);
    return refus(ECHEC);
  }

  return { ok: true };
}
