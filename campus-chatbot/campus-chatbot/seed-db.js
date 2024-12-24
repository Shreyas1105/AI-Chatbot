const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const faqs = [
  {
    question: "What are the admission criteria for engineering courses?",
    answer: "Admission criteria for engineering courses typically include a strong academic background in mathematics and science, good scores in standardized tests like SAT or ACT, and sometimes specific subject tests. Some universities may also require a personal statement and letters of recommendation."
  },
  {
    question: "What are the admission criteria for medical courses?",
    answer: "Admission criteria for medical courses usually include excellent grades in biology, chemistry, and physics, high scores in the MCAT (Medical College Admission Test), a compelling personal statement, letters of recommendation, and relevant extracurricular activities or volunteer experience in healthcare settings."
  },
  {
    question: "What are the advantages of taking an engineering course?",
    answer: "Taking an engineering course offers several advantages: 1) Diverse career opportunities in various industries, 2) High earning potential, 3) Development of problem-solving and analytical skills, 4) Opportunity to work on cutting-edge technologies, 5) Potential for entrepreneurship and innovation."
  },
  {
    question: "What are the advantages of taking a medical course?",
    answer: "Advantages of taking a medical course include: 1) The opportunity to make a significant impact on people's lives, 2) Job security and high earning potential, 3) Continuous learning and professional growth, 4) Diverse specialization options, 5) Respect and recognition in society."
  },
  {
    question: "What engineering specializations are offered?",
    answer: "Common engineering specializations include: 1) Computer Science and Engineering, 2) Electrical Engineering, 3) Mechanical Engineering, 4) Civil Engineering, 5) Chemical Engineering, 6) Aerospace Engineering, 7) Biomedical Engineering. The specific offerings may vary by institution."
  },
  {
    question: "What medical specializations are offered?",
    answer: "Medical specializations can include: 1) General Medicine, 2) Surgery, 3) Pediatrics, 4) Obstetrics and Gynecology, 5) Psychiatry, 6) Radiology, 7) Anesthesiology, 8) Cardiology, 9) Neurology, 10) Oncology. The exact specializations offered may depend on the medical school and subsequent residency programs."
  }
];

async function seedDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('campus_chatbot');
    const collection = db.collection('faqs');

    await collection.deleteMany({});
    const result = await collection.insertMany(faqs);
    console.log(`${result.insertedCount} documents inserted.`);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await client.close();
  }
}

seedDatabase();

