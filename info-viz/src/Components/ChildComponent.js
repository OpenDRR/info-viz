import React from 'react';
import createReactComponents from '../d3utils/createReactComponents';
import applyData from '../d3utils/element-properties/applyData';
import applyZoomData from '../d3utils/element-properties/applyZoomData';
import applyTransitionData from '../d3utils/element-properties/applyTransitionData';
import applyChartData from '../d3utils/element-properties/applyChartData';
import mountD3Functions from '../d3utils/element-properties/mountD3Functions';
import registerOnListeners from '../d3utils/element-properties/registerOnListeners';
import registerEventListeners from '../d3utils/element-properties/registerEventListeners';

class childComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {reactComponents: []};
  }

  componentWillReceiveProps(nextProps) {
    const props = nextProps.data;
    const reactComponents = createReactComponents(props.d3DOM, props.state, nextProps.getState)

    this.setState({reactComponents: reactComponents})
  }

  componentDidUpdate() {
    const reactD3Elements = document.querySelectorAll('[data-react-d3-id]');
    const state = this.props.data.state;

    for(let i = 0; i < reactD3Elements.length; i++) {
      const rd3Id = reactD3Elements[i].getAttribute('data-react-d3-id');
      const that = this;

      if(!state[rd3Id]) continue;

      applyData(reactD3Elements, state, rd3Id, i);
      applyZoomData(reactD3Elements, state, rd3Id, i);
      applyTransitionData(reactD3Elements, state, rd3Id, i);
      applyChartData(reactD3Elements, state, rd3Id, i);
      mountD3Functions(state, rd3Id, that);
      registerOnListeners(reactD3Elements, state, rd3Id, i);
      registerEventListeners(reactD3Elements, state, rd3Id, i);
    }
  }

  componentWillUnmount() {
    if(this.hasTimer) this.hasTimer = false;
  }

  render() {
    return (
      <div className="react-component">
        {this.state.reactComponents || ''}
      </div>
    )
  }

}

export default childComponent