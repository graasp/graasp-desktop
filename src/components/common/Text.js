import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactQuill from 'react-quill';
import { connect } from 'react-redux';
import { hasMath, renderMath } from '../../utils/math';
import { DEFAULT_FONT_SIZE } from '../../config/constants';
import { getFontSize } from '../../actions';

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

export const Text = ({
  content,
  style,
  className,
  id,
  fontSize,
  dispatchGetFontSize,
}) => {
  useEffect(() => {
    // apply font size to quill component
    dispatchGetFontSize();
    document.querySelector(
      `#${id} .ql-container`
    ).style.fontSize = `${fontSize}px`;
  }, []);

  let parsedContent = content;
  if (hasMath(content)) {
    parsedContent = renderMath(parsedContent);
  }
  return (
    <div style={style} id={id}>
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
  id: PropTypes.string.isRequired,
  fontSize: PropTypes.number,
  dispatchGetFontSize: PropTypes.func.isRequired,
};

Text.defaultProps = {
  content: '',
  className: '',
  style: {},
  fontSize: DEFAULT_FONT_SIZE,
};

const mapStateToProps = ({ authentication }) => ({
  fontSize: authentication.getIn(['user', 'settings', 'fontSize']),
});

const mapDispatchToProps = {
  dispatchGetFontSize: getFontSize,
};

const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Text);

export default ConnectedComponent;
