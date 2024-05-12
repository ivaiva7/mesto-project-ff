const cohortId = 'wff-cohort-12';
const authToken = '9c458a61-cf94-4bbd-9611-c68472b0443e';

const getProfileData = () =>  {
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

const getInitialCards = () => {
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

const updateProfileData = (name, about) => {
	return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me`, {
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
}

const postNewCard = (name, imageUrl) => {
	return fetch(`https://nomoreparties.co/v1/${cohortId}/cards`, {
		method: 'POST',
		headers: {
			authorization: authToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: name,
			link: imageUrl
		})
	})
	.then(res => {
		if (!res.ok) {
			throw new Error(`Ошибка: ${res.status}`);
		}
		return res.json();
	})
		.catch(error => {
			console.log(`Ошибка при добавлении карточки: ${error}`);
		})
		}

const likeCardPut = (cardId) => {
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

const dislikeCard = (cardId) => {
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


const updateAvatar = (link) => {
	console.log("Обновление аватара, ссылка:", link);
	return fetch(`https://nomoreparties.co/v1/${cohortId}/users/me/avatar`, {
		method: 'PATCH',
		headers: {
			authorization: authToken,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			avatar: link
		})
	})
		.then(res => {
			if (!res.ok) {
				throw new Error(`Ошибка: ${res.status}`);
			}
			return res.json();
	})
}

async function imageUrlCheck(url) {
	try {
		const response = await fetch(url, { method: 'HEAD' });
		if (response.ok) {
			const contentType = response.headers.get('content-type');
			return contentType && contentType.startsWith('image/');
		}
		return false;
	} catch (error) {
		console.error('Ошибка при проверке URL изображения:', error);
		return false;
	}
}


export { getProfileData, getInitialCards, updateProfileData, postNewCard, likeCardPut, dislikeCard, deleteCardFromServer, updateAvatar, imageUrlCheck };


