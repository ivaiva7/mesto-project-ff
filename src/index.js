// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css';
import { initialCards } from './cards.js';
import { createCard, deleteCard, likeCard, openImage } from './card.js';
import {
  openModal,
  closeModal,
  handleFormSubmit,
  profileTitle,
  profileDescription,
  nameInput,
  jobInput,
} from './modal.js';

const contentSection = document.querySelector(".content");
const places = contentSection.querySelector(".places");
const placesList = places.querySelector(".places__list");
const profile = document.querySelector(".profile");
const editPopup = document.querySelector(".popup_type_edit");
const addPopup = document.querySelector(".popup_type_new-card");
const formElements = document.querySelectorAll(".popup__form");


initialCards.forEach(function (element) {
  const card = createCard(element, { deleteCard, likeCard, openImage });
  placesList.append(card);
});


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
        closeModal(addPopup);
        closeModal(editPopup);
    });
  });



export { placesList };

