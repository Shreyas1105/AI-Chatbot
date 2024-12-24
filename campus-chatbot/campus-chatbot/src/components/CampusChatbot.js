import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CampusChatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat`, {
        messages: [...messages, userMessage],
      });
      const assistantMessage = response.data;
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: 'An error occurred. Please try again.' },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="campus-chatbot">
      <h1>Campus Chatbot</h1>
      <div className="chat-messages">
        {messages.map((m, index) => (
          <div key={index} className={`message ${m.role}`}>
            <span>{m.content}</span>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <span>Chatbot is typing...</span>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Ask about courses, admissions, or advantages..."
        />
        <button type="submit" disabled={isTyping}>
          Send
        </button>
      </form>
    </div>
  );
}

export default CampusChatbot;

