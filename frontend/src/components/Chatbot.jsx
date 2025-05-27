import { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [query, setQuery] = useState('');
  const [responses, setResponses] = useState([]);

  const handleAsk = async () => {
    if (!query) return;
    const res = await axios.post('/api/rag/ask', { question: query });
    setResponses([...responses, { question: query, answer: res.data.answer }]);
    setQuery('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 font-semibold">Ask your PDF Doubts</h2>
      <input
        type="text"
        placeholder="Type your question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button onClick={handleAsk} className="bg-blue-600 text-white px-4 py-2 rounded">
        Ask
      </button>

      <div className="mt-4">
        {responses.map((res, idx) => (
          <div key={idx} className="mb-2">
            <strong>Q:</strong> {res.question}<br />
            <strong>A:</strong> {res.answer}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chatbot;
