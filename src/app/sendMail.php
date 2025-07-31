<?php

switch ($_SERVER['REQUEST_METHOD']) {
    case "OPTIONS": // Allow preflighting to take place
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: POST");
        header("Access-Control-Allow-Headers: content-type");
        exit;

    case "POST": // Handle contact form submission
        header("Access-Control-Allow-Origin: *");

        $json = file_get_contents('php://input');
        $params = json_decode($json);

        $email = htmlspecialchars($params->email);
        $name = htmlspecialchars($params->name);
        $messageContent = htmlspecialchars($params->message);

        $recipient = 'mail@steven-schulze.com';
        $subject = "Contact from <$email>";

        $message = "
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { padding: 10px; border: 1px solid #ddd; border-radius: 6px; background-color: #f9f9f9; }
                        .label { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <p><span class='label'>Name:</span><br> {$name}</p>
                        <p><span class='label'>Email:</span><br> {$email}</p>
                        <p><span class='label'>Message:</span><br>" . nl2br($messageContent) . "</p>
                    </div>
                </body>
            </html>
        ";

        $headers = [];
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-type: text/html; charset=utf-8';
        $headers[] = 'From: Steven Schulze <mail@steven-schulze.com>';
        $headers[] = "Reply-To: {$email}";

        mail($recipient, $subject, $message, implode("\r\n", $headers));
        break;

    default: // Reject all other methods
        header("Allow: POST", true, 405);
        exit;
}