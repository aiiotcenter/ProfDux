<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dux Student</title>
        <page data-id="Grades"></page> 

        <?php include '../include/studentImports.php'; ?>

    </head>
    <body>

        <?php include 'components/header.php'; ?>

        <div class="outer-container">
            <?php include 'components/sidebar.php'; ?>
            <div class="main-container">
                <h1 class="large-title">Grades</h1>

                <div class="personal-grades-outer-container view">
                    <div class="empty-view">
                        There are no grades yet.
                    </div>
                </div>
            </div>
        </div>

        <script>

            ( async () => {

                let { id } = await getUserDetails();
                let params = `id=${id}`;

                let result = await AJAXCall({
                    phpFilePath: "../include/grades/getPersonalGrades.php",
                    rejectMessage: "Getting Grades Failed",
                    params,
                    type: "fetch"
                });

                const grades = new GradesView(result);
                grades.renderGrades();

            })();

        </script>
    </body>
</html>