"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { retablirReglages, sauverRubrique, type ReponseReglages } from "@/app/admin/reglages/actions";
import type { ReglagesAccueil, RubriqueReglages } from "@/lib/reglages/types";
import { EditeurApparence, EditeurBarre, EditeurSections, EditeurTextes, EditeurVisuel, type OptionLien } from "./Rubriques";
import s from "./reglages.module.css";

const RUBRIQUES: { cle: RubriqueReglages; label: string }[] = [
  { cle: "visuel", label: "Photo d’ouverture" },
  { cle: "textes", label: "Slogan et textes" },
  { cle: "apparence", label: "Apparence" },
  { cle: "sections", label: "Sections" },
  { cle: "barre", label: "Barre de navigation" },
];

type Message = { texte: string; erreur?: boolean };

/**
 * Formulaire des réglages de l'accueil. Chaque rubrique a son brouillon ;
 * « Enregistrer » l'applique aussitôt au site, et l'aperçu se recharge.
 */
export default function EditeurReglages({
  reglages,
  liens,
  univers,
  editionPossible,
}: {
  reglages: ReglagesAccueil;
  liens: OptionLien[];
  univers: { slug: string; nom: string }[];
  editionPossible: boolean;
}) {
  const router = useRouter();
  const [enregistres, setEnregistres] = useState(reglages);
  const [brouillon, setBrouillon] = useState(reglages);
  const [rubrique, setRubrique] = useState<RubriqueReglages>("visuel");
  const [message, setMessage] = useState<Message | null>(null);
  const [enCours, demarrer] = useTransition();
  const [appareil, setAppareil] = useState<"ordinateur" | "telephone">("ordinateur");
  const apercu = useRef<HTMLIFrameElement>(null);
  const positionApercu = useRef(0);

  const modifiee = (cle: RubriqueReglages) => JSON.stringify(brouillon[cle]) !== JSON.stringify(enregistres[cle]);
  const uneModifiee = RUBRIQUES.some((r) => modifiee(r.cle));

  // Prévient avant de quitter la page avec des modifications non enregistrées.
  useEffect(() => {
    if (!uneModifiee) return;
    const prevenir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", prevenir);
    return () => window.removeEventListener("beforeunload", prevenir);
  }, [uneModifiee]);

  function changer<R extends RubriqueReglages>(cle: R, valeur: ReglagesAccueil[R]) {
    setBrouillon((b) => ({ ...b, [cle]: valeur }));
    setMessage(null);
  }

  /** Recharge l'aperçu en gardant l'endroit où il était descendu. */
  function rechargerApercu() {
    const fenetre = apercu.current?.contentWindow;
    if (!fenetre) return;
    positionApercu.current = fenetre.scrollY;
    fenetre.location.reload();
  }

  function appliquer(reponse: ReponseReglages, cle: RubriqueReglages, succes: string) {
    if (!reponse.ok) {
      setMessage({ texte: reponse.message, erreur: true });
      return;
    }
    setEnregistres(reponse.reglages);
    // Les autres rubriques gardent leur brouillon en cours.
    setBrouillon((b) => ({ ...b, [cle]: reponse.reglages[cle] }));
    setMessage({ texte: succes });
    rechargerApercu();
    // La barre de navigation de cette page suit aussi les réglages.
    if (cle === "barre") router.refresh();
  }

  function enregistrer() {
    const cle = rubrique;
    demarrer(async () => {
      try {
        appliquer(await sauverRubrique(cle, brouillon[cle]), cle, "Enregistré : l’accueil est à jour.");
      } catch {
        setMessage({ texte: "Les réglages n’ont pas pu être enregistrés. Le site est-il bien lancé ?", erreur: true });
      }
    });
  }

  function retablir() {
    const cle = rubrique;
    const nom = RUBRIQUES.find((r) => r.cle === cle)?.label ?? cle;
    if (!window.confirm(`Remettre « ${nom} » comme à l’origine ? Les réglages actuels de cette rubrique seront perdus.`)) return;
    demarrer(async () => {
      try {
        appliquer(await retablirReglages(cle), cle, "Réglages d’origine rétablis.");
      } catch {
        setMessage({ texte: "Les réglages d’origine n’ont pas pu être rétablis.", erreur: true });
      }
    });
  }

  function annuler() {
    setBrouillon((b) => ({ ...b, [rubrique]: enregistres[rubrique] }));
    setMessage(null);
  }

  return (
    <div className={s.disposition}>
      <div className={s.formulaire}>
        <div className={s.onglets} role="tablist" aria-label="Rubriques des réglages">
          {RUBRIQUES.map((r) => (
            <button
              key={r.cle}
              type="button"
              role="tab"
              id={`onglet-${r.cle}`}
              aria-controls="rubrique"
              aria-selected={r.cle === rubrique}
              data-modifie={modifiee(r.cle)}
              title={modifiee(r.cle) ? "Modifications non enregistrées" : undefined}
              className={s.onglet}
              onClick={() => {
                setRubrique(r.cle);
                setMessage(null);
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div id="rubrique" role="tabpanel" aria-labelledby={`onglet-${rubrique}`} className={s.rubrique}>
          {rubrique === "visuel" && <EditeurVisuel valeur={brouillon.visuel} onChange={(v) => changer("visuel", v)} />}
          {rubrique === "textes" && <EditeurTextes valeur={brouillon.textes} onChange={(v) => changer("textes", v)} liens={liens} />}
          {rubrique === "apparence" && <EditeurApparence valeur={brouillon.apparence} onChange={(v) => changer("apparence", v)} />}
          {rubrique === "sections" && <EditeurSections valeur={brouillon.sections} onChange={(v) => changer("sections", v)} liens={liens} />}
          {rubrique === "barre" && <EditeurBarre valeur={brouillon.barre} onChange={(v) => changer("barre", v)} univers={univers} />}
        </div>

        <div className={s.enregistrement}>
          <Button onClick={enregistrer} disabled={!editionPossible || enCours || !modifiee(rubrique)}>
            {enCours ? "Enregistrement…" : "Enregistrer"}
          </Button>
          {modifiee(rubrique) && (
            <Button variant="secondary" onClick={annuler} disabled={enCours}>
              Annuler
            </Button>
          )}
          <button type="button" className={s.lienDiscret} onClick={retablir} disabled={!editionPossible || enCours}>
            Réglages d’origine
          </button>
          {message && (
            <p className={s.message} data-erreur={message.erreur ?? false} role={message.erreur ? "alert" : "status"}>
              {message.texte}
            </p>
          )}
        </div>
      </div>

      <Apercu
        appareil={appareil}
        setAppareil={setAppareil}
        cadre={apercu}
        onLoad={() => apercu.current?.contentWindow?.scrollTo({ top: positionApercu.current, behavior: "instant" })}
      />
    </div>
  );
}

/** L'accueil tel qu'il est enregistré, sur ordinateur (réduit) ou sur téléphone. */
function Apercu({
  appareil,
  setAppareil,
  cadre,
  onLoad,
}: {
  appareil: "ordinateur" | "telephone";
  setAppareil: (a: "ordinateur" | "telephone") => void;
  cadre: React.RefObject<HTMLIFrameElement | null>;
  onLoad: () => void;
}) {
  const ecran = useRef<HTMLDivElement>(null);
  const [echelle, setEchelle] = useState(0.5);

  // La page « ordinateur » fait 1440 px de large : elle est réduite à la largeur de la colonne.
  useEffect(() => {
    const element = ecran.current;
    if (!element) return;
    const observer = new ResizeObserver(([entree]) => setEchelle(Math.min(1, entree.contentRect.width / 1440)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={s.apercu} aria-label="Aperçu de l’accueil">
      <div className={s.apercuTete}>
        <div className={s.onglets}>
          {(["ordinateur", "telephone"] as const).map((a) => (
            <button key={a} type="button" className={s.onglet} aria-pressed={a === appareil} onClick={() => setAppareil(a)}>
              {a === "ordinateur" ? "Ordinateur" : "Téléphone"}
            </button>
          ))}
        </div>
        <a href="/" target="_blank" rel="noopener">
          Ouvrir l’accueil dans un nouvel onglet
        </a>
      </div>
      <div
        ref={ecran}
        className={s.ecran}
        data-appareil={appareil}
        style={{ "--echelle": echelle } as React.CSSProperties}
      >
        <iframe ref={cadre} src="/" title="Aperçu de l’accueil" onLoad={onLoad} />
      </div>
    </section>
  );
}
