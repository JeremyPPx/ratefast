'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Star, 
  ArrowRight, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCcw, 
  MessageSquare, 
  Smartphone,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import LandingPage from './LandingPage';

type Step = 'welcome' | 'input' | 'loading' | 'output';

export default function ReviewGenerator() {
  const searchParams = useSearchParams();

  // Show SaaS Landing Page if no business parameters are provided
  const hasParams = searchParams.has('name') || searchParams.has('googleUrl');
  if (!hasParams) {
    return <LandingPage />;
  }

  // Parse URL Parameters with Fallbacks
  const businessName = searchParams.get('name') || 'Unser Geschäft';
  const rawGoogleUrl = searchParams.get('googleUrl') || 'https://google.com';
  const primaryColorParam = searchParams.get('primaryColor') || '2563EB'; // Default: Tailwind Blue-600

  // State Management
  const [step, setStep] = useState<Step>('welcome');
  const [keywords, setKeywords] = useState('');
  const [generatedReview, setGeneratedReview] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [rating, setRating] = useState<number>(5);

  // Normalize Primary Color (Ensure valid Hex)
  const hexColor = primaryColorParam.startsWith('#') 
    ? primaryColorParam 
    : `#${primaryColorParam}`;

  // Generate hover and light background versions
  const cssStyles = {
    '--primary': hexColor,
    '--primary-hover': `${hexColor}dd`, // 86% opacity for hover
    '--primary-bg': `${hexColor}1a`,    // 10% opacity for backgrounds
    '--primary-glow': `${hexColor}40`,  // 25% opacity for focus rings
  } as React.CSSProperties;

  // Cycle loading messages for a premium feel
  const loadingMessages = [
    'Stichworte werden analysiert...',
    'Kreativer Text wird verfasst...',
    'Tonalität wird optimiert (5-Sterne-Vibe)...',
    'Review wird finalisiert...'
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'loading') {
      setLoadingTextIndex(0);
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Handle Review Generation Call
  const handleGenerate = async () => {
    setStep('loading');
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/generate.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName,
          keywords,
          rating,
        }),
      });

      if (!response.ok) {
        throw new Error('Verbindung zum Server fehlgeschlagen.');
      }

      const data = await response.json();
      if (data.error && !data.review) {
        throw new Error(data.error);
      }

      setGeneratedReview(data.review);
      setStep('output');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Etwas ist schiefgelaufen. Bitte versuche es erneut.');
      setStep('input');
    }
  };

  // Handle Copy & Open Google Flow
  const handleCopyAndRedirect = async () => {
    try {
      await navigator.clipboard.writeText(generatedReview);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);

      // Open Google Review Link in new tab
      window.open(decodeURIComponent(rawGoogleUrl), '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Clipboard copy failed:', err);
      // Fallback redirect even if clipboard fail
      window.open(decodeURIComponent(rawGoogleUrl), '_blank', 'noopener,noreferrer');
    }
  };

  const handleReset = () => {
    setKeywords('');
    setGeneratedReview('');
    setRating(5);
    setStep('welcome');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-6 select-none font-sans" style={cssStyles}>
      
      {/* Background ambient glow effect */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-[var(--primary)] opacity-10 blur-[100px] pointer-events-none"></div>

      {/* Main Container - Renders as a premium iPhone mockup on desktop, full-screen on mobile */}
      <div className="w-full sm:max-w-[410px] sm:h-[820px] bg-slate-900 border-0 sm:border-8 sm:border-slate-800 rounded-none sm:rounded-[40px] shadow-2xl flex flex-col relative overflow-hidden h-screen z-10">
        
        {/* Mock iPhone Speaker and Camera bar (Desktop only view helper) */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-6 bg-slate-800 rounded-b-2xl z-50"></div>

        {/* App Container */}
        <div className="flex-1 flex flex-col h-full pt-4 sm:pt-8 pb-6 px-6 overflow-y-auto">
          
          {/* Header */}
          <div className="flex justify-between items-center py-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary-bg)] flex items-center justify-center">
                <Star className="w-5 h-5 text-[var(--primary)] fill-[var(--primary)]" />
              </div>
              <span className="font-bold text-sm text-slate-100 tracking-wide uppercase">RateFast</span>
            </div>
            <div className="px-2.5 py-1 bg-slate-800 rounded-full text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
              Live
            </div>
          </div>

          {/* Error Alert if any */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-950/50 border border-red-500/30 rounded-xl text-xs text-red-200">
              {errorMessage}
            </div>
          )}

          {/* STEP 1: WELCOME SCREEN */}
          {step === 'welcome' && (
            <div className="flex-1 flex flex-col justify-between py-4 animate-fadeIn">
              <div className="flex-1 flex flex-col justify-center items-center text-center">
                
                {/* Visual Icon Stack */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-3xl bg-[var(--primary-bg)] flex items-center justify-center animate-pulse">
                    <MessageSquare className="w-10 h-10 text-[var(--primary)]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center shadow-lg">
                    <Star className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>

                <h1 className="text-2xl font-extrabold text-slate-50 tracking-tight leading-tight mb-3">
                  Deine Meinung zählt bei
                </h1>
                
                <div className="px-4 py-2 bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-sm mb-4 max-w-xs break-words">
                  <h2 className="text-lg font-bold text-[var(--primary)]">
                    {businessName}
                  </h2>
                </div>

                <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                  Bist du zufrieden mit uns? Hilf anderen Kunden, uns zu finden! Unser KI-Assistent hilft dir, in wenigen Sekunden eine professionelle 5-Sterne-Bewertung zu schreiben.
                </p>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setStep('input')}
                  className="w-full py-4 px-6 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[var(--primary-glow)]"
                  style={{ backgroundColor: 'var(--primary)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                >
                  Jetzt Bewertung schreiben
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: INPUT SCREEN */}
          {step === 'input' && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div>
                <h2 className="text-xl font-bold text-slate-100 mb-1">
                  Was hat dir gefallen?
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                  Gib einfach ein paar Stichworte ein. Unsere KI formuliert daraus eine vollständige Google-Bewertung.
                </p>

                <div className="space-y-4">
                  {/* Sterne-Auswahl */}
                  <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex flex-col items-center justify-center gap-2.5 shadow-inner">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Deine Bewertung
                    </span>
                    <div className="flex gap-2.5">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRating(num)}
                          className="hover:scale-110 active:scale-95 transition-transform duration-100 p-0.5 focus:outline-none"
                        >
                          <Star 
                            className={`w-7 h-7 transition-colors ${
                              num <= rating 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                      {rating === 5 && '😍 Begeistert (5 Sterne)'}
                      {rating === 4 && '😊 Sehr gut / Zufrieden (4 Sterne)'}
                      {rating === 3 && '😐 Durchschnittlich / Gemischt (3 Sterne)'}
                      {rating === 2 && '🙁 Mangelhaft / Enttäuscht (2 Sterne)'}
                      {rating === 1 && '😡 Katastrophal / Ablehnend (1 Stern)'}
                    </span>
                  </div>

                  <div className="relative">
                    <textarea
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                      placeholder="z.B. super Pizza, sehr freundlicher Kellner, kurze Wartezeit..."
                      rows={6}
                      className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)] transition-all duration-200 resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono">
                      {keywords.length} Zeichen
                    </div>
                  </div>

                  {/* Suggestion tags */}
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block mb-2">Häufige Stichworte</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Leckeres Essen',
                        'Freundlicher Service',
                        'Kurze Wartezeit',
                        'Schönes Ambiente',
                        'Gutes Preis-Leistungs-Verhältnis',
                        'Sehr sauber'
                      ].map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const separator = keywords.trim() ? ', ' : '';
                            if (!keywords.toLowerCase().includes(tag.toLowerCase())) {
                              setKeywords(prev => prev + separator + tag);
                            }
                          }}
                          className="px-3 py-1.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/30 rounded-xl text-xs text-slate-300 transition-colors"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={handleGenerate}
                  disabled={!keywords.trim()}
                  className="w-full py-4 px-6 rounded-2xl text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  <Sparkles className="w-5 h-5 fill-current" />
                  Bewertung erstellen
                </button>
                <button
                  onClick={() => setStep('welcome')}
                  className="w-full py-3 px-6 rounded-2xl text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors text-center"
                >
                  Zurück
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: LOADING SCREEN */}
          {step === 'loading' && (
            <div className="flex-1 flex flex-col items-center justify-center py-6 animate-fadeIn">
              
              {/* Outer pulsing ring */}
              <div className="relative w-28 h-28 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[var(--primary)] opacity-10 animate-ping"></div>
                <div className="absolute w-20 h-20 rounded-full bg-[var(--primary)] opacity-20 animate-pulse"></div>
                
                {/* Center loading ring */}
                <div className="w-14 h-14 rounded-full border-4 border-slate-800 border-t-[var(--primary)] animate-spin"></div>
              </div>

              <h3 className="text-base font-bold text-slate-100 mb-2">
                KI-Assistent schreibt...
              </h3>
              
              {/* Transitioning helper messages */}
              <div className="h-6 overflow-hidden flex items-center justify-center">
                <p className="text-xs text-slate-400 animate-pulse text-center">
                  {loadingMessages[loadingTextIndex]}
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: OUTPUT SCREEN */}
          {step === 'output' && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider">Erfolgreich erstellt!</span>
                </div>

                <h2 className="text-xl font-bold text-slate-100">
                  Deine Bewertung ist fertig
                </h2>

                <p className="text-xs text-slate-400">
                  Kopiere den Text und füge ihn bei Google ein.
                </p>

                {/* Review Text Box */}
                <div className="relative bg-slate-950 border border-slate-800 rounded-2xl p-4 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex text-amber-500 gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-slate-700'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-[10px] bg-[var(--primary-bg)] text-[var(--primary)] font-mono px-2 py-0.5 rounded">
                      {rating} Sterne
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed italic pr-2">
                    "{generatedReview}"
                  </p>

                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(generatedReview);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 2000);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-slate-400 hover:text-slate-200 transition-all"
                    title="In die Zwischenablage kopieren"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Quick Help Guide */}
                <div className="p-3.5 bg-slate-800/30 border border-slate-700/10 rounded-2xl text-xs space-y-2.5 text-slate-400">
                  <span className="font-semibold text-slate-300 block">So funktioniert's:</span>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-bold">1</span>
                    <p className="leading-snug">Klicke unten auf den großen Button. Der Text kopiert sich automatisch.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-bold">2</span>
                    <p className="leading-snug">Google öffnet sich. Wähle dort <b>5 Sterne</b> aus.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-slate-300 font-bold">3</span>
                    <p className="leading-snug">Halte das Textfeld gedrückt und wähle <b>Einfügen</b>.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleCopyAndRedirect}
                  className="w-full py-4 px-6 rounded-2xl text-white font-semibold flex items-center justify-center gap-2.5 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-[var(--primary-glow)]"
                  style={{ backgroundColor: 'var(--primary)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-hover)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                >
                  {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  <span>Kopieren & Google öffnen</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 px-6 rounded-2xl text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Neue Bewertung erstellen
                </button>
              </div>
            </div>
          )}

          {/* Footer Legal Links */}
          <div className="mt-auto pt-6 pb-2 text-center text-[10px] text-slate-600 flex justify-center gap-3 border-t border-slate-800/40">
            <a href="/impressum" className="hover:text-slate-400 transition-colors">Impressum</a>
            <span>•</span>
            <a href="/datenschutz" className="hover:text-slate-400 transition-colors">Datenschutz</a>
          </div>

        </div>
      </div>
    </div>
  );
}
