import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/auth";
import { seDeconnecter } from "../actions";
import s from "../admin.module.css";

export const metadata: Metadata = { title: "Espace privé" };

/**
 * Bandeau commun aux pages privées. Le contrôle d'accès est refait dans chaque
 * page et chaque action : ce bandeau seul ne protège rien.
 */
export default async function LayoutPrive({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = await exigerAdmin();

  return (
    <>
      <div className={s.bar}>
        <div className={`container ${s.barInner}`}>
          <Link href="/admin" className={s.barTitle}>
            Espace privé · Dépôts
          </Link>
          <div className={s.barRight}>
            <span>{admin.email}</span>
            <form action={seDeconnecter}>
              <button type="submit" className={s.barButton}>
                Se déconnecter
              </button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}
