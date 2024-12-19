let currentInput = "";
let result = null;

const output = document.getElementById("output");

function clearOutput() {
  currentInput = "";
  result = null;
  updateOutput("0");
}

function updateOutput(value) {
  const output = document.getElementById("output");

  // Устанавливаем значение в output
  output.textContent = value || "0";

  // Динамическое изменение размера шрифта
  const maxFontSize = 32; // Максимальный размер шрифта в пикселях
  const minFontSize = 16; // Минимальный размер шрифта в пикселях
  const maxCharacters = 10; // Количество символов до уменьшения

  if (value.length > maxCharacters) {
    const newSize = Math.max(
      minFontSize,
      maxFontSize - (value.length - maxCharacters) * 1.5
    );
    output.style.fontSize = `${newSize}px`;
  } else {
    output.style.fontSize = `${maxFontSize}px`;
  }

  // Прокрутка вправо (если текст выходит за пределы контейнера)
  output.scrollLeft = output.scrollWidth;
}

function appendValue(value) {
  const lastChar = currentInput.slice(-1);

  // Запрещаем ввод повторной точки
  const lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
  if (value === "." && lastNumber.includes(".")) {
    return;
  }

  // Если точка вводится в начале или после оператора, добавляем "0."
  if (value === "." && (!currentInput || lastChar.match(/[\+\-\*\/]/))) {
    value = "0.";
  }

  // Проверяем ввод нулей
  if (value === "0") {
    // Если строка пустая, запрещаем ввод нескольких начальных нулей
    if (currentInput === "" || currentInput.match(/[\+\-\*\/]$/)) {
      currentInput += value;
      updateOutput(currentInput);
      return;
    }

    // Если в текущем числе уже есть начальный ноль (без точки), запрещаем добавление
    if (!lastNumber.includes(".") && lastNumber === "0") {
      return;
    }
  }

  // Сброс результата при новом вводе
  if (result !== null) {
    currentInput = "";
    result = null;
  }

  currentInput += value;
  updateOutput(currentInput);
}

function appendOperator(operator) {
  const lastChar = currentInput.slice(-1);

  // Запрещаем ввод оператора в начале строки, кроме "-"
  if (!currentInput && operator !== "-") {
    return;
  }

  // Если первый символ "-", запрещаем его замену другим оператором
  if (currentInput.length === 1 && currentInput === "-" && operator !== "-") {
    return;
  }

  // Убираем повторяющиеся операторы
  if (lastChar.match(/[\+\-\*\/]/)) {
    currentInput = currentInput.slice(0, -1);
  }

  currentInput += operator;
  updateOutput(currentInput);
}

function validateInput(input) {
  // Удаляем все недопустимые повторяющиеся операторы (например, "++" или "--")
  return input.replace(/[\+\-\*\/]{2,}/g, (match) => match.slice(-1));
}

function calculate() {
  if (!currentInput) return;

  // Удаляем операторы в конце строки
  const sanitizedInput = currentInput.replace(/[\+\-\*\/]+$/, "");

  if (sanitizedInput) {
    try {
      const result = eval(sanitizedInput);
      currentInput = result.toString();
      updateOutput(currentInput);
    } catch (error) {
      updateOutput("Error");
      currentInput = "";
    }
  }
}

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key)) {
    appendValue(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    appendOperator(key);
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    currentInput = currentInput.trim().slice(0, -1);
    updateOutput(currentInput || "0");
  } else if (key === "Escape") {
    clearOutput();
  } else if (key === ".") {
    appendValue(".");
  }
});