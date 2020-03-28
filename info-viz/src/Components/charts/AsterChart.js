import React from 'react'
import d3DataToJSX from '../../utils/d3utils/d3DataToJSX'
import ChildComponent from '../ChildComponent'
import createAsterChart from '../constructors/createAsterChart'

export default class AsterChart extends React.Component {

  constructor(props) {
    super(props)
    this.state = {d3DOM: [], state: []}
  }

  componentWillReceiveProps(nextProps) {
    let d3Data = d3DataToJSX(createAsterChart(nextProps.data))
    this.setState({d3DOM: d3Data.mappedData, state: d3Data.state})
  }

  render() {
    return (
      <div>
        <ChildComponent data={this.state} />
      </div>
    )
  }
};