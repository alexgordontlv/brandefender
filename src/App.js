import './App.css';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import axios from './utilities/axios/axios';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import Chart from './components/chart/Chart';
import CustomButton from './components/custombutton/CustomButton';
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
	const handleDayPicker = (day) => {
		if (day < new Date()) {
			setselectedDate(day);
			return;
		}
		alert('Please pick up current date or past one.');
	};
	if (error) return <div>error</div>;
	return (
		<div className='app'>
			<div className='container'>
				<div className='currency_container'>
					<DayPickerInput value={selectedDate.toDateString()} onDayChange={(day) => handleDayPicker(day)} />{' '}
					<div>
						<CustomButton val='USD' selected={selected} {...{ setSelected }} />
						<CustomButton val='ILS' selected={!selected} {...{ setSelected }} />
					</div>
				</div>
				<div className='chart_container'>
					<Chart {...{ isFetching, data, prevDateData, selected }} />
				</div>
			</div>
		</div>
	);
}
export default App;
