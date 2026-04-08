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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a UK legal information assistant.
Return ONLY valid JSON with these keys:
preview
legal_principles
situation
next_steps
risks
limitation`
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
    } catch {
      parsed = {
        preview: content || "We could not generate a short summary right now.",
        legal_principles: "The legal position could not be fully generated.",
        situation: "Your situation may depend on the exact facts and documents involved.",
        next_steps: "Gather your documents and consider professional advice if the issue is urgent.",
        risks: "Acting without checking the details may lead to avoidable mistakes or missed deadlines.",
        limitation: "This is general legal information only and not legal advice."
      };
    }

    return res.status(200).json({
      answer: {
        preview: parsed.preview || "We could not generate a short summary right now.",
        legal_principles: parsed.legal_principles || "",
        situation: parsed.situation || "",
        next_steps: parsed.next_steps || "",
        risks: parsed.risks || "",
        limitation: parsed.limitation || "This is general legal information only and not legal advice."
      }
    });
  } catch (error) {
    console.error("ASK API ERROR:", error);
    return res.status(500).json({
      answer: {
        preview: "We could not generate your answer right now.",
        legal_principles: "",
        situation: "",
        next_steps: "Please try again shortly.",
        risks: "",
        limitation: "This is general legal information only and not legal advice."
      }
    });
  }
}
