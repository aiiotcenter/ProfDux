class GradesView {

    constructor(gradesArray){
        this.gradesArray = gradesArray
    }

    renderGrades(){

        const gradesOuterContainer = document.querySelector(".personal-grades-outer-container");
    
        if(this.gradesArray.grades.length > 0) gradesOuterContainer.innerHTML = "";

        console.log("gradesObject: ", this.gradesArray);
        
        this.gradesArray.grades.forEach( course => {

            const lessonPlanContainer = document.createElement("div");
            lessonPlanContainer.className = "lesson-plan-container";


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

            lessonLeftPane.appendChild(lessonImageBox);

            const lessonRightPane = document.createElement("div");
            lessonRightPane.className = "lesson-right-pane adjustable";

            if(course.quizGrades && course.quizGrades.length <= 0 || course.examGrades && course.examGrades.length <= 0 ){
                const emptyView = document.createElement("div");
                emptyView.className = "empty-view";
                emptyView.textContent = `No assessments done yet`;
                lessonRightPane.appendChild(emptyView);
            }else{
                course.quizGrades.forEach( gradeObject => {

                    const gradeElementContainer = document.createElement("div");
                    gradeElementContainer.className = "grade-element-container";

                    const gradeElementTitle = document.createElement("div");
                    gradeElementTitle.className = "grade-element-title";
                    gradeElementTitle.textContent = `Quiz ${gradeObject.hierarchy}`

                    const gradeElementResultContainer = document.createElement("div");
                    gradeElementResultContainer.className = "grade-element-result-container";

                    const gradeElementResultValue = document.createElement("div");
                    gradeElementResultValue.className = "grade-element-result-value";
                    gradeElementResultValue.textContent = gradeObject.value

                    const delimeter = document.createElement("div");
                    delimeter.className = "delimeter";
                    delimeter.textContent = "/";

                    const gradeElementTotal = document.createElement("div");
                    gradeElementTotal.className = "grade-element-total";
                    gradeElementTotal.textContent = gradeObject.totalMarks;

                    gradeElementResultContainer.append(gradeElementResultValue)
                    gradeElementResultContainer.append(delimeter)
                    gradeElementResultContainer.append(gradeElementTotal)

                    gradeElementContainer.appendChild(gradeElementTitle)
                    gradeElementContainer.appendChild(gradeElementResultContainer)

                    lessonRightPane.append(gradeElementContainer);
                    
                });

                course.examGrades.forEach( gradeObject => {

                    const gradeElementContainer = document.createElement("div");
                    gradeElementContainer.className = "grade-element-container";

                    const gradeElementTitle = document.createElement("div");
                    gradeElementTitle.className = "grade-element-title";
                    gradeElementTitle.textContent = `Exam ${gradeObject.hierarchy}`

                    const gradeElementResultContainer = document.createElement("div");
                    gradeElementResultContainer.className = "grade-element-result-container";

                    const gradeElementResultValue = document.createElement("div");
                    gradeElementResultValue.className = "grade-element-result-value";
                    gradeElementResultValue.textContent = gradeObject.value

                    const delimeter = document.createElement("div");
                    delimeter.className = "delimeter";
                    delimeter.textContent = "/";

                    const gradeElementTotal = document.createElement("div");
                    gradeElementTotal.className = "grade-element-total";
                    gradeElementTotal.textContent = gradeObject.totalMarks;

                    gradeElementResultContainer.append(gradeElementResultValue)
                    gradeElementResultContainer.append(delimeter)
                    gradeElementResultContainer.append(gradeElementTotal)

                    gradeElementContainer.appendChild(gradeElementTitle)
                    gradeElementContainer.appendChild(gradeElementResultContainer)

                    lessonRightPane.append(gradeElementContainer);
                    
                });
            }


            lessonPlanContainer.appendChild(lessonLeftPane);
            lessonPlanContainer.appendChild(lessonRightPane);

            gradesOuterContainer.appendChild(lessonPlanContainer);

        });

    }
}