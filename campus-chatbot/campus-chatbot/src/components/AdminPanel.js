import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
  const [faqs, setFaqs] = useState([]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/faqs`);
      setFaqs(response.data);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewFaq({ ...newFaq, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/faqs`, newFaq);
      setNewFaq({ question: '', answer: '' });
      fetchFaqs();
    } catch (error) {
      console.error('Error adding FAQ:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/faqs/${id}`);
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
    }
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="question"
          value={newFaq.question}
          onChange={handleInputChange}
          placeholder="Question"
          required
        />
        <textarea
          name="answer"
          value={newFaq.answer}
          onChange={handleInputChange}
          placeholder="Answer"
          required
        />
        <button type="submit">Add FAQ</button>
      </form>
      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq._id} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
            <button onClick={() => handleDelete(faq._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminPanel;

