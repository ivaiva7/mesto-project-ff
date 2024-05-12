
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
    deleteCardFromServer,
} from './api.js';
import { createCard, likeCard  } from './card.js';
import { openModal, closeModal } from './modal.js';
import { clearValidation, enableValidation } from './validation.js';

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
}

const editLoader = document.querySelector('.popup_type_edit .loader');
const editSubmitButton = document.querySelector('.popup_type_edit .popup__button');
const newCardLoader = document.querySelector('.popup_type_new-card .loader');
const newCardSubmitButton = document.querySelector('.popup_type_new-card .popup__button');
const avatarLoader = document.querySelector('.popup_type_avatar .loader');
const avatarSubmitButton = document.querySelector('.popup_type_avatar .popup__button');
const profileEditButton= document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const profileAvatarButton = document.querySelector('.profile__avatar-button');

const profileDataPromise = getProfileData();
const cardsDataPromise = getInitialCards();
const confirmButton = document.querySelector('.popup__button-type-delete');
const cancelButton = document.querySelector('.popup__close');
const deleteLoader = deletePopup.querySelector('.loader');
let popup = document.querySelector('.popup_type_image');
let popupImage = document.querySelector('.popup__image');
let popupCaption = document.querySelector('.popup__caption');

Promise.all([profileDataPromise, cardsDataPromise])
    .then(([userData, cardsData]) => {
        const currentUserId = userData._id;

        const nameElement = document.querySelector('.profile__title');
        const aboutElement = document.querySelector('.profile__description');
        const avatarElement = document.querySelector('.profile__image');

        nameElement.textContent = userData.name;
        aboutElement.textContent = userData.about;
        avatarElement.src = userData.avatar;
        avatarElement.alt = userData.name;

        cardsData.forEach(card => {
            const isOwner = card.owner._id === currentUserId;
            const newCard = createCard(card, isOwner, { likeCard, openImage, handleDeleteCard });
            placesList.append(newCard);
        });
    })
    .catch(error => {
        console.log(`Ошибка при получении данных: ${error}`);
    });




function toggleLoader(loaders, submitButtons, showLoader) {
    if (showLoader) {
        loaders.forEach(loader => {
            loader.style.display = 'flex';
        });
        submitButtons.forEach(submitButton => {
            submitButton.style.display = 'none';
        });
    } else {
        loaders.forEach(loader => {
            loader.style.display = 'none';
        });
        submitButtons.forEach(submitButton => {
            submitButton.style.display = 'block';
        });
    }
}


async function handleFormSubmit(evt) {
    evt.preventDefault();
    const formElement = evt.target;
    let loaders = [], submitButtons = [];

    if (formElement === formEdit) {
        loaders = [editLoader];
        submitButtons = [editSubmitButton];
    } else if (formElement === formPlace) {
        loaders = [newCardLoader];
        submitButtons = [newCardSubmitButton];
    } else if (formElement === formAvatar) {
        loaders = [avatarLoader];
        submitButtons = [avatarSubmitButton];
    }

    try {
        toggleLoader(loaders, submitButtons, true);

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
        toggleLoader(loaders, submitButtons, false);

        if (formElement === formEdit) {
            handleClosePopup(editPopup);
        } else if (formElement === formPlace) {
            handleClosePopup(addPopup);
        } else if (formElement === formAvatar) {
            handleClosePopup(avatarPopup);
        }
    }
}

async function updateFormFields(formData) {
    try {
        const { newName, newJobName, name, imageUrl, newAvatarUrl } = formData;

        if (newName !== undefined && newJobName !== undefined) {
            await updateProfileData(newName, newJobName);
            profileTitle.textContent = newName;
            profileDescription.textContent = newJobName;
        } else if (name !== undefined && imageUrl !== undefined) {
            const responseData = await postNewCard(name, imageUrl);
            const newCard = createCard(responseData, true, { likeCard: likeCard, openImage: openImage, handleDeleteCard: handleDeleteCard });
            placesList.prepend(newCard);
        } else if (newAvatarUrl !== undefined) {
            const isValid = await imageUrlCheck(newAvatarUrl);
            if (isValid) {
                const responseData = await updateAvatar(newAvatarUrl);
                profileImage.src = responseData.avatar;
            } else {
                console.log('Указанный URL не является действительным изображением.');
            }
        }
    } catch (error) {
        console.error('Ошибка при обновлении данных формы:', error);
    }
}


async function submitEditProfileForm(formElement) {
    try {
        const newName = nameInput.value;
        const newJobName = jobInput.value;
        await updateFormFields({ newName, newJobName });
        formElement.reset();
    } catch (error) {
        console.log(`Ошибка при отправке формы редактирования профиля: ${error}`);
    } finally {
        closeModal(formEdit);
    }
}

async function submitNewPlaceForm(formElement) {
    try {
        const name = placeNameInput.value;
        const imageUrl = linkInput.value;
        await updateFormFields({ name, imageUrl });
        formElement.reset();
    } catch (error) {
        console.log(`Ошибка при отправке формы создания нового места: ${error}`);
    } finally {
        closeModal(formPlace);
    }
}

async function submitNewAvatarForm(formElement) {
    try {
        const newAvatarUrl = avatarInput.value;
        await updateFormFields({ newAvatarUrl });
        formElement.reset();
    } catch (error) {
        console.log(`Ошибка при проверке URL изображения: ${error}`);
    } finally {
        closeModal(formPlace);
    }
}


function openImage(imageSource, imageTitle) {
    if (popup && popupImage && popupCaption) {
        openModal(popup);
        popupImage.src = imageSource;
        popupCaption.textContent = imageTitle;
    }
}

function handleClosePopup(popupElement) {
    if (popupElement === editPopup) {
        closeModal(editPopup)
        clearValidation(formEdit, validationConfig);
    } else if (popupElement === addPopup) {
        closeModal(addPopup);
        clearValidation(formPlace, validationConfig);
    } else if (popupElement === avatarPopup) {
        closeModal(avatarPopup);
        clearValidation(formAvatar, validationConfig);
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
    openModal(addPopup);
}

function handleAvatarButtonClick() {
    clearValidation(formAvatar, validationConfig);
    openModal(avatarPopup);
}

profileEditButton.addEventListener("click", handleEditButtonClick);
profileAddButton.addEventListener("click", handleAddButtonClick);
profileAvatarButton.addEventListener("click", handleAvatarButtonClick);


formEdit.addEventListener('submit', function (evt) {
    handleFormSubmit(evt);
    closeModal(editPopup);
});

formPlace.addEventListener('submit', function (evt) {
    handleFormSubmit(evt);
    closeModal(addPopup);
});

formAvatar.addEventListener('submit', function (evt) {
    handleFormSubmit(evt);
    closeModal(avatarPopup);
});


async function handleDeleteCard(cardElement, cardId) {
    try {
        confirmButton.addEventListener('click', async () => {
            try {
                toggleLoader([deleteLoader], [confirmButton, cancelButton], true);
                await deleteCardFromServer(cardId);
                cardElement.remove();
                closeModal(deletePopup);
                console.log('Карточка успешно удалена с сервера');
            } catch (error) {
                console.error(`Ошибка при удалении карточки: ${error}`);
            } finally {
                toggleLoader([deleteLoader], [confirmButton, cancelButton], false);
            }
        });
        cancelButton.addEventListener('click', () => {
            closeModal(deletePopup);
        });
        openModal(deletePopup);
    } catch (error) {
        console.error(`Ошибка при удалении карточки: ${error}`);
    }
}

function deleteCard(cardElement, cardId) {
    handleDeleteCard(cardElement, cardId);
}


enableValidation(validationConfig);


export { placesList, formElements, editPopup, addPopup, formPlace, formEdit, validationConfig, placeNameInput, avatarPopup, linkInput, formAvatar, avatarInput, deletePopup, deleteCard, handleDeleteCard }
