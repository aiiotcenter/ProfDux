<?php

    session_start();

    include "databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $email = $_POST['email']; // Hapa kijana hapa.

    if($email){

        $query = "
            SELECT password FROM users
            WHERE email = '$email'
        ";

        $result = mysqli_query($conn,$query);

        $details = mysqli_fetch_all($result,MYSQLI_ASSOC);

        echo json_encode($details);

    }
    else {
        echo "error";
    }