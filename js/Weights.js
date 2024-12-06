class Weights {

    constructor(weightsArray){
        this.weightsArray = weightsArray
    }

    createWeightElement(weightObject, courseID, type){

        const { id, value } = weightObject.weight == null ? 
        { id: uniqueID(1), value: "" } : weightObject.weight;

        const isWeightSet = weightObject.weight == null ? false : true;

        const { title, id:foreignID } = weightObject;

        const lessonItemContainer = document.createElement("div");
        lessonItemContainer.className = "lesson-item-container";

        const lessonNumbering = document.createElement("div");
        lessonNumbering.className = "numbering";

        const lessonItemInnerContainer = document.createElement("div");
        lessonItemInnerContainer.className = "lesson-item-inner-container";


        const lessonTitle = document.createElement("div");
        lessonTitle.className = "lesson-title";

        const typeBadge = `
            <div class="auto-two-column-grid ">
                <div class="two-column-grid">
                    <div class=${type == "exam"? "alert-badge": "green-badge"} style="justify-self:start;">${type}</div>
                    <p>${title}</p>
                </div>
                    ${ !isWeightSet ? `<div class="alert-badge" style="justify-self:end;">Weight Not Set</div>` : "" }
            </div>
            `;

        if(type == "exam"){
            lessonTitle.innerHTML = typeBadge;
        }else {
            lessonTitle.innerHTML = typeBadge;
        }

        const lessonTime = document.createElement("div");
        lessonTime.className = "lesson-time";

        let savingObject = {
            id,
            foreignID,
            courseID,
            value,
            type,
            isWeightSet
        }

        const weightInput = document.createElement("input");
        weightInput.setAttribute("type", "text");
        weightInput.className = "weight-input";
        weightInput.value = value;
        weightInput.placeholder = "Not Set";
        weightInput.addEventListener("input", (event) => {
            savingObject.value = event.target.value;
        });

        // weightInput.setAttribute("lectureID", weight.id)

        lessonTime.appendChild(weightInput);

        lessonItemInnerContainer.appendChild(lessonTitle)
        lessonItemInnerContainer.appendChild(lessonTime)

        lessonItemContainer.appendChild(lessonNumbering);
        lessonItemContainer.appendChild(lessonItemInnerContainer);
        
        return { lessonItemContainer, savingObject };

        lessonTitle.innerHTML = `
        <div class="two-column-grid">
            <p>${exam.title}</p>
            <div class="alert-badge" style="justify-self:end;">time not set</div>
        </div>
    `
    }

    createLessonPlanner(course){
        const lessonPlanContainer = document.createElement("div");
        lessonPlanContainer.className = "lesson-plan-container";

        const courseID = course.id;

        const lessonLeftPane = document.createElement("div");
        lessonLeftPane.className = "lesson-left-pane";
        const lessonImageBox = document.createElement("div");
        lessonImageBox.className = "image-container-box"; //TODO: refactor to image-container-box

        const image = document.createElement("img");
        image.src = `../uploads/${course.image}`;
        lessonImageBox.appendChild(image);

        const courseDetails = document.createElement("div");
        courseDetails.className = "course-details-box";
        courseDetails.textContent = `${course.courseCode} : ${course.title}`;
        lessonImageBox.appendChild(courseDetails);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.className = "button save-schedule-button";

        lessonLeftPane.appendChild(lessonImageBox);
        lessonLeftPane.appendChild(saveButton);

        const lessonRightPane = document.createElement("div");
        lessonRightPane.className = "lesson-right-pane one-column";

        return { lessonPlanContainer, lessonLeftPane, lessonRightPane, saveButton, courseID };
    }

    render(){

        const weightsOuterContainer = document.querySelector(".weights-outer-container");
    
        if(this.weightsArray.length > 0 ) weightsOuterContainer.innerHTML = "";

        this.weightsArray.forEach( course => {

            const { lessonPlanContainer, lessonLeftPane, lessonRightPane, saveButton, courseID } = this.createLessonPlanner(course);
            const savingArray = [];
            
            if(course.quizArray.length > 0){
                const twoGridContainerForQuizElements = document.createElement("div");
                twoGridContainerForQuizElements.className = "two-column-grid";

                course.quizArray.forEach( weight => {

                    const { lessonItemContainer, savingObject } = this.createWeightElement(weight, courseID, "quiz");
                    twoGridContainerForQuizElements.appendChild(lessonItemContainer);
                    savingArray.push(savingObject);

                });

                lessonRightPane.appendChild(twoGridContainerForQuizElements);
            }

            if(course.quizArray.length > 0 && course.examArray.length > 0){
                const divider = document.createElement("div");
                divider.className = "line-divider";
                lessonRightPane.appendChild(divider);
            }

            if(course.examArray.length > 0){
                const twoGridContainerForExamElements = document.createElement("div");
                twoGridContainerForExamElements.className = "two-column-grid";

                course.examArray.forEach( weight => {
    
                    const { lessonItemContainer, savingObject } = this.createWeightElement(weight, courseID, "exam");
                    twoGridContainerForExamElements.appendChild(lessonItemContainer);
                    savingArray.push(savingObject);
    
                });
    
                lessonRightPane.appendChild(twoGridContainerForExamElements);
            }

            saveButton.addEventListener("click", () => saveWeightsFor(savingArray));

            lessonPlanContainer.appendChild(lessonLeftPane);
            lessonPlanContainer.appendChild(lessonRightPane);
            weightsOuterContainer.appendChild(lessonPlanContainer);

        });

    }
}

function saveWeightsFor(savingArray){

    //TODO: showLoader();
    // const loader = loadLoader("Saving Schedules");

    savingArray.forEach( async (savingObject) => {

        const params = createParametersFrom(savingObject);
        const { isWeightSet } = savingObject;
        let result;

        try{
            switch(isWeightSet){
                case true:
                    result = await updateWeight(params);
                    break;
                case false:
                    result = await newWeight(params);
                    
                    break;
            }

            // TODO: LOADER PROBLEM
            // if(index == lessonElements.length - 1)  {
            //     result.then(() => {
            //         stopLoader(loader);
            //     })
            // }
        }
        catch(error){
            
            //TODO: stopLoader();
            // removeLoader(loader);

        }

    });



}

async function updateWeight(params){

    return new Promise( async (resolve) => {

        await AJAXCall({
            phpFilePath: "../include/weights/updateWeight.php",
            rejectMessage: "Updating Weight Failed",
            params,
            type: "post"
        });

        resolve();
    })

}

async function newWeight(params){
    
    return new Promise( async (resolve) => {

        await AJAXCall({
            phpFilePath: "../include/weights/newWeight.php",
            rejectMessage: "New Weight Failed",
            params,
            type: "post"
        });

        resolve();
    })

}