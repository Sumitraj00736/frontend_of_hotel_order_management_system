import React, { useState } from 'react';

const SupportFeedback = ({ items = [], onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const submit = async () => {
    if (!message.trim()) return;
    await onSubmit?.({ subject, message });
    setSubject('');
    setMessage('');
  };

  return (
    <div className="settings-page">
      <div className="settings-title">Support & Feedback</div>
      <div className="settings-card">
        <div className="settings-card-title">Share feedback</div>
        <div className="settings-grid">
          <input className="field-input" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <textarea className="field-input" placeholder="Write your message" value={message} onChange={(e) => setMessage(e.target.value)} />
        </div>
        <div className="settings-actions">
          <button className="btn btn-primary" onClick={submit}>Send</button>
        </div>
      </div>

      <div className="settings-card">
        <div className="settings-card-title">Recent requests</div>
        <table className="settings-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan="3" className="settings-empty">No feedback yet</td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item._id}>
                  <td>{item.subject || 'Support'}</td>
                  <td>{item.status}</td>
                  <td>{new Date(item.createdAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportFeedback;
