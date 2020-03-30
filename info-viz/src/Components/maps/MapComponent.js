import React from 'react'
import ChoroplethMap from './ChoroplethMap'
import DensityMap from './DensityMap'
import BubbleMap from './BubbleMap'
import SwipeMap from './SwipeMap'

const MapComponent = (props) => {

    const { mapType, data, center, property, bind } = props

    // set map component
    let mapComponent
    switch(mapType) {
      case 'choroplet':
        mapComponent =  <ChoroplethMap center={center} data={data} property={property} bind={bind}/>
        break
      case 'bubble':
        mapComponent =  <BubbleMap center={center} data={data} property={property} bind={bind}/>
        break
      case 'density':
        mapComponent =  <DensityMap center={center} data={data} property={property} bind={bind}/>
        break
      case 'swipe':
        mapComponent =  <SwipeMap />
        break
      default:
        mapComponent =  <ChoroplethMap center={center} data={data} property={property} bind={bind}/>
        break
    }

  return (
    <div>
      {mapComponent}
    </div>
  )
}
export default MapComponent