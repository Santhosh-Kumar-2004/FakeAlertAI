import React, { useEffect, useState } from 'react';

const ResultCard = ({ result }) => {
  const [show, setShow] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' or 'dislike'
  const [thankYou, setThankYou] = useState(false);
  const [sprinkles, setSprinkles] = useState(false);

  useEffect(() => {
    if (result) {
      setShow(true);
      setFeedback(null);
      setThankYou(false);
    }
  }, [result]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const handleFeedback = (type) => {
    setFeedback(type);
    setThankYou(true);

    if (type === 'like') {
      setSprinkles(true);
      setTimeout(() => setSprinkles(false), 1000);
    }
  };

  if (!result || !show) return null;

  return (
    <div className="result-card fade-in">
      <h3>🔍 Analysis Result</h3>

      <p>
        <strong>Verdict:</strong> {result.verdict}
        <button className="copy-btn" onClick={() => handleCopy(result.verdict)}>📋</button>
      </p>

      <p><strong>Risk Score:</strong> {result.risk_score}</p>
      <p><strong>Scam Type:</strong> {result.scam_type}</p>

      <hr />

      <p><strong>Original Explanation:</strong> {result.explanation}</p>
      <p><strong>Translated Explanation:</strong> {result.translated_explanation}</p>

      <p>
        <strong>Original Advice:</strong> {result.advice}
        <button className="copy-btn" onClick={() => handleCopy(result.advice)}>📋</button>
      </p>

      <p><strong>Translated Advice:</strong> {result.translated_advice}</p>

      {/* Feedback Section */}
      <div className="feedback">
        <p>Was this helpful?</p>
        <button
          className={`feedback-btn ${feedback === 'like' ? 'active' : ''}`}
          onClick={() => handleFeedback('like')}
        >
          👍
        </button>
        <button
          className={`feedback-btn ${feedback === 'dislike' ? 'active' : ''}`}
          onClick={() => handleFeedback('dislike')}
        >
          👎
        </button>

        {thankYou && (
          <p className="thank-you-msg">Thanks for your feedback!</p>
        )}

        {sprinkles && (
          <div className="sprinkle">
            <span>✨</span>
            <span>🎉</span>
            <span>💫</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
