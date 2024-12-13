<?php
session_start();
$userId = $_SESSION['user_id'] ; // Use session variable or fallback for testing

// Load survey data
$json = file_get_contents("../questionair/disability.json");
$survey = json_decode($json, true);
$questions = [];
foreach ($survey['questionnaire']['sections'] as $section) {
    foreach ($section['questions'] as $question) {
        $questions[] = $question; // Flatten the questions array
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey with Terms</title>

    <script src="../js/functions.js"></script>
    <div style="position:absolute;" class="gtranslate_wrapper"></div>
    <script>window.gtranslateSettings = {"default_language": "en", "languages": ["en", "tr"], "wrapper_selector": ".gtranslate_wrapper", "switcher_horizontal_position": "left", "switcher_vertical_position": "bottom", "float_switcher_open_direction": "bottom", "flag_style": "3d" }</script>
    <script src="https://cdn.gtranslate.net/widgets/latest/float.js" defer></script>

    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 40%;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            padding: 20px;
            z-index: 1000;
        }
        .modal h2 {
            font-size: 18px;
            color: #900;
            margin-bottom: 10px;
        }
        .modal p {
            margin: 15px 0;
            line-height: 1.6;
            color: #333;
        }
        .modal .options label {
            display: block;
            margin-bottom: 10px;
            color: #555;
        }
        .modal .options input {
            margin-right: 10px;
        }
        .modal textarea {
            width: 100%;
            height: 80px;
            padding: 10px;
            margin-top: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        .modal .checkbox-container {
            margin: 20px 0;
            display: flex;
            align-items: center;
        }
        .modal .checkbox-container input {
            margin-right: 10px;
        }
        .modal .navigation {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        .modal .navigation button {
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #900;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .modal .navigation button:disabled {
            background-color: #ccc;
            cursor: not-allowed;
        }
        .modal .navigation .submit {
            background-color: #0a6;
        }
        .backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
        }
    </style>
</head>
<body>
    <div class="backdrop"></div>
    <div class="modal" id="terms-modal">
    <h2>Terms and Agreement</h2>
        <p>
            Teachers are required to agree to the following terms and guidelines to ensure effective and inclusive implementation.
            Teachers must demonstrate a commitment to fostering an equitable learning environment by adhering to principles of respect, confidentiality, and sensitivity towards students with disabilities.
        </p>
        <p>
            Open communication with students, parents, and support staff is essential, and teachers are encouraged to collaborate regularly
            with special education teams. They should also maintain professional accountability by documenting the use of accommodations
            and providing constructive feedback to improve the system.
        </p>
        <p>
            By agreeing, you acknowledge that you will act in accordance with these principles while ensuring inclusive and respectful 
            interactions with all students.
        </p>
        <div class="checkbox-container">
            <input type="checkbox" id="agree-checkbox">
            <label for="agree-checkbox">I agree to the terms and guidelines</label>
        </div>
        <div class="navigation">
            <button id="start-btn" disabled>Start Survey</button>
        </div>
    </div>

    <div class="modal" id="survey-modal" style="display: none;">
        <h2 id="question-title">Question 1</h2>
        <p id="question-text">This is the question text.</p>
        <div id="question-options" class="options"></div>
        <div class="navigation">
            <button id="prev-btn" disabled>Previous</button>
            <button id="next-btn" disabled>Next</button>
        </div>
    </div>

    <script>

        const questions = <?php echo json_encode($questions); ?>;
        const questionsToSend =JSON.stringify(questions);

        let currentIndex = 0;

        const termsModal = document.getElementById('terms-modal');
        const surveyModal = document.getElementById('survey-modal');
        const agreeCheckbox = document.getElementById('agree-checkbox');
        const startBtn = document.getElementById('start-btn');

        const questionTitle = document.getElementById('question-title');
        const questionText = document.getElementById('question-text');
        const questionOptions = document.getElementById('question-options');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        // Enable the "Start Survey" button if terms are agreed
        agreeCheckbox.addEventListener('change', function () {
            startBtn.disabled = !this.checked;
        });

        // Hide terms modal and show survey modal
        startBtn.addEventListener('click', function () {
            termsModal.style.display = 'none';
            surveyModal.style.display = 'block';
            loadQuestion(currentIndex);
        });
        const userId = "<?php echo $userId; ?>"; // PHP variable passed from server
let answers = {}; // To store user answers

function loadQuestion(index) {
    const question = questions[index];
    questionTitle.textContent = `Question ${index + 1}`;
    questionText.textContent = question.question;
    questionOptions.innerHTML = '';

    if (question.type === 'openEnded') {
        // Add a textarea for open-ended questions
        questionOptions.innerHTML = `
            <textarea name="answer" placeholder="Type your answer here..." style="width: 100%; height: 100px; padding: 10px;"></textarea>
        `;
    } else {
        // Render options for singleChoice or multipleChoice questions
        question.options.forEach(option => {
            if (option === "Other (please specify)") {
                questionOptions.innerHTML += `
                    <label>
                        <input type="${question.type === 'singleChoice' ? 'radio' : 'checkbox'}" name="answer" value="Other">
                        ${option}
                    </label>
                    <input type="text" id="other-text" placeholder="Please specify" style="display:none; margin-top: 10px;" />
                `;
            } else {
                questionOptions.innerHTML += `
                    <label>
                        <input type="${question.type === 'singleChoice' ? 'radio' : 'checkbox'}" name="answer" value="${option}">
                        ${option}
                    </label>
                `;
            }
        });

        // Show or hide text field for "Other (please specify)"
        questionOptions.addEventListener('change', (e) => {
            const otherInput = document.getElementById('other-text');
            if (e.target.value === "Other") {
                otherInput.style.display = 'block';
            } else if (otherInput) {
                otherInput.style.display = 'none';
            }
            validateAnswer();
        });
    }

    // Validate input dynamically to enable the "Next" button
    const inputs = questionOptions.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('change', validateAnswer);
        input.addEventListener('input', validateAnswer);
    });

    prevBtn.disabled = index === 0;
    nextBtn.disabled = true; // Disable "Next" until a valid answer is provided
    nextBtn.textContent = index === questions.length - 1 ? 'Submit' : 'Next';
}

// Validate user input and enable "Next" button if valid
function validateAnswer() {
    const question = questions[currentIndex];
    let isValid = false;

    if (question.type === 'openEnded') {
        const textarea = questionOptions.querySelector('textarea');
        isValid = textarea && textarea.value.trim() !== '';
    } else if (question.type === 'singleChoice') {
        const selected = questionOptions.querySelector('input[name="answer"]:checked');
        isValid = !!selected;
    } else if (question.type === 'multipleChoice') {
        const selected = questionOptions.querySelectorAll('input[name="answer"]:checked');
        isValid = selected.length > 0;
    }

    nextBtn.disabled = !isValid;
}

// Save answers to the `answers` object
function saveAnswer() {
    const question = questions[currentIndex];
    if (question.type === 'openEnded') {
        answers[question.id] = questionOptions.querySelector('textarea').value;
    } else if (question.type === 'singleChoice') {
        const selected = questionOptions.querySelector('input[name="answer"]:checked');
        if (selected) answers[question.id] = selected.value;
    } else if (question.type === 'multipleChoice') {
        const selected = Array.from(questionOptions.querySelectorAll('input[name="answer"]:checked')).map(el => el.value);
        answers[question.id] = selected;
    }
}

// Navigate to the next question or submit the survey
nextBtn.addEventListener('click', async () => {
    saveAnswer();

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        loadQuestion(currentIndex);
    } else {
        // Submit answers as JSON to the server
        fetch('../../include/savequestionair.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, answers }),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting the survey.');
        });

        const result = await generateAnswer(answers);
        console.log('result: ', result);
    }
});

// Navigate to the previous question
prevBtn.addEventListener('click', function () {
    if (currentIndex > 0) {
        currentIndex--;
        loadQuestion(currentIndex);
    }
});

// Initialize the survey
loadQuestion(currentIndex);


async function generateAnswer(questions, answers) {
    try {
        const apiKey = '';
        const endpoint = "https://api.openai.com/v1/chat/completions";

        // Prepare the system and user messages
        const messages = [
            {
                role: "system",
                content: `You are Prof. Dux, an AI professor  Respond as an empathetic AI mentor. Provide short highlights and constructive feedback based on teachers' answers to the survey questions. Keep the feedback brief, professional, and actionable.`
            },
            {
                role: "user",
                content: `Here are the survey questions: ${questionsToSend}\n\nAnd here are the answers provided by the teacher: ${answers}`
            }
        ];

        // Make the API call
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        // Check if the response is successful
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        // Extract and return the content from the response
        if (data.choices && data.choices[0] && data.choices[0].message) {
            return data.choices[0].message.content.trim();
        } else {
            throw new Error("Unexpected API response structure");
        }
    } catch (error) {
        console.error("Error in generateAnswer:", error);
        return "Sorry, I encountered an error processing your request. Please try again later.";
    }
}



    </script>
</body>
</html>
