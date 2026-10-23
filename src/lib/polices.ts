import {
  Bodoni_Moda,
  Cormorant_Garamond,
  DM_Serif_Display,
  EB_Garamond,
  Fraunces,
  Inter,
  Jost,
  Josefin_Sans,
  Lora,
  Manrope,
  Montserrat,
  Playfair_Display,
  Raleway,
  Work_Sans,
} from "next/font/google";
import { variablePolice, type ClePolice } from "./reglages/types";

/**
 * Les polices proposées dans les réglages de l'accueil. Elles sont servies
 * par le site lui-même ; le navigateur ne télécharge que celles qui sont
 * réellement utilisées sur la page. Seules les trois polices d'origine sont
 * préchargées.
 */

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const jost = Jost({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-jost", display: "swap" });

const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-playfair",
  display: "swap",
  preload: false,
});
const ebgaramond = EB_Garamond({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-ebgaramond",
  display: "swap",
  preload: false,
});
const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-lora",
  display: "swap",
  preload: false,
});
const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-bodoni",
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-fraunces",
  display: "swap",
  preload: false,
});
const dmserif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--police-dmserif",
  display: "swap",
  preload: false,
});
const montserrat = Montserrat({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-montserrat",
  display: "swap",
  preload: false,
});
const raleway = Raleway({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-raleway",
  display: "swap",
  preload: false,
});
const josefin = Josefin_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-josefin",
  display: "swap",
  preload: false,
});
const worksans = Work_Sans({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--police-worksans",
  display: "swap",
  preload: false,
});
const manrope = Manrope({ subsets: ["latin"], variable: "--police-manrope", display: "swap", preload: false });

const CHARGEES = {
  cormorant,
  playfair,
  ebgaramond,
  lora,
  bodoni,
  fraunces,
  dmserif,
  inter,
  jost,
  montserrat,
  raleway,
  josefin,
  worksans,
  manrope,
} satisfies Record<ClePolice, { variable: string }>;

const SECOURS_EMPATTEMENTS = 'Georgia, "Times New Roman", serif';
const SECOURS_SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';
const AVEC_EMPATTEMENTS = new Set<ClePolice>(["cormorant", "playfair", "ebgaramond", "lora", "bodoni", "fraunces", "dmserif"]);

/** Classes à poser sur <html> : chacune déclare la variable CSS de sa police. */
export const CLASSES_POLICES = Object.values(CHARGEES)
  .map((p) => p.variable)
  .join(" ");

/** La valeur CSS « font-family » d'une police de la liste, avec une police de secours. */
export function famillePolice(cle: ClePolice): string {
  return `var(${variablePolice(cle)}), ${AVEC_EMPATTEMENTS.has(cle) ? SECOURS_EMPATTEMENTS : SECOURS_SANS}`;
}
