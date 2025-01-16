<div class="overlay review-exam-overlay">
    <div class="popup exam-popup">
        <div class="popup-header">
            <h1 class="pop-up-title">
                <div class="quiz-details"><text>Review Exam</text></div>
            </h1>

            <div class="close-button" onclick="
            closePopup('.review-exam-overlay');
            ">
                <img src="../assets/icons/close.png" alt="">
            </div>

        </div>

        <div class="popup-body exam-popup-body">

            <div class="mini-header">
                <div class="question-header">

                </div>
                <div class="question-mark-area">
                    <div class="question-mark">
                        mark given: 0
                    </div>
                    <div class="button remark-button">mark</div>
                </div>
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
                                <text>Total Exam Marks</text>
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
        </div>

        <div class="popup-footer button-group-footer">
            <div class="button-group exam-button-group">
                <button class="button previous-question" disabled>Previous Question</button>
                <button class="button next-question">Next Question</button>
            </div>
        </div>


        <div class="loader-view review-exam-loader">
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