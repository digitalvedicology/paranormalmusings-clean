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

// Log message to file
$log_dir = '/home/paranormalmusings/public_html/contact_messages';
if (!is_dir($log_dir)) {
    @mkdir($log_dir, 0755, true);
}

$log_file = $log_dir . '/' . date('Y-m-d_H-i-s') . '_' . md5($email) . '.txt';
$log_content = "Name: " . $name . "\n";
$log_content .= "Email: " . $email . "\n";
$log_content .= "Date: " . date('Y-m-d H:i:s') . "\n";
$log_content .= "Message:\n" . $message . "\n";
$log_content .= "---\n";

@file_put_contents($log_file, $log_content, FILE_APPEND);

// Try to send email
$sent = false;
$to = 'test@paranormalmusings.com';
$subject = 'New contact form message from ' . $name;
$body = $log_content;
$headers = "From: test@paranormalmusings.com\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

// Attempt 1: mail() function
$sent = @mail($to, $subject, $body, $headers);

// Always return success if message was logged
if (file_exists($log_file)) {
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you. We have received your message.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to process message'
    ]);
}
?>
