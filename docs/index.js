;(function webpackUniversalModuleDefinition(root, factory) {
  if (typeof exports === 'object' && typeof module === 'object')
    module.exports = factory()
  else if (typeof define === 'function' && define.amd) define([], factory)
  else if (typeof exports === 'object') exports['StuckJs'] = factory()
  else root['StuckJs'] = factory()
})(window, function() {
  return /******/ (function(modules) {
    // webpackBootstrap
    /******/ // The module cache
    /******/ var installedModules = {} // The require function
    /******/
    /******/ /******/ function __webpack_require__(moduleId) {
      /******/
      /******/ // Check if module is in cache
      /******/ if (installedModules[moduleId]) {
        /******/ return installedModules[moduleId].exports
        /******/
      } // Create a new module (and put it into the cache)
      /******/ /******/ var module = (installedModules[moduleId] = {
        /******/ i: moduleId,
        /******/ l: false,
        /******/ exports: {},
        /******/
      }) // Execute the module function
      /******/
      /******/ /******/ modules[moduleId].call(
        module.exports,
        module,
        module.exports,
        __webpack_require__
      ) // Flag the module as loaded
      /******/
      /******/ /******/ module.l = true // Return the exports of the module
      /******/
      /******/ /******/ return module.exports
      /******/
    } // expose the modules object (__webpack_modules__)
    /******/
    /******/
    /******/ /******/ __webpack_require__.m = modules // expose the module cache
    /******/
    /******/ /******/ __webpack_require__.c = installedModules // define getter function for harmony exports
    /******/
    /******/ /******/ __webpack_require__.d = function(exports, name, getter) {
      /******/ if (!__webpack_require__.o(exports, name)) {
        /******/ Object.defineProperty(exports, name, {
          enumerable: true,
          get: getter,
        })
        /******/
      }
      /******/
    } // define __esModule on exports
    /******/
    /******/ /******/ __webpack_require__.r = function(exports) {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, {
          value: 'Module',
        })
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true })
      /******/
    } // create a fake namespace object // mode & 1: value is a module id, require it // mode & 2: merge all properties of value into the ns // mode & 4: return value when already ns object // mode & 8|1: behave like require
    /******/
    /******/ /******/ /******/ /******/ /******/ /******/ __webpack_require__.t = function(
      value,
      mode
    ) {
      /******/ if (mode & 1) value = __webpack_require__(value)
      /******/ if (mode & 8) return value
      /******/ if (
        mode & 4 &&
        typeof value === 'object' &&
        value &&
        value.__esModule
      )
        return value
      /******/ var ns = Object.create(null)
      /******/ __webpack_require__.r(ns)
      /******/ Object.defineProperty(ns, 'default', {
        enumerable: true,
        value: value,
      })
      /******/ if (mode & 2 && typeof value != 'string')
        for (var key in value)
          __webpack_require__.d(
            ns,
            key,
            function(key) {
              return value[key]
            }.bind(null, key)
          )
      /******/ return ns
      /******/
    } // getDefaultExport function for compatibility with non-harmony modules
    /******/
    /******/ /******/ __webpack_require__.n = function(module) {
      /******/ var getter =
        module && module.__esModule
          ? /******/ function getDefault() {
              return module['default']
            }
          : /******/ function getModuleExports() {
              return module
            }
      /******/ __webpack_require__.d(getter, 'a', getter)
      /******/ return getter
      /******/
    } // Object.prototype.hasOwnProperty.call
    /******/
    /******/ /******/ __webpack_require__.o = function(object, property) {
      return Object.prototype.hasOwnProperty.call(object, property)
    } // __webpack_public_path__
    /******/
    /******/ /******/ __webpack_require__.p = '' // Load entry module and return exports
    /******/
    /******/
    /******/ /******/ return __webpack_require__(
      (__webpack_require__.s = './src/index.ts')
    )
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
          'use strict'

          Object.defineProperty(exports, '__esModule', { value: true })
          var placeholder_1 = __webpack_require__(
            /*! ./placeholder */ './src/placeholder.ts'
          )
          exports.Placeholder = placeholder_1.default
          var stickyImpl_1 = __webpack_require__(
            /*! ./stickyImpl */ './src/stickyImpl.ts'
          )
          exports.Sticky = stickyImpl_1.default
          var stuckImpl_1 = __webpack_require__(
            /*! ./stuckImpl */ './src/stuckImpl.ts'
          )
          exports.Stuck = stuckImpl_1.default
          exports.default = stuckImpl_1.default

          /***/
        },

      /***/ './src/placeholder.ts':
        /*!****************************!*\
  !*** ./src/placeholder.ts ***!
  \****************************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict'

          Object.defineProperty(exports, '__esModule', { value: true })
          var utility_1 = __webpack_require__(
            /*! ./utility */ './src/utility.ts'
          )
          var Placeholder = /** @class */ (function() {
            function Placeholder(element, observe, onUpdate) {
              var _this = this
              if (observe === void 0) {
                observe = true
              }
              if (onUpdate === void 0) {
                onUpdate = utility_1.noop
              }
              this.$$shouldPlacehold = true
              this.original = element
              this.onUpdate =
                typeof onUpdate === 'function' ? onUpdate : utility_1.noop
              this.initialComputedStyles = window.getComputedStyle(
                this.original
              )
              this.initiallyHidden =
                this.initialComputedStyles.display === 'none'
              if (this.initiallyHidden) {
                this.execWhileStucking(function() {
                  _this.initialComputedStyles = window.getComputedStyle(
                    _this.original
                  )
                })
              }
              this.element = Placeholder.createPlaceholderElement()
              this.applyInitialStyles()
              this.cachedRect = this.element && this.updateRect()
              Placeholder.wrap(this.original, this.element)
              if (observe) {
                this.observer = Placeholder.createObserver(
                  this.original,
                  function() {
                    return _this.update()
                  }
                )
              }
            }
            Object.defineProperty(Placeholder.prototype, 'shouldPlacehold', {
              get: function() {
                return !this.initiallyHidden && this.$$shouldPlacehold
              },
              set: function(value) {
                if (this.shouldPlacehold === value) {
                  return
                }
                this.$$shouldPlacehold = value
                this.update(true)
              },
              enumerable: true,
              configurable: true,
            })
            Placeholder.prototype.update = function(forceUpdate) {
              if (forceUpdate === void 0) {
                forceUpdate = false
              }
              if (this.shouldPlacehold) {
                this.applyStyles(forceUpdate)
              } else {
                this.removeStyles()
              }
              this.onUpdate()
            }
            Placeholder.prototype.updateRect = function() {
              var _this = this
              this.cachedRect = this.element.getBoundingClientRect()
              if (this.initiallyHidden) {
                this.execWhileStucking(function() {
                  _this.cachedRect = _this.element.getBoundingClientRect()
                })
              }
              return this.cachedRect
            }
            Placeholder.prototype.destroy = function() {
              if (this.observer) {
                this.observer.disconnect()
                delete this.observer
              }
              Placeholder.unwrap(this.original)
              delete this.element
              delete this.original
              delete this.cachedRect
              delete this.onUpdate
            }
            Placeholder.prototype.execWhileStucking = function(execute) {
              var state = this.original.dataset.stuck
              this.original.dataset.stuck = 'true'
              execute()
              this.original.dataset.stuck = state
            }
            Placeholder.prototype.applyInitialStyles = function() {
              if (!this.initialComputedStyles || this.initiallyHidden) {
                return
              }
              this.element.style.margin = this.initialComputedStyles.margin
              this.element.style.minWidth = this.initialComputedStyles.minWidth
              this.element.style.minHeight = this.initialComputedStyles.minHeight
              this.element.style.width = this.initialComputedStyles.width
              this.element.style.height = this.initialComputedStyles.height
            }
            Placeholder.prototype.applyStyles = function(forceUpdate) {
              if (forceUpdate === void 0) {
                forceUpdate = false
              }
              if (!this.original || !this.element) {
                return
              }
              var _a = this.original.getBoundingClientRect(),
                originalWidth = _a.width,
                originalHeight = _a.height
              var widthChanged = originalWidth !== this.cachedRect.width
              var heightChanged = originalHeight !== this.cachedRect.height
              if (!forceUpdate && !widthChanged && !heightChanged) {
                return
              }
              if (forceUpdate || widthChanged) {
                this.element.style.width = originalWidth + 'px'
              }
              if (forceUpdate || heightChanged) {
                this.element.style.height = originalHeight + 'px'
              }
              this.updateRect()
            }
            Placeholder.prototype.removeStyles = function() {
              if (!this.original || !this.element) {
                return
              }
              this.element.style.width = ''
              this.element.style.height = ''
            }
            Placeholder.createObserver = function(targetNode, callback) {
              if (!targetNode) {
                throw new TypeError(
                  '[Stuck.js] Could not create mutation observer on targetNode ' +
                    String(targetNode) +
                    '. This should be HTMLElement'
                )
              }
              var detectSizeMutation = function(_a) {
                var type = _a.type
                return type === 'childList' || type === 'attributes'
              }
              var observer = new MutationObserver(function(mutations) {
                var isMutated = mutations.some(detectSizeMutation)
                if (isMutated) {
                  callback()
                }
              })
              observer.observe(targetNode, {
                attributes: true,
                attributeFilter: ['style', 'class'],
                childList: true,
                subtree: true,
              })
              return observer
            }
            Placeholder.unwrap = function(target) {
              var wrapper = target.parentNode
              if (wrapper instanceof HTMLElement) {
                wrapper.insertAdjacentElement('beforebegin', target)
                var parent_1 = wrapper.parentNode
                if (parent_1 instanceof HTMLElement) {
                  parent_1.removeChild(wrapper)
                }
              }
              return target
            }
            Placeholder.wrap = function(target, wrapper) {
              if (target.parentNode !== wrapper) {
                target.insertAdjacentElement('beforebegin', wrapper)
                wrapper.appendChild(target)
              }
              return wrapper
            }
            Placeholder.createPlaceholderElement = function(tagName) {
              if (tagName === void 0) {
                tagName = 'div'
              }
              return document.createElement(tagName)
            }
            return Placeholder
          })()
          exports.default = Placeholder

          /***/
        },

      /***/ './src/stickyImpl.ts':
        /*!***************************!*\
  !*** ./src/stickyImpl.ts ***!
  \***************************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict'

          var __assign =
            (this && this.__assign) ||
            function() {
              __assign =
                Object.assign ||
                function(t) {
                  for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i]
                    for (var p in s)
                      if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p]
                  }
                  return t
                }
              return __assign.apply(this, arguments)
            }
          Object.defineProperty(exports, '__esModule', { value: true })
          var stickyManager_1 = __webpack_require__(
            /*! ./stickyManager */ './src/stickyManager.ts'
          )
          var placeholder_1 = __webpack_require__(
            /*! ./placeholder */ './src/placeholder.ts'
          )
          var utility_1 = __webpack_require__(
            /*! ./utility */ './src/utility.ts'
          )
          var normalizeElement = function(value) {
            var fallbacks = []
            for (var _i = 1; _i < arguments.length; _i++) {
              fallbacks[_i - 1] = arguments[_i]
            }
            if (value && value instanceof HTMLElement) {
              return value
            }
            var element = [value && document.querySelector(value)]
              .concat(fallbacks)
              .find(function(item) {
                return !!item && item instanceof HTMLElement
              })
            if (element instanceof HTMLElement) {
              return element
            }
            throw new TypeError('[Stuck-js] Could not find HTMLElement')
          }
          var computeAbsoluteFloor = function(target) {
            var absoluteBottom =
              target.getBoundingClientRect().bottom + window.pageYOffset
            var paddingBottom = window.getComputedStyle(target).paddingBottom
            var paddingBottomPixels =
              paddingBottom !== null ? parseInt(paddingBottom, 10) : 0
            return absoluteBottom - paddingBottomPixels
          }
          var StickyImpl = /** @class */ (function() {
            function StickyImpl(element, options, activate, onUpdate) {
              if (options === void 0) {
                options = { observe: true }
              }
              if (activate === void 0) {
                activate = true
              }
              if (onUpdate === void 0) {
                onUpdate = utility_1.noop
              }
              this.marginTop = 0
              this.isStickToBottom = false
              this.$$manager = stickyManager_1.stickyManagerInstance.register(
                this
              )
              if (!element) {
                throw new Error('[Stuck-js] Invalid element given')
              }
              this.element = element
              this.rect = this.element.getBoundingClientRect()
              this.options = __assign({ marginTop: 0 }, options)
              this.marginTop = this.options.marginTop || 0
              this.setWrapperFromSelectorOrElement(this.options.wrapper)
              this.placeholder = new placeholder_1.default(
                this.element,
                this.options.observe || true,
                onUpdate || this.$$manager.bulkUpdate
              )
              this.element.dataset.stuck = ''
              if (activate) {
                this.$$manager.activate()
              }
              this.placeholder.shouldPlacehold = this.isSticky
            }
            Object.defineProperty(StickyImpl.prototype, 'isSticky', {
              get: function() {
                return (
                  this.element !== null &&
                  this.element.style.position === 'fixed'
                )
              },
              set: function(value) {
                if (this.placeholder) {
                  this.placeholder.shouldPlacehold = value
                }
                this.element.dataset.stuck = value ? value.toString() : ''
                this.element.style.position = value ? 'fixed' : ''
                this.element.style.top = value ? this.top + 'px' : ''
                this.element.style.left = value
                  ? this.placeholder.updateRect().left + 'px'
                  : ''
                if (value) {
                  this.computePositionTopFromRect()
                }
              },
              enumerable: true,
              configurable: true,
            })
            Object.defineProperty(StickyImpl.prototype, 'top', {
              get: function() {
                return this.$$additionalTop || this.$$additionalTop === 0
                  ? this.$$additionalTop
                  : this.marginTop
              },
              set: function(value) {
                this.$$additionalTop = value
                this.element.style.top = value
                  ? value + 'px'
                  : this.marginTop + 'px'
              },
              enumerable: true,
              configurable: true,
            })
            Object.defineProperty(StickyImpl.prototype, 'wrapper', {
              get: function() {
                return this.$$wrapper
              },
              enumerable: true,
              configurable: true,
            })
            StickyImpl.prototype.setWrapperFromSelectorOrElement = function(
              selectorOrElement
            ) {
              if (!(document.body instanceof HTMLElement)) {
                throw new TypeError(
                  '[Stuck.js] document.body is not HTMLElement in this environment'
                )
              }
              var parent = (
                (this.placeholder && this.placeholder.element) ||
                this.element
              ).parentElement
              this.$$wrapper = normalizeElement(
                selectorOrElement,
                parent,
                document.body
              )
              this.floor = computeAbsoluteFloor(this.$$wrapper)
              this.options.wrapper = this.$$wrapper
            }
            StickyImpl.prototype.destroy = function() {
              this.isSticky = false
              this.placeholder.destroy()
              this.$$manager.unregister(this)
              delete this.placeholder
              delete this.element
              delete this.options
            }
            StickyImpl.prototype.computePositionTopFromRect = function(rect) {
              if (rect === void 0) {
                rect = this.element.getBoundingClientRect()
              }
              this.rect = rect
              this.floor = computeAbsoluteFloor(this.wrapper)
              var relativeFloor = (this.floor || 0) - window.pageYOffset
              if (this.rect.bottom >= relativeFloor && !this.isStickToBottom) {
                this.top = relativeFloor - this.rect.height
                this.isStickToBottom = true
                return
              }
              if (!this.isStickToBottom) {
                return
              }
              if (this.rect.top >= this.marginTop) {
                this.top = this.marginTop
                this.isStickToBottom = false
                return
              }
              if (this.rect.top < this.marginTop) {
                this.top = relativeFloor - this.rect.height
              }
            }
            StickyImpl.prototype.update = function() {
              var placeholderRect = this.placeholder.element.getBoundingClientRect()
              if (!this.isSticky && this.marginTop > placeholderRect.top) {
                this.isSticky = true
                return
              }
              if (this.isSticky) {
                if (placeholderRect.top >= this.marginTop) {
                  this.isSticky = false
                  return
                }
                this.rect = this.element.getBoundingClientRect()
                if (this.rect.left !== placeholderRect.left) {
                  this.element.style.left = placeholderRect.left + 'px'
                }
                this.computePositionTopFromRect(this.rect)
              }
            }
            return StickyImpl
          })()
          exports.default = StickyImpl

          /***/
        },

      /***/ './src/stickyManager.ts':
        /*!******************************!*\
  !*** ./src/stickyManager.ts ***!
  \******************************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict'

          Object.defineProperty(exports, '__esModule', { value: true })
          var StickyManagerImpl = /** @class */ (function() {
            function StickyManagerImpl(_window) {
              this.$$stickies = []
              this.$$activated = false
              this.$$bulkUpdateRequestId = null
              this.$$window = _window
              this.bulkUpdate = this.bulkUpdate.bind(this)
              this.bulkPlaceholderUpdate = this.bulkPlaceholderUpdate.bind(this)
            }
            StickyManagerImpl.getInstance = function(_window) {
              if (!this.$$instance) {
                this.$$instance = new StickyManagerImpl(_window)
              }
              return this.$$instance
            }
            StickyManagerImpl.prototype.register = function(sticky) {
              this.$$stickies = this.$$stickies.concat([sticky])
              return this
            }
            StickyManagerImpl.prototype.unregister = function(sticky) {
              this.$$stickies = this.$$stickies.filter(function(instance) {
                return instance !== sticky
              })
              if (this.$$stickies.length < 1) {
                this.deactivate()
              }
              return this
            }
            StickyManagerImpl.prototype.bulkUpdate = function() {
              var _this = this
              if (this.$$bulkUpdateRequestId) {
                this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId)
              }
              this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(
                function() {
                  _this.$$stickies.forEach(function(instance) {
                    return instance.update()
                  })
                }
              )
              return this
            }
            StickyManagerImpl.prototype.destroyAll = function() {
              this.$$stickies.forEach(function(instance) {
                return instance.destroy()
              })
              this.$$stickies = []
              this.deactivate()
              return this
            }
            StickyManagerImpl.prototype.activate = function() {
              if (!this.$$activated && this.$$stickies.length > 0) {
                this.$$window.addEventListener('scroll', this.bulkUpdate)
                this.$$window.addEventListener(
                  'resize',
                  this.bulkPlaceholderUpdate
                )
                this.$$activated = true
              }
              this.bulkUpdate()
              return this
            }
            StickyManagerImpl.prototype.deactivate = function() {
              if (this.$$activated) {
                this.$$window.removeEventListener('scroll', this.bulkUpdate)
                this.$$window.removeEventListener(
                  'resize',
                  this.bulkPlaceholderUpdate
                )
                this.$$activated = false
              }
              return this
            }
            StickyManagerImpl.prototype.bulkPlaceholderUpdate = function() {
              var _this = this
              if (this.$$bulkUpdateRequestId) {
                this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId)
              }
              this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(
                function() {
                  _this.$$stickies.forEach(function(instance) {
                    instance.placeholder.update()
                    instance.update()
                  })
                }
              )
            }
            return StickyManagerImpl
          })()
          exports.stickyManagerInstance = StickyManagerImpl.getInstance(window)

          /***/
        },

      /***/ './src/stuckImpl.ts':
        /*!**************************!*\
  !*** ./src/stuckImpl.ts ***!
  \**************************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict'

          var __assign =
            (this && this.__assign) ||
            function() {
              __assign =
                Object.assign ||
                function(t) {
                  for (var s, i = 1, n = arguments.length; i < n; i++) {
                    s = arguments[i]
                    for (var p in s)
                      if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p]
                  }
                  return t
                }
              return __assign.apply(this, arguments)
            }
          var __rest =
            (this && this.__rest) ||
            function(s, e) {
              var t = {}
              for (var p in s)
                if (
                  Object.prototype.hasOwnProperty.call(s, p) &&
                  e.indexOf(p) < 0
                )
                  t[p] = s[p]
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
                    t[p[i]] = s[p[i]]
                }
              return t
            }
          Object.defineProperty(exports, '__esModule', { value: true })
          var stuckManager_1 = __webpack_require__(
            /*! ./stuckManager */ './src/stuckManager.ts'
          )
          var stickyImpl_1 = __webpack_require__(
            /*! ./stickyImpl */ './src/stickyImpl.ts'
          )
          var getElementsArrayFromSetting = function(option) {
            if (option.element) {
              var element = option.element
              if (element instanceof HTMLElement) {
                return [element]
              }
              if (Array.isArray(element) || typeof element === 'object') {
                return Array.from(element)
              }
            }
            if (option.selector) {
              return Array.from(
                document.querySelectorAll(option.selector)
              ).filter(function(maybeHTMLElement) {
                return maybeHTMLElement instanceof HTMLElement
              })
            }
            throw new Error(
              '[Stuck.js] No selector, element nor elements in setting'
            )
          }
          var StuckImpl = /** @class */ (function() {
            function StuckImpl(settings, defaultOptions, sharedStacking) {
              if (settings === void 0) {
                settings = []
              }
              if (defaultOptions === void 0) {
                defaultOptions = { observe: true }
              }
              if (sharedStacking === void 0) {
                sharedStacking = true
              }
              this.$$manager = stuckManager_1.stuckManagerInstance.register(
                this
              )
              this.$$instances = []
              this.$$defaultOptions = defaultOptions
              this.create(settings, sharedStacking)
            }
            StuckImpl.prototype.create = function(source, sharedStacking) {
              var _this = this
              if (sharedStacking === void 0) {
                sharedStacking = true
              }
              var settings = Array.isArray(source) ? source : [source]
              var registered = settings.reduce(function(accumulator, setting) {
                return accumulator.concat(
                  _this.register(setting, sharedStacking)
                )
              }, [])
              if (registered.length === 0) {
                return []
              }
              this.$$manager.update()
              return registered
            }
            StuckImpl.prototype.register = function(_a, sharedStacking) {
              var _b
              var _this = this
              if (sharedStacking === void 0) {
                sharedStacking = true
              }
              var selector = _a.selector,
                element = _a.element,
                options = __rest(_a, ['selector', 'element'])
              var registeredInstanceElements = this.$$manager.stickyElements
              var stickies = getElementsArrayFromSetting({
                selector: selector,
                element: element,
              })
                .filter(function(target) {
                  return !registeredInstanceElements.includes(target)
                })
                .map(function(newElement) {
                  return new stickyImpl_1.default(
                    newElement,
                    __assign({}, _this.$$defaultOptions, options),
                    false,
                    function() {
                      _this.$$manager.update()
                    }
                  )
                })
              ;(_b = this.$$manager).addStickies.apply(
                _b,
                [sharedStacking].concat(stickies)
              )
              this.$$instances = this.$$instances.concat(stickies)
              return stickies
            }
            Object.defineProperty(StuckImpl.prototype, 'stickies', {
              get: function() {
                return this.$$instances
              },
              enumerable: true,
              configurable: true,
            })
            StuckImpl.prototype.destroy = function() {
              this.$$manager.unregister(this)
              this.$$instances = []
            }
            return StuckImpl
          })()
          exports.default = StuckImpl

          /***/
        },

      /***/ './src/stuckManager.ts':
        /*!*****************************!*\
  !*** ./src/stuckManager.ts ***!
  \*****************************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict'

          Object.defineProperty(exports, '__esModule', { value: true })
          var stickyManager_1 = __webpack_require__(
            /*! ./stickyManager */ './src/stickyManager.ts'
          )
          var utility_1 = __webpack_require__(
            /*! ./utility */ './src/utility.ts'
          )
          var StuckManagerImpl = /** @class */ (function() {
            function StuckManagerImpl() {
              this.$$stucks = []
              this.$$stickies = []
              this.$$stackingStickies = []
            }
            StuckManagerImpl.getInstance = function() {
              if (!this.$$instance) {
                this.$$instance = new StuckManagerImpl()
              }
              return this.$$instance
            }
            StuckManagerImpl.prototype.register = function(stuck) {
              this.$$stucks = this.$$stucks.concat([stuck])
              return this
            }
            StuckManagerImpl.prototype.unregister = function(stuck) {
              this.destroyStickies.apply(this, stuck.stickies)
              this.$$stucks = this.$$stucks.filter(function(instance) {
                return instance !== stuck
              })
              return this
            }
            Object.defineProperty(StuckManagerImpl.prototype, 'stickies', {
              get: function() {
                return this.$$stickies
              },
              enumerable: true,
              configurable: true,
            })
            Object.defineProperty(
              StuckManagerImpl.prototype,
              'stickyElements',
              {
                get: function() {
                  return this.$$stickies.map(function(sticky) {
                    return sticky.element
                  })
                },
                enumerable: true,
                configurable: true,
              }
            )
            Object.defineProperty(
              StuckManagerImpl.prototype,
              'stackingStickies',
              {
                get: function() {
                  return this.$$stackingStickies
                },
                enumerable: true,
                configurable: true,
              }
            )
            StuckManagerImpl.prototype.addStickies = function(stacking) {
              var stickies = []
              for (var _i = 1; _i < arguments.length; _i++) {
                stickies[_i - 1] = arguments[_i]
              }
              this.$$stickies = this.$$stickies.concat(stickies)
              if (stacking) {
                this.$$stackingStickies = this.$$stackingStickies.concat(
                  stickies
                )
              }
              stickyManager_1.stickyManagerInstance.activate()
              return this
            }
            StuckManagerImpl.prototype.destroyStickies = function() {
              var stickies = []
              for (var _i = 0; _i < arguments.length; _i++) {
                stickies[_i] = arguments[_i]
              }
              stickies.forEach(function(instance) {
                return instance.destroy()
              })
              this.$$stickies = this.$$stickies.filter(function(sticky) {
                return !stickies.includes(sticky)
              })
              this.$$stackingStickies = this.$$stackingStickies.filter(function(
                sticky
              ) {
                return !stickies.includes(sticky)
              })
              if (this.$$stackingStickies.length > 0) {
                this.update()
              }
              return this
            }
            StuckManagerImpl.prototype.update = function() {
              this.$$stackingStickies = this.stackingStickies
                .filter(function(instance, index, all) {
                  return all.indexOf(instance) === index
                })
                .map(function(instance) {
                  return {
                    instance: instance,
                    rect: instance.placeholder.updateRect(),
                  }
                })
                .sort(function(_a, _b) {
                  var before = _a.rect
                  var after = _b.rect
                  return before.top - after.top
                })
                .reduce(
                  function(_a, _b) {
                    var instances = _a.instances,
                      ceiling = _a.ceiling
                    var instance = _b.instance
                    instance.marginTop = instance.options.marginTop + ceiling
                    return {
                      instances: instances.concat([instance]),
                      ceiling: instance.rect.height + instance.marginTop,
                    }
                  },
                  { instances: [], ceiling: 0 }
                ).instances
              stickyManager_1.stickyManagerInstance.bulkUpdate()
              this.$$stickies = utility_1.stableSort(this.stickies, function(
                before,
                after
              ) {
                return (
                  before.placeholder.cachedRect.top -
                  after.placeholder.cachedRect.top
                )
              })
              return this
            }
            return StuckManagerImpl
          })()
          exports.stuckManagerInstance = StuckManagerImpl.getInstance()

          /***/
        },

      /***/ './src/utility.ts':
        /*!************************!*\
  !*** ./src/utility.ts ***!
  \************************/
        /*! no static exports found */
        /***/ function(module, exports, __webpack_require__) {
          'use strict'

          Object.defineProperty(exports, '__esModule', { value: true })
          exports.noop = function() {}
          exports.stableSort = function(array, compareFunction) {
            return array
              .map(function(item, index) {
                return { item: item, index: index }
              })
              .sort(function(before, after) {
                var result = compareFunction(before.item, after.item)
                return result !== 0 ? result : before.index - after.index
              })
              .map(function(_a) {
                var item = _a.item
                return item
              })
          }

          /***/
        },

      /******/
    }
  )
})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU3R1Y2tKcy8uL3NyYy9wbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9TdHVja0pzLy4vc3JjL3N0aWNreUltcGwudHMiLCJ3ZWJwYWNrOi8vU3R1Y2tKcy8uL3NyYy9zdGlja3lNYW5hZ2VyLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvc3R1Y2tJbXBsLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvc3R1Y2tNYW5hZ2VyLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvdXRpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFD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c0NvbnRlbnQiOlsiKGZ1bmN0aW9uIHdlYnBhY2tVbml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uKHJvb3QsIGZhY3RvcnkpIHtcblx0aWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnKVxuXHRcdG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuXHRlbHNlIGlmKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcblx0XHRkZWZpbmUoW10sIGZhY3RvcnkpO1xuXHRlbHNlIGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0Jylcblx0XHRleHBvcnRzW1wiU3R1Y2tKc1wiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTdHVja0pzXCJdID0gZmFjdG9yeSgpO1xufSkod2luZG93LCBmdW5jdGlvbigpIHtcbnJldHVybiAiLCIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHBsYWNlaG9sZGVyXzEgPSByZXF1aXJlKFwiLi9wbGFjZWhvbGRlclwiKTtcbmV4cG9ydHMuUGxhY2Vob2xkZXIgPSBwbGFjZWhvbGRlcl8xLmRlZmF1bHQ7XG52YXIgc3RpY2t5SW1wbF8xID0gcmVxdWlyZShcIi4vc3RpY2t5SW1wbFwiKTtcbmV4cG9ydHMuU3RpY2t5ID0gc3RpY2t5SW1wbF8xLmRlZmF1bHQ7XG52YXIgc3R1Y2tJbXBsXzEgPSByZXF1aXJlKFwiLi9zdHVja0ltcGxcIik7XG5leHBvcnRzLlN0dWNrID0gc3R1Y2tJbXBsXzEuZGVmYXVsdDtcbmV4cG9ydHMuZGVmYXVsdCA9IHN0dWNrSW1wbF8xLmRlZmF1bHQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1dGlsaXR5XzEgPSByZXF1aXJlKFwiLi91dGlsaXR5XCIpO1xudmFyIFBsYWNlaG9sZGVyID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFBsYWNlaG9sZGVyKGVsZW1lbnQsIG9ic2VydmUsIG9uVXBkYXRlKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChvYnNlcnZlID09PSB2b2lkIDApIHsgb2JzZXJ2ZSA9IHRydWU7IH1cbiAgICAgICAgaWYgKG9uVXBkYXRlID09PSB2b2lkIDApIHsgb25VcGRhdGUgPSB1dGlsaXR5XzEubm9vcDsgfVxuICAgICAgICB0aGlzLiQkc2hvdWxkUGxhY2Vob2xkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMub25VcGRhdGUgPSB0eXBlb2Ygb25VcGRhdGUgPT09ICdmdW5jdGlvbicgPyBvblVwZGF0ZSA6IHV0aWxpdHlfMS5ub29wO1xuICAgICAgICB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMub3JpZ2luYWwpO1xuICAgICAgICB0aGlzLmluaXRpYWxseUhpZGRlbiA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLmRpc3BsYXkgPT09ICdub25lJztcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWNXaGlsZVN0dWNraW5nKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShfdGhpcy5vcmlnaW5hbCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQgPSBQbGFjZWhvbGRlci5jcmVhdGVQbGFjZWhvbGRlckVsZW1lbnQoKTtcbiAgICAgICAgdGhpcy5hcHBseUluaXRpYWxTdHlsZXMoKTtcbiAgICAgICAgdGhpcy5jYWNoZWRSZWN0ID0gdGhpcy5lbGVtZW50ICYmIHRoaXMudXBkYXRlUmVjdCgpO1xuICAgICAgICBQbGFjZWhvbGRlci53cmFwKHRoaXMub3JpZ2luYWwsIHRoaXMuZWxlbWVudCk7XG4gICAgICAgIGlmIChvYnNlcnZlKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyID0gUGxhY2Vob2xkZXIuY3JlYXRlT2JzZXJ2ZXIodGhpcy5vcmlnaW5hbCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gX3RoaXMudXBkYXRlKCk7IH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQbGFjZWhvbGRlci5wcm90b3R5cGUsIFwic2hvdWxkUGxhY2Vob2xkXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gIXRoaXMuaW5pdGlhbGx5SGlkZGVuICYmIHRoaXMuJCRzaG91bGRQbGFjZWhvbGQ7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zaG91bGRQbGFjZWhvbGQgPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy4kJHNob3VsZFBsYWNlaG9sZCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGUodHJ1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoZm9yY2VVcGRhdGUpIHtcbiAgICAgICAgaWYgKGZvcmNlVXBkYXRlID09PSB2b2lkIDApIHsgZm9yY2VVcGRhdGUgPSBmYWxzZTsgfVxuICAgICAgICBpZiAodGhpcy5zaG91bGRQbGFjZWhvbGQpIHtcbiAgICAgICAgICAgIHRoaXMuYXBwbHlTdHlsZXMoZm9yY2VVcGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVTdHlsZXMoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uVXBkYXRlKCk7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUudXBkYXRlUmVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jYWNoZWRSZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsbHlIaWRkZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY1doaWxlU3R1Y2tpbmcoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNhY2hlZFJlY3QgPSBfdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2FjaGVkUmVjdDtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcjtcbiAgICAgICAgfVxuICAgICAgICBQbGFjZWhvbGRlci51bndyYXAodGhpcy5vcmlnaW5hbCk7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm9yaWdpbmFsO1xuICAgICAgICBkZWxldGUgdGhpcy5jYWNoZWRSZWN0O1xuICAgICAgICBkZWxldGUgdGhpcy5vblVwZGF0ZTtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS5leGVjV2hpbGVTdHVja2luZyA9IGZ1bmN0aW9uIChleGVjdXRlKSB7XG4gICAgICAgIHZhciBzdGF0ZSA9IHRoaXMub3JpZ2luYWwuZGF0YXNldC5zdHVjaztcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5kYXRhc2V0LnN0dWNrID0gJ3RydWUnO1xuICAgICAgICBleGVjdXRlKCk7XG4gICAgICAgIHRoaXMub3JpZ2luYWwuZGF0YXNldC5zdHVjayA9IHN0YXRlO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmFwcGx5SW5pdGlhbFN0eWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyB8fCB0aGlzLmluaXRpYWxseUhpZGRlbikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5tYXJnaW4gPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5tYXJnaW47XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5taW5XaWR0aCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLm1pbldpZHRoO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMubWluSGVpZ2h0O1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy53aWR0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLmhlaWdodDtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS5hcHBseVN0eWxlcyA9IGZ1bmN0aW9uIChmb3JjZVVwZGF0ZSkge1xuICAgICAgICBpZiAoZm9yY2VVcGRhdGUgPT09IHZvaWQgMCkgeyBmb3JjZVVwZGF0ZSA9IGZhbHNlOyB9XG4gICAgICAgIGlmICghdGhpcy5vcmlnaW5hbCB8fCAhdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF9hID0gdGhpcy5vcmlnaW5hbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgb3JpZ2luYWxXaWR0aCA9IF9hLndpZHRoLCBvcmlnaW5hbEhlaWdodCA9IF9hLmhlaWdodDtcbiAgICAgICAgdmFyIHdpZHRoQ2hhbmdlZCA9IG9yaWdpbmFsV2lkdGggIT09IHRoaXMuY2FjaGVkUmVjdC53aWR0aDtcbiAgICAgICAgdmFyIGhlaWdodENoYW5nZWQgPSBvcmlnaW5hbEhlaWdodCAhPT0gdGhpcy5jYWNoZWRSZWN0LmhlaWdodDtcbiAgICAgICAgaWYgKCFmb3JjZVVwZGF0ZSAmJiAhd2lkdGhDaGFuZ2VkICYmICFoZWlnaHRDaGFuZ2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcmNlVXBkYXRlIHx8IHdpZHRoQ2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gb3JpZ2luYWxXaWR0aCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9yY2VVcGRhdGUgfHwgaGVpZ2h0Q2hhbmdlZCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IG9yaWdpbmFsSGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMudXBkYXRlUmVjdCgpO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLnJlbW92ZVN0eWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLm9yaWdpbmFsIHx8ICF0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSAnJztcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9ICcnO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIuY3JlYXRlT2JzZXJ2ZXIgPSBmdW5jdGlvbiAodGFyZ2V0Tm9kZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCF0YXJnZXROb2RlKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiW1N0dWNrLmpzXSBDb3VsZCBub3QgY3JlYXRlIG11dGF0aW9uIG9ic2VydmVyIG9uIHRhcmdldE5vZGUgXCIgKyBTdHJpbmcodGFyZ2V0Tm9kZSkgKyBcIi4gVGhpcyBzaG91bGQgYmUgSFRNTEVsZW1lbnRcIik7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGRldGVjdFNpemVNdXRhdGlvbiA9IGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgdmFyIHR5cGUgPSBfYS50eXBlO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGUgPT09ICdjaGlsZExpc3QnIHx8IHR5cGUgPT09ICdhdHRyaWJ1dGVzJztcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuICAgICAgICAgICAgdmFyIGlzTXV0YXRlZCA9IG11dGF0aW9ucy5zb21lKGRldGVjdFNpemVNdXRhdGlvbik7XG4gICAgICAgICAgICBpZiAoaXNNdXRhdGVkKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0Tm9kZSwge1xuICAgICAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydzdHlsZScsICdjbGFzcyddLFxuICAgICAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBvYnNlcnZlcjtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnVud3JhcCA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB0YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgaWYgKHdyYXBwZXIgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgd3JhcHBlci5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgdGFyZ2V0KTtcbiAgICAgICAgICAgIHZhciBwYXJlbnRfMSA9IHdyYXBwZXIucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGlmIChwYXJlbnRfMSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgcGFyZW50XzEucmVtb3ZlQ2hpbGQod3JhcHBlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLndyYXAgPSBmdW5jdGlvbiAodGFyZ2V0LCB3cmFwcGVyKSB7XG4gICAgICAgIGlmICh0YXJnZXQucGFyZW50Tm9kZSAhPT0gd3JhcHBlcikge1xuICAgICAgICAgICAgdGFyZ2V0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCB3cmFwcGVyKTtcbiAgICAgICAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gd3JhcHBlcjtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLmNyZWF0ZVBsYWNlaG9sZGVyRWxlbWVudCA9IGZ1bmN0aW9uICh0YWdOYW1lKSB7XG4gICAgICAgIGlmICh0YWdOYW1lID09PSB2b2lkIDApIHsgdGFnTmFtZSA9ICdkaXYnOyB9XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgIH07XG4gICAgcmV0dXJuIFBsYWNlaG9sZGVyO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBsYWNlaG9sZGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHN0aWNreU1hbmFnZXJfMSA9IHJlcXVpcmUoXCIuL3N0aWNreU1hbmFnZXJcIik7XG52YXIgcGxhY2Vob2xkZXJfMSA9IHJlcXVpcmUoXCIuL3BsYWNlaG9sZGVyXCIpO1xudmFyIHV0aWxpdHlfMSA9IHJlcXVpcmUoXCIuL3V0aWxpdHlcIik7XG52YXIgbm9ybWFsaXplRWxlbWVudCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHZhciBmYWxsYmFja3MgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBmYWxsYmFja3NbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIGlmICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgdmFyIGVsZW1lbnQgPSBbdmFsdWUgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2YWx1ZSldLmNvbmNhdChmYWxsYmFja3MpLmZpbmQoZnVuY3Rpb24gKGl0ZW0pIHsgcmV0dXJuICEhaXRlbSAmJiBpdGVtIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQ7IH0pO1xuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1tTdHVjay1qc10gQ291bGQgbm90IGZpbmQgSFRNTEVsZW1lbnQnKTtcbn07XG52YXIgY29tcHV0ZUFic29sdXRlRmxvb3IgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgdmFyIGFic29sdXRlQm90dG9tID0gdGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmJvdHRvbSArIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICB2YXIgcGFkZGluZ0JvdHRvbSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRhcmdldCkucGFkZGluZ0JvdHRvbTtcbiAgICB2YXIgcGFkZGluZ0JvdHRvbVBpeGVscyA9IHBhZGRpbmdCb3R0b20gIT09IG51bGwgPyBwYXJzZUludChwYWRkaW5nQm90dG9tLCAxMCkgOiAwO1xuICAgIHJldHVybiBhYnNvbHV0ZUJvdHRvbSAtIHBhZGRpbmdCb3R0b21QaXhlbHM7XG59O1xudmFyIFN0aWNreUltcGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3RpY2t5SW1wbChlbGVtZW50LCBvcHRpb25zLCBhY3RpdmF0ZSwgb25VcGRhdGUpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0geyBvYnNlcnZlOiB0cnVlIH07IH1cbiAgICAgICAgaWYgKGFjdGl2YXRlID09PSB2b2lkIDApIHsgYWN0aXZhdGUgPSB0cnVlOyB9XG4gICAgICAgIGlmIChvblVwZGF0ZSA9PT0gdm9pZCAwKSB7IG9uVXBkYXRlID0gdXRpbGl0eV8xLm5vb3A7IH1cbiAgICAgICAgdGhpcy5tYXJnaW5Ub3AgPSAwO1xuICAgICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IGZhbHNlO1xuICAgICAgICB0aGlzLiQkbWFuYWdlciA9IHN0aWNreU1hbmFnZXJfMS5zdGlja3lNYW5hZ2VySW5zdGFuY2UucmVnaXN0ZXIodGhpcyk7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbU3R1Y2stanNdIEludmFsaWQgZWxlbWVudCBnaXZlbicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMucmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gX19hc3NpZ24oeyBtYXJnaW5Ub3A6IDAgfSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMubWFyZ2luVG9wID0gdGhpcy5vcHRpb25zLm1hcmdpblRvcCB8fCAwO1xuICAgICAgICB0aGlzLnNldFdyYXBwZXJGcm9tU2VsZWN0b3JPckVsZW1lbnQodGhpcy5vcHRpb25zLndyYXBwZXIpO1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gbmV3IHBsYWNlaG9sZGVyXzEuZGVmYXVsdCh0aGlzLmVsZW1lbnQsIHRoaXMub3B0aW9ucy5vYnNlcnZlIHx8IHRydWUsIG9uVXBkYXRlIHx8IHRoaXMuJCRtYW5hZ2VyLmJ1bGtVcGRhdGUpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdHVjayA9ICcnO1xuICAgICAgICBpZiAoYWN0aXZhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuJCRtYW5hZ2VyLmFjdGl2YXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlci5zaG91bGRQbGFjZWhvbGQgPSB0aGlzLmlzU3RpY2t5O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RpY2t5SW1wbC5wcm90b3R5cGUsIFwiaXNTdGlja3lcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQgIT09IG51bGwgJiYgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyLnNob3VsZFBsYWNlaG9sZCA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQuc3R1Y2sgPSB2YWx1ZSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IHZhbHVlID8gJ2ZpeGVkJyA6ICcnO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHZhbHVlID8gdGhpcy50b3AgKyBcInB4XCIgOiAnJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gdmFsdWVcbiAgICAgICAgICAgICAgICA/IHRoaXMucGxhY2Vob2xkZXIudXBkYXRlUmVjdCgpLmxlZnQgKyBcInB4XCJcbiAgICAgICAgICAgICAgICA6ICcnO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RpY2t5SW1wbC5wcm90b3R5cGUsIFwidG9wXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJGFkZGl0aW9uYWxUb3AgfHwgdGhpcy4kJGFkZGl0aW9uYWxUb3AgPT09IDBcbiAgICAgICAgICAgICAgICA/IHRoaXMuJCRhZGRpdGlvbmFsVG9wXG4gICAgICAgICAgICAgICAgOiB0aGlzLm1hcmdpblRvcDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuJCRhZGRpdGlvbmFsVG9wID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdmFsdWUgPyB2YWx1ZSArIFwicHhcIiA6IHRoaXMubWFyZ2luVG9wICsgXCJweFwiO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RpY2t5SW1wbC5wcm90b3R5cGUsIFwid3JhcHBlclwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCR3cmFwcGVyO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBTdGlja3lJbXBsLnByb3RvdHlwZS5zZXRXcmFwcGVyRnJvbVNlbGVjdG9yT3JFbGVtZW50ID0gZnVuY3Rpb24gKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgICAgIGlmICghKGRvY3VtZW50LmJvZHkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1tTdHVjay5qc10gZG9jdW1lbnQuYm9keSBpcyBub3QgSFRNTEVsZW1lbnQgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSAoKHRoaXMucGxhY2Vob2xkZXIgJiYgdGhpcy5wbGFjZWhvbGRlci5lbGVtZW50KSB8fFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50KS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB0aGlzLiQkd3JhcHBlciA9IG5vcm1hbGl6ZUVsZW1lbnQoc2VsZWN0b3JPckVsZW1lbnQsIHBhcmVudCwgZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIHRoaXMuZmxvb3IgPSBjb21wdXRlQWJzb2x1dGVGbG9vcih0aGlzLiQkd3JhcHBlcik7XG4gICAgICAgIHRoaXMub3B0aW9ucy53cmFwcGVyID0gdGhpcy4kJHdyYXBwZXI7XG4gICAgfTtcbiAgICBTdGlja3lJbXBsLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiQkbWFuYWdlci51bnJlZ2lzdGVyKHRoaXMpO1xuICAgICAgICBkZWxldGUgdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudDtcbiAgICAgICAgZGVsZXRlIHRoaXMub3B0aW9ucztcbiAgICB9O1xuICAgIFN0aWNreUltcGwucHJvdG90eXBlLmNvbXB1dGVQb3NpdGlvblRvcEZyb21SZWN0ID0gZnVuY3Rpb24gKHJlY3QpIHtcbiAgICAgICAgaWYgKHJlY3QgPT09IHZvaWQgMCkgeyByZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyB9XG4gICAgICAgIHRoaXMucmVjdCA9IHJlY3Q7XG4gICAgICAgIHRoaXMuZmxvb3IgPSBjb21wdXRlQWJzb2x1dGVGbG9vcih0aGlzLndyYXBwZXIpO1xuICAgICAgICB2YXIgcmVsYXRpdmVGbG9vciA9ICh0aGlzLmZsb29yIHx8IDApIC0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICBpZiAodGhpcy5yZWN0LmJvdHRvbSA+PSByZWxhdGl2ZUZsb29yICYmICF0aGlzLmlzU3RpY2tUb0JvdHRvbSkge1xuICAgICAgICAgICAgdGhpcy50b3AgPSByZWxhdGl2ZUZsb29yIC0gdGhpcy5yZWN0LmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuaXNTdGlja1RvQm90dG9tID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNTdGlja1RvQm90dG9tKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjdC50b3AgPj0gdGhpcy5tYXJnaW5Ub3ApIHtcbiAgICAgICAgICAgIHRoaXMudG9wID0gdGhpcy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlY3QudG9wIDwgdGhpcy5tYXJnaW5Ub3ApIHtcbiAgICAgICAgICAgIHRoaXMudG9wID0gcmVsYXRpdmVGbG9vciAtIHRoaXMucmVjdC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN0aWNreUltcGwucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyUmVjdCA9IHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RpY2t5ICYmIHRoaXMubWFyZ2luVG9wID4gcGxhY2Vob2xkZXJSZWN0LnRvcCkge1xuICAgICAgICAgICAgdGhpcy5pc1N0aWNreSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNTdGlja3kpIHtcbiAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlclJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N0aWNreSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlY3QubGVmdCAhPT0gcGxhY2Vob2xkZXJSZWN0LmxlZnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHBsYWNlaG9sZGVyUmVjdC5sZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCh0aGlzLnJlY3QpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU3RpY2t5SW1wbDtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTdGlja3lJbXBsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3RpY2t5TWFuYWdlckltcGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3RpY2t5TWFuYWdlckltcGwoX3dpbmRvdykge1xuICAgICAgICB0aGlzLiQkc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgdGhpcy4kJGFjdGl2YXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCA9IG51bGw7XG4gICAgICAgIHRoaXMuJCR3aW5kb3cgPSBfd2luZG93O1xuICAgICAgICB0aGlzLmJ1bGtVcGRhdGUgPSB0aGlzLmJ1bGtVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUgPSB0aGlzLmJ1bGtQbGFjZWhvbGRlclVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBTdGlja3lNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIChfd2luZG93KSB7XG4gICAgICAgIGlmICghdGhpcy4kJGluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLiQkaW5zdGFuY2UgPSBuZXcgU3RpY2t5TWFuYWdlckltcGwoX3dpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuJCRpbnN0YW5jZTtcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChzdGlja3kpIHtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzID0gdGhpcy4kJHN0aWNraWVzLmNvbmNhdChbc3RpY2t5XSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3RpY2t5TWFuYWdlckltcGwucHJvdG90eXBlLnVucmVnaXN0ZXIgPSBmdW5jdGlvbiAoc3RpY2t5KSB7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5maWx0ZXIoZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiBpbnN0YW5jZSAhPT0gc3RpY2t5OyB9KTtcbiAgICAgICAgaWYgKHRoaXMuJCRzdGlja2llcy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5idWxrVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuJCR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkID0gdGhpcy4kJHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuJCRzdGlja2llcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UudXBkYXRlKCk7IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdGlja3lNYW5hZ2VySW1wbC5wcm90b3R5cGUuZGVzdHJveUFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiBpbnN0YW5jZS5kZXN0cm95KCk7IH0pO1xuICAgICAgICB0aGlzLiQkc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3RpY2t5TWFuYWdlckltcGwucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuJCRhY3RpdmF0ZWQgJiYgdGhpcy4kJHN0aWNraWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuJCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5idWxrVXBkYXRlKTtcbiAgICAgICAgICAgIHRoaXMuJCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUpO1xuICAgICAgICAgICAgdGhpcy4kJGFjdGl2YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWxrVXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3RpY2t5TWFuYWdlckltcGwucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLiQkYWN0aXZhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLiQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuYnVsa1VwZGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlKTtcbiAgICAgICAgICAgIHRoaXMuJCRhY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5idWxrUGxhY2Vob2xkZXJVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCkge1xuICAgICAgICAgICAgdGhpcy4kJHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQgPSB0aGlzLiQkd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy4kJHN0aWNraWVzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UucGxhY2Vob2xkZXIudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gU3RpY2t5TWFuYWdlckltcGw7XG59KCkpO1xuZXhwb3J0cy5zdGlja3lNYW5hZ2VySW5zdGFuY2UgPSBTdGlja3lNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZSh3aW5kb3cpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHN0dWNrTWFuYWdlcl8xID0gcmVxdWlyZShcIi4vc3R1Y2tNYW5hZ2VyXCIpO1xudmFyIHN0aWNreUltcGxfMSA9IHJlcXVpcmUoXCIuL3N0aWNreUltcGxcIik7XG52YXIgZ2V0RWxlbWVudHNBcnJheUZyb21TZXR0aW5nID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIGlmIChvcHRpb24uZWxlbWVudCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IG9wdGlvbi5lbGVtZW50O1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gW2VsZW1lbnRdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnQpIHx8IHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdGlvbi5zZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbi5zZWxlY3RvcikpLmZpbHRlcihmdW5jdGlvbiAobWF5YmVIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG1heWJlSFRNTEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignW1N0dWNrLmpzXSBObyBzZWxlY3RvciwgZWxlbWVudCBub3IgZWxlbWVudHMgaW4gc2V0dGluZycpO1xufTtcbnZhciBTdHVja0ltcGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3R1Y2tJbXBsKHNldHRpbmdzLCBkZWZhdWx0T3B0aW9ucywgc2hhcmVkU3RhY2tpbmcpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSBbXTsgfVxuICAgICAgICBpZiAoZGVmYXVsdE9wdGlvbnMgPT09IHZvaWQgMCkgeyBkZWZhdWx0T3B0aW9ucyA9IHsgb2JzZXJ2ZTogdHJ1ZSB9OyB9XG4gICAgICAgIGlmIChzaGFyZWRTdGFja2luZyA9PT0gdm9pZCAwKSB7IHNoYXJlZFN0YWNraW5nID0gdHJ1ZTsgfVxuICAgICAgICB0aGlzLiQkbWFuYWdlciA9IHN0dWNrTWFuYWdlcl8xLnN0dWNrTWFuYWdlckluc3RhbmNlLnJlZ2lzdGVyKHRoaXMpO1xuICAgICAgICB0aGlzLiQkaW5zdGFuY2VzID0gW107XG4gICAgICAgIHRoaXMuJCRkZWZhdWx0T3B0aW9ucyA9IGRlZmF1bHRPcHRpb25zO1xuICAgICAgICB0aGlzLmNyZWF0ZShzZXR0aW5ncywgc2hhcmVkU3RhY2tpbmcpO1xuICAgIH1cbiAgICBTdHVja0ltcGwucHJvdG90eXBlLmNyZWF0ZSA9IGZ1bmN0aW9uIChzb3VyY2UsIHNoYXJlZFN0YWNraW5nKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChzaGFyZWRTdGFja2luZyA9PT0gdm9pZCAwKSB7IHNoYXJlZFN0YWNraW5nID0gdHJ1ZTsgfVxuICAgICAgICB2YXIgc2V0dGluZ3MgPSBBcnJheS5pc0FycmF5KHNvdXJjZSkgPyBzb3VyY2UgOiBbc291cmNlXTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyZWQgPSBzZXR0aW5ncy5yZWR1Y2UoZnVuY3Rpb24gKGFjY3VtdWxhdG9yLCBzZXR0aW5nKSB7IHJldHVybiBhY2N1bXVsYXRvci5jb25jYXQoX3RoaXMucmVnaXN0ZXIoc2V0dGluZywgc2hhcmVkU3RhY2tpbmcpKTsgfSwgW10pO1xuICAgICAgICBpZiAocmVnaXN0ZXJlZC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiQkbWFuYWdlci51cGRhdGUoKTtcbiAgICAgICAgcmV0dXJuIHJlZ2lzdGVyZWQ7XG4gICAgfTtcbiAgICBTdHVja0ltcGwucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKF9hLCBzaGFyZWRTdGFja2luZykge1xuICAgICAgICB2YXIgX2I7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmIChzaGFyZWRTdGFja2luZyA9PT0gdm9pZCAwKSB7IHNoYXJlZFN0YWNraW5nID0gdHJ1ZTsgfVxuICAgICAgICB2YXIgc2VsZWN0b3IgPSBfYS5zZWxlY3RvciwgZWxlbWVudCA9IF9hLmVsZW1lbnQsIG9wdGlvbnMgPSBfX3Jlc3QoX2EsIFtcInNlbGVjdG9yXCIsIFwiZWxlbWVudFwiXSk7XG4gICAgICAgIHZhciByZWdpc3RlcmVkSW5zdGFuY2VFbGVtZW50cyA9IHRoaXMuJCRtYW5hZ2VyLnN0aWNreUVsZW1lbnRzO1xuICAgICAgICB2YXIgc3RpY2tpZXMgPSBnZXRFbGVtZW50c0FycmF5RnJvbVNldHRpbmcoe1xuICAgICAgICAgICAgc2VsZWN0b3I6IHNlbGVjdG9yLFxuICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudCxcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKHRhcmdldCkgeyByZXR1cm4gIXJlZ2lzdGVyZWRJbnN0YW5jZUVsZW1lbnRzLmluY2x1ZGVzKHRhcmdldCk7IH0pXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChuZXdFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IHN0aWNreUltcGxfMS5kZWZhdWx0KG5ld0VsZW1lbnQsIF9fYXNzaWduKHt9LCBfdGhpcy4kJGRlZmF1bHRPcHRpb25zLCBvcHRpb25zKSwgZmFsc2UsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy4kJG1hbmFnZXIudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIChfYiA9IHRoaXMuJCRtYW5hZ2VyKS5hZGRTdGlja2llcy5hcHBseShfYiwgW3NoYXJlZFN0YWNraW5nXS5jb25jYXQoc3RpY2tpZXMpKTtcbiAgICAgICAgdGhpcy4kJGluc3RhbmNlcyA9IHRoaXMuJCRpbnN0YW5jZXMuY29uY2F0KHN0aWNraWVzKTtcbiAgICAgICAgcmV0dXJuIHN0aWNraWVzO1xuICAgIH07XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0dWNrSW1wbC5wcm90b3R5cGUsIFwic3RpY2tpZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQkaW5zdGFuY2VzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBTdHVja0ltcGwucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJCRtYW5hZ2VyLnVucmVnaXN0ZXIodGhpcyk7XG4gICAgICAgIHRoaXMuJCRpbnN0YW5jZXMgPSBbXTtcbiAgICB9O1xuICAgIHJldHVybiBTdHVja0ltcGw7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU3R1Y2tJbXBsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc3RpY2t5TWFuYWdlcl8xID0gcmVxdWlyZShcIi4vc3RpY2t5TWFuYWdlclwiKTtcbnZhciB1dGlsaXR5XzEgPSByZXF1aXJlKFwiLi91dGlsaXR5XCIpO1xudmFyIFN0dWNrTWFuYWdlckltcGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3R1Y2tNYW5hZ2VySW1wbCgpIHtcbiAgICAgICAgdGhpcy4kJHN0dWNrcyA9IFtdO1xuICAgICAgICB0aGlzLiQkc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMgPSBbXTtcbiAgICB9XG4gICAgU3R1Y2tNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiQkaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuJCRpbnN0YW5jZSA9IG5ldyBTdHVja01hbmFnZXJJbXBsKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuJCRpbnN0YW5jZTtcbiAgICB9O1xuICAgIFN0dWNrTWFuYWdlckltcGwucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKHN0dWNrKSB7XG4gICAgICAgIHRoaXMuJCRzdHVja3MgPSB0aGlzLiQkc3R1Y2tzLmNvbmNhdChbc3R1Y2tdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZS51bnJlZ2lzdGVyID0gZnVuY3Rpb24gKHN0dWNrKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveVN0aWNraWVzLmFwcGx5KHRoaXMsIHN0dWNrLnN0aWNraWVzKTtcbiAgICAgICAgdGhpcy4kJHN0dWNrcyA9IHRoaXMuJCRzdHVja3MuZmlsdGVyKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UgIT09IHN0dWNrOyB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUsIFwic3RpY2tpZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQkc3RpY2tpZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZSwgXCJzdGlja3lFbGVtZW50c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCRzdGlja2llcy5tYXAoZnVuY3Rpb24gKHN0aWNreSkgeyByZXR1cm4gc3RpY2t5LmVsZW1lbnQ7IH0pO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUsIFwic3RhY2tpbmdTdGlja2llc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZS5hZGRTdGlja2llcyA9IGZ1bmN0aW9uIChzdGFja2luZykge1xuICAgICAgICB2YXIgc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHN0aWNraWVzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5jb25jYXQoc3RpY2tpZXMpO1xuICAgICAgICBpZiAoc3RhY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMuY29uY2F0KHN0aWNraWVzKTtcbiAgICAgICAgfVxuICAgICAgICBzdGlja3lNYW5hZ2VyXzEuc3RpY2t5TWFuYWdlckluc3RhbmNlLmFjdGl2YXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUuZGVzdHJveVN0aWNraWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHN0aWNraWVzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgc3RpY2tpZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdGFuY2UpIHsgcmV0dXJuIGluc3RhbmNlLmRlc3Ryb3koKTsgfSk7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5maWx0ZXIoZnVuY3Rpb24gKHN0aWNreSkgeyByZXR1cm4gIXN0aWNraWVzLmluY2x1ZGVzKHN0aWNreSk7IH0pO1xuICAgICAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IHRoaXMuJCRzdGFja2luZ1N0aWNraWVzLmZpbHRlcihmdW5jdGlvbiAoc3RpY2t5KSB7IHJldHVybiAhc3RpY2tpZXMuaW5jbHVkZXMoc3RpY2t5KTsgfSk7XG4gICAgICAgIGlmICh0aGlzLiQkc3RhY2tpbmdTdGlja2llcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IHRoaXMuc3RhY2tpbmdTdGlja2llc1xuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaW5zdGFuY2UsIGluZGV4LCBhbGwpIHsgcmV0dXJuIGFsbC5pbmRleE9mKGluc3RhbmNlKSA9PT0gaW5kZXg7IH0pXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gKHtcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgIHJlY3Q6IGluc3RhbmNlLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKSxcbiAgICAgICAgfSk7IH0pXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoX2EsIF9iKSB7XG4gICAgICAgICAgICB2YXIgYmVmb3JlID0gX2EucmVjdDtcbiAgICAgICAgICAgIHZhciBhZnRlciA9IF9iLnJlY3Q7XG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlLnRvcCAtIGFmdGVyLnRvcDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKF9hLCBfYikge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlcyA9IF9hLmluc3RhbmNlcywgY2VpbGluZyA9IF9hLmNlaWxpbmc7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBfYi5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLm1hcmdpblRvcCA9IGluc3RhbmNlLm9wdGlvbnMubWFyZ2luVG9wICsgY2VpbGluZztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VzOiBpbnN0YW5jZXMuY29uY2F0KFtpbnN0YW5jZV0pLFxuICAgICAgICAgICAgICAgIGNlaWxpbmc6IGluc3RhbmNlLnJlY3QuaGVpZ2h0ICsgaW5zdGFuY2UubWFyZ2luVG9wLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSwgeyBpbnN0YW5jZXM6IFtdLCBjZWlsaW5nOiAwIH0pLmluc3RhbmNlcztcbiAgICAgICAgc3RpY2t5TWFuYWdlcl8xLnN0aWNreU1hbmFnZXJJbnN0YW5jZS5idWxrVXBkYXRlKCk7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHV0aWxpdHlfMS5zdGFibGVTb3J0KHRoaXMuc3RpY2tpZXMsIGZ1bmN0aW9uIChiZWZvcmUsIGFmdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlLnBsYWNlaG9sZGVyLmNhY2hlZFJlY3QudG9wIC0gYWZ0ZXIucGxhY2Vob2xkZXIuY2FjaGVkUmVjdC50b3A7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHJldHVybiBTdHVja01hbmFnZXJJbXBsO1xufSgpKTtcbmV4cG9ydHMuc3R1Y2tNYW5hZ2VySW5zdGFuY2UgPSBTdHVja01hbmFnZXJJbXBsLmdldEluc3RhbmNlKCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMubm9vcCA9IGZ1bmN0aW9uICgpIHsgfTtcbmV4cG9ydHMuc3RhYmxlU29ydCA9IGZ1bmN0aW9uIChhcnJheSwgY29tcGFyZUZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGFycmF5XG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7IHJldHVybiAoeyBpdGVtOiBpdGVtLCBpbmRleDogaW5kZXggfSk7IH0pXG4gICAgICAgIC5zb3J0KGZ1bmN0aW9uIChiZWZvcmUsIGFmdGVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjb21wYXJlRnVuY3Rpb24oYmVmb3JlLml0ZW0sIGFmdGVyLml0ZW0pO1xuICAgICAgICByZXR1cm4gcmVzdWx0ICE9PSAwID8gcmVzdWx0IDogYmVmb3JlLmluZGV4IC0gYWZ0ZXIuaW5kZXg7XG4gICAgfSlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBfYS5pdGVtO1xuICAgICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcbn07XG4iXSwic291cmNlUm9vdCI6IiJ9
