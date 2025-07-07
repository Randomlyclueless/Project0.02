// utils/translateUtils.ts
import axios from "axios";

const FREE_API_URL = "https://translate.googleapis.com/translate_a/single";

export async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const response = await axios.get(FREE_API_URL, {
      params: {
        client: "gtx",
        sl: "en",
        tl: targetLang,
        dt: "t",
        q: text,
      },
    });

    const translated = response.data[0][0][0];
    return translated;
  } catch (error) {
    console.error("Translation Error:", error);
    return text;
  }
}
