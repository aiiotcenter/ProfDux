async function loadGrades(courseObject){

    const { id } = courseObject;
    
    

    openPopup(".load-grades-container");

    try {

        let quizStructure = await AJAXCall({
            phpFilePath: "../include/quiz/getQuizStructure.php",
            rejectMessage: "Getting Structure Failed",
            params: `id=${id}`,
            type: "fetch"
        });
        
        let result = await AJAXCall({
            phpFilePath: "../include/quiz/getCourseGrades.php",
            rejectMessage: "Getting Course Grades Failed",
            params: `id=${id}`,
            type: "fetch"
        });

        let courseWeights = await AJAXCall({
            phpFilePath: "../include/weights/getCourseWeights.php",
            rejectMessage: "Getting Course Weights Failed",
            params: `id=${id}`,
            type: "fetch"
        });

        const quizGrades = result.quizGrades
        
        
        

        let structureObjectArray = quizStructure.length <= 0 ? [
            { 
                name: `...`,
                id: "000",
                totalMarks: 0,
                weight: 0
            }
        ] : [];

        let studentsObjectArray;
        let quizObjectArray = [];
        let examObjectArray;
        let weightObjectArray = courseWeights[0];

        quizStructure.forEach( structureItem => {
            // 
            //  
            // 

            let foundWeight;

            weightObjectArray.quizArray.forEach( quiz => {
                if(quiz.id == structureItem.id) {

                    if(quiz.weight){
                        foundWeight = quiz.weight.value;
                    }
                    else {
                        foundWeight = null;
                    }

                    return;
                }
            });

            structureObjectArray.push({ 
                name: foundWeight ? 
                `Quiz ${structureItem.hierarchy} (${structureItem.totalMarks}) (${foundWeight}%)` :
                `Quiz ${structureItem.hierarchy} (Not Set)`
                ,
                id: structureItem.id,
                totalMarks: structureItem.totalMarks,
                weight: foundWeight
            })
        });

        quizGrades.forEach( quizObject => {

             
            

            const entries = Object.entries(quizObject)[0];
            const studentID = entries[0];
            const quizData = entries[1];

            

            let details = quizObject.details;
            let content = [];
            let calculatableContent = [];
            let totalMark
            let foundWeight;

            

            structureObjectArray.forEach( structure => {

                let foundQuizValue = null;

                quizData.forEach( quiz => {
                    if(structure.id == quiz.quizID) {
                        foundQuizValue = quiz.value;
                        return;
                    }
                })

                let roundedResult = 0;
                let result;

                if(structure.weight != null && foundQuizValue != null){
                    calculatedResult = (foundQuizValue / structure.totalMarks) * structure.weight;
                    roundedResult = Math.floor(calculatedResult * 100) / 100;
                    result = foundQuizValue;
                }else{
                    result = "-";
                }

                content = [ ...content, result ];
                calculatableContent = [ ...calculatableContent, roundedResult ];

            });

            
            totalMark = calculatableContent.reduce((a,b) => a+b, 0);

            quizObjectArray = [ ...quizObjectArray , {
                studentID,
                content,
                totalMark, 
                details,
            }]

            
        });

        let statsView = new StatsView(structureObjectArray,[], quizObjectArray, examObjectArray, weightObjectArray);
        statsView.render();

    }catch(error){
    }

}