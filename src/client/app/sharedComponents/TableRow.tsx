import React from 'react';
import classnames from 'classnames/bind';
import * as styles from './tableRow.module.css';

const classNames = classnames.bind(styles);

const createMouseDownHandler = (onMouseDown, id, model) => (e) => onMouseDown && onMouseDown(e, id, model);

const findNearestRow = (element) => (element.tagName === 'TR' ? element : findNearestRow(element.parentElement));

const setFocus = (e, isNext) => {
	const row = findNearestRow(e.target);
	const otherRow = isNext ? row.nextSibling : row.previousSibling;
	const element = otherRow || row;

	if (element) {
		element.focus();
		e.preventDefault();
	}
};

const createKeyHandler = (onKeyDown, id, model) => (e) => {
	if (e.key === 'ArrowDown') {
		setFocus(e, true);
	} else if (e.key === 'ArrowUp') {
		setFocus(e, false);
	} else if (onKeyDown && e.target.tagName !== 'TD' && (e.key === 'Enter' || e.key === ' ')) {
		onKeyDown(e, id, model);
		e.preventDefault();
	}
};

interface TableRowProps {
	id?: number | string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	model?: any;
	isHeader?: boolean;
	onMouseDown?(...args: unknown[]): unknown;
	onKeyDown?(...args: unknown[]): unknown;
	children: React.ReactNode;
	noHover?: boolean;
	isSelected?: boolean;
	isBold?: boolean;
	isDashedBottomBorder?: boolean;
	isSolidBottomBorder?: boolean;
	isApLeftBorder?: boolean;
	className?: string;
}

/**
 * TableRow
 * @deprecated
 * Presentasjonskomponent. Tabellrad som brukes av komponenten Table.
 */
const TableRow = ({
	id,
	model,
	isHeader,
	onMouseDown,
	onKeyDown,
	children,
	noHover,
	isSelected,
	isBold,
	isDashedBottomBorder,
	isSolidBottomBorder,
	isApLeftBorder,
	className,
}: TableRowProps) => (
	<tr
		className={classNames(className, {
			rowHeader: isHeader,
			rowContent: !isHeader && !noHover,
			selected: isSelected,
			bold: isBold,
			dashedBottomBorder: isDashedBottomBorder,
			solidBottomBorder: isSolidBottomBorder,
			apLeftBorder: isApLeftBorder,
		})}
		onMouseDown={createMouseDownHandler(onMouseDown, id, model)}
		onKeyDown={createKeyHandler(onKeyDown, id, model)}
		tabIndex={0}
	>
		{children}
	</tr>
);

export default TableRow;
