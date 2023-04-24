import React from 'react';
import PropTypes from 'prop-types';
import EditedIcon from 'sharedComponents/EditedIcon';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { range } from 'utils/arrayUtils';
import styles from './optionGrid.css';

export const OptionGrid = ({ id, columns, rows, options, spaceBetween, isEdited, direction }) => {
	if (direction === 'vertical') {
		const numRows = rows || options.length;
		return (
			<FlexContainer fluid id={id}>
				<FlexColumn className={styles.fullBreddeIE}>
					{range(numRows).map((rowIndex) => (
						<FlexRow key={`row${rowIndex}`} spaceBetween={spaceBetween}>
							{options.filter((option, optionIndex) => optionIndex % numRows === rowIndex)}
							{isEdited && <EditedIcon className="radioEdited" />}
						</FlexRow>
					))}
				</FlexColumn>
			</FlexContainer>
		);
	}
	const numColumns = columns || options.length;
	return (
		<FlexContainer fluid id={id}>
			<FlexRow spaceBetween={spaceBetween}>
				{range(numColumns).map((columnIndex) => (
					<FlexColumn key={`column${columnIndex}`}>
						{options.filter((option, optionIndex) => optionIndex % numColumns === columnIndex)}
					</FlexColumn>
				))}
				{isEdited && <EditedIcon className="radioEdited" />}
			</FlexRow>
		</FlexContainer>
	);
};

OptionGrid.propTypes = {
	id: PropTypes.string,
	columns: PropTypes.number,
	options: PropTypes.arrayOf(PropTypes.element).isRequired,
	spaceBetween: PropTypes.bool,
	isEdited: PropTypes.bool,
	direction: PropTypes.string,
	rows: PropTypes.number,
};

OptionGrid.defaultProps = {
	id: undefined,
	columns: 0,
	rows: 0,
	spaceBetween: false,
	isEdited: false,
	direction: 'horizontal',
};

export default OptionGrid;
