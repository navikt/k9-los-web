import React from 'react';

export function QueryBoksStyle({
	ikon,
	tittel,
	knapp,
	children,
}: {
	ikon: React.ReactNode;
	tittel: string;
	knapp?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<div className={`rounded-md p-2 border-solid border-[2px] border-ax-neutral-300 mb-2`}>
			<div className="flex justify-between items-start gap-2 -mb-3">
				<div className="text-sm text-ax-neutral-800 flex items-center gap-1 font-medium">
					{ikon} {tittel}
				</div>
				{knapp}
			</div>
			{children}
		</div>
	);
}
