document.getElementById('generate-btn').addEventListener('click', () => {
    const numbers = generateLottoNumbers();
    displayNumbers(numbers);
});

function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    const lottoBalls = document.querySelectorAll('.lotto-ball');
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3'];
    lottoBalls.forEach((ball, index) => {
        ball.textContent = numbers[index];
        ball.style.backgroundColor = colors[index];
        ball.style.color = 'white';
    });
}
