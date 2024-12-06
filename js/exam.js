class ExamsView {
  constructor(metadata) {
    this.courseID = metadata.id;
  }

  setExamsListContainer(element) {
    
    this.examsListContainer = element;
  }

  setCreateExamButton(element) {
    this.createExamButton = element;
    this.createExamButton.addEventListener("click", () => {
      const metadata = {
        courseID: this.courseID,
        examName: `${getLocalizedName("exam")} ${this.currentExamCount + 1}`,
        hierarchy: this.currentExamCount + 1,
      };

      this.handleCreateExam(metadata);
    });
  }

  async render(pointer = this) {
    await pointer.getExamRows();

    if (pointer.examsObject.length > 0)
      pointer.examsListContainer.innerHTML = "";

    pointer.examsObject.forEach((rowObject) => {
      let row = pointer.createExamRow(rowObject);
      pointer.examsListContainer.append(row);
    });
  }

  async getExamRows() {
    return new Promise(async (resolve, reject) => {
      this.examsObject = await this.fetchExamsForEditor(this.courseID);
      this.currentExamCount = this.examsObject.length;
      resolve();
    });
  }

  createExamRow(rowObject) {
    const examRow = document.createElement("div");
    examRow.className = "exam-row";

    const examCount = document.createElement("div");
    examCount.className = "exam-count";

    const examName = document.createElement("div");
    examName.className = "exam-name";
    examName.textContent = rowObject.name;

    const examDate = document.createElement("div");
    examDate.className = "exam-date";
    examDate.textContent = `Generated On ${rowObject.dateGenerated}`;

    const examEditButton = document.createElement("div");
    examEditButton.className = "exam-edit-button edit-exam-button zoom-effect";
    examEditButton.innerHTML = `<img src="../assets/icons/fi/fi-rr-pencil.svg" alt="">`;

    examEditButton.addEventListener("click", () => {
      this.handleEditExam(rowObject);
    });

    const examDeleteButton = document.createElement("div");
    examDeleteButton.className =
      "exam-edit-button delete-exam-button zoom-effect";
    examDeleteButton.innerHTML = `<img src="../assets/icons/delete.png" alt="">`;
    examDeleteButton.addEventListener("click", () => {
      this.handleDeleteExam(rowObject);
    });

    examRow.append(examCount);
    examRow.append(examName);
    examRow.append(examDate);
    examRow.append(examEditButton);
    examRow.append(examDeleteButton);

    return examRow;
  }

  async handleDeleteExam(rowObject) {
    const { id } = rowObject;

    await AJAXCall({
      rejectMessage: "Exam Could Not Be Deleted",
      params: `id=${id}`,
      phpFilePath: "../include/delete/deleteExam.php",
      type: "post",
    });

    this.render();
  }

  async fetchExamsForEditor(id) {
    return await AJAXCall({
      rejectMessage: "Fetching Exams Failed",
      params: `id=${id}`,
      phpFilePath: "../include/exam/getExamsForEditor.php",
      type: "fetch",
    });
  }

  async handleEditExam(rowObject) {
    const { id } = rowObject;

    let currentLanguage = extrapolateLanguage();
    const assessmentType = "exam";
    const type = "teacher";

    let result = await AJAXCall({
      phpFilePath: "../include/exam/getExamDetails.php",
      rejectMessage: "Getting Exam Details Failed",
      type: "fetch",
      params: createParametersFrom({ id }),
    });

    let { filename } = result[0];

    let correctPath = `../exam/generated/${filename}`;
    let quizFileResponse = await fetch(correctPath, { cache: "reload" });
    let questions = await quizFileResponse.json();

    let questionsArray = questions.map((question) =>
      questionEditMapSwitch(question)
    );

    let assessment = new EditAssessment(
      questionsArray,
      type,
      filename,
      assessmentType,
      currentLanguage
    );

    openPopup(".edit-assessment-overlay");

    let editAssessmentOverlay = document.querySelector(
      ".edit-assessment-overlay"
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
  }

  handleCreateExam(metadata) {
    
    openPopup(".create-exam-overlay");
    const createExam = new CreateExam(metadata);
    const rootElement = document.querySelector(".create-exam-overlay");
    createExam.handleAttachElements(rootElement);
    createExam.setFinalCallback({ callback: this.render, callbackClass: this });
    createExam.serializeTopics();
  }
}

class CreateExam {
  totalQuestions = 0;
  currentTotal = 0;

  constructor(metadata) {
    this.courseID = metadata.courseID;
    this.examName = metadata.examName;
    this.hierarchy = metadata.hierarchy;
  }

  setFinalCallback(callbackObject) {
    this.callbackObject = callbackObject;
  }

  async serializeTopics() {
    // GET TOPICS
    let result = await AJAXCall({
      rejectMessage: "Failed To Get All Topics",
      phpFilePath: "../include/course/getAllTopics.php",
      params: `id=${this.courseID}`,
      type: "fetch",
    });

    

    let topics = [];

    result.forEach((lecture) => topics.push(lecture.title));

    this.topics = topics.join(", ");
    
  }

  handleAttachElements(rootElement) {
    this.rootElement = rootElement;
    this.createExamButton = this.rootElement.querySelector(
      ".create-exam-button"
    );
    this.examNameInput = this.rootElement.querySelector(".exam-name");
    this.examNameInput.value = this.examName;
    this.loader = this.rootElement.querySelector(".create-exam-loader");

    this.examNameInput.addEventListener("onchange", (event) => {
      this.examName = event.target.value;
      
    });

    this.createExamButton.addEventListener("click", async () => {
      const details = fetchInputDetailsFromCreateExamPopup();
      const moreDetails = {
        courseID: this.courseID,
        name: this.examName,
        hierarchy: this.hierarchy,
      };

      this.details = { ...details, ...moreDetails };
      await this.createExam(this.details);

      const { callback, callbackClass } = this.callbackObject;
      callback(callbackClass);
    });
  }

  updateLoader(amount, that) {
    
    

    that.currentTotal += amount;

    const loader = document.querySelector(".create-exam-loader");
    
    const barLoader = loader.querySelector(".bar-loader");
    
    const barLoaderCounter = loader.querySelector(".bar-loader-counter");

    barLoader.style.width = `${calculatePercentage(
      that.currentTotal,
      that.totalQuestions
    )}%`;
    barLoaderCounter.textContent = `${that.currentTotal} / ${that.totalQuestions}`;

    function calculatePercentage(a, b) {
      return (a / b) * 100;
    }
  }

  async createExam(examCreationDetails) {
    this.loader.style.display = "grid";

    const {
      multipleChoiceQuestions,
      fillInTheBlanks,
      trueAndFalse,
      examDuration,
      hardnessLevel,
      courseID,
      name,
      hierarchy,
      minutes,
    } = examCreationDetails;

    this.totalQuestions =
      Number(multipleChoiceQuestions) +
      Number(fillInTheBlanks) +
      Number(trueAndFalse);

    

    const languages = fetchGlobalAvailableLanguages();
    const educationEnvironment = extrapolateEducationEnvironment();
    const topics = this.topics;

    const mcqObject = {
      type: "MultipleChoiceQuestion",
      languages,
      educationEnvironment,
      topics,
      amount: multipleChoiceQuestions,
    };

    const fitbObject = {
      type: "FillInTheBlankQuestion",
      languages,
      educationEnvironment,
      topics,
      amount: fillInTheBlanks,
    };

    const tfObject = {
      type: "TrueAndFalseQuestion",
      languages,
      educationEnvironment,
      topics,
      amount: trueAndFalse,
    };

    let batchGenerators = [
      new BatchGenerator(mcqObject, {
        this: this,
        callback: this.updateLoader,
      }),
      new BatchGenerator(fitbObject, {
        this: this,
        callback: this.updateLoader,
      }),
      new BatchGenerator(tfObject, { this: this, callback: this.updateLoader }),
    ];

    let generatorResults = [];

    for await (const generators of batchGenerators) {
      generatorResults.push(...(await generators.start()));
    }

    

    let filename = `Exam-${uniqueID(2)}.json`;
    saveAssessmentAsJSON(filename, generatorResults, "exam", "generated");

    let examID = uniqueID(1);
    let dateGenerated = getCurrentTimeInJSONFormat();
    let totalMarks = generatorResults.length; //TODO: figure out the marks properly...

    const examObject = {
      courseID,
      id: examID,
      name,
      filename,
      minutes,
      dateGenerated,
      date: "",
      hierarchy,
      languages: languages.join(", "),
      totalQuestions: this.totalQuestions,
      totalMarks,
    };

    const params = createParametersFrom(examObject);

    let response = await AJAXCall({
      phpFilePath: "../include/exam/addNewExam.php",
      rejectMessage: "New Exam Failed To Add",
      params,
      type: "post",
    });

    

    return new Promise((resolve, _) => {
      this.rootElement.style.display = "none";
      this.loader.style.display = "none";
      resolve();
    });

    //TODO: reset UI
  }
}

function fetchInputDetailsFromCreateExamPopup() {
  const createExamPopup = document.querySelector(".create-exam-overlay");
  const multipleChoiceQuestions = createExamPopup.querySelector(
    ".multiple-choice-questions"
  ).value;
  const fillInTheBlanks = createExamPopup.querySelector(
    ".fill-in-the-blanks"
  ).value;
  const trueAndFalse = createExamPopup.querySelector(".true-and-false").value;
  const minutes = createExamPopup.querySelector(".exam-duration").value;
  const hardnessLevel = createExamPopup.querySelector(".hardness-level").value;

  return {
    multipleChoiceQuestions,
    fillInTheBlanks,
    trueAndFalse,
    minutes,
    hardnessLevel,
  };
}

async function editExam(courseObject) {
  openPopup(".edit-exam-container");

  const { id } = courseObject;

  const metadata = { id };

  const examsView = new ExamsView(metadata);
  examsView.setExamsListContainer(
    document.querySelector(".exam-grid-container")
  );
  examsView.setCreateExamButton(document.querySelector("#createNewExam"));
  examsView.render();
}

function getLocalizedName(word) {
  let currentLanguage = getCurrentLanguageFromLocalStorage();

  const dictionary = {
    exam: {
      en: "Exam",
      auto: "Exam",
      tr: "Sinav",
    },
  };

  return dictionary[word][currentLanguage];
}
