import React from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import { hasMath, renderMath } from '../../utils/math';

const modules = {
  toolbar: false,
};

const formats = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'formula',
];

export const Text = ({ content, style, className }) => {
  let parsedContent = content;
  if (hasMath(content)) {
    parsedContent = renderMath(parsedContent);
  }
  return (
    <div style={style}>
      <ReactQuill
        className={className}
        value={parsedContent}
        modules={modules}
        formats={formats}
        style={{ border: '0' }}
        readOnly
      />
    </div>
  );
};

Text.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.shape({}),
};

Text.defaultProps = {
  content: '',
  className: '',
  style: {},
};

export default Text;
