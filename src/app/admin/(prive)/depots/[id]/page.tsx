import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/ui/Button";
import f from "@/components/ui/form.module.css";
import { exigerAdmin } from "@/lib/auth";
import { getUnivers } from "@/lib/catalogue";
import { PROFILS } from "@/lib/depot";
import { liensPhotosPrivees, lireDepot, type Depot } from "@/lib/depots";
import { formatPrix } from "@/lib/format";
import { lienTelephone } from "@/data/site";
import { DECORS, briaConfigure, decorParDefaut } from "@/lib/miseEnSituation";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { changerStatutDepot } from "../../../actions";
import s from "../../../admin.module.css";
import FichePublication from "./FichePublication";
import RelanceSituation from "./RelanceSituation";

// La génération d'une mise en situation peut durer une minute.
export const maxDuration = 120;

type Props = { params: Promise<{ id: string }> };

const dateHeure = new Intl.DateTimeFormat("fr-FR", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Paris" });

/** 42.5 → « 42,5 » */
const mesure = (valeur: number) => String(valeur).replace(".", ",");

/** « Hauteur 85 cm · Largeur 128,5 cm · Profondeur 60 cm · 62 kg » */
function dimensionsEnTexte(depot: Depot): string {
  return [
    `Hauteur ${mesure(depot.hauteurCm)} cm`,
    `Largeur ${mesure(depot.largeurCm)} cm`,
    depot.profondeurCm && `Profondeur ${mesure(depot.profondeurCm)} cm`,
    depot.poidsKg && `${mesure(depot.poidsKg)} kg`,
  ]
    .filter(Boolean)
    .join(" · ");
}

export default async function PageDepot({ params }: Props) {
  await exigerAdmin();

  const depot = await lireDepot((await params).id);
  if (!depot) notFound();

  const [liens, univers] = await Promise.all([
    liensPhotosPrivees([...depot.photosOrigine, ...depot.photosSituation]),
    getUnivers(),
  ]);

  // Pour un dépôt publié : l'adresse de sa fiche sur le site.
  const fiche = depot.objetId
    ? (await supabaseAdmin().from("objets").select("slug, statut").eq("id", depot.objetId).maybeSingle()).data
    : null;

  const profil = PROFILS.find((p) => p.valeur === depot.profil)?.label ?? depot.profil;
  const [principale, ...autres] = depot.photosOrigine;

  return (
    <div className={`container ${s.page}`}>
      <Link href="/admin" className={s.back}>
        ← Tous les dépôts
      </Link>
      <div>
        <h1 className={s.title}>{depot.titre}</h1>
        <p className={s.muted}>Reçu le {dateHeure.format(new Date(depot.creeLe))}</p>
      </div>

      <div className={s.detail}>
        <div className={s.column}>
          <div className={s.block}>
            <h2 className={s.subtitle}>Photos reçues</h2>
            {principale && liens[principale] && (
              <a href={liens[principale]} target="_blank" rel="noreferrer" className={s.photoLarge}>
                <Image
                  src={liens[principale]}
                  alt="Photo principale envoyée par le professionnel"
                  fill
                  unoptimized
                  sizes="(min-width: 900px) 45vw, 100vw"
                  className={s.photoImg}
                />
              </a>
            )}
            {autres.length > 0 && (
              <div className={s.photos}>
                {autres.map(
                  (chemin, rang) =>
                    liens[chemin] && (
                      <a key={chemin} href={liens[chemin]} target="_blank" rel="noreferrer" className={s.photo}>
                        <Image
                          src={liens[chemin]}
                          alt={`Photo ${rang + 2} envoyée par le professionnel`}
                          fill
                          unoptimized
                          sizes="160px"
                          className={s.photoImg}
                        />
                      </a>
                    ),
                )}
              </div>
            )}
            <p className={s.muted}>Cliquer sur une photo l’ouvre en grand.</p>
          </div>

          <div className={s.block}>
            <h2 className={s.subtitle}>Mise en situation</h2>
            <p className={s.muted}>
              {!briaConfigure
                ? "La génération n’est pas activée : la clé Bria (BRIA_API_TOKEN) n’est pas renseignée dans .env.local."
                : depot.iaStatut === "en_cours"
                  ? "Génération en cours. Rechargez la page dans un instant."
                  : depot.iaStatut === "echec"
                    ? `La dernière génération a échoué : ${depot.iaErreur ?? "motif inconnu"}`
                    : depot.photosSituation.length > 0
                      ? "Le décor est généré autour de l’objet de la photo principale. Comparez avec l’original avant de publier."
                      : "Aucune image générée pour l’instant."}
            </p>
            {depot.photosSituation.length > 0 && (
              <div className={s.photos}>
                {depot.photosSituation.map(
                  (chemin, rang) =>
                    liens[chemin] && (
                      <a key={chemin} href={liens[chemin]} target="_blank" rel="noreferrer" className={s.photoTall}>
                        <Image
                          src={liens[chemin]}
                          alt={`Mise en situation ${rang + 1}`}
                          fill
                          unoptimized
                          sizes="200px"
                          className={s.photoImg}
                        />
                      </a>
                    ),
                )}
              </div>
            )}
            {briaConfigure && depot.statut === "nouveau" && depot.iaStatut !== "en_cours" && (
              <RelanceSituation
                depotId={depot.id}
                decors={DECORS.map((decor) => ({ cle: decor.cle, label: decor.label }))}
                decorParDefaut={decorParDefaut(depot.universSlug).cle}
                dejaFaite={depot.photosSituation.length > 0}
              />
            )}
          </div>

          <div className={s.block}>
            <h2 className={s.subtitle}>Le professionnel</h2>
            <div className={s.card}>
              <div className={s.cardTitle}>
                {depot.nom}
                {depot.societe ? ` — ${depot.societe}` : ""}
              </div>
              <div>
                {profil}
                {depot.ville ? ` · ${depot.ville}` : ""}
              </div>
              <a href={`mailto:${depot.email}`}>{depot.email}</a>
              <a href={lienTelephone(depot.telephone)}>{depot.telephone}</a>
              <div className={s.muted}>
                Prix souhaité : {formatPrix(depot.prixSouhaite)} · Exclusivité acceptée · Coordonnées jamais affichées
                sur le site
              </div>
            </div>
          </div>
        </div>

        <div className={s.column}>
          {depot.statut === "publie" && (
            <div className={s.status}>
              <h2 className={s.subtitle}>Publié sur le site</h2>
              {fiche ? (
                <>
                  <p>
                    {fiche.statut === "publie"
                      ? "La fiche est en ligne."
                      : `La fiche existe mais n’est plus visible (statut « ${fiche.statut} »).`}
                  </p>
                  <Button href={`/objets/${fiche.slug}`}>Voir la fiche</Button>
                  <p className={s.muted}>
                    Pour la corriger ou la retirer du site, modifier la ligne dans la table « objets » de Supabase
                    (statut « vendu » pour la retirer).
                  </p>
                </>
              ) : (
                <p>La fiche correspondante n’existe plus dans le catalogue.</p>
              )}
            </div>
          )}

          {depot.statut === "refuse" && (
            <div className={s.status}>
              <h2 className={s.subtitle}>Dépôt refusé</h2>
              {depot.noteInterne && <p>Note interne : {depot.noteInterne}</p>}
              <form action={changerStatutDepot}>
                <input type="hidden" name="id" value={depot.id} />
                <input type="hidden" name="statut" value="nouveau" />
                <Button type="submit" variant="inverse">
                  Remettre à traiter
                </Button>
              </form>
            </div>
          )}

          {depot.statut === "nouveau" && (
            <>
              <div className={s.block}>
                <h2 className={s.subtitle}>La fiche à publier</h2>
                <p className={s.muted}>
                  Préremplie avec la saisie du professionnel. Corrigez ce qu’il faut : rien n’est en ligne tant que
                  vous n’avez pas publié.
                </p>
              </div>
              <FichePublication
                depotId={depot.id}
                initiale={{
                  nom: depot.titre,
                  universSlug: depot.universSlug ?? "",
                  attributs: depot.attributs,
                  origine: depot.origine,
                  signature: depot.signature ?? "",
                  prix: depot.prixSouhaite,
                  histoire: depot.description,
                  dimensions: dimensionsEnTexte(depot),
                  etat: depot.etat,
                  marchandNom: depot.societe ?? depot.nom,
                  marchandVille: depot.ville ?? "",
                }}
                univers={univers.map((u) => ({ slug: u.slug, nom: u.nom, filtres: u.filtres }))}
                photos={[
                  // Seule la mise en situation la plus récente est cochée d'office.
                  ...depot.photosSituation.map((chemin, rang) => ({
                    chemin,
                    lien: liens[chemin],
                    situation: true,
                    cochee: rang === 0,
                  })),
                  ...depot.photosOrigine.map((chemin) => ({ chemin, lien: liens[chemin], situation: false, cochee: true })),
                ]}
              />

              <form action={changerStatutDepot} className={s.refuse}>
                <input type="hidden" name="id" value={depot.id} />
                <input type="hidden" name="statut" value="refuse" />
                <label className={f.field}>
                  <span>
                    Refuser ce dépôt <span className={f.optional}>(note interne facultative)</span>
                  </span>
                  <textarea name="note" rows={2} maxLength={2000} />
                </label>
                <Button type="submit" variant="secondary">
                  Refuser ce dépôt
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
