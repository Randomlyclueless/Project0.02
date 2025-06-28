import axios from "axios";

const API_KEY = "YOUR_GOOGLE_TRANSLATE_API_KEY";
const API_URL = "https://translation.googleapis.com/language/translate/v2";

export async function translateText(text: string, targetLang: string) {
  const res = await axios.post(`${API_URL}?key=${API_KEY}`, {
    q: text,
    target: targetLang,
  });
  return res.data.data.translations[0].translatedText;
}
