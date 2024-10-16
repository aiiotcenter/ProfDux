<?php

    session_start();
    $username = isset($_SESSION['id']);
    $role = isset($_SESSION['role']);

    if(!$username){ header('location:../auth.php'); }

?>

<div class="header">
    <div class="header-logo">
        <img src="../assets/images/air-logo.png" alt="">
    </div>

    <div class="header-action-bar">
        <?php

            if($_SESSION["role"] != "student"){
                echo "
                <a href='../teacher' class='switch-button'>
                    <img class='icon' src='../assets/icons/fi/fi-rr-arrows-repeat.svg' alt='' class='regular-icon'> 
                </a>";
            }

        ?>

        <div class="username">
        </div>
        <div class="user-image">
            <img src="" alt="">
        </div>
        <div class="logout-button" onclick="logoutDialog()">
            <img class='icon' src="../assets/icons/fi/fi-rr-arrow-right-to-bracket.svg" alt="" class="regular-icon">
        </div>
    </div>
</div>

    <div class="circle dux-overlay">
        <div class="close-button" onclick="
        closeDuxChat();
        " style="display: none;">
            <img src="../assets/icons/close.png" alt="">
        </div>

        <div class="chat-container" style="display: none;">

            <div class="chat-view">
    
                <ul class="messages-container">
                </ul>
    
                <div class="message-footer">
                    <div class="typing-area">
                        <input type="text" placeholder="Type a message ..." class="message-typing-input">
                        <div class="send-message">
                            <img src="../assets/icons/send.png" alt="">
                        </div>
                    </div>
                </div>
    
            </div>
    
        </div>
    </div>
    
    <div class="circle dux-icon" onclick="startDuxChat()">
        <img src="../assets/images/dux-male.jpg" alt="">
    </div>
<!-- jeries -->