import type { Metadata } from "next";
import { Mail, MessageCircle, Phone } from "lucide-react";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { lienTelephone, lienWhatsapp, site } from "@/data/site";
import RappelForm from "./RappelForm";
import s from "./vendre.module.css";

export const metadata: Metadata = {
  title: "Vendre un objet",
  description:
    "Un meuble, un tableau, un objet de famille ? Appelez-nous : nous venons le voir, nous le photographions et nous le vendons.",
};

const ETAPES = [
  {
    num: "1",
    titre: "Vous nous appelez",
    texte:
      "Décrivez l’objet avec vos mots : ce que c’est, où il se trouve, depuis quand vous l’avez. Cinq minutes suffisent.",
  },
  {
    num: "2",
    titre: "Nous venons le voir",
    texte: "Un expert se déplace chez vous, estime l’objet et le photographie. C’est gratuit et sans engagement.",
  },
  {
    num: "3",
    titre: "Nous vendons, vous êtes payé",
    texte:
      "Nous rédigeons la fiche, nous gérons l’acheteur et la livraison. Vous recevez votre virement sous 7 jours.",
  },
];

export default function PageVendre() {
  return (
    <>
      <div className={s.hero}>
        <div className={s.heroText}>
          <div className={s.eyebrow}>Vendre un objet</div>
          <h1 className={s.heroTitle}>
            Nous nous
            <br />
            occupons
            <br />
            de tout
          </h1>
          <p className={s.heroLead}>
            Vous avez un meuble, un tableau, un objet de famille ? Appelez-nous. Nous venons le voir, nous le
            photographions, nous écrivons son histoire et nous le vendons. Vous n’avez rien à remplir.
          </p>
          <div className={s.heroPhone}>
            <div className={s.heroPhoneNumber}>{site.telephone}</div>
            <div className={s.heroPhoneNote}>{site.horaires}</div>
          </div>
        </div>
        <Photo
          alt="Notre expert chez un vendeur"
          legende="Photo — notre expert chez un vendeur, 4:3"
          sizes="(min-width: 700px) 50vw, 100vw"
          className={s.heroPhoto}
        />
      </div>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Choisissez comment nous joindre</h2>
        <div className={s.contacts}>
          <div className={s.contact}>
            <Phone size={28} strokeWidth={1.5} aria-hidden="true" />
            <h3 className={s.contactTitle}>Par téléphone</h3>
            <div className={s.contactValue}>{site.telephone}</div>
            <p className={s.contactText}>
              C’est le plus simple. Racontez-nous ce que vous avez, nous vous disons tout de suite si c’est pour nous.
            </p>
            <div className={s.contactAction}>
              <Button size="lg" full href={lienTelephone(site.telephone)}>
                Appeler maintenant
              </Button>
            </div>
          </div>

          <div className={s.contact}>
            <MessageCircle size={28} strokeWidth={1.5} aria-hidden="true" />
            <h3 className={s.contactTitle}>Par WhatsApp</h3>
            <div className={s.contactValue}>{site.whatsapp}</div>
            <p className={s.contactText}>
              Envoyez une photo prise avec votre téléphone, même approximative. Nous répondons dans la journée.
            </p>
            <div className={s.contactAction}>
              <Button variant="secondary" size="lg" full href={lienWhatsapp(site.whatsapp)}>
                Écrire sur WhatsApp
              </Button>
            </div>
          </div>

          <div className={s.contact}>
            <Mail size={28} strokeWidth={1.5} aria-hidden="true" />
            <h3 className={s.contactTitle}>Par e-mail</h3>
            <div className={`${s.contactValue} ${s.contactValueEmail}`}>{site.email}</div>
            <p className={s.contactText}>
              Écrivez-nous quelques lignes, avec ou sans photo. Réponse sous 24 heures ouvrées.
            </p>
            <div className={s.contactAction}>
              <Button variant="secondary" size="lg" full href={`mailto:${site.email}`}>
                Envoyer un e-mail
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className={`container ${s.section}`}>
        <h2 className={s.h2}>Comment ça se passe</h2>
        <div className={s.steps}>
          {ETAPES.map((etape) => (
            <div key={etape.num} className={s.step}>
              <div className={s.stepNum}>{etape.num}</div>
              <h3 className={s.stepTitle}>{etape.titre}</h3>
              <p className={s.stepText}>{etape.texte}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={`container ${s.section} ${s.sectionLast}`}>
        <div className={s.callback}>
          <div className={s.callbackText}>
            <h2 className={s.callbackTitle}>Préférez-vous qu’on vous rappelle ?</h2>
            <p className={s.callbackLead}>
              Laissez votre prénom et votre numéro. Nous vous appelons quand cela vous arrange — pas de démarchage,
              pas d’inscription.
            </p>
            <div className={s.callbackNote}>
              Aucun frais avant la vente. Nous prenons 20 % uniquement si l’objet est vendu.
            </div>
          </div>
          <RappelForm />
        </div>
      </section>
    </>
  );
}
