const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function connectToDatabase() {
  await client.connect();
  console.log('Connected to MongoDB');
  return client.db('campus_chatbot');
}

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  const db = await connectToDatabase();

  try {
    const faqs = await db.collection('faqs').find({}).toArray();
    const faqPrompt = faqs.map((faq) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
    const systemPrompt = `You are a helpful campus chatbot that answers questions about engineering and medical courses, admissions criteria, and the advantages of taking these courses. Use the following FAQs as a reference, but feel free to expand on the information if needed:\n\n${faqPrompt}\n\nIf you don't have specific information about a query, provide a general response and suggest contacting the admissions office for more details.`;

    const response = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
    });

    res.json(response.data.choices[0].message);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

// Get all FAQs
app.get('/api/faqs', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const faqs = await db.collection('faqs').find({}).toArray();
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'An error occurred while fetching FAQs.' });
  }
});

// Add a new FAQ
app.post('/api/faqs', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('faqs').insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error adding FAQ:', error);
    res.status(500).json({ error: 'An error occurred while adding the FAQ.' });
  }
});

// Delete an FAQ
app.delete('/api/faqs/:id', async (req, res) => {
  const db = await connectToDatabase();
  try {
    const result = await db.collection('faqs').deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'FAQ not found.' });
    }
    res.status(200).json({ message: 'FAQ deleted successfully.' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ error: 'An error occurred while deleting the FAQ.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

