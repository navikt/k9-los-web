export const getKoId = (idMedVersjon: string) => {
	if (!idMedVersjon) return idMedVersjon;
	const id = idMedVersjon.split('__')[0];
	return id;
};
