<?php

    session_start();
    session_unset();
    session_destroy();
    session_start();

    $username = isset($_SESSION['id']);
    $role = isset($_SESSION['role']);

    if($username && $role == "student"){ header('location: /student'); }
    elseif($username && $role == "teacher"){ header('location: /teacher'); }
    elseif($username && $role == "admin"){ header('location: /admin'); }
    
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="css/auth.css">
    <script src="/js/auth.js" defer></script>
    <script src="/js/functions.js" defer></script>
    <script src="/js/weather.js" defer></script>

</head>
<body>


    <div class="wrapper">
        <div class="logo-container">
            <img src="assets/images/air-logo.png" alt="">
        </div>
    
        <div class="outer-container">
    
            <div class="bubble-message-container">Wrong Credentials</div>
    
            <form class="form-container login-container">
                <p class="title-tag">dux login</p>
                <span class="text-box">
                    <!-- <p class="hint-text">You can log in with your email or </p> -->
                    <input type="text" id="username-field" required class="bordered bordered-dark" placeholder="Email / Student Number">
                </span>
                <span class="text-box">
                    <input type="password" id="password-field" required class="bordered bordered-dark" placeholder="password">
                </span>
                <div class="button background-dark" onclick="login()">login</div>
        
                <p class="link" onclick="showSignup()">Don't have an account? Signup</p>
            </form>
        
            <form class="form-container signup-container">
                <p class="title-tag">dux signup</p>
        
                <div class="tab-buttons">
                    <div class="tab-button student-tab-button" data-active="true" onclick="showStudentForm()">student</div>
                    <div class="tab-button teacher-tab-button" data-active="false" onclick="showTeacherForm()">teacher</div>
                </div>
        
                <label for="signupImageInput" class="profile-picture-container">
                    <img id="chosenPhoto" src="" alt="User Photo">
                    <input type="file" id="signupImageInput" accept="image/*" onchange="loadImage(event, '#chosenPhoto')">
                    <span>Click to select a profile image</span>
                </label>
        
                <div class="two-column-grid student-form">
                    <span class="text-box">
                        <input type="text" id="name"required class="bordered bordered-dark" placeholder="Name">
                    </span>
                    <span class="text-box">
                        <input type="text" id="stdnumber" required class="bordered bordered-dark" placeholder="Student Number">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="department" required class="bordered bordered-dark" placeholder="Department">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="email" required class="bordered bordered-dark" placeholder="Email">
                    </span>
            
                    <span class="text-box stretch-x">
                        <input type="text" id="address" required class="bordered bordered-dark" placeholder="Address">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="phone" required class="bordered bordered-dark" placeholder="Phone Number">
                    </span>
                    <span class="text-box">
                        <input type="password" id="password" required class="bordered bordered-dark" placeholder="Password">
                    </span>
                </div>
        
                <div class="two-column-grid teacher-form">
                    <span class="text-box">
                        <input type="text" id="t-name" required class="bordered bordered-dark" placeholder="Name">
                    </span>
                    <span class="text-box">
                        <input type="text" id="t-department" required class="bordered bordered-dark" placeholder="Department">
                    </span>
            
                    <span class="text-box stretch-x">
                        <input type="text" id="t-email" required class="bordered bordered-dark" placeholder="Email">
                    </span>
            
                    <span class="text-box stretch-x">
                        <input type="text" id="t-address" required class="bordered bordered-dark" placeholder="Address">
                    </span>
            
                    <span class="text-box">
                        <input type="text" id="t-phone" required class="bordered bordered-dark" placeholder="Phone Number">
                    </span>
                    <span class="text-box">
                        <input type="password" id="t-password" required class="bordered bordered-dark" placeholder="Password">
                    </span>
                </div>
        
                <div class="button background-dark" onclick="signup()">Signup</div>
        
                <p class="link" onclick="showLogin()">Have an account? Login</p>
            </form>
        </div>
    </div>

    <div class="weather-container">
        <div class="weather"></div>
    </div>

</body>
</html>