import React from 'react';
import { Bot, Sparkles, UserRound } from 'lucide-react';

const BrandMark = ({ alt = 'Craftelligence' }) => (
  <span className="brand-mark" role="img" aria-label={alt}>
    <span className="brand-mark-stage brand-mark-robot" aria-hidden="true"><Bot size={19} strokeWidth={1.8} /></span>
    <span className="brand-mark-stage brand-mark-human" aria-hidden="true"><UserRound size={18} strokeWidth={1.8} /></span>
    <Sparkles className="brand-mark-spark brand-mark-spark-one" size={10} aria-hidden="true" />
    <Sparkles className="brand-mark-spark brand-mark-spark-two" size={8} aria-hidden="true" />
    <img className="brand-mark-logo" src="/logo_white.svg" alt="" aria-hidden="true" />
  </span>
);

export default BrandMark;
