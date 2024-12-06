function renderClassView(element){
    const givenID = globalCache.get("givenCourseID");
    const courseData = globalCache.get("chosenCourseData");
    const duxClassChat = new DuxClassChat(courseData, givenID);

    openPopup('.class-chat-inner-overlay');

    let duxSendButton = document.querySelector(".class-send-message-button");
    let duxInputText = document.querySelector("#final_speech");
    let duxMessagesView = document.querySelector(".dux-class-chat-container");
    let uploadPDF = document.querySelector("#duxAddPDF");

    duxClassChat.addSendButtonElement(duxSendButton);
    duxClassChat.addTextBoxInputElement(duxInputText);
    duxClassChat.addMessagesView(duxMessagesView);
    duxClassChat.setAddToDuxPDF(uploadPDF);

}


class ClassView {

    constructor(courseObject, courseID){
        
        let {
            title,
            courseCode,
            lectures,
            id,
        } = courseObject

        this.title = title;
        this.courseCode = courseCode;
        this.lectureQueue = lectures;
        this.resourceQueue = [];
        this.quizQueue = [];
        this.currentLecture = null;
        this.currentQuiz = null;
        this.hasQuiz = false;
        this.courseObject = courseObject;
        this.id = id;
        this.currentStep = "lecture";
        this.courseID = courseID;
        this.currentHierarchy = 0;
        this.next();
    }

    next(){

        switch(this.currentStep){
            case "lecture":
                
                this.getCurrentLecture()
            break;
            case "resource":
                
                this.getCurrentResource()
            break;
            case "quiz":
                
                this.getCurrentQuiz()
            break;
        }
    }

    getCurrentLecture(){

        if(this.lectureQueue.length > 0){
            this.currentLecture = this.lectureQueue.shift();
            this.currentHierarchy = this.currentLecture.hierarchy;

            this.resourceQueue = this.currentLecture.resources;
            this.currentStep = "resource";
            this.next()
            
            if(this.currentLecture.quizzes.length > 0){
                this.hasQuiz = true 
                this.quizQueue = this.currentLecture.quizzes
            }
            else this.hasQuiz = false; 

            // if (this.hasQuiz == true) this.currentStep = "quiz";
            // else this.currentStep = "lecture";  
            // this.next();

            this.next()
        } else {
            this.currentStep = "finished"
            // showThatThereAreNoLecturesToStudy()
            // showThatTheLecturesAreFinished()
            return;
        }

    }

    getCurrentResource(){

        if(this.resourceQueue.length > 0)
            this.currentResource = this.resourceQueue.shift();
        else {
            this.next();
        }

    }

    getCurrentQuiz(){

        if(this.quizQueue.length > 0){
            this.currentQuiz = this.quizQueue.shift();
            const quizObject = { hierarchy: this.currentHierarchy, ...this.currentQuiz };
            handleQuiz({ courseID: this.courseID ,...quizObject }, this.quizButton, "iterative"); // TODO: handle quiz finishing.
        } else {
            this.currentStep = "lecture";
            this.next();
        }

    }



    renderTitle(){
        // let titleElement = findElement(".classroom-course-title");
        // let textElement = document.createElement("div");

        // textElement.textContent = this.title;
        // titleElement.innerHTML = "";
        // titleElement.appendChild(textElement);
    }

    renderCourseCode(){
        // let titleElement = findElement(".classroom-course-code");
        // let textElement = createLocalizedTextElement(this.courseCode);        
        // titleElement.innerHTML = "";
        // titleElement.appendChild(textElement);
    }
}