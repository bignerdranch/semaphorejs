(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.semaphorejs = global.semaphorejs || {})));
}(this, (function (exports) { 'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let Semaphore = max => {
  let tasks = [];
  let counter = max;

  let dispatch = () => {
    if (counter > 0 && tasks.length > 0) {
      counter--;
      tasks.shift()();
    }
  };

  let release = () => {
    counter++;
    dispatch();
  };

  let acquire = () => new Promise(resolve => {
    tasks.push(resolve);
    setImmediate(dispatch);
  });

  return (() => {
    var _ref = _asyncToGenerator(function* (fn) {
      yield acquire();
      let result;
      try {
        result = yield fn();
      } catch (e) {
        throw e;
      } finally {
        release();
      }
      return result;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })();
};

let limit = (max, fn) => {
  let semaphore = Semaphore(max);
  return (...args) => semaphore(() => fn(...args));
};

exports.limit = limit;
exports['default'] = Semaphore;

Object.defineProperty(exports, '__esModule', { value: true });

})));
