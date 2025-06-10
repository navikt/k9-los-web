import { useEffect, useRef } from 'react';

const UseScrollToRef = (isActive: boolean) => {
	const myRef = useRef(null);

	useEffect(() => {
		if (isActive && myRef.current) {
			myRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [isActive]);

	return myRef;
};

export default UseScrollToRef;
