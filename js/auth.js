let loginContainer = document.querySelector(".login-container");
let signupContainer = document.querySelector(".signup-container");

let studentForm = document.querySelector(".student-form");
let teacherForm = document.querySelector(".teacher-form");

let studentTabButton = document.querySelector(".student-tab-button");
let teacherTabButton = document.querySelector(".teacher-tab-button");

let bubbleMessageContainer = document.querySelector(".bubble-message-container");

let isTeacherOrStudent = "student";

function showSignup(){
    loginContainer.style.display = "none";
    signupContainer.style.display = "grid";
}

function showLogin(){
    loginContainer.style.display = "grid";
    signupContainer.style.display = "none";
}

function showStudentForm(){
    studentForm.style.display = "grid";
    teacherForm.style.display = "none";

    studentTabButton.setAttribute("data-active", "true");
    teacherTabButton.setAttribute("data-active", "false");

    isTeacherOrStudent = "student";
}

function showTeacherForm(){
    studentForm.style.display = "none";
    teacherForm.style.display = "grid";

    studentTabButton.setAttribute("data-active", "false");
    teacherTabButton.setAttribute("data-active", "true");

    isTeacherOrStudent = "teacher";

}

// Enter Key To Login
document.querySelector("#password-field")
.addEventListener("keydown", (event) => {

    var key = event.keyCode;

    if(key == 13){
        login();
    }
})

async function login(){

    let usernameField = document.querySelector("#username-field");
    let passwordField = document.querySelector("#password-field");

    //TODO: Regex test fields
    //TODO: Hash password

    let email = usernameField.value;
    let password = passwordField.value;
    let params = `email=${email}&&`+`password=${password}`;

    let callObject = {
        phpFilePath: "include/login.php",
        rejectMessage: "Login Failed",
        params,
        type: "post",
    }

    try {

        let result = await AJAXCall(callObject)
        let loginResult = JSON.parse(result);

        
        localStorage.setItem("id", loginResult.id)


        if (loginResult.state != "error") {
            let { role } = loginResult; 

            switch(role){
                case "Admin":
                    window.location.href="admin/"
                    break;
                case "teacher":
                    window.location.href="../include/questionairbackend.php"
                    break;
                case "student":
                    window.location.href="student/"
                    break;

            }
        }
        else {
            showLoginError();
        }
    }
    catch(error){
        showLoginError();
    }

}

function showLoginError(){
    
    bubbleMessageContainer.textContent = "Wrong Credentials";
    bubbleMessageContainer.style.top = "-100px";

    setTimeout(() => {
        bubbleMessageContainer.style.top = "0%";
    },2000);
}

function bubbleError(errorMessage){
    alert(errorMessage);
}

async function signup(){

    let params;
    let id = 'U' + uniqueID(1);

    // TODO: Do some validation here.
    // if(!isPictureChosen()){
    //     bubbleError("Choose an Image");
    //     return;
    // }

    if(isPictureNotChosen()){
        bubbleError("Choose an Image");
        return;
    }
    else if(emptyFields()){
        bubbleError("Fill in all Fields");
        return;
    }

    function isPictureNotChosen(){
        let imageElement = document.querySelector("#chosenPhoto");
        if (imageElement.src === "")
            return true;
        return false;
    }

    function emptyFields(){
        let emptyElements = false;
        return emptyElements;
    }

    let imageInput = document.querySelector("#signupImageInput");
    let { newFileName: photoName } = await uploadFile(imageInput.files[0], "include/upload.php");

    if(!photoName){
        bubbleError("Upload Photo Failed");
        return;
    }

    switch(isTeacherOrStudent){
        case "student":
            signupAsStudent();
            break;
        case "teacher":
            signupAsTeacher();
            break;
    }

    let call = {
        phpFilePath: "include/signup.php",
        rejectMessage: "Signup Failed",
        params,
        type: "post",
    };

    

    try {
        await AJAXCall(call);
        window.location.href = "success.html";
    } catch(error) {
        console.error("Signup failed:", error);
    }

    function signupAsStudent(){

        let studentName = document.querySelector("#name");
        let studentNumber = document.querySelector("#stdnumber");
        let studentDepartment = document.querySelector("#department");
        let studentEmail = document.querySelector("#email");
        let studentAddress = document.querySelector("#address");
        let studentPhone = document.querySelector("#phone");
        let studentPassword = document.querySelector("#password");

        let name = studentName.value;
        let studentno = studentNumber.value;
        let department = studentDepartment.value;
        let email = studentEmail.value;
        let address = studentAddress.value;
        let phone = studentPhone.value;
        let password = studentPassword.value;
        let timestamp = new Date().toJSON();

        

        params = 
        `id=${id}&&email=${email}&&password=${password}&&role=student&&timestamp=${timestamp}&&name=${name}&&address=${address}&&image=${photoName}&&phone=${phone}&&institutionID=${studentno}&&department=${department}`

    }

    // function signupAsTeacher(){
    //     let teacherName = document.querySelector("#t-name");
    //     let teacherDepartment = document.querySelector("#t-department");
    //     let teacherEmail = document.querySelector("#t-email");
    //     let teacherAddress = document.querySelector("#t-address");
    //     let teacherPhone = document.querySelector("#t-phone");
    //     let teacherPassword = document.querySelector("#t-password");

    //     let name = teacherName.value;
    //     let department = teacherDepartment.value;
    //     let email = teacherEmail.value;
    //     let address = teacherAddress.value;
    //     let phone = teacherPhone.value;
    //     let password = teacherPassword.value;
    //     let teacherID = "TD" + uniqueID(-1); // Genarate random ID number for the teacher.

    //     // params = `uid=${id}&name=${name}&studentno=${teacherID}&department=${department}&email=${email}&address=${address}&phone=${phone}&password=${password}&photoName=${photoName}&action=signup&utype=Teacher`;

    // }
}

