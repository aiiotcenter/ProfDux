<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $id = $_POST['id'];
    $userID = $_POST['userID'];
    $quizID = $_POST['quizID'];
    $filename = $_POST['filename'];
    $status = $_POST['status'];
    $timeStarted = $_POST['timeStarted'];
    $courseID = $_POST['courseID'];
    $hierarchy = $_POST['hierarchy'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        INSERT INTO quizGrades (id, userID, quizID, filename, status, timeStarted, courseID, hierarchy)
        VALUES ('$id', '$userID', '$quizID', '$filename', '$status', '$timeStarted', '$courseID', '$hierarchy')
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
