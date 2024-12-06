class Messaging {

    limit = 250;
    filter = "inbox";

    constructor(courseDetails){
        const { senderID, type } = courseDetails;
        this.senderID = senderID;
        this.type = type;

        this.messageObject = {
            type: this.type,
            senderID: this.senderID,
        }

        this.render();
    }

    async render(){

        const response = await this.fetchMessages();
        
        

        if(response == "success" && this.messages.length > 0){

            this.messageRenderContainer.innerHTML = "";

            this.messages.forEach( message => {
                this.messageRenderContainer.append(this.renderMessageRow(message));
            });
        }else{
            
            // render error message
        }
        
    }

    renderMessageRow(messageObject){

        const messageRow = document.createElement("div");
        messageRow.className = "message-row";

        const senderImageContainer = document.createElement("div");
        senderImageContainer.className = "sender-image";

        const senderImage = document.createElement("img");
        senderImage.src = `../uploads/${messageObject.image}`;
        senderImageContainer.append(senderImage);

        const messageContentContainer = document.createElement("div");
        messageContentContainer.className = "message-content-container";

        const senderName = document.createElement("div");
        senderName.className = "sender-name";
        senderName.textContent = messageObject.name;

        const messageContent = document.createElement("div");
        messageContent.className = "message-content";
        messageContent.textContent = messageObject.message

        messageContentContainer.append(senderName)
        messageContentContainer.append(messageContent)

        messageRow.append(senderImageContainer)
        messageRow.append(messageContentContainer)

        messageRow.addEventListener("click", () => {
            openPopup(".view-messsage-overlay")
            this.messageViewSender.value = messageObject.name;
            this.messageViewContainer.textContent = messageObject.message;
        })

        return messageRow;
 
    }

    async fetchMessages(){

        let phpFilePath;
        
        const params = {
            filter: this.filter,
            senderID: this.senderID,
            type: this.type
        }



        switch(this.type){
            case 'announcement':
               phpFilePath =  "../include/messaging/getAnnouncements.php"
            break;
            default:
               phpFilePath =  "../include/messaging/getDirectMessages.php"
            break;
        }
        
        return new Promise(async (resolve, reject) => {
            
            try{
                const messages = await AJAXCall({
                    phpFilePath,
                    params: createParametersFrom(params),
                    rejectMessage: "fetching messages failed",
                    type: 'fetch'
                }); 
                
                this.messages = messages;
                resolve("success");
            }
            catch(error){
                reject("error");
            }
        })

    }

    setMessageContainer(element){
        this.directMessageContainer = element

        

        this.directMessageContainer.addEventListener("input", (event) => {
            const message = event.target.textContent
            if(this.withinLimit(message)){
                this.message = message;
            }
            else{
                this.directMessageContainer.textContent = this.message;
            }
        })
    }

    setLimitElement(element){
        this.limitElement = element;
        this.updateLimitElement(0);
    }

    updateLimitElement(value){
        this.limitElement.textContent = `${value} / ${this.limit}`
    }   

    setSendMessageButton(element){
        this.directMessageButton = element;

        this.directMessageButton.addEventListener("click", () => {
            this.prepareToSendMessage();
        });
    }

    setMessageRenderContainer(element){
        this.messageRenderContainer = element;
    }

    setMessageViewSender(element){
        this.messageViewSender = element;
    }

    setMessageViewContainer(element){
        this.messageViewContainer = element;
    }

    setLoader(element){
        this.loader = element;
    }

    withinLimit(text){
        if(text.length <= this.limit) {
            this.updateLimitElement(text.length);
            return true
        }
        return false;
    }

    setMessageFilterContainer(element){
        this.messageFilterContainer = element;
        this.receiverInputField = this.messageFilterContainer.querySelector("input");
        this.receiverFilterList = this.messageFilterContainer.querySelector("div");

        this.receiverInputField.addEventListener("input", async (event) => {
            const searchContent = event.target.value;
            

            if(searchContent.length > 0){
                const results = await this.searchThroughReceivers(searchContent);
                this.renderReceiverFilterList(results);
                this.receiverFilterList.style.display = "grid";
            }
        })
    }

    searchThroughReceivers(input){

        let phpFilePath;

        

        switch(this.type){
            case "announcement":
                phpFilePath = "../include/messaging/searchThroughCourses.php"
                break;
            case "direct":
                phpFilePath = "../include/messaging/searchThroughUsers.php";
                break;
        }
        return new Promise( async (resolve, reject) => {

            const result = await AJAXCall({
                phpFilePath,
                rejectMessage: "something went wrong searching",
                type: "fetch",
                params: `input=${input}&&senderID=${this.senderID}`
            })

            

            resolve(result);
        })
    }

    renderReceiverFilterList(results){

        

        this.receiverFilterList.innerHTML = '';

        results.forEach( filterItem => {
            this.receiverFilterList.append(this.renderFilterItem(filterItem));
        })

    }

    renderFilterItem(data){
        const filterItem = document.createElement("div");
        filterItem.className = "filter-item";
        filterItem.textContent = data.name;

        filterItem.addEventListener("click", () => {
            this.receiverInputField.value = data.name;
            this.receiverID = data.id;
            this.receiverFilterList.style.display = "none";
        })

        return filterItem;
    }

    async prepareToSendMessage(){

        this.messageObject = {
            ...this.messageObject,
            id: uniqueID(1),
            message: this.message,
            receiverID: this.receiverID,
            timeSent: `${(new Date()).toJSON()}`,
        }

        this.loader.style.display = "grid";
        await sendMessage(this.messageObject);
        this.loader.style.display = "none";

        handleClosePopup(this, this.type);
        this.render();

    }

}

async function sendMessage(messageObject){

    const params = createParametersFrom(messageObject);

    return new Promise( async (resolve, reject) => {

        try {
            const result = await AJAXCall({
                phpFilePath: "../include/messaging/addMessage.php",
                rejectMessage: "adding direct message failed",
                type: "post",
                params
            });

            resolve(result);

        }
        catch(error){
            
            reject(error);
        }
    })
}

function handleClosePopup(that, type){

    switch(type){
        case "announcement":
            closePopup('.send-announcement-overlay');
            clearTextContent('#announcementContainer');
            break;
        case "direct":
            closePopup('.send-direct-messsage-overlay');
            clearTextContent('#directMessageContainer');
            break;
    }

    that.updateLimitElement(0);
}

// DONE: Render Message Rows -> ( userDetails + messaging ) 20 minutes
// DONE: Open a message row and reveal the message -> ( new popup ) 20 minutes
// DONE: Loaders -> 20 minutes
// DONE: Class Announcements -> 20 minutes
// DONE: Dropdown -> 30 minutes
// TODO: Inbox and Sent -> 30 minutes to 1 hour
// TODO: Student version -> 20 minutes