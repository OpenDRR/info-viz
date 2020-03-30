import fetch from 'isomorphic-fetch'
import queryString from 'query-string'

// define some datasources
const dataSources = {
  earthquake_affectedpeople: {
    url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_indicators_affectedpeople_idm7p1_jdf_rlz_0_b0.json',
    property: 'sc_DP30',
  },
  hazard: {
    url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_scenario_hazard_agg_view.geojson',
    property: 'sc_DP30',
  },
  hazardThreat: {
    url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_scenario_hazard_threat_agg_view.geojson',
    property: 'Eq_Bldgs',
  },
  damageState: {
    url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_damage_state_agg_view.geojson',
    property: 'Eq_Bldgs',
  },
  
}
    
const getData = async (args) => {
    const { 
        scenario
    } = args
    // set url
    if (!scenario) return 
    const dataSource = dataSources[scenario]
    
    return fetch(dataSource.url)
      .then(response => response.json())
      .catch(error => {
        this.handleError(error)
      })
}

const extractParams = (url) => { 
  const parsedParams = queryString.parse(url)
  let { center } = parsedParams
  if (center) {
    const coordinates = center.split(',')
    parsedParams.center = [Number(coordinates[0]),Number(coordinates[1])]  
  } else {
    parsedParams.center = [ 49.3, -123.07]
  }
  
  if (!parsedParams.title) parsedParams.title = 'Default Title'
  

  return parsedParams
}

export {
    getData,
    extractParams
}