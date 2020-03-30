import React from 'react'
import L from 'leaflet'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'
import HeatmapLayer from 'react-leaflet-heatmap-layer'

const DensityMap = (props) => {
  
  const pointToLayer = (feature, latlng) => {
    const { property } = props
    const val = parseFloat(feature.properties[property])
    const fillOpacity = 0.0
    const radius = 4 * val
    return L.circle(latlng, {fillColor: 'rgb(255,0,0)', fill: true, fillOpacity, radius, stroke: false})
  }
  
  const processDataset = (dataset) => {
    const processedDataset = dataset.features.map(feature => {
      // add density property to coordinates array
      feature.geometry.coordinates.push(feature.properties[property])
      return feature.geometry.coordinates 
    })
    return processedDataset
  }
  
  const { center, data, bind, property } = props
    console.log('propsDensity',props)
    const dataPoints = processDataset(data)
    return (
      <Map center={center} zoom={13} ref={React.createRef()}>
          <TileLayer
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            data={data}
            onEachFeature={bind}
            pointToLayer={pointToLayer}
          />
          <HeatmapLayer
            fitBoundsOnLoad
            points={dataPoints}
            longitudeExtractor={m => m[0]}
            latitudeExtractor={m => m[1]}
            intensityExtractor={m => Number(m[2])}
          />
        </Map>
    )
};
export default DensityMap