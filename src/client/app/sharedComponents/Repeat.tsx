import React from 'react';
import _ from 'lodash';

export default function Repeat(props: { times: number; children: React.ReactNode }) {
	return _.times(props.times, () => props.children);
}
