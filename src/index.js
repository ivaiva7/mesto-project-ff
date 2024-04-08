// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css';
import { initialCards, createCard, deleteCard, likeCard, openImage } from './cards.js';
import { openPopup, closePopup, handleFormSubmit, handleTransition } from './modal.js';

const contentSection = document.querySelector(".content");
const places = contentSection.querySelector(".places");
const placesList = places.querySelector(".places__list");
const profile = document.querySelector(".profile");
const popups = document.querySelectorAll(".popup");
const formElement = document.querySelectorAll(".popup__form");


initialCards.forEach(function (element) {
  const card = createCard(element, { deleteCard, likeCard, openImage });
  placesList.append(card);
});


  profile.addEventListener("click", function (evt) {
    if (evt.target.classList.contains('profile__edit-button')) {
      openPopup('.popup_type_edit');

    } else if (evt.target.classList.contains('profile__add-button')) {
      openPopup('.popup_type_new-card');
    }
  });


  popups.forEach(popup => {
    popup.addEventListener('click', closePopup);
    document.addEventListener('keydown', closePopup);
    popup.addEventListener('transitionend', handleTransition);


  });

document.addEventListener('keydown', function (evt) {
  const popup = document.querySelector('.popup.popup_is-opened');
  if (popup && evt.key === 'Escape') {
    popup.classList.add('popup_is-animated');
    popup.classList.remove('popup_is-opened');
    document.removeEventListener('keydown', closePopup);
  }
});

formElement.forEach(form => {
  form.addEventListener('submit', handleFormSubmit);
});


export { placesList };

