import './App.css';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from 'react-query';
import axios from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const data1 = [
	{
		name: 'Page A',
		uv: 4000,
		pv: 2400,
		amt: 2400,
	},
	{
		name: 'Page B',
		uv: 3000,
		pv: 1398,
		amt: 2210,
	},
	{
		name: 'Page C',
		uv: 2000,
		pv: 9800,
		amt: 2290,
	},
	{
		name: 'Page D',
		uv: 2780,
		pv: 3908,
		amt: 2000,
	},
	{
		name: 'Page E',
		uv: 1890,
		pv: 4800,
		amt: 2181,
	},
	{
		name: 'Page F',
		uv: 2390,
		pv: 3800,
		amt: 2500,
	},
	{
		name: 'Page G',
		uv: 3490,
		pv: 4300,
		amt: 2100,
	},
];

function App() {
	const [date, setDate] = useState(new Date());
	const props2 = useQuery([('dateData', date)], async () => {
		if (date > new Date()) {
			alert('Please pick a valid date');
			setDate(new Date());
			return;
		}
		const { data } = await axios.get(`http://localhost:5000/crypto-data/${date}`);
		const dataMap = [];

		for (let [key, value] of Object.entries(data)) {
			if (key.includes('USD')) {
				dataMap.push({
					state: key.split(' ')[1],
					value: value,
				});
			}
		}
		return dataMap;
	});
	const { isLoading, error, data, isFetchedAfterMount } = props2;

	if (error) return <div>error</div>;

	return (
		<div className='app'>
			<div className='container'>
				<DayPickerInput value={date.toDateString()} placeholder={date.toDateString()} onDayChange={(day) => setDate(day)} />{' '}
				<LineChart
					width={700}
					height={300}
					data={data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='state' />
					<YAxis dataKey='value' />
					<Tooltip />
					<Line type='monotone' dataKey='value' stroke='#82ca9d' />
				</LineChart>
			</div>
		</div>
	);
}
export default App;
