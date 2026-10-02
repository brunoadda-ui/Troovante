import Link from "next/link";
import { Heart } from "lucide-react";
import Photo from "@/components/ui/Photo";
import PromoBadge from "@/components/ui/PromoBadge";
import s from "./ObjetCard.module.css";

type Props = {
  nom: string;
  meta: string;
  prix: string;
  ratio: "4 / 5" | "1 / 1";
  image?: string;
  /** Légende affichée dans le cadre tant qu'il n'y a pas de photo. */
  legende: string;
  sizes: string;
  /** Sans `href`, la carte n'est pas cliquable. */
  href?: string;
  /** Étiquette posée en haut à gauche de la photo. */
  badge?: string;
  /** Affiche le cœur « favori » en haut à droite de la photo. */
  favori?: boolean;
  /** Mention en couleur d'accent, à côté du prix. */
  mention?: string;
};

/** Carte objet : une photo, puis le texte directement dessous. Ni cadre, ni ombre. */
export default function ObjetCard({
  nom,
  meta,
  prix,
  ratio,
  image,
  legende,
  sizes,
  href,
  badge,
  favori,
  mention,
}: Props) {
  const contenu = (
    <>
      <div className={s.media}>
        <Photo src={image} alt={nom} legende={legende} ratio={ratio} sizes={sizes} />
        {badge && (
          <span className={s.badge}>
            <PromoBadge>{badge}</PromoBadge>
          </span>
        )}
        {favori && (
          <span className={s.heart}>
            <Heart size={18} strokeWidth={1.5} aria-hidden="true" />
          </span>
        )}
      </div>
      <div className={s.name}>{nom}</div>
      <div className={s.meta}>{meta}</div>
      <div className={s.price}>
        <span>{prix}</span>
        {mention && <span className={s.mention}>{mention}</span>}
      </div>
    </>
  );

  return href ? (
    <Link href={href} className={s.card}>
      {contenu}
    </Link>
  ) : (
    <div className={s.card}>{contenu}</div>
  );
}
