"use strict";

var taskList;

$(function() {
  taskList = new TaskList();
  taskList.createTask('');
  $('#taskList').html(taskList.render());

  $('#createTask').click(function(event) {
    event.preventDefault();
    var task = taskList.createTask('');
    $('#taskList ul').append(task.render());
  });

  $('#saveTasks').click(function(event) {
    taskList.save();
  });

});
