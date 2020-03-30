import _ from 'lodash'

const d3 = window.d3

const createAsterChart = data => {
  const pie = d3.pie()
    .sort(null)
    .value(1)
  const chartData = pie(data)
  const arcs = chartData
  const firstArcSection = /(^.+?)L/
  const maxValue = d3.max(_.flatten(data).map(d => d.value))
  const width = 800,
    height = 800,
    totalRings = data.length
  const maxRadius = Math.min(width, height) / 2

  const radius = maxRadius * data.length/totalRings
  const ringRadius = Math.round(radius / chartData.length)
  const ringCount = d3.range(chartData.length+1)

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.label))
    .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())

  const outerArcRadius = maxRadius * (data.length+1) / totalRings

  const fnOuterRadius = d => {
    return radiusScale(d.data.value)
  }
  const radiusScale = d3.scaleLinear()
    .domain([0, maxValue])
    .range([1, radius - 1])
  
  const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(fnOuterRadius)

  const fullArc = d3.arc()
    .innerRadius(0)
    .outerRadius(outerArcRadius)
  
  const arcLabel = d3.arc().innerRadius(radius * 0.7).outerRadius(radius * 0.7)
  
  const adeg = Math.PI/180
  const node = document.createElement('div')
  const svg = d3.select(node).append("svg")
    .attr("width", width+100)
    .attr("height", height+100)
    .attr("viewBox", `-100 -100 ${width+200} ${height+200}`)
    .attr("text-anchor", "middle")
    .style("font", "12px sans-serif")

  const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)
  
  // Create full slices
  let gFullArcs = g.append("g")
    .classed("g-fullarcs", true)
  
  gFullArcs.selectAll("path")
    .data(arcs)
    .enter().append("path")
      .attr("fill", "none")
      .attr("stroke", "#333")
      .attr("d", fullArc)
      .each((d, i) => {
        let newArc = firstArcSection.exec(d3.select(gFullArcs.selectAll("path").nodes()[i]).attr("d"))[1]
        //let newArc = firstArcSection.exec( d3.select(this).attr("d") )[1]
        newArc = newArc.replace(/,/g , " ")
        // https://www.visualcinnamon.com/2015/09/placing-text-on-arcs.html
        //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2)
        //flip the end and start position
        if (d.endAngle > 90 * adeg && d.endAngle < 300 * adeg) {
            //Everything between the capital M and first capital A
            const startLoc = /M(.*?)A/
            //Everything between the capital A and 0 0 1
            const middleLoc = /A(.*?)0 0 1/
            //Everything between the 0 0 1 and the end of the string (denoted by $)
            const endLoc = /0 0 1 (.*?)$/
            //Flip the direction of the arc by switching the start and end point
            //and using a 0 (instead of 1) sweep flag
            const newStart = endLoc.exec( newArc )[1]
            const newEnd = startLoc.exec( newArc )[1]
            const middleSec = middleLoc.exec( newArc )[1]

            //Build up the new arc notation, set the sweep-flag to 0
            newArc = "M" + newStart + "A" + middleSec + "0 0 0 " + newEnd
        }
								
		    gFullArcs.append("path")
			    .attr("class", "hiddenArcs")
					.attr("id", "labelArc"+i)
					.attr("d", newArc)
          .style("fill", "none")
     })
  
  // Create Arcs/slices
  let gArcs = g.append("g")
    .classed("g-arcs", true)
  
  gArcs.selectAll("path")
    .data(arcs)
    .enter().append("path")
      .attr("fill", d => color(d.data.label))
      .attr("fill-opacity", 0.8)
      .attr("stroke", "none")
      .attr("d", arc)
    .append("title")
      .text(d => `${d.data.label}: 1`)

  // Create concentric rings
  let gRings = g.append("g")
    .classed("g-rings", true)
    .selectAll("circle")
      .data(ringCount)
  
  gRings.enter().append("circle")
    .attr("r", function(d){
      return d * ringRadius
    })
    .attr("fill", "none")
    .attr("stroke", function(d, i){
      // make last ring black, rest white
      return i === (ringCount.length-1) ? "#222" : "white"
    })
    .attr("stroke-width", 1)
  
  //Append the label names on the outside
  gFullArcs.selectAll(".arcText")
    .data(arcs)
    .enter().append("text")
    .attr("class", "arcText")
    //Move the labels below the arcs for slices with an end angle > than 90 degrees
    .attr("dy", function(d,i) {
        return 3 + ((d.endAngle > 90 * adeg && d.endAngle < 300 * adeg) ? -ringRadius/2 : ringRadius/2)
    })
   .append("textPath")
    .attr("startOffset","50%")
    .style("text-anchor","middle")
    .attr("xlink:href", (d,i) => `#labelArc${i}`)
    .append("tspan")
      .text(d => `${d.data.label}`)

  const gText = g.append("g")
    .classed("g-text", true)
  
  const text = gText.selectAll("text")
    .data(arcs)
    .enter().append("text")
      .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
      .attr("dy", "0.35em")
  
  text.append("tspan")
      .attr("x", 0)
      .style("font-size", "1.5em")
      .style("font-weight", "bold")
      .text(d => d.data.value)

  .classed("progress-arc-path", function(d, i){
    // Not the first one
    return i > 0
  })
  
  return svg.node()
}

export default createAsterChart