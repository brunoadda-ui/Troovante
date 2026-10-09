import type { NextConfig } from "next";

/**
 * Les photos des objets publiés sont servies par le stockage public de
 * Supabase : on autorise ce seul emplacement comme source d'images externe.
 */
function imagesSupabase(): URL[] {
  try {
    const projet = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").origin;
    return [new URL(`${projet}/storage/v1/object/public/**`)];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imagesSupabase(),
  },
};

export default nextConfig;
