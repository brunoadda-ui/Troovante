"use client";

import { ArrowDown, ArrowUp, X } from "lucide-react";
import type { ReactNode } from "react";
import f from "@/components/ui/form.module.css";
import { GRAISSES, POLICES, variablePolice, type ClePolice, type Graisse, type StyleTexte } from "@/lib/reglages/types";
import s from "./reglages.module.css";

/** Les commandes du formulaire de réglages : simples, contrôlées, sans logique d'enregistrement. */

export function Texte({
  label,
  valeur,
  onChange,
  multiligne,
  aide,
  max = 300,
}: {
  label: string;
  valeur: string;
  onChange: (v: string) => void;
  multiligne?: boolean;
  aide?: string;
  max?: number;
}) {
  return (
    <label className={f.field}>
      {label}
      {aide && <span className={f.hint}>{aide}</span>}
      {multiligne ? (
        <textarea rows={3} maxLength={max} value={valeur} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input type="text" maxLength={max} value={valeur} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

export function Case({ label, valeur, onChange }: { label: string; valeur: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className={s.case}>
      <input type="checkbox" checked={valeur} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function Curseur({
  label,
  valeur,
  onChange,
  min,
  max,
  pas = 1,
  unite = "",
  afficher,
}: {
  label: string;
  valeur: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  pas?: number;
  unite?: string;
  /** Mise en forme de la valeur affichée à côté du curseur. */
  afficher?: (v: number) => string;
}) {
  return (
    <label className={s.curseur}>
      <span className={s.curseurTete}>
        <span>{label}</span>
        <span className={s.valeur}>{afficher ? afficher(valeur) : `${valeur}${unite}`}</span>
      </span>
      <input type="range" min={min} max={max} step={pas} value={valeur} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

export function Choix<T extends string | number>({
  label,
  valeur,
  options,
  onChange,
}: {
  label: string;
  valeur: T;
  options: readonly { valeur: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <label className={f.field}>
      {label}
      <select
        value={String(valeur)}
        onChange={(e) => {
          const choisie = options.find((o) => String(o.valeur) === e.target.value);
          if (choisie) onChange(choisie.valeur);
        }}
      >
        {options.map((o) => (
          <option key={String(o.valeur)} value={String(o.valeur)}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

const GENRES = ["Empattements", "Sans empattements"] as const;

/** Choix d'une police, avec un aperçu écrit dans la police choisie. */
export function ChoixPolice({
  label,
  valeur,
  onChange,
}: {
  label: string;
  valeur: ClePolice;
  onChange: (v: ClePolice) => void;
}) {
  return (
    <div className={s.police}>
      <label className={f.field}>
        {label}
        <select value={valeur} onChange={(e) => onChange(e.target.value as ClePolice)}>
          {GENRES.map((genre) => (
            <optgroup key={genre} label={genre}>
              {POLICES.filter((p) => p.genre === genre).map((p) => (
                <option key={p.cle} value={p.cle}>
                  {p.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <span className={s.apercuPolice} style={{ fontFamily: `var(${variablePolice(valeur)})` }}>
        Chaque objet raconte — Ébéniste, 1760
      </span>
    </div>
  );
}

const PRESETS_COULEURS = [
  { valeur: "#ffffff", label: "Blanc" },
  { valeur: "#111111", label: "Noir" },
  { valeur: "#8a5a3b", label: "Brun d’accent" },
  { valeur: "#f5f5f5", label: "Gris clair" },
];

export function Couleur({ label, valeur, onChange }: { label: string; valeur: string; onChange: (v: string) => void }) {
  return (
    <div className={s.couleur}>
      <span className={s.couleurLabel}>{label}</span>
      <div className={s.couleurChoix}>
        {PRESETS_COULEURS.map((p) => (
          <button
            key={p.valeur}
            type="button"
            className={s.pastille}
            style={{ background: p.valeur }}
            aria-label={p.label}
            aria-pressed={valeur === p.valeur}
            title={p.label}
            onClick={() => onChange(p.valeur)}
          />
        ))}
        <label className={s.couleurLibre} title="Couleur libre">
          <input type="color" value={valeur} onChange={(e) => onChange(e.target.value)} aria-label={`${label} : couleur libre`} />
          <span>{valeur}</span>
        </label>
      </div>
    </div>
  );
}

/** Tous les réglages de format d'un texte : police, taille, épaisseur, italique, souligné, capitales, espacement, couleur. */
export function EditeurStyle({
  valeur,
  onChange,
  tailleMax = 96,
}: {
  valeur: StyleTexte;
  onChange: (v: StyleTexte) => void;
  tailleMax?: number;
}) {
  const maj = (partiel: Partial<StyleTexte>) => onChange({ ...valeur, ...partiel });
  return (
    <div className={s.style}>
      <ChoixPolice label="Police" valeur={valeur.police} onChange={(police) => maj({ police })} />
      <div className={s.ligne2}>
        <Curseur label="Taille" valeur={valeur.taille} min={10} max={tailleMax} unite=" px" onChange={(taille) => maj({ taille })} />
        <Choix<Graisse> label="Épaisseur" valeur={valeur.graisse} options={GRAISSES} onChange={(graisse) => maj({ graisse })} />
      </div>
      <div className={s.cases}>
        <Case label="Italique" valeur={valeur.italique} onChange={(italique) => maj({ italique })} />
        <Case label="Souligné" valeur={valeur.souligne} onChange={(souligne) => maj({ souligne })} />
        <Case label="Capitales" valeur={valeur.capitales} onChange={(capitales) => maj({ capitales })} />
      </div>
      <Curseur
        label="Espacement des lettres"
        valeur={valeur.espacement}
        min={-5}
        max={50}
        afficher={(v) => `${(v / 100).toFixed(2).replace(".", ",")} em`}
        onChange={(espacement) => maj({ espacement })}
      />
      <Couleur label="Couleur" valeur={valeur.couleur} onChange={(couleur) => maj({ couleur })} />
    </div>
  );
}

/** Une ligne d'une liste réordonnable : contenu, puis boutons monter, descendre et (facultatif) retirer. */
export function LigneOrdonnee({
  children,
  rang,
  total,
  deplacer,
  retirer,
}: {
  children: ReactNode;
  rang: number;
  total: number;
  deplacer: (de: number, vers: number) => void;
  retirer?: () => void;
}) {
  return (
    <div className={s.ordonnee}>
      <div className={s.ordonneeContenu}>{children}</div>
      <div className={s.ordonneeBoutons}>
        <button type="button" aria-label="Monter" disabled={rang === 0} onClick={() => deplacer(rang, rang - 1)}>
          <ArrowUp size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
        <button type="button" aria-label="Descendre" disabled={rang === total - 1} onClick={() => deplacer(rang, rang + 1)}>
          <ArrowDown size={16} strokeWidth={1.5} aria-hidden="true" />
        </button>
        {retirer && (
          <button type="button" aria-label="Retirer" onClick={retirer}>
            <X size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

/** Déplace un élément d'une liste, sans modifier la liste d'origine. */
export function deplacer<T>(liste: T[], de: number, vers: number): T[] {
  if (vers < 0 || vers >= liste.length) return liste;
  const copie = [...liste];
  const [element] = copie.splice(de, 1);
  copie.splice(vers, 0, element);
  return copie;
}
