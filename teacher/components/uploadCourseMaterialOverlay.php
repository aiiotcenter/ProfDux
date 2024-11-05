<div class="overlay upload-overlay">
    <div class="popup">
        <div class="popup-header">
            <div class="close-button" onclick="closeUploadOverlay()">
                <img src="../assets/icons/close.png" alt="">
            </div>
            <h1 class="pop-up-title"><text>Upload Resource</text></h1>

            <label>
                    <div class="loaderesClass" id="loaderesClass" style="display:none"> 
                <p  id="loaderes">Dux Saving Data... </p>
                </div>
                </label>
        </div>

        <div class="popup-body">

            <div class="upload-options-container">

                <label for="imageUploadInput" class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-images.svg" alt="">
                    </div>
                    <p class="upload-option-description"><text>Image</text></p>
                    <input id="imageUploadInput" class="upload-input" type="file" accept="image/*"
                        onchange="loadImageToPopupView(event, '#chosenPhoto')">
                </label>

                <label for="PDFUploadInput" class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-file-pdf.svg" alt="">
                    </div>
                    <p class="upload-option-description">PDF</p>

                    <input id="PDFUploadInput" class="upload-input" type="file" accept="application/pdf"
                        onchange="loadPDFToPopupView(event, '#chosenPhoto')">
                </label>

                <label class="upload-option" style="width:100%;">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-world.svg" alt="" onclick="loadLinkToPopupView()">
                    </div>
                    <p class="upload-option-description"><text>Link</text></p>
                </label>

                <label for="videoUploadInput" class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-clapperboard-play.svg" alt="">
                    </div>
                    <p class="upload-option-description"><text>Video</text></p>
                    <input id="videoUploadInput" class="upload-input" type="file" accept="video/mp4,video/x-m4v"
                        onchange="loadVideoToPopupView(event, '#chosenPhoto')">
                </label>

                <label for="Text-option" class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-pen-clip.svg" alt="" onclick="loadtextToPopupView()">
                    </div>
                    <p class="upload-option-description" onchange="">Text</p>
                </label>
            </div>

            <div class="upload-progress-container" style="display: none" ;>
                <div class="filename-container">
                    <p id="truncatedFilename"></p>
                    <div class="progress" id="global-progress-bar"></div>
                </div>
            </div>

            <!-- Video Preview Container -->
            <div id="videoPreviewContainer" class="videoPreviewContainer" style="display: none;">
                <video id="videoPreview" width="120px" height="90px" controls></video>
            </div>


            <div id="textviewer" class="textviewer" style="display: none; ">

                <p class="upload-option-description">Add text or Announcement</p>
                <input type="text" id="TextToUpload">
            </div>


            <div class="LinkViewer" id="LinkViewer" style="display: none;">
                <p class="upload-option-description">Add URL</p>
                <input type="text" id="LinkToUpload" class="LinkToUpload" placeholder="Enter a link"
                    oninput="showLinkPreview()">
                <div id="preview" style="display: none;"></div>
            </div>

        </div>


        <div class="popup-footer">
            <div class="button-group" id="attachButton">
                <div class="button secondary-button"  onclick="revertUploadChoice()">
                    <text>Cancel</text>
                </div>
                <div class="button"  onclick="startUploading()">
                    <text>Attach</text>
                </div>
            </div>
        </div>
    </div>
</div>