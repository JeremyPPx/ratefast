<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

// Parse JSON input
$input = json_decode(file_get_contents('php://input'), true);
$name = $input['name'] ?? '';
$company = $input['company'] ?? '';
$email = $input['email'] ?? '';
$phone = $input['phone'] ?? '';
$city = $input['city'] ?? '';
$message = $input['message'] ?? '';

if (empty($name) || empty($company) || empty($email) || empty($city)) {
    http_response_code(400);
    echo json_encode(["error" => "Name, company, email and city are required fields"]);
    exit();
}

// Log application locally on server logs
error_log("RateFast Application - Company: $company, Name: $name ($email), Phone: $phone, City: $city");

// Build HTML email
$to = 'admin@tekkersclub.de';
$subject = "=?UTF-8?B?" . base64_encode("Neue RateFast Partner-Bewerbung von $company") . "?=";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Info@tekkersclub.de\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

$emailBodyHtml = '
  <div style="font-family: sans-serif; max-width: 600px; color: #333;">
    <h2 style="color: #2563eb; border-bottom: 2px solid #eaeaea; padding-bottom: 10px;">Neue RateFast Partner-Bewerbung</h2>
    
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <tr>
        <td style="padding: 8px 0; font-weight: bold; width: 180px;">Unternehmen:</td>
        <td style="padding: 8px 0;">' . htmlspecialchars($company) . '</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Ansprechpartner:</td>
        <td style="padding: 8px 0;">' . htmlspecialchars($name) . '</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">E-Mail:</td>
        <td style="padding: 8px 0;"><a href="mailto:' . htmlspecialchars($email) . '">' . htmlspecialchars($email) . '</a></td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Telefon:</td>
        <td style="padding: 8px 0;">' . htmlspecialchars($phone ?: 'Nicht angegeben') . '</td>
      </tr>
      <tr>
        <td style="padding: 8px 0; font-weight: bold;">Stadt:</td>
        <td style="padding: 8px 0;">' . htmlspecialchars($city) . '</td>
      </tr>
    </table>
    
    <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #eaeaea;">
      <h4 style="margin-top: 0; color: #555;">Nachricht / Wünsche:</h4>
      <p style="margin-bottom: 0; white-space: pre-wrap; font-style: italic;">' . nl2br(htmlspecialchars($message ?: 'Keine Nachricht hinterlassen.')) . '</p>
    </div>
    
    <hr style="border: 0; border-top: 1px solid #eaeaea; margin-top: 40px;" />
    <p style="font-size: 11px; color: #888; text-align: center;">Diese Mail wurde automatisch von RateFast generiert.</p>
  </div>
';

// Send email using PHP's native mail() function
$mailSent = mail($to, $subject, $emailBodyHtml, $headers);

if ($mailSent) {
    echo json_encode([
        "success" => true,
        "sent" => true
    ]);
} else {
    // If mail sending failed, return warning but log details
    error_log("Failed to send mail using mail() to $to");
    echo json_encode([
        "success" => true,
        "sent" => false,
        "error" => "PHP mail() execution failed"
    ]);
}
?>
