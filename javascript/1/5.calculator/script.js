document.addEventListener("DOMContentLoaded", function(){
    const digits = document.querySelectorAll('.number')
    digits.forEach ( button => {
        button.addEventListener('click', (e) => {
            const display = document.querySelector('#display')
            const history = document.querySelector('#history')
            const currentNumber = display.textContent
            const number = parseInt(e.target.textContent)
            display.textContent = currentNumber + number
        })
    })
    const operators = document.querySelectorAll('.operator')
    operators.forEach ( button => {
        button.addEventListener('click', (e) => {
            const display = document.querySelector('#display')
            const history = document.querySelector('#history')
            const currentNumber = display.textContent
            const operator = e.target.textContent
            history.textContent = currentNumber + operator
            display.textContent = ''
        })
    })

    function calculations (value){
        const display = document.querySelector('#display')
        const history = document.querySelector('#history')
        const currentNumber = display.textContent
        const previousNumber = history.textContent.slice(0, -1) 
        const operator = history.textContent.slice(-1)
        
        if (operator === '+'){
            display.textContent = parseInt(previousNumber) + parseInt(currentNumber)
        } else if (operator === '-'){
            display.textContent = parseInt(previousNumber) - parseInt(currentNumber)
        } else if (operator === '×'){  
            display.textContent = parseInt(previousNumber) * parseInt(currentNumber)
        } else if (operator === '÷'){  
            display.textContent = parseInt(previousNumber) / parseInt(currentNumber)
        }
        else if (operator === '%'){  
            display.textContent = parseInt(previousNumber) % parseInt(currentNumber)
        }
    
        const memoryRecallButton = document.getElementById('memory-recall')
        memoryRecallButton.addEventListener('click', () => {
            const display = document.querySelector('#display')
            const history = document.querySelector('#history')
            const previousNumber = history.textContent.slice(0, -1)
            display.textContent = previousNumber
        })
        const memorySaveButton = document.getElementById('memory-save')
        memorySaveButton.addEventListener('click', () => {
            const history = document.querySelector('#history')
            const previousNumber = history.textContent.slice(0, -1)
            localStorage.setItem('memory', previousNumber)
        })
       
    }
    
    const equalsButton = document.getElementById('equals')
    equalsButton.addEventListener('click', () => {
        calculations();
    })
});