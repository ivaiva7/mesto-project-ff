
function handleTransition(evt) {
	const popup = evt.target.closest('.popup');
	if (popup && !(popup.classList.contains('popup_is-animated'))) {
		popup.classList.toggle('popup_is-animated');
	}
}

function openModal(popupElement) {
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
}


export { openModal, closeModal, handleTransition, closeModalByEscape, closeModalByOverlay };