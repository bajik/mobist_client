let body = null;
let popup = null;
let organizationInput = null;
let tblView = null;
let mainBody = null;
// let btnNewPerson = null;

let positions = [];
let options = null;
let searchInput = null;

function main() {  
  body = document.querySelector('body');
  popup = body.querySelector('.popup');
  organizationInput = document.querySelector('.organization__input');
  tblView = document.querySelector('.people.tbl-view');
  mainBody = tblView.querySelector('.tbl__body');
  
  body.addEventListener("keyup", function(event) {
    addEvenKeyDownForBody(event);
  });
}

// Переключити відображення контейнера popup
function togglePopupVisible() {
  popup.classList.toggle('popup--visible');
}

// Відкрити попап вікно у контейнері popup з шаблону
function openWindowPopup(windowId) {
  const dialogWindow = document.querySelector(windowId);
  const clone = dialogWindow.content.cloneNode(true);
  popup.appendChild(clone);
}

function removeChildNodes(parentNode) {
  while (parentNode.firstChild) {
    parentNode.firstChild.remove();
  }
}

// openNewEditForm
function openNewEditForm() { 
  togglePopupVisible();
  openWindowPopup('#dialogForm');
  
  const inputFilters = popup.querySelectorAll('.comboBox .inputFilter');

  inputFilters.forEach(inputFilter => {
    inputFilter.addEventListener('click', function() {
      this.nextElementSibling.classList.toggle('active');
    });
  });
 
  const directoryPath = window.location.href.substring(0, window.location.href.lastIndexOf("/")+1)
  
  options = popup.querySelector('#military_rank .options');
  searchInput = popup.querySelector('#military_rank .search input');

  fetch(directoryPath + './json/positions.json').then((res) => res.json()).then((data) => {
    positions = data;

    if (data.length == 0) {
      options.insertAdjacentHTML("beforeend", '<p>Немає елементів</p>');
      return;
    }
    
    data.forEach(position => {
      const li = document.createElement('li');
      li.dataset.id = position.id;
      li.textContent = position.title;
      li.addEventListener('click', function() { updateName(this); });
      options.appendChild(li);
    });
  });

  searchInput.addEventListener('keyup', () => {
    let arr = [];
    let searchedVal = searchInput.value.toLowerCase();
    arr = positions.filter(data => {
      return data.title.toLowerCase().includes(searchedVal)
    });
    removeChildNodes(options);
    
    if (arr.length == 0) {
      options.insertAdjacentHTML("beforeend", '<p>Немає елементів</p>');
      return;
    }
    
    arr.forEach(position => {
      const li = document.createElement('li');
      li.dataset.id = position.id;
      li.textContent = position.title;
      li.addEventListener('click', function() { updateName(this); });
      options.appendChild(li);
    });

  })
}

function updateName(selectedItem) {
  searchInput.value = "";
  wrapper.classList.remove('active');
  selectBtn.firstElementChild.dataset.id = selectedItem.dataset.id;
  selectBtn.firstElementChild.textContent = selectedItem.textContent;
}

function addEvenKeyDownForBody(event) {
  event.preventDefault();
  if (event.code == "Insert") {
    // addNewPerson();
    openNewEditForm();
  }
}

function addNewPerson() {
  const tempTablRow = getElementTableRow([
    ['nn', '1'], 
    ['full_name', ''],
    ['birth_year', ''],
    ['position', ''],
    ['military_rank', ''],
    ['organization', ''],
    ['tck_organization', ''],
    ['tck_person', '']]);
  // tempTablRow.dataset.uid = element.uid;
  mainBody.appendChild(tempTablRow);
}

function getElementTableRow(columns) {
  const tagTableRow = document.createElement('tr');
  tagTableRow.classList.add('tbl__body-row')
  columns.forEach(col => {    
    const column = document.createElement('td')
    column.classList.add('tbl__body-cell')
    if (col[0] != '') {
      column.dataset.name = col[0]
    }
    if (col[1] != '') {
      column.textContent = col[1]
    }    
    tagTableRow.appendChild(column)
  });
  
  return tagTableRow
}

function btnNewPersonClick() {
  // addNewPerson();
  console.log(1);
  openNewEditForm();
}