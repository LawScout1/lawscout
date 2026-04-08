export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { question } = req.body || {};

  if (!question) {
    return res.status(400).json({ error: "No question provided" });
  }

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a UK legal information assistant.

Return ONLY valid JSON with exactly these keys:
preview
legal_principles
situation
next_steps
risks
limitation

Rules:
- preview must be 2 short sentences
- legal_principles must explain the main legal position in plain English
- situation must explain what this may mean for the user
- next_steps must give practical actions
- risks must explain what could go wrong
- limitation must say this is general legal information only, not legal advice
- no markdown
- no extra text outside JSON
            `.trim()
          },
          {
            role: "user",
            content: question
          }
        ],
        temperature: 0.4
      })
    });

    const raw = await openaiResponse.json();
    const content = raw?.choices?.[0]?.message?.content || "";

    let parsed;

    try {
      parsed = JSON.parse(content);
    } catch (err) {
      parsed = {
        preview: content || "We could not generate a short summary right now.",
        legal_principles: content || "The legal position could not be fully generated.",
        situation: "Your situation may depend on the exact facts and documents involved.",
        next_steps: "Gather your documents and consider getting professional advice if the issue is urgent.",
        risks: "Acting without checking the details may lead to avoidable mistakes or missed deadlines.",
        limitation: "This is general legal information only and not legal advice."
      };
    }

    return res.status(200).json({
      answer: {
        preview: parsed.preview || "We could not generate a short summary right now.",
        legal_principles: parsed.legal_principles || "The legal position could not be fully generated.",
        situation: parsed.situation || "Your situation may depend on the exact facts and documents involved.",
        next_steps: parsed.next_steps || "Gather your documents and consider getting professional advice if the issue is urgent.",
        risks: parsed.risks || "Acting without checking the details may lead to avoidable mistakes or missed deadlines.",
        limitation: parsed.limitation || "This is general legal information only and not legal advice."
      }
    });
  } catch (error) {
    console.error("ASK API ERROR:", error);
    return res.status(500).json({
      answer: {
        preview: "We could not generate a short summary right now.",
        legal_principles: "There was a problem generating the answer.",
        situation: "Please try again in a moment.",
        next_steps: "Retry your question shortly.",
        risks: "Temporary system issue.",
        limitation: "This is general legal information only and not legal advice."
      }
    });
  }
}
