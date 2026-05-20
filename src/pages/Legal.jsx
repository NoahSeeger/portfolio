import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

const LEGAL_SECTIONS = {
  privacy: {
    title: "Datenschutzerklärung",
    lastUpdated: "Mai 2026",
    content: [
      {
        heading: "Verantwortlicher",
        text: "Noah Seeger, DEINE STRASSE 12, 12345 DEINE STADT. E-Mail: noahseeger@outlook.de", // <-- ADRESSE PFLICHT!
      },
      {
        heading: "Hosting",
        text: "Diese Website wird bei Netlify (oder Vercel/GitHub - hier anpassen!) gehostet. Beim Aufruf der Seite speichert der Hosting-Anbieter automatisch Daten in sogenannten Server-Logfiles (z.B. IP-Adresse, Browsertyp, Uhrzeit).",
      },
      {
        heading: "Kontakt",
        text: "Wenn du mir per E-Mail schreibst, werden die übermittelten Daten ausschließlich zur Bearbeitung deiner Anfrage verwendet und danach gelöscht.",
      },
      {
        heading: "Deine Rechte",
        text: "Du hast das Recht auf kostenlose Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung deiner Daten. Bei Fragen wende dich an noahseeger@outlook.de.",
      },
    ],
  },
  impressum: {
    title: "Impressum",
    lastUpdated: "Mai 2026",
    content: [
      {
        heading: "Angaben gemäß § 5 TMG",
        text: "Noah Seeger \nDEINE STRASSE 12 \n12345 DEINE STADT",
      },
      {
        heading: "Kontakt",
        text: "E-Mail: noahseeger@outlook.de",
      },
      {
        heading: "Haftung für Inhalte",
        text: "Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte verantwortlich. Nach §§ 8 bis 10 TMG bin ich nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.",
      },
    ],
  },
};

function LegalPage({ page }) {
  const data = LEGAL_SECTIONS[page];

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Seite nicht gefunden</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 relative antialiased">
      {/* Back button - fest am oberen Rand fixiert, scrollt nicht weg */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-50 w-full max-w-2xl mx-auto px-6 py-4 border-b border-gray-100 flex items-center">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-500 hover:text-purple-accent transition-colors"
        >
          <FaArrowLeft size={16} />
          <span className="text-sm font-medium">Zurück</span>
        </Link>
      </div>

      {/* Content Container - Sauber zentriert, bricht auf Handys nicht aus */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight mb-1">{data.title}</h1>
        <p className="text-gray-400 text-xs mb-8">Zuletzt aktualisiert: {data.lastUpdated}</p>

        {/* Die Sections nutzen whitespace-pre-line, damit Umbrüche bei der Adresse (\n) funktionieren */}
        <div className="space-y-6">
          {data.content.map((section, index) => (
            <section key={index} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <h2 className="text-base font-semibold text-gray-900 mb-2">{section.heading}</h2>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {section.text}
              </p>
            </section>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <p className="text-gray-400 text-xs text-center">
            © {new Date().getFullYear()} Noah Seeger. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LegalPage;