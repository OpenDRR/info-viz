import React, { useState, useEffect } from 'react'
import L from "leaflet"
import "leaflet-side-by-side"
import "leaflet-tilelayer-geojson"

const SwipeMap = (props) => {
    // get values from props
    const [values] = useState(props)

    useEffect(() => {
        const { data, center, property, bind } = values
        let { property2 } = values
        if (!property2) property2 = property

        // set styles for left layer
        const leftStyles = (feature) => {
            return Number(feature.properties[property]) > 400 ? { color: "#f88348", weight: 1 } :
                Number(feature.properties[property]) > 200 ? { color: "#f5ff2b", weight: 1 } :
                Number(feature.properties[property]) > 100 ? { color: "#fdfda1", weight: 1 } :
                Number(feature.properties[property]) > 0 ? { color: "#58d0f8", weight: 1 } :
                Number(feature.properties[property]) === 0 ? { color: "#ffffff", opacity: 0.1 } : { color: "#ffffff", opacity: 0.1 }
        }

        // set styles for right layer
        const rightStyles = (feature) => {
            return Number(feature.properties[property2]) > 400 ? { color: "red", weight: 1 } :
                Number(feature.properties[property2]) > 200 ? { color: "red", weight: 1 } :
                Number(feature.properties[property2]) === 0 ? { color: "#ffffff", opacity: 0.1 } : { color: "#ffffff", opacity: 0.1 }
        }
        // create map
        const map = L.map("map").setView(center, 13)

        // create panels
        map.createPane('left')
        map.createPane('right')

        // set base map layer
        var baseMap = L.tileLayer('https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors',
            maxZoom: 19,
            layers: baseMap
        }).addTo(map)

        // set left map
        var overlay1 = L.geoJson(data, {
            style: leftStyles,
            pane: 'left',
            onEachFeature: bind,
        }).addTo(map)

        // set right map
        var overlay2 = L.geoJson(data, {
            style: rightStyles,
            pane: 'right',
            onEachFeature: bind,
        }).addTo(map)

        // create swiper control
        L.control.sideBySide(overlay1, overlay2).addTo(map)
    }, [])

    return <div id="map" />
}
export default SwipeMap