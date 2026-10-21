// ============================================================
// Модальное окно заказа + обработка формы
// Работает и на index.html (модалка + форма), и на order.html
// (только форма, без модалки), не падая, если элемента нет.
// ============================================================

// ---------- Модальное окно ----------

const orderDialog = document.getElementById('order-dialog');

// Все кнопки «Заказать» (только на index.html)
const orderButtons = document.querySelectorAll('.product-card__button');

// Все кнопки закрытия модалки (по data-атрибуту, а не по id)
const closeDialogButtons = document.querySelectorAll('[data-close-dialog]');

// Скрытое поле для выбранного товара (есть в модалке на index.html)
const selectedProductInput = document.getElementById('selected-product');

if (orderDialog && orderButtons.length) {
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const productName = button.dataset.product || '';

      if (selectedProductInput) {
        selectedProductInput.value = productName;
      }

      orderDialog.showModal();
    });
  });
}

if (orderDialog) {
  closeDialogButtons.forEach((button) => {
    button.addEventListener('click', () => {
      orderDialog.close();
    });
  });

  // Закрытие по клику на backdrop
  orderDialog.addEventListener('click', (event) => {
    if (event.target === orderDialog) {
      orderDialog.close();
    }
  });
}

// ---------- Обработка формы ----------

const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');

if (orderForm) {
  orderForm.addEventListener('submit', (event) => {
    // Отменяем настоящую отправку (backend пока не подключён)
    event.preventDefault();

    const formElements = Array.from(orderForm.elements);

    // Сбрасываем прошлые пометки ошибок
    formElements.forEach((element) => {
      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }
    });

    // Проверяем форму
    if (!orderForm.checkValidity()) {
      formElements.forEach((element) => {
        if (element.willValidate && !element.checkValidity()) {
          element.setAttribute('aria-invalid', 'true');
        }
      });

      orderForm.reportValidity();
      return;
    }

    // Успех
    if (successMessage) {
      successMessage.hidden = false;
    }

    orderForm.reset();

    // Если форма внутри модалки — закрываем её
    if (orderDialog && orderDialog.open) {
      orderDialog.close();
    }

    // Если форма на отдельной странице order.html —
    // прокручиваем к сообщению об успехе
    if (successMessage) {
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}