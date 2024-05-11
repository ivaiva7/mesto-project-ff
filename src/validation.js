import { formElements, formEdit } from './index.js';

const showInputError = (formElement, inputElement, errorMessage, validationConfig) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	inputElement.classList.add(validationConfig.inputErrorClass);
	const customErrorMessage = inputElement.validity.patternMismatch ? inputElement.dataset.errorMessage : '';
	errorElement.textContent = customErrorMessage || errorMessage;
	errorElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (formElement, inputElement, validationConfig) => {
	const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
	if (errorElement) {
		inputElement.classList.remove(validationConfig.inputErrorClass);
		errorElement.textContent = '';
		errorElement.classList.remove(validationConfig.errorClass);
	} else {
		console.log(`Ошибка: элемент ошибки не найден для input ${inputElement.id}`);
	}
};

const checkInputValidity = (formElement, inputElement, validationConfig) => {
	if (!inputElement.validity.valid) {
		showInputError(formElement, inputElement, inputElement.validationMessage, validationConfig);
	} else {
		hideInputError(formElement, inputElement, validationConfig);
	}
};

const hasInvalidInput = (inputList) => {
	return inputList.some((inputElement) => {
		return !inputElement.validity.valid;
	});
}

const toggleButtonState = (inputList, buttonElement, validationConfig) => {
	if (hasInvalidInput(inputList)) {
		buttonElement.classList.add(validationConfig.inactiveButtonClass);
		buttonElement.setAttribute('disabled', true);
	} else {
		buttonElement.classList.remove(validationConfig.inactiveButtonClass);
		buttonElement.removeAttribute('disabled');
	}
}

const setEventListeners = (formElement, validationConfig) => {
	const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
	const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
	toggleButtonState(inputList, buttonElement, validationConfig);
	inputList.forEach((inputElement) => {
		inputElement.addEventListener('input', function () {
			checkInputValidity(formElement, inputElement, validationConfig);
			toggleButtonState(inputList, buttonElement, validationConfig);
		});
	});
};


const enableValidation = (validationConfig) => {
	formElements.forEach((formElement) => {
		formElement.addEventListener('submit', function (evt) {
			evt.preventDefault();
		});
		setEventListeners(formElement, validationConfig);

	});
}

const clearValidation = (formElement, validationConfig) => {
	const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
	const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
	inputList.forEach((inputElement) => {
		hideInputError(formElement, inputElement, validationConfig);
		if (formElement !== formEdit) {
			inputElement.value = '' ;
		}
	});
	buttonElement.classList.add(validationConfig.inactiveButtonClass);
	buttonElement.setAttribute('disabled', true);
}



export { enableValidation, clearValidation };


