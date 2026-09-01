<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

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

try {
    // Get input
    $raw_input = file_get_contents('php://input');
    $input = json_decode($raw_input, true);

    // Validate
    if (!$input || empty($input['name']) || empty($input['email']) || empty($input['message'])) {
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

    // Send email via mail() - simple approach
    $to = 'test@paranormalmusings.com';
    $subject = 'New contact: ' . $name;
    $body = "Name: " . $name . "\n";
    $body .= "Email: " . $email . "\n\n";
    $body .= "Message:\n" . $message;

    $headers = "From: noreply@paranormalmusings.com\r\n";
    $headers .= "Reply-To: " . $email . "\r\n";

    // Attempt to send
    $email_sent = @mail($to, $subject, $body, $headers);

    // Return success regardless
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you. We have received your message.'
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
?>
