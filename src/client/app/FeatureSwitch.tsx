import React, { useState } from 'react';
import { HStack, HelpText, Switch } from '@navikt/ds-react';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

export default function FeatureSwitch(props: {
	enabled: React.ReactNode;
	disabled: React.ReactNode;
	switchLabel: string;
	helpText?: string;
	flex?: boolean;
}) {
	const [featureEnabled, setFeatureEnabled] = useState(false);

	const featureSwitch = (
		<HStack gap="2" align="center">
			<Switch size="small" checked={featureEnabled} onChange={(event) => setFeatureEnabled(event.target.checked)}>
				{props.switchLabel}
			</Switch>
			{props.helpText && <HelpText>{props.helpText}</HelpText>}
		</HStack>
	);
	const feature = featureEnabled ? props.enabled : props.disabled;

	return props.flex ? (
		<HStack gap="0" align="start" wrap justify="space-between">
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
