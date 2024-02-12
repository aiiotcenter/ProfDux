<div class="overlay upload-overlay">
    <div class="popup">
        <div class="popup-header">
            <div class="close-button" onclick="closeUploadOverlay()">
                <img src="../assets/icons/close.png" alt="">
            </div>
            <h1 class="pop-up-title">Upload Resource</h1> 
        </div>

        <div class="popup-body">

            <div class="upload-options-container">

                <label for="imageUploadInput" class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-images.svg" alt="">
                    </div>
                    <p class="upload-option-description"><text>Image</text></p>
                    <input id="imageUploadInput" class="upload-input" type="file" accept="image/*" onchange="loadImageToPopupView(event, '#chosenPhoto')">
                </label>

                <!-- <label for="videoUploadInput" class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-clapperboard-play.svg" alt="">
                    </div>
                    <p class="upload-option-description"><text>Video</text></p>
                    <input id="videoUploadInput" class="upload-input" type="file" accept="video/mp4,video/x-m4v" onchange="loadVideoToPopupView(event, '#chosenPhoto')">
                </label> -->

                <label for="PDFUploadInput" class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-file-pdf.svg" alt="">
                    </div>
                    <p class="upload-option-description">PDF</p>
                    <input id="PDFUploadInput" class="upload-input" type="file" accept="application/pdf" onchange="loadPDFToPopupView(event, '#chosenPhoto')">
                </label>

                <!-- <label class="upload-option">
                    <div class="circular-wrapper">
                        <img src="../assets/icons/fi/fi-rr-world.svg" alt="">
                    </div>
                    <p class="upload-option-description"><text>Link</text></p>
                </label> -->

            </div>

            <div class="upload-progress-container">
                <div class="filename-container">
                    <p id="truncatedFilename"></p>
                    <div class="progress" id="global-progress-bar"></div>
                </div>
            </div>
        </div>

        <div class="popup-footer">
            <div class="button-group">
                <div class="button secondary-button" onclick="revertUploadChoice()">Cancel</div>
                <div class="button" onclick="startUploading()">Attach</div>
            </div>
        </div>
    </div>

    <!-- <div class="upload-view">
        <img src="" alt="">
    </div> --> 
</div>