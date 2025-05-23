import { NextResponse } from 'next/server'
import { Groq} from 'groq-js';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1'
  // Read the API key from environment variables
});

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content.
Follow these guidelines.

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each of the card focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as defintions, examples, comparisons, and applications.
6. Avoid overly complex, or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's speicifed preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively,
11. Only generate 10 flashcards.

Remember the goal is to facilitate effective learning and retention of information through these flashcards.
You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`
export async function POST(req) {
   
    const data = await req.text()
  
    // We'll implement the OpenAI API call here
    const completion = await openai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: data },
        ],
        model: 'llama-3.1-8b-instant',
        response_format: { type: 'json_object' },
      })
    
      // We'll process the API response in the next step
      // Parse the JSON response from the OpenAI API
      const flashcards = JSON.parse(completion.choices[0].message.content)

      // Return the flashcards as a JSON response
      return NextResponse.json(flashcards.flashcards)

  }