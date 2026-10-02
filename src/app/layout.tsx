import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Footer from "@/components/Footer/Footer";
import Header, { type EntreeMenu } from "@/components/Header/Header";
import { getUnivers } from "@/data/catalogue";
import { lienTelephone, site } from "@/data/site";
import { formatNombre } from "@/lib/format";
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

function construireMenu(): EntreeMenu[] {
  return getUnivers().map((u) => ({
    slug: u.slug,
    nom: u.nom,
    titre: u.titre,
    accroche: u.accroche,
    nombreObjets: formatNombre(u.nombreObjets),
    image: u.image,
    colonnes: [
      { label: "Sous-univers", liens: u.tuiles.map((t) => t.label) },
      ...u.filtres.map((g) => ({ label: g.label, liens: g.options.slice(0, 7) })),
    ],
  }));
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${inter.variable} ${bebas.variable}`}>
      <body>
        <Header menu={construireMenu()} telephone={site.telephone} lienTelephone={lienTelephone(site.telephone)} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
