import React from 'react'
import L from 'leaflet'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'
import { addressPoints } from './sample-datapoints-density.js';

const DensityMap = (props) => {
  
  const pointToLayer = (feature, latlng) => {
    const { property } = props
    const val = parseFloat(feature.properties[property])
    
    const fillOpacity = 0.5
    const radius = 4 * val
    return L.heatLayer(latlng, {fillColor: 'rgb(255,0,0)', fill: true, fillOpacity, radius, stroke: false})
  }
  
  const { center, data, bind } = props
  
    return (
      <Map center={center} zoom={13} ref={React.createRef()}>
          <TileLayer
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <HeatmapLayer
            fitBoundsOnLoad
            fitBoundsOnUpdate
            points={addressPoints}
            longitudeExtractor={m => m[1]}
            latitudeExtractor={m => m[0]}
            intensityExtractor={m => parseFloat(m[2])} 
            onEachFeature={bind}
            pointToLayer={pointToLayer}
          />
        </Map>
    )
};
export default DensityMap