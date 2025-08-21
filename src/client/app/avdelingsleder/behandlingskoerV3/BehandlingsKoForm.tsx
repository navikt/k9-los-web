import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { PencilIcon } from '@navikt/aksel-icons';
import { Alert, Button, ErrorMessage, Heading, Label, Modal } from '@navikt/ds-react';
import { Form, InputField, TextAreaField } from '@navikt/ft-form-hooks';
import { required } from '@navikt/ft-form-validators';
import AppContext from 'app/AppContext';
import { useHentSaksbehandlereAvdelingsleder, useKo, useOppdaterKøMutation } from 'api/queries/avdelingslederQueries';
import { Saksbehandler } from 'avdelingsleder/bemanning/saksbehandlerTsType';
import FilterIndex from 'filter/FilterIndex';
import { OppgaveQuery, OppgavefilterKode } from 'filter/filterTsTypes';
import SearchWithDropdown from 'sharedComponents/searchWithDropdown/SearchWithDropdown';
import { OppgavekøV3 } from 'types/OppgavekøV3Type';

enum fieldnames {
	TITTEL = 'tittel',
	SAKSBEHANDLERE = 'saksbehandlere',
	OPPGAVE_QUERY = 'oppgaveQuery',
	BESKRIVELSE = 'beskrivelse',
	FRITT_VALG_AV_OPPGAVE = 'frittValgAvOppgave',
}

interface BaseProps {
	lukk: () => void;
	ekspandert: boolean;
	id: string;
}

interface BehandlingsKoFormProps extends BaseProps {
	kø: OppgavekøV3;
	alleSaksbehandlere: Saksbehandler[];
}

const saksbehandlereMapper = (saksbehandlere: Saksbehandler[]) => {
	const relevanteEnheterForAvdelingsleder = ['2103', '4403', '4410'];
	const isProd = window.location.hostname.includes('intern.nav.no');
	if (isProd) {
		return saksbehandlere.map((saksbehandler) => ({
			value: saksbehandler.epost,
			label: saksbehandler.navn || saksbehandler.epost,
			group: relevanteEnheterForAvdelingsleder.find((enhet) => saksbehandler.enhet?.includes(enhet))
				? saksbehandler.enhet?.replace('NAV', 'Nav')
				: 'Andre enheter',
		}));
	}
	return saksbehandlere.map((saksbehandler) => ({
		value: saksbehandler.epost,
		label: saksbehandler.navn || saksbehandler.epost,
		group: saksbehandler.enhet?.replace('NAV', 'Nav') || 'Ukjent enhet',
	}));
};

const BehandlingsKoForm = ({ kø, alleSaksbehandlere, lukk, ekspandert, id }: BehandlingsKoFormProps) => {
	const { versjon } = kø;
	const [visFilterModal, setVisFilterModal] = useState(false);
	const [visSuksess, setVisSuksess] = useState(false);
	const defaultValues = {
		[fieldnames.TITTEL]: kø?.tittel || '',
		[fieldnames.SAKSBEHANDLERE]: kø?.saksbehandlere || [],
		[fieldnames.OPPGAVE_QUERY]: kø?.oppgaveQuery,
		[fieldnames.BESKRIVELSE]: kø?.beskrivelse || '',
		[fieldnames.FRITT_VALG_AV_OPPGAVE]: kø?.frittValgAvOppgave || false,
	};
	const formMethods = useForm({
		defaultValues,
		mode: 'all',
	});

	const lagreMutation = useOppdaterKøMutation(() => {
		setVisSuksess(true);
	});

	useEffect(() => {
		formMethods.reset(defaultValues);
	}, [ekspandert, versjon]);

	useEffect(() => {
		if (visSuksess) {
			setTimeout(() => setVisSuksess(false), 3000);
		}
	}, [visSuksess]);

	const formaterteSaksbehandlere = saksbehandlereMapper(alleSaksbehandlere);
	const onSubmit = (data) => {
		lagreMutation.mutate(data);
	};
	const lagreIModal = (oppgaveQuery: OppgaveQuery) => {
		onSubmit({ ...kø, ...formMethods.getValues(), oppgaveQuery });
		setVisFilterModal(false);
	};
	const grupper = [...new Set(formaterteSaksbehandlere.map((oppgavekode) => oppgavekode.group))].sort();
	const saksbehandlere = formMethods.watch(fieldnames.SAKSBEHANDLERE);
	const feltdefinisjoner = useContext(AppContext).felter;
	const overstyrteFeltdefinisjoner = useMemo(
		() => ({
			felter: feltdefinisjoner.map((felt) => {
				if (felt.kode === OppgavefilterKode.Personbeskyttelse && !kø.skjermet) {
					return {
						...felt,
						verdiforklaringer: felt.verdiforklaringer.filter((v) => v.verdi !== 'KODE6'),
					};
				}
				return felt;
			}),
		}),
		[feltdefinisjoner, kø.skjermet],
	);
	return (
		<Form formMethods={formMethods}>
			<div className="grid grid-cols-2 gap-16">
				<div>
					<Heading className="mb-2" size="small">
						Om køen
					</Heading>
					<div className="bg-[#e6f0ff] rounded p-5">
						<InputField label="Navn" name={fieldnames.TITTEL} size="medium" validate={[required]} />
						<TextAreaField
							size="medium"
							name="beskrivelse"
							label="Beskrivelse"
							description="Her kan du legge inn en valgfri beskrivelse av hva denne køen inneholder."
							className="mt-8"
							maxLength={4000}
							validate={[required]}
						/>
					</div>
				</div>
				<div className="w-full">
					<Heading className="mb-2" size="small">
						Saksbehandlere
					</Heading>
					{alleSaksbehandlere.length === 0 && (
						<>
							<FormattedMessage id="SaksbehandlereForOppgavekoForm.IngenSaksbehandlere" />
							{formMethods.getFieldState('saksbehandlere')?.error?.message && (
								<ErrorMessage>{formMethods.getFieldState('saksbehandlere')?.error?.message}</ErrorMessage>
							)}
						</>
					)}
					{alleSaksbehandlere.length > 0 && (
						<SearchWithDropdown
							label="Velg saksbehandlere"
							className="bg-[#e6f0ff] rounded p-5"
							suggestions={formaterteSaksbehandlere}
							showLabel
							groups={grupper}
							heading="Velg saksbehandlere"
							updateSelection={(valgteSaksbehandlere) => {
								formMethods.setValue(fieldnames.SAKSBEHANDLERE, valgteSaksbehandlere, { shouldDirty: true });
								formMethods.trigger('saksbehandlere');
							}}
							error={formMethods.getFieldState('saksbehandlere')?.error?.message}
							selectedValues={saksbehandlere}
							size="medium"
						/>
					)}
				</div>
			</div>
			<div className="mt-8">
				<div>
					<Label size="small">Kriterier for kø:</Label>
				</div>
				<Button
					className="ml-1 mt-1 "
					size="small"
					variant="tertiary"
					type="button"
					onClick={async () => {
						const isValid = await formMethods.trigger();
						if (isValid) {
							setVisFilterModal(true);
						}
					}}
					icon={<PencilIcon />}
				>
					Legge til, se og endre kriterier
				</Button>
			</div>
			{formMethods.formState.isDirty && (
				<Alert variant="warning" className="mt-12 max-w-[500px]">
					Du har gjort endringer i køen. Husk å lagre endringene før du lukker vinduet.
				</Alert>
			)}
			{visSuksess && (
				<Alert variant="success" className="mt-12 max-w-[300px]">
					Køen er nå lagret!
				</Alert>
			)}
			<div id={id} className="my-8 flex gap-4">
				<Button
					type="button"
					onClick={async () => {
						const isValid = await formMethods.trigger();
						if (isValid) {
							onSubmit({ ...kø, ...formMethods.getValues() });
						}
					}}
					disabled={!formMethods.formState.isDirty}
				>
					Lagre oppgavekø
				</Button>
				<Button variant="secondary" type="button" onClick={lukk}>
					{formMethods.formState.isDirty ? 'Lukk uten å lagre' : 'Lukk'}
				</Button>
			</div>
			{lagreMutation.isError && (
				<div>
					<ErrorMessage>Noe gikk galt ved lagring av kø</ErrorMessage>
				</div>
			)}
			{visFilterModal && (
				<Modal
					open={visFilterModal}
					onClose={() => setVisFilterModal(false)}
					portal
					width={900}
					aria-label="Kriterier for kø"
				>
					<Modal.Body className="flex flex-col min-h-[65rem]">
						<AppContext.Provider value={overstyrteFeltdefinisjoner}>
							<FilterIndex
								initialQuery={formMethods.watch(fieldnames.OPPGAVE_QUERY)}
								lagre={lagreIModal}
								avbryt={() => setVisFilterModal(false)}
								tittel="Kriterier for kø"
								paakrevdeKoder={[OppgavefilterKode.Oppgavestatus, OppgavefilterKode.Personbeskyttelse]}
								readOnlyKoder={kø.skjermet ? [OppgavefilterKode.Personbeskyttelse] : []}
								visningV3
								køvisning
							/>
						</AppContext.Provider>
					</Modal.Body>
				</Modal>
			)}
		</Form>
	);
};

const BehandlingsKoFormContainer = (props: BaseProps) => {
	const { lukk, ekspandert, id } = props;
	const { data: kø, error, isFetching: isFetchingKø } = useKo(props.id, { enabled: ekspandert });
	const { data: alleSaksbehandlere, isFetching: isFetchingAlleSaksbehandlere } = useHentSaksbehandlereAvdelingsleder();

	if (isFetchingKø || isFetchingAlleSaksbehandlere) {
		return <div className="animate-pulse bg-surface-neutral-subtle h-10 w-full rounded-xl" />;
	}

	if (error || !kø || !alleSaksbehandlere) {
		return <ErrorMessage>Noe gikk galt ved henting av kø</ErrorMessage>;
	}

	if (!ekspandert) return null;

	return (
		<BehandlingsKoForm kø={kø} alleSaksbehandlere={alleSaksbehandlere} id={id} lukk={lukk} ekspandert={ekspandert} />
	);
};

export default BehandlingsKoFormContainer;
