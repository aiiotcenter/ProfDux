<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dux Student</title>
    <page data-id="Exam"></page>

    <?php include '../include/studentImports.php'; ?>

    <script src="../js/TakeExamView.js?11"></script>
    
</head>

<body>

    <?php include 'components/header.php'; ?>

    <div class="outer-container">
        <?php include 'components/sidebar.php'; ?>
        <div class="main-container">
            <h1 class="large-title">
                Your Exams
            </h1>

            <div class="course-view-container">
                <div class="container-message blank course-view-container-loader">
                    <div class="sk-fold">
                        <div class="sk-fold-cube"></div>
                        <div class="sk-fold-cube"></div>
                        <div class="sk-fold-cube"></div>
                        <div class="sk-fold-cube"></div>
                    </div>
                </div>
            </div>
            
            <?php include 'components/examOverlay.php' ?>
        </div>


        <script>

            ( async () => {
                const { id } = await getGlobalDetails();
                await loadUpcomingExams(id);
            })();

            async function loadUpcomingExams(id){

                const takeExamView = new TakeExamView({ id });
                const examsViewContainer = document.querySelector(".course-view-container");
                takeExamView.setExamsListContainer(examsViewContainer);
                takeExamView.render();

                //TODO: renderUpcomingExamsView
                //TODO: BringUpView

            }

        </script>

        <?php include "components/takeExamOverlay.php" ?>
        <?php include "components/reviewExamOverlay.php" ?>
</body>

</html>