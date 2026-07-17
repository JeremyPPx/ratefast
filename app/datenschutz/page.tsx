import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function Datenschutz() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans py-12 px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        
        {/* Back button */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-slate-200 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Zurück zum Generator
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Datenschutzerklärung</h1>
        </div>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Verantwortlicher im Sinne der Datenschutz-Grundverordnung (DSGVO):
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          
          {/* Verantwortlicher */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">1. Verantwortliche Stelle</h2>
            <p className="font-semibold text-slate-100">tekkers club Einzelunternehmen</p>
            <p>Inhaber: Jeremy Pape</p>
            <p>Siemensstraße 8</p>
            <p>27574 Bremerhaven</p>
            <p>E-Mail: <a href="mailto:Info@tekkersclub.de" className="text-blue-400 hover:underline">Info@tekkersclub.de</a></p>
          </section>

          {/* Allgemeine Datenerfassung */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">2. Erfassung allgemeiner Informationen beim Besuch</h2>
            <p className="mb-3">
              Wenn Sie auf unsere Website zugreifen, werden automatisch Informationen allgemeiner Natur erfasst. Diese Server-Logfiles beinhalten z. B. die Art des Webbrowsers, das verwendete Betriebssystem, den Domainnamen Ihres Internet-Service-Providers, Ihre IP-Adresse und Ähnliches.
            </p>
            <p>
              Dies ist technisch notwendig, um die von Ihnen angeforderten Inhalte von Webseiten korrekt auszuliefern und fällt bei der Nutzung des Internets zwingend an. Die Verarbeitung erfolgt auf Basis von Art. 6 Abs. 1 lit. f DSGVO zur Gewährleistung der Betriebssicherheit und Bereitstellung der Website.
            </p>
          </section>

          {/* OpenAI Schnittstelle */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">3. Datenverarbeitung bei der Bewertungsgenerierung (OpenAI API)</h2>
            <p className="mb-3">
              Unser Service ermöglicht es Ihnen, Stichworte einzugeben, um daraus eine Bewertung erstellen zu lassen. 
            </p>
            <p className="mb-3 font-semibold text-slate-100">
              Wichtig: Wir speichern Ihre eingegebenen Stichworte oder die generierten Bewertungen nicht in einer eigenen Datenbank. Die Anwendung ist datenbankfrei und speichert keine personenbezogenen Daten auf unseren Servern.
            </p>
            <p className="mb-3">
              Zur Generierung der Bewertungstexte werden Ihre eingegebenen Stichworte und der ausgewählte Sterne-Wert verschlüsselt an die API von <b>OpenAI (OpenAI Ireland Ltd., Dublin, Irland)</b> übertragen. OpenAI verarbeitet diese Daten ausschließlich, um den Bewertungstext zu erzeugen. Die Daten werden gemäß den API-Richtlinien von OpenAI nicht zum Training derer Modelle verwendet.
            </p>
            <p>
              Die Übermittlung erfolgt auf Grundlage Ihrer Einwilligung bzw. unseres berechtigten Interesses, Ihnen einen KI-basierten Formulierungsservice anzubieten (Art. 6 Abs. 1 lit. f DSGVO bzw. Art. 6 Abs. 1 lit. a DSGVO).
            </p>
          </section>

          {/* Keine Cookies */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">4. Cookies</h2>
            <p>
              Diese Webseite verzichtet vollständig auf den Einsatz von Tracking-Cookies oder Werbe-Cookies. Es werden keine permanenten Profile oder Cookies auf Ihrem Endgerät gespeichert.
            </p>
          </section>

          {/* Rechte der betroffenen Person */}
          <section>
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">5. Ihre Rechte als betroffene Person</h2>
            <p className="mb-2">Sie haben das Recht:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-400">
              <li>Auskunft über Ihre bei uns verarbeiteten Daten zu verlangen (Art. 15 DSGVO).</li>
              <li>Die Berichtigung unrichtiger Daten zu verlangen (Art. 16 DSGVO).</li>
              <li>Die Löschung Ihrer bei uns gespeicherten Daten zu verlangen (Art. 17 DSGVO).</li>
              <li>Die Einschränkung der Datenverarbeitung zu verlangen (Art. 18 DSGVO).</li>
              <li>Widerspruch gegen die Verarbeitung einzulegen (Art. 21 DSGVO).</li>
            </ul>
            <p className="mt-3">
              Bitte wenden Sie sich hierzu an die oben angegebene E-Mail-Adresse unseres Verantwortlichen.
            </p>
          </section>
        </div>
        
      </div>
    </div>
  );
}
