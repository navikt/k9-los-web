import type { ECharts, EChartsOption } from 'echarts';
import { getInstanceByDom, init } from 'echarts';
import type { CSSProperties } from 'react';
import { type FunctionComponent, useEffect, useRef } from 'react';

export interface OwnProps {
	option: EChartsOption;
	style?: CSSProperties;
	height: number;
}

const ReactECharts: FunctionComponent<OwnProps> = ({ option, style, height }) => {
	const chartRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let chart: ECharts | undefined;
		if (chartRef.current !== null) {
			chart = init(chartRef.current);
		}

		const resizeChart = () => {
			chart?.resize();
		};
		window.addEventListener('resize', resizeChart);

		return () => {
			chart?.dispose();
			window.removeEventListener('resize', resizeChart);
		};
	}, []);

	useEffect(() => {
		if (chartRef.current !== null) {
			const chart = getInstanceByDom(chartRef.current);
			chart.setOption(option, true);
		}
	}, [option]);

	return <div ref={chartRef} style={{ width: 'auto', height, ...style }} />;
};

export default ReactECharts;
