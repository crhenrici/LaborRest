"use strict";

describe("TaskList", function() {
  var taskList;

  beforeEach(function () {
    taskList = new TaskList();
    taskList.id = '42';
  });

  it("adds a new element", function () {
    taskList.createTask('test');
    expect(taskList.tasks[0].title).toEqual('test');
  });

  describe("render", function () {
    it("renders ul element", function () {
      expect(taskList.render()).toEqual('ul');
    });

    it("renders empty list when empty", function () {
      expect(taskList.render()).toBeEmpty();
    });
    it("renders tasks", function () {
      taskList.createTask('test task');
      expect(taskList.render().find('input[name=title]').val()).
          toBe('test task');

    });
  });

  describe("toJSON", function() {
    beforeEach(function() {
      taskList.createTask('first');
      taskList.createTask('second');
    });

    it('stores the id', function() {
      expect(taskList.toJSON()).toContain('"id":"42"');
    });
    it('creates a task array', function() {
      expect(taskList.toJSON()).toContain('"tasks":[');
    });

    it('includes the tasks titles', function() {
      expect(taskList.toJSON()).toContain('"title":"first"');
      expect(taskList.toJSON()).toContain('"title":"second"');
    });
    it('includes the tasks stati', function() {
      expect(taskList.toJSON()).toContain('"done":false');
      expect(taskList.toJSON()).toContain('"done":false');
    });
  });


  describe("save (new list)", function() {
    beforeEach(function() {
      taskList.id = undefined;
      taskList.createTask('first');
      taskList.createTask('second');

      // mock the ajax call to the server persisting the tasklist
      spyOn($, "post").and.callFake(function(url, data, callback) {
        callback(JSON.stringify({
          id: '12345',
          title: '',
          tasks: [
            { title: 'first',  done: false },
            { title: 'second', done: false },
          ]}));
      });

      taskList.save();
    });

    it('calls post with the correct URL', function() {
      expect($.post).toHaveBeenCalledWith("http://zhaw.herokuapp.com/task_lists/", jasmine.any(String), jasmine.any(Function));
    });

    it("consumes the id received by the server", function() {
      expect(taskList.id).toEqual('12345');
    });
    // optional exercise
    it("sets the hash", function() {
      expect(window.location.hash).toEqual('#12345');
    });
  });


  describe("save (existing list)", function() {
    beforeEach(function() {
      taskList.id = "0815"
      taskList.createTask('first');
      taskList.createTask('second');

      // mock the ajax call to the server persisting the tasklist
      spyOn($, "post").and.callFake(function(url, data, callback) {
        callback(JSON.stringify({
          id: '0815',
          title: '',
          tasks: [
            { title: 'first',  done: false },
            { title: 'second', done: false },
          ]}));
      });

      taskList.save();
    });

    it('calls post with the correct URL', function() {
      expect($.post).toHaveBeenCalledWith("http://zhaw.herokuapp.com/task_lists/0815", jasmine.any(String), jasmine.any(Function));
    });

    it("consumes the id received by the server", function() {
      expect(taskList.id).toEqual('0815');
    });
    // optional exercise
    xit("sets the hash", function() {
      expect(window.location.hash).toEqual('#0815');
    });
  });
  describe("load", function () {

    var result;

    beforeEach(function () {
      // mock the ajax call to the server loading the tasklist
      spyOn($, "getJSON").and.callFake(function (url, callback) {
        callback({
          id: 'demo-list',
          title: 'the list',
          tasks: [
            {title: 'first task', done: true},
            {title: '2nd task', done: false},
          ]
        });
      });

      // execute a mocked ajax call and populate tasklist into result
      TaskList.load('testlist', function (taskList) {
        result = taskList;
      });
    });

    it('calls getJSON with the correct URL', function() {
      expect($.getJSON).toHaveBeenCalledWith("http://zhaw.herokuapp.com/task_lists/testlist", jasmine.any(Function));
    });

    it("stores the id of the tasklist", function() {
      expect(result.id).toEqual('demo-list');
    });
    it("stores the title of the tasklist", function() {
      expect(result.title).toEqual('the list');
    });

    it("creates a tasklist with 2 entries", function() {
      expect(result.tasks.length).toEqual(2);
    });

    it("populates the titles of the tasklist", function() {
      expect(result.tasks[0].title).toEqual('first task');
      expect(result.tasks[1].title).toEqual('2nd task');
    });

    it("populates the done status of the tasks", function () {
      expect(result.tasks[0].done).toBe(true);
      expect(result.tasks[1].done).toBe(false);
    });
  });

});
