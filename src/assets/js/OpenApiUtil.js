// OpenApiUtill.js
import  OpenAI  from "openai";

// import.meta.env.VITE_OPENAI_APPKEY, 
const openai = new OpenAI({
    apiKey : import.meta.env.VITE_OPENAI_APPKEY,
    dangerouslyAllowBrowser: true,

});


export const OpenApiUtil = {
    async prompt(msg) {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: msg }],
          model: "gpt-3.5-turbo",
        });
      
        console.log(completion.choices[0]);
      }
};