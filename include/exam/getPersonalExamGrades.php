<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    $userID = $_POST['userID'];
    $examID = $_POST['examID'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
    SELECT *
    FROM `examGrades`
    WHERE userID='$userID' && examID='$examID'
    ";

    $examGradeResults = mysqli_query($conn,$query);
    $grades = mysqli_fetch_all($examGradeResults,MYSQLI_ASSOC);

    echo json_encode($grades);

