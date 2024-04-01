// Retrieve tasks and nextId from localStorage
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskList = JSON.parse(localStorage.getItem('taskList')) || [];

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

  let newTask =  {
    id: cardId,
    title: taskTitle.value,
    dueDate: taskDueDate.value,
    description: taskDescription.value,
  }

  taskList.push(newTask)
  localStorage.setItem('taskList', JSON.stringify(taskList));
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  //Clear the exisitibng task cards
  toDoCArds.empty();

  console.log(taskList)

  //Go through each taskcard in the localstorage
  taskList.forEach(function(newTaskCard) {

    var divCard = $('<div>');
    var todayFormatted = dayjs().format('MM/DD/YYYY')

    // Set background color based on dates
    if (dayjs(todayFormatted).isAfter(dayjs(newTaskCard.dueDate) )  ) {
      divCard.addClass('task-card mb-4 text-white bg-danger')
    } 
    if (dayjs(todayFormatted).isSame(dayjs(newTaskCard.dueDate)) ) {
      divCard.addClass('task-card text-dark bg-warning mb-4')
    } 
    if (dayjs(todayFormatted).isBefore(dayjs(newTaskCard.dueDate))) {
      divCard.addClass('task-card text-dark bg-light mb-4')
    }

    divCard.attr('id', 'task-card');
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

    divCard.appendTo(toDoCArds)
    cardTitleH3.appendTo(divCard)
    divBody.appendTo(divCard)
    cardDescription.appendTo(divBody)
    cardDueDate.appendTo(divBody)
    deleteTaskButton.appendTo(divBody);

    }
  ); 

  //Make cards draggable
  $( function() {
    $( ".task-card" ).draggable();
  } );

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

