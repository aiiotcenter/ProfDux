function openVideoViewer(videoURL, type = "video/mp4") {

    let body = document.querySelector("body");

    let videoViewerOverlay = document.createElement("div");
    videoViewerOverlay.className = "video-viewer-overlay";

    let closeButton = document.createElement("div");
    closeButton.className = "close-button";

    let closeButtonIcon = document.createElement("img");
    closeButtonIcon.src = "../assets/icons/close.png";
    closeButton.addEventListener("click", () => closeVideoViewer());

    let videoElement = document.createElement("video");
    videoElement.setAttribute("controls", "");
    videoElement.setAttribute("preload", "auto");
    videoElement.setAttribute("data-setup", "{}");

    let source = document.createElement("source");
    source.src = videoURL
    source.type = type;

    videoElement.appendChild(source);

    closeButton.appendChild(closeButtonIcon);

    videoViewerOverlay.appendChild(videoElement);
    videoViewerOverlay.appendChild(closeButton);
    videoViewerOverlay.style.display = "grid";
    body.appendChild(videoViewerOverlay);

}

function openyyoutubeViewer(videoURL) {

    let body = document.querySelector("body");

    let videoViewerOverlay = document.createElement("div");
    videoViewerOverlay.className = "video-viewer-overlay";

    let closeButton = document.createElement("div");
    closeButton.className = "close-button";

    let closeButtonIcon = document.createElement("img");
    closeButtonIcon.src = "../assets/icons/close.png";
    closeButton.addEventListener("click", () => closeVideoViewer());

    let videoElement = document.createElement("iframe");
    videoElement.id = "videoFrame";
    videoElement.setAttribute("controls", "");
    videoElement.setAttribute("preload", "auto");
    videoElement.setAttribute("data-setup", "{}");
    videoElement.src = videoURL.replace('watch?v=', 'embed/')+"?autoplay=1";
    videoElement.allow = "autoplay; encrypted-media";

//     <div class="video-container">
//     <iframe id="videoFrame" src="" width="560" height="315" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
// </div>


    closeButton.appendChild(closeButtonIcon);

    videoViewerOverlay.appendChild(videoElement);
    videoViewerOverlay.appendChild(closeButton);
    videoViewerOverlay.style.display = "grid";
    body.appendChild(videoViewerOverlay);

}

  function closeVideoViewer() {
    
    let videoViewerOverlay = document.querySelector('.video-viewer-overlay')
    
    videoViewerOverlay.style.display = 'none';

    setTimeout(() => videoViewerOverlay.remove() , 1000);

  }
