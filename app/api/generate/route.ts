import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

// Helper to generate a natural German review fallback from keywords and rating
function generateFallbackReview(businessName: string, keywordsString: string, rating: number): string {
  const business = businessName || 'diesem Ort';
  const cleanKeywords = keywordsString
    ? keywordsString.split(',').map(k => k.trim()).filter(k => k.length > 0)
    : [];

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const kwJoin = cleanKeywords.length > 0 
    ? `${cleanKeywords.slice(0, -1).join(', ')}${cleanKeywords.length > 1 ? ' und ' : ''}${cleanKeywords[cleanKeywords.length - 1]}`
    : '';

  if (rating === 5) {
    if (!kwJoin) {
      return `Absolut empfehlenswert! Wir hatten eine fantastische Zeit bei ${business}. Der Service war erstklassig und die Atmosphäre sehr einladend. Wir kommen auf jeden Fall wieder!`;
    }
    return `Ein absolut gelungener Besuch bei ${business}! Besonders ${kwJoin} haben uns vollkommen begeistert. Die Qualität ist top – wir kommen gerne wieder!`;
  } 
  
  if (rating === 4) {
    if (!kwJoin) {
      return `Wir hatten einen sehr guten Aufenthalt bei ${business}. Der Service war freundlich und alles lief reibungslos. Wir können einen Besuch absolut empfehlen!`;
    }
    return `Sehr schöner Besuch bei ${business}. ${capitalize(kwJoin)} war wirklich gut und wir waren insgesamt sehr zufrieden. Nur eine Kleinigkeit könnte noch optimiert werden, aber wir kommen gerne wieder!`;
  }
  
  if (rating === 3) {
    if (!kwJoin) {
      return `Der Besuch bei ${business} war im Großen und Ganzen in Ordnung. Es gab sowohl positive Aspekte als auch Punkte, die noch verbesserungswürdig sind. Durchschnittlicher Service.`;
    }
    return `Unser Besuch bei ${business} war durchwachsen. Zwar war ${capitalize(kwJoin)} in Ordnung, aber insgesamt hat uns das gewisse Etwas gefehlt. Es gibt noch deutlichen Spielraum für Verbesserungen.`;
  }
  
  if (rating === 2) {
    if (!kwJoin) {
      return `Leider war der Besuch bei ${business} ziemlich enttäuschend. Der Service hat uns nicht überzeugt und das Gesamterlebnis war deutlich unter unseren Erwartungen.`;
    }
    return `Leider eine enttäuschende Erfahrung bei ${business}. Trotz Stichworten wie ${kwJoin} war der Gesamteindruck negativ. Das Preis-Leistungs-Verhältnis stimmt hier leider nicht.`;
  }
  
  // rating === 1
  if (!kwJoin) {
    return `Katastrophal! Überhaupt nicht zu empfehlen. Wir hatten eine sehr schlechte Erfahrung bei ${business} und werden definitiv nicht wiederkommen.`;
  }
  return `Absolut unzufrieden mit ${business}. Trotz ${kwJoin} war das Gesamterlebnis ein kompletter Reinfall. Schlechter Service und mangelnde Qualität. Nie wieder!`;
}

export async function POST(request: Request) {
  try {
    const { businessName, keywords, rating = 5 } = await request.json();

    if (!businessName) {
      return NextResponse.json(
        { error: 'Business name is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Mock fallback when API key is missing
      const mockReview = generateFallbackReview(businessName, keywords, rating);
      return NextResponse.json({
        review: mockReview,
        isMock: true,
      });
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    let sentimentStyle = '';
    switch (rating) {
      case 5:
        sentimentStyle = 'eine begeisterte, euphorisierende 5-Sterne-Bewertung. Drücke maximale Zufriedenheit aus.';
        break;
      case 4:
        sentimentStyle = 'eine sehr positive 4-Sterne-Bewertung. Drücke große Zufriedenheit aus, evtl. mit einer winzigen, freundlichen Anmerkung.';
        break;
      case 3:
        sentimentStyle = 'eine durchschnittliche, neutrale 3-Sterne-Bewertung. Hebe positive Dinge hervor, aber nenne auch sachlich und konstruktiv Verbesserungsvorschläge.';
        break;
      case 2:
        sentimentStyle = 'eine enttäuschte, ablehnende 2-Sterne-Bewertung. Schildere unzufriedenes Feedback und negative Kritik auf eine sachliche, aber enttäuschte Weise.';
        break;
      case 1:
        sentimentStyle = 'eine sehr kritische, unzufriedene und stark ablehnende 1-Sterne-Bewertung. Drücke tiefes Missfallen und eine Warnung bzw. große Enttäuschung aus.';
        break;
      default:
        sentimentStyle = 'eine positive 5-Sterne-Bewertung.';
    }

    const systemPrompt = `Du bist ein hilfreicher Assistent, der authentische und natürlich klingende Google-Bewertungen für lokale Unternehmen schreibt.
Die Bewertung MUSS auf Deutsch verfasst sein.
Schreibe maximal 2 bis 3 Sätze.
Verfasse ${sentimentStyle}
Nutze die bereitgestellten Stichworte/Keywords des Nutzers und formuliere sie in flüssiges, natürliches Deutsch um.
Vermeide künstlich klingende Marketingsprache, Abkürzungen oder übertriebene Floskeln. Es muss so klingen, als hätte es ein echter Kunde geschrieben.`;

    const userPrompt = `Unternehmen: ${businessName}
Sterne-Bewertung: ${rating} von 5 Sternen
Stichworte/Keywords: ${keywords || 'Keine Stichworte angegeben'}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    const generatedReview = completion.choices[0]?.message?.content?.trim();

    if (!generatedReview) {
      throw new Error('No content returned from OpenAI');
    }

    return NextResponse.json({
      review: generatedReview,
      isMock: false,
    });

  } catch (error: any) {
    console.error('Error generating review:', error);
    // Graceful fallback on error so the frontend is never broken
    try {
      const { businessName, keywords, rating = 5 } = await request.clone().json();
      const mockReview = generateFallbackReview(businessName, keywords, rating);
      return NextResponse.json({
        review: mockReview,
        isMock: true,
        error: error.message || 'OpenAI API call failed',
      });
    } catch {
      return NextResponse.json(
        { error: 'Failed to generate review and fallback failed' },
        { status: 500 }
      );
    }
  }
}
