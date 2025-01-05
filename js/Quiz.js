class Quiz {

    filename
    minimumQuizNumber = 0;
    maximumQuizNumber = 0;
    currentQuizNumber = 0;
    questions = []
    nextButton
    previousButton
    finishQuizButton
    type
    quizGradeObject

    renderQuestionNumber(questionNumber){
        
        let questionNumberElement = document.querySelector(".question-header");
        questionNumberElement.innerHTML = "";
        let questionTextElement = createLocalizedTextElement("Question");
        let numberElement = document.createElement("div");
        numberElement.textContent = questionNumber + 1;
        questionNumberElement.appendChild(questionTextElement);
        questionNumberElement.appendChild(numberElement);

    }

    constructor({ questionsArray, quizGradeObject, type, assessmentType, language = "english" }){

        this.filename = quizGradeObject.fileToSave; // ... TODO: write some documentation
        this.questions = questionsArray; // randomize(questions);

        

        this.maximumQuizNumber = this.questions.length - 1;
        this.type = type;
        this.currentQuizNumber = 0;
        this.quizGradeObject = quizGradeObject;
        this.language = language;
        this.assessmentType = assessmentType;
        
    }

    startQuiz(){
        this.renderQuestion();
        this.handleButtons();
    }

    autoSave(){
        saveAssessmentAsJSON(this.filename, this.questions, this.assessmentType, this.type);
    }

    endQuiz(){

        

        handleEndQuiz({
            filename: this.filename,
            questions: this.questions,
            type: this.type,
            quizGradeObject: this.quizGradeObject,
            language: this.language
        });
    }

    setFinishQuizButton(button){
        this.finishQuizButton = button;
        this.finishQuizButton.addEventListener("click", () => {
            this.endQuiz();
        })
    }
    
    renderQuestion(){
        this.renderQuestionNumber(this.currentQuizNumber);
        this.questions[this.currentQuizNumber].render(this.language);
        
    }

    nextQuestion(){
        ++this.currentQuizNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    previousQuestion(){
        --this.currentQuizNumber;
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

        if(this.currentQuizNumber == 0){
            this.nextButton.removeAttribute("disabled");
            this.previousButton.setAttribute("disabled", "true");
            this.finishQuizButton.parentElement.style.display = "none";
        }
        
        if(this.currentQuizNumber > 0 && this.currentQuizNumber <= this.maximumQuizNumber ){
            this.nextButton.removeAttribute("disabled");
            this.previousButton.removeAttribute("disabled");
        }
        
        if(this.currentQuizNumber == this.maximumQuizNumber ){
            this.nextButton.setAttribute("disabled","true");
            this.finishQuizButton.parentElement.style.display = "grid";
        } 

        if(this.currentQuizNumber % 3 == 0){
            this.autoSave();
        }
    }

}

async function handleEndQuiz(quizObject){

    openPopup('.take-quiz-loader');

    let {
        filename,
        questions,
        type,
        quizGradeObject,
        language
    } = quizObject;

    saveAssessmentAsJSON(filename, questions, "quiz", type);

    let { result, totalMarks } = await mark(questions, language);

    let quizBody = document.querySelector(".quiz-popup-body");
    let resultsBody = document.querySelector(".quiz-results-body");
    let footers = quizBody.parentElement.querySelectorAll(".popup-footer");

    let resultArea = document.querySelector(".quiz-result-area");
    let totalResultPlaceholder = resultArea.querySelector(".total-quiz-mark-placeholder");
    let scoreResultPlaceholder = resultArea.querySelector(".earned-quiz-mark-placeholder");

    totalResultPlaceholder.textContent = totalMarks;
    scoreResultPlaceholder.textContent = result;

    footers.forEach( footer => footer.style.display = "none");
    quizBody.style.display = "none";

    switch(type) {
        case "new":
            await updateNewQuizGrade(quizGradeObject, result, totalMarks);
            break;
        case "resume":
            await updateOldQuizGrade(quizGradeObject, result, totalMarks);
            break;
    }

    async function updateNewQuizGrade(quizGradeObject, marks, totalMarks){

        let value = marks;

        let {
            id,
            userID,	
            quizID,	
            fileToSave,
        } = quizGradeObject;

        let timeEnded = getCurrentTimeInJSONFormat();

        let status = "done";

        let params = `id=${id}&&userID=${userID}&&quizID=${quizID}`+
        `&&filename=${fileToSave}&&status=${status}&&value=${value}`+
        `&&timeEnded=${timeEnded}&&totalMarks=${totalMarks}`;

        

        let response = await AJAXCall({
            phpFilePath: "../include/quiz/updateNewQuizGrade.php",
            rejectMessage: "Failed to update new quiz grade",
            type: "post",
            params
        }); 

    }

    async function updateOldQuizGrade(quizGradeObject, marks, totalMarks){

        let value = marks;
        let { id } = quizGradeObject;

        let timeEnded = getCurrentTimeInJSONFormat();

        let params = `id=${id}&&value=${value}&&timeEnded=${timeEnded}&&totalMarks=${totalMarks}`;

        let response = await AJAXCall({
            phpFilePath: "../include/quiz/updateOldQuizGrade.php",
            rejectMessage: "Failed to update quiz grade",
            type: "post",
            params
        });

    }
    
    setTimeout(() => {
        resultsBody.style.display = "grid";
        closePopup(".take-quiz-loader");
    },2000)

}

async function startQuiz(quizGradeObject, type="new", mode){

    openPopup('.take-quiz-overlay');
    openPopup(".take-quiz-loader");

    let { fileToLoad, fileToSave, hierarchy } = quizGradeObject;


    let correctPath;

    switch(type){
        case "resume":
            correctPath = `../quiz/taken/${fileToLoad}`;
            break;
        case "new":
            correctPath = `../quiz/generated/${fileToLoad}`;
            break;
    }

    let quizFileResponse = await fetch(correctPath, {cache: "reload"});
    
    let questions = await quizFileResponse.json();


    let questionsArray = questions.map( question => 
        questionMapSwitch(question)
    );

    //TODO: start by saving the filename with the id of the quizGradeObject
    // if the type is new

    const language = extrapolateLanguage();
    
    const quizObject = {
        questionsArray, 
        quizGradeObject, 
        type, 
        language, 
        assessmentType: "quiz",
        hierarchy
    }
    const quiz = new Quiz(quizObject)

    switch(type){
        case "resume":
            break;
        case "new":
            await addNewQuizGradeRowInDatabase(quizGradeObject);
            break;
    }

    let previousButton = document.querySelector(".previous-question");
    let nextButton = document.querySelector(".next-question");
    let finishQuizButton = document.querySelector(".finish-quiz-button");

    previousButton = clearEventListenersFor(previousButton)
    nextButton = clearEventListenersFor(nextButton)
    finishQuizButton = clearEventListenersFor(finishQuizButton)

    quiz.setNextButton(nextButton);
    quiz.setPreviousButton(previousButton);
    quiz.setFinishQuizButton(finishQuizButton);

    let quizBody = document.querySelector(".quiz-popup-body");
    let resultsBody = document.querySelector(".quiz-results-body");
    let buttonGroupFooter = document.querySelector(".button-group-footer");

    quizBody.style.display = "grid"
    buttonGroupFooter.style.display = "grid"
    resultsBody.style.display = "none"

    setTimeout(() => {    
        quiz.startQuiz();
        closePopup('.take-quiz-loader');
    }, 2000);

    // return quiz;

}

async function handleQuiz(quiz, quizButton, mode){

    let {
        id: quizID,
        filename: fromTeacherQuizFilename,
        courseID,
        hierarchy
        // name,
    } = quiz;

    let { id: globalUserID } = await getUserDetails();
    

    const quizResponse = await AJAXCall({
        phpFilePath: "../include/quiz/getPersonalQuizGrades.php",
        rejectMessage: "Quiz Grades Failed To Be Fetched",
        params: `userID=${globalUserID}&&quizID=${quizID}`,
        type: "fetch",
    }); // TODO:

    

    if(quizResponse.length > 0){

        let {
            id: quizGradeID,
            filename: studentQuizFilename,
            status: quizStatus,
        } = quizResponse[0];

        const quizObjectRequired = {
                id: quizGradeID,
                userID: globalUserID,
                quizID,	
                fileToLoad: studentQuizFilename,
                fileToSave: studentQuizFilename,
                courseID,
                hierarchy
        }

        switch(quizStatus){
            case "started":
                quizButton.textContent = "Resume Quiz"; // TODO: Localize
                quizButton.addEventListener("click", () => {
                    startQuiz(quizObjectRequired, "resume", mode); // Resume Quiz
                    quizButton.setAttribute("disabled", true);
                    quizButton.textContent = "started";
                })
            break;
            case "done":
                quizButton.textContent = "Review Results"; // TODO: Localize
                quizButton.addEventListener("click", () => {
                    viewQuizResults({studentQuizFilename, quizID}); // View Results
                });
            break;
        }
    }else{

        const quizObjectRequired = {
            id: uniqueID(1),
            userID: globalUserID,	
            quizID,	
            fileToLoad: fromTeacherQuizFilename,
            fileToSave: `Quiz-${uniqueID(2)}.json`,
            courseID,
            hierarchy
        }

        


        quizButton.textContent = "Start Quiz"; // TODO: Localize
        quizButton.addEventListener("click", () => {
            startQuiz(quizObjectRequired, "new", mode); // New Quiz
            quizButton.setAttribute("disabled", true);
            quizButton.textContent = "started";
        });
    }
}

async function addNewQuizGradeRowInDatabase(quizGradeObject){

    let {
        id,
        userID,	
        quizID,	
        fileToSave,
        courseID,
        hierarchy
    } = quizGradeObject;

    let timeStarted = getCurrentTimeInJSONFormat();

    let params = `id=${id}&&userID=${userID}&&quizID=${quizID}`+
    `&&filename=${fileToSave}&&timeStarted=${timeStarted}&&status=started`
    + `&&courseID=${courseID}&&hierarchy=${hierarchy}`;

    let response = await AJAXCall({
        phpFilePath: "../include/quiz/addNewQuizGradeRow.php",
        rejectMessage: "Failed to create new quiz grade row",
        type: "post",
        params
    });

    

}