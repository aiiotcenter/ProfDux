<?php

    include "../databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $personalID = $_POST["id"];

    if($personalID){

        $query = "
            SELECT courses.id, courses.courseCode, courses.title, courses.image
            FROM `courses` 
            INNER JOIN subscriptions ON courses.id = subscriptions.courseID
            WHERE subscriptions.userID = '$personalID'
        ";

        $result = mysqli_query($conn,$query);
        $courses = mysqli_fetch_all($result,MYSQLI_ASSOC);

        $finalResult = array();

        foreach($courses as $course) {

            $courseID = $course['id'];

            $examQuery = "
                SELECT id, name, minutes
                FROM `exam` WHERE courseID = '$courseID'
                ORDER BY hierarchy
            ";

            $examResult = mysqli_query($conn,$examQuery);
            $exams = mysqli_fetch_all($examResult,MYSQLI_ASSOC);

            $examsArray = array();

            foreach($exams as $exam){

                $examID = $exam['id'];
                
                $scheduleQuery = "
                    SELECT *
                    FROM `schedules` WHERE foreignID = '$examID'
                ";

                $scheduleResult = mysqli_query($conn,$scheduleQuery);
                $schedules = mysqli_fetch_all($scheduleResult,MYSQLI_ASSOC);

                $examsArray[] = array(
                    "id" => $examID,
                    "name" => $exam['name'],
                    "duration" => $exam['minutes'],
                    "time" => $schedules,
                );

            }

            $resultA = array(
                "id" => $course['id'],
                "title" => $course['title'],
                "courseCode" => $course['courseCode'],
                "image" => $course['image'],
                "exams" => $examsArray,
            );

            $finalResult[] = $resultA;

        }

        echo json_encode($finalResult);

    }
    else{
        echo json_encode(array("status" => "error"));
    }