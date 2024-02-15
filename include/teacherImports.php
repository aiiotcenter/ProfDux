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
        "../css/settings.css"
    );

    // These are for javascript files that you want
    // to run immediately before the page loads
    $jsPaths = array(
        "../js/dialogs.js",
        "../js/functions.js",
        "../js/localize.js"
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

