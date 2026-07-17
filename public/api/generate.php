<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// GET Debug Handler
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $envFile = dirname(__DIR__) . '/.env';
    $exists = file_exists($envFile);
    $apiKey = '';
    if ($exists) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($lines as $line) {
            if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
                list($key, $value) = explode('=', $line, 2);
                if (trim($key) === 'OPENAI_API_KEY') {
                    $apiKey = trim($value);
                }
            }
        }
    }
    echo json_encode([
        "status" => "debug",
        "env_path" => $envFile,
        "env_exists" => $exists,
        "api_key_loaded" => !empty($apiKey),
        "api_key_length" => strlen($apiKey),
        "api_key_preview" => $apiKey ? substr($apiKey, 0, 7) . '...' : 'none'
    ]);
    exit();
}

// Parse JSON input
$input = json_decode(file_get_contents('php://input'), true);
$businessName = $input['businessName'] ?? '';
$keywords = $input['keywords'] ?? '';
$rating = intval($input['rating'] ?? 5);

if (empty($businessName)) {
    http_response_code(400);
    echo json_encode(["error" => "Business name is required"]);
    exit();
}

// Helper to load .env variables if present
$envFile = dirname(__DIR__) . '/.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && strpos($line, '#') !== 0) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

$apiKey = getenv('OPENAI_API_KEY');

// Fallback review generator
function generateFallbackReview($businessName, $keywordsString, $rating) {
    $business = $businessName ?: 'diesem Ort';
    $cleanKeywords = [];
    if (!empty($keywordsString)) {
        $cleanKeywords = array_filter(array_map('trim', explode(',', $keywordsString)));
    }

    $kwJoin = '';
    if (count($cleanKeywords) > 0) {
        if (count($cleanKeywords) === 1) {
            $kwJoin = reset($cleanKeywords);
        } else {
            $last = array_pop($cleanKeywords);
            $kwJoin = implode(', ', $cleanKeywords) . ' und ' . $last;
        }
    }

    if ($rating === 5) {
        if (empty($kwJoin)) {
            return "Absolut empfehlenswert! Wir hatten eine fantastische Zeit bei $business. Der Service war erstklassig und die Atmosphäre sehr einladend. Wir kommen auf jeden Fall wieder!";
        }
        return "Ein absolut gelungener Besuch bei $business! Besonders $kwJoin haben uns vollkommen begeistert. Die Qualität ist top – wir kommen gerne wieder!";
    } 
    
    if ($rating === 4) {
        if (empty($kwJoin)) {
            return "Wir hatten einen sehr guten Aufenthalt bei $business. Der Service war freundlich und alles lief reibungslos. Wir können einen Besuch absolut empfehlen!";
        }
        return "Sehr schöner Besuch bei $business. " . ucfirst($kwJoin) . " war wirklich gut und wir waren insgesamt sehr zufrieden. Nur eine Kleinigkeit könnte noch optimiert werden, aber wir kommen gerne wieder!";
    }
    
    if ($rating === 3) {
        if (empty($kwJoin)) {
            return "Der Besuch bei $business war im Großen und Ganzen in Ordnung. Es gab sowohl positive Aspekte als auch Punkte, die noch verbesserungswürdig sind. Durchschnittlicher Service.";
        }
        return "Unser Besuch bei $business war durchwachsen. Zwar war " . ucfirst($kwJoin) . " in Ordnung, aber insgesamt hat uns das gewisse Etwas gefehlt. Es gibt noch deutlichen Spielraum für Verbesserungen.";
    }
    
    if ($rating === 2) {
        if (empty($kwJoin)) {
            return "Leider war der Besuch bei $business ziemlich enttäuschend. Der Service hat uns nicht überzeugt und das Gesamterlebnis war deutlich unter unseren Erwartungen.";
        }
        return "Leider eine enttäuschende Erfahrung bei $business. Trotz Stichworten wie $kwJoin war der Gesamteindruck negativ. Das Preis-Leistungs-Verhältnis stimmt hier leider nicht.";
    }
    
    // rating === 1
    if (empty($kwJoin)) {
        return "Katastrophal! Überhaupt nicht zu empfehlen. Wir hatten eine sehr schlechte Erfahrung bei $business und werden definitiv nicht wiederkommen.";
    }
    return "Absolut unzufrieden mit $business. Trotz $kwJoin war das Gesamterlebnis ein kompletter Reinfall. Schlechter Service und mangelnde Qualität. Nie wieder!";
}

if (empty($apiKey)) {
    // Return local mock review if API key is not set
    $mockReview = generateFallbackReview($businessName, $keywords, $rating);
    echo json_encode([
        "review" => $mockReview,
        "isMock" => true
    ]);
    exit();
}

// Map rating to prompt description
$sentimentStyle = '';
switch ($rating) {
    case 5:
        $sentimentStyle = 'eine begeisterte, euphorisierende 5-Sterne-Bewertung. Drücke maximale Zufriedenheit aus.';
        break;
    case 4:
        $sentimentStyle = 'eine sehr positive 4-Sterne-Bewertung. Drücke große Zufriedenheit aus, evtl. mit einer winzigen, freundlichen Anmerkung.';
        break;
    case 3:
        $sentimentStyle = 'eine durchschnittliche, neutrale 3-Sterne-Bewertung. Hebe positive Dinge hervor, aber nenne auch sachlich und konstruktiv Verbesserungsvorschläge.';
        break;
    case 2:
        $sentimentStyle = 'eine enttäuschte, ablehnende 2-Sterne-Bewertung. Schildere unzufriedenes Feedback und negative Kritik auf eine sachliche, aber enttäuschte Weise.';
        break;
    case 1:
        $sentimentStyle = 'eine sehr kritische, unzufriedene und stark ablehnende 1-Sterne-Bewertung. Drücke tiefes Missfallen und eine Warnung bzw. große Enttäuschung aus.';
        break;
    default:
        $sentimentStyle = 'eine positive 5-Sterne-Bewertung.';
}

$systemPrompt = "Du bist ein hilfreicher Assistent, der authentische und natürlich klingende Google-Bewertungen für lokale Unternehmen schreibt.\n"
              . "Die Bewertung MUSS auf Deutsch verfasst sein.\n"
              . "Schreibe maximal 2 bis 3 Sätze.\n"
              . "Verfasse $sentimentStyle\n"
              . "Verwende im generierten Text KEINE Gedankenstriche (wie - oder —).\n"
              . "Nutze die bereitgestellten Stichworte/Keywords des Nutzers und formuliere sie in flüssiges, natürliches Deutsch um.\n"
              . "Vermeide künstlich klingende Marketingsprache, Abkürzungen oder übertriebene Floskeln. Es muss so klingen, als hätte es ein echter Kunde geschrieben.";

$userPrompt = "Unternehmen: $businessName\n"
            . "Sterne-Bewertung: $rating von 5 Sternen\n"
            . "Stichworte/Keywords: " . ($keywords ?: 'Keine Stichworte angegeben');

$payload = [
    "model" => "gpt-4o-mini",
    "messages" => [
        ["role" => "system", "content" => $systemPrompt],
        ["role" => "user", "content" => $userPrompt]
    ],
    "temperature" => 0.8,
    "max_tokens" => 150
];

// Execute OpenAI cURL call
$ch = curl_init('https://api.openai.com/v1/chat/completions');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error || $httpCode !== 200) {
    // Log error locally on server and return fallback review
    error_log("OpenAI API error: $error (HTTP $httpCode)");
    $mockReview = generateFallbackReview($businessName, $keywords, $rating);
    echo json_encode([
        "review" => $mockReview,
        "isMock" => true,
        "error" => $error ?: "HTTP Status $httpCode"
    ]);
} else {
    $resData = json_decode($response, true);
    $generatedReview = $resData['choices'][0]['message']['content'] ?? '';
    echo json_encode([
        "review" => trim($generatedReview),
        "isMock" => false
    ]);
}
