
const cohortId = 'wff-cohort-12';
const authToken = '9c458a61-cf94-4bbd-9611-c68472b0443e';

function getProfileData()  {
	return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
		headers: {
			authorization: authToken
		}
	})
		.then(res => {
			if (!res.ok) {
				throw new Error(`Ошибка: ${res.status}`);
			}
			return res.json();
		})

}

function getInitialCards() {
	return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
		headers: {
			authorization: authToken
		}
	})
		.then(res => {
			if (!res.ok) {
				throw new Error(`Ошибка: ${res.status}`);
			}
			return res.json();
		})
}

function updateProfileData(name, about) {
	fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
		method: 'PATCH',
		headers: {
			authorization: authToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			about: about
		})
	})
		.then(res => {
			if (!res.ok) {
				throw new Error(`Ошибка: ${res.status}`);
			}
			return res.json();
		})
		.then(updatedUserData => {
			console.log(updatedUserData);
		})
		.catch(error => {
			console.log('Ошибка при обновлении данных профиля:', error);
		});
}

function postNewCard(name, link) {
	fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
		method: 'POST',
		headers: {
			authorization: authToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			link: link
		})
	})
	.then(res => {
		if (!res.ok) {
			throw new Error(`Ошибка: ${res.status}`);
		}
		return res.json();
	})
		.then(newCardData => {
			console.log(newCardData);
		})
		.catch(error => {
			console.log(`Ошибка при добавлении карточки: ${error}`);
		})
}

function likeCardPut(cardId) {
	return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`, {
		method: 'PUT',
		headers: {
			authorization: authToken
		}
	})
		.then(res => {
			if (!res.ok) {
				throw new Error(`Ошибка: ${res.status}`);
			}
			return res.json();
		});
}

function dislikeCard(cardId) {
	return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/likes/${cardId}`, {
		method: 'DELETE',
		headers: {
			authorization: authToken
		}
	})
		.then(res => {
			if (!res.ok) {
				throw new Error(`Ошибка: ${res.status}`);
			}
			return res.json();
		});
}

const deleteCardFromServer = (cardId) => {
	return fetch(`https://nomoreparties.co/v1/${cohortId}/cards/${cardId}`, {
		method: 'DELETE',
		headers: {
			authorization: authToken
		}
	})
		.then(res => {
			if (!res.ok) {
				throw new Error(`Ошибка: ${res.status}`);
			}
			return res.json();
		})
		.catch(error => {
			console.error(`Ошибка при удалении карточки: ${error}`);
			throw error;
		});
};

export { getProfileData, getInitialCards, updateProfileData, postNewCard, likeCardPut, dislikeCard, deleteCardFromServer };


