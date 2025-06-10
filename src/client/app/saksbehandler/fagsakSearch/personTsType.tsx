type Person = Readonly<{
	navn: string;
	personnummer: string;
	kjoenn: string;
	doedsdato?: string;
}>;

export default Person;
