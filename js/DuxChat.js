class DuxChat {
  messagesView;

  constructor(
    startMessage = "Hello, I am dux, you can ask me educational questions."
  ) {
    this.startMessage = startMessage;

    (async () => {
      try {
        let response = await fetchOpenAIKey();
        // console.log(response[0].value);
        this.apiKey = response[0].value;
      } catch (error) {
        console.log(error);
      }
    })();
  }

  addTextBoxInputElement(textInput) {
    this.textInput = textInput;
    this.textInput.addEventListener("keypress", (e) => {
      if (e.keyCode == 13) {
        this.initiateDuxResponse();
      }
    });
  }

  addSendButtonElement(button) {
    this.sendButton = button;
    this.sendButton.addEventListener("click", () => {
      this.initiateDuxResponse();
    });
  }

  addMessagesView(view) {
    this.messagesView = view;
  }

  startChatEngine() {
    this.messagesView.innerHTML = "";
    this.renderDuxMessageFor(this.startMessage, "forced");
  }

  renderMyMessage(message) {
    const myMessageContainer = document.createElement("li");
    myMessageContainer.className = "mine";

    // This format
    // <li class="mine">
    //     <p class="name-tag">IA</p>
    //     <p>Hello</p>
    // </li>

    const myIcon = document.createElement("div");
    myIcon.className = "name-tag";
    myIcon.textContent = "ME";

    const myMessageText = document.createElement("div");
    myMessageText.className = "message-text";
    myMessageText.innerHTML = message;

    myMessageContainer.append(myIcon);
    myMessageContainer.append(myMessageText);
    this.messagesView.append(myMessageContainer);
  }

  initiateDuxResponse() {
    let message = this.textInput.value;

    if (message.length > 0) {
      this.renderMyMessage(message);
      this.textInput.value = "";
      this.renderDuxMessageFor(message);
    }
  }

  renderDuxMessageFor(message, type) {
    const loader = `
        <div class="dux-message-loader">
            <div class="sk-flow">
                <div class="sk-flow-dot"></div>
                <div class="sk-flow-dot"></div>
                <div class="sk-flow-dot"></div>
            </div>
        </div>`;

    const duxMessageContainer = document.createElement("li");
    duxMessageContainer.className = "foreign foreign-a";

    const silentGif = "../assets/images/secoSpritesilent.gif";

    const duxIcon = document.createElement("div");
    duxIcon.className = "name-tag";
    duxIcon.textContent = silentGif;

    const duxMessageText = document.createElement("div");
    duxMessageText.className = "message-text";
    duxMessageText.innerHTML = loader;

    const duxListenButton = document.createElement("div");
    duxListenButton.className = "play-button";

    const duxListenIcon = document.createElement("img");
    duxListenIcon.src = "../assets/icons/speaker.png";
    duxListenButton.append(duxListenIcon);

    duxMessageText.innerHTML = loader;

    duxMessageContainer.append(duxIcon);
    duxMessageContainer.append(duxMessageText);
    duxMessageContainer.append(duxListenButton);
    this.messagesView.append(duxMessageContainer);

    // fetch message;

    if (type != "forced")
      (async () => {
        let responseMessage = await generateGPTResponseFor(message);
        console.log(responseMessage);

        setTimeout(() => {
          duxMessageText.innerHTML = "";
          duxMessageText.textContent = responseMessage;
        }, 2000);
      })();
    else duxMessageText.textContent = message;
  }
}

let duxChat = new DuxChat();

let sendButton = document.querySelector(".send-message");
let inputText = document.querySelector(".message-typing-input");
let messagesView = document.querySelector(".messages-container");

duxChat.addSendButtonElement(sendButton);
duxChat.addTextBoxInputElement(inputText);
duxChat.addMessagesView(messagesView);

duxChat.startChatEngine();

function startDuxChat() {
  let duxChatIcon = document.querySelector(".dux-icon");
  let duxChatOverlay = document.querySelector(".dux-overlay");
  let closeButton = duxChatOverlay.querySelector(".close-button");
  let chatContainer = duxChatOverlay.querySelector(".chat-container");

  duxChatOverlay.style.padding = "0px 100px 100px 100px";
  duxChatOverlay.style.right = "0px";
  duxChatOverlay.style.bottom = "0px";
  duxChatOverlay.style.height = "100vh";
  duxChatOverlay.style.width = "100vw";
  duxChatOverlay.style.borderRadius = "0px";

  duxChatIcon.style.display = "none";

  setTimeout(() => {
    closeButton.style.display = "grid";
    chatContainer.style.display = "grid";
  }, 1000);
}

function closeDuxChat() {
  let duxChatIcon = document.querySelector(".dux-icon");
  let duxChatOverlay = document.querySelector(".dux-overlay");
  let closeButton = duxChatOverlay.querySelector(".close-button");
  let chatContainer = duxChatOverlay.querySelector(".chat-container");

  closeButton.style.display = "none";
  chatContainer.style.display = "none";

  duxChatOverlay.style.padding = "0px";
  duxChatOverlay.style.right = "30px";
  duxChatOverlay.style.bottom = "30px";
  duxChatOverlay.style.height = "70px";
  duxChatOverlay.style.width = "70px";
  duxChatOverlay.style.borderRadius = "50%";

  setTimeout(() => {
    duxChatIcon.style.display = "block";
  }, 300);
}
