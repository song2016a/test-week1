document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const drawNumberEl = document.getElementById('draw-number');
    const countdownEl = document.getElementById('countdown');
    const lastDrawNumbersEl = document.getElementById('last-draw-numbers');
    const prize1El = document.getElementById('prize-1');
    const prize2El = document.getElementById('prize-2');
    const prize3El = document.getElementById('prize-3');
    const includeNumbersEl = document.getElementById('include-numbers');
    const excludeNumbersEl = document.getElementById('exclude-numbers');
    const generateBtn = document.getElementById('generate-btn');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const lottoSetsContainer = document.getElementById('lotto-generator-sets');
    const saveBtn = document.getElementById('save-btn');
    const checkWinBtn = document.getElementById('check-win-btn');
    const savedSetsDisplay = document.getElementById('saved-sets-display');
    const statsChartCanvas = document.getElementById('stats-chart');
    const mapEl = document.getElementById('map');

    // --- Global State ---
    let generatedSets = [];
    let savedSets = JSON.parse(localStorage.getItem('lottoSets')) || [];
    let map;
    // Placeholder data - In a real app, this would be fetched from an API
    let lastDrawData = {
        draw: 1130,
        numbers: [5, 11, 13, 19, 21, 33],
        bonus: 45,
        prizes: {
            first: 2556229688,
            second: 75740139,
            third: 1612250
        }
    };
     // Mock data for lottery stores
    const lottoStores = [
        { name: '대박 로또', lat: 37.5665, lng: 126.9780, firstPlace: true },
        { name: '행운 복권방', lat: 37.5650, lng: 126.9790, firstPlace: false },
        { name: '로또 명당', lat: 37.5680, lng: 126.9760, firstPlace: true },
        { name: '인생 역전', lat: 37.5660, lng: 126.9750, firstPlace: false }
    ];

    // --- LOTTERY DATA & LOGIC ---

    const getLottoColor = (num) => {
        if (num <= 10) return '#fbc400'; // 노랑
        if (num <= 20) return '#69c8f2'; // 파랑
        if (num <= 30) return '#ff7272'; // 빨강
        if (num <= 40) return '#aaa';    // 회색
        return '#b0d840';               // 녹색
    };

    function getCurrentDrawNumber() {
        const genesisDraw = { number: 1, date: new Date('2002-12-07T21:00:00') };
        const now = new Date();
        const weeksSince = Math.floor((now - genesisDraw.date) / (1000 * 60 * 60 * 24 * 7));
        return genesisDraw.number + weeksSince;
    }

    function updateCountdown() {
        const now = new Date();
        const nextDrawDate = new Date(now);
        const dayOfWeek = now.getDay(); // 0=Sun, 6=Sat
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
        nextDrawDate.setDate(now.getDate() + daysUntilSaturday);
        nextDrawDate.setHours(20, 45, 0, 0);

        if (now > nextDrawDate) {
            nextDrawDate.setDate(nextDrawDate.getDate() + 7);
        }

        const diff = nextDrawDate - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        countdownEl.innerHTML = `${d}일 ${h}시간 ${m}분 ${s}초`;
    }

    // --- UI RENDERING ---

    function createNumberSelector(container, type) {
        for (let i = 1; i <= 45; i++) {
            const numBtn = document.createElement('button');
            numBtn.textContent = i;
            numBtn.classList.add('num-btn');
            numBtn.dataset.number = i;
            numBtn.addEventListener('click', (e) => handleNumberSelection(e, type));
            container.appendChild(numBtn);
        }
    }

    function createLottoBall(number) {
        const ball = document.createElement('div');
        ball.classList.add('lotto-ball');
        ball.textContent = number;
        ball.style.backgroundColor = getLottoColor(number);
        return ball;
    }

    function displayNumbers(container, numbers) {
        container.innerHTML = '';
        numbers.forEach(num => container.appendChild(createLottoBall(num)));
    }

    function renderSavedSets() {
        savedSetsDisplay.innerHTML = '';
        if (savedSets.length === 0) {
            savedSetsDisplay.innerHTML = '<p>생성한 번호를 저장하고 다음 추첨일에 당첨 결과를 확인하세요!</p>';
            return;
        }
        savedSets.forEach((set, index) => {
            const setContainer = document.createElement('div');
            setContainer.classList.add('saved-set');
            
            const numbersDiv = document.createElement('div');
            numbersDiv.classList.add('lotto-numbers');
            displayNumbers(numbersDiv, set.numbers);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = '삭제';
            deleteBtn.classList.add('delete-set-btn');
            deleteBtn.addEventListener('click', () => {
                savedSets.splice(index, 1);
                localStorage.setItem('lottoSets', JSON.stringify(savedSets));
                renderSavedSets();
            });
            
            setContainer.appendChild(numbersDiv);
            setContainer.appendChild(deleteBtn);
            savedSetsDisplay.appendChild(setContainer);
        });
    }

    // --- GENERATION ---

    function generateLottoSet(include, exclude) {
        const numbers = new Set(include);
        const availableNumbers = Array.from({ length: 45 }, (_, i) => i + 1)
            .filter(n => !include.includes(n) && !exclude.includes(n));
            
        while (numbers.size < 6) {
            if (availableNumbers.length === 0) break;
            const randomIndex = Math.floor(Math.random() * availableNumbers.length);
            const chosen = availableNumbers.splice(randomIndex, 1)[0];
            numbers.add(chosen);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function handleGenerate() {
        const include = Array.from(includeNumbersEl.querySelectorAll('.selected')).map(btn => parseInt(btn.dataset.number));
        const exclude = Array.from(excludeNumbersEl.querySelectorAll('.selected')).map(btn => parseInt(btn.dataset.number));

        generatedSets = [];
        lottoSetsContainer.innerHTML = '';
        
        for (let i = 0; i < 5; i++) {
            const set = generateLottoSet(include, exclude);
            generatedSets.push(set);
            
            const setContainer = document.createElement('div');
            setContainer.classList.add('lotto-numbers', 'lotto-set');
            displayNumbers(setContainer, set);
            lottoSetsContainer.appendChild(setContainer);
        }
        
        saveBtn.disabled = false;
    }

    function handleNumberSelection(event, type) {
        const button = event.target;
        const number = parseInt(button.dataset.number);
        
        button.classList.toggle('selected');

        // Prevent selecting the same number as both include and exclude
        const otherType = type === 'include' ? 'exclude' : 'include';
        const otherSelector = (otherType === 'include' ? includeNumbersEl : excludeNumbersEl);
        const otherButton = otherSelector.querySelector(`[data-number="${number}"]`);
        if (otherButton && otherButton.classList.contains('selected')) {
            otherButton.classList.remove('selected');
        }

        // Validate include count
        const includeCount = includeNumbersEl.querySelectorAll('.selected').length;
        if (includeCount > 5) {
            alert('고정수는 5개까지만 선택할 수 있습니다.');
            button.classList.remove('selected');
        }
    }

    // --- ACTIONS ---

    function saveGeneratedSets() {
        if (generatedSets.length === 0) {
            alert('먼저 번호를 생성해주세요.');
            return;
        }
        savedSets.push(...generatedSets.map(set => ({ numbers: set })));
        localStorage.setItem('lottoSets', JSON.stringify(savedSets));
        renderSavedSets();
        alert('번호가 보관함에 저장되었습니다.');
    }

    function checkWinnings() {
        if (savedSets.length === 0) {
            alert('먼저 번호를 저장해주세요.');
            return;
        }
        
        const winningNumbers = lastDrawData.numbers;
        const bonusNumber = lastDrawData.bonus;

        savedSetsDisplay.querySelectorAll('.saved-set').forEach((setContainer, index) => {
            const numbers = savedSets[index].numbers;
            const matchCount = numbers.filter(num => winningNumbers.includes(num)).length;
            const bonusMatch = numbers.includes(bonusNumber);
            
            let rank = '낙첨';
            if (matchCount === 6) rank = '1등';
            else if (matchCount === 5 && bonusMatch) rank = '2등';
            else if (matchCount === 5) rank = '3등';
            else if (matchCount === 4) rank = '4등';
            else if (matchCount === 3) rank = '5등';

            const resultEl = document.createElement('p');
            resultEl.classList.add('win-result');
            resultEl.textContent = `결과: ${rank}`;
            if(rank !== '낙첨') resultEl.style.color = 'red';
            
            const oldResult = setContainer.querySelector('.win-result');
            if(oldResult) oldResult.remove();
            
            setContainer.appendChild(resultEl);
        });
    }

    // --- MAP ---
    function initMap() {
        // Default location (Seoul)
        map = L.map(mapEl).setView([37.5665, 126.9780], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Try to get user's location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                map.setView([userLat, userLng], 14);
                L.marker([userLat, userLng]).addTo(map)
                    .bindPopup('현재 위치')
                    .openPopup();
                addStoreMarkers();
            }, () => {
                // User denied location access or an error occurred
                addStoreMarkers();
            });
        } else {
            // Geolocation not supported by the browser
            addStoreMarkers();
        }
    }

    function addStoreMarkers() {
        const firstPlaceIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        });

        lottoStores.forEach(store => {
            const markerOptions = store.firstPlace ? { icon: firstPlaceIcon } : {};
            L.marker([store.lat, store.lng], markerOptions).addTo(map)
                .bindPopup(`<b>${store.name}</b><br>${store.firstPlace ? '🏆 1등 배출점' : '일반 판매점'}`);
        });
    }


    // --- MAIN STATS CHART ---
    const yearlyStats = { 1: 15, 2: 10, 3: 18, 4: 12, 5: 20, 6: 14, 7: 17, 8: 9, 9: 13, 10: 16, 11: 19, 12: 11, 13: 22, 14: 14, 15: 16, 16: 10, 17: 18, 18: 15, 19: 13, 20: 17, 21: 21, 22: 12, 23: 15, 24: 14, 25: 11, 26: 18, 27: 20, 28: 16, 29: 13, 30: 10, 31: 17, 32: 15, 33: 19, 34: 22, 35: 14, 36: 11, 37: 13, 38: 16, 39: 18, 40: 12, 41: 15, 42: 17, 43: 20, 44: 14, 45: 9 };
    function createMainStatsChart() {
        if (typeof Chart === 'undefined') return;
        const labels = Object.keys(yearlyStats);
        const data = Object.values(yearlyStats);
        const hotNumber = Object.keys(yearlyStats).reduce((a, b) => yearlyStats[a] > yearlyStats[b] ? a : b);
        const coldNumber = Object.keys(yearlyStats).reduce((a, b) => yearlyStats[a] < yearlyStats[b] ? a : b);

        const backgroundColors = labels.map(label => {
            if (label === hotNumber) return 'rgba(255, 99, 132, 0.8)'; // Hot
            if (label === coldNumber) return 'rgba(54, 162, 235, 0.8)'; // Cold
            return 'rgba(0, 123, 255, 0.6)';
        });
        
        new Chart(statsChartCanvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: '출현 횟수',
                    data: data,
                    backgroundColor: backgroundColors,
                }]
            },
            options: {
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Hot & Cold Numbers' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // --- Initial Setup ---
    function init() {
        createNumberSelector(includeNumbersEl, 'include');
        createNumberSelector(excludeNumbersEl, 'exclude');
        
        drawNumberEl.textContent = `제 ${getCurrentDrawNumber()}회`;
        displayNumbers(lastDrawNumbersEl, lastDrawData.numbers);
        
        prize1El.textContent = lastDrawData.prizes.first.toLocaleString();
        prize2El.textContent = lastDrawData.prizes.second.toLocaleString();
        prize3El.textContent = lastDrawData.prizes.third.toLocaleString();

        setInterval(updateCountdown, 1000);
        updateCountdown();
        
        renderSavedSets();
        createMainStatsChart();
        initMap();

        generateBtn.addEventListener('click', handleGenerate);
        saveBtn.addEventListener('click', saveGeneratedSets);
        checkWinBtn.addEventListener('click', checkWinnings);
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
        });
    }

    init();
});
