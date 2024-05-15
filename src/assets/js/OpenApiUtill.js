// OpenApiUtill.js
import  OpenAI  from "openai";


const openai = new OpenAI({
    apiKey : import.meta.env.VITE_OPENAI_APPKEY, 
    dangerouslyAllowBrowser: true,

});


export const OpenApiUtill = {
    async prompt(msg) {
        const completion = await openai.chat.completions.create({
          messages: [{ role: "system", content: msg }],
          model: "gpt-4o",
        });
      
        console.log(completion.choices[0]);
      }

  
      
};