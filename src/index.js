// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css';
import { getProfileData, getInitialCards, updateProfileData, postNewCard, updateAvatar, imageUrlCheck, deleteCardFromServer } from './api.js';
import { createCard, likeCard, deleteCard } from './card.js';
import { openModal, closeModal } from './modal.js';
import { enableValidation } from './validation.js';

const contentSection = document.querySelector(".content");
const places = contentSection.querySelector(".places");
const placesList = places.querySelector(".places__list");
const profile = document.querySelector(".profile");
const editPopup = document.querySelector(".popup_type_edit");
const addPopup = document.querySelector(".popup_type_new-card");
const avatarPopup = document.querySelector(".popup_type_avatar");
const deletePopup = document.querySelector(".popup_type_delete");
const formElements = document.querySelectorAll(".popup__form");
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const formEdit = document.forms['edit-profile'];
const formPlace = document.forms['new-place'];
const formAvatar = document.forms['new-avatar'];
const formDelete = document.forms['delete-place'];
const nameInput = formEdit.elements['name'];
const jobInput = formEdit.elements['description'];
const placeNameInput = formPlace.elements['place-name'];
const linkInput = formPlace.elements['link'];
const avatarInput = formAvatar.elements['link'];
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
        const isLikedByCurrentUser = card.likes.some(like => like._id === currentUserId);
        const likeButton = newCard.querySelector('.card__like-button');
        if (isLikedByCurrentUser) {
          likeButton.classList.add('card__like-button_is-active');
        } else {
          likeButton.classList.remove('card__like-button_is-active');
        }
        placesList.append(newCard);
      });
        const nameElement = document.querySelector('.profile__title');
        const aboutElement = document.querySelector('.profile__description');
        const avatarElement = document.querySelector('.profile__image');

        nameElement.textContent = userData.name;
        aboutElement.textContent = userData.about;
        avatarElement.src = userData.avatar;
        avatarElement.alt = userData.name;

    })
    .catch(error => {
      console.log(`Ошибка при получении данных: ${error}`);
    });

function toggleLoader(formElement) {
    const loader = formElement.querySelector('.loader');
    const submitButton = formElement.querySelector('.popup__button');

    if (loader && submitButton) {
        loader.style.display = 'flex';
        submitButton.style.display = 'none';
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (loader && submitButton) {
                loader.style.display = 'none';
                submitButton.style.display = 'block';
                resolve();
            }
        }, 2000);
    });
}

async function handleFormSubmit(evt) {
    evt.preventDefault();
    const formElement = evt.target;
    toggleLoader(formElement);

    try {
        if (formElement === formEdit) {
            await submitEditProfileForm(formElement);
        } else if (formElement === formPlace) {
            await submitNewPlaceForm(formElement);
        } else if (formElement === formAvatar) {
            await submitNewAvatarForm(formElement);
        }
    } catch (error) {
        console.error('Ошибка при отправке формы:', error);
    } finally {
        toggleLoader(formElement);
    }
}

async function submitEditProfileForm(formElement) {
    try {
        const newName = nameInput.value;
        const newJobName = jobInput.value;
        await updateProfileData(newName, newJobName);
        profileTitle.textContent = newName;
        profileDescription.textContent = newJobName;
        formElement.reset();
        closeModal(formElement);
    } catch (error) {
        console.log(`Ошибка при отправке формы редактирования профиля: ${error}`);
    }
}

async function submitNewPlaceForm(formElement) {
    try {
        const name = placeNameInput.value;
        const imageUrl = linkInput.value;
        const responseData = await postNewCard(name, imageUrl);
        const newCard = createCard(responseData, true, { deleteCard: deleteCard, likeCard: likeCard, openImage: openImage });
        placesList.prepend(newCard);
        formElement.reset();
        closeModal(formElement);
    } catch (error) {
        console.log(`Ошибка при отправке формы создания нового места: ${error}`);
    }
}

async function submitNewAvatarForm(formElement) {
    try {
        const newAvatarUrl = avatarInput.value;
        const isValid = await imageUrlCheck(newAvatarUrl);
        if (isValid) {
            const responseData = await updateAvatar(newAvatarUrl);
            profileImage.src = responseData.avatar;
            formElement.reset();
            closeModal(formElement);
        } else {
            console.log('Указанный URL не является действительным изображением.');
        }
    } catch (error) {
        console.log(`Ошибка при проверке URL изображения: ${error}`);
    }
}

function deleteCardFromDOM(cardElement) {
    cardElement.remove();
}

function handleDeleteButtonClick(cardElement, cardId) {
    deletePopup.addEventListener('submit', async function (evt) {
        evt.preventDefault();
        try {
            await deleteCardFromServer(cardId);
            deleteCardFromDOM(cardElement);
            closeModal(deletePopup);
        } catch (error) {
            console.error(`Ошибка при удалении карточки: ${error}`);
        }
    });
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
  } else if (evt.target.classList.contains('profile__avatar-button')) {
    openModal(avatarPopup);
  }
});


formElements.forEach(form => {
    form.addEventListener('submit', function (evt) {
      handleFormSubmit(evt);

      if (form === formEdit) {
        closeModal(editPopup);
      } else if (form === formPlace) {
        closeModal(addPopup);
      } else if (form === formAvatar) {
        closeModal(avatarPopup);
      } else if (form === formDelete) {
          closeModal(deletePopup);
      }
    });
  });


enableValidation(validationConfig);


export { placesList, formElements, editPopup, addPopup, formPlace, formEdit, validationConfig, placeNameInput, avatarPopup, linkInput, formAvatar, avatarInput, deletePopup };

