const wrapper = document.querySelector('.wrapper'),
      selectBtn = wrapper.querySelector('.select-btn'),
      options = wrapper.querySelector('.options'),
      searchInput = wrapper.querySelector('.search input');

let positions = [];

selectBtn.addEventListener('click', () => {
  wrapper.classList.toggle('active');
})

searchInput.addEventListener('keyup', () => {
  let arr = [];
  let searchedVal = searchInput.value.toLowerCase();
  arr = positions.filter(data => {
    return data.title.toLowerCase().includes(searchedVal)
  });
  removeChildNodes(options);
  createListItems(arr);
})

fetch('../json/positions.json').then((res) => res.json()).then((data) => {
  positions = data;
  createListItems(positions);
});

function createListItems(data) {
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
}

function removeChildNodes(parentNode) {
  while (parentNode.firstChild) {
    parentNode.firstChild.remove();
  }
}


function updateName(selectedItem) {
  searchInput.value = "";
  wrapper.classList.remove('active');
  selectBtn.firstElementChild.dataset.id = selectedItem.dataset.id;
  selectBtn.firstElementChild.textContent = selectedItem.textContent;
}