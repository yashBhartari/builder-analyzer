import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyBXJrbrrioOy-NYX0Xrrb1PeoE0SfUjdYE');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
  try {
    const result = await model.generateContent("Say hello");
    console.log(result.response.text());
  } catch (e) {
    console.error("ERROR:");
    console.error(e.message);
  }
}
test();
