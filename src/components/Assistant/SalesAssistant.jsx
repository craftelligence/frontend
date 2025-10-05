import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';

export default function SalesAssistant({ open, onClose, calendlyUrl, apiBase = "http://localhost:8080" }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Craftelligence's sales assistant. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const R = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (R) {
        recognitionRef.current = new R();
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onresult = (e) => {
          const result = e.results[e.results.length - 1];
          if (result.isFinal) {
            const text = result[0].transcript.trim();
            setInput(text);
          }
        };
        recognitionRef.current.onend = () => {
          setListening(false);
        };
        recognitionRef.current.onerror = () => {
          setListening(false);
        };
      }
    }
  }, []);

  const send = async (content) => {
    if (!content.trim()) return;
    const next = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput("");
    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      const reply = data.reply || 'Sorry, something went wrong.';
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e) {
      const msg = 'Network error. Please try again later.';
      setMessages((m) => [...m, { role: 'assistant', content: msg }]);
    }
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      if (!listening) {
        setListening(true);
        recognitionRef.current.start();
      }
    } catch (e) {
      console.error('Error starting speech recognition:', e);
      setListening(false);
    }
  };

  const stopListening = () => {
    try { 
      recognitionRef.current && recognitionRef.current.stop(); 
    } catch {}
    setListening(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      send(input);
    }
  };

  if (!open) return null;

  return (
    <div className="assistant-modal">
      <div className="assistant-card">
        <div className="assistant-header">
          <div className="avatar" />
          <div>
            <h3>Craftelligence Sales Assistant</h3>
            <small>We build. You scale.</small>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={onClose} className="icon-btn">✕</button>
          </div>
        </div>

        <div className="assistant-body">
          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role}`}>{m.content}</div>
            ))}
          </div>
        </div>

        <div className="assistant-footer">
          <div className="controls">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about services, timelines, pricing..."
              onKeyDown={handleKeyDown}
              className="message-input"
            />
            <button 
              onClick={listening ? stopListening : startListening} 
              disabled={!recognitionRef.current}
              className="voice-btn"
              title={listening ? "Stop listening" : "Click to speak"}
            >
              {listening ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 11h-1.7c0 .74-.16 1.43-.43 2.05l1.23 1.23c.56-.98.9-2.09.9-3.28zm-4.02.17c0-.06.02-.11.02-.17V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 .06.02.11.02.17L19 11.17z"/>
                  <path d="M4.27 3L3 4.27l6.01 6.01V11c0 1.66 1.33 3 2.99 3 .22 0 .44-.03.65-.08l1.66 1.66c-.71.33-1.5.52-2.31.52-2.76 0-5.3-2.1-5.3-5.1H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              )}
            </button>
            <button onClick={() => send(input)} className="send-btn">Send</button>
            <a className="btn demo-btn" href={calendlyUrl} target="_blank" rel="noopener noreferrer">Book a demo</a>
          </div>
        </div>
      </div>

      <style>{`
        .assistant-modal { position: fixed; inset:0; background: rgba(0,0,0,.45); display:flex; align-items:center; justify-content:center; z-index:9999; }
        .assistant-card { width: 92%; max-width: 760px; background: #0f172a; color: #e5e7eb; border-radius: 14px; border: 1px solid #334155; display:flex; flex-direction:column; box-shadow: 0 10px 40px rgba(0,0,0,.4); }
        .assistant-header { display:flex; gap:12px; align-items:center; padding:12px 16px; border-bottom:1px solid #334155; }
        .avatar { width:44px; height:44px; border-radius:50%; background: radial-gradient(circle at 30% 30%, #00ff66, #00cc52); box-shadow: 0 0 18px rgba(0,255,102,.4); }
        .icon-btn { background:transparent; color:#e5e7eb; border:none; font-size:18px; cursor:pointer; padding: 4px; }
        .icon-btn:hover { color:#00ff66; }
        .assistant-body { height: 440px; overflow:auto; padding:14px 16px; }
        .messages { display:flex; flex-direction:column; gap:10px; }
        .msg { max-width: 80%; padding:10px 12px; border-radius:10px; line-height:1.35; }
        .msg.user { margin-left:auto; background:#00a0ff; color:white; }
        .msg.assistant { margin-right:auto; background:#1f2937; }
        .assistant-footer { border-top:1px solid #334155; padding:10px 12px; }
        .controls { display:flex; gap:8px; align-items:center; }
        .message-input { flex:1; background:#0b1220; color:#e5e7eb; border:1px solid #334155; border-radius:8px; padding:10px; outline:none; }
        .message-input:focus { border-color:#00ff66; box-shadow: 0 0 0 2px rgba(0,255,102,.2); }
        .voice-btn { 
          background:#1f2937; 
          color:#e5e7eb; 
          border:1px solid #334155; 
          border-radius:8px; 
          padding:10px; 
          cursor:pointer; 
          display:flex; 
          align-items:center; 
          justify-content:center;
          min-width: 44px;
          transition: all 0.2s;
        }
        .voice-btn:hover:not(:disabled) { background:#374151; border-color:#00ff66; }
        .voice-btn:disabled { opacity:.6; cursor:not-allowed; }
        .voice-btn:not(:disabled).listening { background:#dc2626; border-color:#dc2626; animation: pulse 1.5s infinite; }
        .send-btn, .demo-btn { background:#00ff66; color:#0a0a0a; border:none; border-radius:8px; padding:10px 12px; cursor:pointer; transition: background 0.2s; }
        .send-btn:hover, .demo-btn:hover { background:#00e65a; }
        .demo-btn { text-decoration: none; display: inline-block; }
        @keyframes pulse { 0%{transform:scale(1); opacity:1} 50%{transform:scale(1.05); opacity:0.8} 100%{transform:scale(1); opacity:1} }
      `}</style>
    </div>
  );
} 