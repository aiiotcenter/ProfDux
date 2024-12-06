let globalImageObject;
let globalPDFObject;
let globalVideoObject;
let EditTextObject;
let globalLinkView;

function loadImageToPopupView(event, outputElement) {
  // const output = document.querySelector(outputElement);

  let uploadContainer = document.querySelector(".upload-options-container");
  let uploadProgressContainer = document.querySelector(
    ".upload-progress-container"
  );
  uploadContainer.style.display = "none";
  uploadProgressContainer.style.display = "grid";

  let { name: imageName, type: imageType } = event.target.files[0];

  let truncatedImagedString = truncateString(imageName);
  let truncatedFilename = document.querySelector("#truncatedFilename");
  truncatedFilename.textContent = truncatedImagedString;

  setUploadImageObject(event.target.files[0]);

  // output.src = URL.createObjectURL(event.target.files[0]);
  // output.onload = function() {
  // URL.revokeObjectURL(output.src) // free memory
  // }
}

function loadtextToPopupView(event, outputElement) {
  // const output = document.querySelector(outputElement);

  let uploadContainer = document.querySelector(".upload-options-container");
  let uploadProgressContainer = document.querySelector(
    ".upload-progress-container"
  );
  let textupload = document.getElementById("textviewer");

  uploadContainer.style.display = "none";
  uploadProgressContainer.style.display = "none";

  textupload.style.display = "grid";

  let TextToUpload = document.getElementById("TextToUpload");

  setUploadTextObject({
    value: TextToUpload.value,
    type: "text",
  });
}

function loadLinkToPopupView(event, outputElement) {
  let uploadContainer = document.querySelector(".upload-options-container");
  let uploadProgressContainer = document.querySelector(
    ".upload-progress-container"
  );
  let Linkupload = document.getElementById("LinkViewer");
  let LinkPreview = document.getElementById("preview");

  uploadContainer.style.display = "none";
  uploadProgressContainer.style.display = "none";

  Linkupload.style.display = "grid";
  LinkPreview.style.display = "grid";

  let LinkToupload = document.getElementById("LinkToUpload");

  setUploadLinkObject({
    value: LinkToupload.value,
    type: "link",
  });
}

function loadVideoToPopupView(event, outputElement) {
  

  let uploadContainer = document.querySelector(".upload-options-container");
  let uploadProgressContainer = document.querySelector(
    ".upload-progress-container"
  );
  // let uploadvideo = document.querySelector(".videoPreviewContainer");
  uploadContainer.style.display = "none";
  uploadProgressContainer.style.display = "grid";
  // uploadvideo.style.display = "grid"; // Make sure the video container is displayed

  
  // Get the selected file
  const file = event.target.files[0];

  if (file && file.type.startsWith("video/")) {
    // Create a URL for the video file
    const videoUrl = URL.createObjectURL(file);

    

    // Get the video element and set its source
    const videoPreview = document.getElementById("videoPreview");
    videoPreview.src = videoUrl;

    

    // Show the video preview container
    const videoPreviewContainer = document.getElementById(
      "videoPreviewContainer"
    );
    videoPreviewContainer.style.display = "block";
  } else {
    

    console.error("Selected file is not a video.");
  }

  let { name: VideoName, type: fileType } = event.target.files[0];

  let truncatedString = truncateString(VideoName);
  let truncatedFilename = document.querySelector("#truncatedFilename");
  truncatedFilename.textContent = truncatedString;

  setUploadVideoObject(event.target.files[0]);
}

function loadPDFToPopupView(event, outputElement) {
  // const output = document.querySelector(outputElement);

  let uploadContainer = document.querySelector(".upload-options-container");
  let uploadProgressContainer = document.querySelector(
    ".upload-progress-container"
  );
  uploadContainer.style.display = "none";
  uploadProgressContainer.style.display = "grid";

  let { name: PDFName, type: fileType } = event.target.files[0];

  let truncatedString = truncateString(PDFName);
  let truncatedFilename = document.querySelector("#truncatedFilename");
  truncatedFilename.textContent = truncatedString;

  setUploadPDFObject(event.target.files[0]);
}

function revertUploadChoice() {
  let uploadContainer = document.querySelector(".upload-options-container");
  let uploadProgressContainer = document.querySelector(
    ".upload-progress-container"
  );
  uploadContainer.style.display = "grid";
  uploadProgressContainer.style.display = "none";

  let uploadvideo = document.querySelector(".videoPreviewContainer");
  uploadvideo.style.display = "none";

  // Clear the video preview source
  const videoPreview = document.getElementById("videoPreview");
  videoPreview.src = ""; // Reset the src attribute to clear the preview

  const input = document.getElementById("videoUploadInput");
  // Clear the input value after a file is selected or canceled
  input.value = "";

  let textupload = document.getElementById("textviewer");
  textupload.style.display = "none";

        let Linkupload=document.getElementById("LinkViewer");
        Linkupload.style.display = "none";
        let LinkPreview = document.getElementById("preview")
        LinkPreview.style.display = "none";

    let loaderes=document.getElementById("loaderesClass")
    loaderes.style.display="none"
    }

function startUploading(){

    let loadingText = document.getElementById("loaderesClass");
    loadingText.style.display="grid"

    let uploadOverlay = document.querySelector(".upload-overlay");
    let lectureID = uploadOverlay.getAttribute("data-id");

    

    
   
    let attachButton=document.getElementById("attachButton")
    attachButton.style.display="none"   
 



  uploadWithObject(globalImageObject);
  uploadWithObject(globalPDFObject);
  uploadWithObject(globalVideoObject);
  uploadWithObject(EditTextObject);
  uploadWithObject(globalLinkView);

    async function uploadWithObject(fileObject){

        

        if(fileObject && lectureID){

            let {type} = fileObject;
            const id = uniqueID(1);
;
            try{
                if(type == "text"){
                    let TextToUpload=document.getElementById("TextToUpload")
                    let value = TextToUpload.value
                    
                    await sendResourceToDatabase({id, value, type, lectureID, oldFileName: ""});
                }else if(type == "link") {
                    
                    let LinkToupload=document.getElementById("LinkToUpload")
                    let value = LinkToupload.value
                    
                    await sendResourceToDatabase({id, value, type, lectureID, oldFileName: ""});
                }else {
                    let { newFileName: value, oldFileName } = await uploadFile(fileObject);
                    if(value) await sendResourceToDatabase({id, value, type, lectureID, oldFileName});
                    else throw new Error("Upload Failed");
                }

                
                setTimeout(() => {
                    // TODO: animateSuccess();
                    closeUploadOverlay();
                    attachButton.style.display="grid"
                    loaderesClass.style.display="none"
                    refreshTeacherCourseOutline()

                    // TODO: resetUploadOverlay();
                },5000)
            }
            catch(error){
                
            }
        }
        else return;
    }
}

async function sendResourceToDatabase(resourceObject) {
  const { id, value, type, lectureID, oldFileName } = resourceObject;

  const params = `id=${id}&&value=${value}&&type=${type}&&lectureID=${lectureID}&&title=${oldFileName}`;

  return await AJAXCall({
    phpFilePath: "../include/course/addNewResource.php",
    rejectMessage: "Adding New Resource Failed",
    params,
    type: "post",
  });
}

function setUploadTextObject(textObject) {
  EditTextObject = textObject;
}

function setUploadImageObject(imageObject) {
  globalImageObject = imageObject;
}

function setUploadPDFObject(PDFObject) {
  globalPDFObject = PDFObject;
}

function setUploadVideoObject(VideoObject) {
  globalVideoObject = VideoObject;
}

function setUploadLinkObject(linkObject) {
  globalLinkView = linkObject;
}

function openUploadOverlay(id) {
  let uploadOverlay = document.querySelector(".upload-overlay");
  uploadOverlay.style.display = "grid";
  uploadOverlay.setAttribute("data-id", id);
}

function closeUploadOverlay() {
  let uploadOverlay = document.querySelector(".upload-overlay");
  uploadOverlay.style.display = "none";
}

async function loadCourses(options = "id") {
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
          loadCoursesUI(result, options, userID);
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
              break;
            case "mine": // Refactor this to be "mine -- or -- classview"
              courseViewContainer.appendChild(myEmptyView);
          }
        }
      }, 2000);
    } catch (error) {}
  });

  function loadCoursesUI(coursesObject, options, userID) {
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
            editCourseWith({ id });
            break;
          case "all":
            // TODO: Using Subscriptions, toggle different popups.
            subscriptionEvent(subscriptionResult, { id, userID })();
            break;
          case "mine":
            goToCourse({ id });
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
          courseCard.appendChild(subscriptionIcon);
        }
      } catch (error) {}
      // ENDS HERE

      courseViewContainer.appendChild(courseCard);
    });

    function subscriptionEvent(subscriptionArray, { id, userID }) {
      try {
        if (subscriptionArray.length > 0) {
          let status = subscriptionArray[0];
          
          if (status.status == "true")
            return () => showDeRegisterPopup(id, userID);
          // else return showDeRegisterPopup;
        } else return () => showRegisterPopup(id, userID);
      } catch (error) {}
    }

    function showDeRegisterPopup(courseID, userID) {
 
      // TODO: #deregister from course

      let deregisterButton = document.querySelector(
        ".deregister-course-button"
      );
      deregisterButton.setAttribute("data-courseID", courseID);
      deregisterButton.setAttribute("data-userID", userID);

      openPopup(".deregister-course");
    }

    function showRegisterPopup(courseID, userID) {
      let enrollButton = document.querySelector(".enroll-course-button");
      enrollButton.setAttribute("data-courseID", courseID);
      enrollButton.setAttribute("data-userID", userID);

      openPopup(".register-to-course");

      
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

  function goToCourse({ id }) {
    
    openPopup(".classroom-inner-overlay");
    let classRoomOverlay = document.querySelector(".classroom-inner-overlay");
    classRoomOverlay.setAttribute("id", id);
    renderCourseOutline(id);
  }
}

function editCourseWith({ id }) {
  let mainContainer = document.querySelector(".main-container");
  mainContainer.setAttribute("data-id", id);

  closePopup(".course-view-container");
  openPopup(".edit-course-container");

  let titleElement = document.querySelector("#course-title");
  titleElement.textContent = "";

  let courseCode = document.querySelector("#course-code");
  courseCode.textContent = "";

  fetchCourseWithID(id);
}

async function deregisterFromCourse(buttonElement) {
  let courseID = buttonElement.getAttribute("data-courseID");
  let userID = buttonElement.getAttribute("data-userID");

  try {
    let result = await AJAXCall({
      phpFilePath: "../include/course/deregisterFromCourse.php",
      params: `courseID=${courseID}&&userID=${userID}`,
      rejectMessage: "Error Deregistering From Course",
      type: "post",
    });

    

    window.location.href = "Courses.php";
  } catch (error) {
    
  }
}

async function enrollToCourse(buttonElement) {
  let courseID = buttonElement.getAttribute("data-courseID");
  let userID = buttonElement.getAttribute("data-userID");

  let id = uniqueID(1);

  try {
    let result = await AJAXCall({
      phpFilePath: "../include/course/addSubscriptionToCourse.php",
      params: `id=${id}&&courseID=${courseID}&&userID=${userID}`,
      rejectMessage: "Error Subscribing To Course",
      type: "post",
    });

    

    window.location.href = "Classroom.php";
  } catch (error) {
    
  }
}

function closeEditCourseContainer() {
  let editCourseContainer = document.querySelector(".edit-course-container");
  editCourseContainer.style.display = "none";
}

async function checkImage(imagePath) {
  // This function checks for broken image paths
  // and replaces it with a default image

  try {
    let result = await fetch(imagePath);
    if (result.status != 404) return imagePath;
    throw new Error();
  } catch (error) {
    return `../assets/images/courseDefault.jpg`;
  }
}

function showLinkPreview() {
  const linkInput = document.getElementById("LinkToUpload").value;
  const previewDiv = document.getElementById("preview");
  previewDiv.innerHTML = ""; // Clear previous content

  // Check if the link is a YouTube URL
  if (
    linkInput.includes("youtube.com/watch?v=") ||
    linkInput.includes("youtu.be/")
  ) {
    let videoId;
    if (linkInput.includes("youtube.com/watch?v=")) {
      videoId = linkInput.split("v=")[1].split("&")[0];
    } else if (linkInput.includes("youtu.be/")) {
      videoId = linkInput.split("youtu.be/")[1];
    }
    const iframe = `<iframe width="500" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    previewDiv.innerHTML = iframe;
  } else {
    // For general web links
    const linkPreview = `<a href="${linkInput}" target="_blank">${linkInput}</a>`;
    previewDiv.innerHTML = linkPreview;
  }
}

function createLinkPreview(linkInput) {
  let finalUI;

  // Check if the link is a YouTube URL
  if (
    linkInput.includes("youtube.com/watch?v=") ||
    linkInput.includes("youtu.be/")
  ) {
    let videoId;
    if (linkInput.includes("youtube.com/watch?v=")) {
      videoId = linkInput.split("v=")[1].split("&")[0];
    } else if (linkInput.includes("youtu.be/")) {
      videoId = linkInput.split("youtu.be/")[1];
    }
    const iframe = `<iframe width="500" height="300" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
    finalUI = iframe;
  } else {
    // For general web links
    const linkPreview = `<a href="${linkInput}" target="_blank">${linkInput}</a>`;
    finalUI = linkPreview;
  }

  return finalUI;
}
