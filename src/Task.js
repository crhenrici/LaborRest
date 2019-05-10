"use strict";

function Task(title) {
  this.done = false;
  this.title = title || "";
}

Task.prototype.render = function() {
  var $markup;
  var $done = $('<input>', {
    name: 'done',
    type: 'checkbox',
    checked: this.done
  });

  var $title = $('<input>', {
    name: 'title',
    type: 'text'
  }).val(this.title);

  $markup = $('<li>').append([$done, $title]);
  $markup.data('task', this);
  $markup.find('input').change(function(event) {
    var $li = $(this).parent('li');
    var _task = $li.data('task');
    _task.done = $li.find('input[name=done]').is(':checked');
    _task.title = $li.find('input[name=title]').val();
  });
  return $markup;
};

