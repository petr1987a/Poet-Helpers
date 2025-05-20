// Добавляем в начало файла
const STRICTNESS_LEVELS = {
    dark: {
        yellowDeviation: 1,    // Жёлтый при отклонении на 1 слог
        redDeviation: 2,      // Красный при отклонении на 2 слога
        yellowThreshold: 1,   // Всего 1 предупреждение для жёлтого
        redThreshold: 1       // 1 ошибка для красного
    },
    light: {
        yellowDeviation: 4,   // Жёлтый только при отклонении на 2 слога
        redDeviation: 6,      // Красный при отклонении на 3 слога
        yellowThreshold: 6,   // Нужно 3 предупреждения для жёлтого
        redThreshold: 4       // 2 ошибки для красного
    }
};
// --- Основные элементы ---
const textArea = document.getElementById('inputText');
const countButton = document.getElementById('countButton');
const resultDiv = document.getElementById('result');
const clearButton = document.getElementById('clearButton');
const saveButton = document.getElementById('saveButton');
const savedPoemsList = document.getElementById('savedPoemsList');
const lightRed = document.getElementById('lightRed');
const lightYellow = document.getElementById('lightYellow');
const lightGreen = document.getElementById('lightGreen');
const trafficLightCommentDiv = document.getElementById('trafficLightComment');
const searchWordInput = document.getElementById('searchWordInput');
const searchButtonsContainer = document.querySelector('#dictionaryHelper .search-buttons-container');
const mainPageTitleElement = document.getElementById('mainPageTitle'); // Добавлено для заголовка

const vowels = "аеёиоуыэюяАЕЁИОУЫЭЮЯ"; // Добавил заглавные для упрощения, хотя countSyllablesInLine использует toLowerCase()
const initialResultText = "Здесь будет результат...";

// --- Комментарии для светофора ---
const comments = {
    dark: {
        green: [
            "Допущено к публикации. Пока что. 📄✅", 
            "Робот-надзиратель зевнул. Скучное совершенство. 🤖💤",
            "Ритм как строевой шаг дронов. Тоска. 💂♂️💀",
            "Технически безупречно... Как ваш счёт в банке. 💳⚰️",
            "Алгоритм одобряет. Людям бы так не скучать. 📊🤖",
            "Годится для учебника по выживанию в матрице. 📚🔗"
        ],
        yellow: [
            "Ритм споткнулся о баг! 🐞💥 Срочно патч!",
            "Строки пьяны. Отправьте на детоксикацию! 🍷🚫",
            "Метроном в истерике: '11101000!' 💢🤯",
            "Словно робот с разряженной батареей. 🔋😴",
            "Ритмический вирус обнаружен! 🦠💻 Лечение: перезапись.",
            "Ошибка 404: Гармония не найдена. ❌🔍",
            "Это не баг, это фича... Но лучше исправьте. 🐜✨"
        ],
        red: [
            "Уничтожить. Стереть. Забыть. ☠️🔥 (Шучу... Или нет)",
            "Ритм отправился в цифровое забвение. 💀⚰️",
            "Поздравляю! Вы изобрели анти-поэзию. 🏆☢️",
            "Серверы плачут кровавыми слезами. 😭🔪 (Метафорически)",
            "Аварийное отключение. Стихи слишком опасны. 🚨⚠️",
            "Код красный: СЛОГОВЫЙ АПОКАЛИПСИС. 💥🌋",
            "Даже ИИ подаёт на увольнение. 🤖📝"
        ],
        form_detected_green: [
            "Форма есть. Душа продана дьяволу. 😈📜",
            "Каркас одобрен. Теперь добавьте плоть и кровь. 💀💉",
            "Скелет собран. Где нервная система? 🧠⚡",
            "Шаблон выполнен. Бонус: 5₿ в кошелёк. 💰🔗"
        ],
        form_detected_yellow: [
            "Форма держится на кофе и проклятиях. ☕🔮",
            "Архитектура есть. Фундамент — как у ИТ-стартапа. 🏗️💸",
            "Контур угадывается. Детали — как в Terms of Service. 📑👀",
            "Схема собрана. Провода искрят адским огнём. 🔥👹"
        ],
        default: [
            "Добро пожаловать в цифровой ад. Ваши стихи? 🔥💾",
            "Тёмная сторона силы ждёт ваших опытов. 🌑⚡",
            "Здесь стихи получают NFT-сертификат подлинности. 🖼️💎",
            "Введите пароль: •••• (подсказка: это 'хаос') 🔐👾"
        ]
    },
    light: {
        green: ["Прекрасный ритм! 🌸", "Муза улыбается! 😊", "Идеально! Продолжайте творить! ✨"],
        yellow: ["Можно лучше, но уже неплохо 🌼", "Маленькие огрехи, но душа есть! 💛", "Почти получилось! Попробуйте ещё раз 🌈"],
        red: ["Ой, что-то разладилось... 🌧️", "Похоже, ритм заблудился 🐾", "Давайте попробуем ещё разок? 🌱"],
        form_detected_green: ["Форма и душа в гармонии! 🦋"],
        form_detected_yellow: ["Красивая форма, чуть-чуть подправить 🌻"],
        default: ["Светлый режим. Творите с удовольствием! ☀️"]
    }
};

const PLACEHOLDERS = {
    textarea: {
        dark: [
            "Твои мрачные строки ждут... ",
            "Готовься к ритмическому апокалипсису...",
            "Слова должны гореть в аду плохого ритма...",
            "Строки-зомби ищут мозги...",
            "Слова должны танцевать на краю бездны...",
            "Здесь рождаются стихи-оборотни...",
            "Чернила из сердца демона...",
            "Строчки, от которых дрожит тьма..."
        ],
        light: [
            "Начни писать солнечные стихи...",
            "Лепестки слов ждут своего цветка...",
            "Строки должны пахнуть свежестью...",
            "Пиши, будто рисуешь радугу...️",
            "Слова-бабочки ждут своего полёта...",
            "Строки из облачной пряжи...",
            "Рифмы, как капли росы...",
            "Стихи, которые обнимет солнце...",
            "Слова-пушинки из крыльев фей...",
            "Пиши медом, а не кровью..."
        ]
    },
    search: {
        dark: [
            "Ищи смысл во тьме... ️",
            "Анализ слов в стиле ноктюрн ",
            "Что скрывает теневая лексика? "
        ],
        light: [
            "Поиск светлых смыслов ",
            "Слово как лучик вдохновения ",
            "Лингвистический детектив "
        ]
    }
};

// --- Динамическое название ---
const dynamicTitles = {
    dark: ["Терминатор Свободного Стиха 🤖🔫", "Укротитель Слогов 😈", "BDSM Светофорчик🦯", "Злой Светофорчик🚦😈", "Камертон Сердитой Музы 😡🎵", "Ваш Личный Слого-Сомелье 🍷", "Слоговой Сканер 'Око Поэта' 👁️", "Слого-Мясорубка ⚙️🥩",
        "Вердикт Ритма: Без Апелляций! ⚖️💥", "Поэтический Полиграф™ 🤥", "Светофор Судного Дня (для Стихов)", "Экзекутор Гармонии 💀🎼", "Диспетчер Слоговых Катастроф 🚨", "Ритмический Дефибриллятор ⚡💔", "Анализатор 'Чёрная Метка' 🏴‍☠️📜",
        "Счётчик Грехов... то есть, Слогов 🎰", "Машина Боли для Плохих Стихов 😩", "Кибер-Цензор Рифмы 🤖🚫", "Нейро-Инквизитор Поэзии 🔥", "Слого-Детектор Лжи 🕵️‍"],
    light: ["⚪ Добрый Светофорчик", "🌞 Стихотворный Рассвет", "🌞 Стихотворный Садовник", "🦋 Муза в Полете", "🌈 Волшебный Слого-Дирижёр", "🍃 Слоговой Ветерок",
        "🧚♂️ Фея Гармонии", "📚 Поэтический Библиотекарь", "🎈 Воздушный Рифмоплёт", "🌻 Солнечный Счётчик", "🕊️ Голубь Мира (для Стихов)", "🎠 Карусель Слогов", "🐇 Поэтический Кролик", "🧁 Слого-Пекарь", "🤖 Робот-Няня (для Стихов)"],
    base: ["НейроСлогоМетр 🤖", "Слого-Магия ✨", "Это НЕ просто Счётчик Слогов 😉", "Силлабо-Квантовый Анализатор v0.3 ⚛️", "СЛОГоворот Событий в Стихе! 🌪️", "Мастерская Ритма 🛠️", "Не Считай Ворон – Считай Слоги! 👀", "Доктор Слог: Приём по Записи! 🩺"]
};


// --- Вспомогательные функции ---
function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function getRandomElement(arr) {
    if (!arr || arr.length === 0) return "";
    return arr[Math.floor(Math.random() * arr.length)];
}

function resetTrafficLightsAndComment() {
    lightRed.classList.remove('active');
    lightYellow.classList.remove('active');
    lightGreen.classList.remove('active');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    trafficLightCommentDiv.textContent = getRandomElement(
        isDarkTheme ? comments.dark.default : comments.light.default
    );
}

// --- Подсчёт слогов в строках ---
function countSyllablesInLine(line) {
    const lowerLine = line.toLowerCase();
    let syllableCount = 0;
    for (let char of lowerLine) {
        if (vowels.includes(char)) syllableCount++;
    }
    // Минимум 1 слог для непустых строк без гласных, но с символами.
    // Если строка состоит только из пробелов, trim() сделает её пустой, length будет 0, вернётся 0.
    // Если есть символы, но нет гласных, то length > 0, вернётся 1.
    return syllableCount || (line.trim().length > 0 ? 1 : 0);
}

// --- Определения силлабических форм/паттернов ---
const syllabicForms = {
    hokku: {
        name: "Хокку (Хайку)",
        description: "Японское трехстишие со структурой слогов 5-7-5.",
        check: function(syllableCounts) {
            return syllableCounts.length === 3 && arraysEqual(syllableCounts, [5, 7, 5]);
        }
    },
    tanka: {
        name: "Танка",
        description: "Японская пятистишная форма со структурой слогов 5-7-5-7-7.",
        check: function(syllableCounts) {
            return syllableCounts.length === 5 && arraysEqual(syllableCounts, [5, 7, 5, 7, 7]);
        }
    },
    cinquain_crapsey: {
        name: "Кинкейн (Аделаиды Крэпси)",
        description: "Пятистишие со структурой слогов 2-4-6-8-2.",
        check: function(syllableCounts) {
            return syllableCounts.length === 5 && arraysEqual(syllableCounts, [2, 4, 6, 8, 2]);
        }
    },
    limerick_syllabic: {
        name: "Лимерик (силлабическая структура)",
        description: "Пятистишие, часто со структурой слогов A-A-B-B-A (например, 8-8-5-5-8). Проверяется примерная структура.",
        check: function(syllableCounts) {
            if (syllableCounts.length !== 5) return false;
            // Проверяем, что 1, 2, 5 строки имеют примерно одинаковое кол-во слогов (S1)
            // и 3, 4 строки имеют примерно одинаковое кол-во слогов (S2), и S1 != S2
            const s1_candidate = syllableCounts[0];
            const s2_candidate = syllableCounts[2];
            if (s1_candidate === s2_candidate) return false; // Типично для лимерика S1 > S2

            return (syllableCounts[1] >= s1_candidate -1 && syllableCounts[1] <= s1_candidate +1) && // строки 1 и 2 похожи
                   (syllableCounts[4] >= s1_candidate -1 && syllableCounts[4] <= s1_candidate +1) && // строки 1 и 5 похожи
                   (syllableCounts[3] >= s2_candidate -1 && syllableCounts[3] <= s2_candidate +1);  // строки 3 и 4 похожи
        }
    },
    sonnet_syllabic_uniform: {
        name: "Сонет (14 строк, равномерные слоги)",
        description: "14 строк, где большинство строк имеют одинаковое количество слогов (например, 9-11).",
        check: function(syllableCounts) {
            if (syllableCounts.length !== 14) return false;
            const dominantCount = getDominantSyllableCount(syllableCounts);
            if (dominantCount === null || dominantCount < 8 || dominantCount > 12) return false; // Типичные размеры для сонета
            let matchCount = 0;
            for (let count of syllableCounts) {
                if (count >= dominantCount - 1 && count <= dominantCount + 1) {
                    matchCount++;
                }
            }
            return matchCount >= 11; // Хотя бы 11 из 14 строк должны соответствовать
        }
    },
    ballad_meter_syllabic: {
        name: "Балладный метр (силлабический)",
        description: "Строфы с чередованием строк 8-6-8-6 слогов.",
        check: function(syllableCounts) {
            if (syllableCounts.length === 0 || syllableCounts.length % 4 !== 0) return false;
            for (let i = 0; i < syllableCounts.length; i += 4) {
                if (syllableCounts[i] < 7 || syllableCounts[i] > 9) return false; // ~8
                if (syllableCounts[i+1] < 5 || syllableCounts[i+1] > 7) return false; // ~6
                if (syllableCounts[i+2] < 7 || syllableCounts[i+2] > 9) return false; // ~8
                if (syllableCounts[i+3] < 5 || syllableCounts[i+3] > 7) return false; // ~6
            }
            return true;
        }
    },
    triolet_syllabic: {
        name: "Триолет (силлабическая структура)",
        description: "Восьмистишие. Строки 1,4,7 должны иметь одинаковое кол-во слогов. Строки 2,8 - одинаковое. Часто все 8 строк имеют равное кол-во слогов.",
        check: function(syllableCounts) {
            if (syllableCounts.length !== 8) return false;
            const s1 = syllableCounts[0];
            const s2 = syllableCounts[1];
            // Проверка ключевых строк на равенство слогов
            if (!(syllableCounts[3] === s1 && syllableCounts[6] === s1)) return false;
            if (!(syllableCounts[7] === s2)) return false;
            // Опционально: часто все строки одинаковы
            // let allSame = true;
            // for (let count of syllableCounts) { if (count !== s1) allSame = false; break; }
            // if (allSame) return true; // Если все одинаковы, то подходит
            return true; // Достаточно проверки ключевых строк для силлабической структуры
        }
    },
    // Общие паттерны
    uniform_poem: {
        name: "Равномерный стих",
        description: "Все строки в стихотворении имеют одинаковое количество слогов.",
        findAndCheck: function(syllableCounts) {
            if (syllableCounts.length < 2) return null;
            const firstCount = syllableCounts[0];
            if (firstCount === 0) return null; // Не считаем стих из пустых строк
            for (let i = 1; i < syllableCounts.length; i++) {
                if (syllableCounts[i] !== firstCount) return null;
            }
            return {
                name: `Равномерный стих (${syllableCounts.length} строк по ${firstCount} слогов)`,
                details: `Все ${syllableCounts.length} строки содержат по ${firstCount} слогов.`
            };
        }
    },
    repeating_stanza_pattern: {
        name: "Повторяющийся строфический паттерн",
        description: "Стихотворение состоит из строф с одинаковым силлабическим рисунком.",
        findAndCheck: function(syllableCounts) {
            if (syllableCounts.length < 2) return null;
            // Пробуем размеры строф от 2 до половины длины стихотворения
            for (let stanzaLen = 2; stanzaLen <= Math.floor(syllableCounts.length / 2); stanzaLen++) {
                if (syllableCounts.length % stanzaLen === 0) { // Длина стиха кратна длине строфы
                    const pattern = syllableCounts.slice(0, stanzaLen);
                    let matches = true;
                    for (let i = stanzaLen; i < syllableCounts.length; i += stanzaLen) {
                        const currentSubArray = syllableCounts.slice(i, i + stanzaLen);
                        if (!arraysEqual(pattern, currentSubArray)) {
                            matches = false;
                            break;
                        }
                    }
                    if (matches) {
                        return {
                            name: `Повторяющийся ${stanzaLen}-стишный паттерн: [${pattern.join('-')}]`,
                            details: `Стихотворение состоит из ${syllableCounts.length / stanzaLen} строф с силлабическим рисунком [${pattern.join('-')}].`
                        };
                    }
                }
            }
            return null;
        }
    }
};

// --- Анализ текста и силлабических паттернов ---
function processAndAnalyzeSyllabicPatterns() {
    const fullText = textArea.value;
    resetTrafficLightsAndComment();

    if (!fullText.trim()) {
        resultDiv.innerHTML = "Поле ввода девственно чисто...";
        return;
    }

    const lines = fullText.split('\n');
    let resultsHTML = "";
    const originalLinesWithSyllables = []; // Сохраняем оригинальные строки и их слоги

    lines.forEach(line => {
        const syllableCount = countSyllablesInLine(line);
        originalLinesWithSyllables.push({ text: line, syllables: syllableCount });
    });

    // Собираем только количества слогов из непустых строк для анализа паттернов
    const syllableCountsForPatternAnalysis = originalLinesWithSyllables
        .filter(item => item.text.trim() !== "" || item.syllables > 0) // Учитываем строки, где countSyllablesInLine вернул >0 даже если trim пустой (напр. только цифры)
        .map(item => item.syllables);


    // Отображение слогов по строкам
    originalLinesWithSyllables.forEach(item => {
        if (item.text.trim() === "" && item.syllables === 0) { // Пропускаем полностью пустые строки в выводе, но сохраняем <br> для структуры
             resultsHTML += "<br>";
        } else {
            resultsHTML += `${item.text} <strong class="syllable-count">${item.syllables}</strong><br>`;
        }
    });
    resultDiv.innerHTML = resultsHTML;

    // Анализ паттернов
    let detectedFormsOutput = "";
    let formsFoundDetails = []; // Собираем детали найденных форм

    // Сначала проверяем более общие паттерны, которые сами себя описывают (findAndCheck)
    for (const formKey in syllabicForms) {
        const form = syllabicForms[formKey];
        if (typeof form.findAndCheck === 'function') {
            const foundPattern = form.findAndCheck(syllableCountsForPatternAnalysis);
            if (foundPattern) {
                formsFoundDetails.push(`<li><b>${foundPattern.name}</b>: ${foundPattern.details || form.description}</li>`);
            }
        }
    }
    // Затем проверяем конкретные формы (check)
    for (const formKey in syllabicForms) {
        const form = syllabicForms[formKey];
        if (typeof form.check === 'function') {
            if (form.check(syllableCountsForPatternAnalysis)) {
                // Избегаем дублирования, если findAndCheck уже нашел что-то похожее (например, Хокку - это частный случай repeating_stanza_pattern с одной "строфой")
                // Это очень грубая проверка на дублирование.
                if (!formsFoundDetails.some(detail => detail.toLowerCase().includes(form.name.toLowerCase().split('(')[0].trim()))) {
                     formsFoundDetails.push(`<li><b>${form.name}</b>: ${form.description}</li>`);
                }
            }
        }
    }


    if (formsFoundDetails.length > 0) {
        detectedFormsOutput = "<h3>Обнаруженные силлабические формы/паттерны:</h3><ul>" + formsFoundDetails.join("") + "</ul>";
    } else {
        detectedFormsOutput = "<h3>Обнаруженные силлабические формы/паттерны:</h3><ul><li>Конкретные силлабические формы не распознаны.</li></ul>";
    }

    resultDiv.innerHTML += detectedFormsOutput;

    // Обновление светофора
    updateTrafficLight(syllableCountsForPatternAnalysis, formsFoundDetails.length > 0);
}


function updateTrafficLight(syllableCounts, formDetected = false) {
    if (syllableCounts.length === 0) {
        resetTrafficLightsAndComment();
        return;
    }

    // Определяем текущий уровень строгости
    const isDarkTheme = document.body.classList.contains('dark-theme');
    const strictness = isDarkTheme ? STRICTNESS_LEVELS.dark : STRICTNESS_LEVELS.light;
    const commentsSet = isDarkTheme ? comments.dark : comments.light;

    const dominantCount = getDominantSyllableCount(syllableCounts);
    let yellowWarnings = 0, 
        redAlerts = 0;

    // Анализ отклонений с учётом темы
    if (dominantCount === null && syllableCounts.length > 1) {
        redAlerts = syllableCounts.length;
    } else if (dominantCount !== null) {
        for (let count of syllableCounts) {
            const deviation = Math.abs(count - dominantCount);
            if (deviation >= strictness.redDeviation) {
                redAlerts++;
            } else if (deviation >= strictness.yellowDeviation) {
                yellowWarnings++;
            }
        }
    }

    // Пороги срабатывания для тем
    const redThreshold = strictness.redThreshold;
    const yellowThreshold = strictness.yellowThreshold;

    // Логика определения цвета
    if (redAlerts >= redThreshold) {
        lightRed.classList.add('active');
        trafficLightCommentDiv.textContent = getRandomElement(commentsSet.red);
    } else if (yellowWarnings >= yellowThreshold) {
        lightYellow.classList.add('active');
        trafficLightCommentDiv.textContent = getRandomElement(formDetected ? commentsSet.form_detected_yellow : commentsSet.yellow);
    } else {
        lightGreen.classList.add('active');
        trafficLightCommentDiv.textContent = getRandomElement(formDetected ? commentsSet.form_detected_green : commentsSet.green);
    }
}


// --- Получение доминирующего числа слогов ---
function getDominantSyllableCount(syllableCounts) {
    if (!syllableCounts || syllableCounts.length === 0) return null;
    if (syllableCounts.length === 1) return syllableCounts[0];

    const countsMap = new Map();
    let maxFreq = 0;
    let dominant = null;

    for (let count of syllableCounts) {
        if (count === 0 && syllableCounts.length > 1) continue; // Не считаем 0 доминантным, если есть другие слоги
        countsMap.set(count, (countsMap.get(count) || 0) + 1);
    }
    
    // Если все слоги - нули, то доминантный 0
    if (Array.from(countsMap.keys()).every(k => k === 0)) return 0;


    for (let [count, freq] of countsMap) {
        if (count === 0 && countsMap.size > 1) continue; // Игнорируем нулевые слоги, если есть ненулевые
        if (freq > maxFreq) {
            maxFreq = freq;
            dominant = count;
        } else if (freq === maxFreq) { // Если частоты равны, выбираем больший слог (произвольное правило)
            if (dominant === null || count > dominant ) {
                 dominant = count;
            }
        }
    }
     // Если больше половины строк имеют разное количество слогов, то нет явного доминанта
    if (maxFreq <= syllableCounts.length / 2 && new Set(syllableCounts.filter(c => c > 0)).size > 2) { // Условие для отсутствия доминанты
        return null;
    }

    return dominant;
}

// --- Очистка полей ---
function clearFields() {
    textArea.value = "";
    resultDiv.innerHTML = initialResultText;
    resetTrafficLightsAndComment();
}

// --- Сохранение стихов ---
function savePoem() {
    const poem = textArea.value.trim();
    if (!poem) {
        alert("Нечего сохранять — поле пустое!");
        return;
    }
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    poems.unshift(poem); // Добавляем в начало массива
    localStorage.setItem("savedPoems", JSON.stringify(poems));
    loadSavedPoems();
    // alert("Стихотворение сохранено!"); // Можно убрать, чтобы не мешать
    trafficLightCommentDiv.textContent = "Стих в архиве! 🗄️✍️";
    setTimeout(resetTrafficLightsAndComment, 2000);
}

// --- Загрузка сохранённых стихов ---
function loadSavedPoems() {
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    savedPoemsList.innerHTML = ""; // Очищаем список перед загрузкой
    poems.forEach((poem, index) => {
        const li = document.createElement("li");
        // Отображаем только первые N символов + многоточие
        const previewLength = 40;
        const poemPreview = poem.length > previewLength ? poem.substring(0, previewLength) + "..." : poem;

        li.innerHTML = `<span>${poemPreview.replace(/\n/g, ' ')}</span> 
                        <div>
                            <button onclick="loadPoem(${index})" title="Загрузить">📖</button>
                            <button onclick="deletePoem(${index})" title="Удалить">🗑️</button>
                        </div>`;
        savedPoemsList.appendChild(li);
    });
}

function loadPoem(index) {
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    if (poems[index]) {
        textArea.value = poems[index];
        processAndAnalyzeSyllabicPatterns(); // Сразу анализируем загруженный стих
    }
}

function deletePoem(index) {
    if (!confirm("Удалить это стихотворение из архива?")) return;
    const poems = JSON.parse(localStorage.getItem("savedPoems")) || [];
    poems.splice(index, 1);
    localStorage.setItem("savedPoems", JSON.stringify(poems));
    loadSavedPoems();
}

// --- Логика для Лингвистического Комбайна ---
if (searchButtonsContainer) {
    searchButtonsContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('search-btn')) {
            const word = searchWordInput.value.trim();
            const searchType = event.target.dataset.searchType;
            if (!word) {
                searchWordInput.placeholder = "Сначала введите слово!";
                setTimeout(()=> { // Возвращаем плейсхолдер темы
                    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
                    updatePlaceholders(currentTheme);
                }, 2000);
                return;
            }
            let query = "";
            switch (searchType) {
                case "synonyms": query = `синонимы к слову ${word}`; break;
                case "rhymes": query = `рифмы к слову ${word}`; break;
                case "meaning": query = `значение слова ${word}`; break;
                case "antonyms": query = `антонимы к слову ${word}`; break;
                case "etymology": query = `этимология слова ${word}`; break;
            }
            if (query) window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
        }
    });
}

// --- Обработчик кликов по светофору для переключения тем ---
const trafficLightContainer = document.getElementById('trafficLightContainer');
if (trafficLightContainer) {
    trafficLightContainer.addEventListener('click', () => {
        const body = document.body;
        const isDarkTheme = body.classList.contains('dark-theme');

        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');

        const newThemeType = isDarkTheme ? 'light' : 'dark';
        updateTitle(newThemeType);
        updatePlaceholders(newThemeType);
        updateButtonTexts(newThemeType);
        flashLights();
    });
}

// --- Функция мигания светофора ---
function flashLights() {
    lightRed.classList.add('active');
    lightYellow.classList.add('active');
    lightGreen.classList.add('active');

    setTimeout(() => {
        // Не выключаем, если они должны гореть по результатам анализа
        // Вместо этого, просто вызываем processAndAnalyzeSyllabicPatterns, чтобы светофор обновился по текущему тексту
        if (textArea.value.trim()) {
             processAndAnalyzeSyllabicPatterns();
        } else {
            resetTrafficLightsAndComment();
        }
    }, 500);
}

function updatePlaceholders(themeType) {
    const textareaPlaceholders = PLACEHOLDERS.textarea[themeType] || PLACEHOLDERS.textarea.light;
    const searchPlaceholders = PLACEHOLDERS.search[themeType] || PLACEHOLDERS.search.light;

    textArea.placeholder = getRandomElement(textareaPlaceholders);
    searchWordInput.placeholder = getRandomElement(searchPlaceholders);
}

function updateTitle(themeType = 'base') { // themeType может быть 'dark', 'light', или 'base'
    if (!mainPageTitleElement) return;
    
    const titles = dynamicTitles[themeType] || dynamicTitles.base;
    const newTitle = getRandomElement(titles);

    mainPageTitleElement.style.opacity = 0;
    setTimeout(() => {
        mainPageTitleElement.textContent = newTitle;
        mainPageTitleElement.style.opacity = 1;
        // Небольшая анимация появления (можно убрать, если не нравится)
        mainPageTitleElement.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            mainPageTitleElement.style.transform = 'translateY(0)';
        }, 50); // Длительность анимации должна совпадать с transition в CSS, если есть
    }, 150); // Задержка перед сменой текста, чтобы opacity успел сработать
}


function updateButtonTexts(themeType) {
    const buttonsToUpdate = [
        { element: countButton, darkText: 'ПОЕХАЛИ🚀', lightText: 'Начать' },
        { element: clearButton, darkText: 'В ТОПКУ🔥', lightText: 'Очистить' },
        { element: saveButton, darkText: 'В АРХИВ🗄️', lightText: 'Сохранить' }
    ];

    buttonsToUpdate.forEach(btnConfig => {
        if (btnConfig.element) {
            const text = themeType === 'dark' ? btnConfig.darkText : btnConfig.lightText;
            // Проверяем, есть ли data-атрибуты в HTML (как в вашем index.html)
            // Если да, можно использовать их, если нет - используем тексты из конфига выше
            const darkData = btnConfig.element.dataset.dark;
            const lightData = btnConfig.element.dataset.light;

            if (darkData && lightData) {
                btnConfig.element.textContent = themeType === 'dark' ? darkData : lightData;
            } else {
                 btnConfig.element.textContent = text;
            }
        }
    });
}

// --- Инициализация ---
document.addEventListener('DOMContentLoaded', () => {
    // Устанавливаем начальный заголовок страницы из <title> тега HTML, если mainPageTitle пустой
    if (mainPageTitleElement && !mainPageTitleElement.textContent) {
        mainPageTitleElement.textContent = document.title;
    }
    updateTitle('base'); // Затем устанавливаем динамический базовый заголовок

    loadSavedPoems();
    resetTrafficLightsAndComment();

    const initialTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    updatePlaceholders(initialTheme);
    updateButtonTexts(initialTheme); // Обновляем тексты кнопок согласно теме

    // Если в textarea уже есть текст (например, после перезагрузки страницы с сохраненным состоянием)
    if (textArea.value.trim()) {
        processAndAnalyzeSyllabicPatterns();
    }
});

// --- Привязка событий ---
if (countButton) countButton.addEventListener('click', processAndAnalyzeSyllabicPatterns);
if (clearButton) clearButton.addEventListener('click', clearFields);
if (saveButton) saveButton.addEventListener('click', savePoem);

// Автоматический анализ при вводе текста (можно раскомментировать, но может быть ресурсоемко)
/*
let typingTimer;
const doneTypingInterval = 1000; // 1 секунда

if (textArea) {
    textArea.addEventListener('keyup', () => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(processAndAnalyzeSyllabicPatterns, doneTypingInterval);
    });
    textArea.addEventListener('keydown', () => {
        clearTimeout(typingTimer);
    });
}
*/

