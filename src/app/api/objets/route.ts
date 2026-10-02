import { NextResponse, type NextRequest } from "next/server";
import { getObjetsParSlugs, versCarte } from "@/lib/catalogue";

/** /api/objets?slugs=a,b,c → les cartes des objets demandés (page « Mes favoris »). */
export async function GET(requete: NextRequest) {
  const slugs = (requete.nextUrl.searchParams.get("slugs") ?? "").split(",").filter(Boolean).slice(0, 200);
  const objets = await getObjetsParSlugs(slugs);
  return NextResponse.json(objets.map((objet) => versCarte(objet, true)));
}
