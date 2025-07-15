import classnames from 'classnames/bind';
import * as styles from './tableColumn.module.css';

const classNames = classnames.bind(styles);

interface TableColumnProps {
	children?: unknown | unknown | unknown | unknown;
	className?: string;
	hidden?: boolean;
}

/**
 * TableColumn
 * @deprecated
 * Presentasjonskomponent. Tabellkolonne som brukes av komponenten Table.
 */

const TableColumn = ({ children, className, hidden }: TableColumnProps) => {
	if (hidden) {
		return null;
	}
	return <td className={classNames(styles.columnStyle, className)}>{children}</td>;
};

export default TableColumn;
