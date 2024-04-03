// Retrieve tasks and nextId from localStorage
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskList = JSON.parse(localStorage.getItem('taskList')) || [];

const addTask = $('#addTaskButton');
const taskModal = $('#newTaskModal')
const createTask = $ ('#createTask');
const toDoCards = $('#todo-cards');
const inProgressCards = $('#in-progress-cards');
const doneCards = $('#done-cards')
let droppableContainer = $(".swim-lanes");

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let uniqTaskId = Math.floor(Math.random() + Date.now());
  return uniqTaskId;
}

// Todo: create a function to create a task card
function createTaskCard(cardId, taskTitle, taskDueDate, taskDescription) {

  let newTask =  {
    id: cardId,
    title: taskTitle.value,
    dueDate: taskDueDate.value,
    description: taskDescription.value,
    status: "to-do",
  }

  taskList.push(newTask)
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  //Clear the existing task cards
  toDoCards.empty();
  inProgressCards.empty();
  doneCards.empty();

  //Go through each taskcard in the localstorage
  taskList.forEach(function(newTaskCard) {

    var divCard = $('<div>');
    var todayFormatted = dayjs().format('MM/DD/YYYY')
    divCard.css('max-width','75%')

    // Set background color and text based on dates
    if (dayjs(todayFormatted).isAfter(dayjs(newTaskCard.dueDate) )  ) {
      divCard.addClass('card task-card text-white bg-danger mb-4')
      divCard.attr('id', newTaskCard.id)
    } 
    if (dayjs(todayFormatted).isSame(dayjs(newTaskCard.dueDate)) ) {
      divCard.addClass('card task-card text-light bg-warning mb-4')
      divCard.attr('id', newTaskCard.id)
    } 
    if (dayjs(todayFormatted).isBefore(dayjs(newTaskCard.dueDate))) {
      divCard.addClass('card task-card text-dark bg-light mb-4')
      divCard.attr('id', newTaskCard.id)
    }

    var cardTitleH3 = $('<h3>');
    cardTitleH3.addClass('card-header').text(newTaskCard.title);

    var divBody = $('<div>');
    divBody.addClass('card-body');

    var cardDescription = $('<p>');
    cardDescription.addClass('card-title').text(newTaskCard.description);

    var cardDueDate = $('<p>');
    cardDueDate.addClass('card-text').text(newTaskCard.dueDate);

    var deleteTaskButton = $('<a>');
    deleteTaskButton.attr('href', '#');
    deleteTaskButton.attr('id', newTaskCard.id);
    deleteTaskButton.addClass('delete-button btn btn-danger').css('border-color', 'white');
    deleteTaskButton.text('Delete');

    if (newTaskCard.status === 'to-do') {
      divCard.attr('data-status', 'to-do')
      divCard.appendTo(toDoCards)
    } else if (newTaskCard.status === 'in-progress') {
      divCard.attr('data-status', 'in-progress')
      divCard.appendTo(inProgressCards)
    } else if (newTaskCard.status === 'done') {
      divCard.attr('data-status', 'done')
      divCard.appendTo(doneCards)
    }

    cardTitleH3.appendTo(divCard)
    divBody.appendTo(divCard)
    cardDescription.appendTo(divBody)
    cardDueDate.appendTo(divBody)
    deleteTaskButton.appendTo(divBody);

    deleteTaskButton.on('click', function () {
      let taskId = $(this).attr('id');
      handleDeleteTask(taskId);
    });

    }
  ); 

  //Make cards draggable
    $(".task-card ").draggable({
      containment: ".swim-lanes", 
      snap: ".swim-lanes", 
      snapMode: "inner" 
    });
  }

// Todo: create a function to handle adding a new task
function handleAddTask(event){

  event.preventDefault();

  let cardId = generateTaskId();
  let taskTitle = document.getElementById('task-title') 
  let taskDueDate = document.getElementById('task-due-date')
  let taskDescription = document.getElementById('task-description')

  createTaskCard(cardId, taskTitle, taskDueDate, taskDescription);
  
  //Hide the modal
  taskModal.modal('hide');

  addTask.on('click', function(){
    taskTitle.value = '';
    taskTitle.value = '';
    taskDueDate.value = '';
    taskDescription.value = '';
  })

  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId){
  // Loop through taskList to find the task with the given ID
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == taskId) {
       // Remove the task at 
      taskList.splice(i, 1);
      // Update local storage
      localStorage.setItem('taskList',JSON.stringify(taskList));
      renderTaskList();
      break;
    }
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

// Get the droppable container
  let card = ui.draggable;
  let cardId = card.attr('id')
  let newStatus = event.target.id

  card.attr('data-status', newStatus);

 // Update the task's status in taskList
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == cardId) {
      taskList[i].status = newStatus;
      break;
    }
  }

// Save the updated taskList back to localStorage
  localStorage.setItem('taskList', JSON.stringify(taskList));

// Re-render the task list to reflect the new status
  renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  // Create a date picker
  $( function() {
    $('#task-due-date').datepicker();
  } );

  // Create Task Listener
  createTask.on('click', handleAddTask)

  // Render Task
  renderTaskList();

  //Drop Cards
  $('.lane').droppable({
    accept: '.task-card',
    drop: handleDrop,
  });

});