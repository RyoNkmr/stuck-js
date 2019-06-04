(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof exports === 'object') exports['StuckJs'] = factory();
  else root['StuckJs'] = factory();
})(window, function() {
  return /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {}; // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports;
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }); // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ); // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true; // Return the exports of the module
      /******/
      /******/ /******/ return module.exports;
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules; // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules; // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter,
        });
        /******/
      }
      /******/
    }; // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function(exports) {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module',
        });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    }; // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
      value,
      mode
    ) {
      /******/ if (mode & 1) value = __webpack_require__(value);
      /******/ if (mode & 8) return value;
      /******/ if (
        mode & 4 &&
        typeof value === 'object' &&
        value &&
        value.__esModule
      )
        return value;
      /******/ var ns = Object.create(null);
      /******/ __webpack_require__.r(ns);
      /******/ Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value,
      });
      /******/ if (mode & 2 && typeof value != 'string')
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function(key) {
              return value[key];
            }.bind(null, key)
          );
      /******/ return ns;
      /******/
    }; // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default'];
            }
          : /******/ function getModuleExports() {
              return module;
            };
      /******/ __webpack_require__.d(getter, 'a', getter);
      /******/ return getter;
      /******/
    }; // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property);
    }; // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__(
      (__webpack_require__.s = './src/index.ts')
    );
    /******/
  })(
    /************************************************************************/
    /******/ {
      /***/ './src/index.ts':
        /*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict';

          Object.defineProperty(exports, '__esModule', { value: true });
          var placeholder_1 = __webpack_require__(
            /*! ./placeholder */ './src/placeholder.ts'
          );
          exports.Placeholder = placeholder_1.default;
          var sticky_1 = __webpack_require__(/*! ./sticky */ './src/sticky.ts');
          exports.Sticky = sticky_1.default;
          var stuck_1 = __webpack_require__(/*! ./stuck */ './src/stuck.ts');
          exports.Stuck = stuck_1.default;
          exports.default = stuck_1.default;

          /***/
        },

      /***/ './src/placeholder.ts':
        /*!****************************!*\
  !*** ./src/placeholder.ts ***!
  \****************************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict';

          Object.defineProperty(exports, '__esModule', { value: true });
          var Placeholder = /** @class */ (function() {
            function Placeholder(element, observe, onUpdate) {
              var _this = this;
              if (observe === void 0) {
                observe = true;
              }
              if (onUpdate === void 0) {
                onUpdate = function() {};
              }
              this.$$shouldPlacehold = true;
              this.original = element;
              this.onUpdate =
                typeof onUpdate === 'function' ? onUpdate : function() {};
              this.initialComputedStyles = window.getComputedStyle(
                this.original
              );
              this.initiallyHidden =
                this.initialComputedStyles.display === 'none';
              if (this.initiallyHidden) {
                this.execWhileStucking(function() {
                  _this.initialComputedStyles = window.getComputedStyle(
                    _this.original
                  );
                });
              }
              this.element = Placeholder.createPlaceholderElement();
              this.applyInitialStyles();
              this.cachedRect = this.element && this.updateRect();
              Placeholder.wrap(this.original, this.element);
              if (observe) {
                this.observer = Placeholder.createObserver(
                  this.original,
                  function() {
                    return _this.update();
                  }
                );
              }
            }
            Object.defineProperty(Placeholder.prototype, 'shouldPlacehold', {
              get: function() {
                return !this.initiallyHidden && this.$$shouldPlacehold;
              },
              set: function(value) {
                if (this.shouldPlacehold === value) {
                  return;
                }
                this.$$shouldPlacehold = value;
                this.update(true);
              },
              enumerable: true,
              configurable: true,
            });
            Placeholder.prototype.update = function(forceUpdate) {
              if (forceUpdate === void 0) {
                forceUpdate = false;
              }
              if (this.shouldPlacehold) {
                this.applyStyles(forceUpdate);
              } else {
                this.removeStyles();
              }
              this.onUpdate();
            };
            Placeholder.prototype.updateRect = function() {
              var _this = this;
              this.cachedRect = this.element.getBoundingClientRect();
              if (this.initiallyHidden) {
                this.execWhileStucking(function() {
                  _this.cachedRect = _this.element.getBoundingClientRect();
                });
              }
              return this.cachedRect;
            };
            Placeholder.prototype.destroy = function() {
              if (this.observer) {
                this.observer.disconnect();
                delete this.observer;
              }
              Placeholder.unwrap(this.original);
              delete this.element;
              delete this.original;
              delete this.cachedRect;
              delete this.onUpdate;
            };
            Placeholder.prototype.execWhileStucking = function(execute) {
              var state = this.original.dataset.stuck;
              this.original.dataset.stuck = 'true';
              execute();
              this.original.dataset.stuck = state;
            };
            Placeholder.prototype.applyInitialStyles = function() {
              if (!this.initialComputedStyles || this.initiallyHidden) {
                return;
              }
              this.element.style.margin = this.initialComputedStyles.margin;
              this.element.style.minWidth = this.initialComputedStyles.minWidth;
              this.element.style.minHeight = this.initialComputedStyles.minHeight;
              this.element.style.width = this.initialComputedStyles.width;
              this.element.style.height = this.initialComputedStyles.height;
            };
            Placeholder.prototype.applyStyles = function(forceUpdate) {
              if (forceUpdate === void 0) {
                forceUpdate = false;
              }
              if (!this.original || !this.element) {
                return;
              }
              var _a = this.original.getBoundingClientRect(),
                originalWidth = _a.width,
                originalHeight = _a.height;
              var widthChanged = originalWidth !== this.cachedRect.width;
              var heightChanged = originalHeight !== this.cachedRect.height;
              if (!forceUpdate && !widthChanged && !heightChanged) {
                return;
              }
              if (forceUpdate || widthChanged) {
                this.element.style.width = originalWidth + 'px';
              }
              if (forceUpdate || heightChanged) {
                this.element.style.height = originalHeight + 'px';
              }
              this.updateRect();
            };
            Placeholder.prototype.removeStyles = function() {
              if (!this.original || !this.element) {
                return;
              }
              this.element.style.width = '';
              this.element.style.height = '';
            };
            Placeholder.detectSizeMutation = function(_a) {
              var type = _a.type;
              return type === 'childList' || type === 'attributes';
            };
            Placeholder.createObserver = function(targetNode, callback) {
              if (!targetNode) {
                throw new TypeError(
                  '[Stuck.js] Could not create mutation observer on targetNode ' +
                    String(targetNode) +
                    '. This should be HTMLElement'
                );
              }
              var observer = new MutationObserver(function(mutations) {
                var isMutated = mutations.some(Placeholder.detectSizeMutation);
                if (isMutated) {
                  callback();
                }
              });
              observer.observe(targetNode, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                childList: true,
                subtree: true,
              });
              return observer;
            };
            Placeholder.unwrap = function(target) {
              var wrapper = target.parentNode;
              if (wrapper instanceof HTMLElement) {
                wrapper.insertAdjacentElement('beforebegin', target);
                var parent_1 = wrapper.parentNode;
                if (parent_1 instanceof HTMLElement) {
                  parent_1.removeChild(wrapper);
                }
              }
              return target;
            };
            Placeholder.wrap = function(target, wrapper) {
              if (target.parentNode !== wrapper) {
                target.insertAdjacentElement('beforebegin', wrapper);
                wrapper.appendChild(target);
              }
              return wrapper;
            };
            Placeholder.createPlaceholderElement = function(tagName) {
              if (tagName === void 0) {
                tagName = 'div';
              }
              return document.createElement(tagName);
            };
            return Placeholder;
          })();
          exports.default = Placeholder;

          /***/
        },

      /***/ './src/sticky.ts':
        /*!***********************!*\
  !*** ./src/sticky.ts ***!
  \***********************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict';

          var __assign =
            (this && this.__assign) ||
            function() {
              __assign =
                Object.assign ||
                function(t) {
                  for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                      if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
                  }
                  return t;
                };
              return __assign.apply(this, arguments);
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          var placeholder_1 = __webpack_require__(
            /*! ./placeholder */ './src/placeholder.ts'
          );
          var Sticky = /** @class */ (function() {
            function Sticky(element, options, activate, onUpdate) {
              if (options === void 0) {
                options = { observe: true };
              }
              if (activate === void 0) {
                activate = true;
              }
              if (onUpdate === void 0) {
                onUpdate = function() {};
              }
              this.marginTop = 0;
              this.isStickToBottom = false;
              if (!element) {
                throw new Error('[Stuck-js] Invalid element given');
              }
              this.element = element;
              this.rect = this.element.getBoundingClientRect();
              this.options = __assign({ marginTop: 0 }, options);
              this.marginTop = this.options.marginTop || 0;
              this.setWrapperFromSelectorOrElement(this.options.wrapper);
              this.placeholder = new placeholder_1.default(
                this.element,
                this.options.observe || true,
                onUpdate || Sticky.bulkUpdate
              );
              this.element.dataset.stuck = '';
              Sticky.register(this);
              if (activate) {
                Sticky.activate();
              }
              this.placeholder.shouldPlacehold = this.isSticky;
            }
            Object.defineProperty(Sticky.prototype, 'isSticky', {
              get: function() {
                return (
                  this.element !== null &&
                  this.element.style.position === 'fixed'
                );
              },
              set: function(value) {
                if (this.placeholder) {
                  this.placeholder.shouldPlacehold = value;
                }
                this.element.dataset.stuck = value ? value.toString() : '';
                this.element.style.position = value ? 'fixed' : '';
                this.element.style.top = value ? this.top + 'px' : '';
                this.element.style.left = value
                  ? this.placeholder.updateRect().left + 'px'
                  : '';
                if (value) {
                  this.computePositionTopFromRect();
                }
              },
              enumerable: true,
              configurable: true,
            });
            Object.defineProperty(Sticky.prototype, 'top', {
              get: function() {
                return this.$$additionalTop || this.$$additionalTop === 0
                  ? this.$$additionalTop
                  : this.marginTop;
              },
              set: function(value) {
                this.$$additionalTop = value;
                this.element.style.top = value
                  ? value + 'px'
                  : this.marginTop + 'px';
              },
              enumerable: true,
              configurable: true,
            });
            Object.defineProperty(Sticky.prototype, 'wrapper', {
              get: function() {
                return this.$$wrapper;
              },
              enumerable: true,
              configurable: true,
            });
            Sticky.prototype.setWrapperFromSelectorOrElement = function(
              selectorOrElement
            ) {
              if (!(document.body instanceof HTMLElement)) {
                throw new TypeError(
                  '[Stuck.js] document.body is not HTMLElement in this environment'
                );
              }
              var parent = (
                (this.placeholder && this.placeholder.element) ||
                this.element
              ).parentElement;
              this.$$wrapper = Sticky.normalizeElement(
                selectorOrElement,
                parent,
                document.body
              );
              this.floor = Sticky.computeAbsoluteFloor(this.$$wrapper);
              this.options.wrapper = this.$$wrapper;
            };
            Sticky.computeAbsoluteFloor = function(target) {
              var absoluteBottom =
                target.getBoundingClientRect().bottom + window.pageYOffset;
              var paddingBottom = window.getComputedStyle(target).paddingBottom;
              var paddingBottomPixels =
                paddingBottom !== null ? parseInt(paddingBottom, 10) : 0;
              return absoluteBottom - paddingBottomPixels;
            };
            Sticky.normalizeElement = function(value) {
              var fallbacks = [];
              for (var _i = 1; _i < arguments.length; _i++) {
                fallbacks[_i - 1] = arguments[_i];
              }
              if (value && value instanceof HTMLElement) {
                return value;
              }
              var element = [value && document.querySelector(value)]
                .concat(fallbacks)
                .find(function(item) {
                  return !!item && item instanceof HTMLElement;
                });
              if (element instanceof HTMLElement) {
                return element;
              }
              throw new TypeError('[Stuck-js] Could not find HTMLElement');
            };
            Sticky.register = function(instance) {
              Sticky.instances = Sticky.instances.concat([instance]);
            };
            Sticky.prototype.destroy = function() {
              var _this = this;
              this.isSticky = false;
              this.placeholder.destroy();
              Sticky.instances = Sticky.instances.filter(function(instance) {
                return instance !== _this;
              });
              delete this.placeholder;
              delete this.element;
              delete this.options;
              if (Sticky.instances.length < 1) {
                Sticky.deactivate();
              }
            };
            Sticky.destroyAll = function() {
              Sticky.instances.forEach(function(instance) {
                return instance.destroy();
              });
            };
            Sticky.activate = function() {
              if (!Sticky.activated && Sticky.instances.length > 0) {
                window.addEventListener('scroll', Sticky.bulkUpdate);
                window.addEventListener('resize', Sticky.bulkPlaceholderUpdate);
                Sticky.activated = true;
              }
              Sticky.bulkUpdate();
            };
            Sticky.deactivate = function() {
              if (Sticky.activated) {
                window.removeEventListener('scroll', Sticky.bulkUpdate);
                window.removeEventListener(
                  'resize',
                  Sticky.bulkPlaceholderUpdate
                );
                Sticky.activated = false;
              }
            };
            Sticky.bulkPlaceholderUpdate = function() {
              if (Sticky.bulkUpdateRequestId) {
                window.cancelAnimationFrame(Sticky.bulkUpdateRequestId);
              }
              Sticky.bulkUpdateRequestId = window.requestAnimationFrame(
                function() {
                  Sticky.instances.forEach(function(instance) {
                    instance.placeholder.update();
                    instance.update();
                  });
                }
              );
            };
            Sticky.bulkUpdate = function() {
              if (Sticky.bulkUpdateRequestId) {
                window.cancelAnimationFrame(Sticky.bulkUpdateRequestId);
              }
              Sticky.bulkUpdateRequestId = window.requestAnimationFrame(
                function() {
                  Sticky.instances.forEach(function(instance) {
                    return instance.update();
                  });
                }
              );
            };
            Sticky.prototype.computePositionTopFromRect = function(rect) {
              if (rect === void 0) {
                rect = this.element.getBoundingClientRect();
              }
              this.rect = rect;
              this.floor = Sticky.computeAbsoluteFloor(this.wrapper);
              var relativeFloor = (this.floor || 0) - window.pageYOffset;
              if (this.rect.bottom >= relativeFloor && !this.isStickToBottom) {
                this.top = relativeFloor - this.rect.height;
                this.isStickToBottom = true;
                return;
              }
              if (!this.isStickToBottom) {
                return;
              }
              if (this.rect.top >= this.marginTop) {
                this.top = this.marginTop;
                this.isStickToBottom = false;
                return;
              }
              if (this.rect.top < this.marginTop) {
                this.top = relativeFloor - this.rect.height;
              }
            };
            Sticky.prototype.update = function() {
              var placeholderRect = this.placeholder.element.getBoundingClientRect();
              if (!this.isSticky && this.marginTop > placeholderRect.top) {
                this.isSticky = true;
                return;
              }
              if (this.isSticky) {
                if (placeholderRect.top >= this.marginTop) {
                  this.isSticky = false;
                  return;
                }
                this.rect = this.element.getBoundingClientRect();
                if (this.rect.left !== placeholderRect.left) {
                  this.element.style.left = placeholderRect.left + 'px';
                }
                this.computePositionTopFromRect(this.rect);
              }
            };
            Sticky.instances = [];
            Sticky.activated = false;
            Sticky.bulkUpdateRequestId = null;
            return Sticky;
          })();
          exports.default = Sticky;

          /***/
        },

      /***/ './src/stuck.ts':
        /*!**********************!*\
  !*** ./src/stuck.ts ***!
  \**********************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict';

          var __assign =
            (this && this.__assign) ||
            function() {
              __assign =
                Object.assign ||
                function(t) {
                  for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i];
                    for (var p in s)
                      if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
                  }
                  return t;
                };
              return __assign.apply(this, arguments);
            };
          var __rest =
            (this && this.__rest) ||
            function(s, e) {
              var t = {};
              for (var p in s)
                if (
                  Object.prototype.hasOwnProperty.call(s, p) &&
                  e.indexOf(p) < 0
                )
                  t[p] = s[p];
              if (
                s != null &&
                typeof Object.getOwnPropertySymbols === 'function'
              )
                for (
                  var i = 0, p = Object.getOwnPropertySymbols(s);
                  i < p.length;
                  i++
                ) {
                  if (
                    e.indexOf(p[i]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(s, p[i])
                  )
                    t[p[i]] = s[p[i]];
                }
              return t;
            };
          Object.defineProperty(exports, '__esModule', { value: true });
          var sticky_1 = __webpack_require__(/*! ./sticky */ './src/sticky.ts');
          var getElementsArrayBySetting = function(option) {
            if (option.element) {
              var element = option.element;
              if (element instanceof HTMLElement) {
                return [element];
              }
              if (Array.isArray(element) || typeof element === 'object') {
                return Array.from(element);
              }
            }
            if (option.selector) {
              return Array.from(
                document.querySelectorAll(option.selector)
              ).filter(function(maybeHTMLElement) {
                return maybeHTMLElement instanceof HTMLElement;
              });
            }
            throw new Error(
              '[Stuck.js] No selector, element nor elements in setting'
            );
          };
          var Stuck = /** @class */ (function() {
            function Stuck(settings, defaultOptions, sharedStacking) {
              if (settings === void 0) {
                settings = [];
              }
              if (defaultOptions === void 0) {
                defaultOptions = { observe: true };
              }
              if (sharedStacking === void 0) {
                sharedStacking = true;
              }
              this.instances = [];
              this.defaultOptions = defaultOptions;
              this.create(settings, sharedStacking);
            }
            Stuck.prototype.create = function(source, sharedStacking) {
              var _this = this;
              if (sharedStacking === void 0) {
                sharedStacking = true;
              }
              var settings = Array.isArray(source) ? source : [source];
              var registered = settings.reduce(function(accumulator, setting) {
                return accumulator.concat(
                  _this.register(setting, sharedStacking)
                );
              }, []);
              if (registered.length === 0) {
                return [];
              }
              Stuck.updateAndSort();
              sticky_1.default.activate();
              return registered;
            };
            Stuck.prototype.register = function(_a, sharedStacking) {
              var _this = this;
              if (sharedStacking === void 0) {
                sharedStacking = true;
              }
              var selector = _a.selector,
                element = _a.element,
                options = __rest(_a, ['selector', 'element']);
              var stickies = getElementsArrayBySetting({
                selector: selector,
                element: element,
              })
                .filter(function(target) {
                  return !Stuck.registeredInstances
                    .map(function(instance) {
                      return instance.element;
                    })
                    .includes(target);
                })
                .map(function(newElement) {
                  return new sticky_1.default(
                    newElement,
                    __assign({}, _this.defaultOptions, options),
                    false,
                    Stuck.updateAndSort
                  );
                });
              Stuck.registeredInstances = Stuck.registeredInstances.concat(
                stickies
              );
              this.instances = this.instances.concat(stickies);
              if (sharedStacking) {
                Stuck.stackingStickies = Stuck.stackingStickies.concat(
                  stickies
                );
              }
              return stickies;
            };
            Stuck.prototype.destroy = function() {
              var _this = this;
              Stuck.registeredInstances = Stuck.registeredInstances.filter(
                function(registered) {
                  return !_this.instances.includes(registered);
                }
              );
              Stuck.stackingStickies = Stuck.stackingStickies.filter(function(
                stacking
              ) {
                return !_this.instances.includes(stacking);
              });
              if (Stuck.registeredInstances.length > 0) {
                Stuck.updateAndSort();
              }
              this.instances.forEach(function(instance) {
                return instance.destroy();
              });
              this.instances = [];
            };
            Stuck.updateAndSort = function() {
              Stuck.update();
              Stuck.registeredInstances.sort(function(before, after) {
                return (
                  before.placeholder.cachedRect.top -
                  after.placeholder.cachedRect.top
                );
              });
            };
            Stuck.update = function() {
              Stuck.stackingStickies
                .slice()
                .filter(function(instance, index, all) {
                  return all.indexOf(instance) === index;
                })
                .map(function(instance) {
                  return {
                    instance: instance,
                    rect: instance.placeholder.updateRect(),
                  };
                })
                .sort(function(_a, _b) {
                  var before = _a.rect;
                  var after = _b.rect;
                  return before.top - after.top;
                })
                .reduce(function(ceiling, _a) {
                  var instance = _a.instance;
                  instance.marginTop = instance.options.marginTop + ceiling;
                  return instance.rect.height + instance.marginTop;
                }, 0);
              sticky_1.default.bulkUpdate();
            };
            Stuck.stackingStickies = [];
            Stuck.registeredInstances = [];
            return Stuck;
          })();
          exports.default = Stuck;

          /***/
        },

      /******/
    }
  );
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU3R1Y2tKcy8uL3NyYy9wbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9TdHVja0pzLy4vc3JjL3N0aWNreS50cyIsIndlYnBhY2s6Ly9TdHVja0pzLy4vc3JjL3N0dWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRCxPO0FDVkE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1DQUEyQiwwQkFBMEIsRUFBRTtBQUN2RCx5Q0FBaUMsZUFBZTtBQUNoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4REFBc0QsK0RBQStEOztBQUVySDtBQUNBOzs7QUFHQTtBQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZhO0FBQ2IsOENBQThDLGNBQWM7QUFDNUQsb0JBQW9CLG1CQUFPLENBQUMsMkNBQWU7QUFDM0M7QUFD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aUJBQWlCO0FBQzVFLHdDQUF3Qyx1QkFBdUI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0NBQXdDLHVCQUF1QjtBQUMvRDtBQUNBLDBFQUEwRSxvRUFBb0UsRUFBRTtBQUNoSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3Q0FBd0MsdUJBQXVCO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSwwQ0FBMEMseUJBQXlCLEVBQUU7QUFDckU7QUFDQSxTQUFTO0FBQ1Q7QUFDQSwrREFBK0Q7QUFDL0QsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRGQUE0Riw4Q0FBOEMsRUFBRTtBQUM1SSxvRkFBb0YsNENBQTRDLEVBQUU7QUFDbEk7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELDJCQUEyQixFQUFFO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsK0VBQStFLHdDQUF3QyxFQUFFO0FBQ3pILHNDQUFzQztBQUN0QztBQUNBO0FBQ0EsU0FBUyxFQUFFLEVBQUU7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiU3R1Y2tKc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTdHVja0pzXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHBsYWNlaG9sZGVyXzEgPSByZXF1aXJlKFwiLi9wbGFjZWhvbGRlclwiKTtcbmV4cG9ydHMuUGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcl8xLmRlZmF1bHQ7XG52YXIgc3RpY2t5XzEgPSByZXF1aXJlKFwiLi9zdGlja3lcIik7XG5leHBvcnRzLlN0aWNreSA9IHN0aWNreV8xLmRlZmF1bHQ7XG52YXIgc3R1Y2tfMSA9IHJlcXVpcmUoXCIuL3N0dWNrXCIpO1xuZXhwb3J0cy5TdHVjayA9IHN0dWNrXzEuZGVmYXVsdDtcbmV4cG9ydHMuZGVmYXVsdCA9IHN0dWNrXzEuZGVmYXVsdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFBsYWNlaG9sZGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsYWNlaG9sZGVyKGVsZW1lbnQsIG9ic2VydmUsIG9uVXBkYXRlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChvYnNlcnZlID09PSB2b2lkIDApIHsgb2JzZXJ2ZSA9IHRydWU7IH1cbiAgICAgICAgaWYgKG9uVXBkYXRlID09PSB2b2lkIDApIHsgb25VcGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07IH1cbiAgICAgICAgdGhpcy4kJHNob3VsZFBsYWNlaG9sZCA9IHRydWU7XG4gICAgICAgIHRoaXMub3JpZ2luYWwgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLm9uVXBkYXRlID0gdHlwZW9mIG9uVXBkYXRlID09PSAnZnVuY3Rpb24nID8gb25VcGRhdGUgOiBmdW5jdGlvbiAoKSB7IH07XG4gICAgICAgIHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5vcmlnaW5hbCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGx5SGlkZGVuID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMuZGlzcGxheSA9PT0gJ25vbmUnO1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsbHlIaWRkZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY1doaWxlU3R1Y2tpbmcoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKF90aGlzLm9yaWdpbmFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IFBsYWNlaG9sZGVyLmNyZWF0ZVBsYWNlaG9sZGVyRWxlbWVudCgpO1xuICAgICAgICB0aGlzLmFwcGx5SW5pdGlhbFN0eWxlcygpO1xuICAgICAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLmVsZW1lbnQgJiYgdGhpcy51cGRhdGVSZWN0KCk7XG4gICAgICAgIFBsYWNlaG9sZGVyLndyYXAodGhpcy5vcmlnaW5hbCwgdGhpcy5lbGVtZW50KTtcbiAgICAgICAgaWYgKG9ic2VydmUpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBQbGFjZWhvbGRlci5jcmVhdGVPYnNlcnZlcih0aGlzLm9yaWdpbmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBsYWNlaG9sZGVyLnByb3RvdHlwZSwgXCJzaG91bGRQbGFjZWhvbGRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5pbml0aWFsbHlIaWRkZW4gJiYgdGhpcy4kJHNob3VsZFBsYWNlaG9sZDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZFBsYWNlaG9sZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiQkc2hvdWxkUGxhY2Vob2xkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChmb3JjZVVwZGF0ZSkge1xuICAgICAgICBpZiAoZm9yY2VVcGRhdGUgPT09IHZvaWQgMCkgeyBmb3JjZVVwZGF0ZSA9IGZhbHNlOyB9XG4gICAgICAgIGlmICh0aGlzLnNob3VsZFBsYWNlaG9sZCkge1xuICAgICAgICAgICAgdGhpcy5hcHBseVN0eWxlcyhmb3JjZVVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVN0eWxlcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25VcGRhdGUoKTtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS51cGRhdGVSZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxseUhpZGRlbikge1xuICAgICAgICAgICAgdGhpcy5leGVjV2hpbGVTdHVja2luZyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FjaGVkUmVjdCA9IF90aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRSZWN0O1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyO1xuICAgICAgICB9XG4gICAgICAgIFBsYWNlaG9sZGVyLnVud3JhcCh0aGlzLm9yaWdpbmFsKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudDtcbiAgICAgICAgZGVsZXRlIHRoaXMub3JpZ2luYWw7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNhY2hlZFJlY3Q7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm9uVXBkYXRlO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmV4ZWNXaGlsZVN0dWNraW5nID0gZnVuY3Rpb24gKGV4ZWN1dGUpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5vcmlnaW5hbC5kYXRhc2V0LnN0dWNrO1xuICAgICAgICB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2sgPSAndHJ1ZSc7XG4gICAgICAgIGV4ZWN1dGUoKTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5kYXRhc2V0LnN0dWNrID0gc3RhdGU7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUuYXBwbHlJbml0aWFsU3R5bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzIHx8IHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm1hcmdpbiA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLm1hcmdpbjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm1pbldpZHRoID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMubWluV2lkdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5taW5IZWlnaHQ7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLndpZHRoO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMuaGVpZ2h0O1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmFwcGx5U3R5bGVzID0gZnVuY3Rpb24gKGZvcmNlVXBkYXRlKSB7XG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZSA9PT0gdm9pZCAwKSB7IGZvcmNlVXBkYXRlID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKCF0aGlzLm9yaWdpbmFsIHx8ICF0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX2EgPSB0aGlzLm9yaWdpbmFsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBvcmlnaW5hbFdpZHRoID0gX2Eud2lkdGgsIG9yaWdpbmFsSGVpZ2h0ID0gX2EuaGVpZ2h0O1xuICAgICAgICB2YXIgd2lkdGhDaGFuZ2VkID0gb3JpZ2luYWxXaWR0aCAhPT0gdGhpcy5jYWNoZWRSZWN0LndpZHRoO1xuICAgICAgICB2YXIgaGVpZ2h0Q2hhbmdlZCA9IG9yaWdpbmFsSGVpZ2h0ICE9PSB0aGlzLmNhY2hlZFJlY3QuaGVpZ2h0O1xuICAgICAgICBpZiAoIWZvcmNlVXBkYXRlICYmICF3aWR0aENoYW5nZWQgJiYgIWhlaWdodENoYW5nZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9yY2VVcGRhdGUgfHwgd2lkdGhDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBvcmlnaW5hbFdpZHRoICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZSB8fCBoZWlnaHRDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gb3JpZ2luYWxIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVSZWN0KCk7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUucmVtb3ZlU3R5bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMub3JpZ2luYWwgfHwgIXRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9ICcnO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5kZXRlY3RTaXplTXV0YXRpb24gPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIHR5cGUgPSBfYS50eXBlO1xuICAgICAgICByZXR1cm4gdHlwZSA9PT0gJ2NoaWxkTGlzdCcgfHwgdHlwZSA9PT0gJ2F0dHJpYnV0ZXMnO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIuY3JlYXRlT2JzZXJ2ZXIgPSBmdW5jdGlvbiAodGFyZ2V0Tm9kZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCF0YXJnZXROb2RlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiW1N0dWNrLmpzXSBDb3VsZCBub3QgY3JlYXRlIG11dGF0aW9uIG9ic2VydmVyIG9uIHRhcmdldE5vZGUgXCIgKyBTdHJpbmcodGFyZ2V0Tm9kZSkgKyBcIi4gVGhpcyBzaG91bGQgYmUgSFRNTEVsZW1lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAgICAgdmFyIGlzTXV0YXRlZCA9IG11dGF0aW9ucy5zb21lKFBsYWNlaG9sZGVyLmRldGVjdFNpemVNdXRhdGlvbik7XG4gICAgICAgICAgICBpZiAoaXNNdXRhdGVkKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0Tm9kZSwge1xuICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydzdHlsZScsICdjbGFzcyddLFxuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYnNlcnZlcjtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnVud3JhcCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHdyYXBwZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgd3JhcHBlci5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgdGFyZ2V0KTtcbiAgICAgICAgICAgIHZhciBwYXJlbnRfMSA9IHdyYXBwZXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRfMSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcGFyZW50XzEucmVtb3ZlQ2hpbGQod3JhcHBlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLndyYXAgPSBmdW5jdGlvbiAodGFyZ2V0LCB3cmFwcGVyKSB7XG4gICAgICAgIGlmICh0YXJnZXQucGFyZW50Tm9kZSAhPT0gd3JhcHBlcikge1xuICAgICAgICAgICAgdGFyZ2V0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCB3cmFwcGVyKTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLmNyZWF0ZVBsYWNlaG9sZGVyRWxlbWVudCA9IGZ1bmN0aW9uICh0YWdOYW1lKSB7XG4gICAgICAgIGlmICh0YWdOYW1lID09PSB2b2lkIDApIHsgdGFnTmFtZSA9ICdkaXYnOyB9XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuIFBsYWNlaG9sZGVyO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBsYWNlaG9sZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHBsYWNlaG9sZGVyXzEgPSByZXF1aXJlKFwiLi9wbGFjZWhvbGRlclwiKTtcbnZhciBTdGlja3kgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3RpY2t5KGVsZW1lbnQsIG9wdGlvbnMsIGFjdGl2YXRlLCBvblVwZGF0ZSkge1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7IG9ic2VydmU6IHRydWUgfTsgfVxuICAgICAgICBpZiAoYWN0aXZhdGUgPT09IHZvaWQgMCkgeyBhY3RpdmF0ZSA9IHRydWU7IH1cbiAgICAgICAgaWYgKG9uVXBkYXRlID09PSB2b2lkIDApIHsgb25VcGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07IH1cbiAgICAgICAgdGhpcy5tYXJnaW5Ub3AgPSAwO1xuICAgICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IGZhbHNlO1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignW1N0dWNrLWpzXSBJbnZhbGlkIGVsZW1lbnQgZ2l2ZW4nKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF9fYXNzaWduKHsgbWFyZ2luVG9wOiAwIH0sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm1hcmdpblRvcCA9IHRoaXMub3B0aW9ucy5tYXJnaW5Ub3AgfHwgMDtcbiAgICAgICAgdGhpcy5zZXRXcmFwcGVyRnJvbVNlbGVjdG9yT3JFbGVtZW50KHRoaXMub3B0aW9ucy53cmFwcGVyKTtcbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IG5ldyBwbGFjZWhvbGRlcl8xLmRlZmF1bHQodGhpcy5lbGVtZW50LCB0aGlzLm9wdGlvbnMub2JzZXJ2ZSB8fCB0cnVlLCBvblVwZGF0ZSB8fCBTdGlja3kuYnVsa1VwZGF0ZSk7XG4gICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0dWNrID0gJyc7XG4gICAgICAgIFN0aWNreS5yZWdpc3Rlcih0aGlzKTtcbiAgICAgICAgaWYgKGFjdGl2YXRlKSB7XG4gICAgICAgICAgICBTdGlja3kuYWN0aXZhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyLnNob3VsZFBsYWNlaG9sZCA9IHRoaXMuaXNTdGlja3k7XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdGlja3kucHJvdG90eXBlLCBcImlzU3RpY2t5XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50ICE9PSBudWxsICYmIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlci5zaG91bGRQbGFjZWhvbGQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0dWNrID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJyc7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB2YWx1ZSA/ICdmaXhlZCcgOiAnJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB2YWx1ZSA/IHRoaXMudG9wICsgXCJweFwiIDogJyc7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgPyB0aGlzLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKS5sZWZ0ICsgXCJweFwiXG4gICAgICAgICAgICAgICAgOiAnJztcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVBvc2l0aW9uVG9wRnJvbVJlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0aWNreS5wcm90b3R5cGUsIFwidG9wXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJGFkZGl0aW9uYWxUb3AgfHwgdGhpcy4kJGFkZGl0aW9uYWxUb3AgPT09IDBcbiAgICAgICAgICAgICAgICA/IHRoaXMuJCRhZGRpdGlvbmFsVG9wXG4gICAgICAgICAgICAgICAgOiB0aGlzLm1hcmdpblRvcDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuJCRhZGRpdGlvbmFsVG9wID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdmFsdWUgPyB2YWx1ZSArIFwicHhcIiA6IHRoaXMubWFyZ2luVG9wICsgXCJweFwiO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RpY2t5LnByb3RvdHlwZSwgXCJ3cmFwcGVyXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJHdyYXBwZXI7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFN0aWNreS5wcm90b3R5cGUuc2V0V3JhcHBlckZyb21TZWxlY3Rvck9yRWxlbWVudCA9IGZ1bmN0aW9uIChzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgICAgICBpZiAoIShkb2N1bWVudC5ib2R5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdbU3R1Y2suanNdIGRvY3VtZW50LmJvZHkgaXMgbm90IEhUTUxFbGVtZW50IGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gKCh0aGlzLnBsYWNlaG9sZGVyICYmIHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudCkgfHxcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCkucGFyZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy4kJHdyYXBwZXIgPSBTdGlja3kubm9ybWFsaXplRWxlbWVudChzZWxlY3Rvck9yRWxlbWVudCwgcGFyZW50LCBkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgdGhpcy5mbG9vciA9IFN0aWNreS5jb21wdXRlQWJzb2x1dGVGbG9vcih0aGlzLiQkd3JhcHBlcik7XG4gICAgICAgIHRoaXMub3B0aW9ucy53cmFwcGVyID0gdGhpcy4kJHdyYXBwZXI7XG4gICAgfTtcbiAgICBTdGlja3kuY29tcHV0ZUFic29sdXRlRmxvb3IgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIHZhciBhYnNvbHV0ZUJvdHRvbSA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gKyB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgICAgIHZhciBwYWRkaW5nQm90dG9tID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGFyZ2V0KS5wYWRkaW5nQm90dG9tO1xuICAgICAgICB2YXIgcGFkZGluZ0JvdHRvbVBpeGVscyA9IHBhZGRpbmdCb3R0b20gIT09IG51bGwgPyBwYXJzZUludChwYWRkaW5nQm90dG9tLCAxMCkgOiAwO1xuICAgICAgICByZXR1cm4gYWJzb2x1dGVCb3R0b20gLSBwYWRkaW5nQm90dG9tUGl4ZWxzO1xuICAgIH07XG4gICAgU3RpY2t5Lm5vcm1hbGl6ZUVsZW1lbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdmFyIGZhbGxiYWNrcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgZmFsbGJhY2tzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBbdmFsdWUgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2YWx1ZSldLmNvbmNhdChmYWxsYmFja3MpLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuICEhaXRlbSAmJiBpdGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7IH0pO1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdbU3R1Y2stanNdIENvdWxkIG5vdCBmaW5kIEhUTUxFbGVtZW50Jyk7XG4gICAgfTtcbiAgICBTdGlja3kucmVnaXN0ZXIgPSBmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgU3RpY2t5Lmluc3RhbmNlcyA9IFN0aWNreS5pbnN0YW5jZXMuY29uY2F0KFtpbnN0YW5jZV0pO1xuICAgIH07XG4gICAgU3RpY2t5LnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIuZGVzdHJveSgpO1xuICAgICAgICBTdGlja3kuaW5zdGFuY2VzID0gU3RpY2t5Lmluc3RhbmNlcy5maWx0ZXIoZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiBpbnN0YW5jZSAhPT0gX3RoaXM7IH0pO1xuICAgICAgICBkZWxldGUgdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudDtcbiAgICAgICAgZGVsZXRlIHRoaXMub3B0aW9ucztcbiAgICAgICAgaWYgKFN0aWNreS5pbnN0YW5jZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgU3RpY2t5LmRlYWN0aXZhdGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgU3RpY2t5LmRlc3Ryb3lBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFN0aWNreS5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdGFuY2UpIHsgcmV0dXJuIGluc3RhbmNlLmRlc3Ryb3koKTsgfSk7XG4gICAgfTtcbiAgICBTdGlja3kuYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghU3RpY2t5LmFjdGl2YXRlZCAmJiBTdGlja3kuaW5zdGFuY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBTdGlja3kuYnVsa1VwZGF0ZSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgU3RpY2t5LmJ1bGtQbGFjZWhvbGRlclVwZGF0ZSk7XG4gICAgICAgICAgICBTdGlja3kuYWN0aXZhdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBTdGlja3kuYnVsa1VwZGF0ZSgpO1xuICAgIH07XG4gICAgU3RpY2t5LmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChTdGlja3kuYWN0aXZhdGVkKSB7XG4gICAgICAgICAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgU3RpY2t5LmJ1bGtVcGRhdGUpO1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIFN0aWNreS5idWxrUGxhY2Vob2xkZXJVcGRhdGUpO1xuICAgICAgICAgICAgU3RpY2t5LmFjdGl2YXRlZCA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdGlja3kuYnVsa1BsYWNlaG9sZGVyVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoU3RpY2t5LmJ1bGtVcGRhdGVSZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShTdGlja3kuYnVsa1VwZGF0ZVJlcXVlc3RJZCk7XG4gICAgICAgIH1cbiAgICAgICAgU3RpY2t5LmJ1bGtVcGRhdGVSZXF1ZXN0SWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFN0aWNreS5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5wbGFjZWhvbGRlci51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFN0aWNreS5idWxrVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoU3RpY2t5LmJ1bGtVcGRhdGVSZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZShTdGlja3kuYnVsa1VwZGF0ZVJlcXVlc3RJZCk7XG4gICAgICAgIH1cbiAgICAgICAgU3RpY2t5LmJ1bGtVcGRhdGVSZXF1ZXN0SWQgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFN0aWNreS5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdGFuY2UpIHsgcmV0dXJuIGluc3RhbmNlLnVwZGF0ZSgpOyB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTdGlja3kucHJvdG90eXBlLmNvbXB1dGVQb3NpdGlvblRvcEZyb21SZWN0ID0gZnVuY3Rpb24gKHJlY3QpIHtcbiAgICAgICAgaWYgKHJlY3QgPT09IHZvaWQgMCkgeyByZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyB9XG4gICAgICAgIHRoaXMucmVjdCA9IHJlY3Q7XG4gICAgICAgIHRoaXMuZmxvb3IgPSBTdGlja3kuY29tcHV0ZUFic29sdXRlRmxvb3IodGhpcy53cmFwcGVyKTtcbiAgICAgICAgdmFyIHJlbGF0aXZlRmxvb3IgPSAodGhpcy5mbG9vciB8fCAwKSAtIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgaWYgKHRoaXMucmVjdC5ib3R0b20gPj0gcmVsYXRpdmVGbG9vciAmJiAhdGhpcy5pc1N0aWNrVG9Cb3R0b20pIHtcbiAgICAgICAgICAgIHRoaXMudG9wID0gcmVsYXRpdmVGbG9vciAtIHRoaXMucmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzU3RpY2tUb0JvdHRvbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgICAgICB0aGlzLnRvcCA9IHRoaXMubWFyZ2luVG9wO1xuICAgICAgICAgICAgdGhpcy5pc1N0aWNrVG9Cb3R0b20gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWN0LnRvcCA8IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgICAgICB0aGlzLnRvcCA9IHJlbGF0aXZlRmxvb3IgLSB0aGlzLnJlY3QuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdGlja3kucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyUmVjdCA9IHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RpY2t5ICYmIHRoaXMubWFyZ2luVG9wID4gcGxhY2Vob2xkZXJSZWN0LnRvcCkge1xuICAgICAgICAgICAgdGhpcy5pc1N0aWNreSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNTdGlja3kpIHtcbiAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlclJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N0aWNreSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlY3QubGVmdCAhPT0gcGxhY2Vob2xkZXJSZWN0LmxlZnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHBsYWNlaG9sZGVyUmVjdC5sZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCh0aGlzLnJlY3QpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdGlja3kuaW5zdGFuY2VzID0gW107XG4gICAgU3RpY2t5LmFjdGl2YXRlZCA9IGZhbHNlO1xuICAgIFN0aWNreS5idWxrVXBkYXRlUmVxdWVzdElkID0gbnVsbDtcbiAgICByZXR1cm4gU3RpY2t5O1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0aWNreTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbnZhciBfX3Jlc3QgPSAodGhpcyAmJiB0aGlzLl9fcmVzdCkgfHwgZnVuY3Rpb24gKHMsIGUpIHtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxuICAgICAgICB0W3BdID0gc1twXTtcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChlLmluZGV4T2YocFtpXSkgPCAwICYmIE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChzLCBwW2ldKSlcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcbiAgICAgICAgfVxuICAgIHJldHVybiB0O1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBzdGlja3lfMSA9IHJlcXVpcmUoXCIuL3N0aWNreVwiKTtcbnZhciBnZXRFbGVtZW50c0FycmF5QnlTZXR0aW5nID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIGlmIChvcHRpb24uZWxlbWVudCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IG9wdGlvbi5lbGVtZW50O1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gW2VsZW1lbnRdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnQpIHx8IHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdGlvbi5zZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbi5zZWxlY3RvcikpLmZpbHRlcihmdW5jdGlvbiAobWF5YmVIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG1heWJlSFRNTEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignW1N0dWNrLmpzXSBObyBzZWxlY3RvciwgZWxlbWVudCBub3IgZWxlbWVudHMgaW4gc2V0dGluZycpO1xufTtcbnZhciBTdHVjayA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHVjayhzZXR0aW5ncywgZGVmYXVsdE9wdGlvbnMsIHNoYXJlZFN0YWNraW5nKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncyA9PT0gdm9pZCAwKSB7IHNldHRpbmdzID0gW107IH1cbiAgICAgICAgaWYgKGRlZmF1bHRPcHRpb25zID09PSB2b2lkIDApIHsgZGVmYXVsdE9wdGlvbnMgPSB7IG9ic2VydmU6IHRydWUgfTsgfVxuICAgICAgICBpZiAoc2hhcmVkU3RhY2tpbmcgPT09IHZvaWQgMCkgeyBzaGFyZWRTdGFja2luZyA9IHRydWU7IH1cbiAgICAgICAgdGhpcy5pbnN0YW5jZXMgPSBbXTtcbiAgICAgICAgdGhpcy5kZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuICAgICAgICB0aGlzLmNyZWF0ZShzZXR0aW5ncywgc2hhcmVkU3RhY2tpbmcpO1xuICAgIH1cbiAgICBTdHVjay5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKHNvdXJjZSwgc2hhcmVkU3RhY2tpbmcpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHNoYXJlZFN0YWNraW5nID09PSB2b2lkIDApIHsgc2hhcmVkU3RhY2tpbmcgPSB0cnVlOyB9XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IEFycmF5LmlzQXJyYXkoc291cmNlKSA/IHNvdXJjZSA6IFtzb3VyY2VdO1xuICAgICAgICB2YXIgcmVnaXN0ZXJlZCA9IHNldHRpbmdzLnJlZHVjZShmdW5jdGlvbiAoYWNjdW11bGF0b3IsIHNldHRpbmcpIHsgcmV0dXJuIGFjY3VtdWxhdG9yLmNvbmNhdChfdGhpcy5yZWdpc3RlcihzZXR0aW5nLCBzaGFyZWRTdGFja2luZykpOyB9LCBbXSk7XG4gICAgICAgIGlmIChyZWdpc3RlcmVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIFN0dWNrLnVwZGF0ZUFuZFNvcnQoKTtcbiAgICAgICAgc3RpY2t5XzEuZGVmYXVsdC5hY3RpdmF0ZSgpO1xuICAgICAgICByZXR1cm4gcmVnaXN0ZXJlZDtcbiAgICB9O1xuICAgIFN0dWNrLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChfYSwgc2hhcmVkU3RhY2tpbmcpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHNoYXJlZFN0YWNraW5nID09PSB2b2lkIDApIHsgc2hhcmVkU3RhY2tpbmcgPSB0cnVlOyB9XG4gICAgICAgIHZhciBzZWxlY3RvciA9IF9hLnNlbGVjdG9yLCBlbGVtZW50ID0gX2EuZWxlbWVudCwgb3B0aW9ucyA9IF9fcmVzdChfYSwgW1wic2VsZWN0b3JcIiwgXCJlbGVtZW50XCJdKTtcbiAgICAgICAgdmFyIHN0aWNraWVzID0gZ2V0RWxlbWVudHNBcnJheUJ5U2V0dGluZyh7XG4gICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICB9KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gIVN0dWNrLnJlZ2lzdGVyZWRJbnN0YW5jZXNcbiAgICAgICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UuZWxlbWVudDsgfSlcbiAgICAgICAgICAgICAgICAuaW5jbHVkZXModGFyZ2V0KTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKG5ld0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgc3RpY2t5XzEuZGVmYXVsdChuZXdFbGVtZW50LCBfX2Fzc2lnbih7fSwgX3RoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpLCBmYWxzZSwgU3R1Y2sudXBkYXRlQW5kU29ydCk7XG4gICAgICAgIH0pO1xuICAgICAgICBTdHVjay5yZWdpc3RlcmVkSW5zdGFuY2VzID0gU3R1Y2sucmVnaXN0ZXJlZEluc3RhbmNlcy5jb25jYXQoc3RpY2tpZXMpO1xuICAgICAgICB0aGlzLmluc3RhbmNlcyA9IHRoaXMuaW5zdGFuY2VzLmNvbmNhdChzdGlja2llcyk7XG4gICAgICAgIGlmIChzaGFyZWRTdGFja2luZykge1xuICAgICAgICAgICAgU3R1Y2suc3RhY2tpbmdTdGlja2llcyA9IFN0dWNrLnN0YWNraW5nU3RpY2tpZXMuY29uY2F0KHN0aWNraWVzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RpY2tpZXM7XG4gICAgfTtcbiAgICBTdHVjay5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgU3R1Y2sucmVnaXN0ZXJlZEluc3RhbmNlcyA9IFN0dWNrLnJlZ2lzdGVyZWRJbnN0YW5jZXMuZmlsdGVyKGZ1bmN0aW9uIChyZWdpc3RlcmVkKSB7IHJldHVybiAhX3RoaXMuaW5zdGFuY2VzLmluY2x1ZGVzKHJlZ2lzdGVyZWQpOyB9KTtcbiAgICAgICAgU3R1Y2suc3RhY2tpbmdTdGlja2llcyA9IFN0dWNrLnN0YWNraW5nU3RpY2tpZXMuZmlsdGVyKGZ1bmN0aW9uIChzdGFja2luZykgeyByZXR1cm4gIV90aGlzLmluc3RhbmNlcy5pbmNsdWRlcyhzdGFja2luZyk7IH0pO1xuICAgICAgICBpZiAoU3R1Y2sucmVnaXN0ZXJlZEluc3RhbmNlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBTdHVjay51cGRhdGVBbmRTb3J0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbnN0YW5jZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdGFuY2UpIHsgcmV0dXJuIGluc3RhbmNlLmRlc3Ryb3koKTsgfSk7XG4gICAgICAgIHRoaXMuaW5zdGFuY2VzID0gW107XG4gICAgfTtcbiAgICBTdHVjay51cGRhdGVBbmRTb3J0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBTdHVjay51cGRhdGUoKTtcbiAgICAgICAgU3R1Y2sucmVnaXN0ZXJlZEluc3RhbmNlcy5zb3J0KGZ1bmN0aW9uIChiZWZvcmUsIGFmdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlLnBsYWNlaG9sZGVyLmNhY2hlZFJlY3QudG9wIC0gYWZ0ZXIucGxhY2Vob2xkZXIuY2FjaGVkUmVjdC50b3A7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU3R1Y2sudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBTdHVjay5zdGFja2luZ1N0aWNraWVzLnNsaWNlKCkuZmlsdGVyKGZ1bmN0aW9uIChpbnN0YW5jZSwgaW5kZXgsIGFsbCkgeyByZXR1cm4gYWxsLmluZGV4T2YoaW5zdGFuY2UpID09PSBpbmRleDsgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiAoe1xuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxuICAgICAgICAgICAgcmVjdDogaW5zdGFuY2UucGxhY2Vob2xkZXIudXBkYXRlUmVjdCgpLFxuICAgICAgICB9KTsgfSlcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChfYSwgX2IpIHtcbiAgICAgICAgICAgIHZhciBiZWZvcmUgPSBfYS5yZWN0O1xuICAgICAgICAgICAgdmFyIGFmdGVyID0gX2IucmVjdDtcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmUudG9wIC0gYWZ0ZXIudG9wO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAoY2VpbGluZywgX2EpIHtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IF9hLmluc3RhbmNlO1xuICAgICAgICAgICAgaW5zdGFuY2UubWFyZ2luVG9wID0gaW5zdGFuY2Uub3B0aW9ucy5tYXJnaW5Ub3AgKyBjZWlsaW5nO1xuICAgICAgICAgICAgcmV0dXJuIGluc3RhbmNlLnJlY3QuaGVpZ2h0ICsgaW5zdGFuY2UubWFyZ2luVG9wO1xuICAgICAgICB9LCAwKTtcbiAgICAgICAgc3RpY2t5XzEuZGVmYXVsdC5idWxrVXBkYXRlKCk7XG4gICAgfTtcbiAgICBTdHVjay5zdGFja2luZ1N0aWNraWVzID0gW107XG4gICAgU3R1Y2sucmVnaXN0ZXJlZEluc3RhbmNlcyA9IFtdO1xuICAgIHJldHVybiBTdHVjaztcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTdHVjaztcbiJdLCJzb3VyY2VSb290IjoiIn0=
