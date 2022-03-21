const cartItens = document.querySelector('ol');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'itemImage';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'itemSku', sku));
  section.appendChild(createCustomElement('span', 'itemTitle', name));
  section.appendChild(createCustomElement('span', 'price', `Price: $${price}`));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'itemAdd', 'Adicionar ao carrinho!'));

  return section;
}

function updateStorage() {
  const cartList = document.querySelector('ol');
  localStorage.setItem('itens', cartList.innerHTML);
  valueCalc();
}

function cartItemClickListener(event) {
  event.target.remove();
  valueCalc();
}
cartItens.addEventListener('click', cartItemClickListener);

function clearCart() {
  const list = document.querySelector('ol');
  list.innerHTML = '';
  updateStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cartItem';
  li.innerText = `ID: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  const valor = document.createElement('p');
  valor.className = 'salesPrice';
  valor.innerText = Number(salePrice).toFixed(2);
  li.appendChild(valor);
  updateStorage();
  return li;
}

const cartItemAdder = async (event) => {
  const sku = event.target.parentElement.firstChild.innerText;
  const apiReturn = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const apiReturnJson = await apiReturn.json();
  const createCartParameter = {
    sku: apiReturnJson.id,
    name: apiReturnJson.title,
    salePrice: apiReturnJson.price,
  };
  const cartList = document.querySelector('ol');
  cartList.appendChild(createCartItemElement(createCartParameter));
  updateStorage();
  valueCalc();
};

const parcialURL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const fetchProduct = async (search) => {
  const data = await fetch(`${parcialURL}${search}`);
  const dataObject = await data.json();
  const dataObjectResults = dataObject.results;
  return dataObjectResults;
};

const addProductUnit = (dataObjectResults) => {
  const productUnit = createProductItemElement({
    sku: dataObjectResults.id,
    name: dataObjectResults.title,
    image: dataObjectResults.thumbnail,
    price: dataObjectResults.price,
  });
  const itemQuery = document.querySelector('.items');
  itemQuery.appendChild(productUnit);
};

window.onload = () => {
  fetchProduct('computador')
    .then((dataObjectResults) => dataObjectResults.forEach((element) => addProductUnit(element)))
    .then(() => {
      const addCart = document.querySelectorAll('.itemAdd');
      addCart.forEach((button) => button.addEventListener('click', cartItemAdder));
      const clearButton = document.querySelector('.emptyCart');
      clearButton.addEventListener('click', clearCart);
    })
    .then(() => document.querySelector('.loading').remove());
  const cartList = document.querySelector('ol');
  cartList.innerHTML = localStorage.getItem('itens');
  valueCalc();
};

const btn = document.querySelectorAll('.searchbtn')[0];

const changesearch = async () => {
  document.querySelectorAll('.items')[0].innerHTML = '';
  const loading = document.createElement('p')
  loading.classList = 'loading';
  loading.innerText = 'Loading...';
  document.querySelectorAll('.items')[0].appendChild(loading);

  const input = document.querySelectorAll('.inputValue')[0].value;
  await fetchProduct(input).then((dataObjectResults) => dataObjectResults.forEach((element) => addProductUnit(element)))
    .then(() => {
      const addCart = document.querySelectorAll('.itemAdd');
      addCart.forEach((button) => button.addEventListener('click', cartItemAdder));
      const clearButton = document.querySelector('.emptyCart');
      clearButton.addEventListener('click', clearCart);
    })
    .then(() => document.querySelector('.loading').remove());

  const cartList = document.querySelector('ol');
  cartList.innerHTML = localStorage.getItem('itens');
  updateStorage();
}

btn.addEventListener('click', changesearch);

const valueCalc = () => {
  const total = document.querySelectorAll('.totalValue')[0];
  const itemsValue = document.querySelectorAll('.salesPrice');
  let printableValue = 0.00;
  for (let index = 0; index < itemsValue.length; index += 1) {
    printableValue = (Number(printableValue) + parseFloat(itemsValue[index].innerText));
  }
  total.innerText=printableValue;
  counterChange();
};

const counterChange = () => {
  const p = document.querySelectorAll('.counter')[0];
  const sizeOfCart = document.querySelectorAll('.cartItem').length;
  p.innerText = sizeOfCart;
  p.style.display='flex';
  if(!sizeOfCart || sizeOfCart === 0) {
    p.style.display='none';
  }
}

const icon = document.querySelector('.icon');

const sorry = () => {
alert('Sorry, this project is only for educational purpose, please go to a real online store');
}
icon.addEventListener('click', sorry);