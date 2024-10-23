<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dux Student</title>
        <page data-id="Classroom"></page> 

        <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@3.10.111/build/pdf.min.js"></script>
        <script src="../js/webSpeechAPI.js" defer></script>

        <?php include '../include/studentImports.php'; ?>
        <script src="https://code.responsivevoice.org/responsivevoice.js?key=NVbGYm7d"></script>

    </head>
    <body>

        <?php include 'components/header.php'; ?>

        <div class="outer-container">
            <?php include 'components/sidebar.php'; ?>
            <div class="main-container">
                
                <div class="centered-container">

                    <h1 class="medium-title">Select a course</h1>

                    <div class="course-view-container mini-container">

                        <div class="container-message blank">
                            <div class="sk-fold">
                                <div class="sk-fold-cube"></div>
                                <div class="sk-fold-cube"></div>
                                <div class="sk-fold-cube"></div>
                                <div class="sk-fold-cube"></div>
                            </div>
                        </div>

                    </div>

                </div>

                <div class="inner-overlay classroom-inner-overlay">
                    <div class="back-arrow" onclick="closePopup('.classroom-inner-overlay')">
                        <img class="icon" src="../assets/icons/fi/fi-rr-arrow-alt-left.svg" alt="">
                    </div>

                    <div class="classroom-outer-container">
                        <div class="classroom-header-elements-container">

                            <div class="inner-right-wrapper">
                                <h1 class="classroom-course-title"></h1>
                                <h3 class="classroom-course-code"></h3>
                            </div>

                            <div class="inner-right-wrapper">
                                <div class="classroom-start-class-button button" onclick="renderClassView(this)"><text>Start Class</text></div>
                            </div>
                        </div>

                        <div class="outer-main-classroom-container"></div>
                    </div>
        
                </div>

                <div class="inner-overlay class-chat-inner-overlay">
                    <div class="back-arrow" onclick="closePopup('.class-chat-inner-overlay')">
                        <img class="icon" src="../assets/icons/fi/fi-rr-arrow-alt-left.svg" alt="">
                    </div>

                    <div class="classchatroom-outer-container">
                        
                        <h2 class="classchatroom-course-title">__Course_Title__</h2>
                        <div id="subtitles"  class="classchatroom-course-code">__Course_Code__</div>

                        <!-- <div id="subtitles"></div> -->

                        
                        <!-- <button id="switchsub-en" class="switchsub">EN</button> 
                        <button id="switchsub-tr" class="switchsub">Tr</button>  -->


                        <div class="outer-main-classchatroom-container">

                            <div class="dux-class-chat-outer-container">
                                <div class="dux-class-chat-container messages-container">

                                </div>

                                <div class="chat-input-container">

                                    <div class="class-chat-input-wrapper">

                                        <div class="class-message-typing-input"> 
                                            <div contenteditable="true" id="final_speech" class="final-speech"></div>
                                            <div id="interim_speech" class="interim-speech"></div>
                                        </div>

                                        <div class="class-send-message-button">
                                            <img src="../assets/icons/send.png" alt="">
                                        </div>
                                    </div>
                                    <div class="dux-chat-action-buttons-container">
                                        <label for="duxAddPDF" class="chat-action-button">
                                            <img src="../assets/icons/pdf.png" alt="">
                                            <input type="file" id="duxAddPDF" accept="application/pdf">
                                        </label>

                                        <div class="chat-action-button" id="start_button" onclick="start()">
                                            <img id="start_img" src="../assets/icons/mic.gif" alt="Start">
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div class="dux-right-side-pane">
                                <div class="dux-image-box" >
                                    <img id="speakButton" src="../assets/images/DuxProHiddle.gif" alt="">
                                </div>
                            </div>
                        </div>
                    </div>
        
                </div>

            </div>
        </div>

        
        <?php include 'components/quizOverlay.php'; ?>
        <?php include 'components/quizResultOverlay.php'; ?>


        <style>

            .classroom-inner-overlay {
                grid-template-rows: auto 1fr;
            }

            .classroom-header-elements-container{
                margin-bottom: 20px;
                display: grid;
                grid-gap: 10px;
            }

            .classroom-course-title{
                color: var(--accent);
            }

            .classroom-course-code{
                color: var(--dark-gray);
            }

            .course-view-container .mini-container {
                grid-template-columns: 1fr;
            }

            .course-view-container .mini-container {
                
            }
        </style>

        <script>

            window.addEventListener("load", function() {
                // TODO: Use a different function to call this one
                loadCourses("mine");
            })

            function openPDFSelector(event){

                let output;

                let file = { name, type } = event.target.files[0];
                let objectURL = window.URL.createObjectURL(file);
                console.log("output src: ", objectURL);

                // output.onload = function() { URL.revokeObjectURL(objectURL) }
            }


        </script>
    </body>
</html>