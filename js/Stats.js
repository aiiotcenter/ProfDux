async function loadGrades(courseObject) {
    const { id } = courseObject;

    openPopup(".load-grades-container");

    try {
        let quizStructure = await AJAXCall({
            phpFilePath: "../include/quiz/getQuizStructure.php",
            rejectMessage: "Getting Structure Failed",
            params: `id=${id}`,
            type: "fetch",
        });

        let examStructure = await AJAXCall({
            phpFilePath: "../include/exam/getExamStructure.php",
            rejectMessage: "Getting Structure Failed",
            params: `id=${id}`,
            type: "fetch",
        });

        console.log("examStructure:", examStructure);

        let result = await AJAXCall({
            phpFilePath: "../include/quiz/getCourseGrades.php",
            rejectMessage: "Getting Course Grades Failed",
            params: `id=${id}`,
            type: "fetch",
        });

        let courseWeights = await AJAXCall({
            phpFilePath: "../include/weights/getCourseWeights.php",
            rejectMessage: "Getting Course Weights Failed",
            params: `id=${id}`,
            type: "fetch",
        });

        const quizGrades = result.quizGrades;
        const examGrades = result.examGrades;

        console.log("grades:", quizGrades, examGrades);

        let structureObjectArray =
            quizStructure.length <= 0
                ? [
                      {
                          name: `...`,
                          id: "000",
                          totalMarks: 0,
                          weight: 0,
                      },
                  ]
                : [];

        let studentsObjectArray;
        let quizObjectArray = [];
        let examObjectArray = [];
        let weightObjectArray = courseWeights[0];

        quizStructure.forEach((structureItem) => {
            //
            //
            //

            let foundWeight;

            weightObjectArray.quizArray.forEach((quiz) => {
                if (quiz.id == structureItem.id) {
                    if (quiz.weight) {
                        foundWeight = quiz.weight.value;
                    } else {
                        foundWeight = null;
                    }

                    return;
                }
            });

            structureObjectArray.push({
                name: foundWeight
                    ? `Quiz ${structureItem.hierarchy} (${structureItem.totalMarks}) (${foundWeight}%)`
                    : `Quiz ${structureItem.hierarchy} (Not Set)`,
                id: structureItem.id,
                totalMarks: structureItem.totalMarks,
                weight: foundWeight,
            });
        });

        quizGrades.forEach((quizObject) => {
            const entries = Object.entries(quizObject)[0];
            const studentID = entries[0];
            const quizData = entries[1];

            console.log("quizData: ", quizData);

            let details = quizObject.details;
            let content = [];
            let calculatableContent = [];
            let totalMark;
            let foundWeight;

            structureObjectArray.forEach((structure) => {
                let foundQuizValue = null;

                quizData.forEach((quiz) => {
                    if (structure.id == quiz.quizID) {
                        foundQuizValue = quiz.value;
                        return;
                    }
                });

                let roundedResult = 0;
                let result;

                if (structure.weight != null && foundQuizValue != null) {
                    calculatedResult =
                        (foundQuizValue / structure.totalMarks) *
                        structure.weight;
                    roundedResult = Math.floor(calculatedResult * 100) / 100;
                    result = foundQuizValue;
                } else {
                    result = "-";
                }

                content = [...content, result];
                calculatableContent = [...calculatableContent, roundedResult];
            });

            totalMark = calculatableContent.reduce((a, b) => a + b, 0);

            quizObjectArray = [
                ...quizObjectArray,
                {
                    studentID,
                    content,
                    totalMark,
                    details,
                },
            ];
        });

        examStructure.forEach((structureItem) => {
            let foundWeight;

            weightObjectArray.examArray.forEach((exam) => {
                if (exam.id == structureItem.id) {
                    if (exam.weight) {
                        foundWeight = exam.weight.value;
                    } else {
                        foundWeight = null;
                    }

                    return;
                }
            });

            structureObjectArray.push({
                name: foundWeight
                    ? `Exam ${structureItem.hierarchy} (${structureItem.totalMarks}) (${foundWeight}%)`
                    : `Exam ${structureItem.hierarchy} (Not Set)`,
                id: structureItem.id,
                totalMarks: structureItem.totalMarks,
                weight: foundWeight,
            });
        });

        examGrades.forEach((examObject) => {
            const entries = Object.entries(examObject)[0];
            const studentID = entries[0];
            const examData = entries[1];

            console.log("examData: ", examData);

            let details = examObject.details;
            let content = [];
            let calculatableContent = [];
            let totalMark;
            let foundWeight;

            structureObjectArray.forEach((structure) => {
                let foundExamValue = null;

                examData.forEach((exam) => {
                    if (structure.id == exam.examID) {
                        foundExamValue = exam.value;
                        return;
                    }
                });

                let roundedResult = 0;
                let result;

                if (structure.weight != null && foundExamValue != null) {
                    calculatedResult =
                        (foundExamValue / structure.totalMarks) *
                        structure.weight;
                    roundedResult = Math.floor(calculatedResult * 100) / 100;
                    result = foundExamValue;
                } else {
                    result = "-";
                }

                content = [...content, result];
                calculatableContent = [...calculatableContent, roundedResult];
            });

            totalMark = calculatableContent.reduce((a, b) => a + b, 0);

            examObjectArray = [
                ...examObjectArray,
                {
                    studentID,
                    content,
                    totalMark,
                    details,
                },
            ];
        });

        console.log("structureObjectArray", structureObjectArray);
        console.log("quizObjectArray", quizObjectArray);
        console.log("examObjectArray", examObjectArray);
        console.log("weightObjectArray", weightObjectArray);
        console.log("hell5");

        quizObjectArray.forEach((object, i) => {
            console.log("length: ", object.content.length);
            for (let index = 0; index < object.content.length; index++) {
                examObjectArray[i] &&
                    examObjectArray[i].content.shift();
            }
        });

        console.log("hello3");
        console.log("hello4");

        const obj = examObjectArray.map((examObject, index) => {

            console.log("this one: ", examObject.content);

            return {
                studentID: examObject.studentID,
                totalMark:
                    examObject.totalMark + quizObjectArray[index].totalMark,
                details: examObject.details,
                content: [...quizObjectArray[index].content, ...examObject.content],
            };
        });

        console.log("obj: ", obj);

        let statsView = new StatsView(
            structureObjectArray,
            [],
            obj,
            weightObjectArray
        );
        statsView.render();
    } catch (error) {}
}
