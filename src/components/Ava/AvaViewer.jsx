import React, { useEffect, useState, useRef } from 'react';

const MODEL_VIEWER_SRC = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
const AVATAR_URL = 'https://models.readyplayer.me/6899dcf71a456f062ff16b72.glb?morphTargets=Oculus%20Visemes,ARKit';

export default function AvaViewer({ width = 280, height = 380, onClose, showCloseButton = false }) {
  const [speaking, setSpeaking] = useState(false);
  const modelViewerRef = useRef(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const lipSyncIntervalRef = useRef(null);
  const headNodIntervalRef = useRef(null);
  const currentAudioRef = useRef(null);
  const lipSyncRetryCountRef = useRef(0);
  const modelLoadRetryCountRef = useRef(0);

  // Stop all speech and audio
  const stopSpeaking = () => {
    console.log('Stopping all speech...');
    
    // Stop TTS
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    // Stop any playing audio
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    
    // Dispatch stop events
    window.dispatchEvent(new CustomEvent('assistant-speech-end'));
    window.dispatchEvent(new CustomEvent('assistant-tts-end'));
    
    setSpeaking(false);
    stopLipSync();
    stopHeadNod();
  };

  useEffect(() => {
    // Load model-viewer script once
    const exists = document.querySelector(`script[src="${MODEL_VIEWER_SRC}"]`);
    if (!exists) {
      const s = document.createElement('script');
      s.type = 'module';
      s.src = MODEL_VIEWER_SRC;
      document.head.appendChild(s);
    }

    const onStart = () => {
      console.log('Speech started - starting animations, modelLoaded:', modelLoaded);
      setSpeaking(true);
      startLipSync();
      startHeadNod();
    };
    const onEnd = () => {
      console.log('Speech ended - stopping animations');
      setSpeaking(false);
      stopLipSync();
      stopHeadNod();
    };

    // Listen for TTS events for lip sync
    const onTTSStart = () => {
      console.log('TTS started - starting animations, modelLoaded:', modelLoaded);
      setSpeaking(true);
      startLipSync();
      startHeadNod();
    };
    const onTTSEnd = () => {
      console.log('TTS ended - stopping animations');
      setSpeaking(false);
      stopLipSync();
      stopHeadNod();
    };

    window.addEventListener('assistant-speech-start', onStart);
    window.addEventListener('assistant-speech-end', onEnd);
    window.addEventListener('assistant-tts-start', onTTSStart);
    window.addEventListener('assistant-tts-end', onTTSEnd);
    
    // Handle page unload to stop speech
    const handleBeforeUnload = () => {
      stopSpeaking();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('assistant-speech-start', onStart);
      window.removeEventListener('assistant-speech-end', onEnd);
      window.removeEventListener('assistant-tts-start', onTTSStart);
      window.removeEventListener('assistant-tts-end', onTTSEnd);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopSpeaking();
    };
  }, []);

  // Handle model load
  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      console.log('Avatar model load event fired');
      
      // Wait a bit for the model to be fully accessible, then verify it has morph targets
      setTimeout(() => {
        if (modelViewer.model && modelViewer.model.scene) {
          console.log('Model:', modelViewer.model);
          console.log('Available animations:', modelViewer.availableAnimations);
          
          let foundMorphTargets = false;
          // Try to access morphTargets
          const scene = modelViewer.model;
          scene.scene.traverse((child) => {
            if (child.morphTargetInfluences && child.morphTargetDictionary) {
              console.log('Found mesh with morph targets:', child.name, child.morphTargetInfluences.length);
              console.log('Morph target dictionary:', child.morphTargetDictionary);
              foundMorphTargets = true;
            }
          });
          
          if (foundMorphTargets) {
            setModelLoaded(true);
            modelLoadRetryCountRef.current = 0; // Reset retry count
            console.log('Avatar model fully loaded with morph targets!');
            
            // Test animations after model loads
            console.log('Testing animations...');
            testAnimations();
          } else if (modelLoadRetryCountRef.current < 10) {
            modelLoadRetryCountRef.current++;
            console.log(`Model loaded but no morph targets found, retrying ${modelLoadRetryCountRef.current}/10...`);
            setTimeout(() => handleLoad(), 500);
          } else {
            console.log('Max model load retries reached, setting loaded anyway');
            setModelLoaded(true);
          }
        } else if (modelLoadRetryCountRef.current < 10) {
          modelLoadRetryCountRef.current++;
          console.log(`Model not accessible yet, retrying ${modelLoadRetryCountRef.current}/10...`);
          setTimeout(() => handleLoad(), 500);
        } else {
          console.log('Max model load retries reached, setting loaded anyway');
          setModelLoaded(true);
        }
      }, 1000);
    };

    const handleError = (event) => {
      console.error('Error loading avatar model:', event);
    };

    modelViewer.addEventListener('load', handleLoad);
    modelViewer.addEventListener('error', handleError);

    return () => {
      modelViewer.removeEventListener('load', handleLoad);
      modelViewer.removeEventListener('error', handleError);
    };
  }, []);

  // Test animations function
  const testAnimations = () => {
    if (!modelViewerRef.current || !modelLoaded) return;
    
    console.log('Running animation test...');
    const modelViewer = modelViewerRef.current;
    
    try {
      // Access the loaded model
      const model = modelViewer.model;
      if (model && model.scene) {
        let foundMorphTargets = false;
        
        model.scene.traverse((child) => {
          if (child.morphTargetInfluences && child.morphTargetDictionary) {
            foundMorphTargets = true;
            console.log('Testing morph targets on:', child.name);
            
            // Test viseme_aa if available
            const visemeIndex = child.morphTargetDictionary['viseme_aa'] || child.morphTargetDictionary['viseme_AA'];
            if (visemeIndex !== undefined) {
              console.log('Found viseme_aa at index:', visemeIndex);
              child.morphTargetInfluences[visemeIndex] = 0.8;
              
              setTimeout(() => {
                child.morphTargetInfluences[visemeIndex] = 0;
                
                // Test viseme_O
                const visemeOIndex = child.morphTargetDictionary['viseme_O'] || child.morphTargetDictionary['viseme_o'];
                if (visemeOIndex !== undefined) {
                  child.morphTargetInfluences[visemeOIndex] = 0.6;
                  setTimeout(() => {
                    child.morphTargetInfluences[visemeOIndex] = 0;
                  }, 300);
                }
              }, 300);
            }
          }
        });
        
        if (!foundMorphTargets) {
          console.log('No morph targets found in the model');
        }
      }
    } catch (error) {
      console.error('Error testing animations:', error);
    }
  };

  // Enhanced lip sync animation using model-viewer API
  const startLipSync = () => {
    if (!modelViewerRef.current || !modelLoaded) {
      if (lipSyncRetryCountRef.current < 5) {
        lipSyncRetryCountRef.current++;
        console.log(`Cannot start lip sync - model not ready, retrying ${lipSyncRetryCountRef.current}/5 in 500ms...`);
        setTimeout(() => startLipSync(), 500);
      } else {
        console.log('Max lip sync retries reached, giving up');
      }
      return;
    }
    
    // Double-check that the model and scene are actually available
    const modelViewer = modelViewerRef.current;
    if (!modelViewer.model || !modelViewer.model.scene) {
      if (lipSyncRetryCountRef.current < 5) {
        lipSyncRetryCountRef.current++;
        console.log(`Model scene not ready yet, retrying ${lipSyncRetryCountRef.current}/5 in 500ms...`);
        setTimeout(() => startLipSync(), 500);
      } else {
        console.log('Max lip sync retries reached, giving up');
      }
      return;
    }
    
    // Reset retry count on successful start
    lipSyncRetryCountRef.current = 0;
    stopLipSync(); // Clear any existing animation
    console.log('Starting lip sync animation...');
    
    // Enhanced lip sync animation
    const animateLipSync = () => {
      if (!speaking || !modelViewerRef.current) return;
      
      try {
        const model = modelViewer.model;
        if (model && model.scene) {
          let foundAnyMorph = false;
          model.scene.traverse((child) => {
            if (child.morphTargetInfluences && child.morphTargetDictionary) {
              foundAnyMorph = true;
              // More comprehensive viseme list including common naming variations
              const visemes = [
                'viseme_aa', 'viseme_AA', 'viseme_E', 'viseme_e', 'viseme_I', 'viseme_i', 
                'viseme_O', 'viseme_o', 'viseme_U', 'viseme_u', 'viseme_CH', 'viseme_ch',
                'viseme_DD', 'viseme_dd', 'viseme_FF', 'viseme_ff', 'viseme_kk', 'viseme_KK'
              ];
              
              // Reset all visemes first
              visemes.forEach(visemeName => {
                const index = child.morphTargetDictionary[visemeName];
                if (index !== undefined) {
                  child.morphTargetInfluences[index] = 0;
                }
              });
              
              // Pick a random viseme to animate
              const availableVisemes = visemes.filter(v => child.morphTargetDictionary[v] !== undefined);
              if (availableVisemes.length > 0) {
                const randomViseme = availableVisemes[Math.floor(Math.random() * availableVisemes.length)];
                const visemeIndex = child.morphTargetDictionary[randomViseme];
                
                if (visemeIndex !== undefined) {
                  const intensity = 0.3 + Math.random() * 0.6; // 0.3 to 0.9
                  child.morphTargetInfluences[visemeIndex] = intensity;
                  console.log(`Animating viseme: ${randomViseme} with intensity ${intensity.toFixed(2)}`);
                  
                  // Reset after a short time
                  setTimeout(() => {
                    if (child.morphTargetInfluences && child.morphTargetInfluences[visemeIndex] !== undefined) {
                      child.morphTargetInfluences[visemeIndex] = 0;
                    }
                  }, 80 + Math.random() * 120);
                }
              } else {
                console.log('No available visemes found for animation');
              }
            }
          });
          
          if (!foundAnyMorph) {
            console.log('No morph target meshes found during animation');
          }
        } else {
          console.log('Model or scene not available during animation');
        }
      } catch (error) {
        console.error('Lip sync animation error:', error);
      }
    };
    
    // Run animation at intervals for visible movement
    lipSyncIntervalRef.current = setInterval(animateLipSync, 120);
  };

  // Head nodding animation
  const startHeadNod = () => {
    if (!modelViewerRef.current || !modelLoaded) return;
    
    stopHeadNod();
    console.log('Starting head nod animation...');
    
    const modelViewer = modelViewerRef.current;
    let nodDirection = 1;
    
    const animateHeadNod = () => {
      if (!speaking || !modelViewerRef.current) return;
      
      try {
        // Subtle head movement by adjusting camera orbit slightly
        const currentOrbit = modelViewer.getCameraOrbit();
        const baseTheta = 0; // degrees
        const basePhi = 90; // degrees
        
        // Small random head movements
        const thetaOffset = (Math.random() - 0.5) * 4; // ±2 degrees
        const phiOffset = (Math.random() - 0.5) * 3 + nodDirection * 1; // slight nod
        
        modelViewer.cameraOrbit = `${baseTheta + thetaOffset}deg ${basePhi + phiOffset}deg 2.2m`;
        
        // Change nod direction occasionally
        if (Math.random() < 0.3) {
          nodDirection *= -1;
        }
        
      } catch (error) {
        console.error('Head nod animation error:', error);
      }
    };
    
    // Less frequent head movements
    headNodIntervalRef.current = setInterval(animateHeadNod, 800);
  };

  const stopLipSync = () => {
    if (lipSyncIntervalRef.current) {
      clearInterval(lipSyncIntervalRef.current);
      lipSyncIntervalRef.current = null;
      console.log('Stopped lip sync animation');
    }
    
    // Reset all morph targets
    if (modelViewerRef.current && modelViewerRef.current.model) {
      try {
        const model = modelViewerRef.current.model;
        if (model && model.scene) {
          model.scene.traverse((child) => {
            if (child.morphTargetInfluences && child.morphTargetDictionary) {
              // Reset all possible visemes
              Object.keys(child.morphTargetDictionary).forEach(morphName => {
                if (morphName.toLowerCase().includes('viseme')) {
                  const index = child.morphTargetDictionary[morphName];
                  if (index !== undefined) {
                    child.morphTargetInfluences[index] = 0;
                  }
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Error resetting morph targets:', error);
      }
    }
  };

  const stopHeadNod = () => {
    if (headNodIntervalRef.current) {
      clearInterval(headNodIntervalRef.current);
      headNodIntervalRef.current = null;
      console.log('Stopped head nod animation');
    }
    
    // Reset camera position
    if (modelViewerRef.current) {
      try {
        modelViewerRef.current.cameraOrbit = "0deg 90deg 2.2m";
      } catch (error) {
        console.error('Error resetting camera position:', error);
      }
    }
  };

  const handleClose = () => {
    stopSpeaking();
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className={`ava-shell ${speaking ? 'speaking' : ''}`} style={{ width, height }}>
      {/* Close button - only show when showCloseButton is true */}
      {showCloseButton && (
        <button 
          className="close-button"
          onClick={handleClose}
          title="Stop talking and close"
        >
          ✕
        </button>
      )}

      {/* eslint-disable-next-line */}
      <model-viewer
        ref={modelViewerRef}
        src={AVATAR_URL}
        environment-image="/hdr/DayEnvironmentHDRI008_2K-TONEMAPPED.jpg"
        skybox-image="/hdr/DayEnvironmentHDRI008_2K-TONEMAPPED.jpg"
        autoplay
        camera-controls
        interaction-prompt="none"
        camera-orbit="0deg 90deg 2.2m"
        min-camera-orbit="auto 65deg 1.8m"
        max-camera-orbit="auto 95deg 2.6m"
        camera-target="0m 1.4m 0m"
        field-of-view="50deg"
        max-field-of-view="45deg"
        min-field-of-view="22deg"
        exposure="3.5"
        shadow-intensity="0.4"
        shadow-softness="3"
        tone-mapping="neutral"
        style={{ width: '100%', height: '100%', borderRadius: 12 }}
      />
      
      {/* Loading indicator */}
      {!modelLoaded && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading Ava...</div>
        </div>
      )}
      
      {/* Speaking indicator */}
      {speaking && (
        <div className="speaking-indicator">
          <div className="pulse-ring"></div>
          <div className="speaking-text">Speaking...</div>
        </div>
      )}
      
      <style>{`
        .ava-shell { 
          position: relative; 
          border-radius: 12px; 
          overflow: hidden; 
          transition: transform .3s ease, box-shadow .3s ease; 
          background: white;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .ava-shell.speaking { 
          box-shadow: 0 0 0 3px rgba(139,92,246,0.5), 0 8px 32px rgba(139,92,246,0.2); 
          animation: speakingPulse 1.5s ease-in-out infinite; 
        }
        @keyframes speakingPulse { 
          0%, 100% { transform: scale(1); } 
          50% { transform: scale(1.02); } 
        }
        
        .close-button {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 32px;
          height: 32px;
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          z-index: 30;
          transition: all 0.2s ease;
        }
        .close-button:hover {
          background: rgba(239,68,68,0.8);
          transform: scale(1.1);
        }
        .close-button:active {
          transform: scale(0.95);
        }
        
        .loading-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          z-index: 10;
        }
        
        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(139,92,246,0.3);
          border-top: 3px solid #00ff66;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }
        
        .loading-text {
          color: #64748b;
          font-size: 14px;
          font-weight: 500;
        }
        
        .speaking-indicator {
          position: absolute;
          bottom: 8px;
          left: 8px;
          display: flex;
          align-items: center;
          background: rgba(139,92,246,0.9);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          z-index: 20;
        }
        
        .pulse-ring {
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
          margin-right: 8px;
          animation: pulse 1s ease-in-out infinite;
        }
        
        .speaking-text {
          font-size: 11px;
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(0.8);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* Enhanced model-viewer styling */
        model-viewer {
          --poster-color: white;
          --progress-bar-color: #00ff66;
          --progress-bar-height: 3px;
        }
      `}</style>
    </div>
  );
} 