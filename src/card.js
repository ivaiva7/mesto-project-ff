import { openModal } from './modal.js';

const cards = document.querySelectorAll('.card');

function createCard(item, { deleteCard, likeCard, openImage } ) {
	const cardTemplate = document.querySelector("#card-template").content;
	const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

	const cardImage = cardElement.querySelector(".card__image");
	cardImage.src = item.link;
	cardImage.alt = item.name;

	const cardTitle = cardElement.querySelector(".card__title");
	cardTitle.textContent = item.name;

	const deleteButton = cardElement.querySelector(".card__delete-button");
	deleteButton.addEventListener("click", function () {
		deleteCard(cardElement);
	});

	const likeButton = cardElement.querySelector(".card__like-button");
	likeButton.addEventListener("click", function (evt) {
		likeCard(evt, cardElement);
	});

	cardImage.addEventListener("click", function (evt) {
		openImage(evt, cardElement);
	});

	return cardElement;
}

function deleteCard(cardElement) {
	cardElement.remove();
}

function likeCard(evt, cardElement) {
	const likeButton = cardElement.querySelector(".card__like-button");
	if (likeButton) {
		likeButton.classList.toggle('card__like-button_is-active');
	}
}

function openImage(evt, cardElement) {
	const popup = document.querySelector('.popup_type_image');
	const popupImage = document.querySelector('.popup__image');
	const cardImage = cardElement.querySelector('.card__image');
	const cardTitle = cardElement.querySelector(".card__title");
	const popupCaption = document.querySelector('.popup__caption');

	if (cardImage) {
		openModal(popup);
		popupImage.src = cardImage.src;
		popupCaption.textContent = cardTitle.textContent;
	}

}


export { createCard, deleteCard, likeCard, openImage, cards };