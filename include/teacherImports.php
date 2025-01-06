<?php
    
    include 'cachebust.php';

    // These are for css files
    $cssPaths = array(
        "../css/sidebar.css",
        "../css/header.css",
        "../css/dialogs.css",
        "../css/dropdown.css",
        "../css/pdf-viewer.css",
        "../css/dialogs.css",
        "../css/root.css",
        "../css/teacher.css",
        "../css/spinkit.css",
        "../css/tab.css",
        "../css/translation.css",
        "../css/popup.css",
        "../css/inputs.css",
        "../css/courseManagement.css",
        "../css/card.css",
        "../css/popup.css",
        "../css/settings.css",
        "../css/quiz.css",
        "../css/scheduling.css",
        "../css/exam.css",
        "../css/classroom.css",
        "../css/image-viewer.css",
        "../css/messaging.css",
        "../css/video-viewer.css",
        "../css/flatpicker.min.css"
    );

    // These are for javascript files that you want
    // to run immediately before the page loads
    $jsPaths = array(
        "../js/dialogs.js",
        "../js/functions.js",
        "../js/localize.js",
        "../js/Schedules.js",
        "../js/Objectives.js",
        "../js/Messaging.js",
        "../js/GPTPDF.js",
        "../js/videoRecommendation.js",
        "../js/videoViewer.js",
        "../js/ExcelObjective.js",
        "../js/dictionary.js",
        "../js/UILoaders.js",
        "../js/DateTimeInput.js",
        "../js/exam.js",
        "../js/BatchGenerator.js",
        "../js/flatpicker.min.js",
    );

    // These are for javascript files that you want
    // to run when the page completes loading.
    $jsPaths_Defer = array(
        "../js/sidebar.js",
        "../js/dropdown.js",
        "../js/logoutDialogListener.js",
        "../js/openAIKey.js",
        "../js/pdf-viewer.js",
        "../js/tab.js",
        "../js/headerBar.js",
        "../js/pdf-viewer.js",
        "../js/image-viewer.js",
        "../js/courseManagement.js",
        "../js/Course.js",
        "../js/Question.js",
        "../js/Quiz.js",
        "../js/EditAssessment.js",
        "../js/GlobalCache.js",

    );

    foreach ($cssPaths as $path) {
        echo "<link rel='stylesheet' href='" .$path. "?" .cachebust($path). "'>";
    }

    foreach ($jsPaths as $path) {
        echo "<script src='" .$path. "?" .cachebust($path). "'></script>";
    }

    foreach ($jsPaths_Defer as $path) {
        echo "<script src='" .$path. "?" .cachebust($path). "' defer></script>";
    }

