class EditAssessment {

    filename
    minimumAssessmentNumber = 0;
    maximumAssessmentNumber = 0;
    currentAssessmentNumber = 0;
    questions = []
    nextButton
    previousButton
    saveButton
    type
    language
    assessmentType

    renderQuestionNumber(questionNumber){
        
        let questionNumberElement = document.querySelector(".question-header");
        questionNumberElement.innerHTML = "";
        let questionTextElement = createLocalizedTextElement("Question");
        let numberElement = document.createElement("div");
        numberElement.textContent = questionNumber + 1;
        questionNumberElement.appendChild(questionTextElement);
        questionNumberElement.appendChild(numberElement);

    }

    constructor(questions, type, filename, assessmentType, language="english"){

        this.filename = filename;
        this.questions = questions;
        this.maximumAssessmentNumber = questions.length - 1;
        this.type = type
        this.language = language
        this.assessmentType = assessmentType
        console.log("[1] filename: ", filename);
        
    }

    startEdittingAssessment(){
        this.renderQuestion();
    }

    // autoSave(){

    //     //TODO: Consider saving as sessionStorage?
    //     // or having a timer to save every 60 seconds
    //     this.saveAssessment();
    // }

    saveAssessment(){
        saveAssessmentAsJSON(this.filename, this.questions, this.assessmentType, this.type);

        this.nextButton.removeAttribute("disabled");
        this.previousButton.setAttribute("disabled", "true");
    }
    
    renderQuestion(){
        this.renderQuestionNumber(this.currentAssessmentNumber);
        this.questions[this.currentAssessmentNumber].render(this.language);
    }

    nextQuestion(){
        ++this.currentAssessmentNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    previousQuestion(){
        --this.currentAssessmentNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    setPreviousButton(button){
        this.previousButton = button;
        this.previousButton.addEventListener("click", () => {
            this.previousQuestion();
        })
    }

    setAssessmentLanguageChangerElement(element, callback){

        this.assessmentLanguageChangerElement = element;
        element.textContent = this.language;

        element.addEventListener("click", () => {
            openPopup(".language-changer-overlay");
        })

        const languageElements = document.querySelectorAll(".language-changer-overlay .language-changer-element");

        console.log("debug 1: ", languageElements);

        languageElements.forEach( languageElement => {

            console.log("hello");

            languageElement.addEventListener("click", () => {
                const language = languageElement.getAttribute("data-lang");
                this.language = language;
                element.textContent = this.language;
                this.changeLanguage();
                callback();
            })

        })
    }

    changeLanguage(){
        this.renderQuestion();
    }

    setNextButton(button){
        this.nextButton = button;
        this.nextButton.addEventListener("click", () => {
            this.nextQuestion();
        })
    }

    setSaveButton(button){
        this.saveButton = button;
        this.saveButton.addEventListener("click", () => {
            this.saveAssessment();
            closePopup(".edit-assessment-overlay");
        })
    }

    handleButtons(){

        // this.autoSave();

        if(this.currentAssessmentNumber == 0){
            this.nextButton.removeAttribute("disabled");
            this.previousButton.setAttribute("disabled", "true");
        }
        
        if(this.currentAssessmentNumber > 0 && this.currentAssessmentNumber <= this.maximumAssessmentNumber ){
            this.nextButton.removeAttribute("disabled");
            this.previousButton.removeAttribute("disabled");
        }
        
        if(this.currentAssessmentNumber == this.maximumAssessmentNumber ){
            this.nextButton.setAttribute("disabled","true");
        } 
    }
    
}

class EditMultipleChoice extends Question {

    constructor(questionObject, marksWorth = 1){
        // randomize answer options
        super(questionObject);
        this.marksWorth = marksWorth;
    }

    render(language){

        let question = document.createElement("div");
        question.setAttribute("contentEditable","true");
        question.className = "question editable";
        question.textContent = this.question[language];

        question.addEventListener("input", event => {
            this.question[language] = event.target.textContent;
            console.log("editted question");
        })

        let answerOptionsList = document.createElement("div");
        answerOptionsList.className = "answer-options-list";

        console.log("answerOptions: ", this.answerOptions['english'])
        console.log("answerOptions: ", this.answerOptions['turkish'])

        let answerOptionMap = this.answerOptions[language].map( ( option, index ) => {
            
            let answerOptionContainer = document.createElement("div");

            if(this.answer[language] == this.answerOptions[language][index]){
                answerOptionContainer.className = "answer-option-container active";
            }else{
                answerOptionContainer.className = "answer-option-container";
            }

            let letterOption = document.createElement("div");
            letterOption.className = "letter-option";
            letterOption.textContent = letters[index];
    
            let answerOption = document.createElement("div");
            answerOption.setAttribute("contentEditable","true");
            answerOption.className = "answer-option editable";
            answerOption.textContent = option;

            answerOption.addEventListener("input", event => {
                this.answerOptions[language][index] = event.target.textContent;
            })

            answerOptionContainer.addEventListener("click", () => {
                disableOtherOptions();
                this.answer[language] = this.answerOptions[language][index];
                console.log(this.answer[language], " == ", this.answerOptions[language][index]);
                answerOptionContainer.className = "answer-option-container active";

            });

            //TODO: have an option to select the correct answer, or show the
            // correct answer

            answerOptionContainer.appendChild(letterOption);
            answerOptionContainer.appendChild(answerOption);
            answerOptionsList.appendChild(answerOptionContainer);
            return answerOptionContainer;

        });

        function disableOtherOptions(){
            answerOptionMap.forEach( option => option.className = "answer-option-container")
        }

        super.renderAssessmentArea(question, answerOptionsList);
    }
}

class EditTrueAndFalse extends Question {

    constructor(questionObject, marksWorth = 1){
        super(questionObject);
        this.marksWorth = marksWorth;
    }

    render(language){

        let question = document.createElement("div");
        question.setAttribute("contentEditable","true");
        question.className = "question editable";
        question.textContent = this.question[language];

        question.addEventListener("input", event => {
            this.question[language] = event.target.textContent;
            console.log("editted question: ", this.question);
        })

        let answerOptions = this.answerOptions[language] || [];

        // There are bugs here. What if the teacher wants to edit???
        if(this.answerOptions[language].length == 0){
            switch(this.answer[language]){
                case "Yes":
                    answerOptions = ["Yes", "No"] //TODO: Match for other languages
                    break;
                case "True":
                    answerOptions = ["True", "False"]
                    break;
                case "False":
                    answerOptions = ["True", "False"]
                    break;
                case "No":
                answerOptions = ["Yes", "No"]
                break;
            }
        }

        let answerText = document.createElement("div");
        answerText.className = "question-header";
        answerText.textContent = "Correct Answer";

        let answerOptionsList = document.createElement("div");
        answerOptionsList.className = "tf-options-list";

        let answerOptionMap = answerOptions.map( ( option, index ) => {
            
            let answerOptionContainer = document.createElement("div");
            answerOptionContainer.className = "tf-answer-option-container";


            let answerOption = document.createElement("div");
            answerOption.textContent = option;

            if(this.answer[language] == answerOptions[index]){
                answerOption.className = "button tf-answer-option active";
            }else{
                answerOption.className = "button tf-answer-option";
            }
    

            answerOption.addEventListener("click", () => {

                disableOtherOptions();
                answerOption.className = "button tf-answer-option active";

                let temp = { ...this.answer };
                temp[language] = option;
                this.answer = temp;
                console.log("editted answer: ", this.answer);


            });

            answerOptionContainer.appendChild(answerOption);
            answerOptionsList.appendChild(answerOptionContainer);
            return answerOption;

        });

        function disableOtherOptions(){
            answerOptionMap.forEach( option => option.className = "button tf-answer-option")
        }

        super.renderAssessmentArea(question, answerText, answerOptionsList);
    }
}

class EditFillInTheBlank extends Question {

    constructor(questionObject, marksWorth = 1){
        super(questionObject);
        this.marksWorth = marksWorth;
    }

    render(language){

        let question = document.createElement("div");
        question.setAttribute("contentEditable","true");
        question.className = "question editable";
        question.textContent = this.question[language];

        question.addEventListener("input", event => {
            this.question[language] = event.target.textContent;
        })
    
        let blankTextContainer = document.createElement("div");
        blankTextContainer.className = "fitb-answer-option-container";


        let blankTextEditableField = document.createElement("input");
        blankTextEditableField.className = "fitb-answer-input";
        blankTextEditableField.placeholder = "Enter You Answer Here";

        if(this.answer[language]){
            blankTextEditableField.className = "fitb-answer-input active";
            blankTextEditableField.value = this.answer[language];
        }
    
        blankTextEditableField.addEventListener("input", () => {

            blankTextEditableField.className = "fitb-answer-input active";
            const temp = { ...this.answer };
            temp[language] = blankTextEditableField.value;
            this.answer = temp;

        });

        blankTextContainer.appendChild(blankTextEditableField);

        super.renderAssessmentArea(question, blankTextContainer);
    }
}


async function startEdittingAssessment(filename, assessmentType, type="teacher"){

    let correctPath = `../${assessmentType}/generated/${filename}`;
    console.log("correctPath:", correctPath);

    let assessmentFileResponse = await fetch(correctPath, {cache: "reload"});
    console.log("assessmentFileResponse:", assessmentFileResponse);

    let questions = await assessmentFileResponse.json();

    let questionsArray = questions.map( question =>
        questionEditMapSwitch(question)
    );

    let currentLanguage = extrapolateLanguage();
    let assessment = new EditAssessment(
        questionsArray, 
        type, 
        filename, 
        assessmentType,
        currentLanguage
    );

    let editAssessmentOverlay = document.querySelector(".edit-assessment-overlay");
    let previousButton = editAssessmentOverlay.querySelector(".previous-question");
    let nextButton = editAssessmentOverlay.querySelector(".next-question");
    let saveButton = editAssessmentOverlay.querySelector(".save-button");
    let languageChangerElement = editAssessmentOverlay.querySelector(".assessment-language-changer");

    previousButton = clearEventListenersFor(previousButton);
    nextButton = clearEventListenersFor(nextButton);
    saveButton = clearEventListenersFor(saveButton);
    languageChangerElement = clearEventListenersFor(languageChangerElement);

    assessment.setNextButton(nextButton);
    assessment.setPreviousButton(previousButton);
    assessment.setSaveButton(saveButton);
    assessment.setAssessmentLanguageChangerElement(languageChangerElement, () => closePopup('.language-changer-overlay'));

    assessment.startEdittingAssessment();
    openPopup('.edit-assessment-overlay');

}