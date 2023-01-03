let body = null;
let popup = null;
let tblView = null;
let mainBody = null;
let organization = null;
let organizationInput = null;
let contextMenu = null;

let organizationName = null;
let organizationCode = null;
let organizationTck = null;

let contextMenuUidRow = null;

const directoryPath = window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1);

function main() {
  getElementMainLinks();
  setMainEvents(); 
}

// getElementMainLinks
function getElementMainLinks() {
  body              = document.querySelector('body');
  popup             = body.querySelector('.popup');  
  tblView           = body.querySelector('.people.tbl-view');
  mainBody          = tblView.querySelector('.tbl__body');
  organization      = document.querySelector('.organization');
  organizationInput = document.querySelector('.organization__input');

  contextMenu = body.querySelector('.context-menu');

  organizationName  = organization.querySelector('#organization__name');
  organizationCode  = organization.querySelector('#organization__code');
  organizationTck   = organization.querySelector('#organization__tck');
}

function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}

// setMainEvents
function setMainEvents() {
  mainBody.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    const { clientX: mouseX, clientY: mouseY } = event;
    
    contextMenuUidRow = mainBody.querySelector('.tbl__body-row:hover ').dataset.uid;
    
    contextMenu.style.top = `${mouseY}px`;
    contextMenu.style.left = `${mouseX}px`;
    contextMenu.classList.add('visible');
  });
  
  body.addEventListener('click', (e) => {
    contextMenu.classList.remove('visible');
  })
  
  body.addEventListener("keyup", function(event) {
    addEvenKeyDownForBody(event);
  });
  organizationInput.addEventListener('focus', openDialogFormOrganization);
}

// btnDeleteRowPeople
function btnDeleteRowPeople() {  
  if (confirm("Ви дійсно хочете видалити рядок?")) {
    const selectedRow = mainBody.querySelector(`.tbl__body-row[data-uid="${contextMenuUidRow}"`);
    if (selectedRow) {
      selectedRow.remove();
      const rowsTable = mainBody.querySelectorAll('.tbl__body-row');
      let pos = 0;
      rowsTable.forEach(row => {
        pos++;
        const cellNumber = row.querySelector('.tbl__body-cell[data-name="nn"');
        if (cellNumber.textContent != pos) {
          cellNumber.textContent = pos;
        }
      });
    }
  }
}

// Зачинити контейнер popup та видалити попап вікно(а)
function closeWindowPopup() {
  togglePopupVisible();
  removeChildNodes(popup);
}

function opentListCombobox(comboBox) {
  const content = comboBox.querySelector('.content');
  if (!content.classList.contains('active')) {
    content.classList.add('active');
  } else {          
    content.classList.remove('active');
  }
}

// setComboBoxEvents
function setComboBoxEvents() {
  const comboBoxes = popup.querySelectorAll('.comboBox');

  comboBoxes.forEach(comboBox => {    
    const inputSearch = comboBox.querySelector('.search input');    
    const inputFilterTitle = comboBox.querySelector('.inputFilter__title');  
    const content = comboBox.querySelector('.content');
    
    inputFilterTitle.addEventListener('focus', function() {
      opentListCombobox(comboBox);
      const searchInput = content.querySelector('.search input');
      searchInput.focus();
    });

    inputFilterTitle.addEventListener('mousedown', function(event) {
      event.preventDefault();
      opentListCombobox(comboBox);
      const searchInput = content.querySelector('.search input');
      searchInput.focus();
    });
      
    
    inputSearch.addEventListener('keyup', function() {
      let itemsNull = true;
      let searchedVal = inputSearch.value.toLowerCase();
      const items = comboBox.querySelectorAll('.item');
      
      items.forEach(item => {        
        if (item.value && item.value.toLowerCase().includes(searchedVal)) {
          itemsNull = false;
          if (item.classList.contains('disable')) {
            item.classList.remove('disable');
          }
        } else {
          if (!item.classList.contains('disable')) {
            item.classList.add('disable');
          }
        }
      });
      if (itemsNull) {
        fillComboBoxNullItem(comboBox.querySelector('.items'));
      } else {
        
        emptyElement = comboBox.querySelector('.items p');
        if (emptyElement) {
          emptyElement.remove();
        }
      }
    });   
  });
}

// btnNewPersonClick
function btnNewPersonClick() {
  openDialogFormPerson();
}

function btnEditRowPeople() {
  openDialogFormPerson();
  fillDataPerson()
  setModeEdit();
}

function setModeEdit() {
  const form  = popup.querySelector('.dialog-form');
  form.dataset.modeEdit = 'true';
}

function fillDataPerson() {
  const selectedRow = mainBody.querySelector(`.tbl__body-row[data-uid="${contextMenuUidRow}"`);
  if (selectedRow) {
    const fullName = selectedRow.querySelector('.tbl__body-cell[data-name="full_name"');
    const birthYear = selectedRow.querySelector('.tbl__body-cell[data-name="birth_year"');
    const position = selectedRow.querySelector('.tbl__body-cell[data-name="position"');
    const military_rank = selectedRow.querySelector('.tbl__body-cell[data-name="military"] .rank');
    const military_number = selectedRow.querySelector('.tbl__body-cell[data-name="military"] .number');
    const tck_person = selectedRow.querySelector('.tbl__body-cell[data-name="tck_person"');
        
    popup.querySelector('#full_name').value = fullName.textContent;
    popup.querySelector('#birth_year').value = birthYear.textContent;
    popup.querySelector('#position').value = position.textContent;
    popup.querySelector('#military_rank .inputFilter__title').value = military_rank.textContent;
    popup.querySelector('#military_number').value = military_number.textContent;    
    popup.querySelector('#tck_person .inputFilter__title').value = tck_person.textContent;

  }  
}

function btnSaveOrganization() {
  saveOrganization();
  closeWindowPopup();
}

function saveOrganization() {
  organizationName.textContent = popup.querySelector('#organization_name').value;
  organizationCode.textContent = popup.querySelector('#organization_code').value;
  organizationTck.textContent = popup.querySelector('#tck_organization .inputFilter__title').value;
  const comma = organization.querySelector('.comma');
  comma.classList.remove('disable');

  let org = "";
  if (org.textContent != "") {
    org = `${organizationName.textContent}, ${organizationCode.textContent}`;
  }  

  const tableRows = mainBody.querySelectorAll('.tbl__body-row');
  // const tableRows = mainBody.querySelectorAll('.tbl__body-cell[data-name="organization"]');

  tableRows.forEach(row => {
    cellOrganization = row.querySelector('.tbl__body-cell[data-name="organization"]');
    cellOrganization.innerHTML = org;
    cellOrganizationTck = row.querySelector('.tbl__body-cell[data-name="tck_organization"]');
    cellOrganizationTck.innerHTML = organizationTck.textContent;
  });  
}

function btnSavePerson() {
  const form  = popup.querySelector('.dialog-form');
  if (form.dataset.modeEdit == 'true') {
    editPerson();
  } else {
    savePerson();
  }
  
  closeWindowPopup();
}

function editPerson() {

  const selectedRow = mainBody.querySelector(`.tbl__body-row[data-uid="${contextMenuUidRow}"`);
  
  const military = `<div><span class = "rank">${popup.querySelector('#military_rank .inputFilter__title').value}</span>,&nbsp;<span class = "number">${popup.querySelector('#military_number').value}</span></div>`

  selectedRow.querySelector('.tbl__body-cell[data-name="full_name"').innerHTML = popup.querySelector('#full_name').value;
  selectedRow.querySelector('.tbl__body-cell[data-name="birth_year"').innerHTML = popup.querySelector('#birth_year').value;
  selectedRow.querySelector('.tbl__body-cell[data-name="position"').innerHTML = popup.querySelector('#position').value;
  selectedRow.querySelector('.tbl__body-cell[data-name="military"]').innerHTML = military;
  selectedRow.querySelector('.tbl__body-cell[data-name="tck_person"').innerHTML = popup.querySelector('#tck_person .inputFilter__title').value;
}

// savePerson
function savePerson() {
  const tblBodyRows = mainBody.querySelectorAll('.tbl__body-row');
  let pos = 0;
  if (tblBodyRows.length > 0) {
    const lastRow = tblBodyRows[tblBodyRows.length - 1];
    pos = lastRow.querySelector('.tbl__body-cell[data-name="nn"').textContent;
  }
  pos++;

  const military = `<div><span class = "rank">${popup.querySelector('#military_rank .inputFilter__title').value}</span>,&nbsp;<span class = "number">${popup.querySelector('#military_number').value}</span></div>`
  
  let org = "";

  if (organizationName.innerHTML != "") {
    org = `${organizationName.textContent}, ${organizationCode.textContent}`;
  }
  
  const tempTablRow = getElementTableRow([
    ['nn', pos], 
    ['full_name', popup.querySelector('#full_name').value],
    ['birth_year', popup.querySelector('#birth_year').value],
    ['position', popup.querySelector('#position').value],
    ['military', military],
    ['organization', org],
    ['tck_organization', organizationTck.textContent],
    ['tck_person', popup.querySelector('#tck_person .inputFilter__title').value]]);
  
  tempTablRow.dataset.uid = create_UUID();
  mainBody.appendChild(tempTablRow);
}

// addEvenKeyDownForBody
function addEvenKeyDownForBody(event) {
  event.preventDefault();
  if (event.code == "Insert") {
    openDialogFormPerson();
  }
  if (event.code == "Escape") {
    if (popup.classList.contains('active')) {
      const contentActive = popup.querySelector('.content.active');
      if (contentActive)
      {
        contentActive.classList.remove('active');
      } else {
        closeWindowPopup();
      }      
    }
  }  
}

// Переключити відображення контейнера popup
function togglePopupVisible() {
  popup.classList.toggle('active');
}

// Відкрити попап вікно у контейнері popup з шаблону
function openWindowPopup(windowId) {
  const dialogWindow = document.querySelector(windowId);
  const clone = dialogWindow.content.cloneNode(true);
  popup.appendChild(clone);
}

// Видалити дочірні елементи
function removeChildNodes(parentNode) {
  while (parentNode.firstChild) {
    parentNode.firstChild.remove();
  }
}

// openDialogFormPerson
function openDialogFormPerson() { 
  togglePopupVisible();
  openWindowPopup('#dialogFormPerson');  
  getDataForComboBoxPerson();
  setComboBoxEvents();
  focusFirstElemen();
}

// openDialogFormOrganization
function openDialogFormOrganization() {
  const df = popup.querySelector('.dialog-form');
  if (!df) {
    togglePopupVisible();
    openWindowPopup('#dialogFormOrganization');
    getDataForComboBoxOrganization();
    fillDataOrganization();
    setComboBoxEvents();
    focusFirstElemen();
  }  
}

// fillDataOrganization
function fillDataOrganization() {
  popup.querySelector('#organization_name').value = organizationName.textContent;
  popup.querySelector('#organization_code').value = organizationCode.textContent;
  popup.querySelector('#tck_organization .inputFilter__title').value = organizationTck.textContent;
}

function focusFirstElemen() { 
  const firstElement = document.querySelector('.dialog-form__fild>input');
  setTimeout(()=> firstElement.focus() , 100);
}

// getDataForComboBoxPerson
function getDataForComboBoxPerson() {
  fetch(directoryPath + '/json/positions.json').then((res) => res.json()).then((data) => {
    createListItems(data, 'military_rank');
  });

  fetch(directoryPath + '/json/tcksp.json').then((res) => res.json()).then((data) => {
    createListItems(data, 'tck_person');
  });
}

// getDataForComboBoxOrganization
function getDataForComboBoxOrganization() {
  fetch(directoryPath + '/json/tcksp.json').then((res) => res.json()).then((data) => {
    createListItems(data, 'tck_organization');
  });
}

// createListItems
function createListItems(data, comboBoxName) {
  const comboBox = popup.querySelector(`#${comboBoxName}`);
  const items = comboBox.querySelector('.items');
  if (data.length == 0) {
    fillComboBoxNullItem(items);
    return;
  } else {
    emptyElement = items.querySelector('p');
    if (emptyElement) {
      emptyElement.remove();
    }
  }

  data.forEach(element => {
    const el = document.createElement('input');
    el.setAttribute('type', 'text');
    el.readOnly = true;
    el.classList.add('item')
    el.dataset.id = element.id;
    el.value = element.title;
    el.addEventListener('click', function() { updateNameComboBox(this); });
    
    el.addEventListener("keyup", function(event) {
      event.preventDefault();
      if (event.code == "Enter") {        
        updateNameComboBox(this);
      }
    });
    
    items.appendChild(el);
  });
}


function fillComboBoxNullItem(items) {
  item = document.createElement('p');
  item.classList.add('item');
  item.textContent = 'Немає елементів';
  items.appendChild(item); 
}

// updateNameComboBox
function updateNameComboBox(selectedItem) {
  const comboBox = selectedItem.closest('.comboBox');
  const inputFilterTitle = comboBox.querySelector('.inputFilter__title');
  const inputSearchTitle = comboBox.querySelector('.search input');
  const comboBoxContent = comboBox.querySelector('.content');
  inputSearchTitle.value = "";
  inputSearchTitle.dispatchEvent(new Event('keyup'));
  comboBoxContent.classList.remove('active');
  inputFilterTitle.dataset.id = selectedItem.dataset.id;
  inputFilterTitle.value = selectedItem.value;
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
      column.innerHTML = col[1]
    }    
    tagTableRow.appendChild(column)
  });
  
  return tagTableRow
}

function fillDataToJSON() {
  let List = {};

  const dodatok_number = body.querySelector('.dodatok__input').textContent;
  List["dodatok_number"] = dodatok_number;
  
  let company = {};
  company["name"] = organizationName.textContent;
  company["code"] = organizationCode.textContent;
  company["tck"] = organizationTck.textContent;
  List["organization"] = company;
  
  List["people"] = peopleToJson();

  let myjson = JSON.stringify(List); 

  const date = new Date();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  
  let currentDate = `${year}-${month}-${day}`;

  downloadObjectAsJson(myjson, `СПИСОК_${organizationCode.textContent}_${currentDate}_${dodatok_number}`)
  
}

function downloadObjectAsJson(exportObj, exportName) {
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportObj);
  let downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

function peopleToJson() {
  let people = [];
  rows = mainBody.querySelectorAll('.tbl__body-row');
  rows.forEach(row => {
    let person = {}
    person["nn"] = row.querySelector('.tbl__body-cell[data-name="nn"').textContent;
    person["full_name"] = row.querySelector('.tbl__body-cell[data-name="full_name"').textContent;
    person["birth_year"] = row.querySelector('.tbl__body-cell[data-name="birth_year"').textContent;
    person["position"] = row.querySelector('.tbl__body-cell[data-name="position"').textContent;
    person["military_rank"] = row.querySelector('.tbl__body-cell[data-name="military"] .rank').textContent;
    person["military_number"] = row.querySelector('.tbl__body-cell[data-name="military"] .number').textContent;
    person["tck_person"] = row.querySelector('.tbl__body-cell[data-name="tck_person"').textContent;
    people.push(person);
  });
  return people;
}


function loadJson(evt) {
  let file = evt.target.files[0]; 
  let reader = new FileReader();
  reader.readAsText(file,'UTF-8');

  reader.onload = readerEvent => {
    let content = readerEvent.target.result; // this is the content!
    
    let obj = null;

    try {
      obj = JSON.parse(content);
    } catch(e) {
      alert(e);
      return;
    }


    body.querySelector('.dodatok__input').textContent = obj.dodatok_number;
    organizationName.textContent = obj.organization.name;
    organizationCode.textContent = obj.organization.code;
    organizationTck.textContent = obj.organization.tck;
    const comma = organization.querySelector('.comma');
    comma.classList.remove('disable');
   
    removeChildNodes(mainBody);

    let pos = 0;
    obj.people.forEach(person => {
      pos++
      const military = `<div><span class = "rank">${person.military_rank}</span>,&nbsp;<span class = "number">${person.military_number}</span></div>`
      org = `${organizationName.textContent}, ${organizationCode.textContent}`;

      const tempTablRow = getElementTableRow([
        ['nn', pos], 
        ['full_name', person.full_name],
        ['birth_year', person.birth_year],
        ['position', person.position],
        ['military', military],
        ['organization', org],
        ['tck_organization', organizationTck.textContent],
        ['tck_person', person.tck_person]]);
      
      tempTablRow.dataset.uid = create_UUID();
      mainBody.appendChild(tempTablRow);
    });
  }
  closeWindowPopup();
}

function printList() {
  const wrapper = body.querySelector('.wrapper');
  const header = body.querySelector('.header');
  const tblViewCmd = body.querySelector('.tbl-view__cmd');
  const dodatok = body.querySelector('.dodatok');
  const dodatokInput = dodatok.querySelector('.dodatok__input');
  const signature = body.querySelector('.signature');

  wrapper.classList.add('print');
  header.classList.add('print');
  tblViewCmd.classList.add('print');
  dodatok.classList.add('print');
  dodatokInput.classList.add('print');
  signature.classList.add('print');

  window.print();
  wrapper.classList.remove('print');
  header.classList.remove('print');
  tblViewCmd.classList.remove('print');
  dodatok.classList.remove('print');
  dodatokInput.classList.remove('print');
  signature.classList.remove('print');
}


function btnOpenDlgFormChoiceFile() {
  openDialogChoiceFile();  
}

function openDialogChoiceFile() {
  togglePopupVisible();
  openWindowPopup('#choiceFile'); 
  addEventsToFormChoiceFile(); 
}

function addEventsToFormChoiceFile() {
  const btnLoadJson = popup.querySelector('#loadJson');
  btnLoadJson.addEventListener('change', function (evt) {
    loadJson(evt);
  })
}