"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { ChevronRight, Heart, Menu, Search, X } from "lucide-react";
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
  /** Photo d'ambiance, affichée seule quand l'univers n'a pas de photos cliquables. */
  image?: string;
  /** Photos cliquables, à droite des colonnes : chacune mène à une catégorie. */
  photos: { label: string; image?: string; href: string }[];
  colonnes: { label: string; liens: { label: string; href: string }[] }[];
};

/** Réglages de la barre (voir /admin/reglages). */
export type ReglageBarre = {
  /** Barre posée sur la photo de l'accueil, en blanc, jusqu'au premier défilement. */
  transparente: boolean;
  /** Liens dans l'ordre : slugs d'univers et « espace-professionnel », avec leur titre éventuellement renommé. */
  liens: { cle: string; afficher: boolean; libelle?: string }[];
  /** Variables CSS du nom TROOVANTE et des liens (police, taille, épaisseur, espacement). */
  style: CSSProperties;
};

type Props = {
  menu: EntreeMenu[];
  telephone: string;
  lienTelephone: string;
  barre: ReglageBarre;
};

type LienBarre = { cle: string; label: string; href: string; entree?: EntreeMenu };

/** Les liens à afficher, dans l'ordre réglé. Un univers absent des réglages s'ajoute à la fin. */
function liensAffiches(menu: EntreeMenu[], reglage: ReglageBarre["liens"]): LienBarre[] {
  const ordre = [...reglage];
  for (const m of menu) if (!ordre.some((l) => l.cle === m.slug)) ordre.push({ cle: m.slug, afficher: true });
  if (!ordre.some((l) => l.cle === "espace-professionnel")) ordre.push({ cle: "espace-professionnel", afficher: true });

  return ordre.flatMap((lien): LienBarre[] => {
    if (!lien.afficher) return [];
    if (lien.cle === "espace-professionnel") {
      return [{ cle: lien.cle, label: lien.libelle || "Espace professionnel", href: "/espace-professionnel" }];
    }
    const entree = menu.find((m) => m.slug === lien.cle);
    return entree ? [{ cle: entree.slug, label: lien.libelle || entree.nom, href: `/univers/${entree.slug}`, entree }] : [];
  });
}

const PLACEHOLDER_RECHERCHE = "Rechercher un objet, un style, une époque";

/** Vrai dès que la page a défilé de quelques pixels. Faux côté serveur. */
function useADefile(): boolean {
  return useSyncExternalStore(
    (surChangement) => {
      window.addEventListener("scroll", surChangement, { passive: true });
      return () => window.removeEventListener("scroll", surChangement);
    },
    () => window.scrollY > 24,
    () => false,
  );
}

export default function Header({ menu, telephone, lienTelephone, barre }: Props) {
  // Univers dont le grand menu est déplié (ordinateur).
  const [ouvert, setOuvert] = useState<string | null>(null);
  // Menu plein écran (mobile et tablette).
  const [tiroir, setTiroir] = useState(false);
  const nombreFavoris = useFavoris().length;
  const chemin = usePathname();
  const aDefile = useADefile();

  // Sur l'accueil, la barre est posée sur la photo, transparente, en blanc.
  // Elle redevient blanche dès qu'on fait défiler la page ou qu'un menu s'ouvre.
  const accueil = chemin === "/";
  const transparente = accueil && barre.transparente && !aDefile && !ouvert;
  const liens = liensAffiches(menu, barre.liens);

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
    <header
      className={[s.header, accueil && barre.transparente ? s.headerAccueil : "", transparente ? s.transparent : ""]
        .filter(Boolean)
        .join(" ")}
      style={barre.style}
    >
      <div
        className={s.navWrap}
        onMouseLeave={fermer}
        onKeyDown={(e) => {
          if (e.key === "Escape") fermer();
        }}
      >
        <div className={s.bar}>
          <Link href="/" className={s.logo} onClick={fermer} aria-label="TROOVANTE — accueil">
            <span className={s.wordmark}>TROOVANTE</span>
          </Link>

          <nav className={s.links} aria-label="Univers">
            {liens.map((lien) =>
              lien.entree ? (
                <Link
                  key={lien.cle}
                  href={lien.href}
                  className={s.navLink}
                  data-open={ouvert === lien.cle}
                  aria-expanded={ouvert === lien.cle}
                  aria-current={chemin.startsWith(lien.href) ? "page" : undefined}
                  onMouseEnter={() => setOuvert(lien.cle)}
                  onFocus={() => setOuvert(lien.cle)}
                  onClick={fermer}
                >
                  {lien.label}
                </Link>
              ) : (
                <Link
                  key={lien.cle}
                  href={lien.href}
                  className={s.navLink}
                  onMouseEnter={fermer}
                  onFocus={fermer}
                  aria-current={chemin.startsWith(lien.href) ? "page" : undefined}
                >
                  {lien.label}
                </Link>
              ),
            )}
          </nav>

          <div className={s.tools}>
            <SearchPill placeholder={PLACEHOLDER_RECHERCHE} className={s.searchDesktop} />
            {/* Sur téléphone et tablette, la loupe ouvre la page de recherche. */}
            <Link href="/recherche" className={s.searchLink} aria-label="Rechercher" onClick={fermer}>
              <Search size={20} strokeWidth={1.5} aria-hidden="true" />
            </Link>
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

        </div>

        {entree && (
          <div className={s.panel}>
            {/* Les colonnes de liens, puis deux emplacements de photo à droite. */}
            <div
              className={s.panelInner}
              style={{ gridTemplateColumns: `repeat(${entree.colonnes.length + 2}, minmax(0, 1fr))` }}
            >
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
              {entree.photos.length > 0 ? (
                <div key={`${entree.slug}-photos`} className={s.visuels} style={{ animationDelay: "120ms" }}>
                  {entree.photos.map((photo) => (
                    <Link key={photo.label} href={photo.href} className={s.photoLien} onClick={fermer}>
                      <Photo
                        src={photo.image}
                        alt=""
                        legende={photo.label}
                        ratio="4 / 3"
                        sizes="(min-width: 1024px) 25vw, 100vw"
                      />
                      <span className={s.photoLabel}>{photo.label}</span>
                    </Link>
                  ))}
                  <div className={s.visuelsPied}>
                    <div className={s.promo}>{entree.accroche}</div>
                    <Button href={`/univers/${entree.slug}`} onClick={fermer}>
                      {entree.voirTout}
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  key={`${entree.slug}-promo`}
                  className={`${s.col} ${s.colPromo}`}
                  style={{ animationDelay: "120ms" }}
                >
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
              )}
            </div>
          </div>
        )}
      </div>

      {tiroir && (
        <div className={s.drawer} role="dialog" aria-modal="true" aria-label="Menu">
          <div className={s.drawerTop}>
            <Link href="/" className={s.logo} onClick={fermerTiroir} aria-label="TROOVANTE — accueil">
              <span className={s.wordmark}>TROOVANTE</span>
            </Link>
            <IconButton label="Fermer le menu" onClick={fermerTiroir}>
              <X size={22} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </div>

          <nav className={s.drawerNav} aria-label="Univers">
            {liens.map((lien) => (
              <Link key={lien.cle} href={lien.href} className={s.drawerLink} onClick={fermerTiroir}>
                <span>
                  {lien.label}
                  {lien.entree && <span className={s.drawerCount}>{lien.entree.nombreObjets}</span>}
                </span>
                <ChevronRight size={20} strokeWidth={1.5} aria-hidden="true" />
              </Link>
            ))}
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
