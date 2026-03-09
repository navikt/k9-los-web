import React from 'react';
import { FilterIcon, PencilIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
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
			{queryBeskrivelse && queryBeskrivelse.length > 0 && (
				<div className="flex flex-col gap-0.5 text-base mt-1">
					{queryBeskrivelse.map((filter) => (
						<div className="leading-normal" key={filter.feltnavn}>
							<span className="font-ax-bold text-ax-neutral-800">{filter.feltnavn}</span>:{' '}
							{filter.sammenføyning.prefiks ?? ''}
							{filter.verdier.join(filter.sammenføyning.separator)}
						</div>
					))}
				</div>
			)}
		</QueryBoksStyle>
	);
}
