import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'
import { connectToDatabase } from '@/lib/mongodb'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()
  const { db } = await connectToDatabase()

  // Fetch relevant FAQs from MongoDB
  const faqs = await db.collection('faqs').find({}).toArray()

  // Prepare the prompt with FAQs
  const faqPrompt = faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')
  const systemPrompt = `You are a helpful campus chatbot that answers questions about engineering and medical courses, admissions criteria, and the advantages of taking these courses. Use the following FAQs as a reference, but feel free to expand on the information if needed:\n\n${faqPrompt}\n\nIf you don't have specific information about a query, provide a general response and suggest contacting the admissions office for more details.`

  const response = await openai.createChatCompletion({
    model: 'gpt-4-turbo',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

