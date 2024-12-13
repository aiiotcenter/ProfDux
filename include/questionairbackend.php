<?php

session_start();
// Replace this with your session variable after login
$userId = $_SESSION['id']; 
echo $userId;

// Include the database connection file
include "databaseConnection.php";

// Open database connection
$conn = OpenConnection();

if (!$conn) {
    die("Database connection failed: " . mysqli_connect_error());
}

// Check if the user exists in the table
$sql = "SELECT status FROM questinair WHERE userid = ?";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    die("Prepare failed: " . $conn->error);
}

// Bind parameters (use 's' for string instead of 'i')
$stmt->bind_param("s", $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // User not found, insert a default entry
    $insertSql = "INSERT INTO questinair (userid, status, filepath) VALUES (?, 0, NULL)";
    $insertStmt = $conn->prepare($insertSql);
    if (!$insertStmt) {
        die("Prepare failed: " . $conn->error);
    }
    $insertStmt->bind_param("s", $userId);
    $insertStmt->execute();
    echo "Default entry added for user.";
} else {
    // Fetch the user's completion status
    $row = $result->fetch_assoc();
    if ($row['status'] == 1) {
        // Redirect to dashboard if the survey is already completed
        header("Location: dashboard.php");
        exit();
    }
}

header("Location: ../teacher/questionair.php");
exit();

// Close database connections
$stmt->close();
$conn->close();
?>
