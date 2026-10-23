"use server";

import { exigerAdmin } from "@/lib/auth";
import { editionPossible, enregistrerRubrique, retablirRubrique } from "@/lib/reglages/fichier";
import type { ReglagesAccueil, RubriqueReglages } from "@/lib/reglages/types";

export type ReponseReglages = { ok: true; reglages: ReglagesAccueil } | { ok: false; message: string };

const RUBRIQUES: RubriqueReglages[] = ["visuel", "textes", "apparence", "sections", "barre"];

async function verifier(rubrique: RubriqueReglages): Promise<string | null> {
  await exigerAdmin();
  if (!editionPossible) return "Les réglages ne se modifient que sur l’ordinateur de travail (site lancé avec npm run dev).";
  if (!RUBRIQUES.includes(rubrique)) return "Rubrique inconnue.";
  return null;
}

/** Enregistre une rubrique : elle s'applique aussitôt à l'accueil. */
export async function sauverRubrique(rubrique: RubriqueReglages, valeur: unknown): Promise<ReponseReglages> {
  const refus = await verifier(rubrique);
  if (refus) return { ok: false, message: refus };
  try {
    return { ok: true, reglages: await enregistrerRubrique(rubrique, valeur) };
  } catch (erreur) {
    console.error("Enregistrement des réglages impossible :", erreur);
    return { ok: false, message: "Les réglages n’ont pas pu être enregistrés." };
  }
}

/** Remet une rubrique à ses réglages d'origine. */
export async function retablirReglages(rubrique: RubriqueReglages): Promise<ReponseReglages> {
  const refus = await verifier(rubrique);
  if (refus) return { ok: false, message: refus };
  try {
    return { ok: true, reglages: await retablirRubrique(rubrique) };
  } catch (erreur) {
    console.error("Retour aux réglages d'origine impossible :", erreur);
    return { ok: false, message: "Les réglages d’origine n’ont pas pu être rétablis." };
  }
}
