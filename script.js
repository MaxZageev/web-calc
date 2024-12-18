let currentInput = "";
let result = null;

const output = document.getElementById("output");

function clearOutput() {
  currentInput = "";
  result = null;
  updateOutput("0");
}

function updateOutput(value) {
  output.textContent = value || "0";
}

function appendValue(value) {
  const lastChar = currentInput.slice(-1);

  // Предотвращаем ввод повторной точки
  const lastNumber = currentInput.split(/[\+\-\*\/]/).pop();
  if (value === "." && lastNumber.includes(".")) {
    return;
  }

  // Если перед точкой нет цифры, добавляем "0"
  if (value === "." && (currentInput === "" || /[\+\-\*\/]$/.test(lastChar))) {
    currentInput += "0";
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