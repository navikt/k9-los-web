import { expect } from 'chai';
import { timeFormat } from './dateUtils';

describe('dateutils', () => {
	describe('timeFormat', () => {
		it('Skal formatere et dato til å vise kun klokkeslett', () => {
			const dateTime = '2017-08-02T01:54:25.455';
			expect(timeFormat(dateTime)).is.eql('01:54');
		});
	});
});
