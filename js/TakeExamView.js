class TakeExamView {
    constructor(metadata) {
        this.userID = metadata.id;
    }

    setExamsListContainer(element) {
        this.examsListContainer = element;
    }

    async render(pointer = this) {
        await pointer.getExamRows();

        const emptyView = document.createElement("div");
        emptyView.className = "empty-view";
        emptyView.textContent = "There are no exams";
        // emptyView.append(createLocalizedTextElement("There are no exams"))

        pointer.examsListContainer.innerHTML = "";

        if (pointer.examsObject.length <= 0)
            pointer.examsListContainer.append(emptyView);

        pointer.examsObject.forEach((rowObject) => {
            const metadata = {
                id: rowObject.id,
                courseCode: rowObject.courseCode,
                image: rowObject.image,
                title: rowObject.title,
            };

            rowObject.exams.forEach(async (exam) => {
                let row = await pointer.createExamCard(exam, metadata);

                pointer.examsListContainer.append(row);
            });
        });
    }

    async getExamRows() {
        return new Promise(async (resolve, reject) => {
            this.examsObject = await this.getUpcomingExams(this.userID);

            this.currentExamCount = this.examsObject.length;
            resolve();
        });
    }

    async createExamCard(rowObject, metadata) {
        const { id: examID, name, time, duration } = rowObject;
        const { id: courseID, courseCode, image, title } = metadata;
        let { id: globalUserID } = await getUserDetails();

        //TODO: let isTimeSet = false;

        const isTimeSet = time.length > 0;
        let isExamDone = false;

        const examResponse = await AJAXCall({
            phpFilePath: "../include/exam/getPersonalExamGrades.php",
            rejectMessage: "Exam Grades Failed To Be Fetched",
            params: `userID=${globalUserID}&&examID=${examID}`,
            type: "fetch",
        }); // TODO:

        if (examResponse.length > 0) {
            examResponse[0].status == "done"
                ? (isExamDone = true)
                : (isExamDone = false);
        }

        let examCard = createElement("div", "course-card exam-card");

        let examCardImage = createElement("div", "course-card-image");
        let imageElement = document.createElement("img");

        imageElement.src =
            image.length > 2
                ? await checkImage(`../uploads/${image}`)
                : `../assets/images/courseDefault.jpg`;

        examCardImage.appendChild(imageElement);

        let cardText = createElement("div", "card-text");
        let examCardCode = createElement("div", "course-card-code");
        let examCardTitle = createElement("div", "course-card-title");
        let examCardName = createElement("div", "course-card-name");

        let timeElementWrapper = createElement("div", "time-element-wrapper");
        let timeElement = createElement("div", "time-element");
        let timeCommentElement = createElement("div", "time-comment-element");
        timeElement.textContent = isTimeSet
            ? formatDateTimeForExamView(time[0].timeStart)
            : "Exam Time Not Set";

        timeCommentElement.textContent =
            isTimeSet && isTimeReady
                ? calculateRemainingMinutes(time[0].timeStart, duration)
                : `${duration} minutes`;

        if (isExamDone) {
            timeCommentElement.textContent = "Exam Done";
            timeCommentElement.className = "time-comment-element inverted";
        }

        timeElementWrapper.appendChild(timeElement);
        timeElementWrapper.appendChild(timeCommentElement);
        examCard.appendChild(timeElementWrapper);

        examCardCode.textContent = courseCode;
        examCardTitle.textContent = title;
        examCardName.textContent = name;

        cardText.appendChild(examCardCode);
        cardText.appendChild(examCardTitle);
        cardText.appendChild(examCardName);

        let cardOverlay = createElement("div", "card-overlay white-overlay");

        examCard.appendChild(examCardImage);
        examCard.appendChild(cardText);
        examCard.appendChild(cardOverlay);

        !isExamDone &&
            isTimeSet &&
            isTimeReady(time[0].timeStart, duration) &&
            examCard.addEventListener("click", () =>
                this.handleTakeExam({
                    examID,
                    courseID,
                    durationCallback: () =>
                        calculateRemainingMinutes(time[0].timeStart, duration),
                })
            );

        return examCard;
    }

    async getUpcomingExams(id) {
        return await AJAXCall({
            phpFilePath: "../include/exam/getUpcomingExams.php",
            rejectMessage: "Fetching Exams Failed",
            type: "fetch",
            params: `id=${id}`,
        });
    }

    async handleTakeExam(metadata) {
        openPopup(".take-exam-overlay");
        let { examID, courseID, durationCallback } = metadata;
        let { id: globalUserID } = await getUserDetails();
        let examObject;
        const language = extrapolateLanguage();
        let correctPath;

        let examQuery = await AJAXCall({
            phpFilePath: "../include/exam/getExamDetails.php",
            rejectMessage: "Fetching Exam Details Failed",
            type: "fetch",
            params: `id=${examID}`,
        });

        let { hierarchy } = examQuery[0];

        const examResponse = await AJAXCall({
            phpFilePath: "../include/exam/getPersonalExamGrades.php",
            rejectMessage: "Exam Grades Failed To Be Fetched",
            params: `userID=${globalUserID}&&examID=${examID}`,
            type: "fetch",
        }); // TODO:

        if (examResponse.length > 0) {
            //resume

            const { id: rowID, examID, filename, courseID } = examResponse[0];

            const examGradeObject = {
                id: rowID,
                userID: globalUserID,
                examID,
                fileToSave: filename,
                courseID,
            };

            correctPath = `../exam/taken/${filename}`;

            examObject = {
                examGradeObject,
                type: "resume",
                assessmentType: "exam",
                language,
            };
        } else {
            //new

            const { filename } = examQuery[0];

            correctPath = `../exam/generated/${filename}`;

            const examGradeObject = {
                id: uniqueID(1),
                userID: globalUserID,
                examID,
                fileToSave: `Exam-${uniqueID(2)}.json`,
                courseID,
                hierarchy,
            };

            await addNewExamGradeRowInDatabase(examGradeObject);

            examObject = {
                examGradeObject,
                type: "new",
                assessmentType: "exam",
                language,
            };
        }

        let examFileResponse = await fetch(correctPath, {
            cache: "reload",
        });

        let questions = await examFileResponse.json();

        let questionsArray = questions.map((question) =>
            questionMapSwitch(question)
        );

        examObject.questionsArray = questionsArray;
        examObject.durationCallback = durationCallback;

        startExam(examObject);
    }
}

async function startExam(examObject) {
    const takeExam = new TakeExam(examObject);

    //TODO: load instructions and start button

    const rootElement = document.querySelector(".take-exam-overlay");
    let nextButton = rootElement.querySelector(".next-question");
    let previousButton = rootElement.querySelector(".previous-question");
    let finishExamButton = rootElement.querySelector(".finish-exam-button");

    previousButton = clearEventListenersFor(previousButton);
    nextButton = clearEventListenersFor(nextButton);
    finishExamButton = clearEventListenersFor(finishExamButton);

    takeExam.setNextButton(nextButton);
    takeExam.setPreviousButton(previousButton);
    takeExam.setFinishExamButton(finishExamButton);

    let examBody = document.querySelector(".exam-popup-body");
    let resultsBody = document.querySelector(".exam-results-body");
    let buttonGroupFooter = document.querySelector(".button-group-footer");

    examBody.style.display = "grid";
    buttonGroupFooter.style.display = "grid";
    resultsBody.style.display = "none";

    setTimeout(() => {
        takeExam.startExam();
        closePopup(".take-exam-loader");
    }, 2000);
}

class TakeExam {
    filename;
    minimumExamNumber = 0;
    maximumExamNumber = 0;
    currentExamNumber = 0;
    questions = [];
    nextButton;
    previousButton;
    finishExamButton;
    type;
    examGradeObject;

    renderQuestionNumber(questionNumber) {
        let questionNumberElement = document.querySelector(".question-header");
        questionNumberElement.innerHTML = "";
        let questionTextElement = createLocalizedTextElement("Question");
        let numberElement = document.createElement("div");
        numberElement.textContent = questionNumber + 1;
        questionNumberElement.appendChild(questionTextElement);
        questionNumberElement.appendChild(numberElement);
    }

    constructor({
        questionsArray,
        durationCallback,
        examGradeObject,
        type,
        assessmentType,
        language = "english",
    }) {
        this.filename = examGradeObject.fileToSave; // ... TODO: write some documentation
        this.questions = questionsArray; // randomize(questions);
        this.examID = examGradeObject.examID;
        this.maximumExamNumber = this.questions.length - 1;
        this.type = type;
        this.currentExamNumber = 0;
        this.examGradeObject = examGradeObject;
        this.language = language;
        this.assessmentType = assessmentType;
        this.durationCallback = durationCallback;
    }

    startExam() {
        this.renderQuestion();
        this.handleButtons();
        this.startTimer();

        const cheatingRenderElement = document.querySelector(
            ".cheating-attempts-value"
        );

        new CheatingDetector(this.examID, 3, cheatingRenderElement, () =>
            this.endExam()
        );
    }

    startTimer() {
        let timerElement = document.querySelector(".timer");
        let minutes = Number(this.durationCallback().split(" ")[0]);
        const timer = new Timer(minutes, timerElement, () => this.endExam());
        timer.start();
        this.timer = timer;
    }

    autoSave() {
        saveAssessmentAsJSON(
            this.filename,
            this.questions,
            this.assessmentType,
            this.type
        );
    }

    endExam() {
        this.timer.stop();
        handleEndExam({
            filename: this.filename,
            questions: this.questions,
            type: this.type,
            examGradeObject: this.examGradeObject,
            language: this.language,
        });
    }

    setFinishExamButton(button) {
        this.finishExamButton = clearEventListenersFor(button);
        this.finishExamButton.addEventListener("click", () => {
            this.endExam();
        });
    }

    renderQuestion() {
        this.renderQuestionNumber(this.currentExamNumber);
        this.questions[this.currentExamNumber].render(this.language);
    }

    nextQuestion() {
        ++this.currentExamNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    previousQuestion() {
        --this.currentExamNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    setPreviousButton(button) {
        this.previousButton = clearEventListenersFor(button);
        this.previousButton.addEventListener("click", () => {
            this.previousQuestion();
        });
    }

    setNextButton(button) {
        this.nextButton = clearEventListenersFor(button);
        this.nextButton.addEventListener("click", () => {
            this.nextQuestion();
        });
    }

    handleButtons() {
        if (this.currentExamNumber == 0) {
            this.nextButton.removeAttribute("disabled");
            this.previousButton.setAttribute("disabled", "true");
            this.finishExamButton.parentElement.style.display = "none";
        }

        if (
            this.currentExamNumber > 0 &&
            this.currentExamNumber <= this.maximumExamNumber
        ) {
            this.nextButton.removeAttribute("disabled");
            this.previousButton.removeAttribute("disabled");
        }

        if (this.currentExamNumber == this.maximumExamNumber) {
            this.nextButton.setAttribute("disabled", "true");
            this.finishExamButton.parentElement.style.display = "grid";
        }

        if (this.currentExamNumber % 3 == 0) {
            this.autoSave();
        }
    }
}

async function handleEndExam(examObject) {
    openPopup(".take-exam-loader");

    console.log("examObject: ", examObject);

    let { filename, questions, type, examGradeObject, language } = examObject;

    saveAssessmentAsJSON(filename, questions, "exam", type);

    let { result, totalMarks } = await mark(questions, language);

    let examBody = document.querySelector(".exam-popup-body");
    let resultsBody = document.querySelector(".exam-results-body");
    let footers = examBody.parentElement.querySelectorAll(".popup-footer");

    let resultArea = document.querySelector(".exam-result-area");
    let totalResultPlaceholder = resultArea.querySelector(
        ".total-exam-mark-placeholder"
    );
    let scoreResultPlaceholder = resultArea.querySelector(
        ".earned-exam-mark-placeholder"
    );
    let percentageMarkPlaceholder = document.querySelector(".percentage-mark");

    totalResultPlaceholder.textContent = totalMarks;
    scoreResultPlaceholder.textContent = result;
    console.log("total Marks", totalMarks);
    console.log("result Marks", result);
    percentageMarkPlaceholder.textContent = Math.round(
        (result / totalMarks) * 100
    );

    footers.forEach((footer) => (footer.style.display = "none"));

    examBody.style.display = "none";

    switch (type) {
        case "new":
            await updateNewExamGrade(examGradeObject, result, totalMarks);
            break;
        case "resume":
            await updateOldExamGrade(examGradeObject, result, totalMarks);
            break;
    }

    async function updateNewExamGrade(examGradeObject, marks, totalMarks) {
        let value = marks;

        let { id, userID, examID, fileToSave } = examGradeObject;

        let timeEnded = getCurrentTimeInJSONFormat();

        let status = "done";

        let params =
            `id=${id}&&userID=${userID}&&examID=${examID}` +
            `&&filename=${fileToSave}&&status=${status}&&value=${value}` +
            `&&timeEnded=${timeEnded}&&totalMarks=${totalMarks}`;

        let response = await AJAXCall({
            phpFilePath: "../include/exam/updateNewExamGrade.php",
            rejectMessage: "Failed to update new exam grade",
            type: "post",
            params,
        });
    }

    async function updateOldExamGrade(examGradeObject, marks, totalMarks) {
        let value = marks;
        let { id } = examGradeObject;

        let timeEnded = getCurrentTimeInJSONFormat();

        let params = `id=${id}&&value=${value}&&timeEnded=${timeEnded}&&totalMarks=${totalMarks}`;

        let response = await AJAXCall({
            phpFilePath: "../include/exam/updateOldExamGrade.php",
            rejectMessage: "Failed to update exam grade",
            type: "post",
            params,
        });
    }

    setTimeout(() => {
        resultsBody.style.display = "grid";
        closePopup(".take-exam-loader");
    }, 2000);

    setTimeout(() => {
        closePopup(".take-exam-overlay");
        location.reload();
    }, 20000);
}

async function addNewExamGradeRowInDatabase(examGradeObject) {
    const _examGradeObject = {
        ...examGradeObject,
        timeStarted: getCurrentTimeInJSONFormat(),
        status: "started",
        filename: examGradeObject.fileToSave,
    };

    let params = createParametersFrom(_examGradeObject);

    let response = await AJAXCall({
        phpFilePath: "../include/exam/addNewExamGradeRow.php",
        rejectMessage: "Failed to create new exam grade row",
        type: "post",
        params,
    });
}

function isTimeReady(__startTime, durationMinutes) {
    try {
        // Parse the start time in UTC (because it's in UTC format: 2025-01-05T14:00:00.000Z)
        const startTimeUTC = new Date(__startTime);

        if (isNaN(startTimeUTC)) {
            throw new Error("Invalid date format");
        }

        // Get the current local time
        const now = new Date();

        // Convert the start time from UTC to local time
        const localStartTime = new Date(
            startTimeUTC.getTime() + startTimeUTC.getTimezoneOffset() * 60000
        );

        // Calculate the exam end time in local time (adjusting UTC by duration)
        const examEndTimeLocal = new Date(
            localStartTime.getTime() + durationMinutes * 60000
        );

        // Check if the current time (local) is within the range
        const result = now >= localStartTime && now <= examEndTimeLocal;

        return result;
    } catch (error) {
        console.error("Error:", error.message);
        return false;
    }
}

function calculateRemainingMinutes(__startTime, durationMinutes) {
    try {
        // Parse the start time in UTC (because it's in UTC format: 2025-01-05T14:00:00.000Z)
        const startTimeUTC = new Date(__startTime);

        if (isNaN(startTimeUTC)) {
            throw new Error("Invalid date format");
        }

        // Get the current local time
        const now = new Date();

        // Convert the start time from UTC to local time
        const localStartTime = new Date(
            startTimeUTC.getTime() + startTimeUTC.getTimezoneOffset() * 60000
        );

        // Calculate the exam end time in local time (adjusting UTC by duration)
        const examEndTimeLocal = new Date(
            localStartTime.getTime() + durationMinutes * 60000
        );

        // Calculate remaining time in milliseconds
        const remainingTimeMillis = examEndTimeLocal.getTime() - now.getTime();

        // If the remaining time is 0 or negative, it means the exam is already over
        if (remainingTimeMillis <= 0) {
            return "exam over"; // Return "exam over" if the exam has ended
        }

        // Calculate the remaining time in minutes and round down
        const remainingMinutes = Math.floor(remainingTimeMillis / 60000); // Convert milliseconds to minutes

        // Return the remaining minutes
        return remainingMinutes + " minutes remaining";
    } catch (error) {
        console.error("Error:", error.message);
        return "exam over"; // Return "exam over" in case of error
    }
}

function formatDateTimeForExamView(jsonDateTime) {
    try {
        const dateTime = new Date(jsonDateTime);

        if (isNaN(dateTime)) {
            throw new Error("Invalid date format in JSON");
        }

        // Format the date and time in UTC
        const day = String(dateTime.getUTCDate()).padStart(2, "0");
        const month = String(dateTime.getUTCMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = dateTime.getUTCFullYear();
        const hours = String(dateTime.getUTCHours()).padStart(2, "0");
        const minutes = String(dateTime.getUTCMinutes()).padStart(2, "0");

        // Return formatted string
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}

class CheatingDetector {
    constructor(examId, maxAttempts = 3, renderElement, callback) {
        this.examId = examId;
        this.maxAttempts = maxAttempts;
        this.currentAttempts = this.getCheatingAttempts() || 0;
        this.callback = callback;
        this.renderElement = renderElement;
        this.init();
    }

    init() {
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                this.handleCheatingAttempt();
            }
        });
    }

    handleCheatingAttempt() {
        this.currentAttempts++;
        this.saveCheatingAttempts();

        this.renderElement.textContent = `${this.currentAttempts} / ${this.maxAttempts}`;

        console.log(
            `Cheating attempt ${this.currentAttempts} detected for Exam ID: ${this.examId}`
        );

        if (this.currentAttempts >= this.maxAttempts) {
            this.callback();

            alert(
                "You have exceeded the allowed cheating attempts. Exam disqualified."
            );
        }
    }

    getCheatingAttempts() {
        const data = JSON.parse(localStorage.getItem("cheatingAttempts")) || {};
        return data[this.examId] || 0;
    }

    saveCheatingAttempts() {
        const data = JSON.parse(localStorage.getItem("cheatingAttempts")) || {};
        data[this.examId] = this.currentAttempts;
        localStorage.setItem("cheatingAttempts", JSON.stringify(data));
    }
}