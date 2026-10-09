import Image from "next/image";
import Link from "next/link";
import { exigerAdmin } from "@/lib/auth";
import { PROFILS } from "@/lib/depot";
import { STATUTS_DEPOT, compterDepots, liensPhotosPrivees, listerDepots, type StatutDepot } from "@/lib/depots";
import { formatPrix } from "@/lib/format";
import s from "../admin.module.css";

type Props = { searchParams: Promise<{ statut?: string }> };

const ONGLETS: Record<StatutDepot, string> = {
  nouveau: "À traiter",
  publie: "Publiés",
  refuse: "Refusés",
};

const dateHeure = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Paris" });

export default async function PageDepots({ searchParams }: Props) {
  await exigerAdmin();

  const demande = (await searchParams).statut;
  const statut = STATUTS_DEPOT.find((valeur) => valeur === demande) ?? "nouveau";
  const [depots, comptes] = await Promise.all([listerDepots(statut), compterDepots()]);
  const vignettes = await liensPhotosPrivees(depots.flatMap((depot) => depot.photosOrigine.slice(0, 1)));

  return (
    <div className={`container ${s.page}`}>
      <h1 className={s.title}>Objets déposés par les professionnels</h1>

      <nav className={s.tabs} aria-label="Statut des dépôts">
        {STATUTS_DEPOT.map((valeur) => (
          <Link
            key={valeur}
            href={valeur === "nouveau" ? "/admin" : `/admin?statut=${valeur}`}
            className={s.tab}
            aria-current={valeur === statut ? "page" : undefined}
          >
            {ONGLETS[valeur]}
            <span className={s.tabCount}>({comptes[valeur]})</span>
          </Link>
        ))}
      </nav>

      {depots.length === 0 ? (
        <p className={s.empty}>
          {statut === "nouveau" ? "Aucun dépôt à traiter pour l’instant." : "Aucun dépôt dans cette liste."}
        </p>
      ) : (
        <div className={s.list}>
          {depots.map((depot) => {
            const vignette = vignettes[depot.photosOrigine[0]];
            const profil = PROFILS.find((p) => p.valeur === depot.profil)?.label ?? depot.profil;
            return (
              <Link key={depot.id} href={`/admin/depots/${depot.id}`} className={s.row}>
                <div className={s.thumb}>
                  {vignette && <Image src={vignette} alt="" fill unoptimized sizes="72px" className={s.thumbImg} />}
                </div>
                <div>
                  <div className={s.rowTitle}>{depot.titre}</div>
                  <div className={s.rowMeta}>Reçu le {dateHeure.format(new Date(depot.creeLe))}</div>
                </div>
                <div className={s.rowPro}>
                  <div>{depot.societe ?? depot.nom}</div>
                  <div className={s.rowMeta}>
                    {profil}
                    {depot.ville ? ` · ${depot.ville}` : ""}
                  </div>
                </div>
                <div className={s.rowPrice}>{formatPrix(depot.prixSouhaite)}</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
