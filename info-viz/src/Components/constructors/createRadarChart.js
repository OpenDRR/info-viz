import _ from 'lodash'

const d3 = window.d3

const createRadarChart = data => {
  const margin = 30
  const width = 800,
  height = 800
  const containerWidth = width - (margin*2),
  containerHeight = height - (margin*2)

  const axesDomain = data.map(d => d.label)
  const axisLabelFactor = 1.12
  const axisCircles = 2
  const dotRadius = 4
  const radius = 270
  const node = document.createElement('div')
  const svg = d3.select(node).append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
  const angleSlice = 6.283185307179586 / data.length
  const radarLine = d3.lineRadial()
    .curve(d3['curveCardinalClosed'])
    .radius(d => rScale(d))
    .angle((d, i) => i * angleSlice)
  const maxValue = d3.max(_.flatten(data).map(d => d.value))
  const rScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([0, radius])
  const color = d3.scaleOrdinal()
    .range(["#EDC951","#CC333F","#00A0B0"])
  const container = svg.append('g')
    .attr("width", containerWidth)
    .attr("height", containerHeight)
	  .attr('transform', `translate(${(width/2)}, ${(height/2)})`);
  
    var axisGrid = container.append("g")
    .attr("class", "axisWrapper");
    
    axisGrid.selectAll(".levels")
        .data(d3.range(1,(axisCircles+1)).reverse())
        .enter()
      .append("circle")
      .attr("class", "gridCircle")
      .attr("r", (d, i) => radius/axisCircles*d)
      .style("fill", "#CDCDCD")
      .style("stroke", "#CDCDCD")
      .style("fill-opacity", 0.1);
  
    const axis = axisGrid.selectAll(".axis")
        .data(axesDomain)
        .enter()
      .append("g")
      .attr("class", "axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2))
        .attr("y2", (d, i) => rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
    .attr("font-family", "monospace")
    .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * axisLabelFactor) * Math.cos(angleSlice*i - Math.PI/2))
        .attr("y", (d, i) => rScale(maxValue * axisLabelFactor) * Math.sin(angleSlice*i - Math.PI/2))
        .text(d => d);
  
  const plots = container.append('g')
    .selectAll('g')
    .data([data])
    .join('g')
      .attr("fill", "none")
      .attr("stroke", "steelblue");

  plots.append('path')
    .attr("d", d => radarLine(d.map(v => v.value)))
    .attr("fill", (d, i) => color(i))
    .attr("fill-opacity", 0.1)
    .attr("stroke", (d, i) => color(i))
    .attr("stroke-width", 2);

    plots.selectAll("circle")
      .data(d => d)
      .join("circle")
        .attr("r", dotRadius)
        .attr("cx", (d,i) => rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2))
        .attr("cy", (d,i) => rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2))
        .style("fill-opacity", 0.8);

  return svg.node();
}

export default createRadarChart;