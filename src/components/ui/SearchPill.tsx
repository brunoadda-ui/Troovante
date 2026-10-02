import { Search } from "lucide-react";
import s from "./ui.module.css";

type Props = {
  placeholder: string;
  /** Texte déjà recherché, à réafficher dans le champ. */
  valeur?: string;
  className?: string;
};

/**
 * Champ de recherche : il s'élargit et passe en contour noir quand on clique
 * dedans. La touche Entrée ouvre la page de résultats.
 */
export default function SearchPill({ placeholder, valeur, className }: Props) {
  return (
    <form action="/recherche" role="search" className={s.searchForm}>
      <label className={[s.search, className].filter(Boolean).join(" ")}>
        <Search size={20} strokeWidth={1.5} aria-hidden="true" />
        <span className="visually-hidden">Rechercher</span>
        <input
          type="search"
          name="q"
          defaultValue={valeur}
          placeholder={placeholder}
          className={s.searchInput}
          autoComplete="off"
          enterKeyHint="search"
        />
      </label>
    </form>
  );
}
