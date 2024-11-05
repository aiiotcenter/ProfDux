class Question {
  id;
  question;
  answerOptions;
  answer;
  type;
  inputAnswer;
  hardness;
  marksWorth;

  constructor(questionObject) {
    let { question, answerOptions, answer, type, hardness } = questionObject;

    this.id = uniqueID(1);
    this.question = question;
    this.answerOptions = answerOptions;
    this.answer = answer;
    this.type = type;
    this.hardness = hardness;
    this.marksWorth = questionObject.marksWorth ? questionObject.marksWorth : getMarksForQuestion(type);

    if (questionObject.inputAnswer != null)
      this.inputAnswer = questionObject.inputAnswer;
  }

  //TODO: refactor out this function ...
  renderAssessmentArea(...assessmentAreaElements) {
    let assessmentArea = document.querySelector(".question-area");
    assessmentArea.innerHTML = "";
    assessmentAreaElements.forEach((element) =>
      assessmentArea.appendChild(element)
    );
  }
}

class MultipleChoice extends Question {
  constructor(questionObject) {
    super(questionObject);
  }

  render(language) {
    let question = renderQuestion(this.question[language]);

    let answerOptionsList = document.createElement("div");
    answerOptionsList.className = "answer-options-list";

    let answerOptionMap = this.answerOptions[language].map((option, index) => {
      let answerOptionContainer = document.createElement("div");

      if (this.inputAnswer == this.answerOptions[language][index]) {
        answerOptionContainer.className = "answer-option-container active";
      } else {
        answerOptionContainer.className = "answer-option-container";
      }

      let letterOption = document.createElement("div");
      letterOption.className = "letter-option";
      letterOption.textContent = letters[index];

      let answerOption = document.createElement("div");
      answerOption.className = "answer-option";
      const safeAnswerOption = createLocalizedTextElement(option);
      answerOption.append(safeAnswerOption);

      answerOptionContainer.addEventListener("click", () => {
        disableOtherOptions();
        answerOptionContainer.className = "answer-option-container active";

        this.inputAnswer = option;
      });

      answerOptionContainer.appendChild(letterOption);
      answerOptionContainer.appendChild(answerOption);
      answerOptionsList.appendChild(answerOptionContainer);
      return answerOptionContainer;
    });

    function disableOtherOptions() {
      answerOptionMap.forEach(
        (option) => (option.className = "answer-option-container")
      );
    }

    super.renderAssessmentArea(question, answerOptionsList);
  }
}

class TrueAndFalse extends Question {
  constructor(questionObject) {
    super(questionObject);
  }

  render(language) {
    let question = renderQuestion(this.question[language]);

    let answerOptions = this.answerOptions[language] || [];

    let answerOptionsList = document.createElement("div");
    answerOptionsList.className = "tf-options-list";

    let answerOptionMap = answerOptions.map((option, index) => {
      let answerOptionContainer = document.createElement("div");
      answerOptionContainer.className = "tf-answer-option-container";

      let answerOption = document.createElement("div");
      const safeAnswerOption = createLocalizedTextElement(option);
      answerOption.append(safeAnswerOption);

      if (this.inputAnswer == answerOptions[index]) {
        answerOption.className = "button tf-answer-option active";
      } else {
        answerOption.className = "button tf-answer-option";
      }

      answerOption.addEventListener("click", () => {
        disableOtherOptions();
        answerOption.className = "button tf-answer-option active";
        this.inputAnswer = option;
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

    super.renderAssessmentArea(question, answerOptionsList);
  }
}

class FillInTheBlank extends Question {
  constructor(questionObject) {
    super(questionObject);

  }

  render(language) {
    let question = renderQuestion(this.question[language]);

    let blankTextContainer = document.createElement("div");
    blankTextContainer.className = "fitb-answer-option-container";

    // blankTextEditableField.setAttribute("contentEditable","true");

    let blankTextEditableField = document.createElement("input");
    blankTextEditableField.className = "fitb-answer-input";
    blankTextEditableField.placeholder = "Enter You Answer Here";

    if (this.inputAnswer) {
      blankTextEditableField.className = "fitb-answer-input active";
      blankTextEditableField.value = this.inputAnswer;
    }else{
      blankTextEditableField.value = "";
    }

    blankTextEditableField.addEventListener("input", () => {
      blankTextEditableField.className = "fitb-answer-input active";
      this.inputAnswer = blankTextEditableField.value;
    });

    blankTextContainer.appendChild(blankTextEditableField);

    super.renderAssessmentArea(question, blankTextContainer);
  }
}

async function markFITBQuestion(questionObject, language) {
  const { question, marksWorth, hardness: level, inputAnswer } = questionObject;

  const educationEnvironment = extrapolateEducationEnvironment();

  console.log("question: ", question[language]);

  let query =
    `
        Evaluate the following question and answer, and provide a fair score rounded to the nearest integer. For short answers (1-3 words), award partial marks if the response demonstrates relevant understanding, even if it’s not fully comprehensive and case insensitive.
            - Question: "${question[language]}"
            - Answer: "${inputAnswer}"
            - Maximum Marks: ${marksWorth}
            - Audience: ${educationEnvironment} students
            - Difficulty Level: ${level}

            Return only the score as a JSON object with a 'response' key, ` +
    `mark` +
    `, in the format: { "mark": <score> }. Ensure there are no nested objects or extra fields.
    `;


  // let unparsedJSONResponse = await generateGPTResponseFor(query);
  // console.log("result before marking: ", unparsedJSONResponse);
  // let result = await JSON.parse(unparsedJSONResponse);
  // console.log("result from marking: ", result);

  let result = await generateGPTResponseFor(query);
  console.log("marking: ", result);

  try {
    if (result.mark >= 0) return result.mark;
    else return 0;
  } catch (error) {
    console.log(error);
  }
}

function markTrueAndFalse(questionObject, language){

  const {marksWorth, inputAnswer, answer } = questionObject;
  if(inputAnswer == answer[language]) return Number(marksWorth);
  else return 0;

}

function markMultipleChoiceQuestion(questionObject, language){

  const {marksWorth, inputAnswer, answer } = questionObject;
  if(inputAnswer == answer[language]) return Number(marksWorth);
  else return 0;

}

async function mark(questions, language) {
  let result = 0;
  let totalMarks = 0;

  //TODO: Build a class out of the mark function to handle more complex
  //TODO: question types

  console.log("language: ", language);

  for await (const question of questions) {

    totalMarks += question.marksWorth;

    switch (question.type.toLowerCase()) {
      case "multiplechoicequestion":
        result += markMultipleChoiceQuestion(question, language);
        break;
      case "trueandfalsequestion":
        result += markTrueAndFalse(question, language);
        break;
      case "fillintheblankquestion":
        let a = await markFITBQuestion(question, language);
        console.log("result from marking: ", a);
        result += a;
        break;
      default:
        throw new Error(`Not Made Yet: ${question.type.toLowerCase()}`);
    }

    
  }

    console.log(`{ result: ${result}, totalMarks: ${totalMarks} }`);
  return { result, totalMarks };
}

// CHANGES FOR GENERATION

async function generateQuestion(generateQuestionObject, amount = 1) {
  const { type, languages, educationEnvironment, level, topics } =
    generateQuestionObject;

  console.log("generateQuestionObject: ", generateQuestionObject);

  const shortHandLanguages = getShortHandsFor(languages);

  console.log("shortHandLanguages: ", shortHandLanguages);

  // TODO: Mickey #1
  // Everything can be generated, but it will go through a validator
  // The validator may/will include
  // * Error Checkers
  // * Comparators ✅
  // * Matchers ✅
  // * Encoders/Decoders
  // * Loggers

  // TODO: Mickey #2
  // Make a ReGenerate () Function that will be able to regenerate the
  // results of just one question

  // TODO: Mickey #3 ++DONE
  // Create premade structure to fill in data and ensure integrity of
  // a json file. Invalid JSON files should be logged.

  // TODO: Mickey #4
  // Abstract long generations as classes and ensure all of them have
  // this new validation process.

  // TODO: Mickey #5
  // Document all findings.

  let query = `create for me in valid json format using ISO encoding, ${amount} questions with the keywords 'questions' in the ${languages
    .map((language) => `${language}`)
    .join("and ")} as well as their answers 
          in the ${languages
            .map((language) => `${language}`)
            .join(
              "and "
            )} with those exact key names in the topics of ${topics} 
          for ${educationEnvironment}. 
      
          The questions should be ${type} with its respective answer choices as well in the languages types ${languages
    .map((language) => `${language}`)
    .join("and ")}
          as well as the correct answer option in ${languages
            .map((language) => `${language}`)
            .join("and ")}.
      
          The questions should be ${level}.
      
          The json format should have the following keys, 
          "question, answerOptions, answer, type, hardness". 
      
          question, answerOptions and answer should all come with the ${languages
            .map((language) => `${language}`)
            .join("and ")}
      
          The answerOptions should only be available if the 
          question type is multiple choice or true and false.
      
          Do not add any invalid characters in the result please.`;

  let unparsedJSONResponse = await generateGPTResponseFor(query);
  let result = await JSON.parse(unparsedJSONResponse);

  try {
    if (result.questions) result = result.questions;
    else if (result.question) result = result.question;
    else if (result.questions.questions) result = result.questions.questions;
    else result = result;
  } catch (error) {
    console.log(error);
  }

  // FROM HERE WE ARE VALIDATING;

  return new Promise((resolve, reject) => {
    let conformedResults = [];

    if (result == null || result == undefined || result.length < 1) {
      reject("Failed");
    } else {
      result.forEach((questionObject) =>
        conformedResults.push(
          conformToStructure({
            questionObject,
            type,
            languages,
            shortHandLanguages,
          })
        )
      );
      resolve(conformedResults);
    }
  });
}

function conformToStructure({
  questionObject,
  type,
  languages,
  shortHandLanguages,
}) {
  switch (type) {
    case "MultipleChoiceQuestion":
      return validateMultipleChoiceQuestion({
        questionObject,
        languages,
        shortHandLanguages,
      });
    case "FillInTheBlankQuestion":
      return validateFillInTheBlankQuestion({
        questionObject,
        languages,
        shortHandLanguages,
      });
    case "TrueAndFalseQuestion":
      return validateTrueAndFalseQuestion({
        questionObject,
        languages,
        shortHandLanguages,
      });
    default:
      break;
  }

  function questionComparator(
    question,
    language,
    shortHandLanguages,
    index,
    conformedQuestion
  ) {
    if (question[language]) {
      if (question[language].length > 1) {
        conformedQuestion[language] = question[language];
      } else {
        /* regenerateQuestion() */
      }
    } else {
      if (question[shortHandLanguages[index]]) {
        if (question[shortHandLanguages[index]].length > 1) {
          conformedQuestion[language] = question[shortHandLanguages[index]];
        }
      }
      {
        /* regenerateQuestion() */
      }
    }
  }

  function answerComparator(
    answer,
    language,
    shortHandLanguages,
    index,
    conformedAnswer
  ) {
    console.log(`shortHands: `, shortHandLanguages);

    if (answer[language]) {
      if (answer[language].length > 1) {
        conformedAnswer[language] = answer[language];
      } else {
        /* regenerateAnswer */
      }
    } else {
      if (answer[shortHandLanguages[index]]) {
        if (answer[shortHandLanguages[index]].length > 1) {
          conformedAnswer[language] = answer[shortHandLanguages[index]];
        }
      }
      // regenerateAnswer()
    }
  }

  function validateMultipleChoiceQuestion({
    questionObject,
    languages,
    shortHandLanguages,
  }) {
    const question = questionObject.question || null;
    const answerOptions = questionObject.answerOptions || {};
    const answer = questionObject.answer || null;
    const hardness = questionObject.hardness || "unknown";

    let conformedQuestion = generateEmptyLanguageTemplateObject(
      languages,
      "...?"
    );
    let conformedAnswerOptions = generateEmptyLanguageTemplateObject(
      languages,
      ["A", "B", "C", "D"]
    );
    let conformedAnswer = generateEmptyLanguageTemplateObject(languages, "...");

    languages.forEach((_langugage, index) => {
      const language = _langugage.toLowerCase();

      questionComparator(
        question,
        language,
        shortHandLanguages,
        index,
        conformedQuestion
      );

      if (answerOptions[language]) {
        if (answerOptions[language].length > 1) {
          conformedAnswerOptions[language] = answerOptions[language];
        } else {
          {
            /* regenerateAnswerOptions() */
          }
        }
      } else {
        if (answerOptions[shortHandLanguages[index]]) {
          if (answerOptions[shortHandLanguages[index]].length > 1) {
            conformedAnswerOptions[language] =
              answerOptions[shortHandLanguages[index]];
          }
        }
        /* regenerateAnswerOptions() */
      }

      answerComparator(
        answer,
        language,
        shortHandLanguages,
        index,
        conformedAnswer
      );
    });

    return MultipleChoiceQuestionStructure({
      questionObject: conformedQuestion,
      answerOptionsObject: conformedAnswerOptions,
      correctAnswerObject: conformedAnswer,
      hardness,
    });
  }

  function validateFillInTheBlankQuestion({
    questionObject,
    languages,
    shortHandLanguages,
  }) {
    const question = questionObject.question || null;
    const answer = questionObject.answer || null;
    const hardness = questionObject.hardness || "unknown";

    let conformedQuestion = generateEmptyLanguageTemplateObject(
      languages,
      "...?"
    );
    let conformedAnswer = generateEmptyLanguageTemplateObject(languages, "...");

    languages.forEach((_langugage, index) => {
      const language = _langugage.toLowerCase();

      questionComparator(
        question,
        language,
        shortHandLanguages,
        index,
        conformedQuestion
      );

      answerComparator(
        answer,
        language,
        shortHandLanguages,
        index,
        conformedAnswer
      );
    });

    return FillInTheBlankQuestionStructure({
      questionObject: conformedQuestion,
      correctAnswerObject: conformedAnswer,
      hardness,
    });
  }

  function validateTrueAndFalseQuestion({
    questionObject,
    languages,
    shortHandLanguages,
  }) {
    const question = questionObject.question || null;
    const answer = questionObject.answer || null;
    const hardness = questionObject.hardness || "unknown";

    let conformedQuestion = generateEmptyLanguageTemplateObject(
      languages,
      "...?"
    );
    let conformedAnswerOptions =
      generateTrueAndFalseAnswerOptionsBasedOn(languages);
    let conformedAnswer = generateEmptyLanguageTemplateObject(languages, "...");

    languages.forEach((_langugage, index) => {
      const language = _langugage.toLowerCase();
      questionComparator(
        question,
        language,
        shortHandLanguages,
        index,
        conformedQuestion
      );
      answerComparator(
        answer,
        language,
        shortHandLanguages,
        index,
        conformedAnswer
      );
    });

    return TrueAndFalseQuestionStructure({
      questionObject: conformedQuestion,
      answerOptionsObject: conformedAnswerOptions,
      correctAnswerObject: conformedAnswer,
      hardness,
    });
  }
}

function generateEmptyLanguageTemplateObject(languages, emptiness) {
  let result = {};
  languages.forEach(
    (language) => (result = { ...result, [language]: emptiness })
  );
  return result;
}

function generateTrueAndFalseAnswerOptionsBasedOn(languages) {
  let answerOptionsDictionary = fetchTrueAndFalseAnswerOptionsDictionary();

  let answerOptions = {};

  languages.forEach((language) => {
    answerOptions[language] = [...answerOptionsDictionary[language]];
  });

  return answerOptions;
}

function MultipleChoiceQuestionStructure({
  questionObject,
  answerOptionsObject,
  correctAnswerObject,
  hardness,
}) {
  return {
    id: uniqueID(1),
    question: questionObject,
    answerOptions: answerOptionsObject,
    answer: correctAnswerObject,
    type: "MultipleChoiceQuestion",
    hardness,
    marksWorth: 1,
  };
}

function FillInTheBlankQuestionStructure({
  questionObject,
  correctAnswerObject,
  hardness,
}) {
  return {
    id: uniqueID(1),
    question: questionObject,
    answer: correctAnswerObject,
    type: "FillInTheBlankQuestion",
    hardness,
    marksWorth: 1,
  };
}

function TrueAndFalseQuestionStructure({
  questionObject,
  answerOptionsObject,
  correctAnswerObject,
  hardness,
}) {
  return {
    id: uniqueID(1),
    question: questionObject,
    answerOptions: answerOptionsObject,
    answer: correctAnswerObject,
    type: "TrueAndFalseQuestion",
    hardness,
    marksWorth: 1,
  };
}

function getShortHandsFor(languages) {
  const shortHandDictionary = fetchShortHandDictionary();

  let answerOptions = [];

  languages.forEach((language) =>
    answerOptions.push(shortHandDictionary[language])
  );

  return answerOptions;
}

class ReviewMultipleChoice extends Question {
  constructor(questionObject) {
    super(questionObject);
  }

  render(language) {
    let question = renderQuestion(this.question[language]);

    let answerOptionsList = document.createElement("div");
    answerOptionsList.className = "answer-options-list";

    this.answerOptions[language].forEach((option, index) => {
      let answerOptionContainer = document.createElement("div");

      if (this.inputAnswer == this.answerOptions[language][index]) {
        answerOptionContainer.className = "answer-option-container active";
      } else {
        answerOptionContainer.className = "answer-option-container";
      }

      let letterOption = document.createElement("div");
      letterOption.className = "letter-option";
      letterOption.textContent = letters[index];

      let answerOption = document.createElement("div");
      answerOption.className = "answer-option";
      const safeAnswerOption = createLocalizedTextElement(option);
      answerOption.append(safeAnswerOption);

      answerOptionContainer.appendChild(letterOption);
      answerOptionContainer.appendChild(answerOption);
      answerOptionsList.appendChild(answerOptionContainer);
      return answerOptionContainer;
    });

    super.renderAssessmentArea(question, answerOptionsList);
  }
}

function renderQuestion(questionText){
    const question = document.createElement("div");
    question.className = "question";
    const lockedQuestion = createLocalizedTextElement(questionText);
    question.append(lockedQuestion);
    return question;
}