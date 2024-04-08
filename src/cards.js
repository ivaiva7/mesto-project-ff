import { closePopup, handleTransition } from './modal.js'
const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];

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
        popup.classList.add('popup_is-opened', 'popup_is-animated');
        popupImage.src = cardImage.src;
        popupCaption.textContent = cardTitle.textContent;
        popup.addEventListener('transitionend', handleTransition);

        popup.addEventListener('click', closePopup);
        document.addEventListener('keydown', closePopup);

    }  else if ((evt.target.classList.contains('popup__close') || evt.target === popup)) {
        popupImage.src = '';
        popupCaption.textContent = '';
        closePopup();
    }

}


export { initialCards, createCard, deleteCard, likeCard, openImage, cards };