<?php

include "../databaseConnection.php";

$conn = OpenConnection();

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$courseID = $_POST["id"];

if ($courseID) {

    $subscriptionsQuery = "
            SELECT userID FROM `subscriptions` 
            WHERE subscriptions.courseID = '$courseID' && status = 'true'
        ";

    $subscriptionsResult = mysqli_query($conn, $subscriptionsQuery);
    $subscriptions = mysqli_fetch_all($subscriptionsResult, MYSQLI_ASSOC);

    $quizGradesArray = array();
    $examGradesArray = array();

    foreach ($subscriptions as $subscription) {

        $userID = $subscription['userID'];

        $userDetailsQuery = "
                SELECT image, name FROM `userDetails`
                JOIN users ON userDetails.id = users.id
                WHERE users.id = '$userID'
            ";

        $userDetailsResults = mysqli_query($conn, $userDetailsQuery);
        $userDetails = mysqli_fetch_all($userDetailsResults, MYSQLI_ASSOC);

        $quizGradeQuery = "
                SELECT quizID, filename, status, value FROM `quizGrades`
                WHERE quizGrades.userID = '$userID' && courseID = '$courseID'
            ";

        $quizGradeResults = mysqli_query($conn, $quizGradeQuery);
        $quizGrades = mysqli_fetch_all($quizGradeResults, MYSQLI_ASSOC);

        $quizGradesArray[] = array(
            $userID => $quizGrades,
            "details" => $userDetails[0],
        );


        $examGradeQuery = "
            SELECT examID, filename, status, value FROM `examGrades`
            WHERE examGrades.userID = '$userID' && courseID = '$courseID'
        ";

        $examGradeResults = mysqli_query($conn, $examGradeQuery);
        $examGrades = mysqli_fetch_all($examGradeResults, MYSQLI_ASSOC);

        $examGradesArray[] = array(
            $userID => $examGrades,
            "details" => $userDetails[0],
        );

    }

    $resultA = array(
        "quizGrades" => $quizGradesArray,
        "examGrades" => $examGradesArray,
    );

    echo json_encode($resultA);

} else {
    echo json_encode(array("status" => "error"));
}