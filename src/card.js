
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



export { createCard, deleteCard, likeCard };