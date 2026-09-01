<?php
// Contact Form Handler - Simple Version
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    // Validate
    if (empty($input['name']) || empty($input['email']) || empty($input['message'])) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }

    if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Invalid email']);
        exit;
    }

    // Sanitize
    $name = htmlspecialchars(trim($input['name']));
    $email = htmlspecialchars(trim($input['email']));
    $message = htmlspecialchars(trim($input['message']));

    // Email config
    $to = 'test@paranormalmusings.com';
    $subject = 'New contact form message from ' . $name;
    $body = "Name: $name\nEmail: $email\n\nMessage:\n$message";

    $headers = "From: test@paranormalmusings.com\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send email
    if (mail($to, $subject, $body, $headers)) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you. We have received your message.'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Failed to send email'
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Server error'
    ]);
}
?>
