import { likeCardPut, dislikeCard, deleteCardFromServer } from './api.js';

function createCard(item, isOwner, { deleteCard, likeCard, openImage } ) {
	const cardTemplate = document.querySelector("#card-template").content;
	const cardElement = cardTemplate.querySelector(".card").cloneNode(true);

	const cardImage = cardElement.querySelector(".card__image");
	cardImage.src = item.link;
	cardImage.alt = item.name;

	const cardTitle = cardElement.querySelector(".card__title");
	cardTitle.textContent = item.name;

	const deleteButton = cardElement.querySelector(".card__delete-button");
	if (isOwner) {
		deleteButton.addEventListener("click", function () {
			deleteCard(cardElement, item._id);
		});
	} else {
		deleteButton.remove();
	}

	const likeButton = cardElement.querySelector(".card__like-button");
	likeButton.addEventListener("click", function () {
		likeCard(cardElement, item._id);
	});

	const likeCounter = cardElement.querySelector(".card__like-counter");
	likeCounter.textContent = item.likes ? item.likes.length : 0;

	cardImage.addEventListener("click", function (evt) {
		openImage(evt, cardElement);
	});

	return cardElement;
}

function likeCard(cardElement, cardId) {
	console.log(cardId);
	const likeButton = cardElement.querySelector(".card__like-button");
	const likeCounter = cardElement.querySelector(".card__like-counter");
	const isLiked = likeButton.classList.contains('card__like-button_is-active');

	if (isLiked) {
		dislikeCard(cardId)
			.then(updatedCardData => {
				likeCounter.textContent = updatedCardData.likes.length;

				likeButton.classList.remove('card__like-button_is-active');
			})
			.catch(error => {
				console.error(`Ошибка при снятии лайка: ${error}`);
			});
	} else {
		likeCardPut(cardId)
			.then(updatedCardData => {
				likeCounter.textContent = updatedCardData.likes.length;
				likeButton.classList.add('card__like-button_is-active');
			})
			.catch(error => {
				console.error(`Ошибка при постановке лайка: ${error}`);
			});
	}
}

	function deleteCard(cardElement, cardId) {
		deleteCardFromServer(cardId)
			.then(() => {
				cardElement.remove();
			})
			.catch(error => {
				console.error(`Ошибка при удалении карточки: ${error}`);
			});
	}


export { createCard, likeCard, deleteCard };