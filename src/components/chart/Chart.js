import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
const Chart = ({ isFetching, data, prevDateData, selected }) => {
	return (
		<LineChart
			className='chart'
			width={600}
			height={300}
			data={isFetching ? prevDateData : data}
			margin={{
				top: 5,
				right: 30,
				left: 30,
				bottom: 5,
			}}>
			<CartesianGrid strokeDasharray='3 3' />
			<XAxis dataKey='state' padding={{ left: 50, right: 50 }} />
			<YAxis datakey='value' type='number' domain={['dataMin', 'dataMax']} unit={selected ? '$' : '₪'} />
			<Tooltip />
			<Line isAnimationActive fill='black' strokeWidth={2} dataKey={selected ? 'USD' : 'ILS'} stroke='#82ca9d' />
		</LineChart>
	);
};

export default Chart;
