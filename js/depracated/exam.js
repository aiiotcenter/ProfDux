async function loadCoursesForExam(options = "id") {
  let courseViewContainer = document.querySelector(".course-view-container");
  let loader = courseViewContainer.querySelector(
    ".course-view-container-loader"
  );

  let noCoursesYetText = createLocalizedTextElement("No courses yet");
  let createCourseText = createLocalizedTextElement("Create Course");
  let errorText = createLocalizedTextElement("Something Went Wrong");

  let emptyView = createElement("div", "container-message");
  let largeMessage = createElement("div", "large-message");
  largeMessage.appendChild(noCoursesYetText);

  let createCourseButton = createElement("div", "button");
  createCourseButton.appendChild(createCourseText);
  createCourseButton.addEventListener("click", () => openCreateCourseOverlay());

  emptyView.appendChild(largeMessage);
  emptyView.appendChild(createCourseButton);

  let errorView = createElement("div", "container-message");
  largeMessage.innerHTML = "";
  largeMessage.appendChild(errorText);
  errorView.appendChild(largeMessage);

  /* STUDENT VIEW */
  let studentEmptyView = createElement("div", "container-message");
  let NoCoursesYet = createLocalizedTextElement("No Courses Yet");
  let studentlargeMessage = createElement("div", "large-message");
  studentlargeMessage.appendChild(NoCoursesYet);
  studentEmptyView.appendChild(studentlargeMessage);

  let myEmptyView = createElement("div", "container-message");
  let NoSelectedCoursesYet = createLocalizedTextElement(
    "You haven't chosen any courses yet"
  );
  let myLargeMessage = createElement("div", "large-message");
  myLargeMessage.appendChild(NoSelectedCoursesYet);
  myEmptyView.appendChild(myLargeMessage);

  return new Promise(async (resolve, reject) => {
    let { id: userID } = await getGlobalDetails();

    try {
      const params = `id=${userID}`;

      let phpFilePath;

      switch (options) {
        case "id":
          phpFilePath = "../include/course/getCourses.php";
          break;
        case "all":
          phpFilePath = "../include/course/getAllCourses.php";
          break;
        case "mine":
          phpFilePath = "../include/course/getMyCourses.php";
          break;
      }

      const result = await AJAXCall({
        phpFilePath,
        rejectMessage: "Getting Courses Failed",
        params,
        type: "fetch",
      });

      setTimeout(() => {

        if (result && result.length > 0) {

          loadCoursesUIForExam(result, options, userID);
          resolve();
        } else {
          //TODO: This part might cause bugs in future versions
          courseViewContainer.innerHTML = "";

          switch (options) {
            case "id": // Refactor this to be "teacher"
              courseViewContainer.appendChild(emptyView);
              break;
            case "all": // Refactor this to be "student subscriptions"
              courseViewContainer.appendChild(studentEmptyView);
            case "mine": // Refactor this to be "mine -- or -- classview"
              courseViewContainer.appendChild(myEmptyView);
          }
        }
      }, 2000);
    } catch (error) {}
  });

  function loadCoursesUIForExam(coursesObject, options, userID) {
    courseViewContainer.innerHTML = "";

    coursesObject.map(async (course) => {
      const { id, title, image, courseCode } = course;

      let courseCard = createElement("div", "course-card");

      let courseCardImage = createElement("div", "course-card-image");
      let imageElement = document.createElement("img");

      imageElement.src =
        image.length > 2
          ? await checkImage(`../uploads/${image}`)
          : `../assets/images/courseDefault.jpg`;

      courseCardImage.appendChild(imageElement);

      let cardText = createElement("div", "card-text");
      let courseCardCode = createElement("div", "course-card-code");
      let courseCardTitle = createElement("div", "course-card-title");

      courseCardCode.textContent = courseCode;
      courseCardTitle.textContent = title;

      cardText.appendChild(courseCardCode);
      cardText.appendChild(courseCardTitle);

      let cardOverlay = createElement("div", "card-overlay");

      courseCard.appendChild(courseCardImage);
      courseCard.appendChild(cardText);
      courseCard.appendChild(cardOverlay);

      let subscriptionResult = await getCourseSubscriptionStatus(id, userID);

      courseCard.addEventListener("click", () => {
        switch (options) {
          case "id":
            goToExams(id);
            break;
          case "all":
            // TODO: Using Subscriptions, toggle different popups.
            subscriptionEvent(subscriptionResult, { id, userID })();
            break;
          case "mine":
            goToCourse(id);
            break;
        }
      });

      // This is the subscription part for the student view.
      let subscriptionIcon = document.createElement("div");
      subscriptionIcon.className = "subscription-icon";
      let tickImageElement = document.createElement("img");
      tickImageElement.src = "../assets/icons/check.png";
      subscriptionIcon.appendChild(tickImageElement);

      try {
        if (subscriptionResult[0].status == "true") {
          //   courseCard.appendChild(subscriptionIcon);
        }
      } catch (error) {}
      // ENDS HERE

      courseViewContainer.appendChild(courseCard);
    });

    function subscriptionEvent(subscriptionArray, { id, userID }) {
      try {
        if (subscriptionArray.length > 0) {
          let status = subscriptionArray[0];
          console.log("status: ", status);
          if (status.status == "true")
            return () => showDeRegisterPopup(id, userID);
          // else return showDeRegisterPopup;
        } else return () => showRegisterPopup(id, userID);
      } catch (error) {}
    }

    function showDeRegisterPopup(courseID, userID) {
      console.log(
        "Course has been registered, click will bring up de registration option"
      );
    }

    function showRegisterPopup(courseID, userID) {
      let enrollButton = document.querySelector(".enroll-course-button");
      enrollButton.setAttribute("data-courseID", courseID);
      enrollButton.setAttribute("data-userID", userID);

      openPopup(".register-to-course");

      console.log("Course has not been registered");
    }
  }

  async function getCourseSubscriptionStatus(id, userID) {
    return await AJAXCall({
      phpFilePath: "../include/course/getSubscriptionStatus.php",
      rejectMessage: "Getting Status Failed",
      params: `id=${id}&&userID=${userID}`,
      type: "fetch",
    });
  }

  function goToCourse(id) {
    openPopup(".classroom-inner-overlay");
    let classRoomOverlay = document.querySelector(".classroom-inner-overlay");
    classRoomOverlay.setAttribute("id", id);
    renderCourseOutline(id);
  }
}

function goToExams(id) {
  let mainContainer = document.querySelector(".main-container");
  mainContainer.setAttribute("data-id", id);

  closePopup(".course-view-container");

  let popup = document.querySelector(".edit-course-container");
  popup.style.display = "flex";
  fetchAllExam(id);

  // fetchCourseWithIDForExam(id);
}

async function fetchCourseWithIDForExam(givenID) {
  let courseGridContainer = findElement(".course-view-container");
  let loader = `
      <div class="loader">
          <div class="sk-chase">
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
              <div class="sk-chase-dot"></div>
          </div>
      </div>`;

  courseGridContainer.innerHTML = loader;

  let courses = await getCourseDetails(givenID);

  if (courses.length > 0) if (courses[0].status == "error") return;

  let selectedCourse = courses[0];

  (function sortCourses(course) {
    course.lectures.sort((firstLecture, secondLecture) => {
      firstLecture.subtopics.sort(
        (firstSubtopic, secondSubtopic) =>
          firstSubtopic.hierarchy - secondSubtopic.hierarchy
      );

      return firstLecture.hierarchy - secondLecture.hierarchy;
    });
  })(selectedCourse);

  setTimeout(() => {
    let course = new Course(selectedCourse);
    course.renderTitle();
    course.renderCourseCode();
    course.renderDeleteButton(deleteButton);
    course.renderEditLearningObjectivesButton();
    course.renderLectureSection();

    findElement("#addNewLecture").addEventListener("click", () => {
      course.addLectureElement();
    });

    findElement("#saveCourseDetails").addEventListener("click", async () => {
      courseItemObjectLooper(course);
    });

    findElement("#excelCourseFileUpload").addEventListener(
      "change",
      async (event) => {
        try {
          let file = event.target.files[0];
          const objectURL = window.URL.createObjectURL(file);
          let result = await parseExcelForCourseObject(objectURL);
          course.markAllForDeletion();
          course.eraseForExcelUpload(result);
          findElement("#excelCourseFileUpload").value = "";
        } catch (error) {
          console.log(error);
        }
      }
    );
  }, 2000);
}

function openExamModalTeacher() {
  var modal = document.getElementById("exam-modal");
  modal.style.display = "block";
}

function closeExamModalTeacher() {
  var modal = document.getElementById("exam-modal");
  modal.style.display = "none";
}

async function openExamModal(exam) {
  let examGradeID = uniqueID(1);

  let examID = exam.id;

  let { id: globalUserID } = await globalUserDetails;

  let timeStarted = Date.now();

  let status = "Started";

  await AJAXCall({
    phpFilePath: "../include/exam/addNewExamGrade.php",
    rejectMessage: "Add New Exam Grade file failed",
    params: `id=${examGradeID}&&userID=${globalUserID}&&examID=${examID}&&status=${status}&&timeStarted=${timeStarted}`,
    type: "post",
  });

  var modal = document.getElementById("exam-modal");
  modal.style.display = "block";

  const result = await AJAXCall({
    phpFilePath: "../include/readJSONData.php",
    rejectMessage: "read json file failed",
    params: `filepath=../exam/generated/${exam.filename}`,
    type: "post",
  });

  const questions = JSON.parse(result);

  let questionsAsString = "";
  const studentExamModalContent = document.getElementById(
    "student-exam-modal-content"
  );

  studentExamModalContent.setAttribute("examGradeID", examGradeID);

  studentExamModalContent.innerHTML = "";

  for (let i = 0; i < questions.length; i++) {
    questionsAsString += `
    <div class="exam-question">
    <h4 class="exam-question-title">Question ${i + 1}</h4>
    <p style="margin-top:10px"> ${questions[i].question}</p>
    `;
    if (questions[i].answerOptions) {
      if (questions[i].answerOptions.length === 4) {
        questionsAsString += `
        <div>
        
        
      
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px" >
        <p> A) ${questions[i].answerOptions[0]}</p>
        <p> B) ${questions[i].answerOptions[1]}</p>
        <p> C) ${questions[i].answerOptions[2]}</p>
        <p> D) ${questions[i].answerOptions[3]}</p>
        </div>
        <input type="text" required class="student-question-answer" placeholder="Enter answer here" />
        </div>
        `;
      } else {
        questionsAsString += `
            <div>
            <div style="display:flex;justify-content:flex-start;align-items:center;margin-top:10px" >
            <p> A) ${questions[i].answerOptions[0]}</p>
            <p style="margin-left:30px"> B) ${questions[i].answerOptions[1]}</p>
            </div>
            <input type="text" required class="student-question-answer" placeholder="Enter answer here" />
            </div>
           `;
      }
    } else {
      questionsAsString += `
      <div>
      <input type="text" required class="student-question-answer" placeholder="Enter answer here" />
      </div>
     `;
    }

    questionsAsString += `</div>`;
  }

  const defaultModal = `<span id="student-exam-modal-close" class="student-exam-modal-close" onclick="closeExamModal()">&times;</span>
<h3>Remained Exam <strong>${exam.minutes}</strong>  Minutes</h3>
<h3 class="exam-modal-title">Please solve your exam!</h3>
<div class="student-exam-modal-container" style="margin-top:10px;">
  
    ${questionsAsString}

    <div style="display:flex;justify-content:center;align-items:center;cursor:pointer">
        <button class="exam-modal-generate-button" style="cursor:pointer" >Send</button>
    </div>`;

  studentExamModalContent.innerHTML = defaultModal;
}

async function saveExamGrade(e) {
  e.preventDefault();
  let filename = `Exam-Grade-${uniqueID(2)}.json`;

  const answersOfQuestions = document.getElementsByClassName(
    "student-question-answer"
  );

  let answerJSON = [];
  for (let i = 0; i < answersOfQuestions.length; i++) {
    answerJSON.push({
      question: i + 1,
      answer: answersOfQuestions[i].value,
    });
  }

  let JSONString = JSON.stringify(answerJSON);

  let correctPath = `../exam/grades/${filename}`;

  await AJAXCall({
    phpFilePath: "../include/saveJSONData.php",
    rejectMessage: "saving json file failed",
    params: `filepath=${correctPath}&&jsonString=${JSONString}`,
    type: "post",
  });

  const studentExamModalContent = document.getElementById(
    "student-exam-modal-content"
  );

  let examGradeID = studentExamModalContent.getAttribute("examGradeID");

  let timeEnded = Date.now();
  let status = "Done";

  // TODO: We have to this mark situation
  let value = "3";

  let resultOfSaveExam = await AJAXCall({
    phpFilePath: "../include/exam/updateNewExamGrade.php",
    rejectMessage: "Update New Exam Grade file failed",
    params: `id=${examGradeID}&&filename=${filename}&&status=${status}&&value=${value}&&timeEnded=${timeEnded}`,
    type: "post",
  });

  animateDialog("You successfully send your exam");

  var modal = document.getElementById("exam-modal");
  modal.style.display = "none";
}

function closeExamModal() {
  let options = {
    title: "Are You Sure You Want To Leave Exam?",
    denyTitle: "No",
    acceptTitle: "Yes",
  };

  showOptionsDialog(options, async () => {
    var modal = document.getElementById("exam-modal");
    modal.style.display = "none";

    const studentExamModalContent = document.getElementById(
      "student-exam-modal-content"
    );

    let examGradeID = studentExamModalContent.getAttribute("examGradeID");

    let timeEnded = Date.now();
    let status = "Exam Failed";

    let filename = "";

    let value = "0";

    await AJAXCall({
      phpFilePath: "../include/exam/updateNewExamGrade.php",
      rejectMessage: "Update New Exam Grade file failed",
      params: `id=${examGradeID}&&filename=${filename}&&status=${status}&&value=${value}&&timeEnded=${timeEnded}`,
      type: "post",
    });
  });
}

async function generateExam(e) {
  e.preventDefault();

  const trueFalse = document.getElementById("exam-true-false-input");
  const examName = document.getElementById("exam-name-input");
  const multipleChoices = document.getElementById(
    "exam-multiple-choices-input"
  );
  const matching = document.getElementById("exam-matching-input");
  const fillInBlank = document.getElementById("exam-fill-in-blank-input");
  const examMinutes = document.getElementById("exam-minutes-input");
  const examDate = document.getElementById("exam-date-input");
  let mainContainer = document.querySelector(".main-container");
  const courseID = mainContainer.getAttribute("data-id");

  const easyInput = document.getElementById("exam-easy-input");
  const mediumInput = document.getElementById("exam-medium-input");
  const hardInput = document.getElementById("exam-hard-input");

  let loader = loadLoader("Generating Exam");

  const result = await getCourseDetails(courseID);

  let subtopicTitles = [];

  result.forEach((course) => {
    course.lectures.forEach((lecture) => {
      lecture.subtopics.forEach((subtopic) => {
        subtopicTitles.push(subtopic.title);
      });
    });
  });

  const subtopicString = subtopicTitles.join(", ");

  const resultOfCourse = await AJAXCall({
    phpFilePath: "../include/course/getSingleCourse.php",
    rejectMessage: "Course Failed To Get",
    params: `id=${courseID}`,
    type: "post",
  });

  const resultOfCourseAsArray = JSON.parse(resultOfCourse);

  let language = resultOfCourseAsArray[0].language; //TODO: Toggle option.
  let topic = subtopicString;
  let educationEnvironment = "college students";

  //TODO: question count is going to 9 and not the intended maximum
  let multipleChoiceCount = multipleChoices.value; //10
  let fillInTheBlankCount = fillInBlank.value; //2
  let trueAndFalseCount = trueFalse.value; //5
  let matchingCount = matching.value; //5

  //TODO: figure out logic
  let hardQuestionsCount = hardInput.value;
  let mediumQuestionsCount = mediumInput.value;
  let easyQuestionsCount = easyInput.value;

  let query = `
Create a series of questions in valid JSON format using ISO encoding. 
Both the questions and their answers should be written in ${language}. 
The topics should focus on ${topic} and be suitable for ${educationEnvironment}.

The series should include:
- ${multipleChoiceCount} multiple-choice questions, each with at least 4 answer options. Note: The answer options should not have letters at the beginning.
- ${matchingCount} matching questions.
- ${fillInTheBlankCount} fill-in-the-blank questions.
- ${trueAndFalseCount} true/false questions with answer options.

Regarding difficulty:
- ${hardQuestionsCount} questions should be hard.
- ${mediumQuestionsCount} questions should be of medium difficulty.
- ${easyQuestionsCount} questions should be easy.

Each question in the JSON format must include the following keys:
- "question": The text of the question.
- "answerOptions": Available answer choices (only for multiple choice or true/false questions).
- "answer": The correct answer to the question.
- "type": The type of the question (multiple choice, matching, fill-in-the-blank, or true/false).
- "hardness": The difficulty level (hard, medium, or easy).

Ensure there are no invalid characters in the result.`;


  let unparsedJSONResponse = await generateGPTResponseFor(query);
  let questions = await JSON.parse(unparsedJSONResponse);
  console.log("questions amount: ", questions.questions.length);

  let filename = `Exam-${uniqueID(2)}.json`;
  saveExamAsJSON(filename, questions.questions, "generated");

  let examID = uniqueID(1);
  let dateGenerated = getCurrentTimeInJSONFormat();

  let examFileID = uniqueID(1);

  await AJAXCall({
    phpFilePath: "../include/exam/addNewFile.php",
    rejectMessage: "New File Failed To Add",
    params: `id=${examFileID}&&filename=${filename}&&dateGenerated=${dateGenerated}&&examID=${examID}&&language=${language}`,
    type: "post",
  });

  let params =
    `id=${examID}&&courseID=${courseID}&&examName=${examName.value}` +
    `&&dateGenerated=${dateGenerated}&&filename=${filename}&&fileID=${examFileID}&&minutes=${examMinutes.value}&&examDate=${examDate.value}&&amountOfTrueFalseQuestions=${trueAndFalseCount}&&amountOfMultipleChoicesQuestions=${multipleChoiceCount}&&amountOfMatchingQuestions=${matchingCount}&&amountOfFillInTheBlankQuestions=${fillInTheBlankCount}&&hardQuestionsCount=${hardQuestionsCount}&&mediumQuestionsCount=${mediumQuestionsCount}&&easyQuestionsCount=${easyQuestionsCount}&&courseCode=${result[0].courseCode}`;

  let response = await AJAXCall({
    phpFilePath: "../include/exam/addNewExam.php",
    rejectMessage: "New Exam Failed To Add",
    params,
    type: "post",
  });

  console.log("exam generation response: ", response);

  fetchAllExam(courseID);

  setTimeout(() => {
    closeExamModalTeacher();
    removeLoader(loader);
  }, 2000);
}

async function saveExamAsJSON(filename, ArrayContainingObjects, type) {
  let JSONString = JSON.stringify(ArrayContainingObjects);

  let correctPath;

  switch (type) {
    case "student":
    case "new":
    case "resume":
      correctPath = `../exam/taken/${filename}`;
      break;
    case "teacher":
    case "generated":
      correctPath = `../exam/generated/${filename}`;
      break;
  }

  try {
    let result = await AJAXCall({
      phpFilePath: "../include/saveJSONData.php",
      rejectMessage: "saving json file failed",
      params: `filepath=${correctPath}&&jsonString=${JSONString}`,
      type: "post",
    });

  } catch (error) {
    //TODO: bubbleUpError()
    console.log(error);
  }
}

async function deleteExamAsJSON(filename, type) {
  let correctPath;

  switch (type) {
    case "student":
    case "new":
    case "resume":
      correctPath = `../exam/taken/${filename}`;
      break;
    case "teacher":
    case "generated":
      correctPath = `../exam/generated/${filename}`;
      break;
  }

  try {
    let result = await AJAXCall({
      phpFilePath: "../include/deleteJSONData.php",
      rejectMessage: "deleting json file failed",
      params: `filepath=${correctPath}`,
      type: "post",
    });

  } catch (error) {
    //TODO: bubbleUpError()
    console.log(error);
  }
}

async function fetchAllExam(id) {
  const examResponse = await AJAXCall({
    phpFilePath: "../include/exam/getAllExam.php",
    rejectMessage: "Get All Exam Failed To Be Fetched",
    params: `courseID=${id}`,
    type: "fetch",
  });

  const examsContainer = document.getElementById("exams-container");
  examsContainer.innerHTML = "";

  const teacherBackIcon = document.getElementById("teacher-back-icon");
  teacherBackIcon.onclick = () => {
    openPopup(".course-view-container");
    closeEditCourseContainer();
  };

  for (let i = 0; i < examResponse.length; i++) {
    const newDiv = document.createElement("div");
    const newFirstP = document.createElement("p");
    const newSecondP = document.createElement("p");
    const newThirdP = document.createElement("p");

    newDiv.className = "exam-item";
    newDiv.style.paddingBottom = "0px";
    newDiv.style.paddingTop = "0px";

    newFirstP.innerHTML = examResponse[i].examName;
    newFirstP.onclick = () => goToExamDetails(examResponse[i].id);
    newFirstP.style.width = "100%";
    newFirstP.style.height = "100%";
    newFirstP.style.paddingBottom = "20px";
    newFirstP.style.paddingTop = "20px";

    newSecondP.innerHTML = examResponse[i].examDate;
    newSecondP.onclick = () => goToExamDetails(examResponse[i].id);
    newSecondP.style.width = "100%";
    newSecondP.style.height = "100%";
    newSecondP.style.paddingBottom = "20px";
    newSecondP.style.paddingTop = "20px";

    newThirdP.innerHTML = "&times;";
    newThirdP.style.fontSize = "25px";
    newThirdP.onclick = () => deleteExam(examResponse[i].id);

    newDiv.appendChild(newFirstP);
    newDiv.appendChild(newSecondP);
    newDiv.appendChild(newThirdP);
    examsContainer.appendChild(newDiv);
  }

  if (examResponse.length === 0) {
    const newDiv = document.createElement("div");
    newDiv.className = "exam-item";
    newDiv.style = "display:flex; justify-content:center;align-items:center;";

    const newFirstP = document.createElement("p");

    newFirstP.innerHTML = "You did not create any exam!";
    newDiv.appendChild(newFirstP);
    examsContainer.appendChild(newDiv);
  }

  const teacherExamAddButton = document.getElementById(
    "teacher-exam-add-button"
  );
  
  teacherExamAddButton.innerHTML = `
  <button class="teacher-exam-add-button" onclick="openExamModalTeacher()">
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
  <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
  </svg>
  </button>
  `;
}

async function getAllCoursesOfStudent() {
  let { id: globalUserID } = await getUserDetails();

  const subscriptions = await AJAXCall({
    phpFilePath: "../include/exam/getAllSubscriptions.php",
    rejectMessage: "Get All Subscriptions Failed To Be Fetched",
    params: `userID=${globalUserID}`,
    type: "fetch",
  });

  const exams = [];

  for (let i = 0; i < subscriptions.length; i++) {
    const exam = await AJAXCall({
      phpFilePath: "../include/exam/getAllExamByCourseID.php",
      rejectMessage: "Get My Exams Failed To Be Fetched",
      params: `courseID=${subscriptions[i].courseID}`,
      type: "fetch",
    });

    exams.push(...exam);
  }

  const studentExamContainer = document.getElementById(
    "student-exam-container"
  );

  studentExamContainer.innerHTML = "";

  for (let i = 0; i < exams.length; i++) {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("course-card");
    mainDiv.onclick = () => openExamModal(exams[i]);

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("course-card-image");
    const img = document.createElement("img");
    img.src = "../assets/images/courseDefault.jpg";
    imgDiv.appendChild(img);

    const cardTextDiv = document.createElement("div");
    cardTextDiv.classList.add("card-text");

    const courseCodeDiv = document.createElement("div");
    courseCodeDiv.classList.add("course-card-code");
    courseCodeDiv.textContent = exams[i].courseCode;

    const examNameDiv = document.createElement("div");
    examNameDiv.classList.add("course-card-title");
    examNameDiv.textContent = exams[i].examName;

    const examDateDiv = document.createElement("div");
    examDateDiv.classList.add("course-card-title");
    examDateDiv.textContent = exams[i].examDate;

    cardTextDiv.appendChild(courseCodeDiv);
    cardTextDiv.appendChild(examNameDiv);
    cardTextDiv.appendChild(examDateDiv);

    const cardOverlayDiv = document.createElement("div");
    cardOverlayDiv.classList.add("card-overlay");

    mainDiv.appendChild(imgDiv);
    mainDiv.appendChild(cardTextDiv);
    mainDiv.appendChild(cardOverlayDiv);

    studentExamContainer.appendChild(mainDiv);
  }
}

async function goToExamDetails(examID) {
  let mainContainer = document.querySelector(".main-container");
  const id = mainContainer.getAttribute("data-id");

  const resultOfCourse = await AJAXCall({
    phpFilePath: "../include/course/getSingleCourse.php",
    rejectMessage: "Course Failed To Get",
    params: `id=${id}`,
    type: "post",
  });

  const resultOfCourseAsArray = JSON.parse(resultOfCourse);

  closePopup(".course-view-container");

  let popup = document.querySelector(".edit-course-container");
  popup.style.display = "flex";

  const examsContainer = document.getElementById("exams-container");
  examsContainer.innerHTML = "";

  const teacherExamAddButton = document.getElementById(
    "teacher-exam-add-button"
  );
  teacherExamAddButton.innerHTML = "";

  const teacherBackIcon = document.getElementById("teacher-back-icon");
  teacherBackIcon.onclick = () => {
    fetchAllExam(id);
  };

  const result = await AJAXCall({
    phpFilePath: "../include/exam/getAllFiles.php",
    rejectMessage: "File Failed To Get",
    params: `examID=${examID}`,
    type: "post",
  });

  const resultAsArray = JSON.parse(result);

  let firstBoxOfLanguages = await generateCurrentFilesOfExam(
    resultAsArray,
    resultOfCourseAsArray
  );

  let isLanguageString = "";
  if (resultOfCourseAsArray[0].isLanguage === "true") {
    isLanguageString = `
    <h4  style="margin-bottom:40px; color: #6f2036;font-weight:600;font-size:17px">
    This course is a Language Course. You cannot translate exam.
    </h4>`;
  } else {
    isLanguageString = `
    <form data-exam-id="${examID}" id="create-file-for-language" style="display:flex; justify-content:center;align-items:center;flex-direction:column; margin-bottom:40px" onsubmit="convertFileToSelectedLanguage(event)" >
  <h4  style="  color: #6f2036;font-weight:600;font-size:17px">
  Choose which language you want to create from which file
  </h4>
  <div style="display:flex; justify-content:center;align-items:center;flex-direction:row; margin-top:20px;" >
  <div>
  <select name="languages" default-value="turkish" id="languages-to" class="exam-item" style="margin:0px;padding:10px" >
    <option value="turkish">Turkish</option>
    <option value="english">English</option>
    <option value="russian">Russian</option>
    <option value="ukrainian">Ukrainian</option>
  </select>
  </div>

  <div style="margin-left:10px;">
  <img style="margin-bottom:-3px" class="icon" src="../assets/icons/fi/fi-rr-arrow-alt-left.svg" alt="">
  </div>

  <div style="margin-left:10px">
  <select name="languages" id="languages-from" default-value="turkish" class="exam-item" style="margin:0px;padding:10px" >
   <option value="${resultOfCourseAsArray[0].language}">${
      resultOfCourseAsArray[0].language.charAt(0).toUpperCase() +
      resultOfCourseAsArray[0].language.slice(1)
    }</option>
  </select>
  </div>
  </div>

  <button class="exam-modal-generate-button" style="width:120px; padding: 15px 10px; cursor:pointer" type="submit" > Convert </button>

  </form>
    `;
  }

  examsContainer.innerHTML = `
  <div style="display:flex; justify-content:center;align-items:center;flex-direction:column" >
  ${isLanguageString}

  <div style="width:100%" id="current-files-of-exam">
    ${firstBoxOfLanguages}
  </div>
  </div>
  `;
}

async function generateCurrentFilesOfExam(
  resultAsArray,
  resultOfCourseAsArray
) {
  let firstBoxOfLanguages = "";

  for (let i = 0; i < resultAsArray.length; i++) {
    firstBoxOfLanguages += `<div class="exam-item" style="padding: 0px 20px; "  >
    <p style="width:100%; height:50px; display:flex;align-items:center" onclick="openExamFileEditModal('${
      resultAsArray[i].filename
    }')" >
    ${
      resultAsArray[i].language.charAt(0).toUpperCase() +
      resultAsArray[i].language.slice(1)
    } File 
    </p>
    <p style="font-size:25px" onclick="deleteFile('${resultAsArray[i].id}', ${
      resultOfCourseAsArray[0].language === resultAsArray[i].language
    },'${resultAsArray[i].filename}')"> &times;</p> 
    </div>`;
  }

  return firstBoxOfLanguages;
}

async function convertFileToSelectedLanguage(event) {
  event.preventDefault();

  var examID = document
    .getElementById("create-file-for-language")
    .getAttribute("data-exam-id");

  const languagesTo = document.getElementById("languages-to");

  const resultOfAllFiles = await AJAXCall({
    phpFilePath: "../include/exam/getAllFiles.php",
    rejectMessage: "File Failed To Get",
    params: `examID=${examID}`,
    type: "post",
  });

  const resultOfAllFilesAsArray = JSON.parse(resultOfAllFiles);

  let isAlreadyExists = false;

  for (let i = 0; i < resultOfAllFilesAsArray.length; i++) {
    if (resultOfAllFilesAsArray[i].language === languagesTo.value) {
      isAlreadyExists = true;
      break;
    }
  }

  if (!isAlreadyExists) {
    let loader = loadLoader("Generating File");

    const languagesFrom = document.getElementById("languages-from");

    const resultOfGetSingleFile = await AJAXCall({
      phpFilePath: "../include/exam/getSingleFile.php",
      rejectMessage: "File Failed To Get",
      params: `examID=${examID}&&language=${languagesFrom.value}`,
      type: "post",
    });

    const resultAsArray = JSON.parse(resultOfGetSingleFile);

    const result = await AJAXCall({
      phpFilePath: "../include/readJSONData.php",
      rejectMessage: "saving json file failed",
      params: `filepath=../exam/generated/${resultAsArray[0].filename}`,
      type: "post",
    });

    const parsedResult = JSON.parse(result);

    const newData = [];
    for (let i = 0; i < parsedResult.length; i++) {
      let query = `Translate answer=${parsedResult[i].answer} to ${languagesTo.value}. Return json like {answer:""}`;

      let unparsedJSONResponse = await generateGPTResponseFor(query);
      let answers = await JSON.parse(unparsedJSONResponse);

      let answerOptions;
      if (parsedResult[i].answerOptions) {
        let queryForAnswerOptions = `Translate answerOptions=${parsedResult[i].answerOptions} to ${languagesTo.value}. Return json like {answerOptions:[""]}`;

        let unparsedJSONResponseorAnswerOptions = await generateGPTResponseFor(
          queryForAnswerOptions
        );
        answerOptions = await JSON.parse(unparsedJSONResponseorAnswerOptions);
      }

      let queryQuestion = `Translate question=${parsedResult[i].question} to ${languagesTo.value}. Return json like {question:""}`;

      let unparsedJSONResponseQuestion = await generateGPTResponseFor(
        queryQuestion
      );
      let questions = await JSON.parse(unparsedJSONResponseQuestion);

      let data = {
        id: parsedResult[i].id,
        question: questions.question,
        answer: answers.answer,
        type: parsedResult[i].type,
        hardness: parsedResult[i].hardness,
        marksWorth: parsedResult[i].marksWorth,
      };

      if (answerOptions) {
        data["answerOptions"] = answerOptions.answerOptions;
      }
      newData.push(data);
    }

    let newFilename = `Exam-${uniqueID(2)}.json`;
    saveExamAsJSON(newFilename, newData, "generated");

    let examFileID = uniqueID(1);
    let dateGenerated = getCurrentTimeInJSONFormat();

    await AJAXCall({
      phpFilePath: "../include/exam/addNewFile.php",
      rejectMessage: "New File Failed To Add",
      params: `id=${examFileID}&&filename=${newFilename}&&dateGenerated=${dateGenerated}&&examID=${examID}&&language=${languagesTo.value}`,
      type: "post",
    });

    let mainContainer = document.querySelector(".main-container");
    const id = mainContainer.getAttribute("data-id");

    const resultOfCourse = await AJAXCall({
      phpFilePath: "../include/course/getSingleCourse.php",
      rejectMessage: "Course Failed To Get",
      params: `id=${id}`,
      type: "post",
    });

    const resultOfCourseAsArray = JSON.parse(resultOfCourse);

    const resultOfAllFiles = await AJAXCall({
      phpFilePath: "../include/exam/getAllFiles.php",
      rejectMessage: "File Failed To Get",
      params: `examID=${examID}`,
      type: "post",
    });

    const resultOfAllFilesAsArray = JSON.parse(resultOfAllFiles);

    let firstBoxOfLanguages = await generateCurrentFilesOfExam(
      resultOfAllFilesAsArray,
      resultOfCourseAsArray
    );

    const currentFilesOfExam = document.getElementById("current-files-of-exam");
    currentFilesOfExam.innerHTML = firstBoxOfLanguages;

    setTimeout(() => {
      removeLoader(loader);
    }, 2000);
  } else {
    animateDialog("You already have a file with this language.");
  }
}

async function openExamFileEditModal(filename) {
  await startEditingExam(filename);
}

async function deleteFile(fileId, isMainLanguageFile, filename) {
  if (!isMainLanguageFile) {
    await AJAXCall({
      phpFilePath: "../include/delete/deleteFile.php",
      rejectMessage: "File Failed To Delete",
      params: `id=${fileId}`,
      type: "post",
    });

    deleteExamAsJSON(filename, "generated");

    let mainContainer = document.querySelector(".main-container");
    const id = mainContainer.getAttribute("data-id");

    const resultOfCourse = await AJAXCall({
      phpFilePath: "../include/course/getSingleCourse.php",
      rejectMessage: "Course Failed To Get",
      params: `id=${id}`,
      type: "post",
    });

    const resultOfCourseAsArray = JSON.parse(resultOfCourse);

    var examID = document
      .getElementById("create-file-for-language")
      .getAttribute("data-exam-id");

    const resultOfAllFiles = await AJAXCall({
      phpFilePath: "../include/exam/getAllFiles.php",
      rejectMessage: "File Failed To Get",
      params: `examID=${examID}`,
      type: "post",
    });

    const resultOfAllFilesAsArray = JSON.parse(resultOfAllFiles);

    let firstBoxOfLanguages = await generateCurrentFilesOfExam(
      resultOfAllFilesAsArray,
      resultOfCourseAsArray
    );

    const currentFilesOfExam = document.getElementById("current-files-of-exam");
    currentFilesOfExam.innerHTML = firstBoxOfLanguages;
    animateDialog("File successfully deleted!");
  } else {
    animateDialog(
      "This file has same language with course language. You cannot delete this exam."
    );
  }
}

async function deleteExam(examId) {
  await AJAXCall({
    phpFilePath: "../include/delete/deleteExam.php",
    rejectMessage: "File Failed To Delete",
    params: `id=${examId}`,
    type: "post",
  });

  const allFilesResult = await AJAXCall({
    phpFilePath: "../include/exam/getAllFiles.php",
    rejectMessage: "File Failed To Get",
    params: `examID=${examId}`,
    type: "post",
  });

  const allFilesResultAsJson = JSON.parse(allFilesResult);

  for (let i = 0; i < allFilesResultAsJson.length; i++) {
    await AJAXCall({
      phpFilePath: "../include/delete/deleteFile.php",
      rejectMessage: "File Failed To Delete",
      params: `id=${allFilesResultAsJson[i].id}`,
      type: "post",
    });

    deleteExamAsJSON(allFilesResultAsJson[i].filename, "generated");
  }

  let mainContainer = document.querySelector(".main-container");
  const courseID = mainContainer.getAttribute("data-id");

  fetchAllExam(courseID);

  animateDialog("Exam successfully deleted!");
}
