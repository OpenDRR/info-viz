import React from 'react'
import d3DataToJSX from '../../utils/d3utils/d3DataToJSX'
import ChildComponent from '../ChildComponent'
import createBarChart from '../constructors/createBarChart'

export default class BarChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {d3DOM: [], state: []}
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      let d3Data = d3DataToJSX(createBarChart(this.props.data))
      this.setState({d3DOM: d3Data.mappedData, state: d3Data.state})
    }
  }

  render() {
    return (
      <div>
        <ChildComponent data={this.state} />
      </div>
    )
  }
};