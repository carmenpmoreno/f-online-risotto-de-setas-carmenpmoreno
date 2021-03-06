const shippingCost = 7;
const headerSection = document.querySelector('.header-section');
const mainSection = document.querySelector('.main-section');

let ingredientsSelected = [];
let subtotal = 0;
let total = 0;
let items = 0;

fetch('https://raw.githubusercontent.com/Adalab/recipes-data/master/rissoto-setas.json')
    .then(response => response.json())
    .then(data => {
        recipe = data.recipe;
        return (
            paintData(recipe)
        );
    })

function paintData(recipe) {
    const classArticleSection = 'section-articles';
    const classPriceSection = 'section-price';

    paintElement(headerSection, recipe.name, 'h2', 'class', 'main-title');
    paintElement(headerSection, 'Seleccionar todo', 'button', 'class', 'select-all-button', 'type', 'button');
    paintElement(headerSection, 'Deseleccionar todo', 'button', 'class', 'deselect-all-button', 'type', 'button');
    createSection(recipe, classArticleSection);
    createSection(recipe, classPriceSection, subtotal);

    const ingredientInputs = document.querySelectorAll('.ingredient-input');

    for (const ingredientInput of ingredientInputs) {
        ingredientInput.addEventListener('click', handleIngredientInput);
    };

    const selectButton = document.querySelector('.select-all-button');
    selectButton.addEventListener('click', handleButtonSelect);
    const deselectButton = document.querySelector('.deselect-all-button');
    deselectButton.addEventListener('click', handleButtonSelect);
}

// INTERACCIONES:

function handleButtonSelect(event) {
    const ingredientInputs = document.querySelectorAll('.ingredient-input');
    console.log(event.currentTarget.classList);
    if (event.currentTarget.classList.contains('select-all-button')) {
        ingredientInputs.forEach(ingredientInput => {
            ingredientInput.checked = true;
            const numberPrice = parseFloat(ingredientInput.value);
            const newingredientsSelected = ingredientsSelected.push(numberPrice);
            console.log(ingredientsSelected);
        });
        paintArticlePrice();
    } else {
        ingredientInputs.forEach(ingredientInput => {
            ingredientInput.checked = false;
        });
        const sectionList = document.querySelector('.section-price');
        paintElement(sectionList, "", 'p', 'class', 'no-total-feedback');
        const noTotalFeedback = document.querySelector('.no-total-feedback');
        const articleTotal = document.querySelector('.total-article');
        sectionList.replaceChild(noTotalFeedback, articleTotal);
        ingredientsSelected = [];
    }
}
function handleIngredientInput(event) {
    const ingredientInputs = document.querySelectorAll('.ingredient-input');
    event.currentTarget.classList.toggle('selected');
    // si se selecciona el ingrediente y no se había seleccionado antes, se suma al array
    if (event.currentTarget.classList.contains('selected')
        && !ingredientsSelected.find(price => price === event.currentTarget.value)) {
        const numberPrice = parseFloat(event.currentTarget.value);
        let newingredientsSelected = ingredientsSelected.push(numberPrice);
        ingredientsSelected = ingredientsSelected;
        console.log('tras el push tengo en ingredientsSelected:', ingredientsSelected);
        paintArticlePrice();
        //  si quito checked -> elimino ese elemento del array si estuviese incluído
    } else if (ingredientsSelected.length > 1) {
        console.log(ingredientsSelected);
        let newingredientsSelected = ingredientsSelected.filter(price => price !== parseFloat(event.currentTarget.value));
        ingredientsSelected = newingredientsSelected;
        console.log('tras FILTRAR tengo en ingredientsSelected:', ingredientsSelected);
        paintArticlePrice();
    } else {
        const sectionList = document.querySelector('.section-price');
        paintElement(sectionList, "", 'p', 'class', 'no-price');
        const noPrice = document.querySelector('.no-price');
        const articleTotal = document.querySelector('.total-article');
        sectionList.replaceChild(noPrice, articleTotal);
        console.log('no pinto nada porque no hay seleccionados');
        ingredientsSelected = [];
    }
}
function paintArticlePrice() {
    const articleTotal = document.querySelector('.total-article');
    const articleTotalNew = document.querySelector('.total-article-new');
    if (articleTotal) {
        const result = ingredientsSelected.reduce((acc, number) => acc + number);
        let newSubtotal = result;
        total = newSubtotal + shippingCost;
        console.log('nuevo total', total);

        const sectionList = document.querySelector('.section-price');
        paintElement(sectionList, "", 'article', 'class', 'total-article-new');
        const articleTotalNew = document.querySelector('.total-article-new');
        const articleTotal = document.querySelector('.total-article');
        const parentArticle = articleTotal.parentNode;
        parentArticle.replaceChild(articleTotalNew, articleTotal);

        paintPrices(articleTotalNew, newSubtotal, total);

        console.log('sustituyo total');
    }
    else if (articleTotalNew) {
        const result = ingredientsSelected.reduce((acc, number) => acc + number);
        let newSubtotal = result;
        total = newSubtotal + shippingCost;
        console.log('nuevo total', total);

        const sectionList = document.querySelector('.section-price');
        const articleTotalNew = document.querySelector('.total-article-new');
        paintElement(sectionList, "", 'article', 'class', 'total-article');
        const articleTotal = document.querySelector('.total-article');
        const parentArticle = articleTotalNew.parentNode;
        parentArticle.replaceChild(articleTotal, articleTotalNew);

        paintPrices(articleTotal, newSubtotal, total);

        console.log('sustituyo total');

    } else {
        const sectionList = document.querySelector('.section-price');
        const result = ingredientsSelected.reduce((acc, number) => acc + number);
        let newSubtotal = result;
        total = newSubtotal + shippingCost;
        console.log('subtotal actual', newSubtotal);
        console.log('nuevo total', total);

        paintElement(sectionList, "", 'article', 'class', 'total-article');
        const articleTotal = document.querySelector('.total-article');
        paintPrices(articleTotal, newSubtotal, total);

        console.log('imprimo primer total');
    }
}

function paintPrices(tipeArticle, newSubtotal, total) {
    paintElement(tipeArticle, 'Subtotal: ', 'h3', 'class', 'subtotal-title');
    paintElement(tipeArticle, `${newSubtotal} €`, 'p', 'class', 'subtotal');
    paintElement(tipeArticle, 'Gastos de envío: ', 'h3', 'class', 'shipping-cost-title');
    paintElement(tipeArticle, ` ${shippingCost} €`, 'p', 'class', 'shipping-cost')
    paintElement(tipeArticle, `Total: ${total} €`, 'h3', 'class', 'total-title');
    paintElement(tipeArticle, `Comprar ingredientes: ${total} € `, 'button', 'class', 'button-buy');
}

function paintElement(section, node, element, atribute, nameAtribute, scndAtribute, scndNameAtribute) {
    const elementSelector = document.createElement(element);
    const elementContent = document.createTextNode(node);
    elementSelector.appendChild(elementContent);
    section.appendChild(elementSelector);
    elementSelector.setAttribute(atribute, nameAtribute);
    elementSelector.setAttribute(scndAtribute, scndNameAtribute);
}
function createSection(recipe, classList, subtotal) {
    const sectionList = document.createElement('section');
    sectionList.classList.add(classList);
    mainSection.appendChild(sectionList);
    if (sectionList.classList.contains('section-articles')) {
        createArticles(recipe, sectionList);
    }
}
function createArticles(recipe, sectionList) {
    recipe.ingredients.map(ingredient => {
        const articleSelector = document.createElement('article');
        createLabel(ingredient, articleSelector);
        if (ingredient.brand) {
            createArticlesubtitles(ingredient.brand, articleSelector, "");
        }
        createArticlesubtitles(ingredient.quantity, articleSelector, "");
        createArticlesubtitles(ingredient.price, articleSelector, " €");
        sectionList.appendChild(articleSelector);
    })
}
function createLabel(ingredient, articleSelector) {
    const labelSelector = document.createElement('label');
    createInput(ingredient, labelSelector);
    labelSelector.setAttribute('for', ingredient.product);
    const labelContent = document.createTextNode(ingredient.product);
    labelSelector.appendChild(labelContent);
    articleSelector.appendChild(labelSelector);
}
function createInput(ingredient, labelSelector) {
    const inputSelector = document.createElement('input');
    inputSelector.setAttribute('id', ingredient.product);
    inputSelector.setAttribute('class', 'ingredient-input');
    inputSelector.setAttribute('type', 'checkbox');
    inputSelector.setAttribute('value', ingredient.price);
    inputSelector.setAttribute('name', 'ingredient-price');
    labelSelector.appendChild(inputSelector);
}
function createArticlesubtitles(subtitle, articleSelector, unit) {
    const subtitleSelector = document.createElement('h4');
    const subtitleContent = document.createTextNode(subtitle + unit);
    subtitleSelector.appendChild(subtitleContent);
    articleSelector.appendChild(subtitleSelector);
}
