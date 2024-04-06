// Функция для сохранения состояния в LocalStorage
function saveState() {
  const state = {
    cardItems: [],
  };

  // Получаем все карточки из DOM
  const cardContainers = document.querySelectorAll('.card-items');
  cardContainers.forEach((container, index) => {
    const cardItems = Array.from(container.querySelectorAll('.card-item')).map(item => item.innerText);
    state.cardItems[index] = cardItems;
  });

  // Сохраняем состояние в LocalStorage
  localStorage.setItem('taskState', JSON.stringify(state));
}

// Функция для загрузки состояния из LocalStorage и построения DOM-дерева
function loadState() {
  // Получаем состояние из LocalStorage
  const stateString = localStorage.getItem('taskState');
  if (!stateString) return; // Если состояние отсутствует, выходим

  const state = JSON.parse(stateString);

  // Восстанавливаем карточки из состояния
  state.cardItems.forEach((cardItems, index) => {
    const container = document.querySelectorAll('.card-items')[index];
    cardItems.forEach(itemText => {
      const cardItem = document.createElement('div');
      cardItem.classList.add('card-item');
      const cardItemParag = document.createElement('p');
      cardItemParag.innerText = itemText;
      cardItem.appendChild(cardItemParag);
      container.appendChild(cardItem);
    });
  });
}

// Вызываем функцию загрузки состояния при загрузке страницы
window.addEventListener('load', loadState);

let cardBtns = document.querySelectorAll('.card-item-btn');
let taskContainers = document.querySelectorAll('.task-container');
let paddingBlocks = document.querySelectorAll('.padding-block');

cardBtns.forEach((cardBtn, index) => {
  let paddingBlock = paddingBlocks[index];

  let cardBox = document.createElement('div');
  let cardTextarea = document.createElement('textarea');
  cardTextarea.placeholder = 'Enter a title for this card...';
  cardBox.classList.add('card-item-textarea');
  cardTextarea.classList.add('card-item-add');
  cardBox.append(cardTextarea);

  let containerAdder = document.createElement('div');
  containerAdder.classList.add('btnBack-container');

  let addBtn = document.createElement('button');
  addBtn.classList.add('card-item-addcard');
  addBtn.innerText = 'Add card';

  let cross = document.createElement('button');
  cross.classList.add('cross');
  cross.innerHTML = '&#215;';

  containerAdder.append(addBtn);
  containerAdder.append(cross);

  cardBtn.addEventListener('click', () => {
    cardBtn.remove();
    paddingBlock.append(cardBox);
    paddingBlock.append(containerAdder);
  })

  addBtn.addEventListener('click', () => {
    let cardItem = document.createElement('div');
    cardItem.classList.add('card-item')

    let cardItemParag = document.createElement('p')

    if (cardTextarea.value !== '') {
      cardItemParag.innerText = cardTextarea.value;
      cardItem.append(cardItemParag);

      taskContainers[index].querySelector('.card-items').append(cardItem);

      cardTextarea.value = '';

      // После добавления карточки обновляем состояние и сохраняем его в LocalStorage
      saveState();
    }
  })

  cross.addEventListener('click', () => {
    cardBox.remove();
    containerAdder.remove();
    taskContainers[index].querySelector('.padding-block').append(cardBtn);

    // После удаления карточки обновляем состояние и сохраняем его в LocalStorage
    saveState();
  })

  let actualElement;

  const onMouseOver = (e) => {
    actualElement.style.top = e.clientY + 'px';
    actualElement.style.left = e.clientX + 'px';
  }

  const onMouseUp = (e) => {
    const mouseUpItem = e.target.closest('.card-item');
    const parent = e.target.closest('.card-items')
  
    try {
      if (mouseUpItem === null) {
        parent.append(actualElement)
      }

      if (actualElement && mouseUpItem && actualElement !== mouseUpItem) {
        // Находим родительский контейнер куда переместить элемент
        const parentContainer = mouseUpItem.closest('.card-items');
        if (parentContainer) {
          // Определяем, перед каким элементом вставить перемещаемый элемент
          const mouseUpItemIndex = Array.from(parentContainer.children).indexOf(mouseUpItem);
          const actualElementIndex = Array.from(parentContainer.children).indexOf(actualElement);
    
          // Вставляем элемент перед или после указанного элемента в зависимости от их индексов
          if (mouseUpItemIndex < actualElementIndex) {
            parentContainer.insertBefore(actualElement, mouseUpItem);
          } else {
            parentContainer.insertBefore(actualElement, mouseUpItem.nextElementSibling);
          }
        }
      }
    } catch (error) {
      console.log(error)
    }

    actualElement.classList.remove('dragged');
    actualElement = undefined;
  
    document.documentElement.removeEventListener('mouseup', onMouseUp);
    document.documentElement.removeEventListener('mouseover', onMouseOver);

    // После завершения перемещения элемента обновляем состояние и сохраняем его в LocalStorage
    saveState();
  }

  taskContainers[index].querySelector('.card-items').addEventListener('mousedown', (e) => {
    e.preventDefault();
    
    actualElement = e.target.closest('.card-item');

    if (!actualElement) {
      return;
    }

    actualElement.classList.add('dragged');

    document.documentElement.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseover', onMouseOver);
  });
});
