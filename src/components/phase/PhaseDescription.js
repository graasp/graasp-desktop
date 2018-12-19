import React from 'react';

const PhaseDescription = ({ description }) => (
  <div dangerouslySetInnerHTML={{ __html: description }} />
);


export default PhaseDescription;
