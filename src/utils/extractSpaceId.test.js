import extractSpaceId from './extractSpaceId';
import {
  malformedGraaspCloudLongLink,
  malformedGraaspCloudShortLink,
  malformedGraaspSpaceLink,
  malformedGraaspViewerLongLink,
  randomLink1,
  randomLink2,
  randomLink3,
  randomLink4,
  randomLink5,
  space1GraaspCloudAllProtocolLongEnLink,
  space1GraaspCloudAllProtocolLongFrLink,
  space1GraaspCloudAllProtocolLongLink,
  space1GraaspCloudAllProtocolShortLink,
  space1GraaspCloudHttpLongEnLink,
  space1GraaspCloudHttpLongFrLink,
  space1GraaspCloudHttpLongLink,
  space1GraaspCloudHttpLongLinkWithTrailingCharacters,
  space1GraaspCloudHttpLongLinkWithTrailingSlash,
  space1GraaspCloudHttpShortLink,
  space1GraaspCloudHttpShortLinkWithTrailingCharacters,
  space1GraaspCloudHttpShortLinkWithTrailingSlash,
  space1GraaspCloudLongEnLink,
  space1GraaspCloudLongFrLink,
  space1GraaspCloudLongLink,
  space1GraaspCloudNakedLongEnLink,
  space1GraaspCloudNakedLongFrLink,
  space1GraaspCloudNakedLongLink,
  space1GraaspCloudNakedShortLink,
  space1GraaspCloudShortLink,
  space1GraaspSpacesAllProtocolLink,
  space1GraaspSpacesHttpLink,
  space1GraaspSpacesHttpLinkWithTrailingCharacters,
  space1GraaspSpacesHttpLinkWithTrailingSlash,
  space1GraaspSpacesLink,
  space1GraaspSpacesNakedLink,
  space1GraaspViewerAllProtocolLongEnLink,
  space1GraaspViewerAllProtocolLongFrLink,
  space1GraaspViewerAllProtocolLongLink,
  space1GraaspViewerHttpLongEnLink,
  space1GraaspViewerHttpLongFrLink,
  space1GraaspViewerHttpLongLink,
  space1GraaspViewerHttpLongLinkWithTrailingCharacters,
  space1GraaspViewerHttpLongLinkWithTrailingSlash,
  space1GraaspViewerLongEnLink,
  space1GraaspViewerLongFrLink,
  space1GraaspViewerLongLink,
  space1GraaspViewerNakedLongEnLink,
  space1GraaspViewerNakedLongFrLink,
  space1GraaspViewerNakedLongLink,
  space1LongId,
  space1ShortId,
} from '../test/fixtures/space';

describe('space', () => {
  describe('extractSpaceId', () => {
    // https links
    it(`returns ${space1LongId} for ${space1GraaspSpacesLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspSpacesLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1ShortId} for ${space1GraaspCloudShortLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudShortLink);
      expect(spaceId).toEqual(space1ShortId);
    });

    // http links
    it(`returns ${space1LongId} for ${space1GraaspSpacesHttpLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspSpacesHttpLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudHttpLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudHttpLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudHttpLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudHttpLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudHttpLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudHttpLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerHttpLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerHttpLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerHttpLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerHttpLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerHttpLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerHttpLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1ShortId} for ${space1GraaspCloudHttpShortLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudHttpShortLink);
      expect(spaceId).toEqual(space1ShortId);
    });

    // naked links
    it(`returns ${space1LongId} for ${space1GraaspSpacesNakedLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspSpacesNakedLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudNakedLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudNakedLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudNakedLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudNakedLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudNakedLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudNakedLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerNakedLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerNakedLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerNakedLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerNakedLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerNakedLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerNakedLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1ShortId} for ${space1GraaspCloudNakedShortLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudNakedShortLink);
      expect(spaceId).toEqual(space1ShortId);
    });

    // all protocol links
    it(`returns ${space1LongId} for ${space1GraaspSpacesAllProtocolLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspSpacesAllProtocolLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudAllProtocolLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudAllProtocolLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudAllProtocolLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudAllProtocolLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudAllProtocolLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudAllProtocolLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerAllProtocolLongLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerAllProtocolLongLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerAllProtocolLongEnLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerAllProtocolLongEnLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerAllProtocolLongFrLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspViewerAllProtocolLongFrLink);
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1ShortId} for ${space1GraaspCloudAllProtocolShortLink}`, () => {
      const spaceId = extractSpaceId(space1GraaspCloudAllProtocolShortLink);
      expect(spaceId).toEqual(space1ShortId);
    });

    // links with trailing slash
    it(`returns ${space1LongId} for ${space1GraaspSpacesHttpLinkWithTrailingSlash}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspSpacesHttpLinkWithTrailingSlash
      );
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspCloudHttpLongLinkWithTrailingSlash}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspCloudHttpLongLinkWithTrailingSlash
      );
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerHttpLongLinkWithTrailingSlash}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspViewerHttpLongLinkWithTrailingSlash
      );
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1ShortId} for ${space1GraaspCloudHttpShortLinkWithTrailingSlash}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspCloudHttpShortLinkWithTrailingSlash
      );
      expect(spaceId).toEqual(space1ShortId);
    });

    // links with trailing characters
    it(`returns ${space1LongId} for ${space1GraaspCloudHttpLongLinkWithTrailingCharacters}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspCloudHttpLongLinkWithTrailingCharacters
      );
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspSpacesHttpLinkWithTrailingCharacters}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspSpacesHttpLinkWithTrailingCharacters
      );
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1LongId} for ${space1GraaspViewerHttpLongLinkWithTrailingCharacters}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspViewerHttpLongLinkWithTrailingCharacters
      );
      expect(spaceId).toEqual(space1LongId);
    });
    it(`returns ${space1ShortId} for ${space1GraaspCloudHttpShortLinkWithTrailingCharacters}`, () => {
      const spaceId = extractSpaceId(
        space1GraaspCloudHttpShortLinkWithTrailingCharacters
      );
      expect(spaceId).toEqual(space1ShortId);
    });

    // malformed links
    it(`returns false for ${malformedGraaspSpaceLink}`, () => {
      const spaceId = extractSpaceId(malformedGraaspSpaceLink);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for ${malformedGraaspCloudLongLink}`, () => {
      const spaceId = extractSpaceId(malformedGraaspCloudLongLink);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for ${malformedGraaspCloudShortLink}`, () => {
      const spaceId = extractSpaceId(malformedGraaspCloudShortLink);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for ${malformedGraaspViewerLongLink}`, () => {
      const spaceId = extractSpaceId(malformedGraaspViewerLongLink);
      expect(spaceId).toBeFalsy();
    });

    // random links
    it(`returns false for ${randomLink1}`, () => {
      const spaceId = extractSpaceId(randomLink1);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for ${randomLink2}`, () => {
      const spaceId = extractSpaceId(randomLink2);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for ${randomLink3}`, () => {
      const spaceId = extractSpaceId(randomLink3);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for ${randomLink4}`, () => {
      const spaceId = extractSpaceId(randomLink4);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for ${randomLink5}`, () => {
      const spaceId = extractSpaceId(randomLink5);
      expect(spaceId).toBeFalsy();
    });

    // invalid input
    it(`returns false for null`, () => {
      const spaceId = extractSpaceId(null);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for the empty string`, () => {
      const spaceId = extractSpaceId('');
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for undefined`, () => {
      const spaceId = extractSpaceId(undefined);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for 0`, () => {
      const spaceId = extractSpaceId(0);
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for a space`, () => {
      const spaceId = extractSpaceId(' ');
      expect(spaceId).toBeFalsy();
    });
    it(`returns false for a function`, () => {
      const spaceId = extractSpaceId(() => {});
      expect(spaceId).toBeFalsy();
    });
  });
});
