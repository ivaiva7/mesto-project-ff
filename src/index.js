// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard } from './card.js';
import { openModal, closeModal } from './modal.js';

const contentSection = document.querySelector(".content");
const places = contentSection.querySelector(".places");
const placesList = places.querySelector(".places__list");
const profile = document.querySelector(".profile");
const editPopup = document.querySelector(".popup_type_edit");
const addPopup = document.querySelector(".popup_type_new-card");
const formElements = document.querySelectorAll(".popup__form");
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const formEdit = document.forms['edit-profile'];
const formPlace = document.forms['new-place'];
const nameInput = formEdit.elements['name'];
const jobInput = formEdit.elements['description'];
const placeNameInput = formPlace.elements['place-name'];
const linkInput = formPlace.elements['link'];


initialCards.forEach(function (element) {
  const card = createCard(element, { deleteCard, likeCard, openImage });
  placesList.append(card);
});

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
profile.addEventListener("click", function (evt) {
  if (evt.target.classList.contains('profile__edit-button')) {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    openModal(editPopup);
  } else if (evt.target.classList.contains('profile__add-button')) {
    openModal(addPopup);
  }
});


formElements.forEach(form => {
    form.addEventListener('submit', function (evt) {
      handleFormSubmit(evt);

      if (form === formEdit) {
        closeModal(editPopup);
      } else if (form === formPlace) {
        closeModal(addPopup);
      }
    });
  });

export { placesList, openImage };

