import React, { useState } from 'react'
import L from 'leaflet'
import { Map, TileLayer, GeoJSON } from 'react-leaflet'

const BubbleMap = (props) => {
  const { center, data, bind } = props
  const [mapElem] = useState(React.createRef())
  const [dataElem] = useState(React.createRef())

  const pointToLayer = (feature, latlng) => {
    const { property } = props
    const val = parseFloat(feature.properties[property])
    
    const fillOpacity = 0.5
    const radius = 4 * val
    return L.circle(latlng, {fillColor: 'rgb(255,0,0)', fill: true, fillOpacity, radius, stroke: false})
  }
  return (
    <Map center={center} zoom={13} ref={mapElem}>
      <TileLayer
        url='https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png'
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      <GeoJSON
        data={data}
        onEachFeature={bind}
        pointToLayer={pointToLayer}
        ref={dataElem}
      />
    </Map>
  )
}
export default BubbleMap