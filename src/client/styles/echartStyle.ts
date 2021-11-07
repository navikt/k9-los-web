// Fil som har felles styles eller definitioner som brukes som option til ReactECharts komponenten.

// felles variabler

// bar charts

export const eChartMaxBarWith = 8;
export const eChartYXAxisFontSizeSaksbehandlerNokkeltall = 15;

export const eChartXAxisFontSizeAvdelningslederNokkeltall = 12;
export const eChartYAxisFontSizeAvdelningslederNokkeltall = 15;
export const eChartYAxisMarginTextBarAvdelningslederNokkeltall = 15;

export const eChartFargerForLegendsForMineNyeFerdigstilte = ['#0067C5', '#634689', '#FF9100'];
export const eChartFargerForLegendsForBehandlingerPåVent = '#FF9100';

export const eChartGridDef = {
  left: '3%',
  right: '4%',
  bottom: '15%',
  containLabel: true,
};

export const eChartYaxisDef = [{
  type: 'value',
  minInterval: 1,
  axisLabel: {
    fontSize: 15,
    margin: 15,
  },
}];

export const eChartLegendStyle = {
  bottom: 0,
  left: 30,
  icon: 'circle',
  itemGap: 30,
  textStyle: {
    padding: 0,
    fontSize: 15,
  },
};

export const eChartTooltipTextStyle = {
  fontSize: 16,
};

export const eChartSeriesStyleAvdelningslederNokkeltall = {
  areaStyle: {},
  // Bestemmer storleken på cirklarna som är i grafen.
  symbolSize: 10,
};

export const eChartXAxisTickDefAvdelningslederNokkeltall = {
  show: true,
  alignWithLabel: true,
};
