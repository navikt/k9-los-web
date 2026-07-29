import _ from 'lodash';
import type React from 'react';

export default function Repeat(props: { times: number; children: React.ReactNode }) {
	return _.times(props.times, () => props.children);
}
