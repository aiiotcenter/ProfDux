<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dux Teacher</title>
    <page data-id="Exam"></page>

    <?php include '../include/teacherImports.php'; ?>

</head>

<body>

    <?php include 'components/header.php'; ?>

    <div class="outer-container">
        <?php include 'components/sidebar.php'; ?>
        <div class="main-container">
                <div class="header-combo">
                    <h1 class="large-title">
                        Exam
                    </h1>
                </div>
            
                <div class="course-view-container" id="student-exam-container" style="margin-top:10px">
                    <div class="container-message blank course-view-container-loader" style="height: 100%">
                        <div class="sk-fold">
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                            <div class="sk-fold-cube"></div>
                        </div>
                    </div>
                </div>

            <div class="edit-exam-container inner-overlay">

                <div class="back-arrow" onclick="openPopup('.course-view-container'); closePopup('.edit-exam-container')">
                    <img class="icon" src="../assets/icons/fi/fi-rr-arrow-alt-left.svg" alt="">
                </div>

                <?php include 'components/editExamOverlay.php' ?>

            </div>

            <?php include 'components/createExamOverlay.php' ?>

        </div>
    </div>

    <script>

        ( async () => {
            await loadCoursesGeneric("id", editExam, { emptyMessage: "No Courses To Create Exams For Yet." });
        })();

    </script>
    
</body>

</html>