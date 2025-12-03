// ======================= 1. Поміняти контент блоків «x» та «y» =======================

const blockX = document.getElementById('x');
const blockY = document.getElementById('y');

if (blockX && blockY) {
    const tempContent = blockX.innerHTML;
    blockX.innerHTML = blockY.innerHTML;
    blockY.innerHTML = tempContent;
}



// ======================= 2. Площа кола, результат в кінці контенту блоку «3» =======================

const radius = 10; // радіус беремо зі змінної

function calculateCircleArea(r) {
    const area = Math.PI * Math.pow(r, 2);
    const block3 = document.getElementById('block3');

    if (block3) {
        const resultPara = document.createElement('p');
        resultPara.innerText = `Результат обчислення площі кола (R=${r}): ${area.toFixed(2)}`;
        resultPara.style.fontWeight = "bold";
        resultPara.style.borderTop = "1px solid #ccc";
        resultPara.style.paddingTop = "10px";
        block3.appendChild(resultPara);
    }
}

calculateCircleArea(radius);



// ======================= 3. Максимальні числа + cookies =======================

// Допоміжні функції для роботи з cookies
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length));
        }
    }
    return null;
}

function eraseCookie(name) {
    document.cookie = name + "=; Max-Age=-1; path=/";
}

// Функція обробки 10 чисел з форми в блоці 3
function processMaxNumbers() {
    const inputs = document.querySelectorAll('#maxNumberForm input[name="num"]');
    if (!inputs || inputs.length === 0) {
        alert("Форма з числами не знайдена.");
        return;
    }

    const numbers = [];
    inputs.forEach(input => {
        const val = Number(input.value);
        numbers.push(val);
    });

    // Знаходимо максимум
    let max = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
        if (!Number.isNaN(numbers[i]) && numbers[i] > max) {
            max = numbers[i];
        }
    }

    // Рахуємо, скільки разів він зустрічається
    let count = 0;
    for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] === max) {
            count++;
        }
    }

    const msg =
        "Введені числа: " + numbers.join(", ") + "\n" +
        "Максимальне число: " + max + "\n" +
        "Кількість максимальних чисел: " + count;

    alert(msg);

    // Зберігаємо результат у cookies
    const resultObj = { numbers, max, count };
    setCookie("maxNumbersResult", JSON.stringify(resultObj), 7);
}



// ======================= 4. Колір фону блоку «2» + localStorage =======================

// Перевірка коректності CSS-колору
function isValidColor(str) {
    const s = new Option().style;
    s.color = str;
    return s.color !== "";
}



// ======================= 3 + 4: логіка при завантаженні сторінки =======================

window.addEventListener("load", function () {
    // ---- завдання 3: обробка cookies і форми з числами ----
    const formContainer = document.getElementById("task-form-container");
    const cookieValue = getCookie("maxNumbersResult");

    if (cookieValue && formContainer) {
        // a) якщо cookie є – форму не показуємо
        formContainer.style.display = "none";

        let data;
        try {
            data = JSON.parse(cookieValue);
        } catch (e) {
            data = null;
        }

        let infoText = "У cookies збережені попередні дані.";
        if (data && typeof data === "object") {
            const nums = Array.isArray(data.numbers) ? data.numbers.join(", ") : "";
            infoText =
                "У cookies збережено результат попереднього обчислення:\n\n" +
                (nums ? "Числа: " + nums + "\n" : "") +
                "Максимальне число: " + data.max + "\n" +
                "Кількість максимальних чисел: " + data.count + "\n\n" +
                "Видалити дані з cookies?";
        } else {
            infoText += "\nВидалити їх?";
        }

        const shouldDelete = confirm(infoText);

        if (shouldDelete) {
            // б) видаляємо cookies і оновлюємо сторінку до початкового стану
            eraseCookie("maxNumbersResult");
            location.reload();
        } else {
            // в) просто попереджаємо, що дані залишилися
            alert(
                "Дані залишилися в cookies.\n" +
                "Щоб знову побачити форму введення чисел, " +
                "видаліть cookies і перезавантажте сторінку."
            );
        }
    }

    // ---- завдання 4: відновлення кольору і підписка на blur ----
    const block2 = document.getElementById("block2");
    const colorInput = document.getElementById("colorInput");

    if (block2 && colorInput) {
        const savedColor = localStorage.getItem("block2color");
        if (savedColor) {
            block2.style.backgroundColor = savedColor;
            colorInput.value = savedColor;
        }

        colorInput.addEventListener("blur", function () {
            const newColor = colorInput.value.trim();
            if (!newColor) return;

            // Перевірка, чи це валідний колір
            if (!isValidColor(newColor)) {
                alert("Некоректний колір! Наприклад: red, #ff0000, rgb(255,0,0)");
                return;
            }

            block2.style.backgroundColor = newColor;
            localStorage.setItem("block2color", newColor);
        });
    }
});



// ======================= 5. Редагування вмісту блоків 1..6 + localStorage =======================

(function () {
    const initialContents = {};   // початковий HTML кожного блока
    const currentContents = {};   // поточний HTML (може бути змінений)
    const STORAGE_PREFIX = "blockContent_";

    function getRandomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b})`;
    }

    // Додає кнопку скидання для блока
    function addResetButton(blockId, block, contentDiv, controlsDiv) {
        if (controlsDiv.querySelector(".block-reset-btn")) return;

        const resetBtn = document.createElement("button");
        resetBtn.type = "button";
        resetBtn.textContent = "Відновити початковий вміст";
        resetBtn.className = "block-reset-btn";
        resetBtn.style.marginTop = "5px";

        controlsDiv.appendChild(resetBtn);

        resetBtn.addEventListener("click", function () {
            // г) видалити новий вміст із localStorage
            localStorage.removeItem(STORAGE_PREFIX + blockId);

            // Повернути початковий HTML
            contentDiv.innerHTML = initialContents[blockId];
            currentContents[blockId] = initialContents[blockId];

            // Скинути фоновий колір блока
            block.style.backgroundColor = "";

            // Прибрати кнопку
            resetBtn.remove();
        });
    }

    // Налаштовуємо усі блоки block1..block6
    for (let i = 1; i <= 6; i++) {
        const blockId = "block" + i;
        const block = document.getElementById(blockId);
        if (!block) continue;

        // Запам'ятати початковий HTML (на момент виконання скрипта)
        initialContents[blockId] = block.innerHTML;

        // Якщо щось було збережено раніше — беремо це
        const saved = localStorage.getItem(STORAGE_PREFIX + blockId);
        currentContents[blockId] = saved || initialContents[blockId];

        // Перебудовуємо структуру блока:
        //  - .block-content — вміст
        //  - .block-controls — посилання + елементи форми
        block.innerHTML = "";

        const contentDiv = document.createElement("div");
        contentDiv.className = "block-content";
        contentDiv.innerHTML = currentContents[blockId];

        const controlsDiv = document.createElement("div");
        controlsDiv.className = "block-controls";
        controlsDiv.style.marginTop = "8px";

        const editLink = document.createElement("a");
        editLink.href = "#";
        editLink.textContent = "Редагувати блок " + i + " (подвійний клік)";
        editLink.className = "block-edit-link";

        // Щоб сторінка не «стрибала» при одиночному кліку
        editLink.addEventListener("click", function (e) {
            e.preventDefault();
        });

        controlsDiv.appendChild(editLink);
        block.appendChild(contentDiv);
        block.appendChild(controlsDiv);

        // Якщо вже є збережений вміст — додаємо кнопку відновлення
        if (saved) {
            addResetButton(blockId, block, contentDiv, controlsDiv);
        }

        // а) Подвійний клік по посиланню — показати textarea та кнопку "Зберегти"
        editLink.addEventListener("dblclick", function (e) {
            e.preventDefault();

            // Щоб не дублювати форму
            if (controlsDiv.querySelector("textarea.block-editor")) return;

            // б) У textarea підставляємо весь HTML-вміст блока
            const textarea = document.createElement("textarea");
            textarea.className = "block-editor";
            textarea.style.width = "100%";
            textarea.style.minHeight = "120px";
            textarea.value = currentContents[blockId];

            const saveBtn = document.createElement("button");
            saveBtn.type = "button";
            saveBtn.textContent = "Зберегти зміни";
            saveBtn.className = "block-save-btn";
            saveBtn.style.display = "block";
            saveBtn.style.marginTop = "5px";

            controlsDiv.appendChild(document.createElement("br"));
            controlsDiv.appendChild(textarea);
            controlsDiv.appendChild(saveBtn);

            // в) Зберігаємо змінений вміст і міняємо фон
            saveBtn.addEventListener("click", function () {
                const newHtml = textarea.value;

                currentContents[blockId] = newHtml;
                contentDiv.innerHTML = newHtml;

                // Зберегти у localStorage
                localStorage.setItem(STORAGE_PREFIX + blockId, newHtml);

                // Змінити фон блока на випадковий
                block.style.backgroundColor = getRandomColor();

                // Прибрати форму
                textarea.remove();
                saveBtn.remove();

                // г) Додати кнопку "Відновити початковий вміст"
                addResetButton(blockId, block, contentDiv, controlsDiv);
            });
        });
    }
})();
