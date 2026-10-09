import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ADMINS, adminConnecte, connexionConfiguree } from "@/lib/auth";
import ConnexionForm from "./ConnexionForm";
import s from "../admin.module.css";

export const metadata: Metadata = { title: "Espace privé" };

export default async function PageConnexion() {
  if (await adminConnecte()) redirect("/admin");

  return (
    <div className={`container ${s.page}`}>
      <div className={s.login}>
        <h1 className={s.title}>Espace privé</h1>
        <p className={s.muted}>Réservé à l’équipe TROOVANTE.</p>
        {!connexionConfiguree ? (
          <p className={s.empty}>La base de données n’est pas branchée : la connexion est impossible.</p>
        ) : ADMINS.length === 0 ? (
          <p className={s.empty}>
            Aucune adresse n’est autorisée pour l’instant : renseigner ADMIN_EMAILS dans le fichier .env.local.
          </p>
        ) : (
          <ConnexionForm />
        )}
      </div>
    </div>
  );
}
