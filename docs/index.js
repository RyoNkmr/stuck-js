(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.StuckJs = {}));
})(this, function(exports) {
	Object.defineProperties(exports, {
		__esModule: { value: true },
		[Symbol.toStringTag]: { value: "Module" }
	});
	//#region src/utility.ts
	var noop = () => {};
	var stableSort = (array, compareFunction) => array.map((item, index) => ({
		item,
		index
	})).sort((before, after) => {
		const result = compareFunction(before.item, after.item);
		return result !== 0 ? result : before.index - after.index;
	}).map(({ item }) => item);
	//#endregion
	//#region src/placeholder.ts
	var Placeholder = class Placeholder {
		get shouldPlacehold() {
			return !this.initiallyHidden && this.$$shouldPlacehold;
		}
		set shouldPlacehold(value) {
			if (this.shouldPlacehold === value) return;
			this.$$shouldPlacehold = value;
			this.update(true);
		}
		constructor(element, observe = true, onUpdate = noop) {
			this.$$shouldPlacehold = true;
			this.original = element;
			this.onUpdate = typeof onUpdate === "function" ? onUpdate : noop;
			this.initialComputedStyles = window.getComputedStyle(this.original);
			this.initiallyHidden = this.initialComputedStyles.display === "none";
			if (this.initiallyHidden) this.execWhileStucking(() => {
				this.initialComputedStyles = window.getComputedStyle(this.original);
			});
			this.element = Placeholder.createPlaceholderElement();
			this.applyInitialStyles();
			Placeholder.wrap(this.original, this.element);
			this.cachedRect = this.updateRect();
			if (observe) this.observer = Placeholder.createObserver(this.original, () => this.update());
		}
		update(forceUpdate = false) {
			if (this.shouldPlacehold) this.applyStyles(forceUpdate);
			else this.removeStyles();
			this.onUpdate();
		}
		updateRect() {
			this.cachedRect = this.element.getBoundingClientRect();
			if (this.initiallyHidden) this.execWhileStucking(() => {
				this.cachedRect = this.element.getBoundingClientRect();
			});
			return this.cachedRect;
		}
		destroy() {
			if (this.observer) {
				this.observer.disconnect();
				delete this.observer;
			}
			Placeholder.unwrap(this.original);
		}
		execWhileStucking(execute) {
			const state = this.original.dataset.stuck;
			this.original.dataset.stuck = "true";
			execute();
			this.original.dataset.stuck = state;
		}
		applyInitialStyles() {
			if (!this.initialComputedStyles || this.initiallyHidden) return;
			this.element.style.margin = this.initialComputedStyles.margin;
			this.element.style.minWidth = this.initialComputedStyles.minWidth;
			this.element.style.minHeight = this.initialComputedStyles.minHeight;
			this.element.style.width = this.initialComputedStyles.width;
			this.element.style.height = this.initialComputedStyles.height;
		}
		applyStyles(forceUpdate = false) {
			if (!this.original || !this.element) return;
			const { width: originalWidth, height: originalHeight } = this.original.getBoundingClientRect();
			const widthChanged = originalWidth !== this.cachedRect.width;
			const heightChanged = originalHeight !== this.cachedRect.height;
			if (!forceUpdate && !widthChanged && !heightChanged) return;
			if (forceUpdate || widthChanged) this.element.style.width = `${originalWidth}px`;
			if (forceUpdate || heightChanged) this.element.style.height = `${originalHeight}px`;
			this.updateRect();
		}
		removeStyles() {
			if (!this.original || !this.element) return;
			this.element.style.width = "";
			this.element.style.height = "";
		}
		static createObserver(targetNode, callback) {
			if (!targetNode) throw new TypeError(`[Stuck.js] Could not create mutation observer on targetNode ${String(targetNode)}. This should be HTMLElement`);
			const detectSizeMutation = ({ type }) => type === "childList" || type === "attributes";
			const observer = new MutationObserver((mutations) => {
				if (mutations.some(detectSizeMutation)) callback();
			});
			observer.observe(targetNode, {
				attributes: true,
				attributeFilter: ["style", "class"],
				childList: true,
				subtree: true
			});
			return observer;
		}
		static unwrap(target) {
			const wrapper = target.parentNode;
			if (wrapper instanceof HTMLElement) {
				wrapper.insertAdjacentElement("beforebegin", target);
				const parent = wrapper.parentNode;
				if (parent instanceof HTMLElement) parent.removeChild(wrapper);
			}
			return target;
		}
		static wrap(target, wrapper) {
			if (target.parentNode !== wrapper) {
				target.insertAdjacentElement("beforebegin", wrapper);
				wrapper.appendChild(target);
			}
			return wrapper;
		}
		static createPlaceholderElement(tagName = "div") {
			return document.createElement(tagName);
		}
	};
	//#endregion
	//#region src/stickyManager.ts
	var StickyManagerImpl = class StickyManagerImpl {
		constructor(_window) {
			this.$$stickies = [];
			this.$$activated = false;
			this.$$bulkUpdateRequestId = null;
			this.$$window = _window;
			this.bulkUpdate = this.bulkUpdate.bind(this);
			this.bulkPlaceholderUpdate = this.bulkPlaceholderUpdate.bind(this);
		}
		static getInstance(_window) {
			if (!StickyManagerImpl.$$instance) StickyManagerImpl.$$instance = new StickyManagerImpl(_window);
			return StickyManagerImpl.$$instance;
		}
		register(sticky) {
			this.$$stickies = [...this.$$stickies, sticky];
			return this;
		}
		unregister(sticky) {
			this.$$stickies = this.$$stickies.filter((instance) => instance !== sticky);
			if (this.$$stickies.length < 1) this.deactivate();
			return this;
		}
		bulkUpdate() {
			if (this.$$bulkUpdateRequestId) this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId);
			this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(() => {
				for (const instance of this.$$stickies) instance.update();
			});
			return this;
		}
		destroyAll() {
			for (const instance of this.$$stickies) instance.destroy();
			this.$$stickies = [];
			this.deactivate();
			return this;
		}
		activate() {
			if (!this.$$activated && this.$$stickies.length > 0) {
				this.$$window.addEventListener("scroll", this.bulkUpdate);
				this.$$window.addEventListener("resize", this.bulkPlaceholderUpdate);
				this.$$activated = true;
			}
			this.bulkUpdate();
			return this;
		}
		deactivate() {
			if (this.$$activated) {
				this.$$window.removeEventListener("scroll", this.bulkUpdate);
				this.$$window.removeEventListener("resize", this.bulkPlaceholderUpdate);
				this.$$activated = false;
			}
			return this;
		}
		bulkPlaceholderUpdate() {
			if (this.$$bulkUpdateRequestId) this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId);
			this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(() => {
				this.$$stickies.forEach((instance) => {
					instance.placeholder.update();
					instance.update();
				});
			});
		}
	};
	var getStickyManagerInstance = (_window) => StickyManagerImpl.getInstance(_window);
	//#endregion
	//#region src/stickyImpl.ts
	var normalizeElement = (value, ...fallbacks) => {
		if (value && value instanceof HTMLElement) return value;
		const element = [value && document.querySelector(value), ...fallbacks].find((item) => !!item && item instanceof HTMLElement);
		if (element instanceof HTMLElement) return element;
		throw new TypeError("[Stuck-js] Could not find HTMLElement");
	};
	var computeAbsoluteFloor = (target) => {
		const absoluteBottom = target.getBoundingClientRect().bottom + window.pageYOffset;
		const { paddingBottom } = window.getComputedStyle(target);
		return absoluteBottom - (paddingBottom !== null ? parseInt(paddingBottom, 10) : 0);
	};
	var StickyImpl = class {
		get isSticky() {
			return this.element !== null && this.element.style.position === "fixed";
		}
		set isSticky(value) {
			if (this.placeholder) this.placeholder.shouldPlacehold = value;
			this.element.dataset.stuck = value ? value.toString() : "";
			this.element.style.position = value ? "fixed" : "";
			this.element.style.top = value ? `${this.top}px` : "";
			this.element.style.left = value ? `${this.placeholder.updateRect().left}px` : "";
			if (value) this.computePositionTopFromRect();
		}
		get top() {
			return this.$$additionalTop || this.$$additionalTop === 0 ? this.$$additionalTop : this.marginTop;
		}
		set top(value) {
			this.$$additionalTop = value;
			this.element.style.top = value ? `${value}px` : `${this.marginTop}px`;
		}
		get wrapper() {
			return this.$$wrapper;
		}
		constructor(element, options = { observe: true }, activate = true, onUpdate = noop) {
			this.marginTop = 0;
			this.isStickToBottom = false;
			if (!element) throw new Error("[Stuck-js] Invalid element given");
			this.$$manager = getStickyManagerInstance(window).register(this);
			this.element = element;
			this.rect = this.element.getBoundingClientRect();
			this.options = {
				marginTop: 0,
				...options
			};
			this.marginTop = this.options.marginTop || 0;
			this.setWrapperFromSelectorOrElement(this.options.wrapper);
			this.placeholder = new Placeholder(this.element, this.options.observe || true, onUpdate || this.$$manager.bulkUpdate);
			this.element.dataset.stuck = "";
			if (activate) this.$$manager.activate();
			this.placeholder.shouldPlacehold = this.isSticky;
		}
		setWrapperFromSelectorOrElement(selectorOrElement) {
			var _this$placeholder;
			if (!(document.body instanceof HTMLElement)) throw new TypeError("[Stuck.js] document.body is not HTMLElement in this environment");
			const parent = (((_this$placeholder = this.placeholder) === null || _this$placeholder === void 0 ? void 0 : _this$placeholder.element) || this.element).parentElement;
			this.$$wrapper = normalizeElement(selectorOrElement, parent, document.body);
			this.floor = computeAbsoluteFloor(this.$$wrapper);
			this.options.wrapper = this.$$wrapper;
		}
		destroy() {
			this.isSticky = false;
			this.placeholder.destroy();
			this.$$manager.unregister(this);
		}
		computePositionTopFromRect(rect = this.element.getBoundingClientRect()) {
			this.rect = rect;
			this.floor = computeAbsoluteFloor(this.wrapper);
			const relativeFloor = (this.floor || 0) - window.pageYOffset;
			if (this.rect.bottom >= relativeFloor && !this.isStickToBottom) {
				this.top = relativeFloor - this.rect.height;
				this.isStickToBottom = true;
				return;
			}
			if (!this.isStickToBottom) return;
			if (this.rect.top >= this.marginTop) {
				this.top = this.marginTop;
				this.isStickToBottom = false;
				return;
			}
			if (this.rect.top < this.marginTop) this.top = relativeFloor - this.rect.height;
		}
		update() {
			const placeholderRect = this.placeholder.element.getBoundingClientRect();
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
				if (this.rect.left !== placeholderRect.left) this.element.style.left = `${placeholderRect.left}px`;
				this.computePositionTopFromRect(this.rect);
			}
		}
	};
	//#endregion
	//#region src/stuckManager.ts
	var StuckManagerImpl = class StuckManagerImpl {
		constructor(_window) {
			this.$$stucks = [];
			this.$$stickies = [];
			this.$$stackingStickies = [];
			this.$$window = _window;
		}
		static getInstance(_window) {
			if (!StuckManagerImpl.$$instance) StuckManagerImpl.$$instance = new StuckManagerImpl(_window);
			return StuckManagerImpl.$$instance;
		}
		register(stuck) {
			this.$$stucks = [...this.$$stucks, stuck];
			return this;
		}
		unregister(stuck) {
			this.destroyStickies(...stuck.stickies);
			this.$$stucks = this.$$stucks.filter((instance) => instance !== stuck);
			return this;
		}
		get stickies() {
			return this.$$stickies;
		}
		get stickyElements() {
			return this.$$stickies.map((sticky) => sticky.element);
		}
		get stackingStickies() {
			return this.$$stackingStickies;
		}
		addStickies(stacking, ...stickies) {
			this.$$stickies = [...this.$$stickies, ...stickies];
			if (stacking) this.$$stackingStickies = [...this.$$stackingStickies, ...stickies];
			getStickyManagerInstance(this.$$window).activate();
			return this;
		}
		destroyStickies(...stickies) {
			for (const instance of stickies) instance.destroy();
			this.$$stickies = this.$$stickies.filter((sticky) => !stickies.includes(sticky));
			this.$$stackingStickies = this.$$stackingStickies.filter((sticky) => !stickies.includes(sticky));
			if (this.$$stackingStickies.length > 0) this.update();
			return this;
		}
		update() {
			this.$$stackingStickies = this.stackingStickies.filter((instance, index, all) => all.indexOf(instance) === index).map((instance) => ({
				instance,
				rect: instance.placeholder.updateRect()
			})).sort(({ rect: before }, { rect: after }) => before.top - after.top).reduce(({ instances, ceiling }, { instance }) => {
				instance.marginTop = instance.options.marginTop + ceiling;
				return {
					instances: [...instances, instance],
					ceiling: instance.rect.height + instance.marginTop
				};
			}, {
				instances: [],
				ceiling: 0
			}).instances;
			getStickyManagerInstance(this.$$window).bulkUpdate();
			this.$$stickies = stableSort(this.stickies, (before, after) => before.placeholder.cachedRect.top - after.placeholder.cachedRect.top);
			return this;
		}
	};
	var getStuckManagerInstance = (_window) => StuckManagerImpl.getInstance(_window);
	//#endregion
	//#region src/stuckImpl.ts
	var getElementsArrayFromSetting = (option) => {
		if (option.element) {
			const { element } = option;
			if (element instanceof HTMLElement) return [element];
			if (Array.isArray(element) || typeof element === "object") return Array.from(element);
		}
		if (option.selector) return Array.from(document.querySelectorAll(option.selector)).filter((maybeHTMLElement) => maybeHTMLElement instanceof HTMLElement);
		throw new Error("[Stuck.js] No selector, element nor elements in setting");
	};
	var StuckImpl = class {
		constructor(settings = [], defaultOptions = { observe: true }, sharedStacking = true) {
			this.$$instances = [];
			this.$$manager = getStuckManagerInstance(window).register(this);
			this.$$defaultOptions = defaultOptions;
			this.create(settings, sharedStacking);
		}
		create(source, sharedStacking = true) {
			const registered = (Array.isArray(source) ? source : [source]).reduce((accumulator, setting) => accumulator.concat(this.register(setting, sharedStacking)), []);
			if (registered.length === 0) return [];
			this.$$manager.update();
			return registered;
		}
		register({ selector, element, ...options }, sharedStacking = true) {
			const registeredInstanceElements = this.$$manager.stickyElements;
			const stickies = getElementsArrayFromSetting({
				selector,
				element
			}).filter((target) => !registeredInstanceElements.includes(target)).map((newElement) => new StickyImpl(newElement, {
				...this.$$defaultOptions,
				...options
			}, false, () => {
				this.$$manager.update();
			}));
			this.$$manager.addStickies(sharedStacking, ...stickies);
			this.$$instances = [...this.$$instances, ...stickies];
			return stickies;
		}
		get stickies() {
			return this.$$instances;
		}
		destroy() {
			this.$$manager.unregister(this);
			this.$$instances = [];
		}
	};
	//#endregion
	//#region src/index.ts
	var src_default = StuckImpl;
	//#endregion
	exports.Placeholder = Placeholder;
	exports.Sticky = StickyImpl;
	exports.Stuck = StuckImpl;
	exports.default = src_default;
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxpdHkudHMiLCIuLi9zcmMvcGxhY2Vob2xkZXIudHMiLCIuLi9zcmMvc3RpY2t5TWFuYWdlci50cyIsIi4uL3NyYy9zdGlja3lJbXBsLnRzIiwiLi4vc3JjL3N0dWNrTWFuYWdlci50cyIsIi4uL3NyYy9zdHVja0ltcGwudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG5vb3AgPSAoKTogdm9pZCA9PiB7fVxuXG5leHBvcnQgY29uc3Qgc3RhYmxlU29ydCA9IDxUPihcbiAgYXJyYXk6IHJlYWRvbmx5IFRbXSxcbiAgY29tcGFyZUZ1bmN0aW9uOiAob25lOiBULCB0aGVPdGhlcjogVCkgPT4gbnVtYmVyXG4pOiBUW10gPT5cbiAgYXJyYXlcbiAgICAubWFwKChpdGVtLCBpbmRleCk6IHsgaXRlbTogVDsgaW5kZXg6IG51bWJlciB9ID0+ICh7IGl0ZW0sIGluZGV4IH0pKVxuICAgIC5zb3J0KChiZWZvcmUsIGFmdGVyKTogbnVtYmVyID0+IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNvbXBhcmVGdW5jdGlvbihiZWZvcmUuaXRlbSwgYWZ0ZXIuaXRlbSlcbiAgICAgIHJldHVybiByZXN1bHQgIT09IDAgPyByZXN1bHQgOiBiZWZvcmUuaW5kZXggLSBhZnRlci5pbmRleFxuICAgIH0pXG4gICAgLm1hcCgoeyBpdGVtIH0pOiBUID0+IGl0ZW0pXG4iLCJpbXBvcnQgeyBub29wIH0gZnJvbSAnLi91dGlsaXR5J1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQbGFjZWhvbGRlciB7XG4gIHB1YmxpYyBvcmlnaW5hbDogSFRNTEVsZW1lbnRcbiAgcHVibGljIGVsZW1lbnQ6IEhUTUxFbGVtZW50XG4gIHB1YmxpYyBjYWNoZWRSZWN0OiBDbGllbnRSZWN0XG4gIHB1YmxpYyBvYnNlcnZlcj86IE11dGF0aW9uT2JzZXJ2ZXJcbiAgcHVibGljIG9uVXBkYXRlOiAoKSA9PiB2b2lkXG4gIHB1YmxpYyBpbml0aWFsQ29tcHV0ZWRTdHlsZXM6IENTU1N0eWxlRGVjbGFyYXRpb25cbiAgcHVibGljIGluaXRpYWxseUhpZGRlbjogYm9vbGVhblxuICBwcml2YXRlICQkc2hvdWxkUGxhY2Vob2xkOiBib29sZWFuID0gdHJ1ZVxuXG4gIHB1YmxpYyBnZXQgc2hvdWxkUGxhY2Vob2xkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5pbml0aWFsbHlIaWRkZW4gJiYgdGhpcy4kJHNob3VsZFBsYWNlaG9sZFxuICB9XG5cbiAgcHVibGljIHNldCBzaG91bGRQbGFjZWhvbGQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5zaG91bGRQbGFjZWhvbGQgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLiQkc2hvdWxkUGxhY2Vob2xkID0gdmFsdWVcbiAgICB0aGlzLnVwZGF0ZSh0cnVlKVxuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIG9ic2VydmU6IGJvb2xlYW4gPSB0cnVlLFxuICAgIG9uVXBkYXRlOiAoKSA9PiB2b2lkID0gbm9vcFxuICApIHtcbiAgICB0aGlzLm9yaWdpbmFsID0gZWxlbWVudFxuICAgIHRoaXMub25VcGRhdGUgPSB0eXBlb2Ygb25VcGRhdGUgPT09ICdmdW5jdGlvbicgPyBvblVwZGF0ZSA6IG5vb3BcblxuICAgIHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5vcmlnaW5hbClcbiAgICB0aGlzLmluaXRpYWxseUhpZGRlbiA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLmRpc3BsYXkgPT09ICdub25lJ1xuXG4gICAgaWYgKHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICB0aGlzLmV4ZWNXaGlsZVN0dWNraW5nKCgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm9yaWdpbmFsKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBQbGFjZWhvbGRlci5jcmVhdGVQbGFjZWhvbGRlckVsZW1lbnQoKVxuICAgIHRoaXMuYXBwbHlJbml0aWFsU3R5bGVzKClcbiAgICBQbGFjZWhvbGRlci53cmFwKHRoaXMub3JpZ2luYWwsIHRoaXMuZWxlbWVudClcbiAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLnVwZGF0ZVJlY3QoKVxuXG4gICAgaWYgKG9ic2VydmUpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBQbGFjZWhvbGRlci5jcmVhdGVPYnNlcnZlcih0aGlzLm9yaWdpbmFsLCAoKTogdm9pZCA9PlxuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZShmb3JjZVVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2hvdWxkUGxhY2Vob2xkKSB7XG4gICAgICB0aGlzLmFwcGx5U3R5bGVzKGZvcmNlVXBkYXRlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbW92ZVN0eWxlcygpXG4gICAgfVxuICAgIHRoaXMub25VcGRhdGUoKVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZVJlY3QoKTogQ2xpZW50UmVjdCB7XG4gICAgdGhpcy5jYWNoZWRSZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgaWYgKHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICB0aGlzLmV4ZWNXaGlsZVN0dWNraW5nKCgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5jYWNoZWRSZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICB9KVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jYWNoZWRSZWN0XG4gIH1cblxuICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KClcbiAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyXG4gICAgfVxuICAgIFBsYWNlaG9sZGVyLnVud3JhcCh0aGlzLm9yaWdpbmFsKVxuICB9XG5cbiAgcHJpdmF0ZSBleGVjV2hpbGVTdHVja2luZyhleGVjdXRlOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2tcbiAgICB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2sgPSAndHJ1ZSdcbiAgICBleGVjdXRlKClcbiAgICB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2sgPSBzdGF0ZVxuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUluaXRpYWxTdHlsZXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyB8fCB0aGlzLmluaXRpYWxseUhpZGRlbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5tYXJnaW4gPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5tYXJnaW5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUubWluV2lkdGggPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5taW5XaWR0aFxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5taW5IZWlnaHRcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy53aWR0aFxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5oZWlnaHRcbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlTdHlsZXMoZm9yY2VVcGRhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGlmICghdGhpcy5vcmlnaW5hbCB8fCAhdGhpcy5lbGVtZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCB7IHdpZHRoOiBvcmlnaW5hbFdpZHRoLCBoZWlnaHQ6IG9yaWdpbmFsSGVpZ2h0IH0gPVxuICAgICAgdGhpcy5vcmlnaW5hbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGNvbnN0IHdpZHRoQ2hhbmdlZCA9IG9yaWdpbmFsV2lkdGggIT09IHRoaXMuY2FjaGVkUmVjdC53aWR0aFxuICAgIGNvbnN0IGhlaWdodENoYW5nZWQgPSBvcmlnaW5hbEhlaWdodCAhPT0gdGhpcy5jYWNoZWRSZWN0LmhlaWdodFxuXG4gICAgaWYgKCFmb3JjZVVwZGF0ZSAmJiAhd2lkdGhDaGFuZ2VkICYmICFoZWlnaHRDaGFuZ2VkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoZm9yY2VVcGRhdGUgfHwgd2lkdGhDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSBgJHtvcmlnaW5hbFdpZHRofXB4YFxuICAgIH1cblxuICAgIGlmIChmb3JjZVVwZGF0ZSB8fCBoZWlnaHRDaGFuZ2VkKSB7XG4gICAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gYCR7b3JpZ2luYWxIZWlnaHR9cHhgXG4gICAgfVxuXG4gICAgdGhpcy51cGRhdGVSZWN0KClcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlU3R5bGVzKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5vcmlnaW5hbCB8fCAhdGhpcy5lbGVtZW50KSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gJydcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJydcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGNyZWF0ZU9ic2VydmVyKFxuICAgIHRhcmdldE5vZGU6IEhUTUxFbGVtZW50LFxuICAgIGNhbGxiYWNrOiAoKSA9PiB2b2lkXG4gICk6IE11dGF0aW9uT2JzZXJ2ZXIge1xuICAgIGlmICghdGFyZ2V0Tm9kZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgYFtTdHVjay5qc10gQ291bGQgbm90IGNyZWF0ZSBtdXRhdGlvbiBvYnNlcnZlciBvbiB0YXJnZXROb2RlICR7U3RyaW5nKFxuICAgICAgICAgIHRhcmdldE5vZGVcbiAgICAgICAgKX0uIFRoaXMgc2hvdWxkIGJlIEhUTUxFbGVtZW50YFxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IGRldGVjdFNpemVNdXRhdGlvbiA9ICh7IHR5cGUgfTogTXV0YXRpb25SZWNvcmQpOiBib29sZWFuID0+XG4gICAgICB0eXBlID09PSAnY2hpbGRMaXN0JyB8fCB0eXBlID09PSAnYXR0cmlidXRlcydcblxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoXG4gICAgICAobXV0YXRpb25zOiByZWFkb25seSBNdXRhdGlvblJlY29yZFtdKTogdm9pZCA9PiB7XG4gICAgICAgIGNvbnN0IGlzTXV0YXRlZCA9IG11dGF0aW9ucy5zb21lKGRldGVjdFNpemVNdXRhdGlvbilcbiAgICAgICAgaWYgKGlzTXV0YXRlZCkge1xuICAgICAgICAgIGNhbGxiYWNrKClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIClcblxuICAgIG9ic2VydmVyLm9ic2VydmUodGFyZ2V0Tm9kZSwge1xuICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgIGF0dHJpYnV0ZUZpbHRlcjogWydzdHlsZScsICdjbGFzcyddLFxuICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgc3VidHJlZTogdHJ1ZSxcbiAgICB9KVxuICAgIHJldHVybiBvYnNlcnZlclxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgdW53cmFwKHRhcmdldDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qgd3JhcHBlciA9IHRhcmdldC5wYXJlbnROb2RlXG5cbiAgICBpZiAod3JhcHBlciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICB3cmFwcGVyLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCB0YXJnZXQpXG4gICAgICBjb25zdCBwYXJlbnQgPSB3cmFwcGVyLnBhcmVudE5vZGVcblxuICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZCh3cmFwcGVyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB3cmFwKHRhcmdldDogSFRNTEVsZW1lbnQsIHdyYXBwZXI6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIGlmICh0YXJnZXQucGFyZW50Tm9kZSAhPT0gd3JhcHBlcikge1xuICAgICAgdGFyZ2V0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCB3cmFwcGVyKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0YXJnZXQpXG4gICAgfVxuICAgIHJldHVybiB3cmFwcGVyXG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjcmVhdGVQbGFjZWhvbGRlckVsZW1lbnQodGFnTmFtZSA9ICdkaXYnKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpXG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgU3RpY2t5IH0gZnJvbSAnLi9zdGlja3knXG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RpY2t5TWFuYWdlciB7XG4gIHJlZ2lzdGVyKHN0aWNreTogU3RpY2t5KTogU3RpY2t5TWFuYWdlclxuICB1bnJlZ2lzdGVyKHN0aWNreTogU3RpY2t5KTogU3RpY2t5TWFuYWdlclxuICBidWxrVXBkYXRlKCk6IFN0aWNreU1hbmFnZXJcbiAgZGVzdHJveUFsbCgpOiBTdGlja3lNYW5hZ2VyXG4gIGFjdGl2YXRlKCk6IFN0aWNreU1hbmFnZXJcbiAgZGVhY3RpdmF0ZSgpOiBTdGlja3lNYW5hZ2VyXG59XG5cbmNsYXNzIFN0aWNreU1hbmFnZXJJbXBsIGltcGxlbWVudHMgU3RpY2t5TWFuYWdlciB7XG4gIHByaXZhdGUgc3RhdGljICQkaW5zdGFuY2U6IFN0aWNreU1hbmFnZXJcbiAgcHJpdmF0ZSAkJHN0aWNraWVzOiBTdGlja3lbXSA9IFtdXG4gIHByaXZhdGUgJCRhY3RpdmF0ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwcml2YXRlICQkYnVsa1VwZGF0ZVJlcXVlc3RJZDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgcHJpdmF0ZSByZWFkb25seSAkJHdpbmRvdzogV2luZG93XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihfd2luZG93OiBXaW5kb3cpIHtcbiAgICB0aGlzLiQkd2luZG93ID0gX3dpbmRvd1xuICAgIHRoaXMuYnVsa1VwZGF0ZSA9IHRoaXMuYnVsa1VwZGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUgPSB0aGlzLmJ1bGtQbGFjZWhvbGRlclVwZGF0ZS5iaW5kKHRoaXMpXG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKF93aW5kb3c6IFdpbmRvdyk6IFN0aWNreU1hbmFnZXIge1xuICAgIGlmICghU3RpY2t5TWFuYWdlckltcGwuJCRpbnN0YW5jZSkge1xuICAgICAgU3RpY2t5TWFuYWdlckltcGwuJCRpbnN0YW5jZSA9IG5ldyBTdGlja3lNYW5hZ2VySW1wbChfd2luZG93KVxuICAgIH1cbiAgICByZXR1cm4gU3RpY2t5TWFuYWdlckltcGwuJCRpbnN0YW5jZVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyKHN0aWNreTogU3RpY2t5KTogU3RpY2t5TWFuYWdlciB7XG4gICAgdGhpcy4kJHN0aWNraWVzID0gWy4uLnRoaXMuJCRzdGlja2llcywgc3RpY2t5XVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgdW5yZWdpc3RlcihzdGlja3k6IFN0aWNreSk6IFN0aWNreU1hbmFnZXIge1xuICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5maWx0ZXIoXG4gICAgICAoaW5zdGFuY2UpOiBib29sZWFuID0+IGluc3RhbmNlICE9PSBzdGlja3lcbiAgICApXG4gICAgaWYgKHRoaXMuJCRzdGlja2llcy5sZW5ndGggPCAxKSB7XG4gICAgICB0aGlzLmRlYWN0aXZhdGUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIGJ1bGtVcGRhdGUoKTogU3RpY2t5TWFuYWdlciB7XG4gICAgaWYgKHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkKSB7XG4gICAgICB0aGlzLiQkd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkKVxuICAgIH1cbiAgICB0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCA9IHRoaXMuJCR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKFxuICAgICAgKCk6IHZvaWQgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIHRoaXMuJCRzdGlja2llcykge1xuICAgICAgICAgIGluc3RhbmNlLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95QWxsKCk6IFN0aWNreU1hbmFnZXIge1xuICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2YgdGhpcy4kJHN0aWNraWVzKSB7XG4gICAgICBpbnN0YW5jZS5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy4kJHN0aWNraWVzID0gW11cbiAgICB0aGlzLmRlYWN0aXZhdGUoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgYWN0aXZhdGUoKTogU3RpY2t5TWFuYWdlciB7XG4gICAgaWYgKCF0aGlzLiQkYWN0aXZhdGVkICYmIHRoaXMuJCRzdGlja2llcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLiQkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuYnVsa1VwZGF0ZSlcbiAgICAgIHRoaXMuJCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUpXG4gICAgICB0aGlzLiQkYWN0aXZhdGVkID0gdHJ1ZVxuICAgIH1cbiAgICB0aGlzLmJ1bGtVcGRhdGUoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiBTdGlja3lNYW5hZ2VyIHtcbiAgICBpZiAodGhpcy4kJGFjdGl2YXRlZCkge1xuICAgICAgdGhpcy4kJHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmJ1bGtVcGRhdGUpXG4gICAgICB0aGlzLiQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlKVxuICAgICAgdGhpcy4kJGFjdGl2YXRlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwcml2YXRlIGJ1bGtQbGFjZWhvbGRlclVwZGF0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpIHtcbiAgICAgIHRoaXMuJCR3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQpXG4gICAgfVxuICAgIHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkID0gdGhpcy4kJHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoXG4gICAgICAoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuJCRzdGlja2llcy5mb3JFYWNoKChpbnN0YW5jZSk6IHZvaWQgPT4ge1xuICAgICAgICAgIGluc3RhbmNlLnBsYWNlaG9sZGVyLnVwZGF0ZSgpXG4gICAgICAgICAgaW5zdGFuY2UudXBkYXRlKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSA9IChfd2luZG93OiBXaW5kb3cpOiBTdGlja3lNYW5hZ2VyID0+XG4gIFN0aWNreU1hbmFnZXJJbXBsLmdldEluc3RhbmNlKF93aW5kb3cpXG4iLCJpbXBvcnQgUGxhY2Vob2xkZXIgZnJvbSAnLi9wbGFjZWhvbGRlcidcbmltcG9ydCB0eXBlIHtcbiAgUGFydGlhbFJlcXVpcmVkLFxuICBTZWxlY3Rvck9yRWxlbWVudCxcbiAgU3RpY2t5LFxuICBTdGlja3lPcHRpb25zLFxufSBmcm9tICcuL3N0aWNreSdcbmltcG9ydCB7IGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSwgdHlwZSBTdGlja3lNYW5hZ2VyIH0gZnJvbSAnLi9zdGlja3lNYW5hZ2VyJ1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbGl0eSdcblxudHlwZSBNYXliZUhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQgfCBFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZFxuXG5jb25zdCBub3JtYWxpemVFbGVtZW50ID0gKFxuICB2YWx1ZT86IFNlbGVjdG9yT3JFbGVtZW50LFxuICAuLi5mYWxsYmFja3M6IE1heWJlSFRNTEVsZW1lbnRbXVxuKTogSFRNTEVsZW1lbnQgPT4ge1xuICBpZiAodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgY29uc3QgZWxlbWVudCA9IFt2YWx1ZSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHZhbHVlKSwgLi4uZmFsbGJhY2tzXS5maW5kKFxuICAgIChpdGVtKTogaXRlbSBpcyBIVE1MRWxlbWVudCA9PiAhIWl0ZW0gJiYgaXRlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIClcblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1tTdHVjay1qc10gQ291bGQgbm90IGZpbmQgSFRNTEVsZW1lbnQnKVxufVxuXG5jb25zdCBjb21wdXRlQWJzb2x1dGVGbG9vciA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogbnVtYmVyID0+IHtcbiAgY29uc3QgYWJzb2x1dGVCb3R0b20gPVxuICAgIHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gKyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgY29uc3QgeyBwYWRkaW5nQm90dG9tIH0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpXG4gIGNvbnN0IHBhZGRpbmdCb3R0b21QaXhlbHMgPVxuICAgIHBhZGRpbmdCb3R0b20gIT09IG51bGwgPyBwYXJzZUludChwYWRkaW5nQm90dG9tLCAxMCkgOiAwXG4gIHJldHVybiBhYnNvbHV0ZUJvdHRvbSAtIHBhZGRpbmdCb3R0b21QaXhlbHNcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RpY2t5SW1wbCBpbXBsZW1lbnRzIFN0aWNreSB7XG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudFxuICBwdWJsaWMgb3B0aW9uczogUGFydGlhbFJlcXVpcmVkPFN0aWNreU9wdGlvbnMsICdtYXJnaW5Ub3AnPlxuICBwdWJsaWMgcGxhY2Vob2xkZXI6IFBsYWNlaG9sZGVyXG4gIHB1YmxpYyBtYXJnaW5Ub3A6IG51bWJlciA9IDBcbiAgcHVibGljIGlzU3RpY2tUb0JvdHRvbTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyByZWN0OiBDbGllbnRSZWN0XG4gIHB1YmxpYyBmbG9vcj86IG51bWJlclxuXG4gIHByaXZhdGUgJCR3cmFwcGVyITogSFRNTEVsZW1lbnRcbiAgcHJpdmF0ZSAkJGFkZGl0aW9uYWxUb3A/OiBudW1iZXJcblxuICBwcml2YXRlIHJlYWRvbmx5ICQkbWFuYWdlcjogU3RpY2t5TWFuYWdlclxuXG4gIHByaXZhdGUgZ2V0IGlzU3RpY2t5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQgIT09IG51bGwgJiYgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnXG4gIH1cblxuICBwcml2YXRlIHNldCBpc1N0aWNreSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyLnNob3VsZFBsYWNlaG9sZCA9IHZhbHVlXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0dWNrID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJydcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB2YWx1ZSA/ICdmaXhlZCcgOiAnJ1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB2YWx1ZSA/IGAke3RoaXMudG9wfXB4YCA6ICcnXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSB2YWx1ZVxuICAgICAgPyBgJHt0aGlzLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKS5sZWZ0fXB4YFxuICAgICAgOiAnJ1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgdG9wKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuJCRhZGRpdGlvbmFsVG9wIHx8IHRoaXMuJCRhZGRpdGlvbmFsVG9wID09PSAwXG4gICAgICA/IHRoaXMuJCRhZGRpdGlvbmFsVG9wXG4gICAgICA6IHRoaXMubWFyZ2luVG9wXG4gIH1cblxuICBwcml2YXRlIHNldCB0b3AodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuJCRhZGRpdGlvbmFsVG9wID0gdmFsdWVcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdmFsdWUgPyBgJHt2YWx1ZX1weGAgOiBgJHt0aGlzLm1hcmdpblRvcH1weGBcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IHdyYXBwZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLiQkd3JhcHBlclxuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIG9wdGlvbnM6IFN0aWNreU9wdGlvbnMgPSB7IG9ic2VydmU6IHRydWUgfSxcbiAgICBhY3RpdmF0ZTogYm9vbGVhbiA9IHRydWUsXG4gICAgb25VcGRhdGU6ICgpID0+IHZvaWQgPSBub29wXG4gICkge1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbU3R1Y2stanNdIEludmFsaWQgZWxlbWVudCBnaXZlbicpXG4gICAgfVxuICAgIHRoaXMuJCRtYW5hZ2VyID0gZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHdpbmRvdykucmVnaXN0ZXIodGhpcylcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgdGhpcy5yZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgbWFyZ2luVG9wOiAwLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9XG4gICAgdGhpcy5tYXJnaW5Ub3AgPSB0aGlzLm9wdGlvbnMubWFyZ2luVG9wIHx8IDBcbiAgICB0aGlzLnNldFdyYXBwZXJGcm9tU2VsZWN0b3JPckVsZW1lbnQodGhpcy5vcHRpb25zLndyYXBwZXIpXG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IG5ldyBQbGFjZWhvbGRlcihcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIHRoaXMub3B0aW9ucy5vYnNlcnZlIHx8IHRydWUsXG4gICAgICBvblVwZGF0ZSB8fCB0aGlzLiQkbWFuYWdlci5idWxrVXBkYXRlXG4gICAgKVxuICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0dWNrID0gJydcblxuICAgIGlmIChhY3RpdmF0ZSkge1xuICAgICAgdGhpcy4kJG1hbmFnZXIuYWN0aXZhdGUoKVxuICAgIH1cblxuICAgIHRoaXMucGxhY2Vob2xkZXIuc2hvdWxkUGxhY2Vob2xkID0gdGhpcy5pc1N0aWNreVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRXcmFwcGVyRnJvbVNlbGVjdG9yT3JFbGVtZW50KFxuICAgIHNlbGVjdG9yT3JFbGVtZW50PzogU2VsZWN0b3JPckVsZW1lbnRcbiAgKTogdm9pZCB7XG4gICAgaWYgKCEoZG9jdW1lbnQuYm9keSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1tTdHVjay5qc10gZG9jdW1lbnQuYm9keSBpcyBub3QgSFRNTEVsZW1lbnQgaW4gdGhpcyBlbnZpcm9ubWVudCdcbiAgICAgIClcbiAgICB9XG4gICAgY29uc3QgcGFyZW50ID0gKHRoaXMucGxhY2Vob2xkZXI/LmVsZW1lbnQgfHwgdGhpcy5lbGVtZW50KS5wYXJlbnRFbGVtZW50XG4gICAgdGhpcy4kJHdyYXBwZXIgPSBub3JtYWxpemVFbGVtZW50KHNlbGVjdG9yT3JFbGVtZW50LCBwYXJlbnQsIGRvY3VtZW50LmJvZHkpXG4gICAgdGhpcy5mbG9vciA9IGNvbXB1dGVBYnNvbHV0ZUZsb29yKHRoaXMuJCR3cmFwcGVyKVxuICAgIHRoaXMub3B0aW9ucy53cmFwcGVyID0gdGhpcy4kJHdyYXBwZXJcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuaXNTdGlja3kgPSBmYWxzZVxuICAgIHRoaXMucGxhY2Vob2xkZXIuZGVzdHJveSgpXG4gICAgdGhpcy4kJG1hbmFnZXIudW5yZWdpc3Rlcih0aGlzKVxuICB9XG5cbiAgcHJpdmF0ZSBjb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdChcbiAgICByZWN0OiBDbGllbnRSZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICk6IHZvaWQge1xuICAgIHRoaXMucmVjdCA9IHJlY3RcbiAgICB0aGlzLmZsb29yID0gY29tcHV0ZUFic29sdXRlRmxvb3IodGhpcy53cmFwcGVyKVxuXG4gICAgY29uc3QgcmVsYXRpdmVGbG9vciA9ICh0aGlzLmZsb29yIHx8IDApIC0gd2luZG93LnBhZ2VZT2Zmc2V0XG5cbiAgICBpZiAodGhpcy5yZWN0LmJvdHRvbSA+PSByZWxhdGl2ZUZsb29yICYmICF0aGlzLmlzU3RpY2tUb0JvdHRvbSkge1xuICAgICAgdGhpcy50b3AgPSByZWxhdGl2ZUZsb29yIC0gdGhpcy5yZWN0LmhlaWdodFxuICAgICAgdGhpcy5pc1N0aWNrVG9Cb3R0b20gPSB0cnVlXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNTdGlja1RvQm90dG9tKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWN0LnRvcCA+PSB0aGlzLm1hcmdpblRvcCkge1xuICAgICAgdGhpcy50b3AgPSB0aGlzLm1hcmdpblRvcFxuICAgICAgdGhpcy5pc1N0aWNrVG9Cb3R0b20gPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVjdC50b3AgPCB0aGlzLm1hcmdpblRvcCkge1xuICAgICAgdGhpcy50b3AgPSByZWxhdGl2ZUZsb29yIC0gdGhpcy5yZWN0LmhlaWdodFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXJSZWN0ID0gdGhpcy5wbGFjZWhvbGRlci5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBpZiAoIXRoaXMuaXNTdGlja3kgJiYgdGhpcy5tYXJnaW5Ub3AgPiBwbGFjZWhvbGRlclJlY3QudG9wKSB7XG4gICAgICB0aGlzLmlzU3RpY2t5ID0gdHJ1ZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTdGlja3kpIHtcbiAgICAgIGlmIChwbGFjZWhvbGRlclJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgIHRoaXMuaXNTdGlja3kgPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBpZiAodGhpcy5yZWN0LmxlZnQgIT09IHBsYWNlaG9sZGVyUmVjdC5sZWZ0KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7cGxhY2Vob2xkZXJSZWN0LmxlZnR9cHhgXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29tcHV0ZVBvc2l0aW9uVG9wRnJvbVJlY3QodGhpcy5yZWN0KVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBTdGlja3kgfSBmcm9tICcuL3N0aWNreSdcbmltcG9ydCB7IGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSB9IGZyb20gJy4vc3RpY2t5TWFuYWdlcidcbmltcG9ydCB0eXBlIHsgU3R1Y2sgfSBmcm9tICcuL3N0dWNrJ1xuaW1wb3J0IHsgc3RhYmxlU29ydCB9IGZyb20gJy4vdXRpbGl0eSdcblxuZXhwb3J0IGludGVyZmFjZSBTdHVja01hbmFnZXIge1xuICBzdGlja2llczogcmVhZG9ubHkgU3RpY2t5W11cbiAgc3RpY2t5RWxlbWVudHM6IHJlYWRvbmx5IEhUTUxFbGVtZW50W11cbiAgc3RhY2tpbmdTdGlja2llczogcmVhZG9ubHkgU3RpY2t5W11cbiAgcmVnaXN0ZXIoc3R1Y2s6IFN0dWNrKTogU3R1Y2tNYW5hZ2VyXG4gIHVucmVnaXN0ZXIoc3R1Y2s6IFN0dWNrKTogU3R1Y2tNYW5hZ2VyXG4gIGFkZFN0aWNraWVzKHN0YWNraW5nOiBib29sZWFuLCAuLi5zdGlja2llczogU3RpY2t5W10pOiBTdHVja01hbmFnZXJcbiAgZGVzdHJveVN0aWNraWVzKC4uLnN0aWNraWVzOiBTdGlja3lbXSk6IFN0dWNrTWFuYWdlclxuICB1cGRhdGUoKTogU3R1Y2tNYW5hZ2VyXG59XG5cbmNsYXNzIFN0dWNrTWFuYWdlckltcGwgaW1wbGVtZW50cyBTdHVja01hbmFnZXIge1xuICBwcml2YXRlIHN0YXRpYyAkJGluc3RhbmNlOiBTdHVja01hbmFnZXJcbiAgcHJpdmF0ZSAkJHN0dWNrczogU3R1Y2tbXSA9IFtdXG4gIHByaXZhdGUgJCRzdGlja2llczogU3RpY2t5W10gPSBbXVxuICBwcml2YXRlICQkc3RhY2tpbmdTdGlja2llczogU3RpY2t5W10gPSBbXVxuICBwcml2YXRlICQkd2luZG93OiBXaW5kb3dcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKF93aW5kb3c6IFdpbmRvdykge1xuICAgIHRoaXMuJCR3aW5kb3cgPSBfd2luZG93XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKF93aW5kb3c6IFdpbmRvdyk6IFN0dWNrTWFuYWdlciB7XG4gICAgaWYgKCFTdHVja01hbmFnZXJJbXBsLiQkaW5zdGFuY2UpIHtcbiAgICAgIFN0dWNrTWFuYWdlckltcGwuJCRpbnN0YW5jZSA9IG5ldyBTdHVja01hbmFnZXJJbXBsKF93aW5kb3cpXG4gICAgfVxuICAgIHJldHVybiBTdHVja01hbmFnZXJJbXBsLiQkaW5zdGFuY2VcbiAgfVxuXG4gIHB1YmxpYyByZWdpc3RlcihzdHVjazogU3R1Y2spOiBTdHVja01hbmFnZXIge1xuICAgIHRoaXMuJCRzdHVja3MgPSBbLi4udGhpcy4kJHN0dWNrcywgc3R1Y2tdXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyB1bnJlZ2lzdGVyKHN0dWNrOiBTdHVjayk6IFN0dWNrTWFuYWdlciB7XG4gICAgdGhpcy5kZXN0cm95U3RpY2tpZXMoLi4uc3R1Y2suc3RpY2tpZXMpXG4gICAgdGhpcy4kJHN0dWNrcyA9IHRoaXMuJCRzdHVja3MuZmlsdGVyKFxuICAgICAgKGluc3RhbmNlKTogYm9vbGVhbiA9PiBpbnN0YW5jZSAhPT0gc3R1Y2tcbiAgICApXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBnZXQgc3RpY2tpZXMoKTogcmVhZG9ubHkgU3RpY2t5W10ge1xuICAgIHJldHVybiB0aGlzLiQkc3RpY2tpZXNcbiAgfVxuXG4gIHB1YmxpYyBnZXQgc3RpY2t5RWxlbWVudHMoKTogcmVhZG9ubHkgSFRNTEVsZW1lbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMuJCRzdGlja2llcy5tYXAoKHN0aWNreSk6IEhUTUxFbGVtZW50ID0+IHN0aWNreS5lbGVtZW50KVxuICB9XG5cbiAgcHVibGljIGdldCBzdGFja2luZ1N0aWNraWVzKCk6IHJlYWRvbmx5IFN0aWNreVtdIHtcbiAgICByZXR1cm4gdGhpcy4kJHN0YWNraW5nU3RpY2tpZXNcbiAgfVxuXG4gIHB1YmxpYyBhZGRTdGlja2llcyhzdGFja2luZzogYm9vbGVhbiwgLi4uc3RpY2tpZXM6IFN0aWNreVtdKTogU3R1Y2tNYW5hZ2VyIHtcbiAgICB0aGlzLiQkc3RpY2tpZXMgPSBbLi4udGhpcy4kJHN0aWNraWVzLCAuLi5zdGlja2llc11cbiAgICBpZiAoc3RhY2tpbmcpIHtcbiAgICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gWy4uLnRoaXMuJCRzdGFja2luZ1N0aWNraWVzLCAuLi5zdGlja2llc11cbiAgICB9XG4gICAgZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHRoaXMuJCR3aW5kb3cpLmFjdGl2YXRlKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3lTdGlja2llcyguLi5zdGlja2llczogU3RpY2t5W10pOiBTdHVja01hbmFnZXIge1xuICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2Ygc3RpY2tpZXMpIHtcbiAgICAgIGluc3RhbmNlLmRlc3Ryb3koKVxuICAgIH1cbiAgICB0aGlzLiQkc3RpY2tpZXMgPSB0aGlzLiQkc3RpY2tpZXMuZmlsdGVyKFxuICAgICAgKHN0aWNreSk6IGJvb2xlYW4gPT4gIXN0aWNraWVzLmluY2x1ZGVzKHN0aWNreSlcbiAgICApXG4gICAgdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMgPSB0aGlzLiQkc3RhY2tpbmdTdGlja2llcy5maWx0ZXIoXG4gICAgICAoc3RpY2t5KTogYm9vbGVhbiA9PiAhc3RpY2tpZXMuaW5jbHVkZXMoc3RpY2t5KVxuICAgIClcbiAgICBpZiAodGhpcy4kJHN0YWNraW5nU3RpY2tpZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZSgpOiBTdHVja01hbmFnZXIge1xuICAgIGludGVyZmFjZSBTdHVja1VwZGF0ZVNvdXJjZSB7XG4gICAgICBpbnN0YW5jZTogU3RpY2t5XG4gICAgICByZWN0OiBDbGllbnRSZWN0XG4gICAgfVxuICAgIGludGVyZmFjZSBTdHVja1NvcnRpbmdBY2N1bXVsYXRvciB7XG4gICAgICBpbnN0YW5jZXM6IFN0aWNreVtdXG4gICAgICBjZWlsaW5nOiBDbGllbnRSZWN0Wyd0b3AnXVxuICAgIH1cbiAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IHRoaXMuc3RhY2tpbmdTdGlja2llc1xuICAgICAgLmZpbHRlcihcbiAgICAgICAgKGluc3RhbmNlLCBpbmRleCwgYWxsKTogYm9vbGVhbiA9PiBhbGwuaW5kZXhPZihpbnN0YW5jZSkgPT09IGluZGV4XG4gICAgICApXG4gICAgICAubWFwKFxuICAgICAgICAoaW5zdGFuY2UpOiBTdHVja1VwZGF0ZVNvdXJjZSA9PiAoe1xuICAgICAgICAgIGluc3RhbmNlLFxuICAgICAgICAgIHJlY3Q6IGluc3RhbmNlLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKSxcbiAgICAgICAgfSlcbiAgICAgIClcbiAgICAgIC5zb3J0KFxuICAgICAgICAoeyByZWN0OiBiZWZvcmUgfSwgeyByZWN0OiBhZnRlciB9KTogQ2xpZW50UmVjdFsndG9wJ10gPT5cbiAgICAgICAgICBiZWZvcmUudG9wIC0gYWZ0ZXIudG9wXG4gICAgICApXG4gICAgICAucmVkdWNlKFxuICAgICAgICAoXG4gICAgICAgICAgeyBpbnN0YW5jZXMsIGNlaWxpbmcgfTogU3R1Y2tTb3J0aW5nQWNjdW11bGF0b3IsXG4gICAgICAgICAgeyBpbnN0YW5jZSB9XG4gICAgICAgICk6IFN0dWNrU29ydGluZ0FjY3VtdWxhdG9yID0+IHtcbiAgICAgICAgICBpbnN0YW5jZS5tYXJnaW5Ub3AgPSBpbnN0YW5jZS5vcHRpb25zLm1hcmdpblRvcCArIGNlaWxpbmdcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaW5zdGFuY2VzOiBbLi4uaW5zdGFuY2VzLCBpbnN0YW5jZV0sXG4gICAgICAgICAgICBjZWlsaW5nOiBpbnN0YW5jZS5yZWN0LmhlaWdodCArIGluc3RhbmNlLm1hcmdpblRvcCxcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHsgaW5zdGFuY2VzOiBbXSwgY2VpbGluZzogMCB9XG4gICAgICApLmluc3RhbmNlc1xuXG4gICAgZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHRoaXMuJCR3aW5kb3cpLmJ1bGtVcGRhdGUoKVxuXG4gICAgdGhpcy4kJHN0aWNraWVzID0gc3RhYmxlU29ydChcbiAgICAgIHRoaXMuc3RpY2tpZXMsXG4gICAgICAoYmVmb3JlOiBTdGlja3ksIGFmdGVyOiBTdGlja3kpOiBudW1iZXIgPT5cbiAgICAgICAgYmVmb3JlLnBsYWNlaG9sZGVyLmNhY2hlZFJlY3QudG9wIC0gYWZ0ZXIucGxhY2Vob2xkZXIuY2FjaGVkUmVjdC50b3BcbiAgICApXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRTdHVja01hbmFnZXJJbnN0YW5jZSA9IChfd2luZG93OiBXaW5kb3cpOiBTdHVja01hbmFnZXIgPT5cbiAgU3R1Y2tNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZShfd2luZG93KVxuIiwiaW1wb3J0IHR5cGUgeyBTdGlja3ksIFN0aWNreU9wdGlvbnMgfSBmcm9tICcuL3N0aWNreSdcbmltcG9ydCBTdGlja3lJbXBsIGZyb20gJy4vc3RpY2t5SW1wbCdcbmltcG9ydCB0eXBlIHsgU2VsZWN0b3JPckVsZW1lbnRPcHRpb24sIFN0aWNreVNldHRpbmcsIFN0dWNrIH0gZnJvbSAnLi9zdHVjaydcbmltcG9ydCB7IGdldFN0dWNrTWFuYWdlckluc3RhbmNlLCB0eXBlIFN0dWNrTWFuYWdlciB9IGZyb20gJy4vc3R1Y2tNYW5hZ2VyJ1xuXG5jb25zdCBnZXRFbGVtZW50c0FycmF5RnJvbVNldHRpbmcgPSAoXG4gIG9wdGlvbjogU2VsZWN0b3JPckVsZW1lbnRPcHRpb25cbik6IEhUTUxFbGVtZW50W10gPT4ge1xuICBpZiAob3B0aW9uLmVsZW1lbnQpIHtcbiAgICBjb25zdCB7IGVsZW1lbnQgfSA9IG9wdGlvblxuICAgIGlmIChlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBbZWxlbWVudF1cbiAgICB9XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZWxlbWVudCkgfHwgdHlwZW9mIGVsZW1lbnQgPT09ICdvYmplY3QnKSB7XG4gICAgICByZXR1cm4gQXJyYXkuZnJvbShlbGVtZW50KVxuICAgIH1cbiAgfVxuICBpZiAob3B0aW9uLnNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChvcHRpb24uc2VsZWN0b3IpKS5maWx0ZXIoXG4gICAgICAobWF5YmVIVE1MRWxlbWVudCk6IG1heWJlSFRNTEVsZW1lbnQgaXMgSFRNTEVsZW1lbnQgPT5cbiAgICAgICAgbWF5YmVIVE1MRWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gICAgKVxuICB9XG4gIHRocm93IG5ldyBFcnJvcignW1N0dWNrLmpzXSBObyBzZWxlY3RvciwgZWxlbWVudCBub3IgZWxlbWVudHMgaW4gc2V0dGluZycpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0dWNrSW1wbCBpbXBsZW1lbnRzIFN0dWNrIHtcbiAgcHJpdmF0ZSByZWFkb25seSAkJGRlZmF1bHRPcHRpb25zITogU3RpY2t5T3B0aW9uc1xuICBwcml2YXRlIHJlYWRvbmx5ICQkbWFuYWdlcjogU3R1Y2tNYW5hZ2VyXG4gIHByaXZhdGUgJCRpbnN0YW5jZXM6IFN0aWNreVtdID0gW11cblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgc2V0dGluZ3M6IFN0aWNreVNldHRpbmdbXSB8IFN0aWNreVNldHRpbmcgPSBbXSxcbiAgICBkZWZhdWx0T3B0aW9uczogU3RpY2t5T3B0aW9ucyA9IHsgb2JzZXJ2ZTogdHJ1ZSB9LFxuICAgIHNoYXJlZFN0YWNraW5nOiBib29sZWFuID0gdHJ1ZVxuICApIHtcbiAgICB0aGlzLiQkbWFuYWdlciA9IGdldFN0dWNrTWFuYWdlckluc3RhbmNlKHdpbmRvdykucmVnaXN0ZXIodGhpcylcbiAgICB0aGlzLiQkZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9uc1xuICAgIHRoaXMuY3JlYXRlKHNldHRpbmdzLCBzaGFyZWRTdGFja2luZylcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGUoXG4gICAgc291cmNlOiBSZWFkb25seTxTdGlja3lTZXR0aW5nW10gfCBTdGlja3lTZXR0aW5nPixcbiAgICBzaGFyZWRTdGFja2luZzogYm9vbGVhbiA9IHRydWVcbiAgKTogU3RpY2t5W10ge1xuICAgIGNvbnN0IHNldHRpbmdzID0gQXJyYXkuaXNBcnJheShzb3VyY2UpID8gc291cmNlIDogW3NvdXJjZV1cbiAgICBjb25zdCByZWdpc3RlcmVkID0gc2V0dGluZ3MucmVkdWNlPFN0aWNreVtdPihcbiAgICAgIChhY2N1bXVsYXRvciwgc2V0dGluZyk6IFN0aWNreVtdID0+XG4gICAgICAgIGFjY3VtdWxhdG9yLmNvbmNhdCh0aGlzLnJlZ2lzdGVyKHNldHRpbmcsIHNoYXJlZFN0YWNraW5nKSksXG4gICAgICBbXVxuICAgIClcbiAgICBpZiAocmVnaXN0ZXJlZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICB0aGlzLiQkbWFuYWdlci51cGRhdGUoKVxuICAgIHJldHVybiByZWdpc3RlcmVkXG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyKFxuICAgIHsgc2VsZWN0b3IsIGVsZW1lbnQsIC4uLm9wdGlvbnMgfTogU3RpY2t5U2V0dGluZyxcbiAgICBzaGFyZWRTdGFja2luZzogYm9vbGVhbiA9IHRydWVcbiAgKTogU3RpY2t5W10ge1xuICAgIGNvbnN0IHJlZ2lzdGVyZWRJbnN0YW5jZUVsZW1lbnRzID0gdGhpcy4kJG1hbmFnZXIuc3RpY2t5RWxlbWVudHNcbiAgICBjb25zdCBzdGlja2llcyA9IGdldEVsZW1lbnRzQXJyYXlGcm9tU2V0dGluZyh7XG4gICAgICBzZWxlY3RvcixcbiAgICAgIGVsZW1lbnQsXG4gICAgfSBhcyB1bmtub3duIGFzIFNlbGVjdG9yT3JFbGVtZW50T3B0aW9uKVxuICAgICAgLmZpbHRlcigodGFyZ2V0KTogYm9vbGVhbiA9PiAhcmVnaXN0ZXJlZEluc3RhbmNlRWxlbWVudHMuaW5jbHVkZXModGFyZ2V0KSlcbiAgICAgIC5tYXAoXG4gICAgICAgIChuZXdFbGVtZW50KTogU3RpY2t5ID0+XG4gICAgICAgICAgbmV3IFN0aWNreUltcGwoXG4gICAgICAgICAgICBuZXdFbGVtZW50LFxuICAgICAgICAgICAgeyAuLi50aGlzLiQkZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfSxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICB0aGlzLiQkbWFuYWdlci51cGRhdGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgIClcblxuICAgIHRoaXMuJCRtYW5hZ2VyLmFkZFN0aWNraWVzKHNoYXJlZFN0YWNraW5nLCAuLi5zdGlja2llcylcbiAgICB0aGlzLiQkaW5zdGFuY2VzID0gWy4uLnRoaXMuJCRpbnN0YW5jZXMsIC4uLnN0aWNraWVzXVxuICAgIHJldHVybiBzdGlja2llc1xuICB9XG5cbiAgcHVibGljIGdldCBzdGlja2llcygpOiByZWFkb25seSBTdGlja3lbXSB7XG4gICAgcmV0dXJuIHRoaXMuJCRpbnN0YW5jZXNcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuJCRtYW5hZ2VyLnVucmVnaXN0ZXIodGhpcylcbiAgICB0aGlzLiQkaW5zdGFuY2VzID0gW11cbiAgfVxufVxuIiwiaW1wb3J0IFBsYWNlaG9sZGVyIGZyb20gJy4vcGxhY2Vob2xkZXInXG5pbXBvcnQgU3RpY2t5IGZyb20gJy4vc3RpY2t5SW1wbCdcbmltcG9ydCBTdHVjayBmcm9tICcuL3N0dWNrSW1wbCdcblxuZXhwb3J0IHsgUGxhY2Vob2xkZXIsIFN0aWNreSwgU3R1Y2sgfVxuZXhwb3J0IGRlZmF1bHQgU3R1Y2tcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Q0FBQSxJQUFhLGFBQW1CLENBQUM7Q0FFakMsSUFBYSxjQUNYLE9BQ0Esb0JBRUEsTUFDRyxLQUFLLE1BQU0sV0FBdUM7RUFBRTtFQUFNO0NBQU0sRUFBRSxDQUFDLENBQ25FLE1BQU0sUUFBUSxVQUFrQjtFQUMvQixNQUFNLFNBQVMsZ0JBQWdCLE9BQU8sTUFBTSxNQUFNLElBQUk7RUFDdEQsT0FBTyxXQUFXLElBQUksU0FBUyxPQUFPLFFBQVEsTUFBTTtDQUN0RCxDQUFDLENBQUMsQ0FDRCxLQUFLLEVBQUUsV0FBYyxJQUFJOzs7Q0NWOUIsSUFBcUIsY0FBckIsTUFBcUIsWUFBWTtFQVUvQixJQUFXLGtCQUEyQjtHQUNwQyxPQUFPLENBQUMsS0FBSyxtQkFBbUIsS0FBSztFQUN2QztFQUVBLElBQVcsZ0JBQWdCLE9BQWdCO0dBQ3pDLElBQUksS0FBSyxvQkFBb0IsT0FDM0I7R0FHRixLQUFLLG9CQUFvQjtHQUN6QixLQUFLLE9BQU8sSUFBSTtFQUNsQjtFQUVBLFlBQ0UsU0FDQSxVQUFtQixNQUNuQixXQUF1QixNQUN2Qjs0QkFuQm1DO0dBb0JuQyxLQUFLLFdBQVc7R0FDaEIsS0FBSyxXQUFXLE9BQU8sYUFBYSxhQUFhLFdBQVc7R0FFNUQsS0FBSyx3QkFBd0IsT0FBTyxpQkFBaUIsS0FBSyxRQUFRO0dBQ2xFLEtBQUssa0JBQWtCLEtBQUssc0JBQXNCLFlBQVk7R0FFOUQsSUFBSSxLQUFLLGlCQUNQLEtBQUssd0JBQThCO0lBQ2pDLEtBQUssd0JBQXdCLE9B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