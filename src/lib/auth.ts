import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { cleSupabase, urlSupabase } from "./supabase";

/**
 * Connexion à l'espace privé de TROOVANTE (/admin). Les comptes sont ceux de
 * Supabase (Authentication → Users) ; seules les adresses listées dans le
 * réglage ADMIN_EMAILS ont accès.
 */

export const LIEN_CONNEXION = "/admin/connexion";

/** Adresses autorisées, en minuscules. */
export const ADMINS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((adresse) => adresse.trim().toLowerCase())
  .filter(Boolean);

export const connexionConfiguree = Boolean(urlSupabase && cleSupabase);

/** Accès à Supabase au nom de la personne connectée (session gardée dans les cookies). */
export async function clientSession() {
  if (!urlSupabase || !cleSupabase) {
    throw new Error("Supabase n'est pas configuré : renseigner .env.local (voir .env.example).");
  }
  const magasin = await cookies();
  return createServerClient(urlSupabase, cleSupabase, {
    cookies: {
      getAll: () => magasin.getAll(),
      setAll: (aPoser) => {
        try {
          for (const { name, value, options } of aPoser) magasin.set(name, value, options);
        } catch {
          // Pendant l'affichage d'une page, les cookies ne peuvent pas être modifiés :
          // c'est src/proxy.ts qui prolonge la session.
        }
      },
    },
  });
}

/**
 * La personne connectée, si elle est administratrice ; sinon `null`.
 * L'identité est revérifiée auprès de Supabase, une fois par page.
 */
export const adminConnecte = cache(async (): Promise<{ email: string } | null> => {
  if (!connexionConfiguree) return null;
  const session = await clientSession();
  const { data, error } = await session.auth.getUser();
  if (error || !data.user) return null;

  const email = data.user.email?.toLowerCase();
  // Une adresse non confirmée ne prouve rien : n'importe qui peut la saisir à l'inscription.
  if (!email || !data.user.email_confirmed_at) return null;
  return ADMINS.includes(email) ? { email } : null;
});

/** À appeler en tête de chaque page et de chaque action privée. */
export async function exigerAdmin(): Promise<{ email: string }> {
  const admin = await adminConnecte();
  if (!admin) redirect(LIEN_CONNEXION);
  return admin;
}
