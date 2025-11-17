<?php
/**
 * List Payments Script
 * 
 * Returns all payments from the database in JSON format
 */

// Set content type to JSON
header('Content-Type: application/json');

// Connect to SQLite database
$db = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
    // Fetch all payments from the database
    $stmt = $db->prepare("SELECT * FROM payments ORDER BY id DESC");
    $stmt->execute();
    $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return payments as JSON
    echo json_encode([
        'success' => true,
        'count' => count($payments),
        'payments' => $payments
    ]);
} catch (PDOException $e) {
    // Return error message if something goes wrong
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}