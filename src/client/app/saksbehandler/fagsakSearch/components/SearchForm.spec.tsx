import React from 'react';
import { Form } from 'react-final-form';
import { IntlShape } from 'react-intl';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { Knapp } from 'nav-frontend-knapper';
import sinon from 'sinon';
import * as useRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { InputField } from 'form/FinalFields';
import { intlMock, shallowWithIntl } from '../../../../../../setup/testHelpers/intl-enzyme-test-helper';
import SearchForm from './SearchForm';

describe('<SearchForm>', () => {
	let contextStub;

	const intl: IntlShape = {
		...intlMock,
	};
	it('skal ha et søkefelt og en søkeknapp', () => {
		contextStub = sinon.stub(useRestApiData, 'default').callsFake(() => ({ kanSaksbehandle: true }));
		const formProps = {
			handleSubmit: sinon.spy(),
			values: { searchString: '' },
		};
		const wrapper = shallow(
			<SearchForm.WrappedComponent
				intl={intl}
				onSubmit={sinon.spy()}
				searchStarted
				resetSearch={sinon.spy()}
				// @ts-ignore
			/>,
		)
			.find(Form)
			.renderProp('render')(formProps);

		expect(wrapper.find(InputField)).to.have.length(1);
		expect(wrapper.find(Knapp)).to.have.length(1);
		contextStub.restore();
	});

	it('skal utføre søk når en trykker på søkeknapp', () => {
		contextStub = sinon.stub(useRestApiData, 'default').callsFake(() => ({ kanSaksbehandle: true }));
		const onButtonClick = sinon.spy();
		const formProps = {
			handleSubmit: onButtonClick,
			values: { searchString: '' },
		};

		const wrapper = shallowWithIntl(
			<SearchForm.WrappedComponent
				intl={intl}
				onSubmit={onButtonClick}
				searchStarted
				resetSearch={sinon.spy()}
				// @ts-ignore
			/>,
		)
			.find(Form)
			.renderProp('render')(formProps);

		const form = wrapper.find('form');
		const preventDefault = () => undefined;
		form.simulate('submit', { preventDefault });

		expect(onButtonClick).to.have.property('callCount', 1);
		contextStub.restore();
	});
});