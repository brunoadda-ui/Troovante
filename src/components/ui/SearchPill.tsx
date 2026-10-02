import { Search } from "lucide-react";
import s from "./ui.module.css";

type Props = {
  placeholder: string;
  className?: string;
};

/** Champ de recherche : il s'élargit et passe en contour noir quand on clique dedans. */
export default function SearchPill({ placeholder, className }: Props) {
  return (
    <label className={[s.search, className].filter(Boolean).join(" ")}>
      <Search size={20} strokeWidth={1.5} aria-hidden="true" />
      <span className="visually-hidden">Rechercher</span>
      <input type="search" name="q" placeholder={placeholder} className={s.searchInput} autoComplete="off" />
    </label>
  );
}
