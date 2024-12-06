function animateDialog(message, type = "success"){

    let body = document.querySelector("body");

    let typeDetails = 
        type == "success" ? 
        { 
            imageName: "fi-rr-check-circle.svg",
            title: "Success"
        } : 
        {
            imageName: "fi-rr-cross-circle.svg",
            title: "Error"
        }

    let imagePath = `../assets/icons/${typeDetails.imageName}`;
    let overlay = document.createElement("div");
    overlay.className = 'overlay';
    overlay.innerHTML = 
    `
        <div class="dialog">
            <div class="dialog-header">
                <img class="icon" src="${imagePath}" alt="">
                <h1>${typeDetails.title}</h1>
            </div>
            <p>${message}</p>
        </div>
    `

    body.appendChild(overlay);
    overlay.style.display = "grid";
    let dialog = overlay.querySelector(".dialog");

    setTimeout(() => {

        setTimeout(() => {
            dialog.style.transform = "scale(0)";
            setTimeout(() => {
                overlay.style.display = "none";
                overlay.remove();
            }, 800);
        }, 2000)

        dialog.style.transform = "scale(1)";
    }, 100);
    
}

function showOptionsDialog(messageDetails, callback){

    return new Promise((resolve, reject) => {

        let body = document.querySelector("body");
        let overlay = document.createElement("div");
        overlay.className = 'overlay';
    
        let {
            title,
            denyTitle,
            acceptTitle, 
            message,   
        } = messageDetails;
    
        overlay.innerHTML = 
        `
            <div class="dialog">
                <div class="dialog-header">
                    <h1>${title ?? "Are You Sure?"}</h1>
                    ${message ? `<p class="message">${message}</p>` : ''}
                </div>
    
                <div class="options">
                    <div class="deny">${denyTitle ?? "No"}</div>
                    <div class="accept">${acceptTitle ?? "Yes"}</div>
                </div>
            </div>
        `
    
        body.appendChild(overlay);
    
        let acceptButton = overlay.querySelector('.accept');
        let denyButton = overlay.querySelector('.deny');
        
        acceptButton.addEventListener('click', () => {
            callback();
            closeDialog();
            resolve("accept")
        });
    
        denyButton.addEventListener('click', () => {
           closeDialog();
           resolve("deny")
        });
    
        overlay.style.display = "grid";
        let dialog = overlay.querySelector(".dialog");
    
        setTimeout(() => {
            dialog.style.transform = "scale(1)";
        }, 100);
    
        function closeDialog() {
            dialog.style.transform = "scale(0)";

            setTimeout(() => {
                overlay.style.display = "none";
                overlay.remove();
                
            }, 800);
        }
    })

}
