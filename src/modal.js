import { placesList } from './index.js';
import {createCard, deleteCard, likeCard, openImage} from './cards';

let profileTitle = document.querySelector('.profile__title');
let profileDescription = document.querySelector('.profile__description');
const formEdit = document.forms['edit-profile'];
const formPlace = document.forms['new-place'];
const nameInput = formEdit.elements['name'];
const jobInput = formEdit.elements['description'];
const placeNameInput = formPlace.elements['place-name'];
const linkInput = formPlace.elements['link'];


function handleTransition(evt) {
	const popup = evt.target.closest('.popup');
	if (!popup.classList.contains('popup_is-opened')) {
		popup.classList.remove('popup_is-animated');
	}
}
function openPopup(popupClass) {
	const popup = document.querySelector(popupClass);
	popup.classList.add('popup_is-opened', 'popup_is-animated');

	if (popupClass === '.popup_type_edit') {
		const nameValue = profileTitle.textContent;
		const jobValue = profileDescription.textContent;

		nameInput.value = nameValue;
		jobInput.value = jobValue;
	}

	popup.addEventListener('click', closePopup);
	document.addEventListener('keydown', closePopup);
	popup.addEventListener('transitionend', handleTransition);
}

function closePopup(evt) {
	const popup = evt.target.closest('.popup');
	if (!popup) return;

	if ((evt.target.classList.contains('popup__close') || evt.target === popup)) {
		popup.classList.add('popup_is-animated');
		popup.classList.remove('popup_is-opened');

	}

	popup.removeEventListener('click', closePopup);
	popup.removeEventListener('transitionend', handleTransition);
}

function handleFormSubmit(evt) {
	evt.preventDefault();

	const formEdit = document.querySelector('.popup__form[name="edit-profile"]')
	const formPlace = document.querySelector('.popup__form[name="new-place"]');
	const popup = evt.target.closest('.popup');
	popup.classList.remove('popup_is-opened');

	if (evt.target === formEdit) {
		profileTitle.textContent = nameInput.value;
		profileDescription.textContent = jobInput.value;
		console.log(formEdit);
	} else if (evt.target === formPlace) {
		const card = createCard({ name: placeNameInput.value, link: linkInput.value }, { deleteCard: deleteCard, likeCard: likeCard, openImage: openImage });
		placesList.prepend(card);
		evt.currentTarget.reset();
	}
}


export { openPopup, closePopup, handleFormSubmit, handleTransition };