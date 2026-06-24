// Получение элементов DOM
const dataTypeSelect = document.getElementById('dataTypeSelect');
const showBtn = document.getElementById('showBtn');
const inputFieldsDiv = document.getElementById('inputFields');
const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsListDiv = document.getElementById('resultsList');
const featuresLabel = document.getElementById('featuresLabel');
const selectErrorMsg = document.getElementById('selectErrorMsg');
const figureContainer = document.getElementById('figureContainer');
const featuresSelect = document.getElementById('featuresSelect');

// Текущий тип входных данных
let currentInputType = "side";
let inputA = null;
let inputB = null;
let inputThird = null;

// Функция для отображения картинки в зависимости от типа данных
function updateFigure(type) {
    const imgName = type === "side" ? "pict_1.png" : "pict_2.png";
    figureContainer.innerHTML = `<img src="${imgName}" alt="Трапеция">`;
}

// Обновление полей ввода в зависимости от выбранного типа
function updateInputFields(type) {
    if (type === "side") {
        inputFieldsDiv.innerHTML = `
            <div class="input-group">
                <label>Верхнее основание (a): </label>
                <input type="number" id="baseA" step="any" placeholder="> 0">
            </div>
            <div class="input-group">
                <label>Нижнее основание (b): </label>
                <input type="number" id="baseB" step="any" placeholder="> a">
            </div>
            <div class="input-group">
                <label>Боковая сторона (c): </label>
                <input type="number" id="sideC" step="any" placeholder="> 0">
            </div>
        `;
    } else {
        inputFieldsDiv.innerHTML = `
            <div class="input-group">
                <label>Верхнее основание (a): </label>
                <input type="number" id="baseA" step="any" placeholder="> 0">
            </div>
            <div class="input-group">
                <label>Нижнее основание (b): </label>
                <input type="number" id="baseB" step="any" placeholder="> a">
            </div>
            <div class="input-group">
                <label>Угол α (градусы): </label>
                <input type="number" id="angleAlpha" step="any" placeholder="0 < α < 180">
            </div>
        `;
    }
    
    inputA = document.getElementById('baseA');
    inputB = document.getElementById('baseB');
    if (type === "side") {
        inputThird = document.getElementById('sideC');
    } else {
        inputThird = document.getElementById('angleAlpha');
    }
    
    const allInputs = [inputA, inputB, inputThird];
    allInputs.forEach(inp => {
        if (inp) {
            inp.addEventListener('focus', function() {
                this.classList.remove('error');
                resultsListDiv.innerHTML = "—";
            });
        }
    });
}

// Удаление класса error со всех полей ввода
function resetInputErrors() {
    const inputs = [inputA, inputB, inputThird];
    inputs.forEach(inp => {
        if (inp) inp.classList.remove('error');
    });
    featuresSelect.classList.remove('error');
}

// Проверка, выбрана ли хотя бы одна характеристика в select multiple
function isAnyFeatureSelected() {
    return featuresSelect.selectedOptions.length > 0;
}

// Получить массив выбранных характеристик
function getSelectedFeatures() {
    const selected = [];
    for (let option of featuresSelect.selectedOptions) {
        selected.push(option.value);
    }
    return selected;
}

// Основная функция вычисления
function calculate() {
    resetInputErrors();
    selectErrorMsg.innerHTML = "";
    featuresLabel.classList.remove('error-text');
    
    if (!isAnyFeatureSelected()) {
        featuresLabel.classList.add('error-text');
        featuresSelect.classList.add('error');
        selectErrorMsg.innerHTML = "Ошибка: выберите хотя бы одну характеристику для вычисления!";
        return;
    }
    
    let a_val = inputA ? inputA.value.trim() : "";
    let b_val = inputB ? inputB.value.trim() : "";
    let third_val = inputThird ? inputThird.value.trim() : "";
    
    let hasEmpty = false;
    if (a_val === "") { if(inputA) inputA.classList.add('error'); hasEmpty = true; }
    if (b_val === "") { if(inputB) inputB.classList.add('error'); hasEmpty = true; }
    if (third_val === "") { if(inputThird) inputThird.classList.add('error'); hasEmpty = true; }
    if (hasEmpty) {
        resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: все поля должны быть заполнены.</span>";
        return;
    }
    
    let a = parseFloat(a_val);
    let b = parseFloat(b_val);
    let third = parseFloat(third_val);
    
    let hasInvalidNumber = false;
    if (isNaN(a) || a <= 0) { if(inputA) inputA.classList.add('error'); hasInvalidNumber = true; }
    if (isNaN(b) || b <= 0) { if(inputB) inputB.classList.add('error'); hasInvalidNumber = true; }
    if (isNaN(third) || third <= 0) { if(inputThird) inputThird.classList.add('error'); hasInvalidNumber = true; }
    if (hasInvalidNumber) {
        resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: все значения должны быть положительными числами.</span>";
        return;
    }
    
    if (a >= b) {
        if(inputA) inputA.classList.add('error');
        if(inputB) inputB.classList.add('error');
        resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: нижнее основание (b) должно быть больше верхнего (a).</span>";
        return;
    }
    
    const diff = (b - a) / 2;
    let height = 0;
    let valid = true;
    
    if (currentInputType === "side") {
        let c = third;
        if (c <= diff) {
            if(inputThird) inputThird.classList.add('error');
            resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: боковая сторона должна быть больше (b-a)/2, иначе трапеция не существует.</span>";
            return;
        }
        height = Math.sqrt(c * c - diff * diff);
        if (isNaN(height) || height <= 0) valid = false;
    } 
    else {
        let alphaDeg = third;
        if (alphaDeg <= 0 || alphaDeg >= 180) {
            if(inputThird) inputThird.classList.add('error');
            resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: угол должен быть в диапазоне (0°, 180°).</span>";
            return;
        }
        let angleRad = alphaDeg * Math.PI / 180;
        let cosAlpha = Math.cos(angleRad);
        if (Math.abs(cosAlpha) < 1e-8) {
            resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: при угле 90° боковая сторона вертикальна, но требуется b>a (невозможно).</span>";
            return;
        }
        let computedSide = diff / cosAlpha;
        if (computedSide <= 0 || !isFinite(computedSide)) {
            resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: невозможно вычислить боковую сторону. Проверьте угол (косинус угла должен быть положительным).</span>";
            return;
        }
        height = Math.sin(angleRad) * computedSide;
        if (height <= 0 || isNaN(height)) valid = false;
    }
    
    if (!valid || height <= 0) {
        resultsListDiv.innerHTML = "<span style='color:red'>Ошибка: получены некорректные значения. Проверьте входные данные.</span>";
        return;
    }
    
    const midBase = (a + b) / 2;
    const diagonal = Math.sqrt(midBase * midBase + height * height);
    
    let angleBetweenDiagonals = 0;
    if (height > 0) {
        const tanHalf = diff / height;
        angleBetweenDiagonals = 2 * Math.atan(tanHalf) * 180 / Math.PI;
        if (angleBetweenDiagonals < 0) angleBetweenDiagonals = Math.abs(angleBetweenDiagonals);
    }
    
    const selectedFeatures = getSelectedFeatures();
    let outputHtml = "";
    if (selectedFeatures.includes("diagonal")) {
        outputHtml += `<div class="result-item">Диагонали: ${diagonal.toFixed(4)}</div>`;
    }
    if (selectedFeatures.includes("height")) {
        outputHtml += `<div class="result-item">Высота: ${height.toFixed(4)}</div>`;
    }
    if (selectedFeatures.includes("angleDiag")) {
        outputHtml += `<div class="result-item">Угол между диагоналями: ${angleBetweenDiagonals.toFixed(2)}°</div>`;
    }
    
    resultsListDiv.innerHTML = outputHtml || "—";
}

// Функция очистки
function clearData() {
    if (inputA) inputA.value = "";
    if (inputB) inputB.value = "";
    if (inputThird) inputThird.value = "";
    
    for (let option of featuresSelect.options) {
        option.selected = false;
    }
    
    resultsListDiv.innerHTML = "—";
    resetInputErrors();
    featuresLabel.classList.remove('error-text');
    selectErrorMsg.innerHTML = "";
}

// Обработчик кнопки "Показать"
function onShowType() {
    const newType = dataTypeSelect.value;
    currentInputType = newType;
    updateInputFields(currentInputType);
    updateFigure(currentInputType);
    clearData();
}

// Инициализация
function init() {
    currentInputType = "side";
    updateInputFields("side");
    updateFigure("side");
    
    showBtn.addEventListener('click', onShowType);
    calculateBtn.addEventListener('click', calculate);
    clearBtn.addEventListener('click', clearData);
    
    featuresSelect.addEventListener('focus', function() {
        featuresLabel.classList.remove('error-text');
        featuresSelect.classList.remove('error');
        selectErrorMsg.innerHTML = "";
    });
    featuresSelect.addEventListener('change', function() {
        featuresLabel.classList.remove('error-text');
        featuresSelect.classList.remove('error');
        selectErrorMsg.innerHTML = "";
    });
}

init();