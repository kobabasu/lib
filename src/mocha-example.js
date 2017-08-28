/**
 * MochaExample
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports.MochaExample = factory(global);
  } else {
    MochaExample = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  function MochaExample() {
  }

  MochaExample.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': MochaExample },
    'change': { 'value': MochaExample_change }
  });

  function MochaExample_change() {
    return 3;
  };

  return MochaExample;
});


/**
 * MochaExampleTwo
 *
 * @return {void}
 */
(function(global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory(global));
  } else if (typeof exports === 'object') {
    module.exports.MochaExampleTwo = factory(global);
  } else {
    MochaExampleTwo = factory(global);
  }
})((this || 0).self || global, function(global) {
  'use strict';

  function MochaExampleTwo() {
  }

  MochaExampleTwo.prototype = Object.create(Object.prototype, {
    'constructor': { 'value': MochaExampleTwo },
    'change': { 'value': MochaExampleTwo_change }
  });

  function MochaExampleTwo_change() {
    return 4;
  };

  return MochaExampleTwo;
});
