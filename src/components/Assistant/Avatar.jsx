import React from 'react';

export default function Avatar({ speaking = false }) {
  return (
    <div className={`avatar-wrap ${speaking ? 'speaking' : ''}`}>
      <div className="avatar-head">
        <div className="avatar-hair" />
        <div className="avatar-face">
          <div className="avatar-eye left" />
          <div className="avatar-eye right" />
          <div className="avatar-mouth" />
          <div className="avatar-blush left" />
          <div className="avatar-blush right" />
        </div>
      </div>

      <style>{`
        .avatar-wrap { width: 84px; height: 84px; position: relative; display:flex; align-items:center; justify-content:center; }
        .avatar-wrap.speaking { animation: bob 1.2s ease-in-out infinite; }
        @keyframes bob { 0%{ transform: translateY(0) } 50%{ transform: translateY(-2px) } 100%{ transform: translateY(0) } }

        .avatar-head { position: relative; width: 72px; height: 72px; border-radius: 50%; background: #f2d6c9; box-shadow: 0 3px 12px rgba(0,0,0,.2) inset; }
        .avatar-hair { position:absolute; inset: -4px -4px 38px -4px; background: linear-gradient(135deg, #00ff66, #00cc52); border-top-left-radius: 60px; border-top-right-radius: 60px; border-bottom-left-radius: 30px; border-bottom-right-radius: 30px; box-shadow: 0 4px 10px rgba(0,255,102,.35); }

        .avatar-face { position:absolute; inset: 10px 8px 8px 8px; }
        .avatar-eye { position:absolute; top: 18px; width: 8px; height: 8px; background:#1f2937; border-radius: 50%; animation: blink 4s infinite; }
        .avatar-eye.left { left: 16px; }
        .avatar-eye.right { right: 16px; }
        @keyframes blink { 0%, 92%, 100% { transform: scaleY(1); } 96% { transform: scaleY(0.1); } }

        .avatar-mouth { position:absolute; left:50%; bottom:14px; width: 16px; height: 6px; background:#b91c1c; border-radius: 9px/4px; transform: translateX(-50%); transition: all .15s ease; }
        .avatar-wrap.speaking .avatar-mouth { height: 18px; width: 18px; border-radius: 10px; box-shadow: inset 0 4px 0 rgba(0,0,0,.15); }

        .avatar-blush { position:absolute; bottom: 18px; width: 10px; height: 6px; background: rgba(236,72,153,.35); border-radius: 50%; filter: blur(0.2px); }
        .avatar-blush.left { left: 8px; }
        .avatar-blush.right { right: 8px; }
      `}</style>
    </div>
  );
} 