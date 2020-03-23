import React, { Component } from 'react'
import Loader from './Components/Loader';
import ChoroplethMap from './Components/maps/ChoroplethMap'
import BarChart from './Components/charts/BarChart'
import Table from './Components/charts/Table';
import { extractParams, retrieveData } from './utils/services/dataSources';
import './App.css'

class App extends Component {
  
  state = {
    markerRadius: 30,
    map: React.createRef(),
    chartData: {
      margins: {top: 0, right: 50, bottom: 200, left: 50},
      width: 800,
      height: 600,
      dataSet: [],
    },
    loading: true,
  }
  
  bindFeatures = (feature, layer) => {
    layer.on({
      click: this.featureClick
    });
  }
  
  featureClick = (e) => {
    const { chartData } = this.state
    var layer = e.target;
    const data = layer.feature.properties
    const dataSet = Object.keys(data).map(label => ({ label, value: data[label] }) )
    dataSet.splice('id', 1)
    this.setState({ chartData: {
      ...chartData,
      dataSet,
    } })
  }
  
  componentDidMount() {
    // get and process url params
    const url = window.location.search
    const params = extractParams(url)
    const { property, chart, center, title } = params
    // get data
    retrieveData(params)
      .then(geoJson => 
        this.setState(
          { 
            geoJson,
            loading: false,
            property,
            columns,
            detailsComponent: chart,
            center,
            title,
          }
        )      
      )
    
    // define columns for table data
    const columns = [
        {
          Header: 'Attributes',
          columns: [
            {
              Header: "Attribute",
              accessor: "label"
            },
            {
              Header: "Value",
              accessor: "value"
            }
          ]
        },
      ];
  }
  
  render() {
    const { chartData, geoJson, columns, center, property, title } = this.state
    
    // loader while we wait fetching data
    if (this.state.loading) return <Loader />;

    // check which component we will use
    let chartComponent;
    if (this.state.detailsComponent === 'table') {
      chartComponent = <Table columns={columns} data={chartData.dataSet} />;
    }

    if (this.state.detailsComponent === 'barchart') {
      chartComponent = <BarChart data={chartData} />;
    }
    return (
      <div className="infoViz">
        <ChoroplethMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        <div className="narrative">
          <h2>{title}</h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div className="chart">
          {chartComponent}
        </div>
      </div>
    )
  }
}

export default App;
