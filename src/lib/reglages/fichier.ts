import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { REGLAGES_ORIGINE } from "./defauts";
import { nettoyerReglages } from "./nettoyage";
import type { ReglagesAccueil, RubriqueReglages } from "./types";

/**
 * Lecture et écriture des réglages de l'accueil dans reglages/accueil.json,
 * à la racine du dossier du site. Rien ne part sur Internet.
 */

const DOSSIER = path.join(process.cwd(), "reglages");
const FICHIER = path.join(DOSSIER, "accueil.json");

/**
 * Les réglages ne se modifient que sur l'ordinateur de travail (site lancé
 * par « npm run dev ») : un site mis en ligne ne peut pas réécrire ses
 * propres fichiers.
 */
export const editionPossible = process.env.NODE_ENV === "development";

/** Les réglages en vigueur, lus une fois par page. Sans fichier, ce sont ceux d'origine. */
export const lireReglages = cache(async (): Promise<ReglagesAccueil> => {
  try {
    return nettoyerReglages(JSON.parse(await readFile(FICHIER, "utf8")));
  } catch (erreur) {
    if ((erreur as NodeJS.ErrnoException).code !== "ENOENT") {
      console.error("Réglages de l'accueil illisibles, réglages d'origine utilisés :", erreur);
    }
    return REGLAGES_ORIGINE;
  }
});

async function ecrire(reglages: ReglagesAccueil) {
  if (!editionPossible) throw new Error("Les réglages ne se modifient que sur l'ordinateur de travail.");
  await mkdir(DOSSIER, { recursive: true });
  // Écriture dans un fichier temporaire puis renommage : jamais de fichier à moitié écrit.
  const provisoire = `${FICHIER}.${process.pid}.tmp`;
  await writeFile(provisoire, `${JSON.stringify(reglages, null, 2)}\n`, "utf8");
  await rename(provisoire, FICHIER);
}

/** Remplace une rubrique par les valeurs envoyées, une fois remises en forme. Renvoie les réglages enregistrés. */
export async function enregistrerRubrique<R extends RubriqueReglages>(
  rubrique: R,
  valeur: unknown,
): Promise<ReglagesAccueil> {
  const actuels = await lireReglagesFrais();
  const suivants = nettoyerReglages({ ...actuels, [rubrique]: valeur });
  await ecrire(suivants);
  return suivants;
}

/** Remet une rubrique à ses réglages d'origine. */
export async function retablirRubrique(rubrique: RubriqueReglages): Promise<ReglagesAccueil> {
  return enregistrerRubrique(rubrique, REGLAGES_ORIGINE[rubrique]);
}

/** Relit le fichier sans passer par le cache de la page (avant une écriture). */
async function lireReglagesFrais(): Promise<ReglagesAccueil> {
  try {
    return nettoyerReglages(JSON.parse(await readFile(FICHIER, "utf8")));
  } catch {
    return REGLAGES_ORIGINE;
  }
}
