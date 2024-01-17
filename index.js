document.getElementById('dataForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const textbox1Value = document.getElementById('textbox1').value;
    const textbox2Value = document.getElementById('textbox2').value;

    // Отправка данных на сервер
    sendDataToServer(textbox1Value, textbox2Value);
});

function sendDataToServer(textbox1Value, textbox2Value) {
    fetch('http://127.0.0.1:3000/save_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            textbox1: textbox1Value,
            textbox2: textbox2Value,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            displaySuccessMessage(data.success);
        } else {
            displayErrorMessage(data.error);
            displayPhoneNumberExamples();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        displayErrorMessage('Ошибка при сохранении данных');
    });
}

function displaySuccessMessage(message) {
    const successMessageElement = document.createElement('div');
    successMessageElement.classList.add('alert', 'alert-success', 'col-sm-4');
    successMessageElement.textContent = message;

    document.getElementById('dataForm').appendChild(successMessageElement);

    // Очищаем сообщение через 5 секунд
    setTimeout(() => {
        successMessageElement.remove();
    }, 5000);
}

function displayErrorMessage(message) {
    const errorMessageElement = document.createElement('div');
    errorMessageElement.classList.add('alert', 'alert-danger', 'col-sm-4');
    errorMessageElement.textContent = message;

    document.getElementById('dataForm').appendChild(errorMessageElement);

    // Очищаем сообщение через 5 секунд
    setTimeout(() => {
        errorMessageElement.remove();
    }, 5000);
}

function displayPhoneNumberExamples() {
    const phoneNumberExamplesElement = document.getElementById('phoneHelp');
    phoneNumberExamplesElement.textContent = 'Примеры: 1234567 (городской), 1234567890 (городской с кодом), 89999999999 (мобильный), +79999999999 (мобильный с плюсом)';

    // Очищаем примеры через 5 секунд
    setTimeout(() => {
        phoneNumberExamplesElement.textContent = 'Пример: 1234567890';
    }, 5000);
}