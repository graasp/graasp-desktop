import { hasMath, renderMathBlock, renderMathInline, renderMath } from './math';
import {
  BLOCK_MATH_INDICATOR,
  INLINE_MATH_INDICATOR,
} from '../config/constants';
import * as FIXTURES from '../test/fixtures/math';

describe('math', () => {
  describe('hasMath', () => {
    it(`returns true for ${BLOCK_MATH_INDICATOR}`, () => {
      const rvalue = hasMath(BLOCK_MATH_INDICATOR);
      expect(rvalue).toBeTruthy();
    });
    it(`returns true for ${INLINE_MATH_INDICATOR}`, () => {
      const rvalue = hasMath(INLINE_MATH_INDICATOR);
      expect(rvalue).toBeTruthy();
    });
    it(`returns true for a string with both ${BLOCK_MATH_INDICATOR} and ${INLINE_MATH_INDICATOR}`, () => {
      const rvalue = hasMath(FIXTURES.input1);
      expect(rvalue).toBeTruthy();
    });
    it(`returns true for a string with a ${INLINE_MATH_INDICATOR}`, () => {
      const rvalue = hasMath(FIXTURES.input2);
      expect(rvalue).toBeTruthy();
    });
    it(`returns true for a string with a ${BLOCK_MATH_INDICATOR}`, () => {
      const rvalue = hasMath(FIXTURES.input3);
      expect(rvalue).toBeTruthy();
    });
    it(`returns false for a string with no square brackets or parentheses`, () => {
      const rvalue = hasMath(FIXTURES.input4);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for an empty string`, () => {
      const rvalue = hasMath(FIXTURES.input5);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for null input`, () => {
      const rvalue = hasMath(FIXTURES.input6);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for undefined input`, () => {
      const rvalue = hasMath(FIXTURES.input7);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for input of type number`, () => {
      const rvalue = hasMath(FIXTURES.input8);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for input with square brackets but no math`, () => {
      const rvalue = hasMath(FIXTURES.input9);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for input with parentheses but no math`, () => {
      const rvalue = hasMath(FIXTURES.input10);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for an opening square bracket`, () => {
      const rvalue = hasMath(FIXTURES.input11);
      expect(rvalue).toBeFalsy();
    });
    it(`returns false for an opening parenthesis`, () => {
      const rvalue = hasMath(FIXTURES.input12);
      expect(rvalue).toBeFalsy();
    });
  });

  describe('renderMathBlock', () => {
    it(`parses a string with block math as expected`, () => {
      const rvalue = renderMathBlock(FIXTURES.input3);
      expect(rvalue).toEqual(FIXTURES.output3);
    });
    it(`leaves a square bracket as is`, () => {
      const rvalue = renderMathBlock(FIXTURES.input11);
      expect(rvalue).toEqual(FIXTURES.input11);
    });
    it(`leaves text with square brackets but no math as is`, () => {
      const rvalue = renderMathBlock(FIXTURES.input9);
      expect(rvalue).toEqual(FIXTURES.input9);
    });
  });

  describe('renderMathInline', () => {
    it(`parses a string with inline math as expected`, () => {
      const rvalue = renderMathInline(FIXTURES.input2);
      expect(rvalue).toEqual(FIXTURES.output2);
    });
    it(`leaves a parenthesis as is`, () => {
      const rvalue = renderMathInline(FIXTURES.input12);
      expect(rvalue).toEqual(FIXTURES.input12);
    });
    it(`leaves text with parentheses but no math as is`, () => {
      const rvalue = renderMathInline(FIXTURES.input10);
      expect(rvalue).toEqual(FIXTURES.input10);
    });
  });

  describe('renderMath', () => {
    it(`parses a string with block math as expected`, () => {
      const rvalue = renderMath(FIXTURES.input3);
      expect(rvalue).toEqual(FIXTURES.output3);
    });
    it(`parses a string with inline math as expected`, () => {
      const rvalue = renderMath(FIXTURES.input2);
      expect(rvalue).toEqual(FIXTURES.output2);
    });
    it(`parses a string with both block and inline math as expected`, () => {
      const rvalue = renderMath(FIXTURES.input1);
      expect(rvalue).toEqual(FIXTURES.output1);
    });
    it(`parses the quadratic formula as expected`, () => {
      const rvalue = renderMath(FIXTURES.quadraticInput);
      expect(rvalue).toEqual(FIXTURES.quadraticOutput);
    });
    it(`parses cauchy's integral formula as expected`, () => {
      const rvalue = renderMath(FIXTURES.cauchyInput);
      expect(rvalue).toEqual(FIXTURES.cauchyOutput);
    });
    it(`parses the double angle formula for cosines as expected`, () => {
      const rvalue = renderMath(FIXTURES.cosinesInput);
      expect(rvalue).toEqual(FIXTURES.cosinesOutput);
    });
    it(`parses gauss' divergence theorem as expected`, () => {
      const rvalue = renderMath(FIXTURES.gaussInput);
      expect(rvalue).toEqual(FIXTURES.gaussOutput);
    });
    it(`parses the curl of a vector field as expected`, () => {
      const rvalue = renderMath(FIXTURES.vectorInput);
      expect(rvalue).toEqual(FIXTURES.vectorOutput);
    });
    it(`parses standard deviation as expected`, () => {
      const rvalue = renderMath(FIXTURES.sigmaInput);
      expect(rvalue).toEqual(FIXTURES.sigmaOutput);
    });
    it(`parses the definition of christoffel symbols as expected`, () => {
      const rvalue = renderMath(FIXTURES.christoffelInput);
      expect(rvalue).toEqual(FIXTURES.christoffelOutput);
    });
    it(`leaves a square bracket as is`, () => {
      const rvalue = renderMath(FIXTURES.input11);
      expect(rvalue).toEqual(FIXTURES.input11);
    });
    it(`leaves text with square brackets but no math as is`, () => {
      const rvalue = renderMath(FIXTURES.input9);
      expect(rvalue).toEqual(FIXTURES.input9);
    });
    it(`leaves a parenthesis as is`, () => {
      const rvalue = renderMath(FIXTURES.input12);
      expect(rvalue).toEqual(FIXTURES.input12);
    });
    it(`leaves text with parentheses but no math as is`, () => {
      const rvalue = renderMath(FIXTURES.input10);
      expect(rvalue).toEqual(FIXTURES.input10);
    });
  });
});
