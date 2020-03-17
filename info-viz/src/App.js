import React, { Component } from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import fetch from 'isomorphic-fetch'
import Loader from './Components/Loader';
import './App.css'

import BarChart from './Components/BarChart'

const position = [49,-123];

class App extends Component {
  
  state = {
    markerRadius: 30,
    map: React.createRef(),
    chartData: {
      margins: {top: 0, right: 50, bottom: 200, left: 50},
      width: 800,
      height: 600,
    },
    loading: true,
  }
  
  componentDidMount() {
    const dataSources = { 
      hazard: {
        url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_scenario_hazard_agg_view.geojson',
        property: 'sc_DP30',
      },
      hazardThreat: {
        url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_scenario_hazard_threat_agg_view.geojson',
        property: 'Eq_Bldgs',
        
      },
    }
    fetch(dataSources.hazardThreat.url)
      .then(res => res.json())
      .then(json => this.setState(
        { 
          geoJson: json,
          loading: false,
          property: dataSources.hazardThreat.property,
        }
      ));
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

  pointToLayer = (feature, latlng) => {
    const val = parseFloat(feature.properties['Eq_Bldgs'])
    const heat = val*0.256
    if(heat === 0) { return null }
    const fillOpacity = val/20
    const radius = 200 + (heat*2)
    const r = parseInt(heat/2+128,10)
    const g = parseInt(heat,10)
    const b = parseInt(heat/4,10)
    return L.circle(latlng, {fillColor: `rgb(${r},${g},${b})`, fill: true, fillOpacity, radius, stroke: false})
  }
  
  styles = (feature) => {
    const { property } = this.state
    if (Number(feature.properties[property]) === 0) return {color: "#ff0000"};
    if (Number(feature.properties[property]) > 0 && Number(feature.properties[property]) <= 100) return {color: "#58d0f8"};
    if (Number(feature.properties[property]) > 100 && Number(feature.properties[property]) <= 200) return {color: "#fdfda1"};
    if (Number(feature.properties[property]) > 200 && Number(feature.properties[property]) <= 400) return {color: "#f5ff2b"};
    if (Number(feature.properties[property]) > 400) return {color: "#f88348"};
    
  }
  
  render() {
    const { map, chartData, geoJson } = this.state
    if (this.state.loading) return <Loader />;
    return (
      <div className="infoViz">
        <Map center={position} zoom={10} ref={map}>
          <TileLayer
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            data={geoJson}
            onEachFeature={this.bindFeatures}
            pointToLayer={this.pointToLayer} 
            style={this.styles}
          />
        </Map>
        <div className="narrative">
          <h2>sc_CasNitL1</h2>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
        <div className="chart">
          <BarChart data={chartData} />
        </div>
      </div>
    )
  }
}

export default App;
