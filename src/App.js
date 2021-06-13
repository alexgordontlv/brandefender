import './App.css';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useQuery } from 'react-query';
import axios from './utilitis/axios/axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import ToggleButton from '@material-ui/lab/ToggleButton';
import 'react-day-picker/lib/style.css';

function App() {
	const [selectedDate, setselectedDate] = useState(new Date());
	const [prevDateData, setPrevDateData] = useState(null);
	const [selected, setSelected] = React.useState(false);

	const { isFetching, error, data } = useQuery(
		[('dateData', selectedDate)],
		async () => {
			const { data } = await axios.get(`crypto-data/${selectedDate}`);
			setPrevDateData(data);
			return data;
		},
		{
			refetch: false,
		}
	);

	if (error) return <div>error</div>;
	return (
		<div className='app'>
			<div className='container'>
				<div className='currency_container'>
					<DayPickerInput value={selectedDate.toDateString()} onDayChange={(day) => setselectedDate(day)} />{' '}
					<div>
						<ToggleButton
							value='check'
							selected={selected}
							style={{ color: selected && '#82ca9d' }}
							onChange={() => {
								setSelected(!selected);
							}}>
							USD
						</ToggleButton>
						<ToggleButton
							value='check'
							selected={!selected}
							style={{ color: !selected && '#82ca9d' }}
							onChange={() => {
								setSelected(!selected);
							}}>
							ILS
						</ToggleButton>
					</div>
				</div>
				<div className='chart_container'>
					{' '}
					<LineChart
						width={600}
						height={300}
						data={isFetching ? prevDateData : data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}>
						<CartesianGrid strokeDasharray='3 3' />
						<XAxis dataKey='state' padding={{ left: 50, right: 50 }} />
						<YAxis datakey='value' type='number' domain={['dataMin', 'dataMax']} />
						<Tooltip />
						<Line fill='black' strokeWidth={2} dataKey={selected ? 'valueUSD' : 'valueNIS'} stroke='#82ca9d' />
					</LineChart>
				</div>
			</div>
		</div>
	);
}
export default App;
