export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a UK legal information assistant. 
Provide structured responses in JSON format with:
- legal_principles
- next_steps
- limitation

Keep it clear, professional, and not legal advice.`
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    const content = data.choices?.[0]?.message?.content;

    // Try to parse JSON safely
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      parsed = {
        legal_principles: content,
        next_steps: "Consider seeking professional advice.",
        limitation: "This is general legal information only."
      };
    }

    return res.status(200).json({ answer: parsed });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      answer: {
        legal_principles: "Error processing request.",
        next_steps: "Please try again.",
        limitation: "System error."
      }
    });
  }
}
