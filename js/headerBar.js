let globalUserDetails;
let DEMOACCOUNT = false;

( async () => {

    let result = await getUserDetails();
    globalUserDetails = result;
    localizeTextElements();
    setHeaderInfo(result);

    if(result.email == "jeriest59@gmail.com"){
        DEMOACCOUNT = true;
    }

})();

function setHeaderInfo(userObject){

    let { role, name, image } = userObject;
    let writtenRole = role;

    let currentPath = window.location.pathname.includes("student");

    if (currentPath){
        writtenRole = "student"
    }
    
    let usernameFields = document.querySelectorAll(".username");
    let imageFields = document.querySelectorAll(".user-image img");
    let usernameInnerContainer = createLocalizedTextElement(name);
    let roleAsTextElement = createLocalizedTextElement(writtenRole);
    
//jeries
    usernameFields.forEach( username => {

        username.innerHTML = "";
        


                username.appendChild(usernameInnerContainer);
                username.appendChild(roleAsTextElement);
   
    });

    imageFields.forEach( imageField => 
        imageField.src = `../uploads/${image}`
    )

}

setTimeout(() => {
    setCurrentLanguageToLocalStorage();
    console.log("currentLanguage: ", document.querySelector("html").lang);
}, 3000);

function getCurrentLanguageFromLocalStorage(){
    return window.localStorage.getItem("lang");
}

function fetchGlobalAvailableLanguages(){
    return ["english", "turkish"];
}

function extrapolateEducationEnvironment(){
    return "university students";
}

function extrapolateLanguage(){
    let language = getCurrentLanguageFromLocalStorage();

    switch(language){
        case "en": return "english"
        case "tr": return "turkish"
        default: return "english"
    }
}

function setCurrentLanguageToLocalStorage() {


    setTimeout(() => {
        let htmlElement = document.querySelector("html");
        window.localStorage.setItem("lang", htmlElement.lang);
        console.log("current Language: ", htmlElement.lang);
    }, 3000)

}

document.body.addEventListener("click", setCurrentLanguageToLocalStorage);