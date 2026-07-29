import VerticalSpacer from 'sharedComponents/VerticalSpacer';
import { HelpText, HStack, Switch } from '@navikt/ds-react';
import type React from 'react';
import { useState } from 'react';

export default function FeatureSwitch(props: {
	enabled: React.ReactNode;
	disabled: React.ReactNode;
	switchLabel: string;
	helpText?: React.ReactNode;
	flex?: boolean;
	defaultValue?: boolean;
}) {
	const [featureEnabled, setFeatureEnabled] = useState(props.defaultValue ?? false);

	const featureSwitch = (
		<HStack gap="space-8" align="center">
			<Switch size="small" checked={featureEnabled} onChange={(event) => setFeatureEnabled(event.target.checked)}>
				{props.switchLabel}
			</Switch>
			{props.helpText && <HelpText>{props.helpText}</HelpText>}
		</HStack>
	);
	const feature = featureEnabled ? props.enabled : props.disabled;

	return props.flex ? (
		<HStack gap="space-0" align="start" wrap justify="space-between">
			<div className="flex-grow">{feature}</div>
			{featureSwitch}
		</HStack>
	) : (
		<div>
			{featureSwitch}
			<VerticalSpacer sixteenPx />
			{feature}
		</div>
	);
}
