import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * L'adresse du projet Supabase, réduite à sa racine : l'écran « Data API » de
 * Supabase propose une adresse terminée par « /rest/v1/ », qu'il faut retirer.
 */
function adresseProjet(brut: string | undefined): string | undefined {
  if (!brut?.trim()) return undefined;
  try {
    return new URL(brut.trim()).origin;
  } catch {
    return undefined;
  }
}

export const urlSupabase = adresseProjet(process.env.NEXT_PUBLIC_SUPABASE_URL);
export const cleSupabase = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() || undefined;

/** Vrai dès que les deux réglages de `.env.local` sont renseignés. */
export const supabaseConfigure = Boolean(urlSupabase && cleSupabase);

let client: SupabaseClient | undefined;

/**
 * Accès à la base avec la clé publique : uniquement ce qu'un visiteur anonyme
 * a le droit de faire (lire le catalogue publié, déposer une demande).
 */
export function supabase(): SupabaseClient {
  if (!urlSupabase || !cleSupabase) {
    throw new Error("Supabase n'est pas configuré : renseigner .env.local (voir .env.example).");
  }
  client ??= createClient(urlSupabase, cleSupabase, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
