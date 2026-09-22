<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');

// =====================================================
// CONFIGURATION
// =====================================================

$to = 'support@pinnacletech.us';

$rateLimitSeconds = 60; // Same IP can submit once every 60 seconds

$rateLimitDirectory = __DIR__ . '/form-rate-limit';


// =====================================================
// ONLY ALLOW POST
// =====================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    echo json_encode([
        'success' => false,
        'message' => 'Invalid request.'
    ]);

    exit;
}


// =====================================================
// HONEYPOT SPAM CHECK
// =====================================================

$honeypot = trim($_POST['website_url'] ?? '');

if ($honeypot !== '') {

    // Pretend submission was successful.
    // This prevents bots from knowing they were blocked.

    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your inquiry has been sent successfully.'
    ]);

    exit;
}


// =====================================================
// BASIC RATE LIMITING
// =====================================================

$ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';

// Create rate-limit directory if it doesn't exist
if (!is_dir($rateLimitDirectory)) {

    mkdir($rateLimitDirectory, 0755, true);
}

// Create a safe filename from IP
$ipHash = hash('sha256', $ip);

$rateLimitFile = $rateLimitDirectory . '/' . $ipHash . '.txt';


// Check previous submission
if (file_exists($rateLimitFile)) {

    $lastSubmission = (int) file_get_contents($rateLimitFile);

    $timePassed = time() - $lastSubmission;

    if ($timePassed < $rateLimitSeconds) {

        $remaining = $rateLimitSeconds - $timePassed;

        echo json_encode([
            'success' => false,
            'message' => 'Please wait ' . $remaining . ' seconds before sending another inquiry.'
        ]);

        exit;
    }
}


// Save current submission time
file_put_contents(
    $rateLimitFile,
    time(),
    LOCK_EX
);


// =====================================================
// RECEIVE FORM DATA
// =====================================================

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$plan = trim($_POST['plan_interest'] ?? '');
$website = trim($_POST['website'] ?? '');
$message = trim($_POST['message'] ?? '');


// =====================================================
// VALIDATION
// =====================================================

if ($name === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Please enter your full name.'
    ]);

    exit;
}


if ($email === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Please enter your email address.'
    ]);

    exit;
}


if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    echo json_encode([
        'success' => false,
        'message' => 'Please enter a valid email address.'
    ]);

    exit;
}


if ($message === '') {

    echo json_encode([
        'success' => false,
        'message' => 'Please enter your message.'
    ]);

    exit;
}


// =====================================================
// LIMIT FIELD LENGTHS
// =====================================================

if (strlen($name) > 100) {

    echo json_encode([
        'success' => false,
        'message' => 'Name is too long.'
    ]);

    exit;
}


if (strlen($email) > 150) {

    echo json_encode([
        'success' => false,
        'message' => 'Email address is too long.'
    ]);

    exit;
}


if (strlen($phone) > 50) {

    echo json_encode([
        'success' => false,
        'message' => 'Phone number is too long.'
    ]);

    exit;
}


if (strlen($message) > 5000) {

    echo json_encode([
        'success' => false,
        'message' => 'Message is too long. Please keep it under 5000 characters.'
    ]);

    exit;
}


// =====================================================
// REMOVE HEADER INJECTION CHARACTERS
// =====================================================

$name = str_replace(["\r", "\n"], '', $name);
$email = str_replace(["\r", "\n"], '', $email);
$phone = str_replace(["\r", "\n"], '', $phone);
$plan = str_replace(["\r", "\n"], '', $plan);
$website = str_replace(["\r", "\n"], '', $website);


// =====================================================
// EMAIL BODY
// =====================================================

$emailBody = "New Website Inquiry\n";
$emailBody .= "==============================\n\n";

$emailBody .= "Name:\n";
$emailBody .= $name . "\n\n";

$emailBody .= "Email:\n";
$emailBody .= $email . "\n\n";

$emailBody .= "Phone / WhatsApp:\n";
$emailBody .= ($phone ?: 'Not provided') . "\n\n";

$emailBody .= "Package Interest:\n";
$emailBody .= ($plan ?: 'Not selected') . "\n\n";

$emailBody .= "Existing Website:\n";
$emailBody .= ($website ?: 'Not provided') . "\n\n";

$emailBody .= "Message:\n";
$emailBody .= "------------------------------\n";
$emailBody .= $message . "\n";
$emailBody .= "------------------------------\n\n";

$emailBody .= "IP Address: " . $ip . "\n";
$emailBody .= "Submitted: " . date('Y-m-d H:i:s') . "\n";


// =====================================================
// EMAIL HEADERS
// =====================================================

$headers = [];

$headers[] = 'From: Pinnacle Tech Website <support@pinnacletech.us>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';


// =====================================================
// SEND EMAIL
// =====================================================

$mailSent = mail(
    $to,
    'New Website Inquiry - Pinnacle Tech',
    $emailBody,
    implode("\r\n", $headers)
);


// =====================================================
// AJAX RESPONSE
// =====================================================

if ($mailSent) {

    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your inquiry has been sent successfully. We will get back to you shortly.'
    ]);

} else {

    echo json_encode([
        'success' => false,
        'message' => 'Sorry, we could not send your inquiry. Please try again later.'
    ]);
}

exit;
?>