let globalImageObject;
let globalPDFObject;
let globalVideoObject;
let EditTextObject;

function loadImageToPopupView(event, outputElement) {

    // const output = document.querySelector(outputElement);

    let uploadContainer = document.querySelector(".upload-options-container");
    let uploadProgressContainer = document.querySelector(".upload-progress-container");
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
    let uploadProgressContainer = document.querySelector(".upload-progress-container");
    let textupload=document.getElementById("textviewer");
  
    uploadContainer.style.display = "none";
    uploadProgressContainer.style.display = "none";


    textupload.style.display = "grid";

    let TextToUpload=document.getElementById("TextToUpload")
    
    setUploadTextObject({
        value: TextToUpload.value,
        type: "text"
    })


}


function loadVideoToPopupView(event, outputElement) {
    console.log("video is needed");

    let uploadContainer = document.querySelector(".upload-options-container");
    let uploadProgressContainer = document.querySelector(".upload-progress-container");
    // let uploadvideo = document.querySelector(".videoPreviewContainer");
    uploadContainer.style.display = "none";
    uploadProgressContainer.style.display = "grid";
    // uploadvideo.style.display = "grid"; // Make sure the video container is displayed

    console.log("Run Video 1")
    // Get the selected file
    const file = event.target.files[0];
    
    if (file && file.type.startsWith('video/')) {
        // Create a URL for the video file
        const videoUrl = URL.createObjectURL(file);

    console.log("Run Video 2")

        // Get the video element and set its source
        const videoPreview = document.getElementById('videoPreview');
        videoPreview.src = videoUrl;

    console.log("Run Video 3")

        // Show the video preview container
        const videoPreviewContainer = document.getElementById('videoPreviewContainer');
        videoPreviewContainer.style.display = "block";
    } else {
    console.log("Run Video 4")

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
    let uploadProgressContainer = document.querySelector(".upload-progress-container");
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
        let uploadProgressContainer = document.querySelector(".upload-progress-container");
        uploadContainer.style.display = "grid";
        uploadProgressContainer.style.display = "none";
    
        let uploadvideo = document.querySelector(".videoPreviewContainer");
        uploadvideo.style.display = "none";
    
        // Clear the video preview source
        const videoPreview = document.getElementById('videoPreview');
        videoPreview.src = ""; // Reset the src attribute to clear the preview

        const input = document.getElementById("videoUploadInput");
        // Clear the input value after a file is selected or canceled
        input.value = "";

        let textupload=document.getElementById("textviewer");
        textupload.style.display="none"
    }

function startUploading(){

    let uploadOverlay = document.querySelector(".upload-overlay");
    let lectureID = uploadOverlay.getAttribute("data-id");

    console.log("lectureID for uploading: ", lectureID);

    uploadWithObject(globalImageObject);
    uploadWithObject(globalPDFObject);
    uploadWithObject(globalVideoObject);
    uploadWithObject(EditTextObject);

    async function uploadWithObject(fileObject){

        console.log("object", fileObject)

        if(fileObject && lectureID){

            let {type} = fileObject;
            const id = uniqueID(1);
;
            try{
                if(type != "text") {
                    let { newFileName: value, oldFileName } = await uploadFile(fileObject);
                    if(value) await sendResourceToDatabase({id, value, type, lectureID, oldFileName});
                    else throw new Error("Upload Failed");
                }else{
                    let TextToUpload=document.getElementById("TextToUpload")
                    let value = TextToUpload.value
                    console.log("value:", value)
                    await sendResourceToDatabase({id, value, type, lectureID, oldFileName: ""});
                }

                
                setTimeout(() => {
                    // TODO: animateSuccess();
                    closeUploadOverlay();
                    // TODO: resetUploadOverlay();
                },5000)
            }
            catch(error){
                console.log(error);
            }
        }
        else return;
    }
}

async function sendResourceToDatabase(resourceObject){

    const { 
        id, 
        value, 
        type, 
        lectureID,
        oldFileName
    } = resourceObject;

    const params = `id=${id}&&value=${value}&&type=${type}&&lectureID=${lectureID}&&title=${oldFileName}`;

    return await AJAXCall({
        phpFilePath: "../include/course/addNewResource.php",
        rejectMessage: "Adding New Resource Failed",
        params,
        type: "post"
    });

}

function setUploadTextObject(textObject){
    EditTextObject=textObject

}

function setUploadImageObject(imageObject) {
    globalImageObject = imageObject;
}

function setUploadPDFObject(PDFObject){
    globalPDFObject = PDFObject;
}

function setUploadVideoObject(VideoObject){

    globalVideoObject=VideoObject;


}

function openUploadOverlay(id){

    let uploadOverlay = document.querySelector(".upload-overlay");
    uploadOverlay.style.display = "grid";
    uploadOverlay.setAttribute('data-id', id);

}

function closeUploadOverlay(){
    let uploadOverlay = document.querySelector(".upload-overlay");
    uploadOverlay.style.display = "none";
}

async function loadCourses(options = "id"){

    let courseViewContainer = document.querySelector(".course-view-container");
    let loader = courseViewContainer.querySelector(".course-view-container-loader");

    let noCoursesYetText = createLocalizedTextElement("No courses yet");
    let createCourseText = createLocalizedTextElement("Create Course");
    let errorText = createLocalizedTextElement("Something Went Wrong");

    let emptyView = createElement("div", "container-message");
    let largeMessage = createElement("div", "large-message");
    largeMessage.appendChild(noCoursesYetText);

    let createCourseButton = createElement("div", "button");
    createCourseButton.appendChild(createCourseText);
    createCourseButton.addEventListener("click", () => openCreateCourseOverlay())

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
    let NoSelectedCoursesYet = createLocalizedTextElement("You haven't chosen any courses yet");
    let myLargeMessage = createElement("div", "large-message");
    myLargeMessage.appendChild(NoSelectedCoursesYet);
    myEmptyView.appendChild(myLargeMessage);

    return new Promise(async (resolve, reject) => {

    let { id:userID } = await getGlobalDetails();

    try {

        const params = `id=${userID}`;

        let phpFilePath;

        switch(options){
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
            type: "fetch"
        });

        setTimeout(() => {

            if(result && result.length > 0) {
                loadCoursesUI(result, options, userID);
                resolve();
            }
            else {

                //TODO: This part might cause bugs in future versions
                courseViewContainer.innerHTML = "";

                switch(options){
                    case "id":  // Refactor this to be "teacher"
                        courseViewContainer.appendChild(emptyView);
                    break;
                    case "all": // Refactor this to be "student subscriptions"
                        courseViewContainer.appendChild(studentEmptyView);
                        ;
                    break;
                    case "mine": // Refactor this to be "mine -- or -- classview"
                        courseViewContainer.appendChild(myEmptyView);
                        ;
                }
            }
        }, 2000);
    }
    catch(error){

    }

    });

    function loadCoursesUI(coursesObject, options, userID){

        courseViewContainer.innerHTML = "";



        coursesObject.map( async (course) => {

            const { id, title, image, courseCode } = course;

            let courseCard = createElement("div", "course-card");

            let courseCardImage = createElement("div", "course-card-image");
            let imageElement = document.createElement("img");

            imageElement.src = image.length > 2 ? await checkImage(`../uploads/${image}`) : `../assets/images/courseDefault.jpg`;

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
                switch(options){
                    case "id": 
                        editCourseWith(id);
                    break;
                    case "all":
                        // TODO: Using Subscriptions, toggle different popups.
                        subscriptionEvent(subscriptionResult, {id, userID})();
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
                if(subscriptionResult[0].status == "true"){
                    courseCard.appendChild(subscriptionIcon);
                }
            }catch(error){

            }         
            // ENDS HERE

            courseViewContainer.appendChild( courseCard );
        });

        function subscriptionEvent(subscriptionArray, {id, userID}){

            try{

                if(subscriptionArray.length > 0){
                    let status = subscriptionArray[0];
                    console.log("status: ", status);
                    if(status.status == "true") return () => showDeRegisterPopup(id, userID);
                    // else return showDeRegisterPopup;     
                } else return () => showRegisterPopup(id, userID);
                
            }
            catch(error){

            }
        
        }

        function showDeRegisterPopup(courseID, userID){
            console.log("Course has been registered, click will bring up de registration option");

            // TODO: #deregister from course

            let deregisterButton = document.querySelector(".deregister-course-button");
            deregisterButton.setAttribute("data-courseID", courseID);
            deregisterButton.setAttribute("data-userID", userID);

            openPopup(".deregister-course");

        }

        function showRegisterPopup(courseID, userID){

            let enrollButton = document.querySelector(".enroll-course-button");
            enrollButton.setAttribute("data-courseID", courseID);
            enrollButton.setAttribute("data-userID", userID);

            openPopup(".register-to-course");

            console.log("Course has not been registered");
        }

    }

    async function getCourseSubscriptionStatus(id, userID){

        return await AJAXCall({
            phpFilePath: "../include/course/getSubscriptionStatus.php",
            rejectMessage: "Getting Status Failed",
            params: `id=${id}&&userID=${userID}`,
            type: "fetch"
        });

    }

    function goToCourse(id){

        console.log("curent id:", id);
        openPopup(".classroom-inner-overlay");
        let classRoomOverlay = document.querySelector(".classroom-inner-overlay");
        classRoomOverlay.setAttribute("id", id);
        renderCourseOutline(id);

    }

}

function editCourseWith(id){

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

async function deregisterFromCourse(buttonElement){

    let courseID = buttonElement.getAttribute("data-courseID");
    let userID = buttonElement.getAttribute("data-userID");

    try {
        let result = await AJAXCall({
            phpFilePath: "../include/course/deregisterFromCourse.php",
            params: `courseID=${courseID}&&userID=${userID}`,
            rejectMessage: "Error Deregistering From Course",
            type: "post"
        });

        console.log(result);

        window.location.href = "Courses.php"

    }catch(error){
        console.log(error);
    }

}

async function enrollToCourse(buttonElement){

    let courseID = buttonElement.getAttribute("data-courseID");
    let userID = buttonElement.getAttribute("data-userID");

    let id = uniqueID(1);

    try {
        let result = await AJAXCall({
            phpFilePath: "../include/course/addSubscriptionToCourse.php",
            params: `id=${id}&&courseID=${courseID}&&userID=${userID}`,
            rejectMessage: "Error Subscribing To Course",
            type: "post"
        });

        console.log(result);

        window.location.href = "Classroom.php"

    }catch(error){
        console.log(error);
    }

}

function closeEditCourseContainer(){

    let editCourseContainer = document.querySelector(".edit-course-container");
    editCourseContainer.style.display = "none";

}


async function checkImage(imagePath){

    // This function checks for broken image paths
    // and replaces it with a default image

    try{
        let result = await fetch(imagePath);
        if(result.status != 404) return imagePath;
        throw new Error();
    }
    catch(error){
        return `../assets/images/courseDefault.jpg`;
    }
}