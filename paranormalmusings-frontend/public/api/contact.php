<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get input
$input = json_decode(file_get_contents('php://input'), true);

// Validate
if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$name = trim($input['name']);
$email = trim($input['email']);
$message = trim($input['message']);

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

// SMTP Configuration
$smtp_host = 'mail.paranormalmusings.com';
$smtp_port = 587;
$smtp_user = 'test@paranormalmusings.com';
$smtp_pass = 'Paranormal@202622';
$to_email = 'test@paranormalmusings.com';
$from_email = 'test@paranormalmusings.com';

// Send via SMTP
$result = sendEmailViaSMTP($smtp_host, $smtp_port, $smtp_user, $smtp_pass, $from_email, $to_email, $name, $email, $message);

if ($result) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you. We have received your message.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send email. Please try again later.'
    ]);
}

function sendEmailViaSMTP($host, $port, $user, $pass, $from, $to, $name, $reply_to, $message) {
    try {
        // Connect to SMTP server
        $sock = @fsockopen($host, $port, $errno, $errstr, 10);

        if (!$sock) {
            return false;
        }

        // Read response
        $response = fgets($sock, 1024);

        // EHLO
        fputs($sock, "EHLO paranormalmusings.com\r\n");
        $response = fgets($sock, 1024);

        // STARTTLS
        fputs($sock, "STARTTLS\r\n");
        $response = fgets($sock, 1024);

        // Enable crypto
        stream_context_set_option($sock, 'ssl', 'verify_peer', false);
        stream_context_set_option($sock, 'ssl', 'verify_peer_name', false);
        stream_socket_enable_crypto($sock, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);

        // EHLO again
        fputs($sock, "EHLO paranormalmusings.com\r\n");
        $response = fgets($sock, 1024);

        // AUTH LOGIN
        fputs($sock, "AUTH LOGIN\r\n");
        $response = fgets($sock, 1024);

        // Send username
        fputs($sock, base64_encode($user) . "\r\n");
        $response = fgets($sock, 1024);

        // Send password
        fputs($sock, base64_encode($pass) . "\r\n");
        $response = fgets($sock, 1024);

        // MAIL FROM
        fputs($sock, "MAIL FROM: <" . $from . ">\r\n");
        $response = fgets($sock, 1024);

        // RCPT TO
        fputs($sock, "RCPT TO: <" . $to . ">\r\n");
        $response = fgets($sock, 1024);

        // DATA
        fputs($sock, "DATA\r\n");
        $response = fgets($sock, 1024);

        // Prepare email
        $subject = "New contact form message from " . $name;
        $headers = "From: " . $from . "\r\n";
        $headers .= "Reply-To: " . $reply_to . "\r\n";
        $headers .= "Subject: " . $subject . "\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

        $body = "Name: " . $name . "\r\n";
        $body .= "Email: " . $reply_to . "\r\n";
        $body .= "Message:\r\n" . $message;

        $email_data = $headers . "\r\n" . $body . "\r\n.\r\n";

        fputs($sock, $email_data);
        $response = fgets($sock, 1024);

        // QUIT
        fputs($sock, "QUIT\r\n");

        fclose($sock);

        return true;

    } catch (Exception $e) {
        return false;
    }
}
?>
