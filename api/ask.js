export default async function handler(req, res) {
  const { question } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content: `
You are LawScout, a UK legal information assistant.

Answer the user's question in this EXACT structure:

Issue Summary:
[Write 2-3 sentences]

Legal Principles:
[Explain the relevant law]

Relevant Legislation:
[List relevant UK laws]

Practical Next Steps:
[Give practical steps]

Important Limitation:
[Write a legal disclaimer style limitation]

Do NOT write anything outside these sections.
`
          },
          { role: "user", content: question }
        ]
      })
    });

    const data = await response.json();
    const text = data.choices[0].message.content;

    // Split sections
    const issue = text.split("Issue Summary:")[1]?.split("Legal Principles:")[0]?.trim();
    const legal = text.split("Legal Principles:")[1]?.split("Relevant Legislation:")[0]?.trim();
    const legislation = text.split("Relevant Legislation:")[1]?.split("Practical Next Steps:")[0]?.trim();
    const steps = text.split("Practical Next Steps:")[1]?.split("Important Limitation:")[0]?.trim();
    const limitation = text.split("Important Limitation:")[1]?.trim();

    res.status(200).json({
      answer: {
        issue_summary: issue,
        legal_principles: legal,
        legislation: legislation,
        next_steps: steps,
        limitation: limitation
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
