export default async function handler(req, res) {
  const { question } = req.body;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
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

  const data = await response.json();
  const answer = data.choices[0].message.content;

  res.status(200).json({ answer });
}
