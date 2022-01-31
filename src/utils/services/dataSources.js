import fetch from 'isomorphic-fetch'
import queryString from 'query-string'

// define some datasources
const dataSources = {
  sidney_points: {
    url: 'https://geo-api.stage.riskprofiler.ca/collections/opendrr_dsra_idm7p1_sidney_indicators_b/items?lang=en_US&f=json&properties=sC_Res3_b0,sC_Res30_b0,sC_Res90_b0,sC_Res180_b0,sC_Res360_b0&limit=30000',
    property: 'sC_Res30_b0',
  },
  sidney_polygons: {
    url: 'https://geo-api.stage.riskprofiler.ca/collections/opendrr_dsra_idm7p1_sidney_indicators_s/items?lang=en_US&f=json&properties=sDt_Slight_b0,sDt_Moderate_b0,sDt_Extensive_b0,sDt_Complete_b0,sDt_Collapse_b0&limit=20000',
    property: 'sDt_Complete_b0',
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
    parsedParams.center = [49.3, -123.07]
  }
  
  if (!parsedParams.title) parsedParams.title = 'Default Title'
  if (!parsedParams.mapType) parsedParams.mapType = 'choropleth'
  if (!parsedParams.scenario) parsedParams.scenario = 'sidney_polygons'
  if (!parsedParams.property) parsedParams.property = dataSources[parsedParams.scenario].property

  return parsedParams
}

export {
    getData,
    extractParams
}