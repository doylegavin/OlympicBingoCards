    const activities = {
        easy: [ "Hug an Olympian",
            "Convince someone that you’re another nationality",
            " Irish dance w another country’s fan",
            "Miss train",
            "Miss ticketed event",
            "Photo with French police",
            "Photo with Olympian",
            "Get sunstroke",
            "Get an Irish person to buy you a drink",
            "Eat a snail/frogs leg",
            "Collect a souvenir",
            "Kiss a French person"
            ],
        medium: ["Convince someone you’re an Olympian",
            "Convince someone of the wrong rule",
            "Make up a fake country and convince someone you’re from there",
            "Get a French person to feed you a baguette/croissant",
            "Kiss an Olympian",
            "Get into an event without a ticket",
            "Miss flight",
            "Ruin someone’s proposal",
            "See Ireland win an event ",
            "Get escorted out by security",
            "Get some Olympic gear",
            "Mine in the street"
            ],
        hard: ["Ride an Olympian",
            "Go viral",
            "Start a Mexican wave",
            "Touch a medal",
            "Get on the big screen",
            "Get interviewed by Irish Media",
            "Get proposed to at the Eiffel Tower",
            "Fake proposal and get free drink out of"]
    };

    const bingoCard = document.getElementById('bingoCard');
    const seedInput = document.getElementById('seedInput');

    const getRandomActivities = (seed) => {
        const seededRandom = mulberry32(seed);
        let selectedActivities = [];
        selectedActivities.push(...shuffle(activities.easy, seededRandom).slice(0, 5));
        selectedActivities.push(...shuffle(activities.medium, seededRandom).slice(0, 4));
        selectedActivities.push(...shuffle(activities.hard, seededRandom).slice(0, 3));
        return shuffle(selectedActivities, seededRandom);
    }

    const shuffle = (array, randomFunc) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(randomFunc() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function mulberry32(a) {
        return function() {
            var t = a += 0x6D2B79F5;
            t = Math.imul(t ^ t >>> 15, t | 1);
            t ^= t + Math.imul(t ^ t >>> 7, t | 61);
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        }
    }

    const saveProgress = (seed, completedActivities) => {
        localStorage.setItem(`bingo_${seed}`, JSON.stringify(completedActivities));
        localStorage.setItem('lastSeed', seed);
    }

    const loadProgress = (seed) => {
        const saved = localStorage.getItem(`bingo_${seed}`);
        return saved ? JSON.parse(saved) : [];
    }
    const isBingoCardLoaded = () => {
        const isLoaded = localStorage.getItem("bingo-card") !== null;
        console.log({isLoaded})
        return isLoaded



    }

    const generateBingoCard = () => {
        if(isBingoCardLoaded()){
            //loadExisting
            bingoCard.innerHTML = localStorage.getItem("bingo-card")
        } else{

        
        const seed = seedInput.value.trim();
        if (!seed) {
            alert("Please enter a code.");
            return;
        }
    
        bingoCard.innerHTML = '';
        const activities = getRandomActivities(seed);
        const completedActivities = loadProgress(seed);
        activities.forEach((activity, index) => {
            const cell = document.createElement('div');
            cell.classList.add('bingo-cell');
            cell.textContent = activity;
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
    }
    //save bingo card
    localStorage.setItem("bingo-card",bingoCard.innerHTML)
    // Generate bingo card based on the last used seed or prompt for new seed
    const lastSeed = localStorage.getItem('lastSeed');
    if (lastSeed) {
        seedInput.value = lastSeed;
    }
}

