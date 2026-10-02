import type { Metadata } from "next";
import ListeFavoris from "@/components/Favoris/ListeFavoris";
import s from "@/components/Favoris/Favoris.module.css";

export const metadata: Metadata = { title: "Mes favoris" };

export default function PageFavoris() {
  return (
    <div className={`container ${s.page}`}>
      <h1 className={s.title}>Mes favoris</h1>
      <p className={s.note}>Vos favoris sont gardés dans ce navigateur, sans création de compte.</p>
      <ListeFavoris />
    </div>
  );
}
