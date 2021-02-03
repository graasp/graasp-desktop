import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import SplitPane from 'react-split-pane';
import { clearPhase, selectPhase, setToolsWidth } from '../../actions';
import SpaceDescription from '../space/SpaceDescription';
import PhaseDescription from './PhaseDescription';
import PhaseItems from './PhaseItems';
import ToolsButton from '../space/ToolsButton';
import './Phase.css';
import { MAX_TOOLS_WIDTH, MIN_TOOLS_WIDTH } from '../../config/layout';
import { TOOLS_CONTENT_PANE_ID } from '../../config/selectors';

const styles = {
  containerStyle: {
    position: 'static',
    height: 'calc(100% - 64px)',
  },
  mainContentStyle: {
    padding: '2rem',
    height: '100%',
    overflowY: 'scroll',
    paddingBottom: '100px',
  },
  toolContentStyle: {
    padding: '2rem',
    height: '100%',
    overflowY: 'scroll',
    backgroundColor: 'white',
    paddingBottom: '100px',
  },
};

const { containerStyle, mainContentStyle, toolContentStyle } = styles;

export class Phase extends Component {
  static propTypes = {
    space: ImmutablePropTypes.contains({
      id: PropTypes.string.isRequired,
      description: PropTypes.string,
    }).isRequired,
    phase: ImmutablePropTypes.contains({
      id: PropTypes.string,
    }).isRequired,
    dispatchSelectPhase: PropTypes.func.isRequired,
    dispatchClearPhase: PropTypes.func.isRequired,
    dispatchSetToolsWidth: PropTypes.func.isRequired,
    start: PropTypes.func.isRequired,
    toolsVisible: PropTypes.bool.isRequired,
    toolsWidth: PropTypes.number.isRequired,
  };

  componentWillUnmount() {
    const { dispatchClearPhase } = this.props;
    dispatchClearPhase();
  }

  handleResizeTools = (width) => {
    const { dispatchSetToolsWidth } = this.props;
    dispatchSetToolsWidth({ width });
  };

  renderContent() {
    const { phase, space } = this.props;
    const phaseDescription = phase.get('description');

    const phaseId = phase.get('id');
    const spaceId = space.get('id');
    const items = phase.get('items');
    return (
      <div style={mainContentStyle}>
        <PhaseDescription id={phaseId} description={phaseDescription} />
        <PhaseItems items={items} spaceId={spaceId} phaseId={phaseId} />
      </div>
    );
  }

  renderWithTools() {
    const { toolsWidth, space } = this.props;

    // tools live at the top level, so the spaceId and the phaseId are the same
    // this is relevant for apps because we use these ids to locate where they
    // are saving their resources and settings
    const spaceId = space.get('id');
    const phaseId = spaceId;
    const items = space.get('items');
    return (
      <>
        <SplitPane
          split="vertical"
          maxSize={MAX_TOOLS_WIDTH}
          minSize={MIN_TOOLS_WIDTH}
          defaultSize={toolsWidth}
          primary="second"
          style={containerStyle}
          onDragFinished={this.handleResizeTools}
        >
          {this.renderContent()}
          <div id={TOOLS_CONTENT_PANE_ID} style={toolContentStyle}>
            <PhaseItems items={items} spaceId={spaceId} phaseId={phaseId} />
          </div>
        </SplitPane>
      </>
    );
  }

  render() {
    const {
      phase,
      space,
      dispatchSelectPhase,
      start,
      toolsVisible,
    } = this.props;
    const phases = space.get('phases');
    const saved = space.get('saved');
    const description = space.get('description');

    // tools are items in the top level of the space
    const tools = space.get('items');

    // if there is no phase, we show the description
    // as the user has not started to use the space
    if (!phase || phase.isEmpty()) {
      return (
        <SpaceDescription
          id={space.get('id')}
          phases={phases}
          description={description}
          selectPhase={dispatchSelectPhase}
          start={start}
          saved={saved}
        />
      );
    }

    // case where there is no tools
    if (_.isEmpty(tools)) {
      return <div style={containerStyle}>{this.renderContent()}</div>;
    }

    // case where there are tools and they are visible
    if (toolsVisible) {
      return (
        <>
          {this.renderWithTools()}
          <ToolsButton />
        </>
      );
    }

    // case where there are tools, but they are not visible
    return (
      <div style={containerStyle}>
        {this.renderContent()}
        <ToolsButton />
      </div>
    );
  }
}

const mapStateToProps = ({ Space, layout }) => ({
  space: Space.getIn(['current', 'content']),
  toolsVisible: layout.getIn(['tools', 'open']),
  toolsWidth: layout.getIn(['tools', 'width']),
});

const mapDispatchToProps = {
  dispatchSelectPhase: selectPhase,
  dispatchClearPhase: clearPhase,
  dispatchSetToolsWidth: setToolsWidth,
};

export default connect(mapStateToProps, mapDispatchToProps)(Phase);
