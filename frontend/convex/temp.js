const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/engines/davinci/completions';


export async function askGpt(query) {

   const headerss = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
   };

   const data = {
      prompt: 'A user asked this question about a document upload. Assume the document upload failed. Respond to the best of your ability to this question with no context about the document. Ask the user clarifying questions if necessary. ' + query,
      model: "gpt-3.5-turbo"
   };

   fetch(apiUrl, {
      method: 'POST',
      headers: headerss,
      body: JSON.stringify(data),
   })
      .then((response) => {
         if (response.status === 200) {
            return response.json();
         } else {
            throw new Error(`Request failed with code ${response.status}`);
         }
      })
      .then((result) => {
         const text = result.choices[0].text;
         return text;
      })
      .catch((error) => {
         console.error('Error:', error);
         return "error"
      });
}

// console.log(await askGpt("What is your name"))