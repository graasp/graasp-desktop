import React from 'react';
import { shallow } from 'enzyme';
import { Map } from 'immutable';
import SplitPane from 'react-split-pane';
import { Phase } from './Phase';
import SpaceDescription from '../space/SpaceDescription';
import PhaseDescription from './PhaseDescription';
import PhaseItems from './PhaseItems';
import ToolsButton from '../space/ToolsButton';
import { MAX_TOOLS_WIDTH, MIN_TOOLS_WIDTH } from '../../config/layout';

const samplePhase = Map({
  id: 'phaseId',
  description: 'phaseDescription',
  items: [{ id: 'phaseItemId' }],
});

const sampleTools = [{ id: 'spaceItemsId' }];

const createPhaseProps = (phase, items, toolsVisible) => {
  return {
    space: Map({
      id: 'spaceId',
      description: 'spaceDescription',
      items,
    }),
    phase,
    dispatchSelectPhase: jest.fn(),
    dispatchClearPhase: jest.fn(),
    dispatchSetToolsWidth: jest.fn(),
    start: jest.fn(),
    toolsVisible,
    toolsWidth: 3,
  };
};

describe('<Phase />', () => {
  describe('without tools', () => {
    let wrapper;
    let props;

    beforeAll(() => {
      props = createPhaseProps(samplePhase, undefined, false);
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<Phase {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <PhaseDescription /> component with phase description', () => {
      const phaseDescription = wrapper.find(PhaseDescription);
      expect(phaseDescription).toHaveLength(1);
      expect(phaseDescription.prop('description')).toEqual(
        props.phase.get('description')
      );
    });

    it('renders one <PhaseItems /> component with phase description', () => {
      const phaseItems = wrapper.find(PhaseItems);
      expect(phaseItems).toHaveLength(1);
      expect(phaseItems.prop('items')).toEqual(props.phase.get('items'));
      expect(phaseItems.prop('spaceId')).toEqual(props.space.get('id'));
      expect(phaseItems.prop('phaseId')).toEqual(props.phase.get('id'));
    });
  });

  describe('with tools', () => {
    describe('<Phase /> with toolsVisible = false', () => {
      let wrapper;
      let props;

      beforeAll(() => {
        props = createPhaseProps(samplePhase, sampleTools, false);
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<Phase {...props} />);
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders one <PhaseDescription /> component with phase description', () => {
        const phaseDescription = wrapper.find(PhaseDescription);
        expect(phaseDescription).toHaveLength(1);
        expect(phaseDescription.prop('description')).toEqual(
          props.phase.get('description')
        );
      });

      it('renders one <PhaseItems /> component with phase description', () => {
        const phaseItems = wrapper.find(PhaseItems);
        expect(phaseItems).toHaveLength(1);
        expect(phaseItems.prop('items')).toEqual(props.phase.get('items'));
        expect(phaseItems.prop('spaceId')).toEqual(props.space.get('id'));
        expect(phaseItems.prop('phaseId')).toEqual(props.phase.get('id'));
      });
    });

    describe('<Phase /> with toolsVisible = true', () => {
      let wrapper;
      let props;

      beforeAll(() => {
        props = createPhaseProps(samplePhase, sampleTools, true);
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<Phase {...props} />);
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders one <PhaseDescription /> component with phase description', () => {
        const phaseDescription = wrapper.find(PhaseDescription);
        expect(phaseDescription).toHaveLength(1);
        expect(phaseDescription.prop('description')).toEqual(
          props.phase.get('description')
        );
      });

      it('renders one <SplitPane /> component with correct properties', () => {
        const splitPane = wrapper.find(SplitPane);
        // two PhaseItems: phase and space items
        expect(splitPane).toHaveLength(1);
        expect(splitPane.prop('maxSize')).toEqual(MAX_TOOLS_WIDTH);
        expect(splitPane.prop('minSize')).toEqual(MIN_TOOLS_WIDTH);
        expect(splitPane.prop('defaultSize')).toEqual(props.toolsWidth);
        expect(splitPane.find(PhaseItems)).toHaveLength(2);
      });

      it('renders one <PhaseItems /> component with phase content', () => {
        const phaseItems = wrapper
          .find(PhaseItems)
          .find({ items: props.phase.get('items') });
        expect(phaseItems).toHaveLength(1);
        expect(phaseItems.prop('spaceId')).toEqual(props.space.get('id'));
        expect(phaseItems.prop('phaseId')).toEqual(props.phase.get('id'));
      });

      it('renders one <PhaseItems /> component with space content (tools)', () => {
        const phaseItems = wrapper
          .find(PhaseItems)
          .find({ items: props.space.get('items') });
        expect(phaseItems).toHaveLength(1);
        expect(phaseItems.prop('spaceId')).toEqual(props.space.get('id'));
        expect(phaseItems.prop('phaseId')).toEqual(props.space.get('id'));
      });

      it('renders one <ToolsButton /> component', () => {
        const toolsButton = wrapper.find(ToolsButton);
        expect(toolsButton).toHaveLength(1);
      });
    });
  });

  describe.each([undefined, Map({})])(
    '<Phase /> when phase is undefined or empty',
    phase => {
      it('renders <SpaceDescription />', () => {
        const props = createPhaseProps(phase, sampleTools, false);
        // eslint-disable-next-line react/jsx-props-no-spreading
        const wrapper = shallow(<Phase {...props} />);
        expect(wrapper.find(SpaceDescription)).toHaveLength(1);
      });
    }
  );
});
