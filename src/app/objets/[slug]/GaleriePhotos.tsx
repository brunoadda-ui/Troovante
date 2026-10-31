"use client";

import { useState } from "react";
import Photo from "@/components/ui/Photo";
import PromoBadge from "@/components/ui/PromoBadge";
import type { PhotoObjet } from "@/lib/types";
import s from "./objet.module.css";

type Props = { photos: PhotoObjet[]; nom: string };

const TAILLE_GRANDE = "(min-width: 800px) 50vw, 100vw";

/**
 * Les photos d'un objet. Survoler une petite photo l'affiche en grand le temps
 * du survol ; cliquer dessus l'échange avec la grande photo.
 */
export default function GaleriePhotos({ photos, nom }: Props) {
  const [ordre, setOrdre] = useState(photos);
  // Rang de la petite photo survolée (ou atteinte au clavier), montrée en grand.
  const [apercu, setApercu] = useState<number | null>(null);

  if (photos.length === 0) {
    return <Photo alt={nom} legende="Photo à venir" ratio="4 / 5" sizes={TAILLE_GRANDE} priority />;
  }

  const [principale, ...autres] = ordre;
  const affichee = apercu === null ? principale : autres[apercu];

  const echanger = (rang: number) => {
    setOrdre([autres[rang], ...autres.map((photo, i) => (i === rang ? principale : photo))]);
    setApercu(null);
  };

  return (
    <>
      <div className={s.mainPhoto}>
        {/* Toutes les grandes photos sont chargées d'avance : le survol les affiche sans délai. */}
        {photos.map((photo, rang) => (
          <div key={photo.src} className={s.calque} data-visible={photo.src === affichee.src} aria-hidden={photo.src !== affichee.src}>
            <Photo src={photo.src} alt={photo.alt ?? nom} ratio="4 / 5" sizes={TAILLE_GRANDE} priority={rang === 0} />
          </div>
        ))}
        {affichee.miseEnSituation && (
          <span className={s.staged}>
            <PromoBadge>Mise en situation</PromoBadge>
          </span>
        )}
      </div>
      {autres.length > 0 && (
        <div className={s.thumbs}>
          {/* Clé par position : après un échange, le bouton sous la souris reste le même et ne relance pas d'aperçu. */}
          {autres.map((photo, rang) => (
            <button
              key={rang}
              type="button"
              className={s.thumb}
              aria-label={`Afficher en grand : ${photo.alt ?? nom}`}
              data-apercu={apercu === rang}
              onMouseEnter={() => setApercu(rang)}
              onMouseLeave={() => setApercu(null)}
              onFocus={() => setApercu(rang)}
              onBlur={() => setApercu(null)}
              onClick={() => echanger(rang)}
            >
              <Photo src={photo.src} alt="" ratio="1 / 1" sizes="(min-width: 800px) 17vw, 33vw" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
