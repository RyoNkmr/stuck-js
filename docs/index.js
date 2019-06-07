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
        Placeholder.wrap(this.original, this.element);
        this.cachedRect = this.updateRect();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9TdHVja0pzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vU3R1Y2tKcy8uL3NyYy9wbGFjZWhvbGRlci50cyIsIndlYnBhY2s6Ly9TdHVja0pzLy4vc3JjL3N0aWNreUltcGwudHMiLCJ3ZWJwYWNrOi8vU3R1Y2tKcy8uL3NyYy9zdGlja3lNYW5hZ2VyLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvc3R1Y2tJbXBsLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvc3R1Y2tNYW5hZ2VyLnRzIiwid2VicGFjazovL1N0dWNrSnMvLi9zcmMvdXRpbGl0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTztBQ1ZBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0RBQTBDLGdDQUFnQztBQUMxRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdFQUF3RCxrQkFBa0I7QUFDMUU7QUFDQSx5REFBaUQsY0FBYztBQUMvRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQXlDLGlDQUFpQztBQUMxRSx3SEFBZ0gsbUJBQW1CLEVBQUU7QUFDckk7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFD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ImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlN0dWNrSnNcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU3R1Y2tKc1wiXSA9IGZhY3RvcnkoKTtcbn0pKHRoaXMsIGZ1bmN0aW9uKCkge1xucmV0dXJuICIsIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgcGxhY2Vob2xkZXJfMSA9IHJlcXVpcmUoXCIuL3BsYWNlaG9sZGVyXCIpO1xuZXhwb3J0cy5QbGFjZWhvbGRlciA9IHBsYWNlaG9sZGVyXzEuZGVmYXVsdDtcbnZhciBzdGlja3lJbXBsXzEgPSByZXF1aXJlKFwiLi9zdGlja3lJbXBsXCIpO1xuZXhwb3J0cy5TdGlja3kgPSBzdGlja3lJbXBsXzEuZGVmYXVsdDtcbnZhciBzdHVja0ltcGxfMSA9IHJlcXVpcmUoXCIuL3N0dWNrSW1wbFwiKTtcbmV4cG9ydHMuU3R1Y2sgPSBzdHVja0ltcGxfMS5kZWZhdWx0O1xuZXhwb3J0cy5kZWZhdWx0ID0gc3R1Y2tJbXBsXzEuZGVmYXVsdDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHV0aWxpdHlfMSA9IHJlcXVpcmUoXCIuL3V0aWxpdHlcIik7XG52YXIgUGxhY2Vob2xkZXIgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGxhY2Vob2xkZXIoZWxlbWVudCwgb2JzZXJ2ZSwgb25VcGRhdGUpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKG9ic2VydmUgPT09IHZvaWQgMCkgeyBvYnNlcnZlID0gdHJ1ZTsgfVxuICAgICAgICBpZiAob25VcGRhdGUgPT09IHZvaWQgMCkgeyBvblVwZGF0ZSA9IHV0aWxpdHlfMS5ub29wOyB9XG4gICAgICAgIHRoaXMuJCRzaG91bGRQbGFjZWhvbGQgPSB0cnVlO1xuICAgICAgICB0aGlzLm9yaWdpbmFsID0gZWxlbWVudDtcbiAgICAgICAgdGhpcy5vblVwZGF0ZSA9IHR5cGVvZiBvblVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IG9uVXBkYXRlIDogdXRpbGl0eV8xLm5vb3A7XG4gICAgICAgIHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5vcmlnaW5hbCk7XG4gICAgICAgIHRoaXMuaW5pdGlhbGx5SGlkZGVuID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMuZGlzcGxheSA9PT0gJ25vbmUnO1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsbHlIaWRkZW4pIHtcbiAgICAgICAgICAgIHRoaXMuZXhlY1doaWxlU3R1Y2tpbmcoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKF90aGlzLm9yaWdpbmFsKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IFBsYWNlaG9sZGVyLmNyZWF0ZVBsYWNlaG9sZGVyRWxlbWVudCgpO1xuICAgICAgICB0aGlzLmFwcGx5SW5pdGlhbFN0eWxlcygpO1xuICAgICAgICBQbGFjZWhvbGRlci53cmFwKHRoaXMub3JpZ2luYWwsIHRoaXMuZWxlbWVudCk7XG4gICAgICAgIHRoaXMuY2FjaGVkUmVjdCA9IHRoaXMudXBkYXRlUmVjdCgpO1xuICAgICAgICBpZiAob2JzZXJ2ZSkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlciA9IFBsYWNlaG9sZGVyLmNyZWF0ZU9ic2VydmVyKHRoaXMub3JpZ2luYWwsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVwZGF0ZSgpOyB9KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoUGxhY2Vob2xkZXIucHJvdG90eXBlLCBcInNob3VsZFBsYWNlaG9sZFwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICF0aGlzLmluaXRpYWxseUhpZGRlbiAmJiB0aGlzLiQkc2hvdWxkUGxhY2Vob2xkO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2hvdWxkUGxhY2Vob2xkID09PSB2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuJCRzaG91bGRQbGFjZWhvbGQgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKHRydWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKGZvcmNlVXBkYXRlKSB7XG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZSA9PT0gdm9pZCAwKSB7IGZvcmNlVXBkYXRlID0gZmFsc2U7IH1cbiAgICAgICAgaWYgKHRoaXMuc2hvdWxkUGxhY2Vob2xkKSB7XG4gICAgICAgICAgICB0aGlzLmFwcGx5U3R5bGVzKGZvcmNlVXBkYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlU3R5bGVzKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vblVwZGF0ZSgpO1xuICAgIH07XG4gICAgUGxhY2Vob2xkZXIucHJvdG90eXBlLnVwZGF0ZVJlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2FjaGVkUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICAgICAgICB0aGlzLmV4ZWNXaGlsZVN0dWNraW5nKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYWNoZWRSZWN0ID0gX3RoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLmNhY2hlZFJlY3Q7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUuZGVzdHJveSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgIHRoaXMub2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXI7XG4gICAgICAgIH1cbiAgICAgICAgUGxhY2Vob2xkZXIudW53cmFwKHRoaXMub3JpZ2luYWwpO1xuICAgICAgICBkZWxldGUgdGhpcy5lbGVtZW50O1xuICAgICAgICBkZWxldGUgdGhpcy5vcmlnaW5hbDtcbiAgICAgICAgZGVsZXRlIHRoaXMuY2FjaGVkUmVjdDtcbiAgICAgICAgZGVsZXRlIHRoaXMub25VcGRhdGU7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUuZXhlY1doaWxlU3R1Y2tpbmcgPSBmdW5jdGlvbiAoZXhlY3V0ZSkge1xuICAgICAgICB2YXIgc3RhdGUgPSB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2s7XG4gICAgICAgIHRoaXMub3JpZ2luYWwuZGF0YXNldC5zdHVjayA9ICd0cnVlJztcbiAgICAgICAgZXhlY3V0ZSgpO1xuICAgICAgICB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2sgPSBzdGF0ZTtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS5hcHBseUluaXRpYWxTdHlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMgfHwgdGhpcy5pbml0aWFsbHlIaWRkZW4pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubWFyZ2luID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMubWFyZ2luO1xuICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubWluV2lkdGggPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5taW5XaWR0aDtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLm1pbkhlaWdodDtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMud2lkdGg7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5oZWlnaHQ7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5wcm90b3R5cGUuYXBwbHlTdHlsZXMgPSBmdW5jdGlvbiAoZm9yY2VVcGRhdGUpIHtcbiAgICAgICAgaWYgKGZvcmNlVXBkYXRlID09PSB2b2lkIDApIHsgZm9yY2VVcGRhdGUgPSBmYWxzZTsgfVxuICAgICAgICBpZiAoIXRoaXMub3JpZ2luYWwgfHwgIXRoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfYSA9IHRoaXMub3JpZ2luYWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCksIG9yaWdpbmFsV2lkdGggPSBfYS53aWR0aCwgb3JpZ2luYWxIZWlnaHQgPSBfYS5oZWlnaHQ7XG4gICAgICAgIHZhciB3aWR0aENoYW5nZWQgPSBvcmlnaW5hbFdpZHRoICE9PSB0aGlzLmNhY2hlZFJlY3Qud2lkdGg7XG4gICAgICAgIHZhciBoZWlnaHRDaGFuZ2VkID0gb3JpZ2luYWxIZWlnaHQgIT09IHRoaXMuY2FjaGVkUmVjdC5oZWlnaHQ7XG4gICAgICAgIGlmICghZm9yY2VVcGRhdGUgJiYgIXdpZHRoQ2hhbmdlZCAmJiAhaGVpZ2h0Q2hhbmdlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmb3JjZVVwZGF0ZSB8fCB3aWR0aENoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IG9yaWdpbmFsV2lkdGggKyBcInB4XCI7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZvcmNlVXBkYXRlIHx8IGhlaWdodENoYW5nZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBvcmlnaW5hbEhlaWdodCArIFwicHhcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVwZGF0ZVJlY3QoKTtcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLnByb3RvdHlwZS5yZW1vdmVTdHlsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5vcmlnaW5hbCB8fCAhdGhpcy5lbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gJyc7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB9O1xuICAgIFBsYWNlaG9sZGVyLmNyZWF0ZU9ic2VydmVyID0gZnVuY3Rpb24gKHRhcmdldE5vZGUsIGNhbGxiYWNrKSB7XG4gICAgICAgIGlmICghdGFyZ2V0Tm9kZSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIltTdHVjay5qc10gQ291bGQgbm90IGNyZWF0ZSBtdXRhdGlvbiBvYnNlcnZlciBvbiB0YXJnZXROb2RlIFwiICsgU3RyaW5nKHRhcmdldE5vZGUpICsgXCIuIFRoaXMgc2hvdWxkIGJlIEhUTUxFbGVtZW50XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkZXRlY3RTaXplTXV0YXRpb24gPSBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHZhciB0eXBlID0gX2EudHlwZTtcbiAgICAgICAgICAgIHJldHVybiB0eXBlID09PSAnY2hpbGRMaXN0JyB8fCB0eXBlID09PSAnYXR0cmlidXRlcyc7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGZ1bmN0aW9uIChtdXRhdGlvbnMpIHtcbiAgICAgICAgICAgIHZhciBpc011dGF0ZWQgPSBtdXRhdGlvbnMuc29tZShkZXRlY3RTaXplTXV0YXRpb24pO1xuICAgICAgICAgICAgaWYgKGlzTXV0YXRlZCkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBvYnNlcnZlci5vYnNlcnZlKHRhcmdldE5vZGUsIHtcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHRydWUsXG4gICAgICAgICAgICBhdHRyaWJ1dGVGaWx0ZXI6IFsnc3R5bGUnLCAnY2xhc3MnXSxcbiAgICAgICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgICAgIHN1YnRyZWU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gb2JzZXJ2ZXI7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci51bndyYXAgPSBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0gdGFyZ2V0LnBhcmVudE5vZGU7XG4gICAgICAgIGlmICh3cmFwcGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHdyYXBwZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmViZWdpbicsIHRhcmdldCk7XG4gICAgICAgICAgICB2YXIgcGFyZW50XzEgPSB3cmFwcGVyLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBpZiAocGFyZW50XzEgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHBhcmVudF8xLnJlbW92ZUNoaWxkKHdyYXBwZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci53cmFwID0gZnVuY3Rpb24gKHRhcmdldCwgd3JhcHBlcikge1xuICAgICAgICBpZiAodGFyZ2V0LnBhcmVudE5vZGUgIT09IHdyYXBwZXIpIHtcbiAgICAgICAgICAgIHRhcmdldC5pbnNlcnRBZGphY2VudEVsZW1lbnQoJ2JlZm9yZWJlZ2luJywgd3JhcHBlcik7XG4gICAgICAgICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHdyYXBwZXI7XG4gICAgfTtcbiAgICBQbGFjZWhvbGRlci5jcmVhdGVQbGFjZWhvbGRlckVsZW1lbnQgPSBmdW5jdGlvbiAodGFnTmFtZSkge1xuICAgICAgICBpZiAodGFnTmFtZSA9PT0gdm9pZCAwKSB7IHRhZ05hbWUgPSAnZGl2JzsgfVxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICB9O1xuICAgIHJldHVybiBQbGFjZWhvbGRlcjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBQbGFjZWhvbGRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBzdGlja3lNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9zdGlja3lNYW5hZ2VyXCIpO1xudmFyIHBsYWNlaG9sZGVyXzEgPSByZXF1aXJlKFwiLi9wbGFjZWhvbGRlclwiKTtcbnZhciB1dGlsaXR5XzEgPSByZXF1aXJlKFwiLi91dGlsaXR5XCIpO1xudmFyIG5vcm1hbGl6ZUVsZW1lbnQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgZmFsbGJhY2tzID0gW107XG4gICAgZm9yICh2YXIgX2kgPSAxOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgZmFsbGJhY2tzW19pIC0gMV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICBpZiAodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHZhciBlbGVtZW50ID0gW3ZhbHVlICYmIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodmFsdWUpXS5jb25jYXQoZmFsbGJhY2tzKS5maW5kKGZ1bmN0aW9uIChpdGVtKSB7IHJldHVybiAhIWl0ZW0gJiYgaXRlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50OyB9KTtcbiAgICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdbU3R1Y2stanNdIENvdWxkIG5vdCBmaW5kIEhUTUxFbGVtZW50Jyk7XG59O1xudmFyIGNvbXB1dGVBYnNvbHV0ZUZsb29yID0gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgIHZhciBhYnNvbHV0ZUJvdHRvbSA9IHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gKyB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgdmFyIHBhZGRpbmdCb3R0b20gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpLnBhZGRpbmdCb3R0b207XG4gICAgdmFyIHBhZGRpbmdCb3R0b21QaXhlbHMgPSBwYWRkaW5nQm90dG9tICE9PSBudWxsID8gcGFyc2VJbnQocGFkZGluZ0JvdHRvbSwgMTApIDogMDtcbiAgICByZXR1cm4gYWJzb2x1dGVCb3R0b20gLSBwYWRkaW5nQm90dG9tUGl4ZWxzO1xufTtcbnZhciBTdGlja3lJbXBsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0aWNreUltcGwoZWxlbWVudCwgb3B0aW9ucywgYWN0aXZhdGUsIG9uVXBkYXRlKSB7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB2b2lkIDApIHsgb3B0aW9ucyA9IHsgb2JzZXJ2ZTogdHJ1ZSB9OyB9XG4gICAgICAgIGlmIChhY3RpdmF0ZSA9PT0gdm9pZCAwKSB7IGFjdGl2YXRlID0gdHJ1ZTsgfVxuICAgICAgICBpZiAob25VcGRhdGUgPT09IHZvaWQgMCkgeyBvblVwZGF0ZSA9IHV0aWxpdHlfMS5ub29wOyB9XG4gICAgICAgIHRoaXMubWFyZ2luVG9wID0gMDtcbiAgICAgICAgdGhpcy5pc1N0aWNrVG9Cb3R0b20gPSBmYWxzZTtcbiAgICAgICAgaWYgKCFlbGVtZW50KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1tTdHVjay1qc10gSW52YWxpZCBlbGVtZW50IGdpdmVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kJG1hbmFnZXIgPSBzdGlja3lNYW5hZ2VyXzEuZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHdpbmRvdykucmVnaXN0ZXIodGhpcyk7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICAgIHRoaXMucmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5vcHRpb25zID0gX19hc3NpZ24oeyBtYXJnaW5Ub3A6IDAgfSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMubWFyZ2luVG9wID0gdGhpcy5vcHRpb25zLm1hcmdpblRvcCB8fCAwO1xuICAgICAgICB0aGlzLnNldFdyYXBwZXJGcm9tU2VsZWN0b3JPckVsZW1lbnQodGhpcy5vcHRpb25zLndyYXBwZXIpO1xuICAgICAgICB0aGlzLnBsYWNlaG9sZGVyID0gbmV3IHBsYWNlaG9sZGVyXzEuZGVmYXVsdCh0aGlzLmVsZW1lbnQsIHRoaXMub3B0aW9ucy5vYnNlcnZlIHx8IHRydWUsIG9uVXBkYXRlIHx8IHRoaXMuJCRtYW5hZ2VyLmJ1bGtVcGRhdGUpO1xuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdHVjayA9ICcnO1xuICAgICAgICBpZiAoYWN0aXZhdGUpIHtcbiAgICAgICAgICAgIHRoaXMuJCRtYW5hZ2VyLmFjdGl2YXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wbGFjZWhvbGRlci5zaG91bGRQbGFjZWhvbGQgPSB0aGlzLmlzU3RpY2t5O1xuICAgIH1cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RpY2t5SW1wbC5wcm90b3R5cGUsIFwiaXNTdGlja3lcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQgIT09IG51bGwgJiYgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYWNlaG9sZGVyLnNob3VsZFBsYWNlaG9sZCA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lbGVtZW50LmRhdGFzZXQuc3R1Y2sgPSB2YWx1ZSA/IHZhbHVlLnRvU3RyaW5nKCkgOiAnJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9IHZhbHVlID8gJ2ZpeGVkJyA6ICcnO1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHZhbHVlID8gdGhpcy50b3AgKyBcInB4XCIgOiAnJztcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gdmFsdWVcbiAgICAgICAgICAgICAgICA/IHRoaXMucGxhY2Vob2xkZXIudXBkYXRlUmVjdCgpLmxlZnQgKyBcInB4XCJcbiAgICAgICAgICAgICAgICA6ICcnO1xuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RpY2t5SW1wbC5wcm90b3R5cGUsIFwidG9wXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJGFkZGl0aW9uYWxUb3AgfHwgdGhpcy4kJGFkZGl0aW9uYWxUb3AgPT09IDBcbiAgICAgICAgICAgICAgICA/IHRoaXMuJCRhZGRpdGlvbmFsVG9wXG4gICAgICAgICAgICAgICAgOiB0aGlzLm1hcmdpblRvcDtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuJCRhZGRpdGlvbmFsVG9wID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdmFsdWUgPyB2YWx1ZSArIFwicHhcIiA6IHRoaXMubWFyZ2luVG9wICsgXCJweFwiO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RpY2t5SW1wbC5wcm90b3R5cGUsIFwid3JhcHBlclwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCR3cmFwcGVyO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBTdGlja3lJbXBsLnByb3RvdHlwZS5zZXRXcmFwcGVyRnJvbVNlbGVjdG9yT3JFbGVtZW50ID0gZnVuY3Rpb24gKHNlbGVjdG9yT3JFbGVtZW50KSB7XG4gICAgICAgIGlmICghKGRvY3VtZW50LmJvZHkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1tTdHVjay5qc10gZG9jdW1lbnQuYm9keSBpcyBub3QgSFRNTEVsZW1lbnQgaW4gdGhpcyBlbnZpcm9ubWVudCcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBwYXJlbnQgPSAoKHRoaXMucGxhY2Vob2xkZXIgJiYgdGhpcy5wbGFjZWhvbGRlci5lbGVtZW50KSB8fFxuICAgICAgICAgICAgdGhpcy5lbGVtZW50KS5wYXJlbnRFbGVtZW50O1xuICAgICAgICB0aGlzLiQkd3JhcHBlciA9IG5vcm1hbGl6ZUVsZW1lbnQoc2VsZWN0b3JPckVsZW1lbnQsIHBhcmVudCwgZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIHRoaXMuZmxvb3IgPSBjb21wdXRlQWJzb2x1dGVGbG9vcih0aGlzLiQkd3JhcHBlcik7XG4gICAgICAgIHRoaXMub3B0aW9ucy53cmFwcGVyID0gdGhpcy4kJHdyYXBwZXI7XG4gICAgfTtcbiAgICBTdGlja3lJbXBsLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmlzU3RpY2t5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGxhY2Vob2xkZXIuZGVzdHJveSgpO1xuICAgICAgICB0aGlzLiQkbWFuYWdlci51bnJlZ2lzdGVyKHRoaXMpO1xuICAgICAgICBkZWxldGUgdGhpcy5wbGFjZWhvbGRlcjtcbiAgICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudDtcbiAgICAgICAgZGVsZXRlIHRoaXMub3B0aW9ucztcbiAgICB9O1xuICAgIFN0aWNreUltcGwucHJvdG90eXBlLmNvbXB1dGVQb3NpdGlvblRvcEZyb21SZWN0ID0gZnVuY3Rpb24gKHJlY3QpIHtcbiAgICAgICAgaWYgKHJlY3QgPT09IHZvaWQgMCkgeyByZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpOyB9XG4gICAgICAgIHRoaXMucmVjdCA9IHJlY3Q7XG4gICAgICAgIHRoaXMuZmxvb3IgPSBjb21wdXRlQWJzb2x1dGVGbG9vcih0aGlzLndyYXBwZXIpO1xuICAgICAgICB2YXIgcmVsYXRpdmVGbG9vciA9ICh0aGlzLmZsb29yIHx8IDApIC0gd2luZG93LnBhZ2VZT2Zmc2V0O1xuICAgICAgICBpZiAodGhpcy5yZWN0LmJvdHRvbSA+PSByZWxhdGl2ZUZsb29yICYmICF0aGlzLmlzU3RpY2tUb0JvdHRvbSkge1xuICAgICAgICAgICAgdGhpcy50b3AgPSByZWxhdGl2ZUZsb29yIC0gdGhpcy5yZWN0LmhlaWdodDtcbiAgICAgICAgICAgIHRoaXMuaXNTdGlja1RvQm90dG9tID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXRoaXMuaXNTdGlja1RvQm90dG9tKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucmVjdC50b3AgPj0gdGhpcy5tYXJnaW5Ub3ApIHtcbiAgICAgICAgICAgIHRoaXMudG9wID0gdGhpcy5tYXJnaW5Ub3A7XG4gICAgICAgICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnJlY3QudG9wIDwgdGhpcy5tYXJnaW5Ub3ApIHtcbiAgICAgICAgICAgIHRoaXMudG9wID0gcmVsYXRpdmVGbG9vciAtIHRoaXMucmVjdC5oZWlnaHQ7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFN0aWNreUltcGwucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHBsYWNlaG9sZGVyUmVjdCA9IHRoaXMucGxhY2Vob2xkZXIuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RpY2t5ICYmIHRoaXMubWFyZ2luVG9wID4gcGxhY2Vob2xkZXJSZWN0LnRvcCkge1xuICAgICAgICAgICAgdGhpcy5pc1N0aWNreSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuaXNTdGlja3kpIHtcbiAgICAgICAgICAgIGlmIChwbGFjZWhvbGRlclJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc1N0aWNreSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJlY3QubGVmdCAhPT0gcGxhY2Vob2xkZXJSZWN0LmxlZnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQuc3R5bGUubGVmdCA9IHBsYWNlaG9sZGVyUmVjdC5sZWZ0ICsgXCJweFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCh0aGlzLnJlY3QpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU3RpY2t5SW1wbDtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTdGlja3lJbXBsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3RpY2t5TWFuYWdlckltcGwgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3RpY2t5TWFuYWdlckltcGwoX3dpbmRvdykge1xuICAgICAgICB0aGlzLiQkc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgdGhpcy4kJGFjdGl2YXRlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCA9IG51bGw7XG4gICAgICAgIHRoaXMuJCR3aW5kb3cgPSBfd2luZG93O1xuICAgICAgICB0aGlzLmJ1bGtVcGRhdGUgPSB0aGlzLmJ1bGtVcGRhdGUuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUgPSB0aGlzLmJ1bGtQbGFjZWhvbGRlclVwZGF0ZS5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBTdGlja3lNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIChfd2luZG93KSB7XG4gICAgICAgIGlmICghdGhpcy4kJGluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLiQkaW5zdGFuY2UgPSBuZXcgU3RpY2t5TWFuYWdlckltcGwoX3dpbmRvdyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuJCRpbnN0YW5jZTtcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChzdGlja3kpIHtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzID0gdGhpcy4kJHN0aWNraWVzLmNvbmNhdChbc3RpY2t5XSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3RpY2t5TWFuYWdlckltcGwucHJvdG90eXBlLnVucmVnaXN0ZXIgPSBmdW5jdGlvbiAoc3RpY2t5KSB7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5maWx0ZXIoZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiBpbnN0YW5jZSAhPT0gc3RpY2t5OyB9KTtcbiAgICAgICAgaWYgKHRoaXMuJCRzdGlja2llcy5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5idWxrVXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpIHtcbiAgICAgICAgICAgIHRoaXMuJCR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkID0gdGhpcy4kJHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuJCRzdGlja2llcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UudXBkYXRlKCk7IH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdGlja3lNYW5hZ2VySW1wbC5wcm90b3R5cGUuZGVzdHJveUFsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiBpbnN0YW5jZS5kZXN0cm95KCk7IH0pO1xuICAgICAgICB0aGlzLiQkc3RpY2tpZXMgPSBbXTtcbiAgICAgICAgdGhpcy5kZWFjdGl2YXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3RpY2t5TWFuYWdlckltcGwucHJvdG90eXBlLmFjdGl2YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMuJCRhY3RpdmF0ZWQgJiYgdGhpcy4kJHN0aWNraWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuJCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5idWxrVXBkYXRlKTtcbiAgICAgICAgICAgIHRoaXMuJCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUpO1xuICAgICAgICAgICAgdGhpcy4kJGFjdGl2YXRlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWxrVXBkYXRlKCk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgU3RpY2t5TWFuYWdlckltcGwucHJvdG90eXBlLmRlYWN0aXZhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLiQkYWN0aXZhdGVkKSB7XG4gICAgICAgICAgICB0aGlzLiQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuYnVsa1VwZGF0ZSk7XG4gICAgICAgICAgICB0aGlzLiQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlKTtcbiAgICAgICAgICAgIHRoaXMuJCRhY3RpdmF0ZWQgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0aWNreU1hbmFnZXJJbXBsLnByb3RvdHlwZS5idWxrUGxhY2Vob2xkZXJVcGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCkge1xuICAgICAgICAgICAgdGhpcy4kJHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQgPSB0aGlzLiQkd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy4kJHN0aWNraWVzLmZvckVhY2goZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UucGxhY2Vob2xkZXIudXBkYXRlKCk7XG4gICAgICAgICAgICAgICAgaW5zdGFuY2UudXBkYXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gU3RpY2t5TWFuYWdlckltcGw7XG59KCkpO1xuZXhwb3J0cy5nZXRTdGlja3lNYW5hZ2VySW5zdGFuY2UgPSBmdW5jdGlvbiAoX3dpbmRvdykge1xuICAgIHJldHVybiBTdGlja3lNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZShfd2luZG93KTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2Fzc2lnbiA9ICh0aGlzICYmIHRoaXMuX19hc3NpZ24pIHx8IGZ1bmN0aW9uICgpIHtcbiAgICBfX2Fzc2lnbiA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odCkge1xuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XG4gICAgICAgICAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkpXG4gICAgICAgICAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHQ7XG4gICAgfTtcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbn07XG52YXIgX19yZXN0ID0gKHRoaXMgJiYgdGhpcy5fX3Jlc3QpIHx8IGZ1bmN0aW9uIChzLCBlKSB7XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBwIGluIHMpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwocywgcCkgJiYgZS5pbmRleE9mKHApIDwgMClcbiAgICAgICAgdFtwXSA9IHNbcF07XG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgcCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMocyk7IGkgPCBwLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XG4gICAgICAgIH1cbiAgICByZXR1cm4gdDtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgc3R1Y2tNYW5hZ2VyXzEgPSByZXF1aXJlKFwiLi9zdHVja01hbmFnZXJcIik7XG52YXIgc3RpY2t5SW1wbF8xID0gcmVxdWlyZShcIi4vc3RpY2t5SW1wbFwiKTtcbnZhciBnZXRFbGVtZW50c0FycmF5RnJvbVNldHRpbmcgPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgaWYgKG9wdGlvbi5lbGVtZW50KSB7XG4gICAgICAgIHZhciBlbGVtZW50ID0gb3B0aW9uLmVsZW1lbnQ7XG4gICAgICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbZWxlbWVudF07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudCkgfHwgdHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAob3B0aW9uLnNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwob3B0aW9uLnNlbGVjdG9yKSkuZmlsdGVyKGZ1bmN0aW9uIChtYXliZUhUTUxFbGVtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbWF5YmVIVE1MRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCdbU3R1Y2suanNdIE5vIHNlbGVjdG9yLCBlbGVtZW50IG5vciBlbGVtZW50cyBpbiBzZXR0aW5nJyk7XG59O1xudmFyIFN0dWNrSW1wbCA9IC8qKiBAY2xhc3MgKi8gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHVja0ltcGwoc2V0dGluZ3MsIGRlZmF1bHRPcHRpb25zLCBzaGFyZWRTdGFja2luZykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHZvaWQgMCkgeyBzZXR0aW5ncyA9IFtdOyB9XG4gICAgICAgIGlmIChkZWZhdWx0T3B0aW9ucyA9PT0gdm9pZCAwKSB7IGRlZmF1bHRPcHRpb25zID0geyBvYnNlcnZlOiB0cnVlIH07IH1cbiAgICAgICAgaWYgKHNoYXJlZFN0YWNraW5nID09PSB2b2lkIDApIHsgc2hhcmVkU3RhY2tpbmcgPSB0cnVlOyB9XG4gICAgICAgIHRoaXMuJCRpbnN0YW5jZXMgPSBbXTtcbiAgICAgICAgdGhpcy4kJG1hbmFnZXIgPSBzdHVja01hbmFnZXJfMS5nZXRTdHVja01hbmFnZXJJbnN0YW5jZSh3aW5kb3cpLnJlZ2lzdGVyKHRoaXMpO1xuICAgICAgICB0aGlzLiQkZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9ucztcbiAgICAgICAgdGhpcy5jcmVhdGUoc2V0dGluZ3MsIHNoYXJlZFN0YWNraW5nKTtcbiAgICB9XG4gICAgU3R1Y2tJbXBsLnByb3RvdHlwZS5jcmVhdGUgPSBmdW5jdGlvbiAoc291cmNlLCBzaGFyZWRTdGFja2luZykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoc2hhcmVkU3RhY2tpbmcgPT09IHZvaWQgMCkgeyBzaGFyZWRTdGFja2luZyA9IHRydWU7IH1cbiAgICAgICAgdmFyIHNldHRpbmdzID0gQXJyYXkuaXNBcnJheShzb3VyY2UpID8gc291cmNlIDogW3NvdXJjZV07XG4gICAgICAgIHZhciByZWdpc3RlcmVkID0gc2V0dGluZ3MucmVkdWNlKGZ1bmN0aW9uIChhY2N1bXVsYXRvciwgc2V0dGluZykgeyByZXR1cm4gYWNjdW11bGF0b3IuY29uY2F0KF90aGlzLnJlZ2lzdGVyKHNldHRpbmcsIHNoYXJlZFN0YWNraW5nKSk7IH0sIFtdKTtcbiAgICAgICAgaWYgKHJlZ2lzdGVyZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kJG1hbmFnZXIudXBkYXRlKCk7XG4gICAgICAgIHJldHVybiByZWdpc3RlcmVkO1xuICAgIH07XG4gICAgU3R1Y2tJbXBsLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChfYSwgc2hhcmVkU3RhY2tpbmcpIHtcbiAgICAgICAgdmFyIF9iO1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAoc2hhcmVkU3RhY2tpbmcgPT09IHZvaWQgMCkgeyBzaGFyZWRTdGFja2luZyA9IHRydWU7IH1cbiAgICAgICAgdmFyIHNlbGVjdG9yID0gX2Euc2VsZWN0b3IsIGVsZW1lbnQgPSBfYS5lbGVtZW50LCBvcHRpb25zID0gX19yZXN0KF9hLCBbXCJzZWxlY3RvclwiLCBcImVsZW1lbnRcIl0pO1xuICAgICAgICB2YXIgcmVnaXN0ZXJlZEluc3RhbmNlRWxlbWVudHMgPSB0aGlzLiQkbWFuYWdlci5zdGlja3lFbGVtZW50cztcbiAgICAgICAgdmFyIHN0aWNraWVzID0gZ2V0RWxlbWVudHNBcnJheUZyb21TZXR0aW5nKHtcbiAgICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgICAgIGVsZW1lbnQ6IGVsZW1lbnQsXG4gICAgICAgIH0pXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uICh0YXJnZXQpIHsgcmV0dXJuICFyZWdpc3RlcmVkSW5zdGFuY2VFbGVtZW50cy5pbmNsdWRlcyh0YXJnZXQpOyB9KVxuICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAobmV3RWxlbWVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBzdGlja3lJbXBsXzEuZGVmYXVsdChuZXdFbGVtZW50LCBfX2Fzc2lnbih7fSwgX3RoaXMuJCRkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyksIGZhbHNlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuJCRtYW5hZ2VyLnVwZGF0ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICAoX2IgPSB0aGlzLiQkbWFuYWdlcikuYWRkU3RpY2tpZXMuYXBwbHkoX2IsIFtzaGFyZWRTdGFja2luZ10uY29uY2F0KHN0aWNraWVzKSk7XG4gICAgICAgIHRoaXMuJCRpbnN0YW5jZXMgPSB0aGlzLiQkaW5zdGFuY2VzLmNvbmNhdChzdGlja2llcyk7XG4gICAgICAgIHJldHVybiBzdGlja2llcztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHVja0ltcGwucHJvdG90eXBlLCBcInN0aWNraWVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJGluc3RhbmNlcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgU3R1Y2tJbXBsLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLiQkbWFuYWdlci51bnJlZ2lzdGVyKHRoaXMpO1xuICAgICAgICB0aGlzLiQkaW5zdGFuY2VzID0gW107XG4gICAgfTtcbiAgICByZXR1cm4gU3R1Y2tJbXBsO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0dWNrSW1wbDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIHN0aWNreU1hbmFnZXJfMSA9IHJlcXVpcmUoXCIuL3N0aWNreU1hbmFnZXJcIik7XG52YXIgdXRpbGl0eV8xID0gcmVxdWlyZShcIi4vdXRpbGl0eVwiKTtcbnZhciBTdHVja01hbmFnZXJJbXBsID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0dWNrTWFuYWdlckltcGwoX3dpbmRvdykge1xuICAgICAgICB0aGlzLiQkc3R1Y2tzID0gW107XG4gICAgICAgIHRoaXMuJCRzdGlja2llcyA9IFtdO1xuICAgICAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IFtdO1xuICAgICAgICB0aGlzLiQkd2luZG93ID0gX3dpbmRvdztcbiAgICB9XG4gICAgU3R1Y2tNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZSA9IGZ1bmN0aW9uIChfd2luZG93KSB7XG4gICAgICAgIGlmICghdGhpcy4kJGluc3RhbmNlKSB7XG4gICAgICAgICAgICB0aGlzLiQkaW5zdGFuY2UgPSBuZXcgU3R1Y2tNYW5hZ2VySW1wbChfd2luZG93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy4kJGluc3RhbmNlO1xuICAgIH07XG4gICAgU3R1Y2tNYW5hZ2VySW1wbC5wcm90b3R5cGUucmVnaXN0ZXIgPSBmdW5jdGlvbiAoc3R1Y2spIHtcbiAgICAgICAgdGhpcy4kJHN0dWNrcyA9IHRoaXMuJCRzdHVja3MuY29uY2F0KFtzdHVja10pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIFN0dWNrTWFuYWdlckltcGwucHJvdG90eXBlLnVucmVnaXN0ZXIgPSBmdW5jdGlvbiAoc3R1Y2spIHtcbiAgICAgICAgdGhpcy5kZXN0cm95U3RpY2tpZXMuYXBwbHkodGhpcywgc3R1Y2suc3RpY2tpZXMpO1xuICAgICAgICB0aGlzLiQkc3R1Y2tzID0gdGhpcy4kJHN0dWNrcy5maWx0ZXIoZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiBpbnN0YW5jZSAhPT0gc3R1Y2s7IH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZSwgXCJzdGlja2llc1wiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuJCRzdGlja2llcztcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFN0dWNrTWFuYWdlckltcGwucHJvdG90eXBlLCBcInN0aWNreUVsZW1lbnRzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJHN0aWNraWVzLm1hcChmdW5jdGlvbiAoc3RpY2t5KSB7IHJldHVybiBzdGlja3kuZWxlbWVudDsgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZSwgXCJzdGFja2luZ1N0aWNraWVzXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy4kJHN0YWNraW5nU3RpY2tpZXM7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIFN0dWNrTWFuYWdlckltcGwucHJvdG90eXBlLmFkZFN0aWNraWVzID0gZnVuY3Rpb24gKHN0YWNraW5nKSB7XG4gICAgICAgIHZhciBzdGlja2llcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDE7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgc3RpY2tpZXNbX2kgLSAxXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy4kJHN0aWNraWVzID0gdGhpcy4kJHN0aWNraWVzLmNvbmNhdChzdGlja2llcyk7XG4gICAgICAgIGlmIChzdGFja2luZykge1xuICAgICAgICAgICAgdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMgPSB0aGlzLiQkc3RhY2tpbmdTdGlja2llcy5jb25jYXQoc3RpY2tpZXMpO1xuICAgICAgICB9XG4gICAgICAgIHN0aWNreU1hbmFnZXJfMS5nZXRTdGlja3lNYW5hZ2VySW5zdGFuY2UodGhpcy4kJHdpbmRvdykuYWN0aXZhdGUoKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZS5kZXN0cm95U3RpY2tpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGlja2llcyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgc3RpY2tpZXNbX2ldID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBzdGlja2llcy5mb3JFYWNoKGZ1bmN0aW9uIChpbnN0YW5jZSkgeyByZXR1cm4gaW5zdGFuY2UuZGVzdHJveSgpOyB9KTtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzID0gdGhpcy4kJHN0aWNraWVzLmZpbHRlcihmdW5jdGlvbiAoc3RpY2t5KSB7IHJldHVybiAhc3RpY2tpZXMuaW5jbHVkZXMoc3RpY2t5KTsgfSk7XG4gICAgICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMuZmlsdGVyKGZ1bmN0aW9uIChzdGlja3kpIHsgcmV0dXJuICFzdGlja2llcy5pbmNsdWRlcyhzdGlja3kpOyB9KTtcbiAgICAgICAgaWYgKHRoaXMuJCRzdGFja2luZ1N0aWNraWVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBTdHVja01hbmFnZXJJbXBsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gdGhpcy5zdGFja2luZ1N0aWNraWVzXG4gICAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uIChpbnN0YW5jZSwgaW5kZXgsIGFsbCkgeyByZXR1cm4gYWxsLmluZGV4T2YoaW5zdGFuY2UpID09PSBpbmRleDsgfSlcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGluc3RhbmNlKSB7IHJldHVybiAoe1xuICAgICAgICAgICAgaW5zdGFuY2U6IGluc3RhbmNlLFxuICAgICAgICAgICAgcmVjdDogaW5zdGFuY2UucGxhY2Vob2xkZXIudXBkYXRlUmVjdCgpLFxuICAgICAgICB9KTsgfSlcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChfYSwgX2IpIHtcbiAgICAgICAgICAgIHZhciBiZWZvcmUgPSBfYS5yZWN0O1xuICAgICAgICAgICAgdmFyIGFmdGVyID0gX2IucmVjdDtcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmUudG9wIC0gYWZ0ZXIudG9wO1xuICAgICAgICB9KVxuICAgICAgICAgICAgLnJlZHVjZShmdW5jdGlvbiAoX2EsIF9iKSB7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2VzID0gX2EuaW5zdGFuY2VzLCBjZWlsaW5nID0gX2EuY2VpbGluZztcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IF9iLmluc3RhbmNlO1xuICAgICAgICAgICAgaW5zdGFuY2UubWFyZ2luVG9wID0gaW5zdGFuY2Uub3B0aW9ucy5tYXJnaW5Ub3AgKyBjZWlsaW5nO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBpbnN0YW5jZXM6IGluc3RhbmNlcy5jb25jYXQoW2luc3RhbmNlXSksXG4gICAgICAgICAgICAgICAgY2VpbGluZzogaW5zdGFuY2UucmVjdC5oZWlnaHQgKyBpbnN0YW5jZS5tYXJnaW5Ub3AsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9LCB7IGluc3RhbmNlczogW10sIGNlaWxpbmc6IDAgfSkuaW5zdGFuY2VzO1xuICAgICAgICBzdGlja3lNYW5hZ2VyXzEuZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHRoaXMuJCR3aW5kb3cpLmJ1bGtVcGRhdGUoKTtcbiAgICAgICAgdGhpcy4kJHN0aWNraWVzID0gdXRpbGl0eV8xLnN0YWJsZVNvcnQodGhpcy5zdGlja2llcywgZnVuY3Rpb24gKGJlZm9yZSwgYWZ0ZXIpIHtcbiAgICAgICAgICAgIHJldHVybiBiZWZvcmUucGxhY2Vob2xkZXIuY2FjaGVkUmVjdC50b3AgLSBhZnRlci5wbGFjZWhvbGRlci5jYWNoZWRSZWN0LnRvcDtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcmV0dXJuIFN0dWNrTWFuYWdlckltcGw7XG59KCkpO1xuZXhwb3J0cy5nZXRTdHVja01hbmFnZXJJbnN0YW5jZSA9IGZ1bmN0aW9uIChfd2luZG93KSB7XG4gICAgcmV0dXJuIFN0dWNrTWFuYWdlckltcGwuZ2V0SW5zdGFuY2UoX3dpbmRvdyk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLm5vb3AgPSBmdW5jdGlvbiAoKSB7IH07XG5leHBvcnRzLnN0YWJsZVNvcnQgPSBmdW5jdGlvbiAoYXJyYXksIGNvbXBhcmVGdW5jdGlvbikge1xuICAgIHJldHVybiBhcnJheVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChpdGVtLCBpbmRleCkgeyByZXR1cm4gKHsgaXRlbTogaXRlbSwgaW5kZXg6IGluZGV4IH0pOyB9KVxuICAgICAgICAuc29ydChmdW5jdGlvbiAoYmVmb3JlLCBhZnRlcikge1xuICAgICAgICB2YXIgcmVzdWx0ID0gY29tcGFyZUZ1bmN0aW9uKGJlZm9yZS5pdGVtLCBhZnRlci5pdGVtKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCAhPT0gMCA/IHJlc3VsdCA6IGJlZm9yZS5pbmRleCAtIGFmdGVyLmluZGV4O1xuICAgIH0pXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgIHZhciBpdGVtID0gX2EuaXRlbTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfSk7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==