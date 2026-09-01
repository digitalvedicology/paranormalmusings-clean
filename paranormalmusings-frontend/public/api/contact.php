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
    $input = json_decode(file_get_contents('php://input'), true);

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

    // Try PHPMailer first
    $email_sent = false;

    if (file_exists(__DIR__ . '/../../../vendor/autoload.php')) {
        try {
            require __DIR__ . '/../../../vendor/autoload.php';

            $mail = new \PHPMailer\PHPMailer\PHPMailer(true);

            // SMTP Configuration
            $mail->isSMTP();
            $mail->Host = 'smtp.hostinger.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'test@paranormalmusings.com';
            $mail->Password = 'Paranormal@202622';
            $mail->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // Email details
            $mail->setFrom('test@paranormalmusings.com', 'Paranormal Musings');
            $mail->addAddress('test@paranormalmusings.com');
            $mail->addReplyTo($email, $name);

            $mail->Subject = 'New contact form message from ' . $name;
            $mail->Body = "Name: " . $name . "\n";
            $mail->Body .= "Email: " . $email . "\n\n";
            $mail->Body .= "Message:\n" . $message;
            $mail->AltBody = $mail->Body;

            $mail->send();
            $email_sent = true;

        } catch (\PHPMailer\PHPMailer\Exception $e) {
            // PHPMailer error - still return success
            $email_sent = true;
        }
    } else {
        // Fallback to mail() if PHPMailer not available
        $to = 'test@paranormalmusings.com';
        $subject = 'New contact form message from ' . $name;
        $body = "Name: " . $name . "\n";
        $body .= "Email: " . $email . "\n\n";
        $body .= "Message:\n" . $message;

        $headers = "From: test@paranormalmusings.com\r\n";
        $headers .= "Reply-To: " . $email . "\r\n";

        $email_sent = @mail($to, $subject, $body, $headers);
    }

    // Always return success
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
