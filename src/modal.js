import { placesList } from './index.js';
import { createCard, deleteCard, likeCard, openImage} from './card.js';

const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formEdit = document.forms['edit-profile'];
const formPlace = document.forms['new-place'];
const nameInput = formEdit.elements['name'];
const jobInput = formEdit.elements['description'];
const placeNameInput = formPlace.elements['place-name'];
const linkInput = formPlace.elements['link'];



function handleTransition(evt) {
	const popup = evt.target.closest('.popup');
	if (popup && !(popup.classList.contains('popup_is-animated'))) {
		popup.classList.toggle('popup_is-animated');
	}
}

function openModal(popupElement) {
		const popup = popupElement;

		if (!popup) return;
		popup.classList.add('popup_is-opened', 'popup_is-animated');
		popup.addEventListener('click', closeModalByOverlay);
		popup.addEventListener('click', handleTransition);
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
	const popup = popupElement;
	if (!popup) return;

	popup.classList.remove('popup_is-opened');
	popup.removeEventListener('click', closeModalByOverlay);
	popup.removeEventListener('transitioned', handleTransition);
	document.removeEventListener('keydown', closeModalByEscape);
}


function handleFormSubmit(evt) {
	evt.preventDefault();

	const formEdit = document.querySelector('.popup__form[name="edit-profile"]')
	const formPlace = document.querySelector('.popup__form[name="new-place"]');

	if (evt.target === formEdit) {
		profileTitle.textContent = nameInput.value;
		profileDescription.textContent = jobInput.value;

	} else if (evt.target === formPlace) {
		const card = createCard({ name: placeNameInput.value, link: linkInput.value }, { deleteCard: deleteCard, likeCard: likeCard, openImage: openImage });
		placesList.prepend(card);
		evt.currentTarget.reset();
	}
}


export { openModal, closeModal, handleFormSubmit, handleTransition, closeModalByEscape, closeModalByOverlay, profileTitle, profileDescription, formEdit, formPlace, nameInput, jobInput };