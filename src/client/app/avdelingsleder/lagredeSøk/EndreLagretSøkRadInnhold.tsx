import React from 'react';
import { useForm } from 'react-hook-form';
import { FilesIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, TextField, Textarea } from '@navikt/ds-react';
import { LagretSøk, useEndreLagretSøk, useKopierLagretSøk, useSlettLagretSøk } from 'api/queries/avdelingslederQueries';

interface FormData {
	tittel: string;
	beskrivelse: string;
}

export function EndreLagretSøkRadInnhold({ lagretSøk, close }: { lagretSøk: LagretSøk; close: () => void }) {
	const { mutate: endreLagretSøk } = useEndreLagretSøk();
	const { mutate: kopierLagretSøk } = useKopierLagretSøk();
	const { mutate: slettLagretSøk } = useSlettLagretSøk();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting, isDirty },
	} = useForm({ defaultValues: { tittel: lagretSøk.tittel, beskrivelse: lagretSøk.beskrivelse } });

	const onSubmit = (data: FormData) => {
		endreLagretSøk(
			{
				...lagretSøk,
				tittel: data.tittel,
				beskrivelse: data.beskrivelse,
			},
			{
				onSuccess: () => {
					reset();
				},
			},
		);
	};

	return (
		<div className="grid grid-cols-2 gap-16 mb-8">
			<div>
				<Heading size="small" className="mb-4">
					Om søket
				</Heading>
				<form onSubmit={handleSubmit(onSubmit)}>
					<div className="bg-[#e6f0ff] rounded p-5">
						<TextField
							label="Tittel"
							{...register('tittel', { required: 'Tittel er påkrevd' })}
							error={errors.tittel?.message}
						/>
						<Textarea
							className="mt-4"
							label="Beskrivelse"
							description="Her kan du legge inn en valgfri beskrivelse av hva dette søket inneholder."
							maxLength={4000}
							{...register('beskrivelse', { required: undefined })}
							error={errors.tittel?.message}
						/>
					</div>
					<div className="mt-4 flex gap-4">
						<Button disabled={isSubmitting || !isDirty} type="submit">
							Lagre
						</Button>
						<Button variant="secondary" type="button" onClick={close}>
							{isDirty ? 'Lukk uten å lagre' : 'Lukk'}
						</Button>
					</div>
				</form>
			</div>
			<div>
				<Heading size="small" className="mb-4">
					Handlinger
				</Heading>
				<div className="bg-[#e6f0ff] rounded p-5 flex gap-4 flex-col">
					<div>
						<Button
							variant="secondary"
							onClick={() => {
								kopierLagretSøk({ id: lagretSøk.id, tittel: `Kopi av: ${lagretSøk.tittel}` });
							}}
							icon={<FilesIcon />}
						>
							Kopier søket
						</Button>
					</div>
					<div>
						<Button
							variant="secondary"
							onClick={() => {
								slettLagretSøk(lagretSøk.id);
							}}
							icon={<TrashIcon />}
						>
							Slett søket
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
