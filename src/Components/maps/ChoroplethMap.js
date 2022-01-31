import React from 'react'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'

const ChoroplethMap = (props) => {
  
  const styles = (feature) => {
    const { property } = props
    const val = Number(feature.properties[property]) * 200
    if (val === 0) return {color: "#ffffff", opacity: 0.1 }
    if (val > 0 && val <= 100) return {color: "#58d0f8", weight: 1}
    if (val > 100 && val <= 200) return {color: "#fdfda1", weight: 1}
    if (val > 200 && val <= 400) return {color: "#f5ff2b", weight: 1}
    if (val > 400) return {color: "#f88348", weight: 1}
  }
  const { center, data, bind } = props
    return (
      <Map center={center} zoom={12} ref={React.createRef()}>
          <TileLayer
            url='//{s}.tile.osm.org/{z}/{x}/{y}.png'
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
export default ChoroplethMap