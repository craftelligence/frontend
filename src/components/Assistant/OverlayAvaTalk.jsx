import React, { useEffect, useState, useRef } from 'react';
import AvaViewer from '../Ava/AvaViewer';

export default function OverlayAvaTalk({ open, onClose }) {
  const [conversation, setConversation] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    
    // Reset conversation state for fresh start
    setConversation([]);
    setCurrentStatus('');
    
    // mark voice session active
    window.dispatchEvent(new CustomEvent('assistant-voice-active', { detail: true }));

    const greet = () => {
      const greetText = "Hey, I'm Ava. I can help you learn about our services. How can I help you today?";
      window.dispatchEvent(new CustomEvent('assistant-tts-say', { detail: greetText }));
      setConversation([{ type: 'assistant', message: greetText, timestamp: Date.now() }]);
      setTimeout(() => window.dispatchEvent(new Event('assistant-start-listening')), 800);
    };
    const t = setTimeout(greet, 150);

    const onFinalTranscript = (e) => {
      const text = e?.detail;
      if (typeof text === 'string' && text.trim()) {
        setConversation(prev => [...prev, { type: 'user', message: text, timestamp: Date.now() }]);
      }
    };

    const onAssistantResponse = (e) => {
      const text = e?.detail;
      if (typeof text === 'string' && text.trim()) {
        setConversation(prev => [...prev, { type: 'assistant', message: text, timestamp: Date.now() }]);
        // VoiceController will automatically restart listening after TTS ends
        // No need to manually restart here
      }
    };

    const onStatus = (e) => {
      const status = e?.detail;
      setCurrentStatus(status || '');
    };

    window.addEventListener('assistant-final-transcript', onFinalTranscript);
    window.addEventListener('assistant-tts-say', onAssistantResponse);
    window.addEventListener('assistant-status', onStatus);

    return () => {
      clearTimeout(t);
      window.removeEventListener('assistant-final-transcript', onFinalTranscript);
      window.removeEventListener('assistant-tts-say', onAssistantResponse);
      window.removeEventListener('assistant-status', onStatus);
      // mark voice session inactive and request stop listening
      window.dispatchEvent(new CustomEvent('assistant-voice-active', { detail: false }));
      window.dispatchEvent(new Event('assistant-stop-listening'));
    };
  }, [open]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  if (!open) return null;

  return (
    <div className="ava-overlay" onClick={onClose}>
      <div className="ava-panel" onClick={(e) => e.stopPropagation()}>
        <div className="ava-content">
          <div className="ava-section">
            <div className="ava-container">
              <AvaViewer 
                width="100%" 
                height="100%" 
                onClose={onClose} 
                showCloseButton={true} 
              />
            </div>
          </div>
          <div className="conversation-section">
            <div className="conversation-header">
              <h3>Conversation</h3>
              {currentStatus && (
                <div className="status-indicator">
                  {currentStatus === 'listening' && '🎤 Listening...'}
                  {currentStatus === 'fetching' && '🤔 Processing...'}
                  {currentStatus === 'speaking' && '💬 Speaking...'}
                  {currentStatus === 'idle' && '💤 Idle'}
                  {currentStatus === 'error' && '❌ Error'}
                </div>
              )}
            </div>
            <div className="conversation-messages">
              {conversation.map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  <div className="message-content">
                    {msg.message}
                  </div>
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              ))}
                             {conversation.length === 0 && (
                 <div className="empty-state">
                   Start a conversation with Ava...
                 </div>
               )}
               <div ref={messagesEndRef} />
             </div>
          </div>
        </div>
      </div>
      <style>{`
        .ava-overlay { 
          position: fixed; 
          inset: 0; 
          background: linear-gradient(135deg, rgba(0,0,0,0.75) 0%, rgba(15,23,42,0.85) 50%, rgba(0,0,0,0.8) 100%); 
          backdrop-filter: blur(8px);
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 9998; 
          animation: fadeIn 0.3s ease-out;
          padding: 20px;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .ava-panel { 
          width: min(95vw, 1000px); 
          height: min(85vh, 700px);
          background: linear-gradient(135deg, #00ff66 0%, #00cc52 100%);
          color: #f8fafc; 
          border: 1px solid rgba(139,92,246,0.3); 
          border-radius: 20px; 
          box-shadow: 
            0 20px 60px rgba(0,0,0,0.4),
            0 0 0 1px rgba(139,92,246,0.1),
            inset 0 1px 0 rgba(255,255,255,0.1); 
          display: flex; 
          flex-direction: column;
          animation: slideUp 0.4s ease-out;
          overflow: hidden;
        }
        
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .ava-content { 
          display: flex; 
          flex-direction: row; 
          flex: 1;
          gap: 0;
          overflow: hidden;
        }
        
        .ava-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        
        .ava-container {
          position: relative;
          border-radius: 20px 0 0 20px;
          overflow: hidden;
          flex: 1;
          width: 100%;
          height: 100%;
          box-shadow: none;
        }
        
        .conversation-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: linear-gradient(135deg, rgba(248,250,252,0.95) 0%, rgba(241,245,249,0.98) 100%);
          backdrop-filter: blur(10px);
          border-left: 1px solid rgba(139,92,246,0.2);
          min-width: 0;
        }
        
        .conversation-header {
          padding: 16px 20px 12px;
          border-bottom: 1px solid rgba(139,92,246,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255,255,255,0.8);
        }
        
        .conversation-header h3 {
          margin: 0;
          color: #1e293b;
          font-size: 16px;
          font-weight: 600;
        }
        
        .status-indicator {
          font-size: 12px;
          color: #6366f1;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .conversation-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .message {
          display: flex;
          flex-direction: column;
          max-width: 85%;
        }
        
        .message.user {
          align-self: flex-end;
        }
        
        .message.assistant {
          align-self: flex-start;
        }
        
        .message-content {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.4;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .message.user .message-content {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          border-bottom-right-radius: 4px;
        }
        
        .message.assistant .message-content {
          background: white;
          color: #1e293b;
          border: 1px solid rgba(139,92,246,0.2);
          border-bottom-left-radius: 4px;
        }
        
        .message-time {
          font-size: 11px;
          color: #64748b;
          margin-top: 4px;
          opacity: 0.7;
        }
        
        .message.user .message-time {
          text-align: right;
        }
        
        .empty-state {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          color: #64748b;
          font-style: italic;
          font-size: 14px;
        }
        

        
        /* Responsive adjustments */
        @media (max-width: 900px) {
          .ava-content {
            flex-direction: column;
          }
          
          .conversation-section {
            border-left: none;
            border-top: 1px solid rgba(139,92,246,0.2);
            max-height: 40%;
          }
          
          .ava-container {
            border-radius: 20px 20px 0 0;
          }
        }
        
        @media (max-width: 640px) {
          .ava-overlay {
            padding: 10px;
          }
          
          .ava-panel {
            width: 95vw;
            height: 90vh;
            border-radius: 16px;
          }
          
          .ava-container {
            border-radius: 16px 16px 0 0;
          }
          
          .conversation-header {
            padding: 12px 16px 10px;
          }
          
          .conversation-header h3 {
            font-size: 15px;
          }
          
          .conversation-messages {
            padding: 12px;
          }
          
          .message-content {
            padding: 10px 12px;
            font-size: 13px;
          }
        }
        
        @media (max-height: 700px) {
          .ava-panel {
            height: 95vh;
          }
        }
      `}</style>
    </div>
  );
} 