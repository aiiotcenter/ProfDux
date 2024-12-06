async function findAndFixMissingObjectiveFiles(){

    const filenameResponse = await AJAXCall({
        phpFilePath: "../include/course/getAllObjectivesFilenames.php",
        rejectMessage: "Getting Filenames Failed",
        type: "fetch",
        params: ""
    })

    

    let errors = [];

    for await( fileObject of filenameResponse ){

        let { filename } = fileObject ;
        let correctPath = "../objectives/" + filename;

        // objectivesObjectResponse = fetch(correctPath, {cache: "reload"});

        await fetch(correctPath, {cache: "reload"}).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
            })
            .then((responseJson) => {
            // Do something with the response
            })
            .catch( async(error) => {

                await saveLearningObjectivesAsJSON(filename, []);

                errors.push({
                    ...fileObject
                })
        });
    }

    await saveLearningObjectivesAsJSON(`ObjectiveErrors-${uniqueID(2)}`, errors);
}