// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css';
import { getProfileData, getInitialCards, updateProfileData, postNewCard } from './api.js';
import { createCard, likeCard, deleteCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation } from './validation.js';

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
const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};
const profileDataPromise = getProfileData();
const cardsDataPromise = getInitialCards();
let currentUserId;
Promise.all([profileDataPromise, cardsDataPromise])
    .then(([userData, cardsData]) => {
      currentUserId = userData._id;
      cardsData.forEach(card => {
        const isOwner = card.owner._id === currentUserId;
        const newCard = createCard(card, isOwner, { deleteCard, likeCard, openImage });
        placesList.append(newCard);
        console.log(cardsData);
      });
        console.log(userData);

        const nameElement = document.querySelector('.profile__title');
        const aboutElement = document.querySelector('.profile__description');
        const avatarElement = document.querySelector('.profile__image');

        nameElement.textContent = userData.name;
        aboutElement.textContent = userData.about;
        avatarElement.src = userData.avatar;
        avatarElement.alt = userData.name;

    })
    .catch(error => {
      console.error('Ошибка при получении данных:', error);
    });


function handleFormSubmit(evt) {
  evt.preventDefault();

  const formEdit = document.querySelector('.popup__form[name="edit-profile"]')
  const formPlace = document.querySelector('.popup__form[name="new-place"]');
  const newName = nameInput.value;
  const newJobName = jobInput.value;

  if (evt.target === formEdit) {
    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;
    updateProfileData(newName, newJobName);

  } else if (evt.target === formPlace) {
    const card = createCard({ name: placeNameInput.value, link: linkInput.value }, currentUserId, { deleteCard: deleteCard, likeCard: likeCard, openImage: openImage });
    postNewCard(placeNameInput.value, linkInput.value);
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


enableValidation(validationConfig);


export { placesList, openImage, formElements, editPopup, addPopup, formPlace, formEdit, validationConfig, placeNameInput };

