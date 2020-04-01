import React from 'react'
import AsterChart from './AsterChart'
import BarChart from './BarChart'
import RadarChart from './RadarChart'
import Table from './Table';

const Chart = (props) => {
  
  // define columns for table data
  const columns = [
      {
        Header: 'Attributes',
        columns: [
          {
            Header: "Attribute",
            accessor: "label"
          },
          {
            Header: "Value",
            accessor: "value"
          }
        ]
      },
    ]

    const { chartData, chart, selectMetric } = props
    // set chart component
    let chartComponent
    switch(chart) {
      case 'table':
        chartComponent =  <Table columns={columns} data={chartData} />
        break
      case 'barchart':
        chartComponent =  <BarChart data={chartData} />
        break
      case 'asterchart':
        chartComponent =  <AsterChart data={chartData} />
        break
      case 'radarchart':
        chartComponent =  <RadarChart data={chartData} />
        break
      default:
        chartComponent =  <div></div>
        break
    }

  return (
    <div>
      {chartComponent}
    </div>
  )
}
export default Chart