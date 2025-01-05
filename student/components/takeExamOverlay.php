<div class="overlay take-exam-overlay">
    <div class="popup exam-popup">
        <div class="popup-header">
            <h1 class="pop-up-title">
                <div class="quiz-details"><text>Exam</text></div>
            </h1>

            <div class="suspected-cheating-attempts">
                <div class="">Suspected Cheating Attempts</div>
                <div class="cheating-attempts-value">0 / 3</div>
            </div>

            <div class="timer">00:00:00</div>
        </div>

        <div class="popup-body exam-popup-body">

            <div class="question-header">

            </div>

            <div class="question-area">

            </div>
        </div>

        <div class="popup-body exam-results-body">

            <div class="two-column-grid">
                <div class="left-pane">
                    <h1 class="menlo-heading">Your Results</h1>

                    <div class="exam-result-area">
                        <div class="earned-exam-mark">
                            <div class="text-divider">
                                <text>Score</text>
                                <p>:</p>
                            </div>
                            <p class="earned-exam-mark-placeholder">0</p>
                        </div>

                        <div class="total-exam-mark">
                            <div class="text-divider">
                                <text>Total Quiz Marks</text>
                                <p>:</p>
                            </div>
                            <p class="total-exam-mark-placeholder">0</p>
                        </div>
                    </div>
                </div>

                <div class="right-pane">
                    <div class="percentage-mark">0</div>
                    <div class="percentage-sign">%</div>
                </div>
            </div>

            <div class="button done-exam-button" onclick="
            closePopup('.take-exam-overlay'); location.reload();
            ">Done</div>
        </div>

        <div class="popup-footer button-group-footer">
            <div class="button-group exam-button-group">
                <button class="button previous-question" disabled>Previous Question</button>
                <button class="button next-question">Next Question</button>
            </div>
        </div>

        <div class="popup-footer submit-footer">
            <button class="button finish-exam-button">Submit Exam</button>
        </div>


        <div class="loader-view take-exam-loader">
            <div>
                <div class="sk-fold">
                    <div class="sk-fold-cube"></div>
                    <div class="sk-fold-cube"></div>
                    <div class="sk-fold-cube"></div>
                    <div class="sk-fold-cube"></div>
                </div>
            </div>
        </div>

    </div>
</div>