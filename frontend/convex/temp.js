const apiKey = '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';
const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';


export async function askGpt(query) {

   const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
   };

   const data = {
      prompt: 'A user asked this question about a document upload. Assume the document upload failed. Respond to the best of your ability to this question with no context about the document. Ask the user clarifying questions if necessary. '.concat(query)
   };

   fetch(apiUrl, {
      method: 'POST',
      headers: headers,
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