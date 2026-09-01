<?php
// Enable error reporting for debugging (log only, don't display)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set JSON header
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate required fields
    if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    // Validate email
    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Invalid email address']);
        exit;
    }

    // Check honeypot (spam protection)
    if (!empty($input['honeypot'])) {
        // Silently succeed to fool spam bots
        echo json_encode([
            'success' => true,
            'message' => 'Thank you. We have received your message.'
        ]);
        exit;
    }

    // Sanitize inputs
    $name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
    $email = htmlspecialchars(trim($input['email']), ENT_QUOTES, 'UTF-8');
    $message = htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8');

    // Validate message length
    if (strlen($message) < 10 || strlen($message) > 5000) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Message must be 10-5000 characters']);
        exit;
    }

    // Email configuration
    $to_email = 'paranormalmusings@proton.me';
    $from_email = 'contact@paranormalmusings.com';
    $subject = "New contact form message from " . $name;

    // Email headers
    $headers = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . $from_email . "\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

    // Generate HTML email
    $email_html = generateEmailHtml($name, $email, $message);

    // Send email
    $email_sent = mail($to_email, $subject, $email_html, $headers);

    if ($email_sent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Thank you. We have received your message. We read everything but cannot reply to every message.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to send email. Please try again later.'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'An unexpected error occurred.'
    ]);
    error_log('Contact form error: ' . $e->getMessage());
}

exit;

/**
 * Generate HTML email template
 */
function generateEmailHtml($name, $email, $message) {
    return "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                border-bottom: 2px solid #8b7355;
                padding-bottom: 10px;
                margin-bottom: 20px;
            }
            .header h2 {
                margin: 0;
                color: #333;
            }
            .field {
                margin-bottom: 15px;
            }
            .label {
                font-weight: bold;
                color: #666;
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 5px;
            }
            .message {
                background: #f9f9f9;
                padding: 15px;
                border-left: 3px solid #8b7355;
                border-radius: 4px;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #999;
            }
            a {
                color: #8b7355;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>New Contact Form Message</h2>
            </div>

            <div class='field'>
                <div class='label'>From:</div>
                <div>" . $name . "</div>
            </div>

            <div class='field'>
                <div class='label'>Reply To:</div>
                <div><a href='mailto:" . $email . "'>" . $email . "</a></div>
            </div>

            <div class='message'>
                <div class='label'>Message:</div>
                <div>" . nl2br($message) . "</div>
            </div>

            <div class='footer'>
                <p>This email was sent from the Paranormal Musings contact form at paranormalmusings.com</p>
            </div>
        </div>
    </body>
    </html>
    ";
}
?>
