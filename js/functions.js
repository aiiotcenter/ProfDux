const letters = "abcdefghijklmnopqrstuvwxyz".split("");

function truncateString(string, limit = 30) {
  return string.substring(0, limit) + "...";
}

function logoutDialog(_options) {
  let options = _options ?? {
    title: "Are You Sure You Want To Log Out?",
    denyTitle: "No",
    acceptTitle: "Yes",
  };

  return showOptionsDialog(options, () => logout());
}

function inactivityTime(duration, callback) {
  let time;
  window.onload = resetTimer;
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(callback, duration);
  }
}

function runAfterInactiveSeconds(duration, callback) {
  window.onload = () => inactivityTime(duration, callback);
}

function playPause() {
  let myVideo = document.querySelector("#video1");

  if (myVideo.paused) myVideo.play();
  else myVideo.pause();
}

function showLoader(message) {
  let loader = document.createElement("div");
  loader.className = "loading-overlay user-select-none";
  let body = document.querySelector("body");

  let loaderInnerHTML = `   <div class="overlay-inner-container">
            <div class="sk-chase">
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
                <div class="sk-chase-dot"></div>
            </div>

            <div class="loading-message">
                ${message}
            </div>
        </div>
    `;

  loader.innerHTML = loaderInnerHTML;
  body.appendChild(loader);

  return loader;
}

function removeLoader(loader) {
  loader.style.opacity = "0";

  setTimeout(() => loader.remove(), 1000);
}

function cascadingDateChanges() {
  let dateInputs = document.querySelectorAll("#topicCardsContainer input");
  let daysToAdd = 7;

  dateInputs.forEach((input, index) => {
    input.addEventListener("change", (event) => {
      let chosenDate = event.target.value;
      let currentDate = new Date(`${chosenDate}:00.000`);
      let currentIndex = Number(input.getAttribute("data-position"));

      dateInputs.forEach((dateInput, index) => {
        let position = Number(dateInput.getAttribute("data-position"));

        if (position > currentIndex) {
          let nextDate = currentDate;
          let timezoneOffset = nextDate.getTimezoneOffset();
          nextDate.setDate(currentDate.getDate() + daysToAdd);
          currentDate = nextDate;

          let [_date, _time] = currentDate.toJSON().split("T");
          let [_hours, _minutes] = _time.split(".")[0].split(":");

          let time = `${_hours - timezoneOffset / 60}:${_minutes}`;
          const finalDate = `${_date} ${time}`;
          dateInput.value = finalDate;
        }
      });
    });

    input.setAttribute("data-position", index);
  });
}

// function showBatchSelectContainerView(){

//     let view;
//     let container = document.querySelector("#studentsListAll");
//     let batchSelectContainer = document.querySelector(".batch-select-container");
//     let studentCheckboxes = container.querySelectorAll('input[type="checkbox"]');

//     let count = 0;

//     studentCheckboxes.forEach( checkbox => {
//         if(!checkbox.checked){
//             count++;
//         }
//     });

//     let textRequest = count == 1 ? "Request" : "Requests";
//     let areIs = count == 1 ? "is" : "are";

//     if(count > 0){
//         view = `
//             <p>There ${areIs} ( <b>${count}</b> ) new ${textRequest}</p>
//             <button onclick="SelectAllCheckboxes()">Approve ${count} ${textRequest}</button>
//         `;
//     }
//     else{
//         view = `<p class="stretch-x">There are no new requests</p>`
//     }

//     batchSelectContainer.innerHTML = view;

// }

// function SelectAllCheckboxes(){

//     let container = document.querySelector("#studentsListAll");
//     let studentCheckboxes = container.querySelectorAll('input[type="checkbox"]');

//     studentCheckboxes.forEach( checkbox => {
//         if( !checkbox.checked ){
//             checkbox.checked = true;

//             // Create a new 'change' event
//             var event = new Event('change');

//             // Dispatch it.
//             checkbox.dispatchEvent(event);
//         }
//     });

//     showBatchSelectContainerView();

// }

function uniqueID(stregth = 2) {
  const date = Date.now() + getRandomArbitrary(0, 9999);
  const dateReversed = parseInt(String(date).split("").reverse().join(""));
  const base36 = (number) => number.toString(36);
  if (stregth == 1) return base36(date);
  if (stregth == -1) return base36(dateReversed);
  return base36(dateReversed) + base36(date);

  // return crypto.randomUUID().split("-").join("");
}

function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function setUsernameDetails(user) {
  document.querySelectorAll("#userName").forEach((item) => {
    item.setAttribute("data-en", user.name);
    item.setAttribute("data-tr", user.name);
  });
  document
    .querySelectorAll("#userPhoto")
    .forEach((item) => (item.src = user.photo));
}

function AJAXCall(callObject) {
  let { phpFilePath, rejectMessage, params, type } = callObject;

  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", phpFilePath, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
      if (this.status == 200) {
        let result =
          type == "fetch" ? JSON.parse(this.responseText) : this.responseText;

        //TODO: Take a look one more time
        if (result.length < 1 && type != "fetch")
          reject(rejectMessage || "SQLError");
        else {
          resolve(result);
        }
      } else {
        reject("Error With PHP Script");
      }
    };

    xhr.send(params);
  });
}

function loadImage(event, outputElement) {
  const output = document.querySelector(outputElement);
  output.src = URL.createObjectURL(event.target.files[0]);
  output.onload = function () {
    URL.revokeObjectURL(output.src); // free memory
  };
}

async function uploadFile(file, scriptPath = "../include/upload.php") {
  if (!file) {
    return false;
  }

  return new Promise((resolve, reject) => {
    let myFormData = new FormData();
    myFormData.append("file", file);

    let http = new XMLHttpRequest();
    http.open("POST", scriptPath, true);

    http.upload.addEventListener("progress", (event) => {
      let percent = (event.loaded / event.total) * 100;
      document.querySelector("#global-progress-bar").style.width =
        Math.round(percent) + "%";
    });

    http.onload = function () {
      if (this.status == 200) {
        console.log("name2: ", this.responseText);

        resolve({
          oldFileName: file.name,
          newFileName: this.responseText,
        });
      } else {
        reject("error");
      }
    };

    http.send(myFormData);
  });
}

async function getUserDetails() {
  let id = localStorage.getItem("id");

  try {
    let result = await AJAXCall({
      phpFilePath: "../include/getPersonalDetails.php",
      rejectMessage: "Getting Personal Details Failed",
      params: `id=${id}`,
      type: "fetch",
    });

    if (result) {
      return result[0];
    }
  } catch (error) {
    console.log(error);
    // TODO: Logout
  }
}

function openPopup(selector) {
  let popup = document.querySelector(selector);
  popup.style.display = "grid";
}

function closePopup(selector) {
  let popup = document.querySelector(selector);
  popup.style.display = "none";
}

async function getGlobalDetails() {
  let result = await getUserDetails();

  if (!result.id) logout();
  else return result;
}

function createElement(type, className = "") {
  let element = document.createElement("div");
  element.className = className;
  return element;
}

function findElement(selector) {
  return document.querySelector(selector);
}

function findElements(...args) {
  let result = {};

  args.forEach((item) => {
    result[camelCase(item)] = findElement(item);
  });

  return result;
}

function camelCase(word) {
  return word
    .replace(".", "")
    .replace("#", "")
    .replace(/-([a-z])/g, function (k) {
      return k[1].toUpperCase();
    });
}

async function fetchOpenAIKey(phpFilePath = "../include/openAIKey.php") {
  return await AJAXCall({
    phpFilePath,
    rejectMessage: "Key Not Fetched",
    params: "",
    type: "fetch",
  });
}

async function generateGPTResponseFor(prompt) {
  const response = await fetchOpenAIKey();
  let apiKey = response[0].value;

  const endpoint = "https://api.openai.com/v1/chat/completions";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    console.log("HERE IS DATA FROM GPT: ", data);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching response:", error);
    return null;
  }
}

function getRandomElement(arr) {
  if (arr.length === 0) {
    return undefined;
  }
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

async function saveAssessmentAsJSON(
  filename,
  ArrayContainingObjects,
  assessmentType,
  type
) {
  function escapeNonASCII(jsonString) {
    return jsonString.replace(/[\u007F-\uFFFF]/g, function (ch) {
      return "\\u" + ("0000" + ch.charCodeAt(0).toString(16)).slice(-4);
    });
  }

  let JSONString = JSON.stringify(ArrayContainingObjects);
  JSONString = escapeNonASCII(JSONString);

  console.log("assessment type: ", assessmentType);

  let correctPath;

  switch (type) {
    case "student":
    case "new":
    case "resume":
      correctPath = `../${assessmentType}/taken/${filename}`;
      break;
    case "teacher":
    case "generated":
      correctPath = `../${assessmentType}/generated/${filename}`;
      break;
  }

  console.log("[3] correctPath: ", correctPath);
  console.log("[4] jsonString: ", JSONString);

  try {
    let result = await AJAXCall({
      phpFilePath: "../include/saveJSONData.php",
      rejectMessage: "saving json file failed",
      params: `filepath=${correctPath}&&jsonString=${JSONString}`,
      type: "post",
    });

    console.log("[5] async Result: ", result);
  } catch (error) {
    //TODO: bubbleUpError()
    console.log(error);
  }
}

async function logout() {
  let result = await AJAXCall({
    phpFilePath: "../include/logout.php",
    rejectMessage: "logout error",
    params: "",
    type: "",
  });

  window.location.href = "../auth.php";
}

function getCurrentTimeInJSONFormat() {
  let now = new Date();
  return now.toJSON();
}

function clearEventListenersFor(old_element) {
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  return new_element;
}

function loadLoader(message) {
  let loader = document.createElement("div");
  loader.className = "loading-overlay user-select-none";
  let body = document.querySelector("body");

  let loaderInnerHTML = `   <div class="overlay-inner-container">

            <div class="sk-fold">
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
                <div class="sk-fold-cube"></div>
            </div>

            <div class="loading-message">
                ${message}
            </div>
        </div>
    `;

  loader.innerHTML = loaderInnerHTML;
  body.appendChild(loader);

  return loader;
}

function removeLoader(loader) {
  loader.style.opacity = "0";
  setTimeout(() => loader.remove(), 1000);
}

function scrollBottom(element) {
  element.scroll({ top: element.scrollHeight, behavior: "smooth" });
}

async function getCourseDetails(givenID) {
  return AJAXCall({
    phpFilePath: "../include/course/getCourseDetails.php",
    rejectMessage: "Getting Details Failed",
    params: `id=${givenID}`,
    type: "fetch",
  });
}

async function getTitleAndFilename(givenID) {
  return AJAXCall({
    phpFilePath: "../include/course/getTitleAndFilename.php",
    rejectMessage: "Getting Details Failed",
    params: `id=${givenID}`,
    type: "fetch",
  });
}

function createParametersFrom(data) {
  let params = "";
  let entries = Object.entries(data);

  entries.forEach(([key, value], index) => {
    let parameter = `${key}=${value}`;
    index < entries.length - 1
      ? (params += parameter + "&&")
      : (params += parameter);
  });

  return params;
}

function extractType(type) {
  switch (type) {
    //TODO: refactor so that any image types can be accepted
    case "image/png":
    case "image/jpg":
    case "image/jpeg":
      return "image";
    case "application/pdf":
      return "pdf";
    case "video":
      return "video";
    case "video/mp4":
    case "video/webm":
    case "video/ogg":
    case "video/quicktime":
    case "video/x-msvideo":
    case "video/x-ms-wmv":
    case "video/x-flv":
    case "video/3gpp":
    case "video/3gpp2":
    case "video/mpeg":
    case "video/x-matroska":
    case "video/x-f4v":
      return "player";
      
  }
}

function questionMapSwitch(question) {
  switch (question.type.toLowerCase()) {
    case "multiplechoicequestion":
      return new MultipleChoice(question);
    case "trueandfalsequestion":
      return new TrueAndFalse(question);
    case "fillintheblankquestion":
      return new FillInTheBlank(question);
    default:
      throw new Error(`Not Made Yet: ${question.type.toLowerCase()}`);
  }
}

function questionEditMapSwitch(question) {
  switch (question.type.toLowerCase()) {
    case "multiplechoicequestion":
      return new EditMultipleChoice(question);
    case "trueandfalsequestion":
      return new EditTrueAndFalse(question);
    case "fillintheblankquestion":
      return new EditFillInTheBlank(question);
    default:
      throw new Error(`Not Made Yet: ${question.type.toLowerCase()}`);
  }
}

async function fetchCourseWithID(givenID) {
  let courseGridContainer = findElement("#course-grid-container");

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

  selectedCourse.lectures.sort(
    (firstLecture, secondLecture) =>
      firstLecture.hierarchy - secondLecture.hierarchy
  );

  setTimeout(() => {
    // This is very important
    let deleteButton = clearEventListenersFor(
      findElement("#deleteCourseButton")
    );

    let course = new Course(selectedCourse);
    course.renderTitle();
    course.renderCourseCode();
    course.renderDeleteButton(deleteButton);
    course.renderEditLearningObjectivesButton();
    course.renderLectureSection();

    let addNewLectureButton = clearEventListenersFor(
      findElement("#addNewLecture")
    );
    let saveCourseDetailsButton = clearEventListenersFor(
      findElement("#saveCourseDetails")
    );

    addNewLectureButton.addEventListener("click", () =>
      course.addLectureElement()
    );

    saveCourseDetailsButton.addEventListener("click", async () =>
      courseItemObjectLooper(course)
    );
  }, 2000);
}

async function generateQuestion(generateQuestionObject, amount) {
  const { type, languages, educationEnvironment, level, topics } =
    generateQuestionObject;

  let query = `Please create ${amount} questions in valid JSON format using ISO encoding, with the keyword 'questions' in the ${languages.join(
    " and "
  )} languages, along with their respective answers in those same languages.

The questions should focus on the topics of ${topics} and be appropriate for ${educationEnvironment}. 

Each question must be in the ${type} format, and it is mandatory to include both the question and its correct answer for every question. If the question type requires answer options (e.g., multiple choice or true/false), those options must also be included in ${languages.join(
    " and "
  )}.

The difficulty level of the questions should be ${level}.

The JSON format must contain the following keys:
- "question": The text of the question (in ${languages.join(" and ")}).
- "answerOptions": The list of possible answers (required only for multiple choice or true/false questions, in ${languages.join(
    " and "
  )}).
- "answer": The correct answer (required for every question, in ${languages.join(
    " and "
  )}).
- "type": The type of question (e.g., multiple choice, true/false, etc.).
- "hardness": The difficulty level (e.g., easy, medium, hard).

Ensure that all fields ("question", "answerOptions" (if applicable), and "answer") are always included, and each field must be written in ${languages.join(
    " and "
  )}.

Do not add any invalid characters to the result, and ensure that every question has a corresponding correct answer.`;

  let unparsedJSONResponse = await generateGPTResponseFor(query);
  let result = await JSON.parse(unparsedJSONResponse);

  try {
    if (result.questions) return result.questions;
    else if (result.question) return result.question;
    else if (result.questions.questions) return result.questions.questions;
    else return result;
  } catch (error) {
    console.log(error);
  }
}

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}
