
function openModal(popupElement) {
	if (!popupElement) {
		return;
	}
	popupElement.classList.add('popup_is-opened', 'popup_is-animated');
	popupElement.addEventListener('click', closeModalByOverlay);
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
	if (!popupElement) {
		return;
	}
	popupElement.classList.remove('popup_is-opened');
	popupElement.removeEventListener('click', closeModalByOverlay);
	document.removeEventListener('keydown', closeModalByEscape);
}


export { openModal, closeModal, closeModalByEscape, closeModalByOverlay };