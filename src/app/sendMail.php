<?php
switch ($_SERVER['REQUEST_METHOD']) {
    case 'OPTIONS':
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');
        exit;

    case 'POST':
        header('Access-Control-Allow-Origin: *');

        // JSON aus dem Request lesen
        $json   = file_get_contents('php://input');
        $params = json_decode($json);

        // -------- Eingaben absichern --------
        $name   = isset($params->name)    ? trim($params->name)    : '';
        $email  = isset($params->email)   ? trim($params->email)   : '';
        $msgRaw = isset($params->message) ? trim($params->message) : '';
        $lang   = isset($params->lang)    ? strtolower(trim($params->lang)) : 'de';
        $isEn   = ($lang === 'en');

        // E-Mail validieren (nur gültige als Reply-To zulassen)
        $emailValid = filter_var($email, FILTER_VALIDATE_EMAIL) ?: '';

        // XSS/HTML neutralisieren
        $nameSafe = htmlspecialchars($name,   ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $msgSafe  = htmlspecialchars($msgRaw, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        // -------- Absender/Ziel/Betreff --------
        $to       = 'Steven Schulze <mail@steven-schulze.com>'; // mit Anzeigename
        $from     = 'noreply@steven-schulze.com';
        $fromName = 'Steven Schulze';

        $subject  = $isEn
            ? "New message via your contact form  {$nameSafe}"
            : "Neue Anfrage über dein Kontaktformular  {$nameSafe}";

        // Header-Texte/Labels zweisprachig
        $mailHeader = $isEn ? "New inquiry received" : "Neue Anfrage erhalten";
        $labelName  = $isEn ? "Name"   : "Name";
        $labelEmail = $isEn ? "Email"  : "E-Mail";
        $labelMsg   = $isEn ? "Message": "Nachricht";
        $mailFooter = $isEn
            ? "This message was sent via the contact form on steven-schulze.com."
            : "Diese Nachricht wurde über das Kontaktformular auf steven-schulze.com gesendet.";

        // Datum/Message-ID (hilft Filtern)
        $date      = date('r');
        $messageId = sprintf('<%s@steven-schulze.com>', bin2hex(random_bytes(16)));

        // -------- HTML-Body (schön formatiert) --------
        $html = "
        <html>
          <head>
            <meta charset='utf-8'>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f7; padding: 20px; }
              .mail-wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; border: 1px solid #e0e0e0; box-shadow: 0 2px 6px rgba(0,0,0,0.08); overflow: hidden; }
              .header { background-color: #08463b; color: #ffffff; padding: 16px 24px; font-size: 18px; font-weight: 600; }
              .content { padding: 24px; }
              .label { font-weight: 600; color: #08463b; }
              p { margin: 10px 0 18px; font-size: 16px; }
              .footer { background-color: #f4f4f7; padding: 14px 24px; text-align: center; font-size: 12px; color: #888; }
              a { color: #08463b; text-decoration: none; }
            </style>
          </head>
          <body>
            <div class='mail-wrapper'>
              <div class='header'>{$mailHeader}</div>
              <div class='content'>
                <p><span class='label'>{$labelName}:</span><br>{$nameSafe}</p>
                <p><span class='label'>{$labelEmail}:</span><br>" . ($emailValid ? htmlspecialchars($emailValid, ENT_QUOTES, 'UTF-8') : '—') . "</p>
                <p><span class='label'>{$labelMsg}:</span><br>" . nl2br($msgSafe) . "</p>
              </div>
              <div class='footer'>
                {$mailFooter}
              </div>
            </div>
          </body>
        </html>";

        // (Optional) Plaintext-Alternative – hier nicht gesendet, nur vorbereitet
        $text = "{$labelName}: {$name}\n"
              . "{$labelEmail}: " . ($emailValid ?: '—') . "\n"
              . "{$labelMsg}:\n{$msgRaw}\n";

        // -------- Header setzen --------
        $headers   = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/html; charset=utf-8';
        $headers[] = "From: {$fromName} <{$from}>";
        if ($emailValid) {
            $headers[] = "Reply-To: {$emailValid}";
        }
        $headers[] = "Date: {$date}";
        $headers[] = "Message-ID: {$messageId}";
        $headers[] = 'X-Mailer: PHP/' . phpversion();

        // Envelope-Sender (-f) setzen -> Return-Path passt zur Domain (besser für Filter)
        @mail($to, $subject, $html, implode("\r\n", $headers), "-f {$from}");

        // Optional: eine einfache 200-Antwort senden
        http_response_code(200);
        echo $isEn ? 'OK' : 'OK';
        exit;

    default:
        header('Allow: POST', true, 405);
        exit;
}
?>