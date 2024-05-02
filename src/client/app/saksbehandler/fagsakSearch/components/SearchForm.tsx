import React, { FunctionComponent } from 'react';
import { Form } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';
import advarselIcon from 'images/advarsel.svg';
import { Knapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import NavAnsatt from 'app/navAnsattTsType';
import { RestApiGlobalStatePathsKeys } from 'api/k9LosApi';
import useGlobalStateRestApiData from 'api/rest-api-hooks/src/global-data/useGlobalStateRestApiData';
import { InputField } from 'form/FinalFields';
import Image from 'sharedComponents/Image';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { FlexColumn, FlexContainer, FlexRow } from 'sharedComponents/flexGrid';
import { hasValidSaksnummerOrFodselsnummerFormat } from 'utils/validation/validators';
import * as styles from './searchForm.css';

const isButtonDisabled = (
	searchString: string,
	searchStarted: boolean,
	searchResultAccessDenied: { feilmelding?: string },
) => (!searchResultAccessDenied.feilmelding && searchStarted) || !searchString;

interface OwnProps {
	onSubmit: ({ searchString, skalReservere }: { searchString: string; skalReservere: boolean }) => void;
	searchStarted: boolean;
	searchResultAccessDenied?: {
		feilmelding?: string;
	};
}

/**
 * SearchForm
 *
 * Presentasjonskomponent. Definerer søkefelt og tilhørende søkeknapp.
 */
export const SearchForm: FunctionComponent<OwnProps> = ({ onSubmit, searchStarted, searchResultAccessDenied }) => {
	const { kanSaksbehandle } = useGlobalStateRestApiData<NavAnsatt>(RestApiGlobalStatePathsKeys.NAV_ANSATT);
	const intl = useIntl();

	return (
		<Form
			onSubmit={onSubmit}
			render={({ handleSubmit, values }) => (
				<form className={styles.container} onSubmit={handleSubmit}>
					<Undertittel>{intl.formatMessage({ id: 'Search.SearchFagsakOrPerson' })}</Undertittel>
					{kanSaksbehandle && <VerticalSpacer sixteenPx />}
					<VerticalSpacer eightPx />
					<FlexContainer>
						<FlexRow>
							<FlexColumn>
								<InputField
									name="searchString"
									parse={(s = '') => s.trim()}
									label={intl.formatMessage({ id: 'Search.SaksnummerOrPersonId' })}
									bredde="L"
									validate={[hasValidSaksnummerOrFodselsnummerFormat]}
								/>
							</FlexColumn>
							<FlexColumn>
								<Knapp
									mini
									htmlType="submit"
									className={styles.button}
									spinner={!searchResultAccessDenied.feilmelding && searchStarted}
									disabled={isButtonDisabled(values.searchString, searchStarted, searchResultAccessDenied)}
								>
									<FormattedMessage id="Search.Search" />
								</Knapp>
							</FlexColumn>
						</FlexRow>
						{searchResultAccessDenied.feilmelding && (
							<>
								<VerticalSpacer eightPx />
								<FlexRow>
									<FlexColumn>
										<Image className={styles.advarselIcon} src={advarselIcon} />
									</FlexColumn>
									<FlexColumn>
										<FormattedMessage id={searchResultAccessDenied.feilmelding} />
									</FlexColumn>
								</FlexRow>
							</>
						)}
					</FlexContainer>
				</form>
			)}
		/>
	);
};

SearchForm.defaultProps = {
	searchResultAccessDenied: {
		feilmelding: undefined,
	},
};

export default SearchForm;
