import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Impressum() {
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
          <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Impressum</h1>
        </div>

        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Angaben gemäß § 5 TMG. Dieses Impressum gilt für das Angebot unter der Domain dieses Web-Generators.
        </p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-300">
          {/* Diensteanbieter */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">Diensteanbieter / Betreiber</h2>
            <p className="font-semibold text-slate-100">tekkers club Einzelunternehmen</p>
            <p>Inhaber: Jeremy Pape</p>
            <p>Siemensstraße 8</p>
            <p>27574 Bremerhaven</p>
            <p>Deutschland</p>
          </section>

          {/* Kontakt */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">Kontaktmöglichkeiten</h2>
            <p>E-Mail: <a href="mailto:Info@tekkersclub.de" className="text-blue-400 hover:underline">Info@tekkersclub.de</a></p>
            <p>Telefon: <span className="text-slate-300">015901923275</span></p>
          </section>

          {/* Vertretung */}
          <section className="border-b border-slate-800 pb-6">
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">Vertretungsberechtigte Personen</h2>
            <p>Jeremy Pape (Inhaber)</p>
          </section>

          {/* Streitschlichtung */}
          <section>
            <h2 className="text-base font-bold text-slate-100 mb-3 uppercase tracking-wider text-[11px]">EU-Streitschlichtung</h2>
            <p className="text-slate-400">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                https://ec.europa.eu/consumers/odr
              </a>.
              Unsere E-Mail-Adresse finden Sie oben im Impressum. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
        
      </div>
    </div>
  );
}
