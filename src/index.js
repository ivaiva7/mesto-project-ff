
// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

import './pages/index.css';
import {
    getProfileData,
    getInitialCards,
    updateProfileData,
    postNewCard,
    updateAvatar,
    imageUrlCheck,
    deleteCardFromServer
} from './api.js';
import { createCard, likeCard  } from './card.js';
import { openModal, closeModal, setCloseModalEventListener } from './modal.js';
import { clearValidation, enableValidation } from './validation.js';

const contentSection = document.querySelector(".content");
const places = contentSection.querySelector(".places");
const placesList = places.querySelector(".places__list");
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
}

const editLoader = editPopup.querySelector('.loader');
const submitEditButton = editPopup.querySelector('.popup__button');
const newCardLoader = addPopup.querySelector('.popup_type_new-card .loader');
const newCardSubmitButton = addPopup.querySelector('.popup__button');
const avatarLoader = avatarPopup.querySelector('.loader');
const avatarSubmitButton = avatarPopup.querySelector('.popup__button');
const profileEditButton= document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileAvatarButton = document.querySelector('.profile__avatar-button');

const profileDataPromise = getProfileData();
const cardsDataPromise = getInitialCards();
const confirmButton = document.querySelector('.popup__button-type-delete');
const deleteLoader = deletePopup.querySelector('.loader');
const popup = document.querySelector('.popup_type_image');
const popupImage = document.querySelector('.popup__image');
const popupCaption = document.querySelector('.popup__caption');
let currentCard;
let currentCardId;

Promise.all([profileDataPromise, cardsDataPromise])
    .then(([userData, cardsData]) => {
        const currentUserId = userData._id;

        profileTitle.textContent = userData.name;
        profileDescription.textContent = userData.about;
        profileImage.src = userData.avatar;
        profileImage.alt = userData.name;

        cardsData.forEach(card => {
            const isOwner = card.owner._id === currentUserId;
            const isLikedByCurrentUser = card.likes.some(like => like._id === currentUserId);
            const newCard = createCard(card, isOwner, { likeCard, openImage, openDeleteModal }, isLikedByCurrentUser );
            placesList.append(newCard);
        });
    })
    .catch(error => {
        console.log(`Ошибка при получении данных: ${error}`);
    });

function toggleLoader(loader, submitButton, showLoader) {
    loader.style.display = showLoader ? 'flex' : 'none';
    submitButton.style.display = showLoader ? 'none' : 'block';
}

async function submitEditProfileForm(formElement) {
    try {
        toggleLoader(editLoader, submitEditButton, true);
        const newName = nameInput.value;
        const newJobName = jobInput.value;
        await updateProfileData(newName, newJobName);
        profileTitle.textContent = newName;
        profileDescription.textContent = newJobName;
        formElement.reset();
        closeModal(editPopup);
    } catch (error) {
        console.log(`Ошибка при отправке формы редактирования профиля: ${error}`);
    } finally {
        toggleLoader(editLoader, submitEditButton, false);
    }
}

async function submitNewPlaceForm(formElement) {
    try {
        toggleLoader(newCardLoader, newCardSubmitButton, true);
        const name = placeNameInput.value;
        const link = linkInput.value;
        const responseData = await postNewCard( { name, link} );
        const newCard = createCard(responseData, true, { likeCard: likeCard, openImage: openImage, openDeleteModal: openDeleteModal }, responseData.isLiked);
        placesList.prepend(newCard);
        formElement.reset();
        closeModal(addPopup);
    } catch (error) {
        console.log(`Ошибка при отправке формы создания нового места: ${error}`);
    } finally {
        toggleLoader(newCardLoader, newCardSubmitButton, false);
    }
}

async function submitNewAvatarForm(formElement) {
    try {
        toggleLoader(avatarLoader, avatarSubmitButton, true);
        const newAvatarUrl = avatarInput.value;
        console.log('Проверка URL изображения:', newAvatarUrl);
        const isValid = await imageUrlCheck(newAvatarUrl);
        if (isValid) {
            const responseData = await updateAvatar(newAvatarUrl);
            profileImage.src = responseData.avatar;
            formElement.reset();
            closeModal(avatarPopup);
        } else {
            console.log('Указанный URL не является действительным изображением.');
        }
    } catch (error) {
        console.log(`Ошибка при проверке URL изображения: ${error}`);
    } finally {
        toggleLoader(avatarLoader, avatarSubmitButton, false);
    }
}

function openImage(imageSource, imageTitle) {
    if (popup && popupImage && popupCaption) {
        openModal(popup);
        popupImage.src = imageSource;
        popupCaption.textContent = imageTitle;
        popupImage.alt = imageTitle;
    }
}

function handleEditButtonClick() {
    nameInput.value = profileTitle.textContent;
    jobInput.value = profileDescription.textContent;
    clearValidation(formEdit, validationConfig);
    openModal(editPopup);
}

function handleAddButtonClick() {
    clearValidation(formPlace, validationConfig);
    placeNameInput.value = '';
    linkInput.value = '';
    openModal(addPopup);
}

function handleAvatarButtonClick() {
    clearValidation(formAvatar, validationConfig);
    avatarInput.value = '';
    openModal(avatarPopup);
}

profileEditButton.addEventListener("click", handleEditButtonClick);
profileAddButton.addEventListener("click", handleAddButtonClick);
profileAvatarButton.addEventListener("click", handleAvatarButtonClick);


formEdit.addEventListener('submit', function (evt) {
    submitEditProfileForm(formEdit);
});

formPlace.addEventListener('submit', function (evt) {
    submitNewPlaceForm(formPlace);
});

formAvatar.addEventListener('submit', function (evt) {
    submitNewAvatarForm(formAvatar);
});

function openDeleteModal(card, cardId) {
    currentCard = card;
    currentCardId = cardId;
    openModal(deletePopup);
}

async function handleDeleteCard() {
    try {
        toggleLoader(deleteLoader, confirmButton, true);
        await deleteCardFromServer(currentCardId);
        currentCard.remove();
        closeModal(deletePopup);
        console.log('Карточка успешно удалена с сервера');
    } catch (error) {
        console.error(`Ошибка при удалении карточки: ${error}`);
    } finally {
        toggleLoader(deleteLoader, confirmButton, false);
    }
}

confirmButton.addEventListener('click', handleDeleteCard);

setCloseModalEventListener(addPopup);
setCloseModalEventListener(editPopup);
setCloseModalEventListener(deletePopup);
setCloseModalEventListener(avatarPopup);
setCloseModalEventListener(popup);

enableValidation(formElements, validationConfig);


export { openDeleteModal }
