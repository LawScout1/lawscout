// This script listens for the form submission and processes the question
document.getElementById("question-form").addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the form from submitting the traditional way

  // Get the question entered by the user
  const question = document.getElementById("user-question").value;

  // Hide the question form
  document.getElementById("question-form").style.display = "none";

  // Show the "answer-content" section
  const answerContainer = document.getElementById("answer-content");
  answerContainer.style.display = "block";

  // Display the question entered by the user
  const displayQuestion = document.getElementById("display-question");
  displayQuestion.textContent = question;

  // Get the answer from the AI (or your API backend)
  const answer = await fetchAnswer(question);

  // Display the AI-generated answer in the answer section
  const answerDetails = document.getElementById("answer-details");
  answerDetails.innerHTML = `
    <h3>Legal Principles</h3>
    <p>${answer.legal_principles}</p>

    <h3>Practical Next Steps</h3>
    <p>${answer.next_steps}</p>

    <h3>Important Limitation</h3>
    <p>${answer.limitation}</p>
  `;
});

// Mock function to simulate an API call for getting an AI answer
async function fetchAnswer(question) {
  // Replace this mock function with your actual API logic
  return {
    legal_principles: "This is a mock answer for Legal Principles related to 'notice period'.",
    next_steps: "1. Review your contract, 2. Talk to HR, 3. Seek professional advice.",
    limitation: "This is general information, not legal advice."
  };
}
