'use client';

import React, { useState } from 'react';
import { 
  Star, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Send, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Award,
  Users
} from 'lucide-react';

export default function LandingPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Absenden der Bewerbung. Bitte versuche es erneut.');
      }

      setFormSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Verbindung zum Server fehlgeschlagen.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-hidden">
      
      {/* Background Radial Lights */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-slate-900/50 blur-[100px] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-100 via-slate-100 to-blue-400">
            RateFast
          </span>
        </div>
        <a 
          href="#apply-form" 
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20"
        >
          Partner werden
        </a>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-950/45 border border-blue-900/50 rounded-full text-xs text-blue-400 font-medium mb-6 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
          Mehr Google-Bewertungen mit KI
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6 text-slate-50">
          Verwandle Kundenzufriedenheit in{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            echtes Google-Wachstum
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
          Deine Kunden wollen dich bewerten, finden aber oft nicht die richtigen Worte. 
          RateFast generiert per QR-Code in Sekunden eine ausformulierte 5-Sterne-Bewertung auf Knopfdruck.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a
            href="#apply-form"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 hover:scale-[1.02]"
          >
            Jetzt Partner werden
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/?name=Demo+Restaurant&googleUrl=https%3A%2F%2Fgoogle.com&primaryColor=3B82F6"
            target="_blank"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-sm font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
          >
            Live-Demo testen
          </a>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold text-slate-100 mb-4">Warum lokale Unternehmen RateFast lieben</h2>
          <p className="text-sm sm:text-base text-slate-450 max-w-xl mx-auto">
            Wir haben den Bewertungsprozess so einfach gestaltet, dass die Abschlussrate um das Dreifache steigt.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/10 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">1. Einfach scannen</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Deine Kunden scannen einen gebrandeten Aufsteller auf dem Tisch oder am Tresen. Keine App-Installation notwendig.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">2. Stichworte eingeben</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Kunden wählen die Sterne und tippen kurz ein, was super war (z. B. "pizza, lecker, service"). Unsere KI formuliert die perfekte Bewertung.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-8 hover:border-slate-800 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/10 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">3. Kopieren & Posten</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Der Text wird automatisch in die Zwischenablage kopiert und Google Maps öffnet sich. Der Kunde muss nur noch auf Einfügen klicken.
            </p>
          </div>
        </div>
      </section>

      {/* SaaS Statistics & Trust */}
      <section className="max-w-5xl mx-auto px-6 py-12 bg-slate-900/30 border border-slate-900 rounded-[32px] mb-20 relative z-10 flex flex-col md:flex-row justify-around items-center gap-8 text-center md:text-left">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-50">+70%</h4>
            <p className="text-xs text-slate-400">Mehr Google-Bewertungen</p>
          </div>
        </div>
        <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-50">100%</h4>
            <p className="text-xs text-slate-400">DSGVO-konform ohne Speicherung</p>
          </div>
        </div>
        <div className="w-px h-12 bg-slate-800 hidden md:block"></div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-2xl font-extrabold text-slate-50">&lt; 3 Sek.</h4>
            <p className="text-xs text-slate-400">Generierungszeit für den Kunden</p>
          </div>
        </div>
      </section>

      {/* Apply Section / Form */}
      <section id="apply-form" className="max-w-3xl mx-auto px-6 py-20 relative z-10">
        <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 sm:p-12 shadow-2xl relative">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 mb-2">Werde jetzt RateFast-Partner</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Trage deine Daten ein. Wir erstellen deine personalisierte Review-Plattform und senden dir deinen Tisch-QR-Code zu.
            </p>
          </div>

          {formSubmitted ? (
            <div className="py-8 px-6 bg-slate-950/50 border border-blue-500/20 rounded-2xl text-center space-y-4 animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-50">Bewerbung eingegangen!</h3>
              <p className="text-xs text-slate-450 leading-relaxed max-w-sm mx-auto">
                Vielen Dank, <b>{formData.name}</b>! Wir haben deine Anfrage für <b>{formData.company}</b> erhalten. Jeremy Pape wird sich innerhalb der nächsten 24 Stunden bei dir melden.
              </p>
              <button 
                onClick={() => setFormSubmitted(false)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline pt-2"
              >
                Weiteres Unternehmen eintragen
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Dein Name</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="z.B. Jeremy Pape"
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Name des Unternehmens</label>
                  <input 
                    type="text" 
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="z.B. PizzAmore"
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">E-Mail-Adresse</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="z.B. info@tekkersclub.de"
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Stadt</label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="z.B. Bremerhaven"
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Telefonnummer (optional)</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="z.B. 015901923275"
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Nachricht oder Wünsche (optional)</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Gibt es Besonderheiten zu deiner Marke oder Google-Bewertungsseite?"
                  rows={4}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                />
              </div>

              {submitError && (
                <div className="p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-xs text-red-200">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all hover:scale-[1.01] shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                    Wird gesendet...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Als Partner bewerben
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </section>

      {/* Web Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-slate-900 text-center text-xs text-slate-500 relative z-20 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          © {new Date().getFullYear()} tekkers club Einzelunternehmen. Alle Rechte vorbehalten.
        </div>
        <div className="flex gap-4">
          <a href="/impressum" className="hover:text-slate-350 transition-colors">Impressum</a>
          <span>•</span>
          <a href="/datenschutz" className="hover:text-slate-350 transition-colors">Datenschutz</a>
        </div>
      </footer>

    </div>
  );
}
