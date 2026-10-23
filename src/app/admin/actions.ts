"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { ADMINS, LIEN_CONNEXION, clientSession, connexionConfiguree, exigerAdmin } from "@/lib/auth";
import { getUnivers } from "@/lib/catalogue";
import { STOCKAGE_DEPOTS, STOCKAGE_PHOTOS } from "@/lib/depot";
import { lireDepot } from "@/lib/depots";
import { lireEntier } from "@/lib/filtres";
import { mettreEnSituation } from "@/lib/miseEnSituation";
import { slugifier } from "@/lib/slug";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { PhotoObjet } from "@/lib/types";

export type EtatAction = { statut: "initial" } | { statut: "erreur"; message: string };

/** Résultat d'une publication : réussie, ou refusée avec son motif. */
export type EtatPublication = EtatAction | { statut: "publie" };

const erreur = (message: string): EtatAction => ({ statut: "erreur", message });

const champ = (formulaire: FormData, nom: string, longueurMax: number) =>
  String(formulaire.get(nom) ?? "")
    .trim()
    .replace(/\r\n/g, "\n")
    .slice(0, longueurMax);

// ---------------------------------------------------------------------------
// Connexion
// ---------------------------------------------------------------------------

export async function seConnecter(_precedent: EtatAction, formulaire: FormData): Promise<EtatAction> {
  if (!connexionConfiguree) return erreur("La base de données n’est pas branchée.");

  const email = champ(formulaire, "email", 160).toLowerCase();
  const motDePasse = String(formulaire.get("mot_de_passe") ?? "");
  if (!email || !motDePasse) return erreur("Saisissez votre e-mail et votre mot de passe.");

  const session = await clientSession();
  const { data, error } = await session.auth.signInWithPassword({ email, password: motDePasse });
  if (error || !data.user) return erreur("E-mail ou mot de passe incorrect.");

  // Un compte valide mais non autorisé est aussitôt déconnecté.
  if (!data.user.email_confirmed_at || !ADMINS.includes(data.user.email?.toLowerCase() ?? "")) {
    await session.auth.signOut();
    return erreur("Ce compte n’a pas accès à l’espace privé.");
  }

  redirect("/admin");
}

export async function seDeconnecter() {
  if (connexionConfiguree) await (await clientSession()).auth.signOut();
  redirect(LIEN_CONNEXION);
}

// ---------------------------------------------------------------------------
// Dépôts
// ---------------------------------------------------------------------------

/**
 * Publie un dépôt : crée l'objet au catalogue (et le marchand s'il est
 * nouveau), copie les photos retenues dans le stockage public.
 */
export async function publierDepot(_precedent: EtatAction, formulaire: FormData): Promise<EtatPublication> {
  await exigerAdmin();

  // Toute erreur imprévue est renvoyée avec son motif, pour s'afficher sous le bouton
  // au lieu de remplacer la page par un écran d'erreur générique.
  try {
    return await publierSansControle(formulaire);
  } catch (probleme) {
    const motif = probleme instanceof Error ? probleme.message : String(probleme);
    console.error("Publication d'un dépôt impossible :", probleme);
    return erreur(`Publication impossible : ${motif}`);
  }
}

/** La publication elle-même. À n'appeler qu'après exigerAdmin(). */
async function publierSansControle(formulaire: FormData): Promise<EtatPublication> {
  const depot = await lireDepot(champ(formulaire, "id", 40));
  if (!depot) return erreur("Ce dépôt est introuvable.");
  if (depot.statut === "publie") return erreur("Ce dépôt est déjà publié.");

  const nom = champ(formulaire, "nom", 160);
  const universSlug = champ(formulaire, "univers", 80);
  const origine = champ(formulaire, "origine", 200);
  const signature = champ(formulaire, "signature", 200);
  const histoire = champ(formulaire, "histoire", 4000);
  const dimensions = champ(formulaire, "dimensions", 400);
  const etat = champ(formulaire, "etat", 2000);
  const prix = lireEntier(champ(formulaire, "prix", 12));
  const marchandNom = champ(formulaire, "marchand_nom", 160);
  const marchandVille = champ(formulaire, "marchand_ville", 120);

  if (!nom) return erreur("Donnez un nom à l’objet.");
  if (!origine) return erreur("Indiquez l’époque et l’origine.");
  if (!prix) return erreur("Indiquez le prix affiché, en euros.");
  if (!marchandNom) return erreur("Indiquez le nom public du marchand ou du créateur.");

  const univers = (await getUnivers()).find((u) => u.slug === universSlug);
  if (!univers) return erreur("Choisissez la catégorie de l’objet.");

  // Caractéristiques cochées : on ne garde que celles qui existent dans l'univers choisi.
  const attributs: Record<string, string[]> = {};
  for (const groupe of univers.filtres) {
    const cochees = formulaire.getAll(`attribut:${groupe.cle}`).map(String);
    const valides = groupe.options.filter((option) => cochees.includes(option));
    if (valides.length > 0) attributs[groupe.cle] = valides;
  }

  // Photos retenues : uniquement parmi celles du dépôt, mises en situation en tête.
  const cochees = new Set(formulaire.getAll("photo").map(String));
  const retenues = [
    ...depot.photosSituation.filter((chemin) => cochees.has(chemin)).map((chemin) => ({ chemin, situation: true })),
    ...depot.photosOrigine.filter((chemin) => cochees.has(chemin)).map((chemin) => ({ chemin, situation: false })),
  ];
  if (retenues.length === 0) return erreur("Gardez au moins une photo.");

  const base = supabaseAdmin();

  // Adresse de la fiche : dérivée du nom, avec un numéro si elle est déjà prise.
  const racine = slugifier(nom) || "objet";
  const { data: pris, error: erreurSlug } = await base.from("objets").select("slug").like("slug", `${racine}%`);
  if (erreurSlug) return erreur(`Lecture du catalogue impossible : ${erreurSlug.message}`);
  const dejaPris = new Set((pris ?? []).map((ligne) => ligne.slug as string));
  let slug = racine;
  for (let numero = 2; dejaPris.has(slug); numero++) slug = `${racine}-${numero}`;

  // Marchand (ou créateur) : repris s'il existe déjà, créé sinon.
  const marchandSlug = slugifier(marchandNom);
  const existant = await base.from("marchands").select("id").eq("slug", marchandSlug).maybeSingle();
  if (existant.error) return erreur(`Lecture des marchands impossible : ${existant.error.message}`);
  let marchandId = existant.data?.id as string | undefined;
  if (!marchandId) {
    const cree = await base
      .from("marchands")
      .insert({ slug: marchandSlug, nom: marchandNom, ville: marchandVille || null })
      .select("id")
      .single();
    if (cree.error) return erreur(`Création du marchand impossible : ${cree.error.message}`);
    marchandId = cree.data.id as string;
  }

  // Copie des photos du stockage privé vers le stockage public.
  const objetId = randomUUID();
  const photos: PhotoObjet[] = [];
  for (const [rang, photo] of retenues.entries()) {
    const fichier = await base.storage.from(STOCKAGE_DEPOTS).download(photo.chemin);
    if (fichier.error) return erreur(`Lecture d’une photo impossible : ${fichier.error.message}`);
    const extension = photo.chemin.split(".").pop() ?? "jpg";
    const destination = `objets/${objetId}/${rang + 1}.${extension}`;
    const envoi = await base.storage
      .from(STOCKAGE_PHOTOS)
      .upload(destination, fichier.data, { contentType: fichier.data.type || undefined, upsert: true });
    if (envoi.error) return erreur(`Publication d’une photo impossible : ${envoi.error.message}`);
    photos.push({
      src: base.storage.from(STOCKAGE_PHOTOS).getPublicUrl(destination).data.publicUrl,
      alt: nom,
      ...(photo.situation ? { miseEnSituation: true } : {}),
    });
  }

  const creation = await base.from("objets").insert({
    id: objetId,
    slug,
    univers_slug: univers.slug,
    marchand_id: marchandId,
    nom,
    origine,
    signature: signature || null,
    prix,
    statut: "publie",
    attributs,
    photos,
    histoire: histoire || null,
    dimensions: dimensions || null,
    etat: etat || null,
    publie_le: new Date().toISOString(),
  });
  if (creation.error) return erreur(`Création de la fiche impossible : ${creation.error.message}`);

  const suivi = await base.from("depots").update({ statut: "publie", objet_id: objetId }).eq("id", depot.id);
  if (suivi.error) {
    return erreur(`La fiche est en ligne, mais le dépôt n’a pas pu être marqué comme publié : ${suivi.error.message}`);
  }

  return { statut: "publie" };
}

/**
 * Lance (ou relance) la mise en situation d'un dépôt, avec le décor choisi.
 * L'action attend la fin de la génération (jusqu'à une minute) ; la page se recharge ensuite.
 */
export async function relancerMiseEnSituation(formulaire: FormData) {
  await exigerAdmin();

  const depot = await lireDepot(champ(formulaire, "id", 40));
  if (!depot) redirect("/admin");

  // Ne lève jamais d'erreur : le résultat (image ou motif d'échec) est noté dans le dépôt.
  await mettreEnSituation(depot.id, champ(formulaire, "decor", 40) || undefined);
}

/** Refuse un dépôt (avec une note interne facultative), ou le remet en attente. */
export async function changerStatutDepot(formulaire: FormData) {
  await exigerAdmin();

  const depot = await lireDepot(champ(formulaire, "id", 40));
  const statut = champ(formulaire, "statut", 20);
  // Un dépôt publié a un objet en ligne : son statut ne se change pas ici.
  if (!depot || depot.statut === "publie" || (statut !== "refuse" && statut !== "nouveau")) {
    redirect("/admin");
  }

  const note = champ(formulaire, "note", 2000);
  const { error } = await supabaseAdmin()
    .from("depots")
    .update({ statut, ...(statut === "refuse" ? { note_interne: note || null } : {}) })
    .eq("id", depot.id);
  if (error) throw new Error(`Mise à jour du dépôt impossible : ${error.message}`);

  redirect(statut === "refuse" ? "/admin" : `/admin/depots/${depot.id}`);
}
