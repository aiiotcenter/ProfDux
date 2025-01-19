<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dux Teacher</title>
        <page data-id="Class Stats"></page> 

        <?php include '../include/teacherImports.php'; ?>

        <link rel="stylesheet" href="../css/grid-table.css?6">
        <script src="../js/StatsView.js?16" defer></script>
        <script src="../js/Stats.js?6"></script>

    </head>
    <body>

        <?php include 'components/header.php'; ?>

        <div class="outer-container">
            <?php include 'components/sidebar.php'; ?>
            <div class="main-container">
                <h1 class="large-title">Grades</h1>

                <div class="course-view-container" id="load-exam-container" style="margin-top:10px">
                    <div class="container-message blank course-view-container-loader" style="height: 100%">
                        <div class="sk-fold">
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                        </div>
                    </div>
                </div>

                <div class="load-grades-container inner-overlay">

                    <div class="back-arrow" onclick="openPopup('.course-view-container'); closePopup('.load-grades-container')">
                        <img class="icon" src="../assets/icons/fi/fi-rr-arrow-alt-left.svg" alt="">
                    </div>

                    <?php include 'components/loadGradesOverlay.php' ?>

                </div>
            </div>
        </div>

        <style>

            .load-grades-container{
                grid-template-rows: auto auto 1fr;
            }

        </style>

        <script>

            ( async () => {

                await loadCoursesGeneric("id", loadGrades, { emptyMessage: "No Course To Show Grades For Yet."});

            })();

        </script>
    </body>
</html>