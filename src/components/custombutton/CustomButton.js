import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';

const CustomButton = ({ val, selected, setSelected }) => {
	return (
		<ToggleButton
			value='check'
			selected={selected}
			style={{ color: selected && '#82ca9d' }}
			onChange={() => {
				setSelected((selected) => !selected);
			}}>
			{val}
		</ToggleButton>
	);
};

export default CustomButton;
