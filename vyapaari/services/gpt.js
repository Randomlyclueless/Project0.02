import axios from "axios";

const API_KEY = "sk-..."; // 🔐 Replace with your OpenAI API key

export const askVyom = async (message) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // or gpt-4
        messages: [
          {
            role: "system",
            content:
              "You are Vyom, a helpful assistant for small business users in India.",
          },
          { role: "user", content: message },
        ],
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = res.data.choices[0].message.content.trim();
    return reply;
  } catch (error) {
    console.error("GPT error:", error);
    return "Sorry, I’m having trouble thinking right now.";
  }
};
