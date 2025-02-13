document.addEventListener("DOMContentLoaded", function(){
    const display = document.querySelector('#display')
    const history = document.querySelector('#history')

    const digits = document.querySelectorAll('.number')
    digits.forEach(button => {
        button.addEventListener('click', (e) => {
            const currentNumber = display.textContent
            const number = e.target.textContent
            display.textContent = currentNumber + number
        })
    })

    const operators = document.querySelectorAll('.operator')
    operators.forEach(button => {
        button.addEventListener('click', (e) => {
            const currentNumber = display.textContent
            const operator = e.target.textContent
            if (operator === 'CE') {
                display.textContent = ''
            } else if (operator === 'C') {
                display.textContent = ''
                history.textContent = ''
            }else if(operator === '⌫'){
                display.textContent = currentNumber.slice(0, -1)

            }
            else {
                history.textContent = currentNumber + operator
                display.textContent = ''
            }
        })
    })

    function calculations() {
        const currentNumber = display.textContent
        const previousNumber = history.textContent.slice(0, -1) 
        const operator = history.textContent.slice(-1)
        
        if (operator === '+') {
            display.textContent = parseFloat(previousNumber) + parseFloat(currentNumber)
        } else if (operator === '-') {
            display.textContent = parseFloat(previousNumber) - parseFloat(currentNumber)
        } else if (operator === '×') {  
            display.textContent = parseFloat(previousNumber) * parseFloat(currentNumber)
        } else if (operator === '÷') {  
            display.textContent = parseFloat(previousNumber) / parseFloat(currentNumber)
        } else if (operator === '%') {  
            display.textContent = parseFloat(previousNumber) % parseFloat(currentNumber)
        }
        history.textContent = ''
    }
    
    const equalsButton = document.getElementById('equals')
    equalsButton.addEventListener('click', calculations)

    const memoryRecallButton = document.getElementById('memory-recall')
    memoryRecallButton.addEventListener('click', () => {
        const previousNumber = history.textContent.slice(0, -1)
        display.textContent = previousNumber
    })

    const memorySaveButton = document.getElementById('memory-save')
    memorySaveButton.addEventListener('click', () => {
        const previousNumber = history.textContent.slice(0, -1)
        localStorage.setItem('memory', previousNumber)
    })
});