<?php
require 'phplib/PHPMailer/src/PHPMailer.php';
require 'phplib/PHPMailer/src/SMTP.php';
require 'phplib/PHPMailer/src/Exception.php';
require_once 'functions.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Load the .env file
loadEnv(__DIR__ . '/.env');

// Load environment configuration
$env = getenv('APP_ENV') ?: 'development';
$config = require sprintf('config.%s.php', $env);

// Set error reporting based on environment
if ($config['debug']) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
}

$formKeys = [
    'name' => 'ФИО',
    'phone' => 'Телефон',
    'email' => 'Email',
    'city' => 'Город',
    'address' => 'Почтовый адрес',
    'agreeToOffer' => 'Согласие с публичной офертой',
];

try {
	// Database connection
	$db = new PDO('sqlite:' . __DIR__ . '/database.sqlite');
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	// Создаем таблицу orders, если не существует
	$db->exec("
	        CREATE TABLE IF NOT EXISTS orders (
	            id INTEGER PRIMARY KEY AUTOINCREMENT,
	            customer_name TEXT,
	            customer_phone TEXT,
	            customer_email TEXT,
	            customer_city TEXT,
	            customer_address TEXT,
	            cart_items TEXT,
	            total_amount REAL,
	            payment_url TEXT,
	            payment_status TEXT DEFAULT 'pending',
	            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	        )
	    ");

    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data || !isset($data['formData']) || !isset($data['cart'])) {
        throw new Exception("Ошибка обработки данных формы или заказа");
    }

    // Process the order data
    $formData = $data['formData'];
    $cart = $data['cart'];
    $cartTotal = $data['total'];

    $name = isset($formData['name']) ? mb_convert_case($formData['name'], MB_CASE_TITLE, "UTF-8") : 'Customer';

    // Save order to database
    $stmt = $db->prepare("
        INSERT INTO orders (customer_name, customer_phone, customer_email, customer_city, customer_address, cart_items, total_amount)
        VALUES (:customer_name, :customer_phone, :customer_email, :customer_city, :customer_address, :cart_items, :total_amount)
    ");
    $stmt->execute([
        ':customer_name' => $name,
        ':customer_phone' => $formData['phone'],
        ':customer_email' => $formData['email'],
        ':customer_city' => $formData['city'],
        ':customer_address' => $formData['address'],
        ':cart_items' => json_encode($cart),
        ':total_amount' => $cartTotal,
    ]);
    $orderId = $db->lastInsertId();

    // Include payment handler and process payment
    require_once 'paymentHandler.php';
    $paymentData = [
        "Amount" => $cartTotal * 100, // Amount in kopecks
        "OrderId" => $orderId,
        "Description" => "Заказ №$orderId",
        "DATA" => [
            "Phone" => $formData['phone'],
            "Email" => $formData['email']
        ],
        "Receipt" => [
            "Email" => $formData['email'],
            "Phone" => $formData['phone'],
            "Taxation" => "usn_income",
            "Items" => array_map(function ($item) {
                return [
                    "Name" => $item['name'],
                    "Price" => ($item['productTotal'] / $item['quantity']) * 100,
                    "Quantity" => $item['quantity'],
                    "Amount" => $item['productTotal'] * 100,
                    "Tax" => "none"
                ];
            }, $cart)
        ]
    ];

    $paymentResponse = processPayment($paymentData);

    $paymentUrl = null;
	$paymentError = null;

    if (isset($paymentResponse['error'])) {
		$paymentError = $paymentResponse['error'];
    }

	if (isset($paymentResponse['response']['PaymentURL'])) {
		$paymentUrl = $paymentResponse['response']['PaymentURL'];
		$stmt = $db->prepare("UPDATE orders SET payment_url = :payment_url WHERE id = :order_id");
		$stmt->execute([':payment_url' => $paymentUrl, ':order_id' => $orderId]);
	}

    // Prepare email content for admin
    $adminEmailBody = "<h1>Новый заказ №$orderId от $name" . ($config['environment'] === 'development' ? ' (DEV)' : '') . "</h1>";
    $adminEmailBody .= "<h2>Данные формы</h2>";
    $adminEmailBody .= "<ul>";
    foreach ($formData as $key => $value) {
        $keyString = htmlspecialchars($key, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
        $translatedKey = $formKeys[$keyString] ?? $keyString;
        if ($keyString === 'agreeToOffer') {
            $value = $value ? 'Да' : 'Нет';
        };
        $adminEmailBody.= "<li><strong>" . $translatedKey . ":</strong> ".
                     htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'). "</li>";
    }
    $adminEmailBody .= "</ul>";
    $adminEmailBody .= "<h2>Содержимое корзины</h2>";
    $adminEmailBody .= "<table style='width: 100%; border-collapse: collapse;'>";
    $adminEmailBody .= "<tr>
        <th style='border: 1px solid #000; padding: 8px; text-align: left;'>Название товара</th>
        <th style='border: 1px solid #000; padding: 8px; text-align: left;'>Aртикул</th>
        <th style='border: 1px solid #000; padding: 8px; text-align: left;'>Количество</th>
        <th style='border: 1px solid #000; padding: 8px; text-align: left;'>Сумма</th>
    </tr>";
    foreach ($cart as $item) {
        $adminEmailBody .= "<tr>";
        $adminEmailBody .= "<td style='border: 1px solid #000; padding: 8px;'>" . htmlspecialchars($item['name'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
        $adminEmailBody .= "<td style='border: 1px solid #000; padding: 8px;'>" . htmlspecialchars($item['art'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
        $adminEmailBody .= "<td style='border: 1px solid #000; padding: 8px;'>" . htmlspecialchars($item['quantity'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
        $adminEmailBody .= "<td style='border: 1px solid #000; padding: 8px;'>" . htmlspecialchars($item['productTotal'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . " руб</td>";
        $adminEmailBody .= "</tr>";
    }
    $adminEmailBody .= "</table>";
    $adminEmailBody .= "<h3>Общая сумма: $cartTotal руб</h3>";
    $adminEmailBody .= "<h3><a href='$paymentUrl'>Ссылка на оплату</a></h3>";


    // Configure and send email to admin
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host = $config['smtp']['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp']['username'];
    $mail->Password = $config['smtp']['password'];
    $mail->SMTPSecure = $config['smtp']['secure'];
    $mail->Port = $config['smtp']['port'];
    $mail->setFrom($config['smtp']['from_email'], $config['smtp']['from_name']);
    $mail->addAddress($config['recipients']['main'], $config['smtp']['from_name']);
    foreach ($config['recipients']['bcc'] as $bccEmail) {
        $mail->addBCC($bccEmail, $config['smtp']['from_name']);
    }
    $mail->isHTML(true);
    $mail->Subject = "Новый заказ №$orderId от $name" . ($config['environment'] === 'development' ? ' (DEV)' : '');
    $mail->CharSet = 'UTF-8';
    $mail->Body = $adminEmailBody;
    $mail->send();

    // Prepare and send email to customer
    $customerEmailBody = "<h1>Здравствуйте, $name!</h1>";
    $customerEmailBody .= "<p>Благодарим за ваш заказ №$orderId в магазине ALIASEVPRO.</p>";
    $customerEmailBody .= "<h2>Детали заказа:</h2>";
    $customerEmailBody .= "<table style='width: 100%; border-collapse: collapse;'>";
    $customerEmailBody .= "<tr>
        <th style='border: 1px solid #000; padding: 8px; text-align: left;'>Название товара</th>
        <th style='border: 1px solid #000; padding: 8px; text-align: left;'>Количество</th>
        <th style='border: 1px solid #000; padding: 8px; text-align: left;'>Сумма</th>
    </tr>";
    foreach ($cart as $item) {
        $customerEmailBody .= "<tr>";
        $customerEmailBody .= "<td style='border: 1px solid #000; padding: 8px;'>" . htmlspecialchars($item['name'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
        $customerEmailBody .= "<td style='border: 1px solid #000; padding: 8px;'>" . htmlspecialchars($item['quantity'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "</td>";
        $customerEmailBody .= "<td style='border: 1px solid #000; padding: 8px;'>" . htmlspecialchars($item['productTotal'], ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . " руб</td>";
        $customerEmailBody .= "</tr>";
    }
    $customerEmailBody .= "</table>";
    $customerEmailBody .= "<h3>Общая сумма: $cartTotal руб</h3>";
    $customerEmailBody .= "<p>Для завершения заказа, пожалуйста, оплатите его по ссылке:</p>";
    $customerEmailBody .= "<h2><a href='$paymentUrl'>Оплатить заказ</a></h2>";
    $customerEmailBody .= "<p>Если у вас возникли вопросы, свяжитесь с нами.</p>";

    $customerMail = new PHPMailer(true);
    $customerMail->isSMTP();
    $customerMail->Host = $config['smtp']['host'];
    $customerMail->SMTPAuth = true;
    $customerMail->Username = $config['smtp']['username'];
    $customerMail->Password = $config['smtp']['password'];
    $customerMail->SMTPSecure = $config['smtp']['secure'];
    $customerMail->Port = $config['smtp']['port'];
    $customerMail->setFrom($config['smtp']['from_email'], $config['smtp']['from_name']);
    $customerMail->addAddress($formData['email'], $name);
    $customerMail->isHTML(true);
    $customerMail->Subject = "Ваш заказ №$orderId в магазине AliasevPRO";
    $customerMail->CharSet = 'UTF-8';
    $customerMail->Body = $customerEmailBody;
    $customerMail->send();


    echo json_encode([
        "success" => true,
        "message" => "Заявка отправлена, благодарим за заказ, $name, мы свяжемся с вами в ближайшее время!",
        "paymentUrl" => $paymentUrl,
		"paymentError" => $paymentError,
        "environment" => $config['environment']
    ]); 
} catch (Exception $e) {
    $errorMessage = $config['debug']
        ? "Error: " . $e->getMessage()
        : "Произошла ошибка при обработке заказа. Пожалуйста, попробуйте позже.";

    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $errorMessage,
        "environment" => $config['environment']
    ]);
}
