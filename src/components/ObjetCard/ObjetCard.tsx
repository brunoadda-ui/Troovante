import Link from "next/link";
import FavoriButton from "@/components/Favoris/FavoriButton";
import Photo from "@/components/ui/Photo";
import PromoBadge from "@/components/ui/PromoBadge";
import { formatPrix } from "@/lib/format";
import type { CarteObjet } from "@/lib/types";
import s from "./ObjetCard.module.css";

type Props = {
  objet: CarteObjet;
  ratio: "4 / 5" | "1 / 1";
  sizes: string;
  /** Étiquette posée en haut à gauche de la photo. */
  badge?: string;
  /** Affiche le cœur « favori » en haut à droite de la photo. */
  favori?: boolean;
  /** Mention en couleur d'accent, à côté du prix. */
  mention?: string;
};

/** Carte objet : une photo, puis le texte directement dessous. Ni cadre, ni ombre. */
export default function ObjetCard({ objet, ratio, sizes, badge, favori, mention }: Props) {
  return (
    <div className={s.card}>
      <Link href={`/objets/${objet.slug}`} className={s.link}>
        <div className={s.media}>
          <Photo src={objet.image} alt={objet.nom} legende="Photo à venir" ratio={ratio} sizes={sizes} />
          {badge && (
            <span className={s.badge}>
              <PromoBadge>{badge}</PromoBadge>
            </span>
          )}
        </div>
        <div className={s.name}>{objet.nom}</div>
        <div className={s.meta}>{objet.meta}</div>
        <div className={s.price}>
          <span>{formatPrix(objet.prix)}</span>
          {mention && <span className={s.mention}>{mention}</span>}
        </div>
      </Link>
      {/* Hors du lien : un bouton ne peut pas se trouver dans un lien. */}
      {favori && <FavoriButton slug={objet.slug} nom={objet.nom} className={s.heart} />}
    </div>
  );
}
