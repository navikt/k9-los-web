import React, { FunctionComponent } from 'react';
import { Link } from 'react-router';
import { BodyShort } from '@navikt/ds-react';

const MissingPage: FunctionComponent = () => (
	<div className="bg-gray-100 flex m-auto justify-center">
		<div className="bg-white rounded-md p-8">
			<BodyShort>Denne siden finnes ikke. Hvis du mener dette er en feil, vennligst meld fra i porten.</BodyShort>
			<div className="flex">
				<BodyShort className="m-auto mt-4">
					<Link to="/">Gå til forsiden</Link>
				</BodyShort>
			</div>
		</div>
	</div>
);

export default MissingPage;
