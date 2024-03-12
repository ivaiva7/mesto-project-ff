// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const contentSection = document.querySelector(".content");
const places = contentSection.querySelector(".places");
const placesList = places.querySelector(".places__list");
const cardTemplate = document.querySelector("#card-template");

function createCards() {
  initialCards.forEach(function (element) {
    const card = cardTemplate.content.cloneNode(true);
    card.querySelector(".card__image").src = element.link;
    card.querySelector(".card__title").textContent = element.name;

    placesList.append(card);
  });

  const deleteButtons = document.querySelectorAll(".card__delete-button");
  const deleteButtonsArr = Array.from(deleteButtons);
  deleteButtonsArr.forEach((element) => {
    element.addEventListener("click", handleClick);
  });
}

createCards();

function handleClick(event) {
  const card = event.target.parentNode;
  card.remove(event);
}
