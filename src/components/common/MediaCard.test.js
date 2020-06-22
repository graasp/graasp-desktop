import React from 'react';
import { shallow } from 'enzyme';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { MediaCard } from './MediaCard';
import DeleteButton from '../space/DeleteButton';
import ExportButton from '../space/ExportButton';
import SyncButton from '../space/SyncButton';
import ClearButton from '../space/ClearButton';
import Text from './Text';
import { USER_MODES } from '../../config/constants';

const createMediaCardProps = (showActions, text) => {
  return {
    space: {
      id: 'id',
      name: 'name',
    },
    image: 'image',
    text,
    viewLink: jest.fn(),
    showActions,
    userMode: USER_MODES.TEACHER,
    classes: {
      card: '',
      cardDescription: '',
      cardDescriptionText: '',
      media: '',
      leftIcon: '',
      expand: '',
      expandOpen: '',
    },
  };
};

describe('<MediaCard />', () => {
  // use defaultProps = false
  describe('<MediaCard /> with showActions = undefined', () => {
    let wrapper;
    let props;

    beforeAll(() => {
      props = createMediaCardProps(undefined, 'text');
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<MediaCard {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <List /> component', () => {
      expect(wrapper.find(Card)).toHaveLength(1);
    });

    it('renders one <CardActionArea /> component with CardMedia and Typography', () => {
      const { space, image } = props;

      const cardActionArea = wrapper.find(CardActionArea);
      expect(cardActionArea).toHaveLength(1);

      const cardMedia = cardActionArea.find(CardMedia);
      expect(cardMedia).toHaveLength(1);
      expect(cardMedia.prop('image')).toEqual(image);
      expect(cardMedia.prop('title')).toEqual(space.name);

      const cardContent = cardActionArea.find(CardContent);
      expect(cardContent).toHaveLength(1);

      const typography = cardContent.find(Typography);
      expect(typography).toHaveLength(1);
      expect(typography.contains(space.name));
    });

    it('renders one <Collapse /> component with space description', () => {
      const collapse = wrapper.find(Collapse);
      expect(collapse).toHaveLength(1);
      // not expanded by default
      expect(collapse.prop('in')).toEqual(false);

      const cardContent = collapse.find(CardContent);
      expect(cardContent).toHaveLength(1);

      const text = cardContent.find(Text);
      expect(text).toHaveLength(1);
      expect(text.prop('content')).toEqual(props.text);
    });

    it('does not render <CardActions /> component', () => {
      expect(wrapper.find(CardActions)).toHaveLength(0);
    });
  });

  describe('<MediaCard /> with showActions = false', () => {
    let wrapper;
    let props;

    beforeAll(() => {
      props = createMediaCardProps(false, 'text');
      // eslint-disable-next-line react/jsx-props-no-spreading
      wrapper = shallow(<MediaCard {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('renders one <List /> component', () => {
      expect(wrapper.find(Card)).toHaveLength(1);
    });

    it('renders one <CardActionArea /> component with CardMedia and Typography', () => {
      const { space, image } = props;

      const cardActionArea = wrapper.find(CardActionArea);
      expect(cardActionArea).toHaveLength(1);

      const cardMedia = cardActionArea.find(CardMedia);
      expect(cardMedia).toHaveLength(1);
      expect(cardMedia.prop('image')).toEqual(image);
      expect(cardMedia.prop('title')).toEqual(space.name);

      const cardContent = cardActionArea.find(CardContent);
      expect(cardContent).toHaveLength(1);

      const typography = cardContent.find(Typography);
      expect(typography).toHaveLength(1);
      expect(typography.contains(space.name));
    });

    it('renders one <Collapse /> component with space description', () => {
      const collapse = wrapper.find(Collapse);
      expect(collapse).toHaveLength(1);
      // not expanded by default
      expect(collapse.prop('in')).toEqual(false);

      const cardContent = collapse.find(CardContent);
      expect(cardContent).toHaveLength(1);

      const text = cardContent.find(Text);
      expect(text).toHaveLength(1);
      expect(text.prop('content')).toEqual(props.text);
    });

    it('does not render <CardActions /> component', () => {
      expect(wrapper.find(CardActions)).toHaveLength(0);
    });
  });

  describe('<MediaCard /> with showActions = true', () => {
    describe('with text defined', () => {
      let wrapper;
      let props;

      beforeAll(() => {
        props = createMediaCardProps(true, 'text');
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<MediaCard {...props} />);
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders one <List /> component', () => {
        expect(wrapper.find(Card)).toHaveLength(1);
      });

      it('renders one <CardActionArea /> component with CardMedia and Typography', () => {
        const { space, image } = props;

        const cardActionArea = wrapper.find(CardActionArea);
        expect(cardActionArea).toHaveLength(1);

        const cardMedia = cardActionArea.find(CardMedia);
        expect(cardMedia).toHaveLength(1);
        expect(cardMedia.prop('image')).toEqual(image);
        expect(cardMedia.prop('title')).toEqual(space.name);

        const cardContent = cardActionArea.find(CardContent);
        expect(cardContent).toHaveLength(1);

        const typography = cardContent.find(Typography);
        expect(typography).toHaveLength(1);
        expect(typography.contains(space.name));
      });

      it('renders one <Collapse /> component with space description', () => {
        const collapse = wrapper.find(Collapse);
        expect(collapse).toHaveLength(1);

        // not expanded by default
        expect(collapse.prop('in')).toEqual(false);

        const cardContent = collapse.find(CardContent);
        expect(cardContent).toHaveLength(1);

        const text = cardContent.find(Text);
        expect(text).toHaveLength(1);
        expect(text.prop('content')).toEqual(props.text);
      });

      it('renders <CardActions /> component with Buttons', () => {
        const { space } = props;

        const cardActions = wrapper.find(CardActions);
        expect(cardActions).toHaveLength(1);

        const clearButton = cardActions.find(ClearButton);
        expect(clearButton).toHaveLength(1);
        expect(clearButton.prop('spaceId')).toEqual(space.id);

        const deleteButton = cardActions.find(DeleteButton);
        expect(deleteButton).toHaveLength(1);
        expect(deleteButton.prop('spaceId')).toEqual(space.id);

        const exportButton = cardActions.find(ExportButton);
        expect(exportButton).toHaveLength(1);
        expect(exportButton.prop('space')).toEqual(space);

        const syncButton = cardActions.find(SyncButton);
        expect(syncButton).toHaveLength(1);
        expect(syncButton.prop('spaceId')).toEqual(space.id);
      });

      it('renders <IconButton /> component with <ExpandMoreIcon />', () => {
        const iconButton = wrapper.find(IconButton);
        expect(iconButton).toHaveLength(1);
        expect(iconButton.prop('aria-expanded')).toEqual(false);

        const expandMoreIcon = iconButton.find(ExpandMoreIcon);
        expect(expandMoreIcon).toHaveLength(1);
      });
    });

    describe('with text undefined', () => {
      let wrapper;
      let props;

      beforeAll(() => {
        props = createMediaCardProps(true, undefined);
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<MediaCard {...props} />);
      });

      it('renders correctly', () => {
        expect(wrapper).toMatchSnapshot();
      });

      it('renders one <List /> component', () => {
        expect(wrapper.find(Card)).toHaveLength(1);
      });

      it('renders one <CardActionArea /> component with CardMedia and Typography', () => {
        const { space, image } = props;

        const cardActionArea = wrapper.find(CardActionArea);
        expect(cardActionArea).toHaveLength(1);

        const cardMedia = cardActionArea.find(CardMedia);
        expect(cardMedia).toHaveLength(1);
        expect(cardMedia.prop('image')).toEqual(image);
        expect(cardMedia.prop('title')).toEqual(space.name);

        const cardContent = cardActionArea.find(CardContent);
        expect(cardContent).toHaveLength(1);

        const typography = cardContent.find(Typography);
        expect(typography).toHaveLength(1);
        expect(typography.contains(space.name));
      });

      it('renders one <Collapse /> component with space description', () => {
        const collapse = wrapper.find(Collapse);
        expect(collapse).toHaveLength(1);
        // not expanded by default
        expect(collapse.prop('in')).toEqual(false);

        const cardContent = collapse.find(CardContent);
        expect(cardContent).toHaveLength(1);

        const text = cardContent.find(Text);
        expect(text).toHaveLength(1);

        // show default text
        expect(text.prop('content')).toEqual(MediaCard.defaultProps.text);
      });

      it('renders <CardActions /> component with Buttons', () => {
        const { space } = props;

        const cardActions = wrapper.find(CardActions);
        expect(cardActions).toHaveLength(1);

        const clearButton = cardActions.find(ClearButton);
        expect(clearButton).toHaveLength(1);
        expect(clearButton.prop('spaceId')).toEqual(space.id);

        const deleteButton = cardActions.find(DeleteButton);
        expect(deleteButton).toHaveLength(1);
        expect(deleteButton.prop('spaceId')).toEqual(space.id);

        const exportButton = cardActions.find(ExportButton);
        expect(exportButton).toHaveLength(1);
        expect(exportButton.prop('space')).toEqual(space);

        const syncButton = cardActions.find(SyncButton);
        expect(syncButton).toHaveLength(1);
        expect(syncButton.prop('spaceId')).toEqual(space.id);
      });

      it('does not rendes <IconButton /> component', () => {
        expect(wrapper.find(IconButton)).toHaveLength(0);
      });
    });

    describe('with math', () => {
      let wrapper;
      let props;

      beforeAll(() => {
        props = createMediaCardProps(true, 'text with math \\[x^2\\] inside');
        // eslint-disable-next-line react/jsx-props-no-spreading
        wrapper = shallow(<MediaCard {...props} />);
      });

      it('renders math', () => {
        const parsedContent = wrapper
          .find(Collapse)
          .find(Text)
          .dive()
          .debug();
        expect(parsedContent).toEqual(expect.stringMatching('class="katex"'));
      });
    });
  });
});
