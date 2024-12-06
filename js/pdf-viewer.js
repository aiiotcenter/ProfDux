function openPDFViewer(pdfUrl) {

    

    let body = document.querySelector("body");

    let pdfViewerOverlay = document.createElement("div");
    pdfViewerOverlay.className = "pdf-viewer-overlay";

    let closeButton = document.createElement("div");
    closeButton.className = "close-button";

    let closeButtonIcon = document.createElement("img");
    closeButtonIcon.src = "../assets/icons/close.png";
    closeButton.addEventListener("click", () => closePDFViewer());
    
    let pdfViewer = document.createElement("div");
    pdfViewer.className = "pdf-viewer";

    let pdfIframe = document.createElement("iframe");
    pdfIframe.className = "pdf-frame";
    pdfIframe.setAttribute("width", "100%");
    pdfIframe.setAttribute("height", "100%");
    pdfIframe.src = pdfUrl;

    pdfViewer.appendChild(pdfIframe);
    closeButton.appendChild(closeButtonIcon);

    pdfViewerOverlay.appendChild(closeButton);
    pdfViewerOverlay.appendChild(pdfViewer);

    pdfViewerOverlay.style.display = "grid";
    body.appendChild(pdfViewerOverlay);

  }

  function closePDFViewer() {
    
    document.querySelector('.pdf-frame').src = "";
    let PDFViewerOverlay = document.querySelector('.pdf-viewer-overlay')
    
    PDFViewerOverlay.style.display = 'none';

    setTimeout(() => PDFViewerOverlay.remove() , 1000);

  }