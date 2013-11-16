;(function (global, module) {
  "use strict";
  if(!global) {
    throw new Error("Unable to determine global object");
  }

  if(global.timers) {
    throw new Error("Timers already registered in global object");
  }

  global.timers = module;

}((!window && global) || window, function (window) {
  "use strict";
  var exports,
    timers = {};

  function now () {
    return window.performance && window.performance.now ?
      window.performance.now() :
      Date.now();
  }

  function createTimer (name, supress) {
    var startTime, endTime, self;

    self = {
      reset: function () {
        startTime = null;
        endTime = null;
      },
      isStopped: function () {
        return !startTime && !endTime;
      },
      isActive: function () {
        return startTime && !endTime;
      },
      isFinished: function () {
        return startTime && endTime;
      },
      getName: function () {
        return name;
      },
      getStartTime: function () {
        return startTime;
      },
      getEndTime: function () {
        return endTime;
      },
      getTime: function () {
        if(!startTime) {
          return undefined;
        }

        if(!self.isFinished()) {
          return now() - self.getStartTime();
        }

        return self.getEndTime() - self.getStartTime();
      },
      start: function () {
        self.reset();
        startTime = now();
      },
      end: function () {
        if(!self.isActive()) {
          throw new Error(
            ["Timer ", name, " is not started"].join("")
          );
        }
        endTime = now();
        return self.getTime();
      }
    };

    if(!supress) {
      self.start();
    }
    return self;
  }

  function getGlobalTimer(name) {
    return timers[name];
  }

  function disposeGlobalTimer(name) {
    timers[name] = undefined;
  }

  function startGlobalTimer(name, supress) {
    timers[name] = createTimer(name, supress);
    return timers[name];
  }

  function stopGlobalTimer(name, keep) {
    if(!timers[name]) {
      throw new Error(
        ["Global timer ", name, " does not exist"].join("")
      );
    }

    var result = timers[name].end();

    if(exports.global && exports.global.DEBUG && console && console.log) {
      console.log(name + ":\t" + result);
    }

    if(!keep) {
      disposeGlobalTimer(name);
    }
    return result;
  }

  function wrapTiming(action, onComplete, name) {
    return function () {
      if(!action) {
        return undefined;
      }
      var timer = createTimer(name || action.name || "wrapped"),
        result;

      result = action.apply(this, arguments);
      timer.stop();
      onComplete(timer, result);
      return result;
    }
  }


  exports = {
    global: {
      DEBUG: true,
      start: startGlobalTimer,
      stop: stopGlobalTimer,
      get: getGlobalTimer
    },
    create: createTimer,
    wrap: wrapTiming
  }

  return exports;
}(window)));
