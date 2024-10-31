class TakeExamView{

    constructor(metadata){
        this.userID = metadata.id;
    }

    setExamsListContainer(element){
        console.log("elc: ", element);
        this.examsListContainer = element;
    }

    async render(pointer = this){

        await pointer.getExamRows();

        const emptyView = document.createElement("div");
        emptyView.className = "empty-view";
        emptyView.textContent = "There are no exams";
        // emptyView.append(createLocalizedTextElement("There are no exams"))

        pointer.examsListContainer.innerHTML = "";

        if(pointer.examsObject.length <= 0) pointer.examsListContainer.append(emptyView);

        pointer.examsObject.forEach( rowObject => {
    
            const metadata = {
                id: rowObject.id,
                courseCode: rowObject.courseCode, 
                image: rowObject.image,
                title: rowObject.title,
            };

            rowObject.exams.forEach( async(exam) => {
                let row = await pointer.createExamCard(exam, metadata);
                console.log("row: ", row);
                pointer.examsListContainer.append(row);
            });

        });

    }

    async getExamRows(){
        return new Promise(async (resolve, reject) => {
            this.examsObject = await this.getUpcomingExams(this.userID);
            console.log("examsObject: ", this.examsObject);
            this.currentExamCount = this.examsObject.length;
            resolve();
        })
    }

    async createExamCard(rowObject, metadata){

        const { id: examID, name, time } = rowObject;

        const {
            id: courseID,
            courseCode,
            image,
            title
        } = metadata;

        //TODO: let isTimeSet = false;

        let examCard = createElement("div", "course-card exam-card");

        let examCardImage = createElement("div", "course-card-image");
        let imageElement = document.createElement("img");

        imageElement.src = image.length > 2 ? await checkImage(`../uploads/${image}`) : `../assets/images/courseDefault.jpg`;

        examCardImage.appendChild(imageElement);
        
        let cardText = createElement("div", "card-text");
        let examCardCode = createElement("div", "course-card-code");
        let examCardTitle = createElement("div", "course-card-title");
        let examCardName = createElement("div", "course-card-name");
        
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

        examCard.addEventListener("click", () => this.handleTakeExam({ examID, courseID }));

        return examCard;
    }

    async getUpcomingExams(id){

        console.log("userID: ", id);

        return await AJAXCall({
            phpFilePath: "../include/exam/getUpcomingExams.php",
            rejectMessage: "Fetching Exams Failed",
            type: "fetch",
            params: `id=${id}`
        });
    }


    async handleTakeExam(metadata){

        openPopup(".take-exam-overlay");

        let { examID, courseID } = metadata;

        let examQuery = await AJAXCall({
            phpFilePath: "../include/exam/getExamDetails.php",
            rejectMessage: "Fetching Exam Details Failed",
            type: "fetch",
            params: `id=${examID}`
        })

        // switch(examStatus){
        //     case "started":
        //         examButton.textContent = "Resume Exam"; // TODO: Localize
        //         examButton.addEventListener("click", () => {
        //             startExam(examObjectRequired, "resume", mode); // Resume Exam
        //             examButton.setAttribute("disabled", true);
        //             examButton.textContent = "started";
        //         })
        //     break;
        //     case "done":
        //         examButton.textContent = "Review Results"; // TODO: Localize
        //         examButton.addEventListener("click", () => {
        //             viewExamResults(studentExamFilename); // View Results
        //         });
        //     break;
        // }

        const { filename } = examQuery[0];

        let correctPath = `../exam/generated/${filename}`;

        let examFileResponse = await fetch(correctPath, {cache: "reload"});
        console.log("examFileResponse:", examFileResponse);
        let questions = await examFileResponse.json();
    
        let questionsArray = questions.map( question => 
            questionMapSwitch(question)
        );

        const language = "english"; // TODO: make dynamic
        const { id } = await getGlobalDetails();

        const examGradeObject = {
            id: uniqueID(1),
            userID: id,	
            examID,	
            fileToSave: `Exam-${uniqueID(2)}.json`,
            courseID,
        }

        const examObject = {
            questionsArray, 
            examGradeObject, 
            type: "new", 
            assessmentType: "exam", 
            language
        }

        startExam(examObject);
    }
}

async function startExam(examObject, type="new", mode){

    const {
        examGradeObject,
    } = examObject;

    const takeExam = new TakeExam(examObject)

    try{
        switch(type){
            case "resume":
                break;
            case "new":
                await addNewExamGradeRowInDatabase(examGradeObject);
                break;
        }   
    }catch(error){
        console.log(error);
    }

    //TODO: load instructions and start button

    // takeExam.setFinalCallback({ callback: this.render, callbackClass: this});

    const rootElement = document.querySelector(".take-exam-overlay");
    let nextButton = rootElement.querySelector(".next-question");
    let previousButton = rootElement.querySelector(".previous-question");
    let finishExamButton = rootElement.querySelector(".finish-exam-button");

    previousButton = clearEventListenersFor(previousButton)
    nextButton = clearEventListenersFor(nextButton)
    finishExamButton = clearEventListenersFor(finishExamButton)

    takeExam.setNextButton(nextButton)
    takeExam.setPreviousButton(previousButton)
    takeExam.setFinishExamButton(finishExamButton);

    let examBody = document.querySelector(".exam-popup-body");
    let resultsBody = document.querySelector(".exam-results-body");
    let buttonGroupFooter = document.querySelector(".button-group-footer");

    examBody.style.display = "grid"
    buttonGroupFooter.style.display = "grid"
    resultsBody.style.display = "none"

    setTimeout(() => {    
        takeExam.startExam();
        closePopup('.take-exam-loader');
    }, 2000);

}

class TakeExam {

    filename
    minimumExamNumber = 0;
    maximumExamNumber = 0;
    currentExamNumber = 0;
    questions = []
    nextButton
    previousButton
    finishExamButton
    type
    examGradeObject

    renderQuestionNumber(questionNumber){
        
        let questionNumberElement = document.querySelector(".question-header");
        questionNumberElement.innerHTML = "";
        let questionTextElement = createLocalizedTextElement("Question");
        let numberElement = document.createElement("div");
        numberElement.textContent = questionNumber + 1;
        questionNumberElement.appendChild(questionTextElement);
        questionNumberElement.appendChild(numberElement);

    }

    constructor({ questionsArray, examGradeObject, type, assessmentType, language = "english" }){

        console.log("here: ", examGradeObject);

        this.filename = examGradeObject.fileToSave; // ... TODO: write some documentation
        this.questions = questionsArray; // randomize(questions);

        console.log("questions: ", this.questions);

        this.maximumExamNumber = this.questions.length - 1;
        this.type = type;
        this.currentExamNumber = 0;
        this.examGradeObject = examGradeObject;
        this.language = language;
        this.assessmentType = assessmentType;
        
    }

    startExam(){
        this.renderQuestion();
        this.handleButtons();
    }

    autoSave(){
        saveAssessmentAsJSON(this.filename, this.questions, this.assessmentType, this.type);
    }

    endExam(){

        console.log("[2] filename: ", this.filename);

        handleEndExam({
            filename: this.filename,
            questions: this.questions,
            type: this.type,
            examGradeObject: this.examGradeObject,
            language: this.language
        });
    }

    setFinishExamButton(button){
        this.finishExamButton = button;
        this.finishExamButton.addEventListener("click", () => {
            this.endExam();
        })
    }
    
    renderQuestion(){
        this.renderQuestionNumber(this.currentExamNumber);
        this.questions[this.currentExamNumber].render(this.language);
        console.log("current question index: ", this.currentExamNumber);
    }

    nextQuestion(){
        ++this.currentExamNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    previousQuestion(){
        --this.currentExamNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    setPreviousButton(button){
        this.previousButton = button;
        this.previousButton.addEventListener("click", () => {
            this.previousQuestion();
        })
    }

    setNextButton(button){
        this.nextButton = button;
        this.nextButton.addEventListener("click", () => {
            this.nextQuestion();
        })
    }

    handleButtons(){

        if(this.currentExamNumber == 0){
            this.nextButton.removeAttribute("disabled");
            this.previousButton.setAttribute("disabled", "true");
            this.finishExamButton.parentElement.style.display = "none";
        }
        
        if(this.currentExamNumber > 0 && this.currentExamNumber <= this.maximumExamNumber ){
            this.nextButton.removeAttribute("disabled");
            this.previousButton.removeAttribute("disabled");
        }
        
        if(this.currentExamNumber == this.maximumExamNumber ){
            this.nextButton.setAttribute("disabled","true");
            this.finishExamButton.parentElement.style.display = "grid";
        } 

        if(this.currentExamNumber % 3 == 0){
            this.autoSave();
        }
    }

}

async function handleEndExam(examObject){

    openPopup('.take-exam-loader');

    let {
        filename,
        questions,
        type,
        examGradeObject,
        language
    } = examObject;

    saveAssessmentAsJSON(filename, questions, "exam", type);

    let { result, totalMarks } = await mark(questions, language);

    console.log(`result: ${result}, totalMarks: ${totalMarks}`);

    let examBody = document.querySelector(".exam-popup-body");
    let resultsBody = document.querySelector(".exam-results-body");
    let footers = examBody.parentElement.querySelectorAll(".popup-footer");

    let resultArea = document.querySelector(".exam-result-area");
    let totalResultPlaceholder = resultArea.querySelector(".total-exam-mark-placeholder");
    let scoreResultPlaceholder = resultArea.querySelector(".earned-exam-mark-placeholder");

    totalResultPlaceholder.textContent = totalMarks;
    scoreResultPlaceholder.textContent = result;

    footers.forEach( footer => footer.style.display = "none");

    examBody.style.display = "none";

    switch(type) {
        case "new":
            await updateNewExamGrade(examGradeObject, result, totalMarks);
            break;
        case "resume":
            await updateOldExamGrade(examGradeObject, result, totalMarks);
            break;
    }

    async function updateNewExamGrade(examGradeObject, marks, totalMarks){

        let value = marks;

        let {
            id,
            userID,	
            examID,	
            fileToSave,
        } = examGradeObject;

        let timeEnded = getCurrentTimeInJSONFormat();

        let status = "done";

        let params = `id=${id}&&userID=${userID}&&examID=${examID}`+
        `&&filename=${fileToSave}&&status=${status}&&value=${value}`+
        `&&timeEnded=${timeEnded}&&totalMarks=${totalMarks}`;

        console.log("params to save: ", params);

        let response = await AJAXCall({
            phpFilePath: "../include/exam/updateNewExamGrade.php",
            rejectMessage: "Failed to update new exam grade",
            type: "post",
            params
        });

        console.log("adding marks response: ", response);

    }

    async function updateOldExamGrade(examGradeObject, marks, totalMarks){

        let value = marks;
        let { id } = examGradeObject;

        let timeEnded = getCurrentTimeInJSONFormat();

        console.log("finalTime: ", timeEnded);

        let params = `id=${id}&&value=${value}&&timeEnded=${timeEnded}&&totalMarks=${totalMarks}`;

        let response = await AJAXCall({
            phpFilePath: "../include/exam/updateOldExamGrade.php",
            rejectMessage: "Failed to update exam grade",
            type: "post",
            params
        });

        console.log("adding marks response: ", response);

    }
    
    setTimeout(() => {
        resultsBody.style.display = "grid";
        closePopup(".take-exam-loader");
    },2000)

}

async function addNewExamGradeRowInDatabase(examGradeObject){

    const _examGradeObject = {
        ...examGradeObject, 
        timeStarted: getCurrentTimeInJSONFormat(),
        status: "started",
        filename: examGradeObject.fileToSave
    };

    console.log("_examGradeObject: ", _examGradeObject);

    let params = createParametersFrom(_examGradeObject);

    let response = await AJAXCall({
        phpFilePath: "../include/exam/addNewExamGradeRow.php",
        rejectMessage: "Failed to create new exam grade row",
        type: "post",
        params
    });

    console.log("add new exam: ", response);

}
