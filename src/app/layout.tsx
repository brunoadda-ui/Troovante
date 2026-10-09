import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import Header, { type EntreeMenu } from "@/components/Header/Header";
import { lienTelephone, photosMenu, site } from "@/data/site";
import { getChiffres, getUnivers } from "@/lib/catalogue";
import { urlOption } from "@/lib/filtres";
import { compter, formatNombre } from "@/lib/format";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${site.nom} — ${site.signature}`,
    template: `%s — ${site.nom}`,
  },
  description:
    "Antiquités et objets anciens choisis, datés et vérifiés par nos experts, confiés en exclusivité par des marchands professionnels.",
  // Contenu de démonstration : le site ne doit pas être référencé avant le lancement.
  robots: { index: false, follow: false },
};

/** Chaque lien du menu ouvre l'univers avec le filtre correspondant déjà coché. */
async function construireMenu(): Promise<EntreeMenu[]> {
  const [univers, chiffres] = await Promise.all([getUnivers(), getChiffres()]);

  return univers.map((u) => {
    const nombre = chiffres.parUnivers[u.slug] ?? 0;
    return {
      slug: u.slug,
      nom: u.nom,
      titre: u.titre,
      accroche: u.accroche,
      nombreObjets: compter(nombre, "objet", "objets"),
      voirTout: nombre > 1 ? `Voir les ${formatNombre(nombre)} objets` : "Voir l’univers",
      image: u.image,
      photos: (photosMenu[u.slug] ?? []).map((p) => ({
        label: p.label,
        image: p.image,
        href: urlOption(u.slug, p.groupe, p.option),
      })),
      colonnes: u.filtres.map((g) => ({
        label: g.label,
        liens: g.options.slice(0, 7).map((option) => ({ label: option, href: urlOption(u.slug, g.cle, option) })),
      })),
    };
  });
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bebas.variable}`}>
      <body>
        <Header
          menu={await construireMenu()}
          telephone={site.telephone}
          lienTelephone={lienTelephone(site.telephone)}
        />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
