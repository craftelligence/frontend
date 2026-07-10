import React from 'react';

const BrandMark = ({ alt = 'Craftelligence' }) => (
  <span className="brand-mark" role="img" aria-label={alt}>
    <img className="brand-mark-logo" src="/logo_white.svg" alt="" aria-hidden="true" />
  </span>
);

export default BrandMark;
