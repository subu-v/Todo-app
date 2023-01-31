// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script.js":[function(require,module,exports) {
var themeDarkImg = document.querySelector(".todo-theme-dark");
var themeLightImg = document.querySelector(".todo-theme-light");
var todoInput = document.querySelector(".todo-input");
var todoNewContainer = document.querySelector(".todo-new-container");
var todoItemsLeft = document.querySelector(".todo-items-left");
var showAllToDos = document.querySelector(".todo-show-all");
var showActiveToDos = document.querySelector(".todo-show-active");
var showCompletedToDos = document.querySelector(".todo-show-completed");
var clearCompletedToDos = document.querySelector(".todo-clear-completed");
var num = 0;
var doneToDos;
var checkImgs;
var allToDos = [];
var activeToDos = [];
var completedToDos = new Set();

// DRAG AND DROP VARIABLES
var newToDos;

// Theme Handlers
themeDarkImg.addEventListener("click", function (e) {
  themeLightImg.style.display = "block";
  themeDarkImg.style.display = "none";
  document.body.classList.add("dark-theme");
});
themeLightImg.addEventListener("click", function (e) {
  themeLightImg.style.display = "none";
  themeDarkImg.style.display = "block";
  document.body.classList.remove("dark-theme");
});

//ToDo
var createTodo = function createTodo(event) {
  var newTodo = "<div class=\"todo-new\" draggable=\"true\">\n                    <div class=\"todo-new--check\">\n                      <div></div>\n                    </div>\n                    <span class=\"todo-new--check-img\" ></span>\n                    <p class=\"todo-new--text\">".concat(event.target.value, "</p>\n                    <span class=\"todo-new--img\"\n                  </div>");
  todoNewContainer.insertAdjacentHTML("afterbegin", newTodo);
  checkImgs = document.querySelectorAll(".todo-new--check-img");
  newToDos = document.querySelectorAll(".todo-new");
  allToDos.push(todoNewContainer.firstChild);
  activeToDos.push(todoNewContainer.firstChild);
  todoItemsLeft.textContent = "".concat(activeToDos.length, " items left");
  dragAndDrop();
};
var removeTodo = function removeTodo() {
  var cancelTodoArray = document.querySelectorAll(".todo-new--img");
  cancelTodoArray.forEach(function (ele) {
    ele.addEventListener("click", function (e) {
      ele.closest(".todo-new").remove();
      allToDos.forEach(function (todo, i) {
        if (e.currentTarget.closest(".todo-new") === todo) {
          allToDos.splice(i, 1);
        }
      });
      activeToDos.forEach(function (todo, i) {
        if (e.currentTarget.closest(".todo-new") === todo) {
          activeToDos.splice(i, 1);
          todoItemsLeft.textContent = "".concat(activeToDos.length, " items left");
        }
      });
    });
  });
};
var completeToDo = function completeToDo() {
  doneToDos = document.querySelectorAll(".todo-new--check");
  doneToDos.forEach(function (ele) {
    ele.addEventListener("click", function (e) {
      var todoTextEle = ele.nextElementSibling.nextElementSibling;
      todoTextEle.style.textDecoration = "line-through";
      todoTextEle.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text-footer");
      ele.querySelector("div").style.background = "-webkit-linear-gradient(" + "#57ddff" + ", " + "#c058f3" + ")";
      ele.nextElementSibling.style.display = "block";
      completedToDos.add(e.currentTarget.closest(".todo-new"));
      activeToDos.forEach(function (todo, i) {
        if (e.currentTarget.closest(".todo-new") === todo) {
          activeToDos.splice(i, 1);
          todoItemsLeft.textContent = "".concat(activeToDos.length, " items left");
        }
      });
    });
  });
};
var undoCompletedToDo = function undoCompletedToDo() {
  checkImgs.forEach(function (ele) {
    ele.addEventListener("click", function (e) {
      var todoTextEle = ele.nextElementSibling;
      todoTextEle.style.textDecoration = "none";
      todoTextEle.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text");
      ele.style.display = "none";
      var checkBox = ele.previousElementSibling.querySelector("div");
      checkBox.style.background = getComputedStyle(document.body).getPropertyValue("--clr-bg-todo");
      var currentTodo = e.currentTarget.closest(".todo-new");
      activeToDos.push(currentTodo);
      todoItemsLeft.textContent = "".concat(activeToDos.length, " items left");
    });
  });
};
todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    createTodo(e);
    removeTodo();
    completeToDo();
    undoCompletedToDo();
    e.target.value = "";
  }
});
showAllToDos.addEventListener("click", function (e) {
  showAllToDos.style.color = "hsl(220, 98%, 61%)";
  allToDos.forEach(function (ele) {
    ele.style.display = "block";
  });
  showCompletedToDos.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text-status");
  showActiveToDos.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text-status");
});
showActiveToDos.addEventListener("click", function (e) {
  showActiveToDos.style.color = "hsl(220, 98%, 61%)";
  showAllToDos.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text-status");
  showCompletedToDos.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text-status");
  allToDos.forEach(function (ele) {
    ele.style.display = "none";
  });
  activeToDos.forEach(function (ele) {
    ele.style.display = "block";
  });
});
showCompletedToDos.addEventListener("click", function (e) {
  showCompletedToDos.style.color = "hsl(220, 98%, 61%)";
  showAllToDos.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text-status");
  showActiveToDos.style.color = getComputedStyle(document.body).getPropertyValue("--clr-text-status");
  if (completedToDos.size === 0) return;
  allToDos.forEach(function (ele) {
    ele.style.display = "none";
  });
  completedToDos.forEach(function (ele) {
    ele.style.display = "block";
  });
});
clearCompletedToDos.addEventListener("click", function (e) {
  completedToDos.forEach(function (ele) {
    ele.remove();
  });
});

// DRAG AND DROP FUNCTIONALITY
var dragStart = function dragStart() {
  console.log("Event: dragStart");
};
var dragEnter = function dragEnter() {
  console.log("Event: dragEnter");
};
var dragLeave = function dragLeave() {
  console.log("Event: dragLeave");
};
var dragOver = function dragOver() {
  console.log("Event: dragOver");
};
var dragDrop = function dragDrop() {
  console.log("Event: dragDrop");
};
var dragAndDrop = function dragAndDrop() {
  newToDos.forEach(function (item) {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
  });
};
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "61337" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map