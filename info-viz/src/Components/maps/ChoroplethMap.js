import React from 'react'
import L from 'leaflet'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'

export default class ChoroplethMap extends React.Component {

  constructor(props) {
    super(props);
    const defaultCenter = [49.3,-123.07];
    const { center, data, property } = props;
    if (!center) center = defaultCenter;
    this.state = { center, map: React.createRef(), markerRadius: 30, data, property }
    
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
    const { property } = this.state
    const val = parseFloat(feature.properties[property])
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

    if (Number(feature.properties[property]) === 0) return {color: "#ffffff", opacity: 0.1 }
    if (Number(feature.properties[property]) > 0 && Number(feature.properties[property]) <= 100) return {color: "#58d0f8", weight: 1}
    if (Number(feature.properties[property]) > 100 && Number(feature.properties[property]) <= 200) return {color: "#fdfda1", weight: 1}
    if (Number(feature.properties[property]) > 200 && Number(feature.properties[property]) <= 400) return {color: "#f5ff2b", weight: 1}
    if (Number(feature.properties[property]) > 400) return {color: "#f88348", weight: 1}
  }

  render() {
    return (
      <Map center={this.state.center} zoom={12} ref={this.state.map}>
          <TileLayer
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            data={this.state.data}
            onEachFeature={this.bindFeatures}
            pointToLayer={this.pointToLayer} 
            style={this.styles}
          />
        </Map>
    )
  }
};