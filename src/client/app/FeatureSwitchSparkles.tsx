import React, { useRef, useState } from 'react';
import { SparklesFillIcon, SparklesIcon } from '@navikt/aksel-icons';
import { Button, HStack, Popover, Switch } from '@navikt/ds-react';

export default function FeatureSwitchSparkles(props: {
	turnedOn: React.ReactNode;
	turnedOff: React.ReactNode;
	switchLabel: string;
}) {
	const buttonRef = useRef<HTMLButtonElement>(null);
	const [toggleMeny, setToggleMeny] = useState(false);
	const [isTurnedOn, setIsTurnedOn] = useState(false);
	const Ikon = isTurnedOn ? SparklesFillIcon : SparklesIcon;

	return (
		<HStack gap="0" align="start" wrap justify="space-between">
			<div className="flex-grow">{isTurnedOn ? props.turnedOn : props.turnedOff}</div>
			<Button ref={buttonRef} onClick={() => setToggleMeny(!toggleMeny)} variant="tertiary">
				<Ikon title="Teste ut funksjonalitet som er under utvikling" fontSize="1.5rem" />
			</Button>
			<Popover anchorEl={buttonRef.current} open={toggleMeny} onClose={() => setToggleMeny(false)}>
				<Popover.Content>
					<HStack gap="2" align="center">
						<Switch size="small" checked={isTurnedOn} onChange={(event) => setIsTurnedOn(event.target.checked)}>
							{props.switchLabel}
						</Switch>
					</HStack>
				</Popover.Content>
			</Popover>
		</HStack>
	);
}
