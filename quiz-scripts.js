// Function to fetch quiz questions from a JSON file
async function fetchQuestions() {
  const response = await fetch('questions.json');
  const questions = await response.json();
  return questions;
}

// Fisher-Yates algorithm to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Global state variables
let currentQuestionIndex = 0;
let questions = [];
let selectedAnswer = null;
let submitted = false; // Indicates if the question has been submitted

// Function to render the current question with fade-in animation
function renderQuestion() {
  const question = questions[currentQuestionIndex]; // Get the current question
  const quizContainer = document.getElementById('quizContainer'); // Reference to the quiz container

  // Clear existing content
  quizContainer.innerHTML = '';

  // Create the question text with fade-in animation
  const questionText = document.createElement('p');
  questionText.textContent = question.questionText; // Set the question text
  questionText.className = 'centered-question fade-in'; // Apply fade-in animation
  quizContainer.appendChild(questionText); // Add question text to the container

  // Add answer options with staggered fade-in animations
  question.options.forEach((option, index) => {
    const optionLabel = document.createElement('div'); // Create a div for each option
    optionLabel.className = 'option-label fade-in'; // Apply base fade-in animation

    // Apply staggered delays based on index
    const fadeInDelays = ['fade-in-delayed-1', 'fade-in-delayed-2', 'fade-in-delayed-3'];
    optionLabel.classList.add(fadeInDelays[index]); // Apply delay based on index

    optionLabel.textContent = `${String.fromCharCode(65 + index)}. ${option.text}`; // Label with option text

    // Click event to mark the selected answer
    optionLabel.addEventListener('click', () => {
      if (submitted) return; // If submitted, prevent further selection

      // Deselect other options
      document.querySelectorAll('.option-label').forEach((label) => {
        label.classList.remove('selected'); // Remove 'selected' class
      });

      // Mark the current option as selected
      optionLabel.classList.add('selected'); // Add 'selected' class
      selectedAnswer = option.text; // Store the selected answer
    });

    quizContainer.appendChild(optionLabel); // Add the option label to the container
  });
}

// Function to update the state of navigation controls
function updateControls() {
  const prevButton = document.getElementById('prevButton'); // Reference to 'Previous' button
  const nextButton = document.getElementById('nextButton'); // Reference to 'Next' button
  const submitButton = document.getElementById('submitButton'); // Reference to 'Submit' button

  // Enable or disable buttons based on question index
  prevButton.disabled = (currentQuestionIndex === 0); // Disable 'Previous' if at the first question
  nextButton.disabled = false; // Always enable 'Next' to allow looping through questions
  submitButton.disabled = submitted; // Disable 'Submit' if submitted
}

// Function to start the quiz
async function startQuiz() {
  questions = await fetchQuestions(); // Fetch quiz questions
  shuffleArray(questions); // Shuffle the questions
  currentQuestionIndex = 0; // Reset the question index
  selectedAnswer = null; // Clear any previous answer
  submitted = false; // Reset the submitted state
  renderQuestion(); // Render the first question
  updateControls(); // Update navigation controls
}

// Event listeners for quiz controls
document.getElementById('prevButton').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--; // Go to the previous question
  } else {
    currentQuestionIndex = questions.length - 1; // Loop to the last question
  }
  submitted = false; // Reset submission state for the new question
  selectedAnswer = null; // Clear the selected answer
  renderQuestion(); // Render the new question
  updateControls(); // Update controls
});

document.getElementById('nextButton').addEventListener('click', () => {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++; // Go to the next question
  } else {
    shuffleArray(questions); // Reshuffle when reaching the end
    currentQuestionIndex = 0; // Loop back to the first question
  }
  submitted = false; // Reset submission state for the new question
  selectedAnswer = null; // Clear the selected answer
  renderQuestion(); // Render the new question
  updateControls(); // Update controls
});

document.getElementById('submitButton').addEventListener('click', () => {
  const correctAnswer = questions[currentQuestionIndex].correctAnswer; // Get the correct answer

  if (selectedAnswer) {
    submitted = true; // Lock the submit button after submission

    const optionLabels = document.querySelectorAll('.option-label'); // Get all option labels

    // Indicate correct and incorrect answers
    optionLabels.forEach((label) => {
      if (label.textContent.includes(correctAnswer)) {
        label.classList.add('correct'); // Correct answer: Green border
      } else if (label.classList.contains('selected')) {
        label.classList.add('incorrect'); // Incorrect answer: Red border
      }
    });

    updateControls(); // Disable 'Submit' after submission
  } else {
    alert('Please select an answer before submitting.'); // Alert if no answer is selected
  }
});

// Start the quiz when the page loads
window.onload = startQuiz; // Trigger the start of the quiz on page load
