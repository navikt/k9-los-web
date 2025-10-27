import React, { FunctionComponent, ReactNode, useState } from 'react';

export interface RenderModalProps {
	open: boolean;
	closeModal: () => void;
}

interface Props {
	renderButton: React.FunctionComponent<{ openModal: () => void }>;
	renderModal: React.FunctionComponent<RenderModalProps>;
}

const ModalButton: FunctionComponent<Props> = (props: Props) => {
	const [open, setOpen] = useState(false);
	const button = props.renderButton({ openModal: () => setOpen(true) }) as ReactNode;
	const modal = open
		? (props.renderModal({
				open,
				closeModal: () => setOpen(false),
			}) as ReactNode)
		: null;

	return (
		<>
			{button}
			{modal}
		</>
	);
};

export default ModalButton;
