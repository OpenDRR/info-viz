## Configuration

This application receives attributes through the url (GET parameters) that allows to the user to configure the title, chart text, map, chart and attribute to display.

|Parameter  |Description  |  Options|
--- | --- | ---|
|title|This is the title for the component|N/A|
|text|This is the text for the chart|N/A|
|scenario|This selects the datasource (endpoint) to get the geojson file.There are two different sources, one using points, and the other polygons. This object is defined in src/utils/services/dataSources.js|<ul><li>sidney_polygons (default)</li><li>sidney_points</li></li>|
|mapType|This selects which map should be displayed. Bubble and Density maps need a geojson composed of data points. Choropleth needs a geojson composed of polygons. Swipe map will use the same datasource for both maps, but the left will use property and the right map property2.|<ul><li>choropleth (default)</li><li>swipe</li><li>bubble</li><li>density</li></ul>|
|chart|This selects which data chart should be displayed.|<ul><li>barchart</li><li>asterchart</li><li>radarchart</li><li>table</li></ul>|
|property|Property to draw. This indicates what property will be used to draw the multiple objects in the map, i.e. sC_Res30_b0, sDt_Complete_b0.|This is an attribute from each feature|
|property2|PProperty to draw in the right map on the Swipe maps component. This indicates what property will be used to draw the multiple objects in the map, i.e. sC_Res30_b0, sDt_Complete_b0.|This is an attribute from each feature|
|center|This is the center for the map. This is composed by lat and long separated by comma (,).|Example: 49.3,-123.07 (default)|

## Examples
Usable once app is running on localhost, as per README.md

### Swipe map with aster chart
http://localhost:3000/?scenario=sidney_polygons&mapType=swipe&chart=asterchart&property=sDt_Complete_b0&property2=sDt_Extensive_b0&center=49.3,-123.07&title=Earthquake&text=Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit%2C%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%2C%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.

### Bubble map with bar chart
http://localhost:3000/?scenario=sidney_points&mapType=bubble&chart=barchart&property=sC_Res30_b0&center=49.3,-123.07&title=Earthquake

### Density map with radar chart
http://localhost:3000/?scenario=sidney_points&mapType=density&chart=radarchart&property=sC_Res30_b0&center=49.3,-123.07&title=Earthquake&text=Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit%2C%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%2C%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.

### Choropleth with table
http://localhost:3000/?scenario=sidney_polygons&mapType=choropleth&chart=table&property=sDt_Complete_b0&center=49.3,-123.07&title=Earthquake&text=Lorem%20ipsum%20dolor%20sit%20amet%2C%20consectetur%20adipiscing%20elit%2C%20sed%20do%20eiusmod%20tempor%20incididunt%20ut%20labore%20et%20dolore%20magna%20aliqua.%20Ut%20enim%20ad%20minim%20veniam%2C%20quis%20nostrud%20exercitation%20ullamco%20laboris%20nisi%20ut%20aliquip%20ex%20ea%20commodo%20consequat.

## CSS Configuration
To create viewport based variants of the presentation, enclose different viewport scenarios in media queries with different CSS grid configurations. The grid configurations allow for very flexible layout. I have defined a 3x3 grid and these can be easily defined like so:<br>For instance for desktop, 701px viewport or larger:
```
    @media (min-width: 701px) {
        .infoViz {
            grid-template-areas:
                "leaflet leaflet narrative"
                "leaflet leaflet narrative"
                "leaflet leaflet chart";
        }
    }
```
And here is a mobile viewport query with a stacked rather than portrait view:
```
    @media (max-width: 700px){
        .infoViz {
            grid-template-areas:
                "leaflet leaflet leaflet"
                "narrative narrative narrative"
                "chart chart chart";
        }
    }
```
Both of these are found in the src/App.css but can be in any style sheet exposed to the components.