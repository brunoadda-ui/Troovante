import Link from "next/link";
import { mentionsLegales, piedDePage, type LienPied } from "@/data/site";
import s from "./Footer.module.css";

/** Les pages qui n'existent pas encore s'affichent comme du texte, sans lien mort. */
function Lien({ lien }: { lien: LienPied }) {
  return lien.href ? <Link href={lien.href}>{lien.label}</Link> : <span>{lien.label}</span>;
}

export default function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.columns}>
        {piedDePage.map((colonne) => (
          <div key={colonne.label} className={s.column}>
            <div className={s.columnLabel}>{colonne.label}</div>
            {colonne.liens.map((lien) => (
              <Lien key={lien.label} lien={lien} />
            ))}
          </div>
        ))}
      </div>
      <hr className={s.rule} />
      <div className={s.legal}>
        <span>France</span>
        <span>© 2026 TROOVANTE</span>
        {mentionsLegales.map((lien) => (
          <Lien key={lien.label} lien={lien} />
        ))}
      </div>
    </footer>
  );
}
