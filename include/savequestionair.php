<?php
session_start();
include 'databaseConnection.php';
$conn = OpenConnection();

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!isset($data['userId']) || !isset($data['answers']) || !is_array($data['answers'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid input data']);
        exit;
    }

    $userId = $data['userId'];
    $answers = $data['answers'];
    $answersJson = json_encode($answers);

    // Save answers to a file
    $filePath = "../questionair/{$userId}_answers.json";
    if (file_put_contents($filePath, $answersJson) === false) {
        http_response_code(500);
        echo json_encode(['message' => 'Failed to save answers to file']);
        exit;
    }

    // Update database
    $stmt = $conn->prepare("
        INSERT INTO questinair (userid, status, filepath)
        VALUES (?, 1, ?)
        ON DUPLICATE KEY UPDATE status = 1, filepath = VALUES(filepath)
    ");
    $stmt->bind_param('ss', $userId, $filePath);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Survey submitted successfully']);
    } else {
        error_log("SQL Error: " . $stmt->error);
        http_response_code(500);
        echo json_encode(['message' => 'Failed to submit survey']);
    }

    $stmt->close();
    $conn->close();
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>
