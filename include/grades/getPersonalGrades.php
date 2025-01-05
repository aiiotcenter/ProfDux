<?php

include "../databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$userID = $_POST["id"];

if ($userID) {

    $subscriptionsQuery = "
            SELECT subscriptions.courseID, courses.title, courses.image, courses.courseCode FROM `courses` 
            INNER JOIN subscriptions ON subscriptions.courseID = courses.ID
            WHERE subscriptions.userID = '$userID' && status = 'true'
        ";

    $subscriptionsResult = mysqli_query($conn, $subscriptionsQuery);
    $subscriptions = mysqli_fetch_all($subscriptionsResult, MYSQLI_ASSOC);

    $gradesArray = [];

    foreach ($subscriptions as $subscription) {

        $courseID = $subscription['courseID'];
        $courseTitle = $subscription['title'];
        $courseImage = $subscription['image'];
        $courseCode = $subscription['courseCode'];

        $quizGradeQuery = "
                SELECT quizID, filename, status, value, hierarchy, totalMarks FROM `quizGrades`
                WHERE quizGrades.userID = '$userID' && courseID = '$courseID'
                ORDER BY hierarchy
            ";

        $quizGradeResults = mysqli_query($conn, $quizGradeQuery);
        $quizGrades = mysqli_fetch_all($quizGradeResults, MYSQLI_ASSOC);


        $examGradeQuery = "
            SELECT * FROM examGrades
            WHERE examGrades.userID = '$userID' && courseID = '$courseID'
        ";

        $examGradeResults = mysqli_query($conn, $examGradeQuery);
        $examGrades = mysqli_fetch_all($examGradeResults, MYSQLI_ASSOC);


        $gradesArray[] = array(
            "quizGrades" => $quizGrades,
            "examGrades" => $examGrades,
            "title" => $courseTitle,
            "courseID" => $courseID,
            "image" => $courseImage,
            "courseCode" => $courseCode
        );
    }

    $resultA = array(
        "grades" => $gradesArray,
    );

    echo json_encode($resultA);

} else {
    echo json_encode(array("status" => "error"));
}