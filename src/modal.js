function openModal(popupElement) {
	popupElement.classList.add('popup_is-opened');
	document.addEventListener('keydown', closeModalByEscape);
}

const closeModalByOverlay = (evt) => {
	if (evt.target.classList.contains('popup')) {
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
	popupElement.classList.remove('popup_is-opened');
	popupElement.removeEventListener('mousedown', closeModalByOverlay);
	document.removeEventListener('keydown', closeModalByEscape);
}

function setCloseModalEventListener (popupElement) {
	const closeButton = popupElement.querySelector('.popup__close');
	closeButton.addEventListener('click', () => {
		closeModal(popupElement);
	});

	popupElement.addEventListener('mousedown', (evt) => {
		if (evt.target.classList.contains('popup')) {
			closeModal(popupElement);
		}
	});
}


export { openModal, closeModal, closeModalByEscape, closeModalByOverlay, setCloseModalEventListener };
