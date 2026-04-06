// /api/ask.js
export default async function handler(req, res) {
  const { question } = req.body;

  try {
    // Call to OpenAI's GPT API to get an answer
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`  // Using your environment variable
      },
      body: JSON.stringify({
        model: "gpt-4", // GPT-4 model for better results (or use gpt-3.5-turbo)
        messages: [
          {
            role: "system",
            content: "You are a UK legal information assistant. Provide structured answers with: Issue summary, Legal principles, Relevant legislation, Practical next steps, Important limitation. Do not provide legal advice."
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    // If the OpenAI API call is successful, extract the response
    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      const answer = data.choices[0].message.content;

      // Return structured response (adjust based on OpenAI's response format)
      res.status(200).json({
        answer: {
          legal_principles: `Legal principles for question: ${answer}`,
          next_steps: `Suggested steps for question: ${answer}`,
          limitation: "This is general information only, not legal advice. Housing law can depend heavily on facts, jurisdiction, and recent legal changes."
        }
      });
    } else {
      // Handle error in case OpenAI API response is not as expected
      res.status(400).json({ error: "No valid response from OpenAI API" });
    }
  } catch (error) {
    // Handle any unexpected errors in the API call
    console.error("Error with OpenAI API request:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
