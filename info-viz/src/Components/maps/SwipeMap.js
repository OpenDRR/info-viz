import React, { useEffect } from 'react'
import L from "leaflet"
import "leaflet-side-by-side"
import "leaflet-tilelayer-geojson"

const SwipeMap = (props) => {
   useEffect(() => {
    const map = L.map("map").setView([51.505, -0.09], 13)
    //const { center, data, bind, property } = props
     var style = {
        "clickable": true,
        "color": "#00D",
        "fillColor": "#00D",
        "weight": 1.0,
        "opacity": 0.3,
        "fillOpacity": 0.2
    }
    var hoverStyle = {
        "fillOpacity": 0.5
    }
    const geoJsonUrl = 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_indicators_affectedpeople_idm7p1_jdf_rlz_0_b0.json'
    var osmLayer = new L.TileLayer.GeoJSON(geoJsonUrl, {
            clipTiles: true,
            unique: function (feature) {
                return feature.id 
            }
        },{
            style: style,
            onEachFeature: function (feature, layer) {
                console.log('feature',feature)
                if (feature.properties) {
                    var popupString = '<div class="popup">'
                    for (var k in feature.properties) {
                        var v = feature.properties[k]
                        popupString += k + ': ' + v + '<br />'
                    }
                    popupString += '</div>'
                    layer.bindPopup(popupString)
                }
                if (!(layer instanceof L.Point)) {
                    layer.on('mouseover', function () {
                        layer.setStyle(hoverStyle)
                    })
                    layer.on('mouseout', function () {
                        layer.setStyle(style)
                    })
                }
            }
        }
    )
    
    //map.addLayer(osmLayer)
    var stamenLayer = L.tileLayer(
      "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.png",
      {
        attribution:
          'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ' +
          '<a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash ' +
          "Map data {attribution.OpenStreetMap}",
        minZoom: 1,
        maxZoom: 16
      }
    ).addTo(map)

    L.control.sideBySide(stamenLayer, osmLayer).addTo(map)
  }, [])

  return <div id="map" />
}
export default SwipeMap