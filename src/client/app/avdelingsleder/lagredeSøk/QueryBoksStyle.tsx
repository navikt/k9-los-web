import React from 'react';

export function QueryBoksStyle({
	ikon,
	tittel,
	children,
}: {
	ikon: React.ReactNode;
	tittel: string;
	children: React.ReactNode;
}) {
	return (
		<div className={`rounded-md p-2 border-solid border-[2px] border-ax-neutral-300 mb-2`}>
			<div className="flex justify-between items-center gap-2 mb-2">
				<div className="text-sm text-ax-neutral-800 flex items-center gap-1 font-medium">
					{ikon} {tittel}
				</div>
			</div>
			{children}
		</div>
	);
}
