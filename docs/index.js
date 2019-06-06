(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["StuckJs"] = factory();
	else
		root["StuckJs"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var placeholder_1 = __webpack_require__(/*! ./placeholder */ "./src/placeholder.ts");
exports.Placeholder = placeholder_1.default;
var stickyImpl_1 = __webpack_require__(/*! ./stickyImpl */ "./src/stickyImpl.ts");
exports.Sticky = stickyImpl_1.default;
var stuckImpl_1 = __webpack_require__(/*! ./stuckImpl */ "./src/stuckImpl.ts");
exports.Stuck = stuckImpl_1.default;
exports.default = stuckImpl_1.default;


/***/ }),

/***/ "./src/placeholder.ts":
/*!****************************!*\
  !*** ./src/placeholder.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = __webpack_require__(/*! ./utility */ "./src/utility.ts");
var Placeholder = /** @class */ (function () {
    function Placeholder(element, observe, onUpdate) {
        var _this = this;
        if (observe === void 0) { observe = true; }
        if (onUpdate === void 0) { onUpdate = utility_1.noop; }
        this.$$shouldPlacehold = true;
        this.original = element;
        this.onUpdate = typeof onUpdate === 'function' ? onUpdate : utility_1.noop;
        this.initialComputedStyles = window.getComputedStyle(this.original);
        this.initiallyHidden = this.initialComputedStyles.display === 'none';
        if (this.initiallyHidden) {
            this.execWhileStucking(function () {
                _this.initialComputedStyles = window.getComputedStyle(_this.original);
            });
        }
        this.element = Placeholder.createPlaceholderElement();
        this.applyInitialStyles();
        this.cachedRect = this.element && this.updateRect();
        Placeholder.wrap(this.original, this.element);
        if (observe) {
            this.observer = Placeholder.createObserver(this.original, function () { return _this.update(); });
        }
    }
    Object.defineProperty(Placeholder.prototype, "shouldPlacehold", {
        get: function () {
            return !this.initiallyHidden && this.$$shouldPlacehold;
        },
        set: function (value) {
            if (this.shouldPlacehold === value) {
                return;
            }
            this.$$shouldPlacehold = value;
            this.update(true);
        },
        enumerable: true,
        configurable: true
    });
    Placeholder.prototype.update = function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (this.shouldPlacehold) {
            this.applyStyles(forceUpdate);
        }
        else {
            this.removeStyles();
        }
        this.onUpdate();
    };
    Placeholder.prototype.updateRect = function () {
        var _this = this;
        this.cachedRect = this.element.getBoundingClientRect();
        if (this.initiallyHidden) {
            this.execWhileStucking(function () {
                _this.cachedRect = _this.element.getBoundingClientRect();
            });
        }
        return this.cachedRect;
    };
    Placeholder.prototype.destroy = function () {
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
    Placeholder.prototype.execWhileStucking = function (execute) {
        var state = this.original.dataset.stuck;
        this.original.dataset.stuck = 'true';
        execute();
        this.original.dataset.stuck = state;
    };
    Placeholder.prototype.applyInitialStyles = function () {
        if (!this.initialComputedStyles || this.initiallyHidden) {
            return;
        }
        this.element.style.margin = this.initialComputedStyles.margin;
        this.element.style.minWidth = this.initialComputedStyles.minWidth;
        this.element.style.minHeight = this.initialComputedStyles.minHeight;
        this.element.style.width = this.initialComputedStyles.width;
        this.element.style.height = this.initialComputedStyles.height;
    };
    Placeholder.prototype.applyStyles = function (forceUpdate) {
        if (forceUpdate === void 0) { forceUpdate = false; }
        if (!this.original || !this.element) {
            return;
        }
        var _a = this.original.getBoundingClientRect(), originalWidth = _a.width, originalHeight = _a.height;
        var widthChanged = originalWidth !== this.cachedRect.width;
        var heightChanged = originalHeight !== this.cachedRect.height;
        if (!forceUpdate && !widthChanged && !heightChanged) {
            return;
        }
        if (forceUpdate || widthChanged) {
            this.element.style.width = originalWidth + "px";
        }
        if (forceUpdate || heightChanged) {
            this.element.style.height = originalHeight + "px";
        }
        this.updateRect();
    };
    Placeholder.prototype.removeStyles = function () {
        if (!this.original || !this.element) {
            return;
        }
        this.element.style.width = '';
        this.element.style.height = '';
    };
    Placeholder.createObserver = function (targetNode, callback) {
        if (!targetNode) {
            throw new TypeError("[Stuck.js] Could not create mutation observer on targetNode " + String(targetNode) + ". This should be HTMLElement");
        }
        var detectSizeMutation = function (_a) {
            var type = _a.type;
            return type === 'childList' || type === 'attributes';
        };
        var observer = new MutationObserver(function (mutations) {
            var isMutated = mutations.some(detectSizeMutation);
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
    Placeholder.unwrap = function (target) {
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
    Placeholder.wrap = function (target, wrapper) {
        if (target.parentNode !== wrapper) {
            target.insertAdjacentElement('beforebegin', wrapper);
            wrapper.appendChild(target);
        }
        return wrapper;
    };
    Placeholder.createPlaceholderElement = function (tagName) {
        if (tagName === void 0) { tagName = 'div'; }
        return document.createElement(tagName);
    };
    return Placeholder;
}());
exports.default = Placeholder;


/***/ }),

/***/ "./src/stickyImpl.ts":
/*!***************************!*\
  !*** ./src/stickyImpl.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var stickyManager_1 = __webpack_require__(/*! ./stickyManager */ "./src/stickyManager.ts");
var placeholder_1 = __webpack_require__(/*! ./placeholder */ "./src/placeholder.ts");
var utility_1 = __webpack_require__(/*! ./utility */ "./src/utility.ts");
var normalizeElement = function (value) {
    var fallbacks = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        fallbacks[_i - 1] = arguments[_i];
    }
    if (value && value instanceof HTMLElement) {
        return value;
    }
    var element = [value && document.querySelector(value)].concat(fallbacks).find(function (item) { return !!item && item instanceof HTMLElement; });
    if (element instanceof HTMLElement) {
        return element;
    }
    throw new TypeError('[Stuck-js] Could not find HTMLElement');
};
var computeAbsoluteFloor = function (target) {
    var absoluteBottom = target.getBoundingClientRect().bottom + window.pageYOffset;
    var paddingBottom = window.getComputedStyle(target).paddingBottom;
    var paddingBottomPixels = paddingBottom !== null ? parseInt(paddingBottom, 10) : 0;
    return absoluteBottom - paddingBottomPixels;
};
var StickyImpl = /** @class */ (function () {
    function StickyImpl(element, options, activate, onUpdate) {
        if (options === void 0) { options = { observe: true }; }
        if (activate === void 0) { activate = true; }
        if (onUpdate === void 0) { onUpdate = utility_1.noop; }
        this.marginTop = 0;
        this.isStickToBottom = false;
        if (!element) {
            throw new Error('[Stuck-js] Invalid element given');
        }
        this.$$manager = stickyManager_1.getStickyManagerInstance(window).register(this);
        this.element = element;
        this.rect = this.element.getBoundingClientRect();
        this.options = __assign({ marginTop: 0 }, options);
        this.marginTop = this.options.marginTop || 0;
        this.setWrapperFromSelectorOrElement(this.options.wrapper);
        this.placeholder = new placeholder_1.default(this.element, this.options.observe || true, onUpdate || this.$$manager.bulkUpdate);
        this.element.dataset.stuck = '';
        if (activate) {
            this.$$manager.activate();
        }
        this.placeholder.shouldPlacehold = this.isSticky;
    }
    Object.defineProperty(StickyImpl.prototype, "isSticky", {
        get: function () {
            return this.element !== null && this.element.style.position === 'fixed';
        },
        set: function (value) {
            if (this.placeholder) {
                this.placeholder.shouldPlacehold = value;
            }
            this.element.dataset.stuck = value ? value.toString() : '';
            this.element.style.position = value ? 'fixed' : '';
            this.element.style.top = value ? this.top + "px" : '';
            this.element.style.left = value
                ? this.placeholder.updateRect().left + "px"
                : '';
            if (value) {
                this.computePositionTopFromRect();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StickyImpl.prototype, "top", {
        get: function () {
            return this.$$additionalTop || this.$$additionalTop === 0
                ? this.$$additionalTop
                : this.marginTop;
        },
        set: function (value) {
            this.$$additionalTop = value;
            this.element.style.top = value ? value + "px" : this.marginTop + "px";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StickyImpl.prototype, "wrapper", {
        get: function () {
            return this.$$wrapper;
        },
        enumerable: true,
        configurable: true
    });
    StickyImpl.prototype.setWrapperFromSelectorOrElement = function (selectorOrElement) {
        if (!(document.body instanceof HTMLElement)) {
            throw new TypeError('[Stuck.js] document.body is not HTMLElement in this environment');
        }
        var parent = ((this.placeholder && this.placeholder.element) ||
            this.element).parentElement;
        this.$$wrapper = normalizeElement(selectorOrElement, parent, document.body);
        this.floor = computeAbsoluteFloor(this.$$wrapper);
        this.options.wrapper = this.$$wrapper;
    };
    StickyImpl.prototype.destroy = function () {
        this.isSticky = false;
        this.placeholder.destroy();
        this.$$manager.unregister(this);
        delete this.placeholder;
        delete this.element;
        delete this.options;
    };
    StickyImpl.prototype.computePositionTopFromRect = function (rect) {
        if (rect === void 0) { rect = this.element.getBoundingClientRect(); }
        this.rect = rect;
        this.floor = computeAbsoluteFloor(this.wrapper);
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
    StickyImpl.prototype.update = function () {
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
                this.element.style.left = placeholderRect.left + "px";
            }
            this.computePositionTopFromRect(this.rect);
        }
    };
    return StickyImpl;
}());
exports.default = StickyImpl;


/***/ }),

/***/ "./src/stickyManager.ts":
/*!******************************!*\
  !*** ./src/stickyManager.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StickyManagerImpl = /** @class */ (function () {
    function StickyManagerImpl(_window) {
        this.$$stickies = [];
        this.$$activated = false;
        this.$$bulkUpdateRequestId = null;
        this.$$window = _window;
        this.bulkUpdate = this.bulkUpdate.bind(this);
        this.bulkPlaceholderUpdate = this.bulkPlaceholderUpdate.bind(this);
    }
    StickyManagerImpl.getInstance = function (_window) {
        if (!this.$$instance) {
            this.$$instance = new StickyManagerImpl(_window);
        }
        return this.$$instance;
    };
    StickyManagerImpl.prototype.register = function (sticky) {
        this.$$stickies = this.$$stickies.concat([sticky]);
        return this;
    };
    StickyManagerImpl.prototype.unregister = function (sticky) {
        this.$$stickies = this.$$stickies.filter(function (instance) { return instance !== sticky; });
        if (this.$$stickies.length < 1) {
            this.deactivate();
        }
        return this;
    };
    StickyManagerImpl.prototype.bulkUpdate = function () {
        var _this = this;
        if (this.$$bulkUpdateRequestId) {
            this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId);
        }
        this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(function () {
            _this.$$stickies.forEach(function (instance) { return instance.update(); });
        });
        return this;
    };
    StickyManagerImpl.prototype.destroyAll = function () {
        this.$$stickies.forEach(function (instance) { return instance.destroy(); });
        this.$$stickies = [];
        this.deactivate();
        return this;
    };
    StickyManagerImpl.prototype.activate = function () {
        if (!this.$$activated && this.$$stickies.length > 0) {
            this.$$window.addEventListener('scroll', this.bulkUpdate);
            this.$$window.addEventListener('resize', this.bulkPlaceholderUpdate);
            this.$$activated = true;
        }
        this.bulkUpdate();
        return this;
    };
    StickyManagerImpl.prototype.deactivate = function () {
        if (this.$$activated) {
            this.$$window.removeEventListener('scroll', this.bulkUpdate);
            this.$$window.removeEventListener('resize', this.bulkPlaceholderUpdate);
            this.$$activated = false;
        }
        return this;
    };
    StickyManagerImpl.prototype.bulkPlaceholderUpdate = function () {
        var _this = this;
        if (this.$$bulkUpdateRequestId) {
            this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId);
        }
        this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(function () {
            _this.$$stickies.forEach(function (instance) {
                instance.placeholder.update();
                instance.update();
            });
        });
    };
    return StickyManagerImpl;
}());
exports.getStickyManagerInstance = function (_window) {
    return StickyManagerImpl.getInstance(_window);
};


/***/ }),

/***/ "./src/stuckImpl.ts":
/*!**************************!*\
  !*** ./src/stuckImpl.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var stuckManager_1 = __webpack_require__(/*! ./stuckManager */ "./src/stuckManager.ts");
var stickyImpl_1 = __webpack_require__(/*! ./stickyImpl */ "./src/stickyImpl.ts");
var getElementsArrayFromSetting = function (option) {
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
        return Array.from(document.querySelectorAll(option.selector)).filter(function (maybeHTMLElement) {
            return maybeHTMLElement instanceof HTMLElement;
        });
    }
    throw new Error('[Stuck.js] No selector, element nor elements in setting');
};
var StuckImpl = /** @class */ (function () {
    function StuckImpl(settings, defaultOptions, sharedStacking) {
        if (settings === void 0) { settings = []; }
        if (defaultOptions === void 0) { defaultOptions = { observe: true }; }
        if (sharedStacking === void 0) { sharedStacking = true; }
        this.$$instances = [];
        this.$$manager = stuckManager_1.getStuckManagerInstance(window).register(this);
        this.$$defaultOptions = defaultOptions;
        this.create(settings, sharedStacking);
    }
    StuckImpl.prototype.create = function (source, sharedStacking) {
        var _this = this;
        if (sharedStacking === void 0) { sharedStacking = true; }
        var settings = Array.isArray(source) ? source : [source];
        var registered = settings.reduce(function (accumulator, setting) { return accumulator.concat(_this.register(setting, sharedStacking)); }, []);
        if (registered.length === 0) {
            return [];
        }
        this.$$manager.update();
        return registered;
    };
    StuckImpl.prototype.register = function (_a, sharedStacking) {
        var _b;
        var _this = this;
        if (sharedStacking === void 0) { sharedStacking = true; }
        var selector = _a.selector, element = _a.element, options = __rest(_a, ["selector", "element"]);
        var registeredInstanceElements = this.$$manager.stickyElements;
        var stickies = getElementsArrayFromSetting({
            selector: selector,
            element: element,
        })
            .filter(function (target) { return !registeredInstanceElements.includes(target); })
            .map(function (newElement) {
            return new stickyImpl_1.default(newElement, __assign({}, _this.$$defaultOptions, options), false, function () {
                _this.$$manager.update();
            });
        });
        (_b = this.$$manager).addStickies.apply(_b, [sharedStacking].concat(stickies));
        this.$$instances = this.$$instances.concat(stickies);
        return stickies;
    };
    Object.defineProperty(StuckImpl.prototype, "stickies", {
        get: function () {
            return this.$$instances;
        },
        enumerable: true,
        configurable: true
    });
    StuckImpl.prototype.destroy = function () {
        this.$$manager.unregister(this);
        this.$$instances = [];
    };
    return StuckImpl;
}());
exports.default = StuckImpl;


/***/ }),

/***/ "./src/stuckManager.ts":
/*!*****************************!*\
  !*** ./src/stuckManager.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var stickyManager_1 = __webpack_require__(/*! ./stickyManager */ "./src/stickyManager.ts");
var utility_1 = __webpack_require__(/*! ./utility */ "./src/utility.ts");
var StuckManagerImpl = /** @class */ (function () {
    function StuckManagerImpl(_window) {
        this.$$stucks = [];
        this.$$stickies = [];
        this.$$stackingStickies = [];
        this.$$window = _window;
    }
    StuckManagerImpl.getInstance = function (_window) {
        if (!this.$$instance) {
            this.$$instance = new StuckManagerImpl(_window);
        }
        return this.$$instance;
    };
    StuckManagerImpl.prototype.register = function (stuck) {
        this.$$stucks = this.$$stucks.concat([stuck]);
        return this;
    };
    StuckManagerImpl.prototype.unregister = function (stuck) {
        this.destroyStickies.apply(this, stuck.stickies);
        this.$$stucks = this.$$stucks.filter(function (instance) { return instance !== stuck; });
        return this;
    };
    Object.defineProperty(StuckManagerImpl.prototype, "stickies", {
        get: function () {
            return this.$$stickies;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StuckManagerImpl.prototype, "stickyElements", {
        get: function () {
            return this.$$stickies.map(function (sticky) { return sticky.element; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(StuckManagerImpl.prototype, "stackingStickies", {
        get: function () {
            return this.$$stackingStickies;
        },
        enumerable: true,
        configurable: true
    });
    StuckManagerImpl.prototype.addStickies = function (stacking) {
        var stickies = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            stickies[_i - 1] = arguments[_i];
        }
        this.$$stickies = this.$$stickies.concat(stickies);
        if (stacking) {
            this.$$stackingStickies = this.$$stackingStickies.concat(stickies);
        }
        stickyManager_1.getStickyManagerInstance(this.$$window).activate();
        return this;
    };
    StuckManagerImpl.prototype.destroyStickies = function () {
        var stickies = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            stickies[_i] = arguments[_i];
        }
        stickies.forEach(function (instance) { return instance.destroy(); });
        this.$$stickies = this.$$stickies.filter(function (sticky) { return !stickies.includes(sticky); });
        this.$$stackingStickies = this.$$stackingStickies.filter(function (sticky) { return !stickies.includes(sticky); });
        if (this.$$stackingStickies.length > 0) {
            this.update();
        }
        return this;
    };
    StuckManagerImpl.prototype.update = function () {
        this.$$stackingStickies = this.stackingStickies
            .filter(function (instance, index, all) { return all.indexOf(instance) === index; })
            .map(function (instance) { return ({
            instance: instance,
            rect: instance.placeholder.updateRect(),
        }); })
            .sort(function (_a, _b) {
            var before = _a.rect;
            var after = _b.rect;
            return before.top - after.top;
        })
            .reduce(function (_a, _b) {
            var instances = _a.instances, ceiling = _a.ceiling;
            var instance = _b.instance;
            instance.marginTop = instance.options.marginTop + ceiling;
            return {
                instances: instances.concat([instance]),
                ceiling: instance.rect.height + instance.marginTop,
            };
        }, { instances: [], ceiling: 0 }).instances;
        stickyManager_1.getStickyManagerInstance(this.$$window).bulkUpdate();
        this.$$stickies = utility_1.stableSort(this.stickies, function (before, after) {
            return before.placeholder.cachedRect.top - after.placeholder.cachedRect.top;
        });
        return this;
    };
    return StuckManagerImpl;
}());
exports.getStuckManagerInstance = function (_window) {
    return StuckManagerImpl.getInstance(_window);
};


/***/ }),

/***/ "./src/utility.ts":
/*!************************!*\
  !*** ./src/utility.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = function () { };
exports.stableSort = function (array, compareFunction) {
    return array
        .map(function (item, index) { return ({ item: item, index: index }); })
        .sort(function (before, after) {
        var result = compareFunction(before.item, after.item);
        return result !== 0 ? result : before.index - after.index;
    })
        .map(function (_a) {
        var item = _a.item;
        return item;
    });
};


/***/ })

/******/ });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU3R1Y2tKcy8uL3NyYy9wbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9TdHVja0pzLy4vc3JjL3N0aWNreUltcGwudHMiLCJ3ZWJwYWNrOi8vU3R1Y2tKcy8uL3NyYy9zdGlja3lNYW5hZ2VyLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvc3R1Y2tJbXBsLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvc3R1Y2tNYW5hZ2VyLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvdXRpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFD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ImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN0dWNrSnNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU3R1Y2tKc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgcGxhY2Vob2xkZXJfMSA9IHJlcXVpcmUoXCIuL3BsYWNlaG9sZGVyXCIpO1xuZXhwb3J0cy5QbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyXzEuZGVmYXVsdDtcbnZhciBzdGlja3lJbXBsXzEgPSByZXF1aXJlKFwiLi9zdGlja3lJbXBsXCIpO1xuZXhwb3J0cy5TdGlja3kgPSBzdGlja3lJbXBsXzEuZGVmYXVsdDtcbnZhciBzdHVja0ltcGxfMSA9IHJlcXVpcmUoXCIuL3N0dWNrSW1wbFwiKTtcbmV4cG9ydHMuU3R1Y2sgPSBzdHVja0ltcGxfMS5kZWZhdWx0O1xuZXhwb3J0cy5kZWZhdWx0ID0gc3R1Y2tJbXBsXzEuZGVmYXVsdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHV0aWxpdHlfMSA9IHJlcXVpcmUoXCIuL3V0aWxpdHlcIik7XG52YXIgUGxhY2Vob2xkZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGxhY2Vob2xkZXIoZWxlbWVudCwgb2JzZXJ2ZSwgb25VcGRhdGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG9ic2VydmUgPT09IHZvaWQgMCkgeyBvYnNlcnZlID0gdHJ1ZTsgfVxuICAgICAgICBpZiAob25VcGRhdGUgPT09IHZvaWQgMCkgeyBvblVwZGF0ZSA9IHV0aWxpdHlfMS5ub29wOyB9XG4gICAgICAgIHRoaXMuJCRzaG91bGRQbGFjZWhvbGQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9yaWdpbmFsID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5vblVwZGF0ZSA9IHR5cGVvZiBvblVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IG9uVXBkYXRlIDogdXRpbGl0eV8xLm5vb3A7XG4gICAgICAgIHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5vcmlnaW5hbCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGx5SGlkZGVuID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMuZGlzcGxheSA9PT0gJ25vbmUnO1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsbHlIaWRkZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY1doaWxlU3R1Y2tpbmcoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKF90aGlzLm9yaWdpbmFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IFBsYWNlaG9sZGVyLmNyZWF0ZVBsYWNlaG9sZGVyRWxlbWVudCgpO1xuICAgICAgICB0aGlzLmFwcGx5SW5pdGlhbFN0eWxlcygpO1xuICAgICAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLmVsZW1lbnQgJiYgdGhpcy51cGRhdGVSZWN0KCk7XG4gICAgICAgIFBsYWNlaG9sZGVyLndyYXAodGhpcy5vcmlnaW5hbCwgdGhpcy5lbGVtZW50KTtcbiAgICAgICAgaWYgKG9ic2VydmUpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXIgPSBQbGFjZWhvbGRlci5jcmVhdGVPYnNlcnZlcih0aGlzLm9yaWdpbmFsLCBmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy51cGRhdGUoKTsgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFBsYWNlaG9sZGVyLnByb3RvdHlwZSwgXCJzaG91bGRQbGFjZWhvbGRcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhdGhpcy5pbml0aWFsbHlIaWRkZW4gJiYgdGhpcy4kJHNob3VsZFBsYWNlaG9sZDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3VsZFBsYWNlaG9sZCA9PT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLiQkc2hvdWxkUGxhY2Vob2xkID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSh0cnVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIChmb3JjZVVwZGF0ZSkge1xuICAgICAgICBpZiAoZm9yY2VVcGRhdGUgPT09IHZvaWQgMCkgeyBmb3JjZVVwZGF0ZSA9IGZhbHNlOyB9XG4gICAgICAgIGlmICh0aGlzLnNob3VsZFBsYWNlaG9sZCkge1xuICAgICAgICAgICAgdGhpcy5hcHBseVN0eWxlcyhmb3JjZVVwZGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnJlbW92ZVN0eWxlcygpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25VcGRhdGUoKTtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS51cGRhdGVSZWN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxseUhpZGRlbikge1xuICAgICAgICAgICAgdGhpcy5leGVjV2hpbGVTdHVja2luZyhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FjaGVkUmVjdCA9IF90aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5jYWNoZWRSZWN0O1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICAgICAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyO1xuICAgICAgICB9XG4gICAgICAgIFBsYWNlaG9sZGVyLnVud3JhcCh0aGlzLm9yaWdpbmFsKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudDtcbiAgICAgICAgZGVsZXRlIHRoaXMub3JpZ2luYWw7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmNhY2hlZFJlY3Q7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm9uVXBkYXRlO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmV4ZWNXaGlsZVN0dWNraW5nID0gZnVuY3Rpb24gKGV4ZWN1dGUpIHtcbiAgICAgICAgdmFyIHN0YXRlID0gdGhpcy5vcmlnaW5hbC5kYXRhc2V0LnN0dWNrO1xuICAgICAgICB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2sgPSAndHJ1ZSc7XG4gICAgICAgIGV4ZWN1dGUoKTtcbiAgICAgICAgdGhpcy5vcmlnaW5hbC5kYXRhc2V0LnN0dWNrID0gc3RhdGU7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUuYXBwbHlJbml0aWFsU3R5bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzIHx8IHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm1hcmdpbiA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLm1hcmdpbjtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm1pbldpZHRoID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMubWluV2lkdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5taW5IZWlnaHQ7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLndpZHRoO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMuaGVpZ2h0O1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLmFwcGx5U3R5bGVzID0gZnVuY3Rpb24gKGZvcmNlVXBkYXRlKSB7XG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZSA9PT0gdm9pZCAwKSB7IGZvcmNlVXBkYXRlID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKCF0aGlzLm9yaWdpbmFsIHx8ICF0aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgX2EgPSB0aGlzLm9yaWdpbmFsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCBvcmlnaW5hbFdpZHRoID0gX2Eud2lkdGgsIG9yaWdpbmFsSGVpZ2h0ID0gX2EuaGVpZ2h0O1xuICAgICAgICB2YXIgd2lkdGhDaGFuZ2VkID0gb3JpZ2luYWxXaWR0aCAhPT0gdGhpcy5jYWNoZWRSZWN0LndpZHRoO1xuICAgICAgICB2YXIgaGVpZ2h0Q2hhbmdlZCA9IG9yaWdpbmFsSGVpZ2h0ICE9PSB0aGlzLmNhY2hlZFJlY3QuaGVpZ2h0O1xuICAgICAgICBpZiAoIWZvcmNlVXBkYXRlICYmICF3aWR0aENoYW5nZWQgJiYgIWhlaWdodENoYW5nZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZm9yY2VVcGRhdGUgfHwgd2lkdGhDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBvcmlnaW5hbFdpZHRoICsgXCJweFwiO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZSB8fCBoZWlnaHRDaGFuZ2VkKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gb3JpZ2luYWxIZWlnaHQgKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy51cGRhdGVSZWN0KCk7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUucmVtb3ZlU3R5bGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMub3JpZ2luYWwgfHwgIXRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9ICcnO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJyc7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5jcmVhdGVPYnNlcnZlciA9IGZ1bmN0aW9uICh0YXJnZXROb2RlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAoIXRhcmdldE5vZGUpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJbU3R1Y2suanNdIENvdWxkIG5vdCBjcmVhdGUgbXV0YXRpb24gb2JzZXJ2ZXIgb24gdGFyZ2V0Tm9kZSBcIiArIFN0cmluZyh0YXJnZXROb2RlKSArIFwiLiBUaGlzIHNob3VsZCBiZSBIVE1MRWxlbWVudFwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGV0ZWN0U2l6ZU11dGF0aW9uID0gZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIgdHlwZSA9IF9hLnR5cGU7XG4gICAgICAgICAgICByZXR1cm4gdHlwZSA9PT0gJ2NoaWxkTGlzdCcgfHwgdHlwZSA9PT0gJ2F0dHJpYnV0ZXMnO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihmdW5jdGlvbiAobXV0YXRpb25zKSB7XG4gICAgICAgICAgICB2YXIgaXNNdXRhdGVkID0gbXV0YXRpb25zLnNvbWUoZGV0ZWN0U2l6ZU11dGF0aW9uKTtcbiAgICAgICAgICAgIGlmIChpc011dGF0ZWQpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlLCB7XG4gICAgICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJywgJ2NsYXNzJ10sXG4gICAgICAgICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIudW53cmFwID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHRhcmdldC5wYXJlbnROb2RlO1xuICAgICAgICBpZiAod3JhcHBlciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICB3cmFwcGVyLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCB0YXJnZXQpO1xuICAgICAgICAgICAgdmFyIHBhcmVudF8xID0gd3JhcHBlci5wYXJlbnROb2RlO1xuICAgICAgICAgICAgaWYgKHBhcmVudF8xIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnRfMS5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIud3JhcCA9IGZ1bmN0aW9uICh0YXJnZXQsIHdyYXBwZXIpIHtcbiAgICAgICAgaWYgKHRhcmdldC5wYXJlbnROb2RlICE9PSB3cmFwcGVyKSB7XG4gICAgICAgICAgICB0YXJnZXQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmViZWdpbicsIHdyYXBwZXIpO1xuICAgICAgICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0YXJnZXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB3cmFwcGVyO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIuY3JlYXRlUGxhY2Vob2xkZXJFbGVtZW50ID0gZnVuY3Rpb24gKHRhZ05hbWUpIHtcbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IHZvaWQgMCkgeyB0YWdOYW1lID0gJ2Rpdic7IH1cbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSk7XG4gICAgfTtcbiAgICByZXR1cm4gUGxhY2Vob2xkZXI7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGxhY2Vob2xkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc3RpY2t5TWFuYWdlcl8xID0gcmVxdWlyZShcIi4vc3RpY2t5TWFuYWdlclwiKTtcbnZhciBwbGFjZWhvbGRlcl8xID0gcmVxdWlyZShcIi4vcGxhY2Vob2xkZXJcIik7XG52YXIgdXRpbGl0eV8xID0gcmVxdWlyZShcIi4vdXRpbGl0eVwiKTtcbnZhciBub3JtYWxpemVFbGVtZW50ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIGZhbGxiYWNrcyA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMTsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGZhbGxiYWNrc1tfaSAtIDFdID0gYXJndW1lbnRzW19pXTtcbiAgICB9XG4gICAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB2YXIgZWxlbWVudCA9IFt2YWx1ZSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHZhbHVlKV0uY29uY2F0KGZhbGxiYWNrcykuZmluZChmdW5jdGlvbiAoaXRlbSkgeyByZXR1cm4gISFpdGVtICYmIGl0ZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudDsgfSk7XG4gICAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignW1N0dWNrLWpzXSBDb3VsZCBub3QgZmluZCBIVE1MRWxlbWVudCcpO1xufTtcbnZhciBjb21wdXRlQWJzb2x1dGVGbG9vciA9IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICB2YXIgYWJzb2x1dGVCb3R0b20gPSB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tICsgd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgIHZhciBwYWRkaW5nQm90dG9tID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGFyZ2V0KS5wYWRkaW5nQm90dG9tO1xuICAgIHZhciBwYWRkaW5nQm90dG9tUGl4ZWxzID0gcGFkZGluZ0JvdHRvbSAhPT0gbnVsbCA/IHBhcnNlSW50KHBhZGRpbmdCb3R0b20sIDEwKSA6IDA7XG4gICAgcmV0dXJuIGFic29sdXRlQm90dG9tIC0gcGFkZGluZ0JvdHRvbVBpeGVscztcbn07XG52YXIgU3RpY2t5SW1wbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdGlja3lJbXBsKGVsZW1lbnQsIG9wdGlvbnMsIGFjdGl2YXRlLCBvblVwZGF0ZSkge1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7IG9wdGlvbnMgPSB7IG9ic2VydmU6IHRydWUgfTsgfVxuICAgICAgICBpZiAoYWN0aXZhdGUgPT09IHZvaWQgMCkgeyBhY3RpdmF0ZSA9IHRydWU7IH1cbiAgICAgICAgaWYgKG9uVXBkYXRlID09PSB2b2lkIDApIHsgb25VcGRhdGUgPSB1dGlsaXR5XzEubm9vcDsgfVxuICAgICAgICB0aGlzLm1hcmdpblRvcCA9IDA7XG4gICAgICAgIHRoaXMuaXNTdGlja1RvQm90dG9tID0gZmFsc2U7XG4gICAgICAgIGlmICghZWxlbWVudCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdbU3R1Y2stanNdIEludmFsaWQgZWxlbWVudCBnaXZlbicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJCRtYW5hZ2VyID0gc3RpY2t5TWFuYWdlcl8xLmdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSh3aW5kb3cpLnJlZ2lzdGVyKHRoaXMpO1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgICAgICB0aGlzLnJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IF9fYXNzaWduKHsgbWFyZ2luVG9wOiAwIH0sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLm1hcmdpblRvcCA9IHRoaXMub3B0aW9ucy5tYXJnaW5Ub3AgfHwgMDtcbiAgICAgICAgdGhpcy5zZXRXcmFwcGVyRnJvbVNlbGVjdG9yT3JFbGVtZW50KHRoaXMub3B0aW9ucy53cmFwcGVyKTtcbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlciA9IG5ldyBwbGFjZWhvbGRlcl8xLmRlZmF1bHQodGhpcy5lbGVtZW50LCB0aGlzLm9wdGlvbnMub2JzZXJ2ZSB8fCB0cnVlLCBvblVwZGF0ZSB8fCB0aGlzLiQkbWFuYWdlci5idWxrVXBkYXRlKTtcbiAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQuc3R1Y2sgPSAnJztcbiAgICAgICAgaWYgKGFjdGl2YXRlKSB7XG4gICAgICAgICAgICB0aGlzLiQkbWFuYWdlci5hY3RpdmF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIuc2hvdWxkUGxhY2Vob2xkID0gdGhpcy5pc1N0aWNreTtcbiAgICB9XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0aWNreUltcGwucHJvdG90eXBlLCBcImlzU3RpY2t5XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50ICE9PSBudWxsICYmIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJztcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wbGFjZWhvbGRlci5zaG91bGRQbGFjZWhvbGQgPSB2YWx1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0dWNrID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJyc7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB2YWx1ZSA/ICdmaXhlZCcgOiAnJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB2YWx1ZSA/IHRoaXMudG9wICsgXCJweFwiIDogJyc7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHZhbHVlXG4gICAgICAgICAgICAgICAgPyB0aGlzLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKS5sZWZ0ICsgXCJweFwiXG4gICAgICAgICAgICAgICAgOiAnJztcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29tcHV0ZVBvc2l0aW9uVG9wRnJvbVJlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0aWNreUltcGwucHJvdG90eXBlLCBcInRvcFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCRhZGRpdGlvbmFsVG9wIHx8IHRoaXMuJCRhZGRpdGlvbmFsVG9wID09PSAwXG4gICAgICAgICAgICAgICAgPyB0aGlzLiQkYWRkaXRpb25hbFRvcFxuICAgICAgICAgICAgICAgIDogdGhpcy5tYXJnaW5Ub3A7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLiQkYWRkaXRpb25hbFRvcCA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHZhbHVlID8gdmFsdWUgKyBcInB4XCIgOiB0aGlzLm1hcmdpblRvcCArIFwicHhcIjtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0aWNreUltcGwucHJvdG90eXBlLCBcIndyYXBwZXJcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQkd3JhcHBlcjtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgU3RpY2t5SW1wbC5wcm90b3R5cGUuc2V0V3JhcHBlckZyb21TZWxlY3Rvck9yRWxlbWVudCA9IGZ1bmN0aW9uIChzZWxlY3Rvck9yRWxlbWVudCkge1xuICAgICAgICBpZiAoIShkb2N1bWVudC5ib2R5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdbU3R1Y2suanNdIGRvY3VtZW50LmJvZHkgaXMgbm90IEhUTUxFbGVtZW50IGluIHRoaXMgZW52aXJvbm1lbnQnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGFyZW50ID0gKCh0aGlzLnBsYWNlaG9sZGVyICYmIHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudCkgfHxcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCkucGFyZW50RWxlbWVudDtcbiAgICAgICAgdGhpcy4kJHdyYXBwZXIgPSBub3JtYWxpemVFbGVtZW50KHNlbGVjdG9yT3JFbGVtZW50LCBwYXJlbnQsIGRvY3VtZW50LmJvZHkpO1xuICAgICAgICB0aGlzLmZsb29yID0gY29tcHV0ZUFic29sdXRlRmxvb3IodGhpcy4kJHdyYXBwZXIpO1xuICAgICAgICB0aGlzLm9wdGlvbnMud3JhcHBlciA9IHRoaXMuJCR3cmFwcGVyO1xuICAgIH07XG4gICAgU3RpY2t5SW1wbC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pc1N0aWNreSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyLmRlc3Ryb3koKTtcbiAgICAgICAgdGhpcy4kJG1hbmFnZXIudW5yZWdpc3Rlcih0aGlzKTtcbiAgICAgICAgZGVsZXRlIHRoaXMucGxhY2Vob2xkZXI7XG4gICAgICAgIGRlbGV0ZSB0aGlzLmVsZW1lbnQ7XG4gICAgICAgIGRlbGV0ZSB0aGlzLm9wdGlvbnM7XG4gICAgfTtcbiAgICBTdGlja3lJbXBsLnByb3RvdHlwZS5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCA9IGZ1bmN0aW9uIChyZWN0KSB7XG4gICAgICAgIGlmIChyZWN0ID09PSB2b2lkIDApIHsgcmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTsgfVxuICAgICAgICB0aGlzLnJlY3QgPSByZWN0O1xuICAgICAgICB0aGlzLmZsb29yID0gY29tcHV0ZUFic29sdXRlRmxvb3IodGhpcy53cmFwcGVyKTtcbiAgICAgICAgdmFyIHJlbGF0aXZlRmxvb3IgPSAodGhpcy5mbG9vciB8fCAwKSAtIHdpbmRvdy5wYWdlWU9mZnNldDtcbiAgICAgICAgaWYgKHRoaXMucmVjdC5ib3R0b20gPj0gcmVsYXRpdmVGbG9vciAmJiAhdGhpcy5pc1N0aWNrVG9Cb3R0b20pIHtcbiAgICAgICAgICAgIHRoaXMudG9wID0gcmVsYXRpdmVGbG9vciAtIHRoaXMucmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF0aGlzLmlzU3RpY2tUb0JvdHRvbSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgICAgICB0aGlzLnRvcCA9IHRoaXMubWFyZ2luVG9wO1xuICAgICAgICAgICAgdGhpcy5pc1N0aWNrVG9Cb3R0b20gPSBmYWxzZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5yZWN0LnRvcCA8IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgICAgICB0aGlzLnRvcCA9IHJlbGF0aXZlRmxvb3IgLSB0aGlzLnJlY3QuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTdGlja3lJbXBsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBwbGFjZWhvbGRlclJlY3QgPSB0aGlzLnBsYWNlaG9sZGVyLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIGlmICghdGhpcy5pc1N0aWNreSAmJiB0aGlzLm1hcmdpblRvcCA+IHBsYWNlaG9sZGVyUmVjdC50b3ApIHtcbiAgICAgICAgICAgIHRoaXMuaXNTdGlja3kgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmlzU3RpY2t5KSB7XG4gICAgICAgICAgICBpZiAocGxhY2Vob2xkZXJSZWN0LnRvcCA+PSB0aGlzLm1hcmdpblRvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdGlja3kgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgICAgICBpZiAodGhpcy5yZWN0LmxlZnQgIT09IHBsYWNlaG9sZGVyUmVjdC5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBwbGFjZWhvbGRlclJlY3QubGVmdCArIFwicHhcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuY29tcHV0ZVBvc2l0aW9uVG9wRnJvbVJlY3QodGhpcy5yZWN0KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFN0aWNreUltcGw7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU3RpY2t5SW1wbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFN0aWNreU1hbmFnZXJJbXBsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0aWNreU1hbmFnZXJJbXBsKF93aW5kb3cpIHtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzID0gW107XG4gICAgICAgIHRoaXMuJCRhY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQgPSBudWxsO1xuICAgICAgICB0aGlzLiQkd2luZG93ID0gX3dpbmRvdztcbiAgICAgICAgdGhpcy5idWxrVXBkYXRlID0gdGhpcy5idWxrVXBkYXRlLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlID0gdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUuYmluZCh0aGlzKTtcbiAgICB9XG4gICAgU3RpY2t5TWFuYWdlckltcGwuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoX3dpbmRvdykge1xuICAgICAgICBpZiAoIXRoaXMuJCRpbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy4kJGluc3RhbmNlID0gbmV3IFN0aWNreU1hbmFnZXJJbXBsKF93aW5kb3cpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLiQkaW5zdGFuY2U7XG4gICAgfTtcbiAgICBTdGlja3lNYW5hZ2VySW1wbC5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiAoc3RpY2t5KSB7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5jb25jYXQoW3N0aWNreV0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS51bnJlZ2lzdGVyID0gZnVuY3Rpb24gKHN0aWNreSkge1xuICAgICAgICB0aGlzLiQkc3RpY2tpZXMgPSB0aGlzLiQkc3RpY2tpZXMuZmlsdGVyKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UgIT09IHN0aWNreTsgfSk7XG4gICAgICAgIGlmICh0aGlzLiQkc3RpY2tpZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdGlja3lNYW5hZ2VySW1wbC5wcm90b3R5cGUuYnVsa1VwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkKSB7XG4gICAgICAgICAgICB0aGlzLiQkd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCA9IHRoaXMuJCR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIF90aGlzLiQkc3RpY2tpZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdGFuY2UpIHsgcmV0dXJuIGluc3RhbmNlLnVwZGF0ZSgpOyB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3RpY2t5TWFuYWdlckltcGwucHJvdG90eXBlLmRlc3Ryb3lBbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UuZGVzdHJveSgpOyB9KTtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzID0gW107XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5hY3RpdmF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLiQkYWN0aXZhdGVkICYmIHRoaXMuJCRzdGlja2llcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLiQkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuYnVsa1VwZGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiQkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlKTtcbiAgICAgICAgICAgIHRoaXMuJCRhY3RpdmF0ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnVsa1VwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5kZWFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy4kJGFjdGl2YXRlZCkge1xuICAgICAgICAgICAgdGhpcy4kJHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmJ1bGtVcGRhdGUpO1xuICAgICAgICAgICAgdGhpcy4kJHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmJ1bGtQbGFjZWhvbGRlclVwZGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiQkYWN0aXZhdGVkID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdGlja3lNYW5hZ2VySW1wbC5wcm90b3R5cGUuYnVsa1BsYWNlaG9sZGVyVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuJCR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkID0gdGhpcy4kJHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuJCRzdGlja2llcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0YW5jZSkge1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLnBsYWNlaG9sZGVyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIGluc3RhbmNlLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIFN0aWNreU1hbmFnZXJJbXBsO1xufSgpKTtcbmV4cG9ydHMuZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlID0gZnVuY3Rpb24gKF93aW5kb3cpIHtcbiAgICByZXR1cm4gU3RpY2t5TWFuYWdlckltcGwuZ2V0SW5zdGFuY2UoX3dpbmRvdyk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xudmFyIF9fcmVzdCA9ICh0aGlzICYmIHRoaXMuX19yZXN0KSB8fCBmdW5jdGlvbiAocywgZSkge1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXG4gICAgICAgIHRbcF0gPSBzW3BdO1xuICAgIGlmIChzICE9IG51bGwgJiYgdHlwZW9mIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxuICAgICAgICAgICAgICAgIHRbcFtpXV0gPSBzW3BbaV1dO1xuICAgICAgICB9XG4gICAgcmV0dXJuIHQ7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHN0dWNrTWFuYWdlcl8xID0gcmVxdWlyZShcIi4vc3R1Y2tNYW5hZ2VyXCIpO1xudmFyIHN0aWNreUltcGxfMSA9IHJlcXVpcmUoXCIuL3N0aWNreUltcGxcIik7XG52YXIgZ2V0RWxlbWVudHNBcnJheUZyb21TZXR0aW5nID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgIGlmIChvcHRpb24uZWxlbWVudCkge1xuICAgICAgICB2YXIgZWxlbWVudCA9IG9wdGlvbi5lbGVtZW50O1xuICAgICAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gW2VsZW1lbnRdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGVsZW1lbnQpIHx8IHR5cGVvZiBlbGVtZW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG9wdGlvbi5zZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKG9wdGlvbi5zZWxlY3RvcikpLmZpbHRlcihmdW5jdGlvbiAobWF5YmVIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG1heWJlSFRNTEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignW1N0dWNrLmpzXSBObyBzZWxlY3RvciwgZWxlbWVudCBub3IgZWxlbWVudHMgaW4gc2V0dGluZycpO1xufTtcbnZhciBTdHVja0ltcGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3R1Y2tJbXBsKHNldHRpbmdzLCBkZWZhdWx0T3B0aW9ucywgc2hhcmVkU3RhY2tpbmcpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSBbXTsgfVxuICAgICAgICBpZiAoZGVmYXVsdE9wdGlvbnMgPT09IHZvaWQgMCkgeyBkZWZhdWx0T3B0aW9ucyA9IHsgb2JzZXJ2ZTogdHJ1ZSB9OyB9XG4gICAgICAgIGlmIChzaGFyZWRTdGFja2luZyA9PT0gdm9pZCAwKSB7IHNoYXJlZFN0YWNraW5nID0gdHJ1ZTsgfVxuICAgICAgICB0aGlzLiQkaW5zdGFuY2VzID0gW107XG4gICAgICAgIHRoaXMuJCRtYW5hZ2VyID0gc3R1Y2tNYW5hZ2VyXzEuZ2V0U3R1Y2tNYW5hZ2VySW5zdGFuY2Uod2luZG93KS5yZWdpc3Rlcih0aGlzKTtcbiAgICAgICAgdGhpcy4kJGRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnM7XG4gICAgICAgIHRoaXMuY3JlYXRlKHNldHRpbmdzLCBzaGFyZWRTdGFja2luZyk7XG4gICAgfVxuICAgIFN0dWNrSW1wbC5wcm90b3R5cGUuY3JlYXRlID0gZnVuY3Rpb24gKHNvdXJjZSwgc2hhcmVkU3RhY2tpbmcpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHNoYXJlZFN0YWNraW5nID09PSB2b2lkIDApIHsgc2hhcmVkU3RhY2tpbmcgPSB0cnVlOyB9XG4gICAgICAgIHZhciBzZXR0aW5ncyA9IEFycmF5LmlzQXJyYXkoc291cmNlKSA/IHNvdXJjZSA6IFtzb3VyY2VdO1xuICAgICAgICB2YXIgcmVnaXN0ZXJlZCA9IHNldHRpbmdzLnJlZHVjZShmdW5jdGlvbiAoYWNjdW11bGF0b3IsIHNldHRpbmcpIHsgcmV0dXJuIGFjY3VtdWxhdG9yLmNvbmNhdChfdGhpcy5yZWdpc3RlcihzZXR0aW5nLCBzaGFyZWRTdGFja2luZykpOyB9LCBbXSk7XG4gICAgICAgIGlmIChyZWdpc3RlcmVkLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJCRtYW5hZ2VyLnVwZGF0ZSgpO1xuICAgICAgICByZXR1cm4gcmVnaXN0ZXJlZDtcbiAgICB9O1xuICAgIFN0dWNrSW1wbC5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiAoX2EsIHNoYXJlZFN0YWNraW5nKSB7XG4gICAgICAgIHZhciBfYjtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHNoYXJlZFN0YWNraW5nID09PSB2b2lkIDApIHsgc2hhcmVkU3RhY2tpbmcgPSB0cnVlOyB9XG4gICAgICAgIHZhciBzZWxlY3RvciA9IF9hLnNlbGVjdG9yLCBlbGVtZW50ID0gX2EuZWxlbWVudCwgb3B0aW9ucyA9IF9fcmVzdChfYSwgW1wic2VsZWN0b3JcIiwgXCJlbGVtZW50XCJdKTtcbiAgICAgICAgdmFyIHJlZ2lzdGVyZWRJbnN0YW5jZUVsZW1lbnRzID0gdGhpcy4kJG1hbmFnZXIuc3RpY2t5RWxlbWVudHM7XG4gICAgICAgIHZhciBzdGlja2llcyA9IGdldEVsZW1lbnRzQXJyYXlGcm9tU2V0dGluZyh7XG4gICAgICAgICAgICBzZWxlY3Rvcjogc2VsZWN0b3IsXG4gICAgICAgICAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgICAgICB9KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAodGFyZ2V0KSB7IHJldHVybiAhcmVnaXN0ZXJlZEluc3RhbmNlRWxlbWVudHMuaW5jbHVkZXModGFyZ2V0KTsgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKG5ld0VsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgc3RpY2t5SW1wbF8xLmRlZmF1bHQobmV3RWxlbWVudCwgX19hc3NpZ24oe30sIF90aGlzLiQkZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpLCBmYWxzZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLiQkbWFuYWdlci51cGRhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgKF9iID0gdGhpcy4kJG1hbmFnZXIpLmFkZFN0aWNraWVzLmFwcGx5KF9iLCBbc2hhcmVkU3RhY2tpbmddLmNvbmNhdChzdGlja2llcykpO1xuICAgICAgICB0aGlzLiQkaW5zdGFuY2VzID0gdGhpcy4kJGluc3RhbmNlcy5jb25jYXQoc3RpY2tpZXMpO1xuICAgICAgICByZXR1cm4gc3RpY2tpZXM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3R1Y2tJbXBsLnByb3RvdHlwZSwgXCJzdGlja2llc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCRpbnN0YW5jZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFN0dWNrSW1wbC5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kJG1hbmFnZXIudW5yZWdpc3Rlcih0aGlzKTtcbiAgICAgICAgdGhpcy4kJGluc3RhbmNlcyA9IFtdO1xuICAgIH07XG4gICAgcmV0dXJuIFN0dWNrSW1wbDtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTdHVja0ltcGw7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBzdGlja3lNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9zdGlja3lNYW5hZ2VyXCIpO1xudmFyIHV0aWxpdHlfMSA9IHJlcXVpcmUoXCIuL3V0aWxpdHlcIik7XG52YXIgU3R1Y2tNYW5hZ2VySW1wbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHVja01hbmFnZXJJbXBsKF93aW5kb3cpIHtcbiAgICAgICAgdGhpcy4kJHN0dWNrcyA9IFtdO1xuICAgICAgICB0aGlzLiQkc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMgPSBbXTtcbiAgICAgICAgdGhpcy4kJHdpbmRvdyA9IF93aW5kb3c7XG4gICAgfVxuICAgIFN0dWNrTWFuYWdlckltcGwuZ2V0SW5zdGFuY2UgPSBmdW5jdGlvbiAoX3dpbmRvdykge1xuICAgICAgICBpZiAoIXRoaXMuJCRpbnN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy4kJGluc3RhbmNlID0gbmV3IFN0dWNrTWFuYWdlckltcGwoX3dpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuJCRpbnN0YW5jZTtcbiAgICB9O1xuICAgIFN0dWNrTWFuYWdlckltcGwucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKHN0dWNrKSB7XG4gICAgICAgIHRoaXMuJCRzdHVja3MgPSB0aGlzLiQkc3R1Y2tzLmNvbmNhdChbc3R1Y2tdKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZS51bnJlZ2lzdGVyID0gZnVuY3Rpb24gKHN0dWNrKSB7XG4gICAgICAgIHRoaXMuZGVzdHJveVN0aWNraWVzLmFwcGx5KHRoaXMsIHN0dWNrLnN0aWNraWVzKTtcbiAgICAgICAgdGhpcy4kJHN0dWNrcyA9IHRoaXMuJCRzdHVja3MuZmlsdGVyKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UgIT09IHN0dWNrOyB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUsIFwic3RpY2tpZXNcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLiQkc3RpY2tpZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZSwgXCJzdGlja3lFbGVtZW50c1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCRzdGlja2llcy5tYXAoZnVuY3Rpb24gKHN0aWNreSkgeyByZXR1cm4gc3RpY2t5LmVsZW1lbnQ7IH0pO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUsIFwic3RhY2tpbmdTdGlja2llc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZS5hZGRTdGlja2llcyA9IGZ1bmN0aW9uIChzdGFja2luZykge1xuICAgICAgICB2YXIgc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHN0aWNraWVzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5jb25jYXQoc3RpY2tpZXMpO1xuICAgICAgICBpZiAoc3RhY2tpbmcpIHtcbiAgICAgICAgICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMuY29uY2F0KHN0aWNraWVzKTtcbiAgICAgICAgfVxuICAgICAgICBzdGlja3lNYW5hZ2VyXzEuZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHRoaXMuJCR3aW5kb3cpLmFjdGl2YXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUuZGVzdHJveVN0aWNraWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHN0aWNraWVzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgc3RpY2tpZXMuZm9yRWFjaChmdW5jdGlvbiAoaW5zdGFuY2UpIHsgcmV0dXJuIGluc3RhbmNlLmRlc3Ryb3koKTsgfSk7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5maWx0ZXIoZnVuY3Rpb24gKHN0aWNreSkgeyByZXR1cm4gIXN0aWNraWVzLmluY2x1ZGVzKHN0aWNreSk7IH0pO1xuICAgICAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IHRoaXMuJCRzdGFja2luZ1N0aWNraWVzLmZpbHRlcihmdW5jdGlvbiAoc3RpY2t5KSB7IHJldHVybiAhc3RpY2tpZXMuaW5jbHVkZXMoc3RpY2t5KTsgfSk7XG4gICAgICAgIGlmICh0aGlzLiQkc3RhY2tpbmdTdGlja2llcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IHRoaXMuc3RhY2tpbmdTdGlja2llc1xuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoaW5zdGFuY2UsIGluZGV4LCBhbGwpIHsgcmV0dXJuIGFsbC5pbmRleE9mKGluc3RhbmNlKSA9PT0gaW5kZXg7IH0pXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gKHtcbiAgICAgICAgICAgIGluc3RhbmNlOiBpbnN0YW5jZSxcbiAgICAgICAgICAgIHJlY3Q6IGluc3RhbmNlLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKSxcbiAgICAgICAgfSk7IH0pXG4gICAgICAgICAgICAuc29ydChmdW5jdGlvbiAoX2EsIF9iKSB7XG4gICAgICAgICAgICB2YXIgYmVmb3JlID0gX2EucmVjdDtcbiAgICAgICAgICAgIHZhciBhZnRlciA9IF9iLnJlY3Q7XG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlLnRvcCAtIGFmdGVyLnRvcDtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKF9hLCBfYikge1xuICAgICAgICAgICAgdmFyIGluc3RhbmNlcyA9IF9hLmluc3RhbmNlcywgY2VpbGluZyA9IF9hLmNlaWxpbmc7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBfYi5pbnN0YW5jZTtcbiAgICAgICAgICAgIGluc3RhbmNlLm1hcmdpblRvcCA9IGluc3RhbmNlLm9wdGlvbnMubWFyZ2luVG9wICsgY2VpbGluZztcbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2VzOiBpbnN0YW5jZXMuY29uY2F0KFtpbnN0YW5jZV0pLFxuICAgICAgICAgICAgICAgIGNlaWxpbmc6IGluc3RhbmNlLnJlY3QuaGVpZ2h0ICsgaW5zdGFuY2UubWFyZ2luVG9wLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfSwgeyBpbnN0YW5jZXM6IFtdLCBjZWlsaW5nOiAwIH0pLmluc3RhbmNlcztcbiAgICAgICAgc3RpY2t5TWFuYWdlcl8xLmdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSh0aGlzLiQkd2luZG93KS5idWxrVXBkYXRlKCk7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHV0aWxpdHlfMS5zdGFibGVTb3J0KHRoaXMuc3RpY2tpZXMsIGZ1bmN0aW9uIChiZWZvcmUsIGFmdGVyKSB7XG4gICAgICAgICAgICByZXR1cm4gYmVmb3JlLnBsYWNlaG9sZGVyLmNhY2hlZFJlY3QudG9wIC0gYWZ0ZXIucGxhY2Vob2xkZXIuY2FjaGVkUmVjdC50b3A7XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHJldHVybiBTdHVja01hbmFnZXJJbXBsO1xufSgpKTtcbmV4cG9ydHMuZ2V0U3R1Y2tNYW5hZ2VySW5zdGFuY2UgPSBmdW5jdGlvbiAoX3dpbmRvdykge1xuICAgIHJldHVybiBTdHVja01hbmFnZXJJbXBsLmdldEluc3RhbmNlKF93aW5kb3cpO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5ub29wID0gZnVuY3Rpb24gKCkgeyB9O1xuZXhwb3J0cy5zdGFibGVTb3J0ID0gZnVuY3Rpb24gKGFycmF5LCBjb21wYXJlRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gYXJyYXlcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoaXRlbSwgaW5kZXgpIHsgcmV0dXJuICh7IGl0ZW06IGl0ZW0sIGluZGV4OiBpbmRleCB9KTsgfSlcbiAgICAgICAgLnNvcnQoZnVuY3Rpb24gKGJlZm9yZSwgYWZ0ZXIpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IGNvbXBhcmVGdW5jdGlvbihiZWZvcmUuaXRlbSwgYWZ0ZXIuaXRlbSk7XG4gICAgICAgIHJldHVybiByZXN1bHQgIT09IDAgPyByZXN1bHQgOiBiZWZvcmUuaW5kZXggLSBhZnRlci5pbmRleDtcbiAgICB9KVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICB2YXIgaXRlbSA9IF9hLml0ZW07XG4gICAgICAgIHJldHVybiBpdGVtO1xuICAgIH0pO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=