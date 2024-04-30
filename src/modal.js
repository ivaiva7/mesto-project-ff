import { clearValidation } from './validation.js';
import { editPopup, addPopup, formEdit, formPlace,validationConfig, placeNameInput } from './index.js';
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
		clearValidation(formPlace, validationConfig);
	}
}


export { openModal, closeModal, handleTransition, closeModalByEscape, closeModalByOverlay };