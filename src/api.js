const config = {
	cohortId: 'wff-cohort-12',
	baseUrl:  `https://nomoreparties.co/v1/wff-cohort-12`,
	headers: {
		authorization: '9c458a61-cf94-4bbd-9611-c68472b0443e',
	}
};

const getResponse = (res) => {
	return res.ok ? res.json() : Promise.reject(`Ошибка ${res.status}`);
}
const getProfileData = () =>  {
	return fetch(`${config.baseUrl}/users/me`, {
		headers: config.headers,
	})
		.then(getResponse)

}

const getInitialCards = () => {
	return fetch(`${config.baseUrl}/cards`, {
		headers: config.headers,
	})
		.then(getResponse)
}

const updateProfileData = (name, about) => {
	return fetch(`${config.baseUrl}/users/me`, {
		method: 'PATCH',
		headers: {
			authorization: config.headers.authorization,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: name,
			about: about
		})
	})
		.then(getResponse)
}

const postNewCard = ( {name, link} ) => {
	return fetch(`${config.baseUrl}/cards`, {
		method: 'POST',
		headers: {
			authorization: config.headers.authorization,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
			link
		})
	})
	.then(getResponse)
		}

const likeCardPut = (cardId) => {
	return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: 'PUT',
		headers: config.headers,
	})
		.then(getResponse)
}

const dislikeCard = (cardId) => {
	return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
		method: 'DELETE',
		headers: config.headers,
	})
		.then(getResponse)
}

const deleteCardFromServer = (cardId) => {
	return fetch(`${config.baseUrl}/cards/${cardId}`, {
		method: 'DELETE',
		headers: config.headers,
	})
		.then(getResponse)
};


const updateAvatar = (link) => {
	console.log("Обновление аватара, ссылка:", link);
	return fetch(`${config.baseUrl}/users/me/avatar`, {
		method: 'PATCH',
		headers: {
			authorization: config.headers.authorization,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			avatar: link
		})
	})
		.then(getResponse)
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


