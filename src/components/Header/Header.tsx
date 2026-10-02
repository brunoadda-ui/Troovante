"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight, Heart, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import IconButton from "@/components/ui/IconButton";
import Photo from "@/components/ui/Photo";
import SearchPill from "@/components/ui/SearchPill";
import { useFavoris } from "@/lib/favoris";
import s from "./Header.module.css";

export type EntreeMenu = {
  slug: string;
  nom: string;
  titre: string;
  accroche: string;
  /** Libellé déjà accordé : « 12 objets », « 1 objet ». */
  nombreObjets: string;
  /** Libellé du bouton du menu : « Voir les 12 objets ». */
  voirTout: string;
  image?: string;
  colonnes: { label: string; liens: { label: string; href: string }[] }[];
};

type Props = {
  menu: EntreeMenu[];
  telephone: string;
  lienTelephone: string;
};

const PLACEHOLDER_RECHERCHE = "Rechercher un objet, un style, une époque";

export default function Header({ menu, telephone, lienTelephone }: Props) {
  // Univers dont le grand menu est déplié (ordinateur).
  const [ouvert, setOuvert] = useState<string | null>(null);
  // Menu plein écran (mobile et tablette).
  const [tiroir, setTiroir] = useState(false);
  const nombreFavoris = useFavoris().length;

  const fermer = () => setOuvert(null);
  const fermerTiroir = () => setTiroir(false);
  const entree = menu.find((m) => m.slug === ouvert);

  // Tant que le menu mobile est ouvert, la page derrière ne défile pas.
  // Il se referme avec Échap, ou si la fenêtre redevient assez large pour la barre complète.
  useEffect(() => {
    if (!tiroir) return;
    const precedent = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const ecranLarge = window.matchMedia("(min-width: 1280px)");
    const surElargissement = () => {
      if (ecranLarge.matches) setTiroir(false);
    };
    const surTouche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setTiroir(false);
    };
    ecranLarge.addEventListener("change", surElargissement);
    window.addEventListener("keydown", surTouche);

    return () => {
      document.body.style.overflow = precedent;
      ecranLarge.removeEventListener("change", surElargissement);
      window.removeEventListener("keydown", surTouche);
    };
  }, [tiroir]);

  return (
    <header>
      <div className={s.utility}>
        <span>Nos experts</span>
        <span>Aide</span>
        <Link href="/vendre" className={s.utilityLink}>
          Vendre un objet
        </Link>
        <span>Se connecter</span>
      </div>

      <div
        className={s.navWrap}
        onMouseLeave={fermer}
        onKeyDown={(e) => {
          if (e.key === "Escape") fermer();
        }}
      >
        <div className={s.bar}>
          <Link href="/" className={s.logo} onClick={fermer} aria-label="TROOVANTE — accueil">
            <Image src="/images/troovante-logo.png" alt="" width={45} height={34} className={s.logoImg} priority />
            <span className={s.wordmark}>TROOVANTE</span>
          </Link>

          <nav className={s.links} aria-label="Univers">
            {menu.map((m) => (
              <Link
                key={m.slug}
                href={`/univers/${m.slug}`}
                className={s.navLink}
                data-open={ouvert === m.slug}
                aria-expanded={ouvert === m.slug}
                onMouseEnter={() => setOuvert(m.slug)}
                onFocus={() => setOuvert(m.slug)}
                onClick={fermer}
              >
                {m.nom}
                <ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" className={s.caret} />
              </Link>
            ))}
            <Link href="/vendre" className={s.navLink} onMouseEnter={fermer} onFocus={fermer}>
              Vendre un objet
            </Link>
          </nav>

          <div className={s.tools}>
            <SearchPill placeholder={PLACEHOLDER_RECHERCHE} className={s.searchDesktop} />
            <Link
              href="/favoris"
              className={s.favoris}
              aria-label={nombreFavoris > 0 ? `Mes favoris (${nombreFavoris})` : "Mes favoris"}
              onClick={fermer}
            >
              <Heart size={20} strokeWidth={1.5} aria-hidden="true" />
              {nombreFavoris > 0 && <span className={s.count}>{nombreFavoris}</span>}
            </Link>
            <IconButton label="Ouvrir le menu" className={s.burger} onClick={() => setTiroir(true)}>
              <Menu size={22} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </div>

          <SearchPill placeholder={PLACEHOLDER_RECHERCHE} className={s.searchMobile} />
        </div>

        {entree && (
          <div className={s.panel}>
            <div className={s.panelInner}>
              {entree.colonnes.map((col, i) => (
                <div
                  key={`${entree.slug}-${col.label}`}
                  className={s.col}
                  style={{ animationDelay: `${60 + i * 50}ms` }}
                >
                  <div className={s.colLabel}>{col.label}</div>
                  {col.liens.map((lien) => (
                    <Link key={lien.label} href={lien.href} className={s.colLink} onClick={fermer}>
                      {lien.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div key={`${entree.slug}-promo`} className={s.col} style={{ animationDelay: "120ms" }}>
                <Photo
                  src={entree.image}
                  alt={`${entree.titre} — photo d’ambiance`}
                  legende={entree.titre}
                  ratio="4 / 3"
                  sizes="(min-width: 1024px) 25vw, 100vw"
                />
                <div className={s.promo}>{entree.accroche}</div>
                <div>
                  <Button href={`/univers/${entree.slug}`} onClick={fermer}>
                    {entree.voirTout}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {tiroir && (
        <div className={s.drawer} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={s.drawerTop}>
            <Link href="/" className={s.logo} onClick={fermerTiroir} aria-label="TROOVANTE — accueil">
              <Image src="/images/troovante-logo.png" alt="" width={45} height={34} className={s.logoImg} />
              <span className={s.wordmark}>TROOVANTE</span>
            </Link>
            <IconButton label="Fermer le menu" onClick={fermerTiroir}>
              <X size={22} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </div>

          <nav className={s.drawerNav} aria-label="Univers">
            {menu.map((m) => (
              <Link key={m.slug} href={`/univers/${m.slug}`} className={s.drawerLink} onClick={fermerTiroir}>
                <span>
                  {m.nom}
                  <span className={s.drawerCount}>{m.nombreObjets}</span>
                </span>
                <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            ))}
            <Link href="/vendre" className={s.drawerLink} onClick={fermerTiroir}>
              Vendre un objet
              <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </Link>
          </nav>

          <div className={s.drawerFoot}>
            <span>Nos experts</span>
            <span>Aide</span>
            <span>Se connecter</span>
            <a href={lienTelephone} className={s.drawerPhone}>
              {telephone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
