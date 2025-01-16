class EditAssessment {
    filename;
    minimumAssessmentNumber = 0;
    maximumAssessmentNumber = 0;
    currentAssessmentNumber = 0;
    questions = [];
    nextButton;
    previousButton;
    saveButton;
    type;
    language;
    assessmentType;

    renderQuestionNumber(questionNumber) {
        let questionNumberElement = document.querySelector(".question-header");
        questionNumberElement.innerHTML = "";
        let questionTextElement = createLocalizedTextElement("Question");
        let numberElement = document.createElement("div");
        numberElement.textContent = questionNumber + 1;
        questionNumberElement.appendChild(questionTextElement);
        questionNumberElement.appendChild(numberElement);
    }

    constructor(
        questions,
        type,
        filename,
        assessmentType,
        language = "english"
    ) {
        this.filename = filename;
        this.questions = questions;
        this.maximumAssessmentNumber = questions.length - 1;
        this.type = type;
        this.language = language;
        this.assessmentType = assessmentType;
        const result = document.querySelector(".edit-assessment-overlay");
        this.rootElement = result;
    }

    startEdittingAssessment() {
        this.renderQuestion();
    }

    // autoSave(){

    //     //TODO: Consider saving as sessionStorage?
    //     // or having a timer to save every 60 seconds
    //     this.saveAssessment();
    // }

    saveAssessment() {
        saveAssessmentAsJSON(
            this.filename,
            this.questions,
            this.assessmentType,
            this.type
        );

        this.nextButton.removeAttribute("disabled");
        this.previousButton.setAttribute("disabled", "true");
    }

    renderQuestion() {
        this.renderQuestionNumber(this.currentAssessmentNumber);
        this.questions[this.currentAssessmentNumber].render(this.language);
    }

    nextQuestion() {
        ++this.currentAssessmentNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    previousQuestion() {
        --this.currentAssessmentNumber;
        this.handleButtons();
        this.renderQuestion();
    }

    setPreviousButton(button) {
        this.previousButton = clearEventListenersFor(button);
        this.previousButton.addEventListener("click", () => {
            this.previousQuestion();
        });
    }

    setAssessmentLanguageChangerElement(element, callback) {
        this.assessmentLanguageChangerElement = element;
        element.textContent = this.language;

        element.addEventListener("click", () => {
            openPopup(".language-changer-overlay");
        });

        const languageElements = document.querySelectorAll(
            ".language-changer-overlay .language-changer-element"
        );

        languageElements.forEach((languageElement) => {
            languageElement.addEventListener("click", () => {
                const language = languageElement.getAttribute("data-lang");
                this.language = language;
                element.textContent = this.language;
                this.changeLanguage();
                callback();
            });
        });
    }

    changeLanguage() {
        this.renderQuestion();
    }

    setNextButton(button) {
        this.nextButton = clearEventListenersFor(button);
        this.nextButton.addEventListener("click", () => {
            this.nextQuestion();
        });
    }

    setSaveButton(button) {
        this.saveButton = clearEventListenersFor(button);
        this.saveButton.addEventListener("click", () => {
            this.saveAssessment();
            closePopup(".edit-assessment-overlay");
        });
    }

    handleButtons() {
        // this.autoSave();

        if (this.currentAssessmentNumber == 0) {
            this.nextButton.removeAttribute("disabled");
            this.previousButton.setAttribute("disabled", "true");
        }

        if (
            this.currentAssessmentNumber > 0 &&
            this.currentAssessmentNumber <= this.maximumAssessmentNumber
        ) {
            this.nextButton.removeAttribute("disabled");
            this.previousButton.removeAttribute("disabled");
        }

        if (this.currentAssessmentNumber == this.maximumAssessmentNumber) {
            this.nextButton.setAttribute("disabled", "true");
        }
    }
}

class EditMultipleChoice extends Question {
    constructor(questionObject, rootElement, marksWorth = 1) {
        // randomize answer options
        super(questionObject);
        this.marksWorth = marksWorth;
        this.rootElement = rootElement;
    }

    render(language) {
        let question = document.createElement("div");
        question.setAttribute("contentEditable", "true");
        question.className = "question editable";
        const lockedQuestion = createLocalizedTextElement(
            this.question[language]
        );
        question.append(lockedQuestion);

        question.addEventListener("input", (event) => {
            this.question[language] = event.target.textContent;
        });

        let answerOptionsList = document.createElement("div");
        answerOptionsList.className = "answer-options-list";

        let answerOptionMap = this.answerOptions[language].map(
            (option, index) => {
                let answerOptionContainer = document.createElement("div");

                if (
                    this.answer[language] == this.answerOptions[language][index]
                ) {
                    answerOptionContainer.className =
                        "answer-option-container active";
                } else {
                    answerOptionContainer.className = "answer-option-container";
                }

                let letterOption = document.createElement("div");
                letterOption.className = "letter-option";
                letterOption.textContent = letters[index];

                let answerOption = document.createElement("div");
                answerOption.setAttribute("contentEditable", "true");
                answerOption.className = "answer-option editable";
                const lockedAnswerOption = createLocalizedTextElement(option);
                answerOption.append(lockedAnswerOption);

                answerOption.addEventListener("input", (event) => {
                    this.answerOptions[language][index] =
                        event.target.textContent;
                });

                letterOption.addEventListener("click", () => {
                    disableOtherOptions();
                    this.answer[language] = this.answerOptions[language][index];
                    answerOptionContainer.className =
                        "answer-option-container active";
                });

                //TODO: have an option to select the correct answer, or show the
                // correct answer

                answerOptionContainer.appendChild(letterOption);
                answerOptionContainer.appendChild(answerOption);
                answerOptionsList.appendChild(answerOptionContainer);
                return answerOptionContainer;
            }
        );

        function disableOtherOptions() {
            answerOptionMap.forEach(
                (option) => (option.className = "answer-option-container")
            );
        }

        super.renderAssessmentArea(question, answerOptionsList);
    }
}

class EditTrueAndFalse extends Question {
    constructor(questionObject, rootElement, marksWorth = 1) {
        super(questionObject);
        this.marksWorth = marksWorth;
        this.rootElement = rootElement;
    }

    render(language) {
        let question = document.createElement("div");
        question.setAttribute("contentEditable", "true");
        question.className = "question editable";
        const lockedQuestion = createLocalizedTextElement(
            this.question[language]
        );
        question.append(lockedQuestion);

        question.addEventListener("input", (event) => {
            this.question[language] = event.target.textContent;
        });

        let answerOptions = this.answerOptions[language] || [];

        let answerText = document.createElement("div");
        answerText.className = "question-header";
        answerText.textContent = "Correct Answer";

        let answerOptionsList = document.createElement("div");
        answerOptionsList.className = "tf-options-list";

        let answerOptionMap = answerOptions.map((option, index) => {
            let answerOptionContainer = document.createElement("div");
            answerOptionContainer.className = "tf-answer-option-container";

            let answerOption = document.createElement("div");
            const lockedAnswerOption = createLocalizedTextElement(option);
            answerOption.append(lockedAnswerOption);

            if (this.answer[language] == answerOptions[index]) {
                answerOption.className = "button tf-answer-option active";
            } else {
                answerOption.className = "button tf-answer-option";
            }

            answerOption.addEventListener("click", () => {
                disableOtherOptions();
                answerOption.className = "button tf-answer-option active";

                let temp = { ...this.answer };
                temp[language] = option;
                this.answer = temp;
            });

            answerOptionContainer.appendChild(answerOption);
            answerOptionsList.appendChild(answerOptionContainer);
            return answerOption;
        });

        function disableOtherOptions() {
            answerOptionMap.forEach(
                (option) => (option.className = "button tf-answer-option")
            );
        }

        super.renderAssessmentArea(question, answerText, answerOptionsList);
    }
}

class EditFillInTheBlank extends Question {
    constructor(questionObject, rootElement, marksWorth = 1) {
        super(questionObject);
        this.marksWorth = marksWorth;
        this.rootElement = rootElement;
    }

    render(language) {
        let question = document.createElement("div");
        question.setAttribute("contentEditable", "true");
        question.className = "question editable";
        const lockedQuestion = createLocalizedTextElement(
            this.question[language]
        );
        question.append(lockedQuestion);

        question.addEventListener("input", (event) => {
            this.question[language] = event.target.textContent;
        });

        let blankTextContainer = document.createElement("div");
        blankTextContainer.className = "fitb-answer-option-container";

        let blankTextEditableField = document.createElement("input");
        blankTextEditableField.className = "fitb-answer-input";
        blankTextEditableField.placeholder = "Enter You Answer Here";

        if (this.answer[language]) {
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

async function startEdittingAssessment(
    filename,
    assessmentType,
    type = "teacher"
) {
    let correctPath = `../${assessmentType}/generated/${filename}`;

    let assessmentFileResponse = await fetch(correctPath, { cache: "reload" });

    let questions = await assessmentFileResponse.json();

    let editAssessmentOverlay = document.querySelector(
        ".edit-assessment-overlay"
    );

    let questionsArray = questions.map((question) =>
        questionEditMapSwitch(question, editAssessmentOverlay)
    );

    let currentLanguage = extrapolateLanguage();

    let assessment = new EditAssessment(
        questionsArray,
        type,
        filename,
        assessmentType,
        currentLanguage
    );

    let previousButton =
        editAssessmentOverlay.querySelector(".previous-question");
    let nextButton = editAssessmentOverlay.querySelector(".next-question");
    let saveButton = editAssessmentOverlay.querySelector(".save-button");
    let languageChangerElement = editAssessmentOverlay.querySelector(
        ".assessment-language-changer"
    );

    previousButton = clearEventListenersFor(previousButton);
    nextButton = clearEventListenersFor(nextButton);
    saveButton = clearEventListenersFor(saveButton);
    languageChangerElement = clearEventListenersFor(languageChangerElement);

    assessment.setNextButton(nextButton);
    assessment.setPreviousButton(previousButton);
    assessment.setSaveButton(saveButton);
    assessment.setAssessmentLanguageChangerElement(languageChangerElement, () =>
        closePopup(".language-changer-overlay")
    );

    assessment.startEdittingAssessment();
    openPopup(".edit-assessment-overlay");
}
