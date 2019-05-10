"use strict";

function TaskList(title) {
    this.id = null;
    this.tasks = [];
    this.title = title || "";
}

TaskList.prototype.size = function () {
    return this.tasks.length;
};

TaskList.prototype.createTask = function (title) {
    var _task = new Task(title);
    this.tasks.push(_task);
    return _task;
};


TaskList.prototype.render = function () {
    var tasks = [];
    $.each(this.tasks, function (index, task) {
        tasks.push(task.render());
    });

    return $('<ul>').append(tasks);
};

TaskList.prototype.toJSON = function () {
    var obj = { id: this.id, title: this.title, tasks: this.tasks};
    return JSON.stringify(obj);
};

/*
 * persists the tasklist to the server.
 *
 * for tasklists without id (not yet persisted) the id
 * is written back to the model after it is received from
 * the server.
 */
TaskList.prototype.save = function () {
   $.post('http://zhaw.herokuapp.com/task_lists/', JSON.stringify(new TaskList()), function (data) {
       var t = JSON.parse(data);
       //alert(t.id);
   });
};

/*
 * Loads the given tasklist from the server.
 *
 * @param {string} id - unique identifier of the tasklist to load
 * @param {function} callback - method to call after the tasklist
 *   was successfully loaded. receives fully populated tasklist
 *   object as first and only parameter.
 */
TaskList.load = function (id, callback) {
    var taskList = new TaskList();
    $.getJSON('http://zhaw.herokuapp.com/task_lists/' + id, function (data) {
        taskList.id = data.id;
        $.each(data.tasks, function (index, task) {
            var t = taskList.createTask(task.title);
            t.done = task.done;
        });
        taskList.title = data.title;
        callback(taskList);
    });
};
