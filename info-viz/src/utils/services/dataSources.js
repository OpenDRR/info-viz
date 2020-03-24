import fetch from 'isomorphic-fetch'
import queryString from 'query-string'

// define some datasources
const dataSources = {
  hazard: {
    url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_scenario_hazard_agg_view.geojson',
    property: 'sc_DP30',
    detailsComponent: 'barchart',
  },
  hazardThreat: {
    url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_scenario_hazard_threat_agg_view.geojson',
    property: 'Eq_Bldgs',
    detailsComponent: 'table',
  },
  damageState: {
    url: 'https://s3-us-west-2.amazonaws.com/data.info-viz.cctech.io/samples/dsra_sim6p8_cr2022_rlz_1_b0_damage_state_agg_view.geojson',
    property: 'Eq_Bldgs',
    detailsComponent: 'barchart',
  },
}
    
const retrieveData = async (args) => {
    const { 
        scenario
    } = args
    // set url
    const dataSource = dataSources[scenario];
    
    return fetch(dataSource.url)
      .then(response => response.json())
      .catch(error => {
        this.handleError(error);
      });
}

const extractParams = (url) => { 
  const parsedParams = queryString.parse(url);
  // TODO: clean params
  const { center } = parsedParams;
  if (center) {
    const coordinates = center.split(',');
    parsedParams.center = [Number(coordinates[0]),Number(coordinates[1])];  
  }

  return parsedParams;
}

export {
    retrieveData,
    extractParams
};