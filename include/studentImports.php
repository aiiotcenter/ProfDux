<?php

include 'cachebust.php';

// These are for css files
$cssPaths = array(
    "../css/sidebar.css",
    "../css/header.css",
    "../css/dialogs.css",
    "../css/dropdown.css",
    "../css/dialogs.css",
    "../css/root.css",
    "../css/student.css",
    "../css/spinkit.css",
    "../css/tab.css",
    "../css/translation.css",
    "../css/popup.css",
    "../css/inputs.css",
    "../css/courseManagement.css",
    "../css/card.css",
    "../css/popup.css",
    "../css/settings.css",
    "../css/pdf-viewer.css",
    "../css/image-viewer.css",
    "../css/quiz.css",
    "../css/classroom.css",
    "../css/classChatroom.css",
    "../css/DuxChat.css",
    "../css/ebook.css",
    "../css/exam.css",
    "../css/examStudent.css",
    "../css/scheduling.css",
    "../css/grades.css",
    "../css/messaging.css",
    "../css/video-viewer.css"

);

// These are for javascript files that you want
// to run immediately before the page loads
$jsPaths = array(
    "../js/dialogs.js",
    "../js/functions.js",
    "../js/localize.js",
    "../js/PDFSearch.js",
    "../js/Messaging.js",
    "../js/dictionary.js",
    "../js/UILoaders.js",
    "../js/courseManagement.js",
    "../js/Classroom.js",
    "../js/videoViewer.js",
);

// These are for javascript files that you want
// to run when the page completes loading.
$jsPaths_Defer = array(
    "../js/sidebar.js",
    "../js/dropdown.js",
    "../js/logoutDialogListener.js",
    "../js/openAIKey.js",
    "../js/tab.js",
    "../js/headerBar.js",
    "../js/pdf-viewer.js",
    "../js/image-viewer.js",
    "../js/Course.js",
    "../js/Question.js",
    "../js/Quiz.js",
    "../js/GlobalCache.js",
    "../js/DuxChat.js",
    "../js/Ebooks.js",
    "../js/exam.js",
    "../js/DuxClassChat.js",
    "../js/GradesView.js",
    "../js/Timer.js",
);

foreach ($cssPaths as $path) {
    echo "<link rel='stylesheet' href='" . $path . "?" . cachebust($path) . "'>";
}

foreach ($jsPaths as $path) {
    echo "<script src='" . $path . "?" . cachebust($path) . "'></script>";
}

foreach ($jsPaths_Defer as $path) {
    echo "<script src='" . $path . "?" . cachebust($path) . "' defer></script>";
}
