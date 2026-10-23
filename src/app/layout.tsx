import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import type { CSSProperties } from "react";
import Header, { type EntreeMenu, type ReglageBarre } from "@/components/Header/Header";
import { lienTelephone, photosMenu, site } from "@/data/site";
import { getChiffres, getUnivers } from "@/lib/catalogue";
import { urlOption } from "@/lib/filtres";
import { compter, formatNombre } from "@/lib/format";
import { CLASSES_POLICES } from "@/lib/polices";
import { police } from "@/lib/reglages/css";
import { lireReglages } from "@/lib/reglages/fichier";
import "./globals.css";


/** Le titre de l'onglet du navigateur reprend le slogan réglé pour l'accueil. */
export async function generateMetadata(): Promise<Metadata> {
  const slogan = (await lireReglages()).textes.titre.texte.replace(/\s*\n\s*/g, " ").trim() || site.signature;
  return {
    title: {
      default: `${site.nom} — ${slogan}`,
      template: `%s — ${site.nom}`,
    },
    description:
      "Antiquités et objets anciens choisis, datés et vérifiés par nos experts, confiés en exclusivité par des marchands professionnels.",
    // Contenu de démonstration : le site ne doit pas être référencé avant le lancement.
    robots: { index: false, follow: false },
  };
}

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

/** Les réglages de la barre de navigation, traduits pour l'en-tête. */
async function reglageBarre(): Promise<ReglageBarre> {
  const { barre } = await lireReglages();
  return {
    transparente: barre.transparente,
    liens: barre.liens,
    style: {
      "--nom-police": police(barre.nom.police),
      "--nom-taille": `${barre.nom.taille}px`,
      "--nom-graisse": barre.nom.graisse,
      "--nom-espacement": `${barre.nom.espacement / 100}em`,
      "--nom-decalage": `${barre.nom.decalage}px`,
      "--liens-police": police(barre.liensStyle.police),
      "--liens-taille": `${barre.liensStyle.taille}px`,
      "--liens-graisse": barre.liensStyle.graisse,
    } as CSSProperties,
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [menu, barre] = await Promise.all([construireMenu(), reglageBarre()]);
  return (
    <html lang="fr" className={CLASSES_POLICES}>
      <body>
        <Header
          menu={menu}
          telephone={site.telephone}
          lienTelephone={lienTelephone(site.telephone)}
          barre={barre}
        />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
