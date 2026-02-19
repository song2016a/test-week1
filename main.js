document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const generateBtn = document.getElementById('generate-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const countdownEl = document.getElementById('countdown');
    const drawNumberEl = document.getElementById('draw-number');
    const lastDrawNumbersEl = document.getElementById('last-draw-numbers');
    const lottoSetsContainer = document.getElementById('lotto-generator-sets');

    // --- Initial Data (Placeholders) ---
    const lastDrawData = { draw: 1130, numbers: [5, 11, 13, 19, 21, 33], bonus: 45 };
    const yearlyStats = {
        1: 15, 2: 10, 3: 18, 4: 12, 5: 20, 6: 14, 7: 17, 8: 9, 9: 13, 10: 16,
        11: 19, 12: 11, 13: 22, 14: 14, 15: 16, 16: 10, 17: 18, 18: 15, 19: 13, 20: 17,
        21: 21, 22: 12, 23: 15, 24: 14, 25: 11, 26: 18, 27: 20, 28: 16, 29: 13, 30: 10,
        31: 17, 32: 15, 33: 19, 34: 22, 35: 14, 36: 11, 37: 13, 38: 16, 39: 18, 40: 12,
        41: 15, 42: 17, 43: 20, 44: 14, 45: 9
    };

    // --- Functions ---

    // Calculate current lotto draw number
    function getCurrentDrawNumber() {
        const genesisDraw = { number: 1, date: new Date('2002-12-07T21:00:00') };
        const now = new Date();
        const weeksSince = Math.floor((now - genesisDraw.date) / (1000 * 60 * 60 * 24 * 7));
        return genesisDraw.number + weeksSince;
    }

    // Update countdown timer
    function updateCountdown() {
        const now = new Date();
        const nextDrawDate = new Date(now);
        // Find next Saturday 8:45 PM KST
        nextDrawDate.setDate(now.getDate() + (6 - now.getDay() + 7) % 7);
        nextDrawDate.setHours(20, 45, 0, 0);

        const diff = nextDrawDate - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.innerHTML = `${d}d ${h}h ${m}m ${s}s`;
    }

    // Generate a single set of lotto numbers
    function generateLottoSet() {
        const numbers = new Set();
        while (numbers.size < 6) {
            numbers.add(Math.floor(Math.random() * 45) + 1);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // Create and display a lotto ball element
    function createLottoBall(number) {
        const ball = document.createElement('div');
        ball.classList.add('lotto-ball');
        ball.textContent = number;
        // Add color based on number range for visual distinction
        if (number <= 10) ball.style.backgroundColor = '#fbc400';
        else if (number <= 20) ball.style.backgroundColor = '#69c8f2';
        else if (number <= 30) ball.style.backgroundColor = '#ff7272';
        else if (number <= 40) ball.style.backgroundColor = '#aaa';
        else ball.style.backgroundColor = '#b0d840';
        return ball;
    }

    // Display winning numbers
    function displayWinningNumbers(container, numbers) {
        container.innerHTML = '';
        numbers.forEach(num => {
            container.appendChild(createLottoBall(num));
        });
    }

    // Generate and display 5 sets of numbers
    function generateAndDisplaySets() {
        lottoSetsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const set = generateLottoSet();
            const setContainer = document.createElement('div');
            setContainer.classList.add('lotto-numbers', 'lotto-set');
            displayWinningNumbers(setContainer, set);
            lottoSetsContainer.appendChild(setContainer);
        }
    }
    
    // Create statistics chart
    function createStatsChart() {
        const ctx = document.getElementById('stats-chart').getContext('2d');
        const labels = Object.keys(yearlyStats);
        const data = Object.values(yearlyStats);
        
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Appearances',
                    data: data,
                    backgroundColor: 'rgba(0, 123, 255, 0.6)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: document.body.classList.contains('dark-mode') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    // --- Event Listeners ---
    generateBtn.addEventListener('click', generateAndDisplaySets);
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Re-render chart with appropriate colors on theme change
        createStatsChart(); 
    });

    // --- Initial Page Load ---
    drawNumberEl.textContent = `제 ${getCurrentDrawNumber()}회`;
    displayWinningNumbers(lastDrawNumbersEl, lastDrawData.numbers);
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call
    generateAndDisplaySets(); // Initial generation
    createStatsChart();
});
