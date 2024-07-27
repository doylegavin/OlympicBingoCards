const activities = {
    easy: [
        "Hug an Olympian",
        "Convince someone that you're another nationality",
        "Irish dance w another country's fan",
        "Miss train",
        "Miss ticketed event"
    ],
    medium: [
        "Convince someone you're an Olympian",
        "Convince someone of the wrong rule",
        "Make up a fake country and convince someone you're from there",
        "Get a French person to feed you a baguette/croissant"
    ],
    hard: [
        "Ride an Olympian",
        "Go viral",
        "Start a Mexican wave"
    ]
};

const bingoCard = document.getElementById('bingoCard');
const seedInput = document.getElementById('seedInput');

function mulberry32(a) {
    return function() {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function shuffle(array, randomFunc) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(randomFunc() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function getRandomActivities(seed) {
    const seededRandom = mulberry32(seed);
    let selectedActivities = [];
    selectedActivities.push(...shuffle(activities.easy, seededRandom).slice(0, 5));
    selectedActivities.push(...shuffle(activities.medium, seededRandom).slice(0, 4));
    selectedActivities.push(...shuffle(activities.hard, seededRandom).slice(0, 3));
    return shuffle(selectedActivities, seededRandom);
}

function saveProgress(seed, completedActivities) {
    localStorage.setItem(`bingo_${seed}`, JSON.stringify(completedActivities));
    localStorage.setItem('lastSeed', seed);
}

function loadProgress(seed) {
    const saved = localStorage.getItem(`bingo_${seed}`);
    return saved ? JSON.parse(saved) : [];
}

function generateBingoCard() {
    const seed = seedInput.value.trim();
    if (!seed) {
        alert("Please enter a unique code.");
        return;
    }

    bingoCard.innerHTML = '';
    const selectedActivities = getRandomActivities(seed);
    const completedActivities = loadProgress(seed);

    selectedActivities.forEach((activity, index) => {
        const cell = document.createElement('div');
        cell.classList.add('bingo-cell');
        cell.textContent = activity;

        if (index < 5) cell.classList.add('easy');
        else if (index < 9) cell.classList.add('medium');
        else cell.classList.add('hard');

        if (completedActivities.includes(activity)) {
            cell.classList.add('completed');
        }

        cell.addEventListener('click', () => {
            cell.classList.toggle('completed');
            const isCompleted = cell.classList.contains('completed');
            if (isCompleted) {
                completedActivities.push(activity);
            } else {
                const activityIndex = completedActivities.indexOf(activity);
                if (activityIndex > -1) {
                    completedActivities.splice(activityIndex, 1);
                }
            }
            saveProgress(seed, completedActivities);
        });

        bingoCard.appendChild(cell);
    });

    localStorage.setItem("bingo-card", bingoCard.innerHTML);
}

// Load the last used seed if available
const lastSeed = localStorage.getItem('lastSeed');
if (lastSeed) {
    seedInput.value = lastSeed;
    generateBingoCard();
}
