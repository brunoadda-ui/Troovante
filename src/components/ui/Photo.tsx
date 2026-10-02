import Image from "next/image";
import type { CSSProperties } from "react";
import s from "./ui.module.css";

type Props = {
  /** Sans `src`, l'emplacement reste vide et affiche sa légende. */
  src?: string;
  alt: string;
  legende?: string;
  /** Proportions du cadre, par exemple « 4 / 5 ». Omis si le parent impose la hauteur. */
  ratio?: string;
  /** Largeur occupée à l'écran, pour charger la bonne taille d'image. */
  sizes: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

export default function Photo({ src, alt, legende, ratio, sizes, priority, className, style }: Props) {
  return (
    <div
      className={[s.photo, className].filter(Boolean).join(" ")}
      style={{ ...(ratio ? { aspectRatio: ratio } : null), ...style }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={s.photoImg} />
      ) : (
        <div className={s.photoCaption} aria-hidden="true">
          {legende}
        </div>
      )}
    </div>
  );
}
