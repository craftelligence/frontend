import React, { useEffect, useRef, useState } from 'react';

export default function VoiceController({ apiBase = 'http://localhost:8080' }) {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voice, setVoice] = useState(null);
  const synthRef = useRef(null);
  const messagesRef = useRef([{ role: 'assistant', content: 'Hi! I am Ava.' }]);
  const speakingRef = useRef(false);

  // TTS speak with lip sync events
  const speak = (text) => {
    if (!synthRef.current) return;
    const utter = new SpeechSynthesisUtterance(text);
    if (voice) utter.voice = voice;
    
    utter.onstart = () => { 
      speakingRef.current = true; 
      // Emit multiple events for different components
      window.dispatchEvent(new Event('assistant-speech-start'));
      window.dispatchEvent(new Event('assistant-tts-start')); // For lip sync
    };
    
    utter.onend = () => { 
      speakingRef.current = false; 
      // Emit multiple events for different components
      window.dispatchEvent(new Event('assistant-speech-end')); 
      window.dispatchEvent(new Event('assistant-tts-end')); // For lip sync
      window.dispatchEvent(new CustomEvent('assistant-status', { detail: 'idle' }));
      console.log('TTS ended, voiceActive:', voiceActive, 'listening:', listening);
      
      // Always try to restart listening after TTS ends - startListening has proper checks
      setTimeout(() => {
        console.log('Attempting to restart listening after TTS ended...');
        startListening();
      }, 200);
    };
    
    try { synthRef.current.cancel(); } catch {}
    synthRef.current.speak(utter);
  };

  const startListening = () => {
    console.log('startListening called - recognitionRef:', !!recognitionRef.current, 'voiceActive:', voiceActive, 'listening:', listening);
    if (!recognitionRef.current) {
      console.log('No recognition ref, returning');
      return;
    }
    if (!voiceActive) {
      console.log('Voice not active, returning');
      return;
    }
    try {
      if (!listening) {
        console.log('Starting speech recognition...');
        setListening(true);
        window.dispatchEvent(new CustomEvent('assistant-status', { detail: 'listening' }));
        recognitionRef.current.start();
      } else {
        console.log('Already listening, skipping...');
      }
    } catch (error) {
      console.error('Error starting recognition:', error);
    }
  };

  const stopListening = () => {
    try { recognitionRef.current && recognitionRef.current.stop(); } catch {}
    setListening(false);
  };

  useEffect(() => {
    // init TTS voices
    synthRef.current = window.speechSynthesis || null;
    if (synthRef.current) {
      const loadVoices = () => {
        const voices = synthRef.current.getVoices();
        const preferred = voices.find(v => /female/i.test(v.name))
          || voices.find(v => v.lang?.toLowerCase().includes('en') && /female|samantha|victoria|ava|susan|allison/i.test(v.name))
          || voices.find(v => v.lang?.toLowerCase().startsWith('en'))
          || voices[0];
        setVoice(preferred || null);
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // init STT
    const R = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (R) {
      recognitionRef.current = new R();
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.onresult = async (e) => {
        const result = e.results[e.results.length - 1];
        const text = result[0].transcript;
        // live transcript for overlay
        window.dispatchEvent(new CustomEvent('assistant-partial-transcript', { detail: text }));
        if (result.isFinal) {
          const finalText = text.trim();
          if (finalText && voiceActive) {
            // Dispatch final transcript for UI display
            window.dispatchEvent(new CustomEvent('assistant-final-transcript', { detail: finalText }));
            // append and send
            messagesRef.current = [...messagesRef.current, { role: 'user', content: finalText }];
            try {
              // show fetching state with a small UX pause
              window.dispatchEvent(new CustomEvent('assistant-status', { detail: 'fetching' }));
              await new Promise(r => setTimeout(r, 1000));
              const res = await fetch(`${apiBase}/chat`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: messagesRef.current })
              });
              const data = await res.json();
              const reply = data.reply || 'Sorry, something went wrong.';
              messagesRef.current = [...messagesRef.current, { role: 'assistant', content: reply }];
              // announce to overlay and speak
              window.dispatchEvent(new CustomEvent('assistant-tts-say', { detail: reply }));
              window.dispatchEvent(new CustomEvent('assistant-status', { detail: 'speaking' }));
              speak(reply);
              // after reply, resume listening if still active (when TTS ends, onend handler will restart)
            } catch { window.dispatchEvent(new CustomEvent('assistant-status', { detail: 'error' })); }
          }
        }
      };
      recognitionRef.current.onend = () => {
        setListening(false);
        console.log('Recognition ended, voiceActive:', voiceActive, 'speaking:', speakingRef.current);
        // Resume listening only if overlay is active and TTS is not currently speaking
        if (voiceActive && !speakingRef.current) {
          console.log('Scheduling restart from recognition onend...');
          setTimeout(() => startListening(), 200);
        } else {
          console.log('Not restarting from recognition onend - voiceActive:', voiceActive, 'speaking:', speakingRef.current);
        }
      };
      
      recognitionRef.current.onerror = (e) => {
        console.warn('Speech recognition error:', e.error);
        setListening(false);
        // Restart listening after error if still active
        if (voiceActive && !speakingRef.current) setTimeout(() => startListening(), 500);
      };
    }

    const onVoiceActive = (e) => {
      const active = !!e.detail;
      console.log('Voice active changed to:', active);
      setVoiceActive(active);
    };
    const onStartEvt = () => startListening();
    const onStopEvt = () => stopListening();
    const onSay = (e) => { const t = e?.detail; if (t) speak(t); };

    window.addEventListener('assistant-voice-active', onVoiceActive);
    window.addEventListener('assistant-start-listening', onStartEvt);
    window.addEventListener('assistant-stop-listening', onStopEvt);
    window.addEventListener('assistant-tts-say', onSay);

    return () => {
      window.removeEventListener('assistant-voice-active', onVoiceActive);
      window.removeEventListener('assistant-start-listening', onStartEvt);
      window.removeEventListener('assistant-stop-listening', onStopEvt);
      window.removeEventListener('assistant-tts-say', onSay);
      stopListening();
    };
  }, [apiBase, voiceActive]);

  return null; // headless controller
} 