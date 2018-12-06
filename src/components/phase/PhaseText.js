import React from 'react';

const PhaseText = ({ content }) => (
  <div dangerouslySetInnerHTML={{ __html: content }}></div>
);

export default PhaseText;
