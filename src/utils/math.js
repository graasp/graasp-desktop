import katex from 'katex';
import _ from 'lodash';
import {
  BLOCK_MATH_DIV,
  BLOCK_MATH_INDICATOR,
  BLOCK_MATH_REGEX,
  INLINE_MATH_DIV,
  INLINE_MATH_INDICATOR,
  INLINE_MATH_REGEX,
} from '../config/constants';

const hasMath = (input = '') => {
  return (
    _.isString(input) &&
    (input.includes(BLOCK_MATH_INDICATOR) ||
      input.includes(INLINE_MATH_INDICATOR))
  );
};

const renderToString = (input = '', indicator, regex, div) => {
  let output = input;
  if (input.includes(indicator)) {
    const matches = [...input.matchAll(regex)];
    matches.forEach(match => {
      const text = match[2];
      const matched = match[0];
      const parsed = `<${div} class="ql-formula" data-value="${text}">
          <span contenteditable="false">
            ${katex.renderToString(text, {
              throwOnError: false,
            })}
          </span>
        <${div}>`;
      output = output.replace(matched, parsed);
    });
  }
  return output;
};

const renderMathBlock = input =>
  renderToString(input, BLOCK_MATH_INDICATOR, BLOCK_MATH_REGEX, BLOCK_MATH_DIV);
const renderMathInline = input =>
  renderToString(
    input,
    INLINE_MATH_INDICATOR,
    INLINE_MATH_REGEX,
    INLINE_MATH_DIV
  );

const renderMath = input => {
  let rvalue = input;
  rvalue = renderMathInline(rvalue);
  rvalue = renderMathBlock(rvalue);
  return rvalue;
};

export { renderMathInline, renderMathBlock, renderMath, hasMath };
