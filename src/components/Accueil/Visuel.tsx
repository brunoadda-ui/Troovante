"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { ReglagesVisuel } from "@/lib/reglages/types";
import s from "./Visuel.module.css";

export type TexteVisuel = { texte: string; css: CSSProperties };

type Props = {
  visuel: ReglagesVisuel;
  surtitre?: TexteVisuel;
  titre?: TexteVisuel;
  bouton?: TexteVisuel & { lien: string; forme: "contour" | "plein"; fond: string; texteSurFond: string };
  /** Vrai si la barre de navigation est posée sur la photo (accueil, barre transparente). */
  sousLaBarre: boolean;
};

/** Le visuel d'ouverture de l'accueil : une photo, ou un diaporama, et le texte posé dessus. */
export default function Visuel({ visuel, surtitre, titre, bouton, sousLaBarre }: Props) {
  const { photos, diaporama } = visuel;
  const defile = diaporama.actif && photos.length > 1;
  const visibles = defile ? photos : photos.slice(0, 1);

  const [actif, setActif] = useState(0);
  const [enPause, setEnPause] = useState(false);
  const [mouvementReduit, setMouvementReduit] = useState(false);

  // Si le visiteur a demandé moins d'animations, le diaporama n'avance qu'à la main.
  useEffect(() => {
    const requete = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lire = () => setMouvementReduit(requete.matches);
    requete.addEventListener("change", lire);
    const premier = window.setTimeout(lire, 0);
    return () => {
      window.clearTimeout(premier);
      requete.removeEventListener("change", lire);
    };
  }, []);

  useEffect(() => {
    if (!defile || enPause || mouvementReduit) return;
    const minuterie = window.setInterval(() => setActif((i) => (i + 1) % visibles.length), diaporama.duree * 1000);
    return () => window.clearInterval(minuterie);
  }, [defile, enPause, mouvementReduit, visibles.length, diaporama.duree]);

  const aller = (rang: number) => setActif((rang + visibles.length) % visibles.length);
  const premiere = photos[0];
  const style = {
    "--voile": visuel.voile / 100,
    "--duree": `${diaporama.duree}s`,
    ...(visuel.hauteur === "proportions" && premiere ? { "--ratio": `${premiere.largeur} / ${premiere.hauteur}` } : {}),
  } as CSSProperties;

  return (
    <section
      className={s.hero}
      data-hauteur={visuel.hauteur}
      data-position={visuel.position}
      data-sous-barre={sousLaBarre}
      style={style}
      aria-labelledby={titre ? "accueil-titre" : undefined}
      aria-roledescription={defile ? "diaporama" : undefined}
      onMouseEnter={() => diaporama.pauseSurvol && setEnPause(true)}
      onMouseLeave={() => setEnPause(false)}
    >
      <div className={s.photos} data-transition={defile ? diaporama.transition : "aucune"}>
        <div
          className={s.piste}
          style={diaporama.transition === "glissement" && defile ? { transform: `translateX(-${actif * 100}%)` } : undefined}
        >
          {visibles.map((photo, rang) => (
            <div key={photo.src + rang} className={s.photo} data-active={rang === actif} aria-hidden={rang !== actif}>
              <Image
                src={photo.src}
                alt={rang === 0 ? photo.alt : ""}
                fill
                sizes="100vw"
                priority={rang === 0}
                className={s.image}
                style={{ objectPosition: `${photo.cadrageX}% ${photo.cadrageY}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className={s.voile} aria-hidden="true" />

      <div className={`container ${s.contenu}`}>
        {surtitre && (
          <p className={s.surtitre} style={surtitre.css}>
            {surtitre.texte}
          </p>
        )}
        {titre && (
          <h1 id="accueil-titre" className={s.titre} style={titre.css}>
            {titre.texte.split("\n").map((ligne, i) => (
              <span key={i} className={s.ligne}>
                {ligne}
              </span>
            ))}
          </h1>
        )}
        {bouton && (
          <Link
            href={bouton.lien}
            className={s.bouton}
            data-forme={bouton.forme}
            style={{
              ...bouton.css,
              ...(bouton.forme === "plein"
                ? { color: bouton.texteSurFond, background: bouton.fond, borderColor: bouton.fond }
                : { borderColor: bouton.fond }),
            }}
          >
            {bouton.texte}
            <ArrowRight size={18} strokeWidth={1.5} aria-hidden="true" />
          </Link>
        )}
      </div>

      {defile && diaporama.fleches && (
        <>
          <button type="button" className={`${s.fleche} ${s.flecheGauche}`} aria-label="Photo précédente" onClick={() => aller(actif - 1)}>
            <ChevronLeft size={26} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <button type="button" className={`${s.fleche} ${s.flecheDroite}`} aria-label="Photo suivante" onClick={() => aller(actif + 1)}>
            <ChevronRight size={26} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </>
      )}

      {defile && diaporama.points && (
        <div className={s.points}>
          {visibles.map((photo, rang) => (
            <button
              key={photo.src + rang}
              type="button"
              className={s.point}
              aria-label={`Photo ${rang + 1} sur ${visibles.length}`}
              aria-current={rang === actif ? "true" : undefined}
              onClick={() => aller(rang)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
