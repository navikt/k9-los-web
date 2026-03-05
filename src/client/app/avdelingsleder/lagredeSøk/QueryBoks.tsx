import React from 'react';
import { Button } from '@navikt/ds-react';
import { LagretSøk } from 'api/queries/avdelingslederQueries';
import { EndreKriterierLagretSøkModal } from 'avdelingsleder/lagredeSøk/EndreKriterierLagretSøkModal';
import ModalButton from 'sharedComponents/ModalButton';

export function QueryBoks({
	ikon,
	lagretSøk,
	modalTab,
	className,
	children,
}: {
	ikon: React.ReactNode;
	lagretSøk: LagretSøk;
	modalTab?: 'kriterier' | 'felter' | 'sortering';
	className?: string;
	children: React.ReactNode;
}) {
	const tittel = modalTab.charAt(0).toUpperCase() + modalTab.slice(1);
	return (
		<div className={`rounded-md p-2 border-solid border-[2px] border-ax-neutral-300 ${className || ''}`}>
			<div className="flex justify-between items-center gap-2">
				<div className="text-sm text-ax-neutral-800 flex items-center gap-1 font-medium">
					{ikon} {tittel}
				</div>
				<ModalButton
					renderButton={({ openModal }) => (
						<Button variant="tertiary" size="xsmall" onClick={openModal}>
							Endre {modalTab}
						</Button>
					)}
					renderModal={({ open, closeModal }) => (
						<EndreKriterierLagretSøkModal
							modalTab={modalTab}
							tittel={`${tittel} for lagret søk`}
							lagretSøk={lagretSøk}
							open={open}
							closeModal={closeModal}
						/>
					)}
				/>
			</div>
			{children || <p className="text-ax-neutral-600 italic mt-1">Ingen {modalTab} valgt</p>}
		</div>
	);
}
