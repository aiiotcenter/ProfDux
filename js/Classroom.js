class Classroom {

    constructor(courseObject, courseID){
        let {
            title,
            courseCode,
            lectures,
            id,
        } = courseObject

        this.title = title;
        this.courseCode = courseCode;
        this.lectures = lectures;
        this.courseObject = courseObject;
        this.id = id;
        this.courseID = courseID;
    }

    renderTitle(){
        let titleElement = findElement(".classroom-course-title");
        let textElement = document.createElement("div");

        textElement.textContent = this.title;
        titleElement.innerHTML = "";
        titleElement.appendChild(textElement);
    }

    renderCourseCode(){
        let titleElement = findElement(".classroom-course-code");
        let textElement = createLocalizedTextElement(this.courseCode);        
        titleElement.innerHTML = "";
        titleElement.appendChild(textElement);
    }

    renderCourseOutline(){

        let outerMainClassroomContainer = findElement(".outer-main-classroom-container");
        outerMainClassroomContainer.innerHTML = "";

        this.lectures.forEach( lecture => {

            let mainClassroomLectureContainer = createElement("div", "main-classroom-lecture-container");
            let mainClassroomLectureHeader = createElement("div", "main-classroom-lecture-header");
            let mainClassroomLectureInnerContainer = createElement("div", "main-classroom-lecture-inner-container");

            let lectureTitleContainer = createElement("div", "class-lecture-title");
            let lectureTime = createElement("div", "class-lecture-time");

            let lectureStartTime = lecture.time.timeStart; // check if null.
            const isTimeReadyForLecture = testIfTimeIsReady(lectureStartTime);

            if(!isTimeReadyForLecture){
                mainClassroomLectureInnerContainer.className = "main-classroom-lecture-inner-container disable-cursor-for-children-elements"
                mainClassroomLectureInnerContainer.style.opacity = 0.3;
            }

            lectureTitleContainer.textContent = lecture.title;
            lectureTime.textContent = lectureStartTime;
            mainClassroomLectureHeader.appendChild(lectureTitleContainer);
            mainClassroomLectureHeader.appendChild(lectureTime);

            lecture.resources.forEach( resource => {

                let mainClassroomSubtopicContainer = createElement("div", "main-classroom-subtopic-container");
                let mainClassroomSubtopicHeader = createElement("div", "main-classroom-subtopic-header");

                mainClassroomSubtopicHeader.textContent = resource.title;
                mainClassroomSubtopicContainer.appendChild(mainClassroomSubtopicHeader);

                let mainClassroomSubtopicItem = this.createSubtopicItem(resource, isTimeReadyForLecture);
                mainClassroomSubtopicContainer.appendChild(mainClassroomSubtopicItem);


                mainClassroomLectureInnerContainer.appendChild(mainClassroomSubtopicContainer);

            })


            lecture.quizzes.forEach( async (quiz,index) => {

                const quizRowItemButton = document.createElement("button");
                quizRowItemButton.className = "row-item-action quiz-action";
                quizRowItemButton.textContent = "start";

                const quizClassroomSubtopicContainer = document.createElement("div");
                quizClassroomSubtopicContainer.className = "main-classroom-subtopic-container";

                const quizSubtopicItem = document.createElement("div");
                quizSubtopicItem.className = "main-classroom-subtopic-item";

                const quizRowItemIcon = document.createElement("div");
                quizRowItemIcon.className = "row-item-icon";

                const quizRowItemIconImage = document.createElement("img");
                quizRowItemIconImage.src = "../assets/icons/quiz.png";

                quizRowItemIcon.appendChild(quizRowItemIconImage);

                const quizRowItemText = document.createElement("div");
                quizRowItemText.className = "row-item-text";
                quizRowItemText.textContent = "Quiz";

                // const quizRowItemDetails = document.createElement("div");
                // quizRowItemDetails.className = "row-small-text";
                // TODO: fromTeacherQuizFilename;
                // quizRowItemDetails.textContent = "8 questions - ( 10 marks )";.

                quizSubtopicItem.appendChild(quizRowItemIcon)
                quizSubtopicItem.appendChild(quizRowItemText)
                // quizSubtopicItem.appendChild(quizRowItemDetails)
                quizSubtopicItem.appendChild(quizRowItemButton)

                quizClassroomSubtopicContainer.appendChild(quizSubtopicItem);
                mainClassroomLectureInnerContainer.appendChild(quizClassroomSubtopicContainer);


                if(!isTimeReadyForLecture) {
                    return;
                }
                
                const quizObject = { hierarchy: lecture.hierarchy, ...quiz };
                handleQuiz({courseID: this.courseID, ...quizObject }, quizRowItemButton)

            })

            mainClassroomLectureContainer.appendChild(mainClassroomLectureHeader);
            mainClassroomLectureContainer.appendChild(mainClassroomLectureInnerContainer);
            outerMainClassroomContainer.appendChild(mainClassroomLectureContainer);

        });

    }



    createSubtopicItem(resource, isTimeReadyForLecture){

        let resourceType = extractType(resource.type);
        let { id, value } = resource;

        let mainClassroomSubtopicItem = createElement("div", "main-classroom-subtopic-item");
        mainClassroomSubtopicItem.setAttribute("id", id);

        let rowItemIcon = createElement("div", "row-item-icon")
        let rowItemText = createElement("div", "row-item-text")
        let rowItemAction = createElement("div", "row-item-action");

        let imageElement = document.createElement("img");

        switch(resourceType){
            case "image":
                imageElement.src = "../assets/icons/image.png";
                //TODO: change this textContent to a localizedTranslatableElement
                rowItemAction.textContent = "view";
                rowItemAction.addEventListener("click", () => openImageViewer(`../uploads/${value}`))
                break;
            case "pdf":
                imageElement.src = "../assets/icons/pdf.png";
                rowItemAction.textContent = "view";
                rowItemAction.addEventListener("click", () => openPDFViewer(`../uploads/${value}`))
                break;
           case "video":
            imageElement.src = "../assets/icons/play.png";
            rowItemAction.textContent = "view";
            rowItemAction.addEventListener("click", () =>openyyoutubeViewer(`${value}`))        
            break;
            case "player":
                imageElement.src = "../assets/icons/play.png";
                rowItemAction.textContent = "view";
                rowItemAction.addEventListener("click", () =>openVideoViewer(`${value}`))   
                break;
            case "text":
                imageElement.src = "../assets/icons/fi/fi-rr-pen-clip.svg";
                // rowItemAction.textContent = value;
                break;
            default:
                throw new Error("Type has not been created yet!"+resourceType);
                break;
        }
        //TODO: This should be changed to the title of the resource;
        rowItemText.textContent = value;

        rowItemIcon.appendChild(imageElement);
        mainClassroomSubtopicItem.appendChild(rowItemIcon)
        mainClassroomSubtopicItem.appendChild(rowItemText)
        if(resourceType != "text") mainClassroomSubtopicItem.appendChild(rowItemAction)

        return mainClassroomSubtopicItem;


         

    }

}

async function renderCourseOutline(givenID){

    let courses = await getCourseDetails(givenID);

    globalCache.put("chosenCourseData", courses[0]);
    globalCache.put("givenCourseID", givenID);

    const classroom = new Classroom(courses[0], givenID);

    classroom.renderTitle();
    classroom.renderCourseCode();
    classroom.renderCourseOutline();

}

function refreshCourseOutline(){
    let classRoomOverlay = document.querySelector(".classroom-inner-overlay");
    let id = classRoomOverlay.getAttribute("id");
    renderCourseOutline(id);
}

async function viewQuizResults(studentQuizFilename){

    openPopup('.review-quiz-overlay');

    let reviewQuizOverlay = document.querySelector(".review-quiz-overlay");

    const language = extrapolateLanguage();

    let reviewQuizLoader = reviewQuizOverlay.querySelector(".review-quiz-loader");
    reviewQuizLoader.style.display = "grid";

    let quizResultsBody = reviewQuizOverlay.querySelector(".quiz-results-body");
    quizResultsBody.style.display = "none";

    let correctPath = `../quiz/taken/${studentQuizFilename}`;
    let quizFileResponse = await fetch(correctPath, {cache: "reload"});
    let questions = await quizFileResponse.json();

    let { result, totalMarks } = mark(questions, language);

    let totalResultPlaceholder = reviewQuizOverlay.querySelector(".total-quiz-mark-placeholder");
    let scoreResultPlaceholder = reviewQuizOverlay.querySelector(".earned-quiz-mark-placeholder");

    totalResultPlaceholder.textContent = totalMarks;
    scoreResultPlaceholder.textContent = result;

    setTimeout(() => {
        quizResultsBody.style.display = "grid";
        reviewQuizLoader.style.display = "none";
    }, 1000);
}

function testIfTimeIsReady(lectureStartTime){

    //TODO: make this work
    let time = new Date(lectureStartTime);
    let now = new Date();

    console.log(`time: ${time} now: ${now}`);
    if (time <= now ) return true
    return false;
}