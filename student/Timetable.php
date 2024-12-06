<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dux Student</title>
        <page data-id="Timetable"></page> 

        <?php include '../include/studentImports.php'; ?>
        <link rel="stylesheet" href="../css/timetable.css?3">

    </head>
    <body>

        <?php include 'components/header.php'; ?>

        <style>

            .buttons-array{
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                grid-gap: 20px;
            }

            .button.inactive:hover{
                opacity: 1;
            }

            .main-container {
                align-items: start;
            }

        </style>
        <div class="outer-container">
            <?php include 'components/sidebar.php'; ?>
            <div class="main-container">
                <h1 class="large-title">
                    Timetable
                </h1>

                <div class="simple-grid">
                    <div class="timetable-filter buttons-array">
                        <text class="button active this-week">This Week</text>
                        <text class="button inactive next-week">Next Week</text>
                        <text class="button inactive this-month">This Month</text>
                    </div>

                    <div class="timetable-container">

                    </div>
                </div>
            </div>
        </div>

        <script>


            const timetableFilterButtons = document.querySelector(".timetable-filter.buttons-array");

            const thisWeekButton = document.querySelector(".this-week");
            const nextWeekButton = document.querySelector(".next-week");
            const thisMonthButton = document.querySelector(".this-month");

            ( async () => {

                try {

                    const { id } = await getGlobalDetails();
                    
                    let result = await AJAXCall({
                        phpFilePath: "../include/schedule/getTimetable.php",
                        rejectMessage: "Getting Timetable Failed",
                        params: `id=${id}`,
                        type: "fetch"
                    });

                    const timetableContainer = document.querySelector(".timetable-container");

                    const timetable = new Timetable(result);
                    timetable.setTimetableContainer(timetableContainer);
                    timetable.setTimetableFilterButtons({
                        thisWeekButton: thisWeekButton,
                        nextWeekButton: nextWeekButton,
                        thisMonthButton:thisMonthButton
                    })

                    timetable.render();

                }catch(error){
                }

            })()

            class Timetable{

                timeObject
                thisWeek = []

                constructor(timeObject){
                    this.timeObject = timeObject;
                    this.sortParameter = "this-week";
                }

                setTimetableContainer(element){
                    this.timetableContainer = element;
                }

                setTimetableFilterButtons({ thisWeekButton, nextWeekButton, thisMonthButton}){
                    this.thisWeekButton = thisWeekButton;
                    this.nextWeekButton = nextWeekButton;
                    this.thisMonthButton = thisMonthButton;

                    let outerScopedSortParameter = this.sortParameter;
                    let outerScopedRender = this.render;

                    this.thisWeekButton.addEventListener("click", () => {
                        this.sortParameter = "this-week";
                        this.render();
                        this.inactivateButtons();
                        this.thisWeekButton.className = "button active this-week";
                    });

                    this.nextWeekButton.addEventListener("click", () => {
                        this.sortParameter = "next-week";
                        this.render();
                        this.inactivateButtons();
                        this.nextWeekButton.className = "button active next-week";
                    });

                    this.thisMonthButton.addEventListener("click", () => {
                        this.sortParameter = "this-month";
                        this.render();
                        this.inactivateButtons();
                        this.thisMonthButton.className = "button active this-month";
                    });

                }

                inactivateButtons(){
                    this.thisWeekButton.className = "button inactive this-week";
                    this.nextWeekButton.className = "button inactive next-week";
                    this.thisMonthButton.className = "button inactive this-month";
                }

                sort(timeObject){

                    this.timeObject.forEach( row => {
                        // Append course details ...

                        const metadata = {
                            courseID: row.id,
                            courseCode: row.courseCode,
                            courseTitle: row.title,
                            courseImage: row.image,
                            courseInstructor: row.courseInstructor,
                        }

                        this.thisWeek = [ ...this.thisWeek, ...filterLecturesWithinRange(row.lectures, metadata, this.sortParameter)];

                    });

                    function filterLecturesWithinRange(lectures, metadata, parameter){

                        let lecturesWithinRange = [];

                        lectures.forEach( lecture => {
                            if(lecture.time != null){
                                let result;
                                switch(parameter){
                                    case 'this-week':
                                        result = isNowWithinThisWeek(new Date(lecture.time.timeStart));
                                        break;
                                    case 'next-week':
                                        result = isWithinNextWeek(new Date(lecture.time.timeStart));
                                        break;
                                    case 'this-month':
                                        result = isWithinThisMonth(new Date(lecture.time.timeStart));
                                        break;
                                    default:
                                        break;
                                }
                            
                                if (result == true){
                                    lecturesWithinRange.push({
                                        ...lecture, ...metadata
                                    })
                                }
                            }
                        })

                        return lecturesWithinRange;

                    }
                    
                }

                render(){

                    this.thisWeek = [];
                    this.sort();
                    this.timetableContainer.innerHTML = "";

                    const innerTimetableContainerForThisWeek = document.createElement("div");
                    innerTimetableContainerForThisWeek.className = "inner-timetable-container";

                    // TODO: headers

                    if(this.thisWeek.length > 0){
                        this.thisWeek.forEach( row => {
                            const rowElement = this.createTimetableRow(row);
                            innerTimetableContainerForThisWeek.appendChild(rowElement);
                        });

                        this.timetableContainer.append(innerTimetableContainerForThisWeek);
                    }else{
                        this.timetableContainer.append(this.createEmptyView("No classes for this time period"))
                    }
                }

                createEmptyView(text){
                    const emptyView = document.createElement("div");
                    emptyView.className = "empty-view";
                    emptyView.textContent = text;
                    return emptyView;
                }

                createTimetableRow(rowObject){

                    const timetableRow = document.createElement("div");
                    timetableRow.className = "timetable-row";

                    const courseImageContainer = document.createElement("div");
                    courseImageContainer.className = "course-image";

                    const courseImage = document.createElement("img");
                    courseImage.src = "../uploads/" + rowObject.courseImage;

                    const timetableRowDetails = document.createElement("div");
                    timetableRowDetails.className = "timetable-row-details";

                    const courseCode = document.createElement("h4");
                    courseCode.className = "course-code";
                    courseCode.textContent = rowObject.courseCode;

                    const courseTitle = document.createElement("div");
                    courseTitle.className = "course-title";
                    courseTitle.textContent = "Lecture: " + rowObject.title;

                    const courseInstructor = document.createElement("div");
                    courseInstructor.className = "course-instructor";
                    courseInstructor.textContent = "Instructor: " + rowObject.courseInstructor;

                    const courseTime = document.createElement("div");
                    courseTime.className = "course-time";
                    courseTime.textContent = rowObject.time.timeStart;
                    //TODO: Format time and make it more human friendly 

                    timetableRowDetails.append(courseCode);
                    timetableRowDetails.append(courseTitle);
                    timetableRowDetails.append(courseInstructor);
                    timetableRowDetails.append(courseTime);

                    courseImageContainer.appendChild(courseImage);
                    timetableRow.append(courseImageContainer)
                    timetableRow.append(timetableRowDetails)

                    return timetableRow;

                }

            }

            function isNowWithinThisWeek(givenDate) {

                if(givenDate == null) return false;

                const now = new Date();
                const startOfWeek = new Date(now);
                const endOfWeek = new Date(now);

                // Set startOfWeek to the previous Sunday (start of the week)
                startOfWeek.setDate(now.getDate() - now.getDay());

                // Set endOfWeek to the next Saturday (end of the week)
                endOfWeek.setDate(now.getDate() + (7 - now.getDay()));

                // Set times to start and end of days
                startOfWeek.setHours(0, 0, 0, 0);
                endOfWeek.setHours(23, 59, 59, 999);

                return givenDate >= now && givenDate <= endOfWeek;
            }

            function isWithinNextWeek(date) {
                const now = new Date();
                const startOfNextWeek = new Date(now);
                const endOfNextWeek = new Date(now);

                // Set startOfNextWeek to the next Sunday's date
                startOfNextWeek.setDate(now.getDate() + (7 - now.getDay()));

                // Set endOfNextWeek to the next Saturday after the next Sunday
                endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);

                // Set times to start and end of days
                startOfNextWeek.setHours(0, 0, 0, 0);
                endOfNextWeek.setHours(23, 59, 59, 999);

                return date >= startOfNextWeek && date <= endOfNextWeek;
            }

            function isWithinThisMonth(date) {
                const now = new Date();
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

                // Set times to start and end of days
                startOfMonth.setHours(0, 0, 0, 0);
                endOfMonth.setHours(23, 59, 59, 999);

                return date >= startOfMonth && date <= endOfMonth;
                
            }

        </script>
    </body>
</html>
