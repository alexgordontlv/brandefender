import './App.css';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useQuery } from 'react-query';
import axios from 'axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

function App() {
	const [date, setDate] = useState(new Date());
	const [currentNisAmount, setCurrentNisAmount] = useState(3.17);
	const [prevDate, setPrevDate] = useState(null);
	const [currency, setCurrency] = useState('USD');

	const { isFetching, error, data } = useQuery([('dateData', date)], async () => {
		const { data } = await axios.get(`http://localhost:5000/crypto-data/${date}`);
		const dataMap = [];
		for (let [key, value] of Object.entries(data)) {
			if (key.includes('USD')) {
				dataMap.push({
					state: key.split(' ')[1],
					valueUSD: value,
					valueNIS: (currentNisAmount * value).toString(),
				});
			}
		}
		setPrevDate(dataMap);
		return dataMap;
	});

	const handleDatePick = (dayPicked) => {
		if (dayPicked > new Date()) {
			alert('Please pick a valid date');
			setDate(new Date());
			return;
		}
		setDate(dayPicked);
	};

	if (error) return <div>error</div>;
	console.log(data);
	return (
		<div className='app'>
			<div className='container'>
				<button onClick={() => setCurrency(currency === 'USD' ? 'NIS' : 'USD')}></button>
				<DayPickerInput value={date.toDateString()} onDayChange={(day) => handleDatePick(day)} />{' '}
				<LineChart
					width={700}
					height={300}
					data={isFetching ? prevDate : data}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='state' />
					<YAxis />
					<Tooltip />
					<Line type='monotone' dataKey={currency === 'USD' ? 'valueUSD' : 'valueNIS'} stroke='#82ca9d' />
				</LineChart>
			</div>
		</div>
	);
}
export default App;
