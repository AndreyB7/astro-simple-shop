<?php

/**
 * Tinkoff Payment Handler
 * 
 * This file provides functionality to process payments through Tinkoff payment API
 */

/**
 * Generates a token for Tinkoff payment API
 * 
 * @param array $data Payment data array
 * @param string $password Terminal password
 * @return string SHA-256 hash token
 */
function generateToken($data, $password)
{
	// 1. Create a copy of the data array and add Password
	$tokenData = $data;
	$tokenData['Password'] = $password;

	// 2. Remove nested objects and arrays as they don't participate in token generation
	foreach ($tokenData as $key => $value) {
		if (is_array($value)) {
			unset($tokenData[$key]);
		}
	}

	// 3. Sort the array by keys alphabetically
	ksort($tokenData);

	// 4. Concatenate values into a single string
	$concatenatedValues = '';
	foreach ($tokenData as $value) {
		$concatenatedValues .= $value;
	}

	// 5. Apply SHA-256 hash function
	return hash('sha256', $concatenatedValues);
}

/**
 * Process payment through Tinkoff payment API
 * 
 * @param array $paymentData Custom payment data (optional)
 * @param bool $redirect Whether to redirect to payment page (default: false)
 * @param bool $returnJson Whether to return JSON response (default: true)
 * @return mixed Array with response data or JSON string
 */
function processPayment($paymentData = [], $redirect = false, $returnJson = true)
{
	if ($returnJson) {
		header('Content-Type: application/json');
	}

	// Load the .env file
	require_once 'functions.php';
	loadEnv(__DIR__ . '/.env');
	$url = $_ENV['PAYMENT_INIT_URL'];
	$terminalKey = $_ENV['PAYMENT_KEY'];
	$terminalPass = $_ENV['PAYMENT_PASS'];
	$defaultData = [
		"TerminalKey" => $terminalKey,
		"Amount" => 0,
		"OrderId" => 0,
		"Description" => "Подарочная карта на 1000 рублей",
		"DATA" => [
			"Phone" => "+79771111111",
			"Email" => "default@aliasevpro.ru"
		],
		"Receipt" => [
			"Email" => "default@aliasevpro.ru",
			"Phone" => "+79771111111",
			"Taxation" => "usn_income",
			"Items" => []
		]
	];

	// Merge custom data with default data
	$data = array_merge($defaultData, $paymentData);

	// Add generated Token according to Tinkoff requirements
	$data['Token'] = generateToken($data, $terminalPass);

	// Initialize cURL session
	$curl = curl_init();

	curl_setopt_array($curl, array(
		CURLOPT_URL => $url,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => 'POST',
		CURLOPT_POSTFIELDS => json_encode($data),
		CURLOPT_HTTPHEADER => array(
			'Content-Type: application/json',
			'Accept: application/json'
		),
	));

	$response = curl_exec($curl);
	$curlResult = json_decode($response, true);
	curl_close($curl);

	// Подключаем базу SQLite (файл создастся, если его нет)
	$db = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Создаем таблицу, если не существует
	$db->exec("
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id INTEGER NOT NULL,
            url TEXT NOT NULL
        )
    ");
	// Create index in a separate statement
	$db->exec("CREATE INDEX IF NOT EXISTS idx_order_id ON payments(order_id)");

	$responseBody = [];
	// Check for errors
	if (curl_errno($curl)) {
		$responseBody = ['error' => curl_error($curl)];
	} else if (isset($curlResult['Success']) && $curlResult['Success']) {
		$responseBody = [
			'response' => $curlResult,
			'data' => $data,
		];

		// Save payment info to database
		$stmt = $db->prepare("INSERT INTO payments (order_id, url) VALUES (:order_id, :url)");
		$stmt->execute([
			':order_id' => intval($data['OrderId']),
			':url' => isset($curlResult['PaymentURL']) ? $curlResult['PaymentURL'] : '',
		]);
	} else {
		$responseBody = ['error' => $curlResult];
	}

	// Handle redirect if requested and payment URL exists
	if ($redirect && isset($curlResult['PaymentURL'])) {
		header("Location: " . $curlResult['PaymentURL']);
		exit;
	}

	// Return response
	if ($returnJson) {
		echo json_encode($responseBody);
		return null;
	} else {
		return $responseBody;
	}
}

// Execute payment processing if this file is called directly
if (basename($_SERVER['SCRIPT_FILENAME']) === basename(__FILE__)) {
	// Default payment data
	$data = [
		"Amount" => 140000,
		"OrderId" => 21101,
		"Description" => "Подарочная карта на 1001 рублей",
		"DATA" => [
			"Phone" => "+71234567890",
			"Email" => "a@test.com"
		],
		"Receipt" => [
			"Email" => "a@test.ru",
			"Phone" => "+79031234567",
			"Taxation" => "usn_income",
			"Items" => [
				[
					"Name" => "Наименование товара 1",
					"Price" => 10000,
					"Quantity" => 1,
					"Amount" => 10000,
					"Tax" => "none",
					"Ean13" => "303130323930303030630333435"
				],
				[
					"Name" => "Наименование товара 2",
					"Price" => 20000,
					"Quantity" => 2,
					"Amount" => 40000,
					"Tax" => "none"
				],
				[
					"Name" => "Наименование товара 3",
					"Price" => 30000,
					"Quantity" => 3,
					"Amount" => 90000,
					"Tax" => "none"
				]
			]
		]
	];
	processPayment($data, false, true);
}
