import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse, type NextRequest } from "next/server";
import { adminConnecte } from "@/lib/auth";
import { editionPossible } from "@/lib/reglages/fichier";
import { slugifier } from "@/lib/slug";

/**
 * Réception d'une photo pour l'accueil (diaporama, ambiances, marchands).
 * Elle est rangée dans public/images/accueil, sur l'ordinateur où tourne le
 * site, et la réponse donne son adresse.
 */

const FORMATS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const TAILLE_MAX = 15 * 1024 * 1024;
const DOSSIER = path.join(process.cwd(), "public", "images", "accueil");

export async function POST(requete: NextRequest) {
  if (!(await adminConnecte())) return NextResponse.json({ message: "Connexion requise." }, { status: 401 });
  if (!editionPossible) {
    return NextResponse.json({ message: "Les photos ne s’ajoutent que sur l’ordinateur de travail." }, { status: 403 });
  }

  const donnees = await requete.formData().catch(() => null);
  const fichier = donnees?.get("photo");
  if (!(fichier instanceof File)) return NextResponse.json({ message: "Aucune photo reçue." }, { status: 400 });

  const extension = FORMATS[fichier.type];
  if (!extension) return NextResponse.json({ message: "Format accepté : JPEG, PNG ou WebP." }, { status: 415 });
  if (fichier.size > TAILLE_MAX) return NextResponse.json({ message: "La photo dépasse 15 Mo." }, { status: 413 });

  const nom = `${slugifier(fichier.name.replace(/\.[^.]+$/, "")).slice(0, 40) || "photo"}-${randomUUID().slice(0, 8)}.${extension}`;
  await mkdir(DOSSIER, { recursive: true });
  await writeFile(path.join(DOSSIER, nom), Buffer.from(await fichier.arrayBuffer()));

  return NextResponse.json({ src: `/images/accueil/${nom}` });
}
