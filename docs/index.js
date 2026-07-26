(function(global, factory) {
	typeof exports === "object" && typeof module !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.StuckJs = {}));
})(this, function(exports) {
	Object.defineProperties(exports, {
		__esModule: { value: true },
		[Symbol.toStringTag]: { value: "Module" }
	});
	//#region src/utility.ts
	var noop = () => {};
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
			this.$$destroyed = false;
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
			if (this.$$destroyed) return;
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
			if (this.$$destroyed) return;
			this.$$destroyed = true;
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
			const { width: originalWidth, height: originalHeight } = this.original.getBoundingClientRect();
			const widthChanged = originalWidth !== this.cachedRect.width;
			const heightChanged = originalHeight !== this.cachedRect.height;
			if (!forceUpdate && !widthChanged && !heightChanged) return;
			if (forceUpdate || widthChanged) this.element.style.width = `${originalWidth}px`;
			if (forceUpdate || heightChanged) this.element.style.height = `${originalHeight}px`;
			this.updateRect();
		}
		removeStyles() {
			this.element.style.width = "";
			this.element.style.height = "";
		}
		/**
		* サイズそのものを監視する。属性の変化を見る MutationObserver では
		* CSS transition や animation による寸法の変化を取り逃がしてしまう
		* （class が付いた時点でしか測れず、遷移後の値にならない）。
		*/
		static createObserver(targetNode, callback) {
			if (!targetNode) throw new TypeError(`[Stuck.js] Could not observe targetNode ${String(targetNode)}. This should be HTMLElement`);
			const observer = new ResizeObserver(() => {
				callback();
			});
			observer.observe(targetNode);
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
			this.scheduleUpdate(false);
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
			this.scheduleUpdate(true);
		}
		/** 更新は次のフレームまでまとめる。予約済みのものがあれば取り消して置き換える */
		scheduleUpdate(withPlaceholder) {
			if (this.$$bulkUpdateRequestId) this.$$window.cancelAnimationFrame(this.$$bulkUpdateRequestId);
			this.$$bulkUpdateRequestId = this.$$window.requestAnimationFrame(() => {
				for (const instance of this.$$stickies) {
					if (withPlaceholder) instance.placeholder.update();
					instance.update();
				}
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
			return this.element.style.position === "fixed";
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
			var _this$$$additionalTop;
			return (_this$$$additionalTop = this.$$additionalTop) !== null && _this$$$additionalTop !== void 0 ? _this$$$additionalTop : this.marginTop;
		}
		set top(value) {
			this.$$additionalTop = value;
			this.element.style.top = value ? `${value}px` : `${this.marginTop}px`;
		}
		get wrapper() {
			return this.$$wrapper;
		}
		constructor(element, options = { observe: true }, activate = true, onUpdate = noop) {
			var _this$options$observe;
			this.marginTop = 0;
			this.isStickToBottom = false;
			this.$$destroyed = false;
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
			this.placeholder = new Placeholder(this.element, (_this$options$observe = this.options.observe) !== null && _this$options$observe !== void 0 ? _this$options$observe : true, onUpdate);
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
			if (this.$$destroyed) return;
			this.$$destroyed = true;
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
			if (!this.isStickToBottom) {
				if (this.$$additionalTop !== this.marginTop) this.top = this.marginTop;
				return;
			}
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
		/** 登録済みの Stuck と Sticky をすべて破棄し、シングルトンを初期状態に戻す */
		destroyAll() {
			this.destroyStickies(...this.$$stickies);
			this.$$stucks = [];
			this.$$stickies = [];
			this.$$stackingStickies = [];
			getStickyManagerInstance(this.$$window).destroyAll();
			return this;
		}
		update() {
			const sorted = Array.from(new Set(this.stackingStickies)).map((instance) => ({
				instance,
				rect: instance.placeholder.updateRect()
			})).sort((before, after) => before.rect.top - after.rect.top);
			let ceiling = 0;
			const stacking = [];
			for (const { instance } of sorted) {
				instance.marginTop = instance.options.marginTop + ceiling;
				ceiling = instance.rect.height + instance.marginTop;
				stacking.push(instance);
			}
			this.$$stackingStickies = stacking;
			getStickyManagerInstance(this.$$window).bulkUpdate();
			this.$$stickies = [...this.stickies].sort((before, after) => before.placeholder.cachedRect.top - after.placeholder.cachedRect.top);
			return this;
		}
	};
	var getStuckManagerInstance = (_window) => StuckManagerImpl.getInstance(_window);
	//#endregion
	//#region src/stuckImpl.ts
	var getElementsArrayFromSetting = ({ selector, element }) => {
		if (element) return element instanceof HTMLElement ? [element] : Array.from(element);
		if (selector) return Array.from(document.querySelectorAll(selector)).filter((maybeHTMLElement) => maybeHTMLElement instanceof HTMLElement);
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxpdHkudHMiLCIuLi9zcmMvcGxhY2Vob2xkZXIudHMiLCIuLi9zcmMvc3RpY2t5TWFuYWdlci50cyIsIi4uL3NyYy9zdGlja3lJbXBsLnRzIiwiLi4vc3JjL3N0dWNrTWFuYWdlci50cyIsIi4uL3NyYy9zdHVja0ltcGwudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG5vb3AgPSAoKTogdm9pZCA9PiB7fVxuIiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbGl0eSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhY2Vob2xkZXIge1xuICBwdWJsaWMgb3JpZ2luYWw6IEhUTUxFbGVtZW50XG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudFxuICBwdWJsaWMgY2FjaGVkUmVjdDogRE9NUmVjdFxuICBwdWJsaWMgb2JzZXJ2ZXI/OiBSZXNpemVPYnNlcnZlclxuICBwdWJsaWMgb25VcGRhdGU6ICgpID0+IHZvaWRcbiAgcHVibGljIGluaXRpYWxDb21wdXRlZFN0eWxlczogQ1NTU3R5bGVEZWNsYXJhdGlvblxuICBwdWJsaWMgaW5pdGlhbGx5SGlkZGVuOiBib29sZWFuXG4gIHByaXZhdGUgJCRzaG91bGRQbGFjZWhvbGQ6IGJvb2xlYW4gPSB0cnVlXG4gIHByaXZhdGUgJCRkZXN0cm95ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIHB1YmxpYyBnZXQgc2hvdWxkUGxhY2Vob2xkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5pbml0aWFsbHlIaWRkZW4gJiYgdGhpcy4kJHNob3VsZFBsYWNlaG9sZFxuICB9XG5cbiAgcHVibGljIHNldCBzaG91bGRQbGFjZWhvbGQodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5zaG91bGRQbGFjZWhvbGQgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICB0aGlzLiQkc2hvdWxkUGxhY2Vob2xkID0gdmFsdWVcbiAgICB0aGlzLnVwZGF0ZSh0cnVlKVxuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIG9ic2VydmU6IGJvb2xlYW4gPSB0cnVlLFxuICAgIG9uVXBkYXRlOiAoKSA9PiB2b2lkID0gbm9vcFxuICApIHtcbiAgICB0aGlzLm9yaWdpbmFsID0gZWxlbWVudFxuICAgIHRoaXMub25VcGRhdGUgPSB0eXBlb2Ygb25VcGRhdGUgPT09ICdmdW5jdGlvbicgPyBvblVwZGF0ZSA6IG5vb3BcblxuICAgIHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5vcmlnaW5hbClcbiAgICB0aGlzLmluaXRpYWxseUhpZGRlbiA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLmRpc3BsYXkgPT09ICdub25lJ1xuXG4gICAgaWYgKHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICB0aGlzLmV4ZWNXaGlsZVN0dWNraW5nKCgpOiB2b2lkID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm9yaWdpbmFsKVxuICAgICAgfSlcbiAgICB9XG5cbiAgICB0aGlzLmVsZW1lbnQgPSBQbGFjZWhvbGRlci5jcmVhdGVQbGFjZWhvbGRlckVsZW1lbnQoKVxuICAgIHRoaXMuYXBwbHlJbml0aWFsU3R5bGVzKClcbiAgICBQbGFjZWhvbGRlci53cmFwKHRoaXMub3JpZ2luYWwsIHRoaXMuZWxlbWVudClcbiAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLnVwZGF0ZVJlY3QoKVxuXG4gICAgaWYgKG9ic2VydmUpIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXIgPSBQbGFjZWhvbGRlci5jcmVhdGVPYnNlcnZlcih0aGlzLm9yaWdpbmFsLCAoKTogdm9pZCA9PlxuICAgICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgICApXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZShmb3JjZVVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuJCRkZXN0cm95ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICBpZiAodGhpcy5zaG91bGRQbGFjZWhvbGQpIHtcbiAgICAgIHRoaXMuYXBwbHlTdHlsZXMoZm9yY2VVcGRhdGUpXG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucmVtb3ZlU3R5bGVzKClcbiAgICB9XG4gICAgdGhpcy5vblVwZGF0ZSgpXG4gIH1cblxuICBwdWJsaWMgdXBkYXRlUmVjdCgpOiBET01SZWN0IHtcbiAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBpZiAodGhpcy5pbml0aWFsbHlIaWRkZW4pIHtcbiAgICAgIHRoaXMuZXhlY1doaWxlU3R1Y2tpbmcoKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLmNhY2hlZFJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIH0pXG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNhY2hlZFJlY3RcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLiQkZGVzdHJveWVkKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy4kJGRlc3Ryb3llZCA9IHRydWVcbiAgICBpZiAodGhpcy5vYnNlcnZlcikge1xuICAgICAgdGhpcy5vYnNlcnZlci5kaXNjb25uZWN0KClcbiAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyXG4gICAgfVxuICAgIFBsYWNlaG9sZGVyLnVud3JhcCh0aGlzLm9yaWdpbmFsKVxuICB9XG5cbiAgcHJpdmF0ZSBleGVjV2hpbGVTdHVja2luZyhleGVjdXRlOiAoKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhdGUgPSB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2tcbiAgICB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2sgPSAndHJ1ZSdcbiAgICBleGVjdXRlKClcbiAgICB0aGlzLm9yaWdpbmFsLmRhdGFzZXQuc3R1Y2sgPSBzdGF0ZVxuICB9XG5cbiAgcHJpdmF0ZSBhcHBseUluaXRpYWxTdHlsZXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyB8fCB0aGlzLmluaXRpYWxseUhpZGRlbikge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5tYXJnaW4gPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5tYXJnaW5cbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUubWluV2lkdGggPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5taW5XaWR0aFxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5taW5IZWlnaHQgPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5taW5IZWlnaHRcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy53aWR0aFxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcy5oZWlnaHRcbiAgfVxuXG4gIHByaXZhdGUgYXBwbHlTdHlsZXMoZm9yY2VVcGRhdGU6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IHsgd2lkdGg6IG9yaWdpbmFsV2lkdGgsIGhlaWdodDogb3JpZ2luYWxIZWlnaHQgfSA9XG4gICAgICB0aGlzLm9yaWdpbmFsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgY29uc3Qgd2lkdGhDaGFuZ2VkID0gb3JpZ2luYWxXaWR0aCAhPT0gdGhpcy5jYWNoZWRSZWN0LndpZHRoXG4gICAgY29uc3QgaGVpZ2h0Q2hhbmdlZCA9IG9yaWdpbmFsSGVpZ2h0ICE9PSB0aGlzLmNhY2hlZFJlY3QuaGVpZ2h0XG5cbiAgICBpZiAoIWZvcmNlVXBkYXRlICYmICF3aWR0aENoYW5nZWQgJiYgIWhlaWdodENoYW5nZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChmb3JjZVVwZGF0ZSB8fCB3aWR0aENoYW5nZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IGAke29yaWdpbmFsV2lkdGh9cHhgXG4gICAgfVxuXG4gICAgaWYgKGZvcmNlVXBkYXRlIHx8IGhlaWdodENoYW5nZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSBgJHtvcmlnaW5hbEhlaWdodH1weGBcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZVJlY3QoKVxuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gJydcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJydcbiAgfVxuXG4gIC8qKlxuICAgKiDjgrXjgqTjgrrjgZ3jga7jgoLjga7jgpLnm6PoppbjgZnjgovjgILlsZ7mgKfjga7lpInljJbjgpLopovjgosgTXV0YXRpb25PYnNlcnZlciDjgafjga9cbiAgICogQ1NTIHRyYW5zaXRpb24g44KEIGFuaW1hdGlvbiDjgavjgojjgovlr7jms5Xjga7lpInljJbjgpLlj5bjgorpgIPjgYzjgZfjgabjgZfjgb7jgYZcbiAgICog77yIY2xhc3Mg44GM5LuY44GE44Gf5pmC54K544Gn44GX44GL5ris44KM44Ga44CB6YG356e75b6M44Gu5YCk44Gr44Gq44KJ44Gq44GE77yJ44CCXG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyBjcmVhdGVPYnNlcnZlcihcbiAgICB0YXJnZXROb2RlOiBIVE1MRWxlbWVudCxcbiAgICBjYWxsYmFjazogKCkgPT4gdm9pZFxuICApOiBSZXNpemVPYnNlcnZlciB7XG4gICAgaWYgKCF0YXJnZXROb2RlKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICBgW1N0dWNrLmpzXSBDb3VsZCBub3Qgb2JzZXJ2ZSB0YXJnZXROb2RlICR7U3RyaW5nKFxuICAgICAgICAgIHRhcmdldE5vZGVcbiAgICAgICAgKX0uIFRoaXMgc2hvdWxkIGJlIEhUTUxFbGVtZW50YFxuICAgICAgKVxuICAgIH1cblxuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IFJlc2l6ZU9ic2VydmVyKCgpOiB2b2lkID0+IHtcbiAgICAgIGNhbGxiYWNrKClcbiAgICB9KVxuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlKVxuICAgIHJldHVybiBvYnNlcnZlclxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgdW53cmFwKHRhcmdldDogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gICAgY29uc3Qgd3JhcHBlciA9IHRhcmdldC5wYXJlbnROb2RlXG5cbiAgICBpZiAod3JhcHBlciBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICB3cmFwcGVyLmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCB0YXJnZXQpXG4gICAgICBjb25zdCBwYXJlbnQgPSB3cmFwcGVyLnBhcmVudE5vZGVcblxuICAgICAgaWYgKHBhcmVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgICAgIHBhcmVudC5yZW1vdmVDaGlsZCh3cmFwcGVyKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB3cmFwKHRhcmdldDogSFRNTEVsZW1lbnQsIHdyYXBwZXI6IEhUTUxFbGVtZW50KTogSFRNTEVsZW1lbnQge1xuICAgIGlmICh0YXJnZXQucGFyZW50Tm9kZSAhPT0gd3JhcHBlcikge1xuICAgICAgdGFyZ2V0Lmluc2VydEFkamFjZW50RWxlbWVudCgnYmVmb3JlYmVnaW4nLCB3cmFwcGVyKVxuICAgICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0YXJnZXQpXG4gICAgfVxuICAgIHJldHVybiB3cmFwcGVyXG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjcmVhdGVQbGFjZWhvbGRlckVsZW1lbnQodGFnTmFtZSA9ICdkaXYnKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpXG4gIH1cbn1cbiIsImltcG9ydCB0eXBlIHsgU3RpY2t5IH0gZnJvbSAnLi9zdGlja3knXG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RpY2t5TWFuYWdlciB7XG4gIHJlZ2lzdGVyKHN0aWNreTogU3RpY2t5KTogU3RpY2t5TWFuYWdlclxuICB1bnJlZ2lzdGVyKHN0aWNreTogU3RpY2t5KTogU3RpY2t5TWFuYWdlclxuICBidWxrVXBkYXRlKCk6IFN0aWNreU1hbmFnZXJcbiAgZGVzdHJveUFsbCgpOiBTdGlja3lNYW5hZ2VyXG4gIGFjdGl2YXRlKCk6IFN0aWNreU1hbmFnZXJcbiAgZGVhY3RpdmF0ZSgpOiBTdGlja3lNYW5hZ2VyXG59XG5cbmNsYXNzIFN0aWNreU1hbmFnZXJJbXBsIGltcGxlbWVudHMgU3RpY2t5TWFuYWdlciB7XG4gIHByaXZhdGUgc3RhdGljICQkaW5zdGFuY2U6IFN0aWNreU1hbmFnZXJcbiAgcHJpdmF0ZSAkJHN0aWNraWVzOiBTdGlja3lbXSA9IFtdXG4gIHByaXZhdGUgJCRhY3RpdmF0ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuICBwcml2YXRlICQkYnVsa1VwZGF0ZVJlcXVlc3RJZDogbnVtYmVyIHwgbnVsbCA9IG51bGxcbiAgcHJpdmF0ZSByZWFkb25seSAkJHdpbmRvdzogV2luZG93XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihfd2luZG93OiBXaW5kb3cpIHtcbiAgICB0aGlzLiQkd2luZG93ID0gX3dpbmRvd1xuICAgIHRoaXMuYnVsa1VwZGF0ZSA9IHRoaXMuYnVsa1VwZGF0ZS5iaW5kKHRoaXMpXG4gICAgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUgPSB0aGlzLmJ1bGtQbGFjZWhvbGRlclVwZGF0ZS5iaW5kKHRoaXMpXG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGdldEluc3RhbmNlKF93aW5kb3c6IFdpbmRvdyk6IFN0aWNreU1hbmFnZXIge1xuICAgIGlmICghU3RpY2t5TWFuYWdlckltcGwuJCRpbnN0YW5jZSkge1xuICAgICAgU3RpY2t5TWFuYWdlckltcGwuJCRpbnN0YW5jZSA9IG5ldyBTdGlja3lNYW5hZ2VySW1wbChfd2luZG93KVxuICAgIH1cbiAgICByZXR1cm4gU3RpY2t5TWFuYWdlckltcGwuJCRpbnN0YW5jZVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyKHN0aWNreTogU3RpY2t5KTogU3RpY2t5TWFuYWdlciB7XG4gICAgdGhpcy4kJHN0aWNraWVzID0gWy4uLnRoaXMuJCRzdGlja2llcywgc3RpY2t5XVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgdW5yZWdpc3RlcihzdGlja3k6IFN0aWNreSk6IFN0aWNreU1hbmFnZXIge1xuICAgIHRoaXMuJCRzdGlja2llcyA9IHRoaXMuJCRzdGlja2llcy5maWx0ZXIoaW5zdGFuY2UgPT4gaW5zdGFuY2UgIT09IHN0aWNreSlcbiAgICBpZiAodGhpcy4kJHN0aWNraWVzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgYnVsa1VwZGF0ZSgpOiBTdGlja3lNYW5hZ2VyIHtcbiAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKGZhbHNlKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgZGVzdHJveUFsbCgpOiBTdGlja3lNYW5hZ2VyIHtcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIHRoaXMuJCRzdGlja2llcykge1xuICAgICAgaW5zdGFuY2UuZGVzdHJveSgpXG4gICAgfVxuICAgIHRoaXMuJCRzdGlja2llcyA9IFtdXG4gICAgdGhpcy5kZWFjdGl2YXRlKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIGFjdGl2YXRlKCk6IFN0aWNreU1hbmFnZXIge1xuICAgIGlmICghdGhpcy4kJGFjdGl2YXRlZCAmJiB0aGlzLiQkc3RpY2tpZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy4kJHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmJ1bGtVcGRhdGUpXG4gICAgICB0aGlzLiQkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlKVxuICAgICAgdGhpcy4kJGFjdGl2YXRlZCA9IHRydWVcbiAgICB9XG4gICAgdGhpcy5idWxrVXBkYXRlKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIGRlYWN0aXZhdGUoKTogU3RpY2t5TWFuYWdlciB7XG4gICAgaWYgKHRoaXMuJCRhY3RpdmF0ZWQpIHtcbiAgICAgIHRoaXMuJCR3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5idWxrVXBkYXRlKVxuICAgICAgdGhpcy4kJHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmJ1bGtQbGFjZWhvbGRlclVwZGF0ZSlcbiAgICAgIHRoaXMuJCRhY3RpdmF0ZWQgPSBmYWxzZVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHJpdmF0ZSBidWxrUGxhY2Vob2xkZXJVcGRhdGUoKTogdm9pZCB7XG4gICAgdGhpcy5zY2hlZHVsZVVwZGF0ZSh0cnVlKVxuICB9XG5cbiAgLyoqIOabtOaWsOOBr+asoeOBruODleODrOODvOODoOOBvuOBp+OBvuOBqOOCgeOCi+OAguS6iOe0hOa4iOOBv+OBruOCguOBruOBjOOBguOCjOOBsOWPluOCiua2iOOBl+OBpue9ruOBjeaPm+OBiOOCiyAqL1xuICBwcml2YXRlIHNjaGVkdWxlVXBkYXRlKHdpdGhQbGFjZWhvbGRlcjogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCkge1xuICAgICAgdGhpcy4kJHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZClcbiAgICB9XG4gICAgdGhpcy4kJGJ1bGtVcGRhdGVSZXF1ZXN0SWQgPSB0aGlzLiQkd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShcbiAgICAgICgpOiB2b2lkID0+IHtcbiAgICAgICAgZm9yIChjb25zdCBpbnN0YW5jZSBvZiB0aGlzLiQkc3RpY2tpZXMpIHtcbiAgICAgICAgICBpZiAod2l0aFBsYWNlaG9sZGVyKSB7XG4gICAgICAgICAgICBpbnN0YW5jZS5wbGFjZWhvbGRlci51cGRhdGUoKVxuICAgICAgICAgIH1cbiAgICAgICAgICBpbnN0YW5jZS51cGRhdGUoKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRTdGlja3lNYW5hZ2VySW5zdGFuY2UgPSAoX3dpbmRvdzogV2luZG93KTogU3RpY2t5TWFuYWdlciA9PlxuICBTdGlja3lNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZShfd2luZG93KVxuIiwiaW1wb3J0IFBsYWNlaG9sZGVyIGZyb20gJy4vcGxhY2Vob2xkZXInXG5pbXBvcnQgdHlwZSB7XG4gIFBhcnRpYWxSZXF1aXJlZCxcbiAgU2VsZWN0b3JPckVsZW1lbnQsXG4gIFN0aWNreSxcbiAgU3RpY2t5T3B0aW9ucyxcbn0gZnJvbSAnLi9zdGlja3knXG5pbXBvcnQgeyBnZXRTdGlja3lNYW5hZ2VySW5zdGFuY2UsIHR5cGUgU3RpY2t5TWFuYWdlciB9IGZyb20gJy4vc3RpY2t5TWFuYWdlcidcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuL3V0aWxpdHknXG5cbnR5cGUgTWF5YmVIVE1MRWxlbWVudCA9IEhUTUxFbGVtZW50IHwgRWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWRcblxuY29uc3Qgbm9ybWFsaXplRWxlbWVudCA9IChcbiAgdmFsdWU/OiBTZWxlY3Rvck9yRWxlbWVudCxcbiAgLi4uZmFsbGJhY2tzOiBNYXliZUhUTUxFbGVtZW50W11cbik6IEhUTUxFbGVtZW50ID0+IHtcbiAgaWYgKHZhbHVlICYmIHZhbHVlIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICByZXR1cm4gdmFsdWVcbiAgfVxuXG4gIGNvbnN0IGVsZW1lbnQgPSBbdmFsdWUgJiYgZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih2YWx1ZSksIC4uLmZhbGxiYWNrc10uZmluZChcbiAgICAoaXRlbSk6IGl0ZW0gaXMgSFRNTEVsZW1lbnQgPT4gISFpdGVtICYmIGl0ZW0gaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICApXG5cbiAgaWYgKGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdbU3R1Y2stanNdIENvdWxkIG5vdCBmaW5kIEhUTUxFbGVtZW50Jylcbn1cblxuY29uc3QgY29tcHV0ZUFic29sdXRlRmxvb3IgPSAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IG51bWJlciA9PiB7XG4gIGNvbnN0IGFic29sdXRlQm90dG9tID1cbiAgICB0YXJnZXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuYm90dG9tICsgd2luZG93LnBhZ2VZT2Zmc2V0XG4gIGNvbnN0IHsgcGFkZGluZ0JvdHRvbSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGFyZ2V0KVxuICBjb25zdCBwYWRkaW5nQm90dG9tUGl4ZWxzID1cbiAgICBwYWRkaW5nQm90dG9tICE9PSBudWxsID8gcGFyc2VJbnQocGFkZGluZ0JvdHRvbSwgMTApIDogMFxuICByZXR1cm4gYWJzb2x1dGVCb3R0b20gLSBwYWRkaW5nQm90dG9tUGl4ZWxzXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0aWNreUltcGwgaW1wbGVtZW50cyBTdGlja3kge1xuICBwdWJsaWMgZWxlbWVudDogSFRNTEVsZW1lbnRcbiAgcHVibGljIG9wdGlvbnM6IFBhcnRpYWxSZXF1aXJlZDxTdGlja3lPcHRpb25zLCAnbWFyZ2luVG9wJz5cbiAgcHVibGljIHBsYWNlaG9sZGVyOiBQbGFjZWhvbGRlclxuICBwdWJsaWMgbWFyZ2luVG9wOiBudW1iZXIgPSAwXG4gIHB1YmxpYyBpc1N0aWNrVG9Cb3R0b206IGJvb2xlYW4gPSBmYWxzZVxuICBwdWJsaWMgcmVjdDogRE9NUmVjdFxuICBwdWJsaWMgZmxvb3I/OiBudW1iZXJcblxuICBwcml2YXRlICQkd3JhcHBlciE6IEhUTUxFbGVtZW50XG4gIHByaXZhdGUgJCRhZGRpdGlvbmFsVG9wPzogbnVtYmVyXG4gIHByaXZhdGUgJCRkZXN0cm95ZWQ6IGJvb2xlYW4gPSBmYWxzZVxuXG4gIHByaXZhdGUgcmVhZG9ubHkgJCRtYW5hZ2VyOiBTdGlja3lNYW5hZ2VyXG5cbiAgcHJpdmF0ZSBnZXQgaXNTdGlja3koKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9PT0gJ2ZpeGVkJ1xuICB9XG5cbiAgcHJpdmF0ZSBzZXQgaXNTdGlja3kodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodGhpcy5wbGFjZWhvbGRlcikge1xuICAgICAgdGhpcy5wbGFjZWhvbGRlci5zaG91bGRQbGFjZWhvbGQgPSB2YWx1ZVxuICAgIH1cbiAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdHVjayA9IHZhbHVlID8gdmFsdWUudG9TdHJpbmcoKSA6ICcnXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID0gdmFsdWUgPyAnZml4ZWQnIDogJydcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdmFsdWUgPyBgJHt0aGlzLnRvcH1weGAgOiAnJ1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gdmFsdWVcbiAgICAgID8gYCR7dGhpcy5wbGFjZWhvbGRlci51cGRhdGVSZWN0KCkubGVmdH1weGBcbiAgICAgIDogJydcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuY29tcHV0ZVBvc2l0aW9uVG9wRnJvbVJlY3QoKVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0IHRvcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLiQkYWRkaXRpb25hbFRvcCA/PyB0aGlzLm1hcmdpblRvcFxuICB9XG5cbiAgcHJpdmF0ZSBzZXQgdG9wKHZhbHVlOiBudW1iZXIpIHtcbiAgICB0aGlzLiQkYWRkaXRpb25hbFRvcCA9IHZhbHVlXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLnRvcCA9IHZhbHVlID8gYCR7dmFsdWV9cHhgIDogYCR7dGhpcy5tYXJnaW5Ub3B9cHhgXG4gIH1cblxuICBwcml2YXRlIGdldCB3cmFwcGVyKCk6IEhUTUxFbGVtZW50IHtcbiAgICByZXR1cm4gdGhpcy4kJHdyYXBwZXJcbiAgfVxuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgICBvcHRpb25zOiBTdGlja3lPcHRpb25zID0geyBvYnNlcnZlOiB0cnVlIH0sXG4gICAgYWN0aXZhdGU6IGJvb2xlYW4gPSB0cnVlLFxuICAgIG9uVXBkYXRlOiAoKSA9PiB2b2lkID0gbm9vcFxuICApIHtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignW1N0dWNrLWpzXSBJbnZhbGlkIGVsZW1lbnQgZ2l2ZW4nKVxuICAgIH1cbiAgICB0aGlzLiQkbWFuYWdlciA9IGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSh3aW5kb3cpLnJlZ2lzdGVyKHRoaXMpXG4gICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudFxuICAgIHRoaXMucmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgIG1hcmdpblRvcDogMCxcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfVxuICAgIHRoaXMubWFyZ2luVG9wID0gdGhpcy5vcHRpb25zLm1hcmdpblRvcCB8fCAwXG4gICAgdGhpcy5zZXRXcmFwcGVyRnJvbVNlbGVjdG9yT3JFbGVtZW50KHRoaXMub3B0aW9ucy53cmFwcGVyKVxuICAgIHRoaXMucGxhY2Vob2xkZXIgPSBuZXcgUGxhY2Vob2xkZXIoXG4gICAgICB0aGlzLmVsZW1lbnQsXG4gICAgICB0aGlzLm9wdGlvbnMub2JzZXJ2ZSA/PyB0cnVlLFxuICAgICAgb25VcGRhdGVcbiAgICApXG4gICAgdGhpcy5lbGVtZW50LmRhdGFzZXQuc3R1Y2sgPSAnJ1xuXG4gICAgaWYgKGFjdGl2YXRlKSB7XG4gICAgICB0aGlzLiQkbWFuYWdlci5hY3RpdmF0ZSgpXG4gICAgfVxuXG4gICAgdGhpcy5wbGFjZWhvbGRlci5zaG91bGRQbGFjZWhvbGQgPSB0aGlzLmlzU3RpY2t5XG4gIH1cblxuICBwcml2YXRlIHNldFdyYXBwZXJGcm9tU2VsZWN0b3JPckVsZW1lbnQoXG4gICAgc2VsZWN0b3JPckVsZW1lbnQ/OiBTZWxlY3Rvck9yRWxlbWVudFxuICApOiB2b2lkIHtcbiAgICBpZiAoIShkb2N1bWVudC5ib2R5IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICAnW1N0dWNrLmpzXSBkb2N1bWVudC5ib2R5IGlzIG5vdCBIVE1MRWxlbWVudCBpbiB0aGlzIGVudmlyb25tZW50J1xuICAgICAgKVxuICAgIH1cbiAgICBjb25zdCBwYXJlbnQgPSAodGhpcy5wbGFjZWhvbGRlcj8uZWxlbWVudCB8fCB0aGlzLmVsZW1lbnQpLnBhcmVudEVsZW1lbnRcbiAgICB0aGlzLiQkd3JhcHBlciA9IG5vcm1hbGl6ZUVsZW1lbnQoc2VsZWN0b3JPckVsZW1lbnQsIHBhcmVudCwgZG9jdW1lbnQuYm9keSlcbiAgICB0aGlzLmZsb29yID0gY29tcHV0ZUFic29sdXRlRmxvb3IodGhpcy4kJHdyYXBwZXIpXG4gICAgdGhpcy5vcHRpb25zLndyYXBwZXIgPSB0aGlzLiQkd3JhcHBlclxuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuJCRkZXN0cm95ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLiQkZGVzdHJveWVkID0gdHJ1ZVxuICAgIHRoaXMuaXNTdGlja3kgPSBmYWxzZVxuICAgIHRoaXMucGxhY2Vob2xkZXIuZGVzdHJveSgpXG4gICAgdGhpcy4kJG1hbmFnZXIudW5yZWdpc3Rlcih0aGlzKVxuICB9XG5cbiAgcHJpdmF0ZSBjb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdChcbiAgICByZWN0OiBET01SZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICk6IHZvaWQge1xuICAgIHRoaXMucmVjdCA9IHJlY3RcbiAgICB0aGlzLmZsb29yID0gY29tcHV0ZUFic29sdXRlRmxvb3IodGhpcy53cmFwcGVyKVxuXG4gICAgY29uc3QgcmVsYXRpdmVGbG9vciA9ICh0aGlzLmZsb29yIHx8IDApIC0gd2luZG93LnBhZ2VZT2Zmc2V0XG5cbiAgICBpZiAodGhpcy5yZWN0LmJvdHRvbSA+PSByZWxhdGl2ZUZsb29yICYmICF0aGlzLmlzU3RpY2tUb0JvdHRvbSkge1xuICAgICAgdGhpcy50b3AgPSByZWxhdGl2ZUZsb29yIC0gdGhpcy5yZWN0LmhlaWdodFxuICAgICAgdGhpcy5pc1N0aWNrVG9Cb3R0b20gPSB0cnVlXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNTdGlja1RvQm90dG9tKSB7XG4gICAgICAvLyBtYXJnaW5Ub3Ag44Gv44K544K/44OD44Kv44G444Gu5Ye65YWl44KK44Gn5aSJ44KP44KL44Gu44Gn44CB44Gd44Gu6YO95bqm6L+95b6T44GV44Gb44KL44CCXG4gICAgICAvLyDjgZPjgZPjgafov5TjgZfjgabjgZfjgb7jgYbjgajjgIHkuIrjgavnqY3jgb7jgozjgabjgYTjgZ8gc3RpY2t5IOOBjOa2iOOBiOOBpuOCglxuICAgICAgLy8g5YaN6KiI566X44GV44KM44GfIG1hcmdpblRvcCDjgYwgc3R5bGUudG9wIOOBq+WPjeaYoOOBleOCjOOBquOBhFxuICAgICAgaWYgKHRoaXMuJCRhZGRpdGlvbmFsVG9wICE9PSB0aGlzLm1hcmdpblRvcCkge1xuICAgICAgICB0aGlzLnRvcCA9IHRoaXMubWFyZ2luVG9wXG4gICAgICB9XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWN0LnRvcCA+PSB0aGlzLm1hcmdpblRvcCkge1xuICAgICAgdGhpcy50b3AgPSB0aGlzLm1hcmdpblRvcFxuICAgICAgdGhpcy5pc1N0aWNrVG9Cb3R0b20gPSBmYWxzZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMucmVjdC50b3AgPCB0aGlzLm1hcmdpblRvcCkge1xuICAgICAgdGhpcy50b3AgPSByZWxhdGl2ZUZsb29yIC0gdGhpcy5yZWN0LmhlaWdodFxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoKTogdm9pZCB7XG4gICAgY29uc3QgcGxhY2Vob2xkZXJSZWN0ID0gdGhpcy5wbGFjZWhvbGRlci5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG5cbiAgICBpZiAoIXRoaXMuaXNTdGlja3kgJiYgdGhpcy5tYXJnaW5Ub3AgPiBwbGFjZWhvbGRlclJlY3QudG9wKSB7XG4gICAgICB0aGlzLmlzU3RpY2t5ID0gdHJ1ZVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNTdGlja3kpIHtcbiAgICAgIGlmIChwbGFjZWhvbGRlclJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICAgIHRoaXMuaXNTdGlja3kgPSBmYWxzZVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cblxuICAgICAgdGhpcy5yZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgICBpZiAodGhpcy5yZWN0LmxlZnQgIT09IHBsYWNlaG9sZGVyUmVjdC5sZWZ0KSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5zdHlsZS5sZWZ0ID0gYCR7cGxhY2Vob2xkZXJSZWN0LmxlZnR9cHhgXG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29tcHV0ZVBvc2l0aW9uVG9wRnJvbVJlY3QodGhpcy5yZWN0KVxuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBTdGlja3kgfSBmcm9tICcuL3N0aWNreSdcbmltcG9ydCB7IGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSB9IGZyb20gJy4vc3RpY2t5TWFuYWdlcidcbmltcG9ydCB0eXBlIHsgU3R1Y2sgfSBmcm9tICcuL3N0dWNrJ1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0dWNrTWFuYWdlciB7XG4gIHN0aWNraWVzOiByZWFkb25seSBTdGlja3lbXVxuICBzdGlja3lFbGVtZW50czogcmVhZG9ubHkgSFRNTEVsZW1lbnRbXVxuICBzdGFja2luZ1N0aWNraWVzOiByZWFkb25seSBTdGlja3lbXVxuICByZWdpc3RlcihzdHVjazogU3R1Y2spOiBTdHVja01hbmFnZXJcbiAgdW5yZWdpc3RlcihzdHVjazogU3R1Y2spOiBTdHVja01hbmFnZXJcbiAgYWRkU3RpY2tpZXMoc3RhY2tpbmc6IGJvb2xlYW4sIC4uLnN0aWNraWVzOiBTdGlja3lbXSk6IFN0dWNrTWFuYWdlclxuICBkZXN0cm95U3RpY2tpZXMoLi4uc3RpY2tpZXM6IFN0aWNreVtdKTogU3R1Y2tNYW5hZ2VyXG4gIGRlc3Ryb3lBbGwoKTogU3R1Y2tNYW5hZ2VyXG4gIHVwZGF0ZSgpOiBTdHVja01hbmFnZXJcbn1cblxuY2xhc3MgU3R1Y2tNYW5hZ2VySW1wbCBpbXBsZW1lbnRzIFN0dWNrTWFuYWdlciB7XG4gIHByaXZhdGUgc3RhdGljICQkaW5zdGFuY2U6IFN0dWNrTWFuYWdlclxuICBwcml2YXRlICQkc3R1Y2tzOiBTdHVja1tdID0gW11cbiAgcHJpdmF0ZSAkJHN0aWNraWVzOiBTdGlja3lbXSA9IFtdXG4gIHByaXZhdGUgJCRzdGFja2luZ1N0aWNraWVzOiBTdGlja3lbXSA9IFtdXG4gIHByaXZhdGUgJCR3aW5kb3c6IFdpbmRvd1xuXG4gIHByaXZhdGUgY29uc3RydWN0b3IoX3dpbmRvdzogV2luZG93KSB7XG4gICAgdGhpcy4kJHdpbmRvdyA9IF93aW5kb3dcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoX3dpbmRvdzogV2luZG93KTogU3R1Y2tNYW5hZ2VyIHtcbiAgICBpZiAoIVN0dWNrTWFuYWdlckltcGwuJCRpbnN0YW5jZSkge1xuICAgICAgU3R1Y2tNYW5hZ2VySW1wbC4kJGluc3RhbmNlID0gbmV3IFN0dWNrTWFuYWdlckltcGwoX3dpbmRvdylcbiAgICB9XG4gICAgcmV0dXJuIFN0dWNrTWFuYWdlckltcGwuJCRpbnN0YW5jZVxuICB9XG5cbiAgcHVibGljIHJlZ2lzdGVyKHN0dWNrOiBTdHVjayk6IFN0dWNrTWFuYWdlciB7XG4gICAgdGhpcy4kJHN0dWNrcyA9IFsuLi50aGlzLiQkc3R1Y2tzLCBzdHVja11cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIHVucmVnaXN0ZXIoc3R1Y2s6IFN0dWNrKTogU3R1Y2tNYW5hZ2VyIHtcbiAgICB0aGlzLmRlc3Ryb3lTdGlja2llcyguLi5zdHVjay5zdGlja2llcylcbiAgICB0aGlzLiQkc3R1Y2tzID0gdGhpcy4kJHN0dWNrcy5maWx0ZXIoaW5zdGFuY2UgPT4gaW5zdGFuY2UgIT09IHN0dWNrKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgZ2V0IHN0aWNraWVzKCk6IHJlYWRvbmx5IFN0aWNreVtdIHtcbiAgICByZXR1cm4gdGhpcy4kJHN0aWNraWVzXG4gIH1cblxuICBwdWJsaWMgZ2V0IHN0aWNreUVsZW1lbnRzKCk6IHJlYWRvbmx5IEhUTUxFbGVtZW50W10ge1xuICAgIHJldHVybiB0aGlzLiQkc3RpY2tpZXMubWFwKHN0aWNreSA9PiBzdGlja3kuZWxlbWVudClcbiAgfVxuXG4gIHB1YmxpYyBnZXQgc3RhY2tpbmdTdGlja2llcygpOiByZWFkb25seSBTdGlja3lbXSB7XG4gICAgcmV0dXJuIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzXG4gIH1cblxuICBwdWJsaWMgYWRkU3RpY2tpZXMoc3RhY2tpbmc6IGJvb2xlYW4sIC4uLnN0aWNraWVzOiBTdGlja3lbXSk6IFN0dWNrTWFuYWdlciB7XG4gICAgdGhpcy4kJHN0aWNraWVzID0gWy4uLnRoaXMuJCRzdGlja2llcywgLi4uc3RpY2tpZXNdXG4gICAgaWYgKHN0YWNraW5nKSB7XG4gICAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IFsuLi50aGlzLiQkc3RhY2tpbmdTdGlja2llcywgLi4uc3RpY2tpZXNdXG4gICAgfVxuICAgIGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSh0aGlzLiQkd2luZG93KS5hY3RpdmF0ZSgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95U3RpY2tpZXMoLi4uc3RpY2tpZXM6IFN0aWNreVtdKTogU3R1Y2tNYW5hZ2VyIHtcbiAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIHN0aWNraWVzKSB7XG4gICAgICBpbnN0YW5jZS5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy4kJHN0aWNraWVzID0gdGhpcy4kJHN0aWNraWVzLmZpbHRlcihcbiAgICAgIHN0aWNreSA9PiAhc3RpY2tpZXMuaW5jbHVkZXMoc3RpY2t5KVxuICAgIClcbiAgICB0aGlzLiQkc3RhY2tpbmdTdGlja2llcyA9IHRoaXMuJCRzdGFja2luZ1N0aWNraWVzLmZpbHRlcihcbiAgICAgIHN0aWNreSA9PiAhc3RpY2tpZXMuaW5jbHVkZXMoc3RpY2t5KVxuICAgIClcbiAgICBpZiAodGhpcy4kJHN0YWNraW5nU3RpY2tpZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy51cGRhdGUoKVxuICAgIH1cbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgLyoqIOeZu+mMsua4iOOBv+OBriBTdHVjayDjgaggU3RpY2t5IOOCkuOBmeOBueOBpuegtOajhOOBl+OAgeOCt+ODs+OCsOODq+ODiOODs+OCkuWIneacn+eKtuaFi+OBq+aIu+OBmSAqL1xuICBwdWJsaWMgZGVzdHJveUFsbCgpOiBTdHVja01hbmFnZXIge1xuICAgIHRoaXMuZGVzdHJveVN0aWNraWVzKC4uLnRoaXMuJCRzdGlja2llcylcbiAgICB0aGlzLiQkc3R1Y2tzID0gW11cbiAgICB0aGlzLiQkc3RpY2tpZXMgPSBbXVxuICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gW11cbiAgICBnZXRTdGlja3lNYW5hZ2VySW5zdGFuY2UodGhpcy4kJHdpbmRvdykuZGVzdHJveUFsbCgpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoKTogU3R1Y2tNYW5hZ2VyIHtcbiAgICBjb25zdCBzb3J0ZWQgPSBBcnJheS5mcm9tKG5ldyBTZXQodGhpcy5zdGFja2luZ1N0aWNraWVzKSlcbiAgICAgIC5tYXAoaW5zdGFuY2UgPT4gKHtcbiAgICAgICAgaW5zdGFuY2UsXG4gICAgICAgIHJlY3Q6IGluc3RhbmNlLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKSxcbiAgICAgIH0pKVxuICAgICAgLnNvcnQoKGJlZm9yZSwgYWZ0ZXIpID0+IGJlZm9yZS5yZWN0LnRvcCAtIGFmdGVyLnJlY3QudG9wKVxuXG4gICAgLy8g5LiK44Gr44GC44KL44KC44Gu44GL44KJ6aCG44Gr44CB55u05YmN44Gu6KaB57Sg44Gu5LiL56uv44KS5qyh44Gu6KaB57Sg44GuIG1hcmdpblRvcCDjgavnqY3jgoBcbiAgICBsZXQgY2VpbGluZyA9IDBcbiAgICBjb25zdCBzdGFja2luZzogU3RpY2t5W10gPSBbXVxuICAgIGZvciAoY29uc3QgeyBpbnN0YW5jZSB9IG9mIHNvcnRlZCkge1xuICAgICAgaW5zdGFuY2UubWFyZ2luVG9wID0gaW5zdGFuY2Uub3B0aW9ucy5tYXJnaW5Ub3AgKyBjZWlsaW5nXG4gICAgICBjZWlsaW5nID0gaW5zdGFuY2UucmVjdC5oZWlnaHQgKyBpbnN0YW5jZS5tYXJnaW5Ub3BcbiAgICAgIHN0YWNraW5nLnB1c2goaW5zdGFuY2UpXG4gICAgfVxuICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gc3RhY2tpbmdcblxuICAgIGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSh0aGlzLiQkd2luZG93KS5idWxrVXBkYXRlKClcblxuICAgIC8vIEFycmF5LnByb3RvdHlwZS5zb3J0IOOBryBFUzIwMTkg5Lul6ZmN44CB5a6J5a6a44K944O844OI44GM5L+d6Ki844GV44KM44Gm44GE44KLXG4gICAgdGhpcy4kJHN0aWNraWVzID0gWy4uLnRoaXMuc3RpY2tpZXNdLnNvcnQoXG4gICAgICAoYmVmb3JlLCBhZnRlcikgPT5cbiAgICAgICAgYmVmb3JlLnBsYWNlaG9sZGVyLmNhY2hlZFJlY3QudG9wIC0gYWZ0ZXIucGxhY2Vob2xkZXIuY2FjaGVkUmVjdC50b3BcbiAgICApXG5cbiAgICByZXR1cm4gdGhpc1xuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRTdHVja01hbmFnZXJJbnN0YW5jZSA9IChfd2luZG93OiBXaW5kb3cpOiBTdHVja01hbmFnZXIgPT5cbiAgU3R1Y2tNYW5hZ2VySW1wbC5nZXRJbnN0YW5jZShfd2luZG93KVxuIiwiaW1wb3J0IHR5cGUgeyBTdGlja3ksIFN0aWNreU9wdGlvbnMgfSBmcm9tICcuL3N0aWNreSdcbmltcG9ydCBTdGlja3lJbXBsIGZyb20gJy4vc3RpY2t5SW1wbCdcbmltcG9ydCB0eXBlIHsgRWxlbWVudFNvdXJjZSwgU3RpY2t5U2V0dGluZywgU3R1Y2sgfSBmcm9tICcuL3N0dWNrJ1xuaW1wb3J0IHsgZ2V0U3R1Y2tNYW5hZ2VySW5zdGFuY2UsIHR5cGUgU3R1Y2tNYW5hZ2VyIH0gZnJvbSAnLi9zdHVja01hbmFnZXInXG5cbmNvbnN0IGdldEVsZW1lbnRzQXJyYXlGcm9tU2V0dGluZyA9ICh7XG4gIHNlbGVjdG9yLFxuICBlbGVtZW50LFxufTogRWxlbWVudFNvdXJjZSk6IEhUTUxFbGVtZW50W10gPT4ge1xuICBpZiAoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgPyBbZWxlbWVudF0gOiBBcnJheS5mcm9tKGVsZW1lbnQpXG4gIH1cbiAgaWYgKHNlbGVjdG9yKSB7XG4gICAgLy8gcXVlcnlTZWxlY3RvckFsbCDjga8gU1ZHRWxlbWVudCDjgarjganjgoLmi77jgYbjgZ/jgoEgSFRNTEVsZW1lbnQg44Gr57We44KLXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcikpLmZpbHRlcihcbiAgICAgIChtYXliZUhUTUxFbGVtZW50KTogbWF5YmVIVE1MRWxlbWVudCBpcyBIVE1MRWxlbWVudCA9PlxuICAgICAgICBtYXliZUhUTUxFbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnRcbiAgICApXG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdbU3R1Y2suanNdIE5vIHNlbGVjdG9yLCBlbGVtZW50IG5vciBlbGVtZW50cyBpbiBzZXR0aW5nJylcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3R1Y2tJbXBsIGltcGxlbWVudHMgU3R1Y2sge1xuICBwcml2YXRlIHJlYWRvbmx5ICQkZGVmYXVsdE9wdGlvbnM6IFN0aWNreU9wdGlvbnNcbiAgcHJpdmF0ZSByZWFkb25seSAkJG1hbmFnZXI6IFN0dWNrTWFuYWdlclxuICBwcml2YXRlICQkaW5zdGFuY2VzOiBTdGlja3lbXSA9IFtdXG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHNldHRpbmdzOiBTdGlja3lTZXR0aW5nW10gfCBTdGlja3lTZXR0aW5nID0gW10sXG4gICAgZGVmYXVsdE9wdGlvbnM6IFN0aWNreU9wdGlvbnMgPSB7IG9ic2VydmU6IHRydWUgfSxcbiAgICBzaGFyZWRTdGFja2luZzogYm9vbGVhbiA9IHRydWVcbiAgKSB7XG4gICAgdGhpcy4kJG1hbmFnZXIgPSBnZXRTdHVja01hbmFnZXJJbnN0YW5jZSh3aW5kb3cpLnJlZ2lzdGVyKHRoaXMpXG4gICAgdGhpcy4kJGRlZmF1bHRPcHRpb25zID0gZGVmYXVsdE9wdGlvbnNcbiAgICB0aGlzLmNyZWF0ZShzZXR0aW5ncywgc2hhcmVkU3RhY2tpbmcpXG4gIH1cblxuICBwdWJsaWMgY3JlYXRlKFxuICAgIHNvdXJjZTogUmVhZG9ubHk8U3RpY2t5U2V0dGluZ1tdIHwgU3RpY2t5U2V0dGluZz4sXG4gICAgc2hhcmVkU3RhY2tpbmc6IGJvb2xlYW4gPSB0cnVlXG4gICk6IFN0aWNreVtdIHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IEFycmF5LmlzQXJyYXkoc291cmNlKSA/IHNvdXJjZSA6IFtzb3VyY2VdXG4gICAgY29uc3QgcmVnaXN0ZXJlZCA9IHNldHRpbmdzLnJlZHVjZTxTdGlja3lbXT4oXG4gICAgICAoYWNjdW11bGF0b3IsIHNldHRpbmcpOiBTdGlja3lbXSA9PlxuICAgICAgICBhY2N1bXVsYXRvci5jb25jYXQodGhpcy5yZWdpc3RlcihzZXR0aW5nLCBzaGFyZWRTdGFja2luZykpLFxuICAgICAgW11cbiAgICApXG4gICAgaWYgKHJlZ2lzdGVyZWQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgdGhpcy4kJG1hbmFnZXIudXBkYXRlKClcbiAgICByZXR1cm4gcmVnaXN0ZXJlZFxuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlcihcbiAgICB7IHNlbGVjdG9yLCBlbGVtZW50LCAuLi5vcHRpb25zIH06IFN0aWNreVNldHRpbmcsXG4gICAgc2hhcmVkU3RhY2tpbmc6IGJvb2xlYW4gPSB0cnVlXG4gICk6IFN0aWNreVtdIHtcbiAgICBjb25zdCByZWdpc3RlcmVkSW5zdGFuY2VFbGVtZW50cyA9IHRoaXMuJCRtYW5hZ2VyLnN0aWNreUVsZW1lbnRzXG4gICAgY29uc3Qgc3RpY2tpZXMgPSBnZXRFbGVtZW50c0FycmF5RnJvbVNldHRpbmcoeyBzZWxlY3RvciwgZWxlbWVudCB9KVxuICAgICAgLmZpbHRlcih0YXJnZXQgPT4gIXJlZ2lzdGVyZWRJbnN0YW5jZUVsZW1lbnRzLmluY2x1ZGVzKHRhcmdldCkpXG4gICAgICAubWFwKFxuICAgICAgICAobmV3RWxlbWVudCk6IFN0aWNreSA9PlxuICAgICAgICAgIG5ldyBTdGlja3lJbXBsKFxuICAgICAgICAgICAgbmV3RWxlbWVudCxcbiAgICAgICAgICAgIHsgLi4udGhpcy4kJGRlZmF1bHRPcHRpb25zLCAuLi5vcHRpb25zIH0sXG4gICAgICAgICAgICBmYWxzZSxcbiAgICAgICAgICAgICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgdGhpcy4kJG1hbmFnZXIudXBkYXRlKClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApXG4gICAgICApXG5cbiAgICB0aGlzLiQkbWFuYWdlci5hZGRTdGlja2llcyhzaGFyZWRTdGFja2luZywgLi4uc3RpY2tpZXMpXG4gICAgdGhpcy4kJGluc3RhbmNlcyA9IFsuLi50aGlzLiQkaW5zdGFuY2VzLCAuLi5zdGlja2llc11cbiAgICByZXR1cm4gc3RpY2tpZXNcbiAgfVxuXG4gIHB1YmxpYyBnZXQgc3RpY2tpZXMoKTogcmVhZG9ubHkgU3RpY2t5W10ge1xuICAgIHJldHVybiB0aGlzLiQkaW5zdGFuY2VzXG4gIH1cblxuICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLiQkbWFuYWdlci51bnJlZ2lzdGVyKHRoaXMpXG4gICAgdGhpcy4kJGluc3RhbmNlcyA9IFtdXG4gIH1cbn1cbiIsImltcG9ydCBQbGFjZWhvbGRlciBmcm9tICcuL3BsYWNlaG9sZGVyJ1xuaW1wb3J0IFN0aWNreSBmcm9tICcuL3N0aWNreUltcGwnXG5pbXBvcnQgU3R1Y2sgZnJvbSAnLi9zdHVja0ltcGwnXG5cbmV4cG9ydCB7IFBsYWNlaG9sZGVyLCBTdGlja3ksIFN0dWNrIH1cbmV4cG9ydCBkZWZhdWx0IFN0dWNrXG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0NBQUEsSUFBYSxhQUFtQixDQUFDOzs7Q0NFakMsSUFBcUIsY0FBckIsTUFBcUIsWUFBWTtFQVcvQixJQUFXLGtCQUEyQjtHQUNwQyxPQUFPLENBQUMsS0FBSyxtQkFBbUIsS0FBSztFQUN2QztFQUVBLElBQVcsZ0JBQWdCLE9BQWdCO0dBQ3pDLElBQUksS0FBSyxvQkFBb0IsT0FDM0I7R0FHRixLQUFLLG9CQUFvQjtHQUN6QixLQUFLLE9B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