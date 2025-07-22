import React, { useState } from 'react';

export interface RenderModalProps {
	open: boolean;
	closeModal: () => void;
}

interface Props {
	renderButton: React.FunctionComponent<{ openModal: () => void }>;
	renderModal: React.FunctionComponent<RenderModalProps>;
}

const ModalButton = (props: Props) => {
	const [open, setOpen] = useState(false);

	return (
		<>
			{props.renderButton({ openModal: () => setOpen(true) })}
			{open && props.renderModal({ open, closeModal: () => setOpen(false) })}
		</>
	);
};

export default ModalButton;
