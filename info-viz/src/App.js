import React, { Component } from 'react'
import _ from 'lodash'
import Loader from './Components/Loader'
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
    loading: true,
  }
  
  bindFeatures = (feature, layer) => {
    layer.on({
      click: this.featureClick
    })
  }
  
  featureClick = (e) => {
    var layer = e.target
    const data = layer.feature.properties
    const dataSet = Object.keys(data).map(label => ({ label, value: Number(data[label]) }) )
    dataSet.splice('id', 1)
    this.setState({ chartData: dataSet })
  }
  
  componentWillMount() {
    // get and process url params
    const url = window.location.search
    const params = extractParams(url)
    const { scenario, property, property2, chart, center, title, text, mapType } = params
    // get data
    window.changeMetric = newProperty => {
      let properties = `&property=${newProperty}`
      if(property2) {
        properties = `&property=${newProperty}&property2=${property2}`
      }
      window.location.href = `?scenario=${scenario}&mapType=${mapType}&chart=${chart}${properties}&center=${center}&title=${title}&text=${text}`
    }
    getData(params).then(geoJson => {
      const objKeys = Object.keys(geoJson.features[0].properties)
      const chartData = []
      objKeys.forEach(k => {
        if(k !== 'id') {
          chartData.push(
            {label: k, value: _.sumBy(geoJson.features, function(o) {
              return o.properties[k]
            })}
          )
        }
      })
      this.setState({ 
        geoJson,
        loading: false,
        property,
        property2,
        chart,
        scenario,
        mapType,
        center,
        title,
        text,
      })
      this.setState({chartData})
    })
  }
  
  render() {
    const { chartData, geoJson, center, property, property2, title, chart, text } = this.state
    // loader while fetching data

    if (this.state.loading) return <Loader />

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
        mapComponent =  <SwipeMap center={center} data={geoJson} property={property} property2={property2} bind={this.bindFeatures}/>
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
          {text}
        </div>
        <div className="chart">
          <Chart chart={chart} chartData={chartData} />
        </div>
      </div>
    )
  }
}

export default App
