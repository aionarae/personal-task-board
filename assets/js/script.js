// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskCards = JSON.parse(localStorage.getItem('taskCards')) || [];

const addTask = $('#addTaskButton');
const taskModal = $('#newTaskModal')
const createTask = $ ('#createTask');
const toDoCArds = $('#todo-cards')

// Todo: create a function to generate a unique task id
function generateTaskId() {
  let uniqTaskId = Math.floor(Math.random() + Date.now());
  return uniqTaskId;
}

// Todo: create a function to create a task card
function createTaskCard(cardId, taskTitle, taskDueDate, taskDescription) {

  let newtaskCard =  {
    id: cardId.value,
    title: taskTitle.value,
    dueDate: taskDueDate.value,
    description: taskDescription.value,
  }

  taskCards.push(newtaskCard)
  localStorage.setItem('taskCards', JSON.stringify(taskCards));
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {

  console.log(taskCards)
  console.log(Array.isArray(taskCards));

  //Go through each taskcard in the localstorage
  taskCards.forEach(function(newTaskCard) {
    var divCardColor = $('<div>');
    var todayFormatted = dayjs().format('MM/DD/YYYY')

    // If date is before today, set card background to red
    // If date is after today, set card background to white
    // If date is today, set the card background to yellow
    if (dayjs(todayFormatted).isAfter(dayjs(newTaskCard.dueDate) )  ) {
      divCardColor.addClass('card mb-4 text-white bg-danger')
    } 
    if (dayjs(todayFormatted).isSame(dayjs(newTaskCard.dueDate)) ) {
      divCardColor.addClass('card text-dark bg-warning mb-4')
    } 
    if (dayjs(todayFormatted).isBefore(dayjs(newTaskCard.dueDate))) {
      divCardColor.addClass('card text-dark bg-light mb-4')
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
    deleteTaskButton.addClass('btn btn-danger').css('border-color', 'white');
    deleteTaskButton.text('Delete');

    divCardColor.appendTo(toDoCArds)
    cardTitleH3.appendTo(divCardColor)
    divBody.appendTo(divCardColor)
    cardDescription.appendTo(divBody)
    cardDueDate.appendTo(divBody)
    deleteTaskButton.appendTo(divBody);

    }
  ); 
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
    console.log(taskTitle);
  })

  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

  // Date a date picker
  $( function() {
    $( "#task-due-date" ).datepicker();
  } );

  // Create Task
  createTask.on('click', handleAddTask)

  // Render Task
  renderTaskList();
});

