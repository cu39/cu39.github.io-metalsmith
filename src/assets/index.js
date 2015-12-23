
"use strict";

var app = function() {
  var Foo = require('./js/Foo.js');
  var foo = new Foo();
  console.log(foo.bar);
  foo.hello('John');

  console.log("Contents are loaded.");
};

document.addEventListener('DOMContentLoaded', app);
