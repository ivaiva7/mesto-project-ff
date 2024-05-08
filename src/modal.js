import { clearValidation } from './validation.js';
import {
	editPopup,
	addPopup,
	formEdit,
	formPlace,
	validationConfig,
	placeNameInput,
	linkInput,
	formAvatar,
	avatarInput,
	deletePopup
} from './index.js';
import { deleteCardFromServer } from './api.js';
function handleTransition(evt) {
	const popup = evt.target.closest('.popup');
	if (popup && !(popup.classList.contains('popup_is-animated'))) {
		popup.classList.toggle('popup_is-animated');
	}
}

function openModal(popupElement) {
	clearValidation(formEdit, validationConfig);
	if (!popupElement) return;
		popupElement.classList.add('popup_is-opened', 'popup_is-animated');
		popupElement.addEventListener('click', closeModalByOverlay);
		popupElement.addEventListener('click', handleTransition);
		document.addEventListener('keydown', closeModalByEscape);
}

function openDeleteModal(cardElement, cardId) {
	const confirmButton = document.querySelector('.popup__button-type-delete');
	const cancelButton = document.querySelector('.popup__close');
	confirmButton.addEventListener('click', async () => {
		try {
			console.log('Начало отправки запроса на удаление');
			await deleteCardFromServer(cardId);
			cardElement.remove();
			closeModal(deletePopup);
			console.log('Карточка успешно удалена с сервера');
		} catch (error) {
			console.error(`Ошибка при удалении карточки: ${error}`);
		}
	});
	cancelButton.addEventListener('click', () => {
		closeModal(deletePopup);
	});
	openModal(deletePopup);
}

const closeModalByOverlay = (evt) => {
	if (evt.target.classList.contains('popup__close') || evt.target.classList.contains('popup')) {
		const popup = evt.currentTarget;
		closeModal(popup);
	}
};

const closeModalByEscape = (evt) => {
	if (evt.key === 'Escape') {
		const popup = document.querySelector('.popup.popup_is-opened');
		if (popup) {
			closeModal(popup);
		}
	}
};

function closeModal(popupElement) {
	if (!popupElement) return;
	popupElement.classList.remove('popup_is-opened');
	popupElement.removeEventListener('click', closeModalByOverlay);
	popupElement.removeEventListener('transitioned', handleTransition);
	document.removeEventListener('keydown', closeModalByEscape);

	if (popupElement === editPopup) {
		clearValidation(formEdit, validationConfig);
	} else if (popupElement === addPopup) {
		placeNameInput.value = '';
		linkInput.value = '';
		clearValidation(formPlace, validationConfig);
	}
		avatarInput.value = '';
		clearValidation(formAvatar, validationConfig);
}


export { openModal, closeModal, handleTransition, closeModalByEscape, closeModalByOverlay, openDeleteModal };