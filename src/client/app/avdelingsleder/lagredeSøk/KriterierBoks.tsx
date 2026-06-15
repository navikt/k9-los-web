import React from 'react';
import { FilterIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { FilterBeskrivelseListe } from 'filter/FilterBeskrivelseListe';
import { FilterBeskrivelse as FilterBeskrivelseType } from 'filter/queryBeskrivelseUtils';
import ModalButton from 'sharedComponents/ModalButton';
import { EndreKriterierLagretSøkModal } from './EndreKriterierLagretSøkModal';
import { QueryBoksStyle } from './QueryBoksStyle';

export function KriterierBoks({
	queryBeskrivelse,
	lagretSøk,
}: {
	queryBeskrivelse: FilterBeskrivelseType[];
	lagretSøk: LagretSøk;
}) {
	return (
		<QueryBoksStyle
			ikon={<FilterIcon />}
			tittel="Kriterier"
			knapp={
				<ModalButton
					renderButton={({ openModal }) => (
						<Button variant="tertiary" size="small" icon={<PencilIcon />} onClick={openModal}>
							Endre kriterier
						</Button>
					)}
					renderModal={({ open, closeModal }) => (
						<EndreKriterierLagretSøkModal
							tittel={`Kriterier for lagret søk`}
							lagretSøk={lagretSøk}
							open={open}
							closeModal={closeModal}
						/>
					)}
				/>
			}
		>
			<FilterBeskrivelseListe queryBeskrivelse={queryBeskrivelse} />
		</QueryBoksStyle>
	);
}
