// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const contentSection = document.querySelector(".content");
const places = contentSection.querySelector(".places");
const placesList = places.querySelector(".places__list");

function createCard(item, { deleteCard }) {
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

  return cardElement;
}

initialCards.forEach(function (element) {
  const card = createCard(element, { deleteCard });
  placesList.append(card);
});

function deleteCard(cardElement) {
  cardElement.remove();
}
