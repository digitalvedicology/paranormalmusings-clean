<?php
header('Content-Type: application/json');

// Test 1: PHP is working
$test1 = "PHP is working";

// Test 2: Check mail function
$mail_exists = function_exists('mail') ? "mail() function exists" : "mail() function NOT found";

// Test 3: Try to get input
$input = json_decode(file_get_contents('php://input'), true);
$received_input = $input ? "Input received" : "No input";

echo json_encode([
    'test1' => $test1,
    'test2' => $mail_exists,
    'test3' => $received_input,
    'php_version' => phpversion(),
    'timestamp' => date('Y-m-d H:i:s')
]);
?>
