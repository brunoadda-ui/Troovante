import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { cleSupabase, urlSupabase } from "@/lib/supabase";

/**
 * Prolonge la session de la personne connectée à l'espace privé : la connexion
 * Supabase expire au bout d'une heure, et seul ce fichier peut renouveler ses
 * cookies pendant l'affichage d'une page. Il ne décide pas qui a le droit
 * d'entrer : ce contrôle est fait dans chaque page et chaque action (auth.ts).
 */
export async function proxy(requete: NextRequest) {
  let reponse = NextResponse.next({ request: requete });
  if (!urlSupabase || !cleSupabase) return reponse;

  const session = createServerClient(urlSupabase, cleSupabase, {
    cookies: {
      getAll: () => requete.cookies.getAll(),
      setAll: (aPoser) => {
        for (const { name, value } of aPoser) requete.cookies.set(name, value);
        reponse = NextResponse.next({ request: requete });
        for (const { name, value, options } of aPoser) reponse.cookies.set(name, value, options);
      },
    },
  });

  await session.auth.getUser();
  return reponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
