async function parseExcelForObjectives(url){

    const file = await (await fetch(url)).arrayBuffer();

    const workbook = XLSX.read(file);
    const worksheetsObject = workbook.Sheets;

    let entries = Object.entries(worksheetsObject);
        
    const worksheets = entries.map( ([key, val] = entry) => {
        return val;
    });

    const lessonStructuredObjects = XLSX.utils.sheet_to_json(worksheets[0]);
    console.log(lessonStructuredObjects);

    function checkIfExistsInObject(Object, ...keyArray){
        try{
            let key = false;
            keyArray.forEach( _key => { if(Object[_key]) key = _key })
            return key
        }catch(error){ return false }
    }

    let resultObjectArray = [];

    lessonStructuredObjects.forEach( rowObject => {

        let key = checkIfExistsInObject(rowObject, "Kazanım");

        pushNewObjective(key);

        function pushNewObjective(key){

            // if(currentPosition != null) resultObjectArray.push(currentObject)

            
            let doesTitleTextExist = checkIfExistsInObject(rowObject, key);
            const objective = doesTitleTextExist ? rowObject[key] : null;

            filter(objective, [key, null]) ? false : resultObjectArray.push(objective);

        }

        function filter(item, comparisons){
            let isTheSame = false;

            comparisons.forEach( element => {
                if(element == item ) {
                    isTheSame = true;
                    return;
                }
            });

            return isTheSame;
        }
    });

    showObjectivesFromExcel(resultObjectArray);

};

async function showObjectivesFromExcel(objectivesList) {
    let loader = loadLoader("Extracting Objectives");
  
    let mainContainer = document.querySelector(".main-container");
    let courseID = mainContainer.getAttribute("data-id");
  
    console.log("id:", courseID);
  
    const objectives = objectivesList.map((objective, index) => {
      return {id: uniqueID(), hierarchy: index + 1, title: objective, courseID, action: "new" };
    });
  
    let addLearningObjectiveButton = findElement(
      ".add-learning-objective-button"
    );
    let saveLearningObjectivesButton = findElement(
      ".save-learning-objectives-button"
    );
  
    console.log("objectivesObject: ", objectives);
  
    let learningObjectives = new Objectives({ courseID, objectives }, "overwrite");
    learningObjectives.renderObjectives();
    learningObjectives.setAddNewObjectiveButton(addLearningObjectiveButton);
    learningObjectives.setSaveLearningObjectivesButton(
      saveLearningObjectivesButton
    );
  
    removeLoader(loader);
  }


function loadExcelToObjectiveSheetView(event){
    
    let file = event.target.files[0];

    const objectURL = window.URL.createObjectURL(file);
    
    parseExcelForObjectives(objectURL);

}
