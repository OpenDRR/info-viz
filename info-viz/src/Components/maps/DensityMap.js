import React from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'

const DensityMap = (props) => {
  
  const styles = (feature) => {
    const { property } = props
    if (Number(feature.properties[property]) === 0) return {color: "#ffffff", opacity: 0.1 }
    if (Number(feature.properties[property]) > 0 && Number(feature.properties[property]) <= 100) return {color: "#58d0f8", weight: 1}
    if (Number(feature.properties[property]) > 100 && Number(feature.properties[property]) <= 200) return {color: "#fdfda1", weight: 1}
    if (Number(feature.properties[property]) > 200 && Number(feature.properties[property]) <= 400) return {color: "#f5ff2b", weight: 1}
    if (Number(feature.properties[property]) > 400) return {color: "#f88348", weight: 1}
  }
  const { center, data, bind } = props
    return (
      <Map center={center} zoom={12} ref={React.createRef()}>
          <TileLayer
            url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          <GeoJSON
            data={data}
            onEachFeature={bind}
            style={styles}
          />
        </Map>
    )
};
export default DensityMap