import React, { FunctionComponent, ReactNode, useEffect, useState } from 'react';

interface Props {
	renderButton: (props: { openModal: () => void }) => ReactNode;
	renderModal: (props: { open: boolean; closeModal: () => void }) => ReactNode;
	setModal?: (modal: ReactNode) => void;
}

const ModalButton: FunctionComponent<Props> = (props: Props) => {
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (props.setModal) {
			const modal = open ? props.renderModal({ open, closeModal: () => setOpen(false) }) : null;
			props.setModal(modal);
		}
	}, [open]);

	const button = props.renderButton({ openModal: () => setOpen(true) }) as ReactNode;
	const modal = open
		? props.renderModal({
				open,
				closeModal: () => setOpen(false),
			})
		: null;

	return (
		<>
			{button}
			{!props.setModal && modal}
		</>
	);
};

export default ModalButton;
