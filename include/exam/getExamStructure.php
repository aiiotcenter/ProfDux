<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $courseID = $_POST["id"];

    if($courseID){

        $subscriptionsQuery = "
            SELECT exam.id, exam.hierarchy, exam.name, exam.totalMarks FROM `exam` 
            INNER JOIN courses ON courses.id = exam.courseID
            WHERE exam.courseID = '$courseID'
            ORDER BY exam.hierarchy
        ";

        $subscriptionsResult = mysqli_query($conn,$subscriptionsQuery);
        $subscriptions = mysqli_fetch_all($subscriptionsResult,MYSQLI_ASSOC);

        echo json_encode($subscriptions);

    }
    else{
        echo json_encode(array("status" => "error"));
    }