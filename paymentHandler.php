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
 * @return mixed Array with response data or JSON string
 */
function processPayment($paymentData = [])
{

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

	$responseBody = [];
	// Check for errors
	if (curl_errno($curl)) {
		$responseBody = ['error' => curl_error($curl)];
	} else if (isset($curlResult['Success']) && $curlResult['Success']) {
		$responseBody = [
			'response' => $curlResult,
			'data' => $data,
		];
	} else {
		$responseBody = ['error' => $curlResult];
	}

	return $responseBody;
}
