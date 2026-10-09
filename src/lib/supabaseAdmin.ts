import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { urlSupabase } from "./supabase";

/**
 * Accès à la base avec la clé SECRÈTE : tous les droits, sans les règles
 * d'accès. À n'utiliser que côté serveur, après avoir contrôlé soi-même ce
 * que la personne a le droit de faire. Ce fichier ne peut pas être chargé
 * par le navigateur (« server-only »).
 */

const cleSecrete = process.env.SUPABASE_SECRET_KEY?.trim() || undefined;

/** Vrai quand l'adresse du projet et la clé secrète sont renseignées dans `.env.local`. */
export const supabaseAdminConfigure = Boolean(urlSupabase && cleSecrete);

let client: SupabaseClient | undefined;

export function supabaseAdmin(): SupabaseClient {
  if (!urlSupabase || !cleSecrete) {
    throw new Error("Clé secrète Supabase absente : renseigner SUPABASE_SECRET_KEY dans .env.local.");
  }
  client ??= createClient(urlSupabase, cleSecrete, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
