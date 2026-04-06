async function fetchAnswer(question) {
  const response = await fetch("/api/ask", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ question })
  });

  const data = await response.json();

  console.log(data);  // Add this line to log the response data

  return data.answer;
}
