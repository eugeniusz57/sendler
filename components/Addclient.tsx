"use client";

import React, { useState } from "react";

import Modal from "./Modal/Modal";
import GreenButton from "./buttons/GreenButton";
import { ClientForm } from "./forms/ClientForm";

interface Props {
	groupName?: string;
};

const AddClient = ({ groupName }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => {
		setIsModalOpen(true);
		document.body.classList.add('overflow-hidden');
	};

	const closeModal = () => {
		setIsModalOpen(false);
		document.body.classList.remove('overflow-hidden');
	};
	return (
		<>
			<GreenButton size="big" type="button" onClick={openModal} >Додати контакт</GreenButton>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<ClientForm onClose={closeModal} groupName={groupName} title='Редагування групи' />
			</Modal>
		</>
	);
};

export default AddClient;