class Schedules {
    constructor(schedulesArray) {
        this.schedulesArray = schedulesArray;
    }

    renderSchedules() {
        const schedulesOuterContainer = document.querySelector(
            ".schedules-outer-container"
        );

        // const entries = Object.entries(this.schedulesArray);

        if (this.schedulesArray.length > 0)
            schedulesOuterContainer.innerHTML = "";

        this.schedulesArray.forEach((course) => {
            const lessonPlanContainer = document.createElement("div");
            lessonPlanContainer.className = "lesson-plan-container";

            // Fetch Lesson Image from course ID.

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
            const innerButtonText = createLocalizedTextElement("Save");
            saveButton.appendChild(innerButtonText);
            saveButton.className = "button save-schedule-button";

            lessonLeftPane.appendChild(lessonImageBox);
            lessonLeftPane.appendChild(saveButton);

            const lessonRightPane = document.createElement("div");
            lessonRightPane.className = "lesson-right-pane";

            saveButton.addEventListener("click", () =>
                saveSchedulesFor(lessonRightPane)
            );

            if (course.lectures.length > 0) {
                const miniLectureTitle = document.createElement("div");
                miniLectureTitle.className = "mini-title";
                miniLectureTitle.textContent = "Lecture Times";
                lessonRightPane.appendChild(miniLectureTitle);
            }

            course.lectures.forEach((lecture) => {
                const lessonItemContainer = document.createElement("div");
                lessonItemContainer.className = "lesson-item-container";

                const lessonNumbering = document.createElement("div");
                lessonNumbering.className = "numbering";

                const lessonItemInnerContainer = document.createElement("div");
                lessonItemInnerContainer.className =
                    "lesson-item-inner-container";

                const lessonTitle = document.createElement("div");
                lessonTitle.className = "lesson-title";
                lessonTitle.textContent = lecture.title;

                const lessonTime = document.createElement("div");
                lessonTime.className = "lesson-time";

                const lessonTimeInput = document.createElement("input");
                lessonTimeInput.setAttribute("type", "date");
                lessonTimeInput.className = "date-input";

                if (lecture.time.length > 0) {
                    let date = lecture.time[0].timeStart.split("T");
                    lessonTimeInput.value = date[0];

                    lessonTimeInput.setAttribute("isScheduleSet", "true");
                } else {
                    lessonTimeInput.setAttribute("isScheduleSet", "false");
                }

                lessonTimeInput.setAttribute("lectureID", lecture.id);

                lessonTime.appendChild(lessonTimeInput);

                lessonItemInnerContainer.appendChild(lessonTitle);
                lessonItemInnerContainer.appendChild(lessonTime);

                lessonItemContainer.appendChild(lessonNumbering);
                lessonItemContainer.appendChild(lessonItemInnerContainer);

                lessonRightPane.appendChild(lessonItemContainer);
            });

            if (course.exams.length > 0 && course.lectures.length > 0) {
                const divider = document.createElement("div");
                divider.className = "line-divider";
                lessonRightPane.appendChild(divider);
            }

            if (course.exams.length > 0) {
                const miniExamTitle = document.createElement("div");
                miniExamTitle.className = "mini-title";
                miniExamTitle.textContent = "Exam Times";
                lessonRightPane.appendChild(miniExamTitle);
            }

            course.exams.forEach((exam) => {
                const lessonItemContainer = document.createElement("div");
                lessonItemContainer.className = "lesson-item-container";

                const lessonNumbering = document.createElement("div");
                lessonNumbering.className = "numbering";

                const lessonItemInnerContainer = document.createElement("div");
                lessonItemInnerContainer.className =
                    "lesson-item-inner-container";

                const lessonTitle = document.createElement("div");
                lessonTitle.className = "lesson-title";
                lessonTitle.textContent = exam.title;

                const lessonTime = document.createElement("div");
                lessonTime.className = "lesson-time";

                const lessonTimeInput = document.createElement("input");
                lessonTimeInput.setAttribute("type", "date");
                lessonTimeInput.className = "date-input";

                if (exam.time.length > 0) {
                    let date = exam.time[0].timeStart.split("T");
                    lessonTimeInput.value = date[0];

                    lessonTimeInput.setAttribute("isScheduleSet", "true");
                } else {
                    lessonTimeInput.setAttribute("isScheduleSet", "false");
                    lessonTitle.innerHTML = `
                        <div class="two-column-grid">
                            <p>${exam.title}</p>
                            <div class="alert-badge" style="justify-self:end;">time not set</div>
                        </div>
                    `;
                }

                lessonTimeInput.setAttribute("lectureID", exam.id);

                lessonTime.appendChild(lessonTimeInput);

                lessonItemInnerContainer.appendChild(lessonTitle);
                lessonItemInnerContainer.appendChild(lessonTime);

                lessonItemContainer.appendChild(lessonNumbering);
                lessonItemContainer.appendChild(lessonItemInnerContainer);

                lessonRightPane.appendChild(lessonItemContainer);
            });

            lessonPlanContainer.appendChild(lessonLeftPane);
            lessonPlanContainer.appendChild(lessonRightPane);

            schedulesOuterContainer.appendChild(lessonPlanContainer);

            // HTML Rendering

            // <div class="lesson-item-container">
            //     <div class="numbering"></div>
            //     <div class="lesson-item-inner-container">
            //         <div class="lesson-title">Lecture 1 Intro For Medicine Students</div>
            //         <div class="lesson-time">
            //             <input type="date" class="date-input"/>
            //         </div>
            //     </div>
            // </div>
        });
    }
}

function saveSchedulesFor(lessonParentContainer) {
    let lessonElements = lessonParentContainer.querySelectorAll(".date-input");

    //TODO: showLoader();
    // const loader = loadLoader("Saving Schedules");

    lessonElements.forEach(async (lessonElement, index) => {
        let time = lessonElement.value;
        let isScheduleSet = lessonElement.getAttribute("isScheduleSet");
        let lectureID = lessonElement.getAttribute("lectureID");

        let JSONTime = new Date(time).toJSON();

        const id = uniqueID(1);
        let params = `id=${id}&&foreignID=${lectureID}&&timeStart=${JSONTime}`;

        let result;

        try {
            switch (isScheduleSet) {
                case "true":
                    result = await updateScheduleTime(params);
                    break;
                case "false":
                    if (JSONTime) result = await newScheduleTime(params);
                    break;
            }

            // TODO: LOADER PROBLEM
            // if(index == lessonElements.length - 1)  {
            //     result.then(() => {
            //         stopLoader(loader);
            //     })
            // }
        } catch (error) {
            //TODO: stopLoader();
            // removeLoader(loader);
        }
    });
}

async function updateScheduleTime(params) {
    return new Promise(async (resolve) => {
        await AJAXCall({
            phpFilePath: "../include/schedule/updateSchedule.php",
            rejectMessage: "Updating Schedule Failed",
            params,
            type: "post",
        });

        resolve();
    });
}

async function newScheduleTime(params) {
    return new Promise(async (resolve) => {
        await AJAXCall({
            phpFilePath: "../include/schedule/newSchedule.php",
            rejectMessage: "New Schedule Failed",
            params,
            type: "post",
        });

        resolve();
    });
}
