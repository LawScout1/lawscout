<script>
  // Function to handle the question submission
  document.getElementById("question-form").addEventListener("submit", async (event) => {
    event.preventDefault();  // Prevent the form from submitting the default way

    // Get the question entered by the user
    const question = document.getElementById("user-question").value;

    // Hide the question form and show the answer section
    document.getElementById("question-form").style.display = "none"; // Hide the form
    const answerContainer = document.getElementById("answer-content");
    answerContainer.style.display = "block"; // Show the answer section

    // Display the question entered by the user
    const displayQuestion = document.getElementById("display-question");
    displayQuestion.textContent = question;

    // Get the answer from the Vercel API (which forwards to your AI API)
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

  // Function to fetch the answer from your Vercel API route
  async function fetchAnswer(question) {
    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }) // Send the question to the API route
      });

      if (!response.ok) {
        throw new Error('AI API request failed');
      }

      const data = await response.json();  // Parse the JSON response
      return data.answer;  // Assuming the response contains an 'answer' object
    } catch (error) {
      console.error('Error fetching AI answer:', error);
      return {
        legal_principles: 'Sorry, we could not process your question at this time.',
        next_steps: 'Please try again later.',
        limitation: 'This is a generic response, not legal advice.'
      };
    }
  }
</script>
