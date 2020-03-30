import React, { Component } from 'react'
import Loader from './Components/Loader';
import ChoroplethMap from './Components/maps/ChoroplethMap'
import DensityMap from './Components/maps/DensityMap'
import BubbleMap from './Components/maps/BubbleMap'
import SwipeMap from './Components/maps/SwipeMap'
import Chart from './Components/charts/Chart'

import { extractParams, getData } from './utils/services/dataSources';
import './App.css'

class App extends Component {
  
  state = {
    markerRadius: 30,
    map: React.createRef(),
    chartData: [],
    loading: true,
  }
  
  bindFeatures = (feature, layer) => {
    layer.on({
      click: this.featureClick
    });
  }
  
  featureClick = (e) => {
    var layer = e.target;
    const data = layer.feature.properties
    const dataSet = Object.keys(data).map(label => ({ label, value: data[label] }) )
    dataSet.splice('id', 1)
    this.setState({ chartData: dataSet })
  }
  
  componentDidMount() {
    // get and process url params
    const url = window.location.search
    const params = extractParams(url)
    const { property, chart, center, title, mapType } = params
    // get data
    getData(params)
      .then(geoJson => 
        this.setState(
          { 
            geoJson,
            loading: false,
            property,
            chart,
            mapType,
            center,
            title,
          }
        )      
      )
  }
  
  render() {
    const { chartData, geoJson, center, property, title, chart } = this.state
    
    // loader while fetching data
    if (this.state.loading) return <Loader />;
    
    // set map component
    let mapComponent
    switch(this.state.mapType) {
      case 'choroplet':
        mapComponent =  <ChoroplethMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
      case 'bubble':
        mapComponent =  <BubbleMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
      case 'density':
        mapComponent =  <DensityMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
      case 'swipe':
        mapComponent =  <SwipeMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
      default:
        mapComponent =  <ChoroplethMap center={center} data={geoJson} property={property} bind={this.bindFeatures}/>
        break
    }
    
    return (
      <div className="infoViz">
        {mapComponent}
        <div className="narrative">
          <h2>{title}</h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div className="chart">
          <Chart chart={chart} chartData={chartData} />
        </div>
      </div>
    )
  }
}

export default App;
