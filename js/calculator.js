let currentInput = '0';
let shouldResetDisplay = false;

const display = document.getElementById('display');

function updateDisplay() {
    display.textContent = currentInput;
}

function appendNumber(number) {
    if (shouldResetDisplay) {
        currentInput = '';
        shouldResetDisplay = false;
    }

    if (number === '.' && currentInput.includes('.')) {
        return;
    }

    if (currentInput === '0' && number !== '.') {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}

function appendOperator(operator) {
    const lastChar = currentInput.slice(-1);
    const operators = ['+', '-', '*', '/'];

    if (operators.includes(lastChar)) {
        currentInput = currentInput.slice(0, -1) + operator;
    } else {
        currentInput += operator;
    }

    shouldResetDisplay = false;
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLast() {
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

function calculate() {
    // falta el cierre de llave al final
    try {
        // Validar que la expresión sea segura
        if (!/^[0-9+\-*/. ]+$/.test(currentInput)) {
            throw new Error('Expresión inválida');
        }

        const result = Function('"use strict"; return (' + currentInput + ')')();

        if (!isFinite(result)) {
            throw new Error('Resultado no finito');
        }

        currentInput = String(result);
        shouldResetDisplay = true;
        updateDisplay();
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
        updateDisplay();
    }


// Soporte para teclado
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
    if (e.key === '.') appendNumber('.');
    if (['+', '-', '*', '/'].includes(e.key)) appendOperator(e.key);
    if (e.key === 'Enter' || e.key === '=') calculate();
    if (e.key === 'Backspace') deleteLast();
    if (e.key === 'Escape') clearDisplay();
});

updateDisplay();