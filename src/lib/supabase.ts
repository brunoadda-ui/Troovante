import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const cle = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/** Vrai dès que les deux réglages de `.env.local` sont renseignés. */
export const supabaseConfigure = Boolean(url && cle);

let client: SupabaseClient | undefined;

/**
 * Accès à la base avec la clé publique : uniquement ce qu'un visiteur anonyme
 * a le droit de faire (lire le catalogue publié, déposer une demande).
 */
export function supabase(): SupabaseClient {
  if (!url || !cle) {
    throw new Error("Supabase n'est pas configuré : renseigner .env.local (voir .env.example).");
  }
  client ??= createClient(url, cle, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
