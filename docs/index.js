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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJuYW1lcyI6W10sInNvdXJjZXMiOlsiLi4vc3JjL3V0aWxpdHkudHMiLCIuLi9zcmMvcGxhY2Vob2xkZXIudHMiLCIuLi9zcmMvc3RpY2t5TWFuYWdlci50cyIsIi4uL3NyYy9zdGlja3lJbXBsLnRzIiwiLi4vc3JjL3N0dWNrTWFuYWdlci50cyIsIi4uL3NyYy9zdHVja0ltcGwudHMiLCIuLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IG5vb3AgPSAoKTogdm9pZCA9PiB7fVxuIiwiaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbGl0eSdcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGxhY2Vob2xkZXIge1xuICBwdWJsaWMgb3JpZ2luYWw6IEhUTUxFbGVtZW50XG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudFxuICBwdWJsaWMgY2FjaGVkUmVjdDogRE9NUmVjdFxuICBwdWJsaWMgb2JzZXJ2ZXI/OiBNdXRhdGlvbk9ic2VydmVyXG4gIHB1YmxpYyBvblVwZGF0ZTogKCkgPT4gdm9pZFxuICBwdWJsaWMgaW5pdGlhbENvbXB1dGVkU3R5bGVzOiBDU1NTdHlsZURlY2xhcmF0aW9uXG4gIHB1YmxpYyBpbml0aWFsbHlIaWRkZW46IGJvb2xlYW5cbiAgcHJpdmF0ZSAkJHNob3VsZFBsYWNlaG9sZDogYm9vbGVhbiA9IHRydWVcbiAgcHJpdmF0ZSAkJGRlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgcHVibGljIGdldCBzaG91bGRQbGFjZWhvbGQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICF0aGlzLmluaXRpYWxseUhpZGRlbiAmJiB0aGlzLiQkc2hvdWxkUGxhY2Vob2xkXG4gIH1cblxuICBwdWJsaWMgc2V0IHNob3VsZFBsYWNlaG9sZCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLnNob3VsZFBsYWNlaG9sZCA9PT0gdmFsdWUpIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHRoaXMuJCRzaG91bGRQbGFjZWhvbGQgPSB2YWx1ZVxuICAgIHRoaXMudXBkYXRlKHRydWUpXG4gIH1cblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudDogSFRNTEVsZW1lbnQsXG4gICAgb2JzZXJ2ZTogYm9vbGVhbiA9IHRydWUsXG4gICAgb25VcGRhdGU6ICgpID0+IHZvaWQgPSBub29wXG4gICkge1xuICAgIHRoaXMub3JpZ2luYWwgPSBlbGVtZW50XG4gICAgdGhpcy5vblVwZGF0ZSA9IHR5cGVvZiBvblVwZGF0ZSA9PT0gJ2Z1bmN0aW9uJyA/IG9uVXBkYXRlIDogbm9vcFxuXG4gICAgdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLm9yaWdpbmFsKVxuICAgIHRoaXMuaW5pdGlhbGx5SGlkZGVuID0gdGhpcy5pbml0aWFsQ29tcHV0ZWRTdHlsZXMuZGlzcGxheSA9PT0gJ25vbmUnXG5cbiAgICBpZiAodGhpcy5pbml0aWFsbHlIaWRkZW4pIHtcbiAgICAgIHRoaXMuZXhlY1doaWxlU3R1Y2tpbmcoKCk6IHZvaWQgPT4ge1xuICAgICAgICB0aGlzLmluaXRpYWxDb21wdXRlZFN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMub3JpZ2luYWwpXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRoaXMuZWxlbWVudCA9IFBsYWNlaG9sZGVyLmNyZWF0ZVBsYWNlaG9sZGVyRWxlbWVudCgpXG4gICAgdGhpcy5hcHBseUluaXRpYWxTdHlsZXMoKVxuICAgIFBsYWNlaG9sZGVyLndyYXAodGhpcy5vcmlnaW5hbCwgdGhpcy5lbGVtZW50KVxuICAgIHRoaXMuY2FjaGVkUmVjdCA9IHRoaXMudXBkYXRlUmVjdCgpXG5cbiAgICBpZiAob2JzZXJ2ZSkge1xuICAgICAgdGhpcy5vYnNlcnZlciA9IFBsYWNlaG9sZGVyLmNyZWF0ZU9ic2VydmVyKHRoaXMub3JpZ2luYWwsICgpOiB2b2lkID0+XG4gICAgICAgIHRoaXMudXBkYXRlKClcbiAgICAgIClcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgdXBkYXRlKGZvcmNlVXBkYXRlOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICBpZiAodGhpcy4kJGRlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIGlmICh0aGlzLnNob3VsZFBsYWNlaG9sZCkge1xuICAgICAgdGhpcy5hcHBseVN0eWxlcyhmb3JjZVVwZGF0ZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW1vdmVTdHlsZXMoKVxuICAgIH1cbiAgICB0aGlzLm9uVXBkYXRlKClcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGVSZWN0KCk6IERPTVJlY3Qge1xuICAgIHRoaXMuY2FjaGVkUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgIGlmICh0aGlzLmluaXRpYWxseUhpZGRlbikge1xuICAgICAgdGhpcy5leGVjV2hpbGVTdHVja2luZygoKTogdm9pZCA9PiB7XG4gICAgICAgIHRoaXMuY2FjaGVkUmVjdCA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKVxuICAgICAgfSlcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY2FjaGVkUmVjdFxuICB9XG5cbiAgcHVibGljIGRlc3Ryb3koKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuJCRkZXN0cm95ZWQpIHtcbiAgICAgIHJldHVyblxuICAgIH1cbiAgICB0aGlzLiQkZGVzdHJveWVkID0gdHJ1ZVxuICAgIGlmICh0aGlzLm9ic2VydmVyKSB7XG4gICAgICB0aGlzLm9ic2VydmVyLmRpc2Nvbm5lY3QoKVxuICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJcbiAgICB9XG4gICAgUGxhY2Vob2xkZXIudW53cmFwKHRoaXMub3JpZ2luYWwpXG4gIH1cblxuICBwcml2YXRlIGV4ZWNXaGlsZVN0dWNraW5nKGV4ZWN1dGU6ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMub3JpZ2luYWwuZGF0YXNldC5zdHVja1xuICAgIHRoaXMub3JpZ2luYWwuZGF0YXNldC5zdHVjayA9ICd0cnVlJ1xuICAgIGV4ZWN1dGUoKVxuICAgIHRoaXMub3JpZ2luYWwuZGF0YXNldC5zdHVjayA9IHN0YXRlXG4gIH1cblxuICBwcml2YXRlIGFwcGx5SW5pdGlhbFN0eWxlcygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzIHx8IHRoaXMuaW5pdGlhbGx5SGlkZGVuKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLm1hcmdpbiA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLm1hcmdpblxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5taW5XaWR0aCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLm1pbldpZHRoXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLm1pbkhlaWdodCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLm1pbkhlaWdodFxuICAgIHRoaXMuZWxlbWVudC5zdHlsZS53aWR0aCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLndpZHRoXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IHRoaXMuaW5pdGlhbENvbXB1dGVkU3R5bGVzLmhlaWdodFxuICB9XG5cbiAgcHJpdmF0ZSBhcHBseVN0eWxlcyhmb3JjZVVwZGF0ZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgY29uc3QgeyB3aWR0aDogb3JpZ2luYWxXaWR0aCwgaGVpZ2h0OiBvcmlnaW5hbEhlaWdodCB9ID1cbiAgICAgIHRoaXMub3JpZ2luYWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICBjb25zdCB3aWR0aENoYW5nZWQgPSBvcmlnaW5hbFdpZHRoICE9PSB0aGlzLmNhY2hlZFJlY3Qud2lkdGhcbiAgICBjb25zdCBoZWlnaHRDaGFuZ2VkID0gb3JpZ2luYWxIZWlnaHQgIT09IHRoaXMuY2FjaGVkUmVjdC5oZWlnaHRcblxuICAgIGlmICghZm9yY2VVcGRhdGUgJiYgIXdpZHRoQ2hhbmdlZCAmJiAhaGVpZ2h0Q2hhbmdlZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKGZvcmNlVXBkYXRlIHx8IHdpZHRoQ2hhbmdlZCkge1xuICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLndpZHRoID0gYCR7b3JpZ2luYWxXaWR0aH1weGBcbiAgICB9XG5cbiAgICBpZiAoZm9yY2VVcGRhdGUgfHwgaGVpZ2h0Q2hhbmdlZCkge1xuICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmhlaWdodCA9IGAke29yaWdpbmFsSGVpZ2h0fXB4YFxuICAgIH1cblxuICAgIHRoaXMudXBkYXRlUmVjdCgpXG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVN0eWxlcygpOiB2b2lkIHtcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUud2lkdGggPSAnJ1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS5oZWlnaHQgPSAnJ1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgY3JlYXRlT2JzZXJ2ZXIoXG4gICAgdGFyZ2V0Tm9kZTogSFRNTEVsZW1lbnQsXG4gICAgY2FsbGJhY2s6ICgpID0+IHZvaWRcbiAgKTogTXV0YXRpb25PYnNlcnZlciB7XG4gICAgaWYgKCF0YXJnZXROb2RlKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgICBgW1N0dWNrLmpzXSBDb3VsZCBub3QgY3JlYXRlIG11dGF0aW9uIG9ic2VydmVyIG9uIHRhcmdldE5vZGUgJHtTdHJpbmcoXG4gICAgICAgICAgdGFyZ2V0Tm9kZVxuICAgICAgICApfS4gVGhpcyBzaG91bGQgYmUgSFRNTEVsZW1lbnRgXG4gICAgICApXG4gICAgfVxuXG4gICAgY29uc3QgZGV0ZWN0U2l6ZU11dGF0aW9uID0gKHsgdHlwZSB9OiBNdXRhdGlvblJlY29yZCk6IGJvb2xlYW4gPT5cbiAgICAgIHR5cGUgPT09ICdjaGlsZExpc3QnIHx8IHR5cGUgPT09ICdhdHRyaWJ1dGVzJ1xuXG4gICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihcbiAgICAgIChtdXRhdGlvbnM6IHJlYWRvbmx5IE11dGF0aW9uUmVjb3JkW10pOiB2b2lkID0+IHtcbiAgICAgICAgY29uc3QgaXNNdXRhdGVkID0gbXV0YXRpb25zLnNvbWUoZGV0ZWN0U2l6ZU11dGF0aW9uKVxuICAgICAgICBpZiAoaXNNdXRhdGVkKSB7XG4gICAgICAgICAgY2FsbGJhY2soKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgKVxuXG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlLCB7XG4gICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgYXR0cmlidXRlRmlsdGVyOiBbJ3N0eWxlJywgJ2NsYXNzJ10sXG4gICAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgIH0pXG4gICAgcmV0dXJuIG9ic2VydmVyXG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyB1bndyYXAodGFyZ2V0OiBIVE1MRWxlbWVudCk6IEhUTUxFbGVtZW50IHtcbiAgICBjb25zdCB3cmFwcGVyID0gdGFyZ2V0LnBhcmVudE5vZGVcblxuICAgIGlmICh3cmFwcGVyIGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgIHdyYXBwZXIuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmViZWdpbicsIHRhcmdldClcbiAgICAgIGNvbnN0IHBhcmVudCA9IHdyYXBwZXIucGFyZW50Tm9kZVxuXG4gICAgICBpZiAocGFyZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgcGFyZW50LnJlbW92ZUNoaWxkKHdyYXBwZXIpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXRcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIHdyYXAodGFyZ2V0OiBIVE1MRWxlbWVudCwgd3JhcHBlcjogSFRNTEVsZW1lbnQpOiBIVE1MRWxlbWVudCB7XG4gICAgaWYgKHRhcmdldC5wYXJlbnROb2RlICE9PSB3cmFwcGVyKSB7XG4gICAgICB0YXJnZXQuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KCdiZWZvcmViZWdpbicsIHdyYXBwZXIpXG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKHRhcmdldClcbiAgICB9XG4gICAgcmV0dXJuIHdyYXBwZXJcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGNyZWF0ZVBsYWNlaG9sZGVyRWxlbWVudCh0YWdOYW1lID0gJ2RpdicpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSlcbiAgfVxufVxuIiwiaW1wb3J0IHR5cGUgeyBTdGlja3kgfSBmcm9tICcuL3N0aWNreSdcblxuZXhwb3J0IGludGVyZmFjZSBTdGlja3lNYW5hZ2VyIHtcbiAgcmVnaXN0ZXIoc3RpY2t5OiBTdGlja3kpOiBTdGlja3lNYW5hZ2VyXG4gIHVucmVnaXN0ZXIoc3RpY2t5OiBTdGlja3kpOiBTdGlja3lNYW5hZ2VyXG4gIGJ1bGtVcGRhdGUoKTogU3RpY2t5TWFuYWdlclxuICBkZXN0cm95QWxsKCk6IFN0aWNreU1hbmFnZXJcbiAgYWN0aXZhdGUoKTogU3RpY2t5TWFuYWdlclxuICBkZWFjdGl2YXRlKCk6IFN0aWNreU1hbmFnZXJcbn1cblxuY2xhc3MgU3RpY2t5TWFuYWdlckltcGwgaW1wbGVtZW50cyBTdGlja3lNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBzdGF0aWMgJCRpbnN0YW5jZTogU3RpY2t5TWFuYWdlclxuICBwcml2YXRlICQkc3RpY2tpZXM6IFN0aWNreVtdID0gW11cbiAgcHJpdmF0ZSAkJGFjdGl2YXRlZDogYm9vbGVhbiA9IGZhbHNlXG4gIHByaXZhdGUgJCRidWxrVXBkYXRlUmVxdWVzdElkOiBudW1iZXIgfCBudWxsID0gbnVsbFxuICBwcml2YXRlIHJlYWRvbmx5ICQkd2luZG93OiBXaW5kb3dcblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKF93aW5kb3c6IFdpbmRvdykge1xuICAgIHRoaXMuJCR3aW5kb3cgPSBfd2luZG93XG4gICAgdGhpcy5idWxrVXBkYXRlID0gdGhpcy5idWxrVXBkYXRlLmJpbmQodGhpcylcbiAgICB0aGlzLmJ1bGtQbGFjZWhvbGRlclVwZGF0ZSA9IHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlLmJpbmQodGhpcylcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoX3dpbmRvdzogV2luZG93KTogU3RpY2t5TWFuYWdlciB7XG4gICAgaWYgKCFTdGlja3lNYW5hZ2VySW1wbC4kJGluc3RhbmNlKSB7XG4gICAgICBTdGlja3lNYW5hZ2VySW1wbC4kJGluc3RhbmNlID0gbmV3IFN0aWNreU1hbmFnZXJJbXBsKF93aW5kb3cpXG4gICAgfVxuICAgIHJldHVybiBTdGlja3lNYW5hZ2VySW1wbC4kJGluc3RhbmNlXG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXIoc3RpY2t5OiBTdGlja3kpOiBTdGlja3lNYW5hZ2VyIHtcbiAgICB0aGlzLiQkc3RpY2tpZXMgPSBbLi4udGhpcy4kJHN0aWNraWVzLCBzdGlja3ldXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyB1bnJlZ2lzdGVyKHN0aWNreTogU3RpY2t5KTogU3RpY2t5TWFuYWdlciB7XG4gICAgdGhpcy4kJHN0aWNraWVzID0gdGhpcy4kJHN0aWNraWVzLmZpbHRlcihpbnN0YW5jZSA9PiBpbnN0YW5jZSAhPT0gc3RpY2t5KVxuICAgIGlmICh0aGlzLiQkc3RpY2tpZXMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhpcy5kZWFjdGl2YXRlKClcbiAgICB9XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBidWxrVXBkYXRlKCk6IFN0aWNreU1hbmFnZXIge1xuICAgIHRoaXMuc2NoZWR1bGVVcGRhdGUoZmFsc2UpXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95QWxsKCk6IFN0aWNreU1hbmFnZXIge1xuICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2YgdGhpcy4kJHN0aWNraWVzKSB7XG4gICAgICBpbnN0YW5jZS5kZXN0cm95KClcbiAgICB9XG4gICAgdGhpcy4kJHN0aWNraWVzID0gW11cbiAgICB0aGlzLmRlYWN0aXZhdGUoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgYWN0aXZhdGUoKTogU3RpY2t5TWFuYWdlciB7XG4gICAgaWYgKCF0aGlzLiQkYWN0aXZhdGVkICYmIHRoaXMuJCRzdGlja2llcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLiQkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuYnVsa1VwZGF0ZSlcbiAgICAgIHRoaXMuJCR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5idWxrUGxhY2Vob2xkZXJVcGRhdGUpXG4gICAgICB0aGlzLiQkYWN0aXZhdGVkID0gdHJ1ZVxuICAgIH1cbiAgICB0aGlzLmJ1bGtVcGRhdGUoKVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgZGVhY3RpdmF0ZSgpOiBTdGlja3lNYW5hZ2VyIHtcbiAgICBpZiAodGhpcy4kJGFjdGl2YXRlZCkge1xuICAgICAgdGhpcy4kJHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLmJ1bGtVcGRhdGUpXG4gICAgICB0aGlzLiQkd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuYnVsa1BsYWNlaG9sZGVyVXBkYXRlKVxuICAgICAgdGhpcy4kJGFjdGl2YXRlZCA9IGZhbHNlXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwcml2YXRlIGJ1bGtQbGFjZWhvbGRlclVwZGF0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNjaGVkdWxlVXBkYXRlKHRydWUpXG4gIH1cblxuICAvKiog5pu05paw44Gv5qyh44Gu44OV44Os44O844Og44G+44Gn44G+44Go44KB44KL44CC5LqI57SE5riI44G/44Gu44KC44Gu44GM44GC44KM44Gw5Y+W44KK5raI44GX44Gm572u44GN5o+b44GI44KLICovXG4gIHByaXZhdGUgc2NoZWR1bGVVcGRhdGUod2l0aFBsYWNlaG9sZGVyOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkKSB7XG4gICAgICB0aGlzLiQkd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuJCRidWxrVXBkYXRlUmVxdWVzdElkKVxuICAgIH1cbiAgICB0aGlzLiQkYnVsa1VwZGF0ZVJlcXVlc3RJZCA9IHRoaXMuJCR3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKFxuICAgICAgKCk6IHZvaWQgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IGluc3RhbmNlIG9mIHRoaXMuJCRzdGlja2llcykge1xuICAgICAgICAgIGlmICh3aXRoUGxhY2Vob2xkZXIpIHtcbiAgICAgICAgICAgIGluc3RhbmNlLnBsYWNlaG9sZGVyLnVwZGF0ZSgpXG4gICAgICAgICAgfVxuICAgICAgICAgIGluc3RhbmNlLnVwZGF0ZSgpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICApXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSA9IChfd2luZG93OiBXaW5kb3cpOiBTdGlja3lNYW5hZ2VyID0+XG4gIFN0aWNreU1hbmFnZXJJbXBsLmdldEluc3RhbmNlKF93aW5kb3cpXG4iLCJpbXBvcnQgUGxhY2Vob2xkZXIgZnJvbSAnLi9wbGFjZWhvbGRlcidcbmltcG9ydCB0eXBlIHtcbiAgUGFydGlhbFJlcXVpcmVkLFxuICBTZWxlY3Rvck9yRWxlbWVudCxcbiAgU3RpY2t5LFxuICBTdGlja3lPcHRpb25zLFxufSBmcm9tICcuL3N0aWNreSdcbmltcG9ydCB7IGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSwgdHlwZSBTdGlja3lNYW5hZ2VyIH0gZnJvbSAnLi9zdGlja3lNYW5hZ2VyJ1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4vdXRpbGl0eSdcblxudHlwZSBNYXliZUhUTUxFbGVtZW50ID0gSFRNTEVsZW1lbnQgfCBFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZFxuXG5jb25zdCBub3JtYWxpemVFbGVtZW50ID0gKFxuICB2YWx1ZT86IFNlbGVjdG9yT3JFbGVtZW50LFxuICAuLi5mYWxsYmFja3M6IE1heWJlSFRNTEVsZW1lbnRbXVxuKTogSFRNTEVsZW1lbnQgPT4ge1xuICBpZiAodmFsdWUgJiYgdmFsdWUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkge1xuICAgIHJldHVybiB2YWx1ZVxuICB9XG5cbiAgY29uc3QgZWxlbWVudCA9IFt2YWx1ZSAmJiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHZhbHVlKSwgLi4uZmFsbGJhY2tzXS5maW5kKFxuICAgIChpdGVtKTogaXRlbSBpcyBIVE1MRWxlbWVudCA9PiAhIWl0ZW0gJiYgaXRlbSBpbnN0YW5jZW9mIEhUTUxFbGVtZW50XG4gIClcblxuICBpZiAoZWxlbWVudCBpbnN0YW5jZW9mIEhUTUxFbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnRcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ1tTdHVjay1qc10gQ291bGQgbm90IGZpbmQgSFRNTEVsZW1lbnQnKVxufVxuXG5jb25zdCBjb21wdXRlQWJzb2x1dGVGbG9vciA9ICh0YXJnZXQ6IEhUTUxFbGVtZW50KTogbnVtYmVyID0+IHtcbiAgY29uc3QgYWJzb2x1dGVCb3R0b20gPVxuICAgIHRhcmdldC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5ib3R0b20gKyB3aW5kb3cucGFnZVlPZmZzZXRcbiAgY29uc3QgeyBwYWRkaW5nQm90dG9tIH0gPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0YXJnZXQpXG4gIGNvbnN0IHBhZGRpbmdCb3R0b21QaXhlbHMgPVxuICAgIHBhZGRpbmdCb3R0b20gIT09IG51bGwgPyBwYXJzZUludChwYWRkaW5nQm90dG9tLCAxMCkgOiAwXG4gIHJldHVybiBhYnNvbHV0ZUJvdHRvbSAtIHBhZGRpbmdCb3R0b21QaXhlbHNcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RpY2t5SW1wbCBpbXBsZW1lbnRzIFN0aWNreSB7XG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MRWxlbWVudFxuICBwdWJsaWMgb3B0aW9uczogUGFydGlhbFJlcXVpcmVkPFN0aWNreU9wdGlvbnMsICdtYXJnaW5Ub3AnPlxuICBwdWJsaWMgcGxhY2Vob2xkZXI6IFBsYWNlaG9sZGVyXG4gIHB1YmxpYyBtYXJnaW5Ub3A6IG51bWJlciA9IDBcbiAgcHVibGljIGlzU3RpY2tUb0JvdHRvbTogYm9vbGVhbiA9IGZhbHNlXG4gIHB1YmxpYyByZWN0OiBET01SZWN0XG4gIHB1YmxpYyBmbG9vcj86IG51bWJlclxuXG4gIHByaXZhdGUgJCR3cmFwcGVyITogSFRNTEVsZW1lbnRcbiAgcHJpdmF0ZSAkJGFkZGl0aW9uYWxUb3A/OiBudW1iZXJcbiAgcHJpdmF0ZSAkJGRlc3Ryb3llZDogYm9vbGVhbiA9IGZhbHNlXG5cbiAgcHJpdmF0ZSByZWFkb25seSAkJG1hbmFnZXI6IFN0aWNreU1hbmFnZXJcblxuICBwcml2YXRlIGdldCBpc1N0aWNreSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lbGVtZW50LnN0eWxlLnBvc2l0aW9uID09PSAnZml4ZWQnXG4gIH1cblxuICBwcml2YXRlIHNldCBpc1N0aWNreSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmICh0aGlzLnBsYWNlaG9sZGVyKSB7XG4gICAgICB0aGlzLnBsYWNlaG9sZGVyLnNob3VsZFBsYWNlaG9sZCA9IHZhbHVlXG4gICAgfVxuICAgIHRoaXMuZWxlbWVudC5kYXRhc2V0LnN0dWNrID0gdmFsdWUgPyB2YWx1ZS50b1N0cmluZygpIDogJydcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSB2YWx1ZSA/ICdmaXhlZCcgOiAnJ1xuICAgIHRoaXMuZWxlbWVudC5zdHlsZS50b3AgPSB2YWx1ZSA/IGAke3RoaXMudG9wfXB4YCA6ICcnXG4gICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSB2YWx1ZVxuICAgICAgPyBgJHt0aGlzLnBsYWNlaG9sZGVyLnVwZGF0ZVJlY3QoKS5sZWZ0fXB4YFxuICAgICAgOiAnJ1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCgpXG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXQgdG9wKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuJCRhZGRpdGlvbmFsVG9wID8/IHRoaXMubWFyZ2luVG9wXG4gIH1cblxuICBwcml2YXRlIHNldCB0b3AodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuJCRhZGRpdGlvbmFsVG9wID0gdmFsdWVcbiAgICB0aGlzLmVsZW1lbnQuc3R5bGUudG9wID0gdmFsdWUgPyBgJHt2YWx1ZX1weGAgOiBgJHt0aGlzLm1hcmdpblRvcH1weGBcbiAgfVxuXG4gIHByaXZhdGUgZ2V0IHdyYXBwZXIoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLiQkd3JhcHBlclxuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgIG9wdGlvbnM6IFN0aWNreU9wdGlvbnMgPSB7IG9ic2VydmU6IHRydWUgfSxcbiAgICBhY3RpdmF0ZTogYm9vbGVhbiA9IHRydWUsXG4gICAgb25VcGRhdGU6ICgpID0+IHZvaWQgPSBub29wXG4gICkge1xuICAgIGlmICghZWxlbWVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdbU3R1Y2stanNdIEludmFsaWQgZWxlbWVudCBnaXZlbicpXG4gICAgfVxuICAgIHRoaXMuJCRtYW5hZ2VyID0gZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHdpbmRvdykucmVnaXN0ZXIodGhpcylcbiAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50XG4gICAgdGhpcy5yZWN0ID0gdGhpcy5lbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpXG4gICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgbWFyZ2luVG9wOiAwLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9XG4gICAgdGhpcy5tYXJnaW5Ub3AgPSB0aGlzLm9wdGlvbnMubWFyZ2luVG9wIHx8IDBcbiAgICB0aGlzLnNldFdyYXBwZXJGcm9tU2VsZWN0b3JPckVsZW1lbnQodGhpcy5vcHRpb25zLndyYXBwZXIpXG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IG5ldyBQbGFjZWhvbGRlcihcbiAgICAgIHRoaXMuZWxlbWVudCxcbiAgICAgIHRoaXMub3B0aW9ucy5vYnNlcnZlID8/IHRydWUsXG4gICAgICBvblVwZGF0ZVxuICAgIClcbiAgICB0aGlzLmVsZW1lbnQuZGF0YXNldC5zdHVjayA9ICcnXG5cbiAgICBpZiAoYWN0aXZhdGUpIHtcbiAgICAgIHRoaXMuJCRtYW5hZ2VyLmFjdGl2YXRlKClcbiAgICB9XG5cbiAgICB0aGlzLnBsYWNlaG9sZGVyLnNob3VsZFBsYWNlaG9sZCA9IHRoaXMuaXNTdGlja3lcbiAgfVxuXG4gIHByaXZhdGUgc2V0V3JhcHBlckZyb21TZWxlY3Rvck9yRWxlbWVudChcbiAgICBzZWxlY3Rvck9yRWxlbWVudD86IFNlbGVjdG9yT3JFbGVtZW50XG4gICk6IHZvaWQge1xuICAgIGlmICghKGRvY3VtZW50LmJvZHkgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdbU3R1Y2suanNdIGRvY3VtZW50LmJvZHkgaXMgbm90IEhUTUxFbGVtZW50IGluIHRoaXMgZW52aXJvbm1lbnQnXG4gICAgICApXG4gICAgfVxuICAgIGNvbnN0IHBhcmVudCA9ICh0aGlzLnBsYWNlaG9sZGVyPy5lbGVtZW50IHx8IHRoaXMuZWxlbWVudCkucGFyZW50RWxlbWVudFxuICAgIHRoaXMuJCR3cmFwcGVyID0gbm9ybWFsaXplRWxlbWVudChzZWxlY3Rvck9yRWxlbWVudCwgcGFyZW50LCBkb2N1bWVudC5ib2R5KVxuICAgIHRoaXMuZmxvb3IgPSBjb21wdXRlQWJzb2x1dGVGbG9vcih0aGlzLiQkd3JhcHBlcilcbiAgICB0aGlzLm9wdGlvbnMud3JhcHBlciA9IHRoaXMuJCR3cmFwcGVyXG4gIH1cblxuICBwdWJsaWMgZGVzdHJveSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy4kJGRlc3Ryb3llZCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuICAgIHRoaXMuJCRkZXN0cm95ZWQgPSB0cnVlXG4gICAgdGhpcy5pc1N0aWNreSA9IGZhbHNlXG4gICAgdGhpcy5wbGFjZWhvbGRlci5kZXN0cm95KClcbiAgICB0aGlzLiQkbWFuYWdlci51bnJlZ2lzdGVyKHRoaXMpXG4gIH1cblxuICBwcml2YXRlIGNvbXB1dGVQb3NpdGlvblRvcEZyb21SZWN0KFxuICAgIHJlY3Q6IERPTVJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5yZWN0ID0gcmVjdFxuICAgIHRoaXMuZmxvb3IgPSBjb21wdXRlQWJzb2x1dGVGbG9vcih0aGlzLndyYXBwZXIpXG5cbiAgICBjb25zdCByZWxhdGl2ZUZsb29yID0gKHRoaXMuZmxvb3IgfHwgMCkgLSB3aW5kb3cucGFnZVlPZmZzZXRcblxuICAgIGlmICh0aGlzLnJlY3QuYm90dG9tID49IHJlbGF0aXZlRmxvb3IgJiYgIXRoaXMuaXNTdGlja1RvQm90dG9tKSB7XG4gICAgICB0aGlzLnRvcCA9IHJlbGF0aXZlRmxvb3IgLSB0aGlzLnJlY3QuaGVpZ2h0XG4gICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IHRydWVcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICghdGhpcy5pc1N0aWNrVG9Cb3R0b20pIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmICh0aGlzLnJlY3QudG9wID49IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICB0aGlzLnRvcCA9IHRoaXMubWFyZ2luVG9wXG4gICAgICB0aGlzLmlzU3RpY2tUb0JvdHRvbSA9IGZhbHNlXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZWN0LnRvcCA8IHRoaXMubWFyZ2luVG9wKSB7XG4gICAgICB0aGlzLnRvcCA9IHJlbGF0aXZlRmxvb3IgLSB0aGlzLnJlY3QuaGVpZ2h0XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHVwZGF0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBwbGFjZWhvbGRlclJlY3QgPSB0aGlzLnBsYWNlaG9sZGVyLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcblxuICAgIGlmICghdGhpcy5pc1N0aWNreSAmJiB0aGlzLm1hcmdpblRvcCA+IHBsYWNlaG9sZGVyUmVjdC50b3ApIHtcbiAgICAgIHRoaXMuaXNTdGlja3kgPSB0cnVlXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGhpcy5pc1N0aWNreSkge1xuICAgICAgaWYgKHBsYWNlaG9sZGVyUmVjdC50b3AgPj0gdGhpcy5tYXJnaW5Ub3ApIHtcbiAgICAgICAgdGhpcy5pc1N0aWNreSA9IGZhbHNlXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICB0aGlzLnJlY3QgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KClcbiAgICAgIGlmICh0aGlzLnJlY3QubGVmdCAhPT0gcGxhY2Vob2xkZXJSZWN0LmxlZnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50LnN0eWxlLmxlZnQgPSBgJHtwbGFjZWhvbGRlclJlY3QubGVmdH1weGBcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wdXRlUG9zaXRpb25Ub3BGcm9tUmVjdCh0aGlzLnJlY3QpXG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgdHlwZSB7IFN0aWNreSB9IGZyb20gJy4vc3RpY2t5J1xuaW1wb3J0IHsgZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlIH0gZnJvbSAnLi9zdGlja3lNYW5hZ2VyJ1xuaW1wb3J0IHR5cGUgeyBTdHVjayB9IGZyb20gJy4vc3R1Y2snXG5cbmV4cG9ydCBpbnRlcmZhY2UgU3R1Y2tNYW5hZ2VyIHtcbiAgc3RpY2tpZXM6IHJlYWRvbmx5IFN0aWNreVtdXG4gIHN0aWNreUVsZW1lbnRzOiByZWFkb25seSBIVE1MRWxlbWVudFtdXG4gIHN0YWNraW5nU3RpY2tpZXM6IHJlYWRvbmx5IFN0aWNreVtdXG4gIHJlZ2lzdGVyKHN0dWNrOiBTdHVjayk6IFN0dWNrTWFuYWdlclxuICB1bnJlZ2lzdGVyKHN0dWNrOiBTdHVjayk6IFN0dWNrTWFuYWdlclxuICBhZGRTdGlja2llcyhzdGFja2luZzogYm9vbGVhbiwgLi4uc3RpY2tpZXM6IFN0aWNreVtdKTogU3R1Y2tNYW5hZ2VyXG4gIGRlc3Ryb3lTdGlja2llcyguLi5zdGlja2llczogU3RpY2t5W10pOiBTdHVja01hbmFnZXJcbiAgZGVzdHJveUFsbCgpOiBTdHVja01hbmFnZXJcbiAgdXBkYXRlKCk6IFN0dWNrTWFuYWdlclxufVxuXG5jbGFzcyBTdHVja01hbmFnZXJJbXBsIGltcGxlbWVudHMgU3R1Y2tNYW5hZ2VyIHtcbiAgcHJpdmF0ZSBzdGF0aWMgJCRpbnN0YW5jZTogU3R1Y2tNYW5hZ2VyXG4gIHByaXZhdGUgJCRzdHVja3M6IFN0dWNrW10gPSBbXVxuICBwcml2YXRlICQkc3RpY2tpZXM6IFN0aWNreVtdID0gW11cbiAgcHJpdmF0ZSAkJHN0YWNraW5nU3RpY2tpZXM6IFN0aWNreVtdID0gW11cbiAgcHJpdmF0ZSAkJHdpbmRvdzogV2luZG93XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihfd2luZG93OiBXaW5kb3cpIHtcbiAgICB0aGlzLiQkd2luZG93ID0gX3dpbmRvd1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRJbnN0YW5jZShfd2luZG93OiBXaW5kb3cpOiBTdHVja01hbmFnZXIge1xuICAgIGlmICghU3R1Y2tNYW5hZ2VySW1wbC4kJGluc3RhbmNlKSB7XG4gICAgICBTdHVja01hbmFnZXJJbXBsLiQkaW5zdGFuY2UgPSBuZXcgU3R1Y2tNYW5hZ2VySW1wbChfd2luZG93KVxuICAgIH1cbiAgICByZXR1cm4gU3R1Y2tNYW5hZ2VySW1wbC4kJGluc3RhbmNlXG4gIH1cblxuICBwdWJsaWMgcmVnaXN0ZXIoc3R1Y2s6IFN0dWNrKTogU3R1Y2tNYW5hZ2VyIHtcbiAgICB0aGlzLiQkc3R1Y2tzID0gWy4uLnRoaXMuJCRzdHVja3MsIHN0dWNrXVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBwdWJsaWMgdW5yZWdpc3RlcihzdHVjazogU3R1Y2spOiBTdHVja01hbmFnZXIge1xuICAgIHRoaXMuZGVzdHJveVN0aWNraWVzKC4uLnN0dWNrLnN0aWNraWVzKVxuICAgIHRoaXMuJCRzdHVja3MgPSB0aGlzLiQkc3R1Y2tzLmZpbHRlcihpbnN0YW5jZSA9PiBpbnN0YW5jZSAhPT0gc3R1Y2spXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHB1YmxpYyBnZXQgc3RpY2tpZXMoKTogcmVhZG9ubHkgU3RpY2t5W10ge1xuICAgIHJldHVybiB0aGlzLiQkc3RpY2tpZXNcbiAgfVxuXG4gIHB1YmxpYyBnZXQgc3RpY2t5RWxlbWVudHMoKTogcmVhZG9ubHkgSFRNTEVsZW1lbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMuJCRzdGlja2llcy5tYXAoc3RpY2t5ID0+IHN0aWNreS5lbGVtZW50KVxuICB9XG5cbiAgcHVibGljIGdldCBzdGFja2luZ1N0aWNraWVzKCk6IHJlYWRvbmx5IFN0aWNreVtdIHtcbiAgICByZXR1cm4gdGhpcy4kJHN0YWNraW5nU3RpY2tpZXNcbiAgfVxuXG4gIHB1YmxpYyBhZGRTdGlja2llcyhzdGFja2luZzogYm9vbGVhbiwgLi4uc3RpY2tpZXM6IFN0aWNreVtdKTogU3R1Y2tNYW5hZ2VyIHtcbiAgICB0aGlzLiQkc3RpY2tpZXMgPSBbLi4udGhpcy4kJHN0aWNraWVzLCAuLi5zdGlja2llc11cbiAgICBpZiAoc3RhY2tpbmcpIHtcbiAgICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gWy4uLnRoaXMuJCRzdGFja2luZ1N0aWNraWVzLCAuLi5zdGlja2llc11cbiAgICB9XG4gICAgZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHRoaXMuJCR3aW5kb3cpLmFjdGl2YXRlKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIGRlc3Ryb3lTdGlja2llcyguLi5zdGlja2llczogU3RpY2t5W10pOiBTdHVja01hbmFnZXIge1xuICAgIGZvciAoY29uc3QgaW5zdGFuY2Ugb2Ygc3RpY2tpZXMpIHtcbiAgICAgIGluc3RhbmNlLmRlc3Ryb3koKVxuICAgIH1cbiAgICB0aGlzLiQkc3RpY2tpZXMgPSB0aGlzLiQkc3RpY2tpZXMuZmlsdGVyKFxuICAgICAgc3RpY2t5ID0+ICFzdGlja2llcy5pbmNsdWRlcyhzdGlja3kpXG4gICAgKVxuICAgIHRoaXMuJCRzdGFja2luZ1N0aWNraWVzID0gdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMuZmlsdGVyKFxuICAgICAgc3RpY2t5ID0+ICFzdGlja2llcy5pbmNsdWRlcyhzdGlja3kpXG4gICAgKVxuICAgIGlmICh0aGlzLiQkc3RhY2tpbmdTdGlja2llcy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnVwZGF0ZSgpXG4gICAgfVxuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICAvKiog55m76Yyy5riI44G/44GuIFN0dWNrIOOBqCBTdGlja3kg44KS44GZ44G544Gm56C05qOE44GX44CB44K344Oz44Kw44Or44OI44Oz44KS5Yid5pyf54q25oWL44Gr5oi744GZICovXG4gIHB1YmxpYyBkZXN0cm95QWxsKCk6IFN0dWNrTWFuYWdlciB7XG4gICAgdGhpcy5kZXN0cm95U3RpY2tpZXMoLi4udGhpcy4kJHN0aWNraWVzKVxuICAgIHRoaXMuJCRzdHVja3MgPSBbXVxuICAgIHRoaXMuJCRzdGlja2llcyA9IFtdXG4gICAgdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMgPSBbXVxuICAgIGdldFN0aWNreU1hbmFnZXJJbnN0YW5jZSh0aGlzLiQkd2luZG93KS5kZXN0cm95QWxsKClcbiAgICByZXR1cm4gdGhpc1xuICB9XG5cbiAgcHVibGljIHVwZGF0ZSgpOiBTdHVja01hbmFnZXIge1xuICAgIGNvbnN0IHNvcnRlZCA9IEFycmF5LmZyb20obmV3IFNldCh0aGlzLnN0YWNraW5nU3RpY2tpZXMpKVxuICAgICAgLm1hcChpbnN0YW5jZSA9PiAoe1xuICAgICAgICBpbnN0YW5jZSxcbiAgICAgICAgcmVjdDogaW5zdGFuY2UucGxhY2Vob2xkZXIudXBkYXRlUmVjdCgpLFxuICAgICAgfSkpXG4gICAgICAuc29ydCgoYmVmb3JlLCBhZnRlcikgPT4gYmVmb3JlLnJlY3QudG9wIC0gYWZ0ZXIucmVjdC50b3ApXG5cbiAgICAvLyDkuIrjgavjgYLjgovjgoLjga7jgYvjgonpoIbjgavjgIHnm7TliY3jga7opoHntKDjga7kuIvnq6/jgpLmrKHjga7opoHntKDjga4gbWFyZ2luVG9wIOOBq+epjeOCgFxuICAgIGxldCBjZWlsaW5nID0gMFxuICAgIGNvbnN0IHN0YWNraW5nOiBTdGlja3lbXSA9IFtdXG4gICAgZm9yIChjb25zdCB7IGluc3RhbmNlIH0gb2Ygc29ydGVkKSB7XG4gICAgICBpbnN0YW5jZS5tYXJnaW5Ub3AgPSBpbnN0YW5jZS5vcHRpb25zLm1hcmdpblRvcCArIGNlaWxpbmdcbiAgICAgIGNlaWxpbmcgPSBpbnN0YW5jZS5yZWN0LmhlaWdodCArIGluc3RhbmNlLm1hcmdpblRvcFxuICAgICAgc3RhY2tpbmcucHVzaChpbnN0YW5jZSlcbiAgICB9XG4gICAgdGhpcy4kJHN0YWNraW5nU3RpY2tpZXMgPSBzdGFja2luZ1xuXG4gICAgZ2V0U3RpY2t5TWFuYWdlckluc3RhbmNlKHRoaXMuJCR3aW5kb3cpLmJ1bGtVcGRhdGUoKVxuXG4gICAgLy8gQXJyYXkucHJvdG90eXBlLnNvcnQg44GvIEVTMjAxOSDku6XpmY3jgIHlronlrprjgr3jg7zjg4jjgYzkv53oqLzjgZXjgozjgabjgYTjgotcbiAgICB0aGlzLiQkc3RpY2tpZXMgPSBbLi4udGhpcy5zdGlja2llc10uc29ydChcbiAgICAgIChiZWZvcmUsIGFmdGVyKSA9PlxuICAgICAgICBiZWZvcmUucGxhY2Vob2xkZXIuY2FjaGVkUmVjdC50b3AgLSBhZnRlci5wbGFjZWhvbGRlci5jYWNoZWRSZWN0LnRvcFxuICAgIClcblxuICAgIHJldHVybiB0aGlzXG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGdldFN0dWNrTWFuYWdlckluc3RhbmNlID0gKF93aW5kb3c6IFdpbmRvdyk6IFN0dWNrTWFuYWdlciA9PlxuICBTdHVja01hbmFnZXJJbXBsLmdldEluc3RhbmNlKF93aW5kb3cpXG4iLCJpbXBvcnQgdHlwZSB7IFN0aWNreSwgU3RpY2t5T3B0aW9ucyB9IGZyb20gJy4vc3RpY2t5J1xuaW1wb3J0IFN0aWNreUltcGwgZnJvbSAnLi9zdGlja3lJbXBsJ1xuaW1wb3J0IHR5cGUgeyBFbGVtZW50U291cmNlLCBTdGlja3lTZXR0aW5nLCBTdHVjayB9IGZyb20gJy4vc3R1Y2snXG5pbXBvcnQgeyBnZXRTdHVja01hbmFnZXJJbnN0YW5jZSwgdHlwZSBTdHVja01hbmFnZXIgfSBmcm9tICcuL3N0dWNrTWFuYWdlcidcblxuY29uc3QgZ2V0RWxlbWVudHNBcnJheUZyb21TZXR0aW5nID0gKHtcbiAgc2VsZWN0b3IsXG4gIGVsZW1lbnQsXG59OiBFbGVtZW50U291cmNlKTogSFRNTEVsZW1lbnRbXSA9PiB7XG4gIGlmIChlbGVtZW50KSB7XG4gICAgcmV0dXJuIGVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudCA/IFtlbGVtZW50XSA6IEFycmF5LmZyb20oZWxlbWVudClcbiAgfVxuICBpZiAoc2VsZWN0b3IpIHtcbiAgICAvLyBxdWVyeVNlbGVjdG9yQWxsIOOBryBTVkdFbGVtZW50IOOBquOBqeOCguaLvuOBhuOBn+OCgSBIVE1MRWxlbWVudCDjgavntZ7jgotcbiAgICByZXR1cm4gQXJyYXkuZnJvbShkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHNlbGVjdG9yKSkuZmlsdGVyKFxuICAgICAgKG1heWJlSFRNTEVsZW1lbnQpOiBtYXliZUhUTUxFbGVtZW50IGlzIEhUTUxFbGVtZW50ID0+XG4gICAgICAgIG1heWJlSFRNTEVsZW1lbnQgaW5zdGFuY2VvZiBIVE1MRWxlbWVudFxuICAgIClcbiAgfVxuICB0aHJvdyBuZXcgRXJyb3IoJ1tTdHVjay5qc10gTm8gc2VsZWN0b3IsIGVsZW1lbnQgbm9yIGVsZW1lbnRzIGluIHNldHRpbmcnKVxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdHVja0ltcGwgaW1wbGVtZW50cyBTdHVjayB7XG4gIHByaXZhdGUgcmVhZG9ubHkgJCRkZWZhdWx0T3B0aW9uczogU3RpY2t5T3B0aW9uc1xuICBwcml2YXRlIHJlYWRvbmx5ICQkbWFuYWdlcjogU3R1Y2tNYW5hZ2VyXG4gIHByaXZhdGUgJCRpbnN0YW5jZXM6IFN0aWNreVtdID0gW11cblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgc2V0dGluZ3M6IFN0aWNreVNldHRpbmdbXSB8IFN0aWNreVNldHRpbmcgPSBbXSxcbiAgICBkZWZhdWx0T3B0aW9uczogU3RpY2t5T3B0aW9ucyA9IHsgb2JzZXJ2ZTogdHJ1ZSB9LFxuICAgIHNoYXJlZFN0YWNraW5nOiBib29sZWFuID0gdHJ1ZVxuICApIHtcbiAgICB0aGlzLiQkbWFuYWdlciA9IGdldFN0dWNrTWFuYWdlckluc3RhbmNlKHdpbmRvdykucmVnaXN0ZXIodGhpcylcbiAgICB0aGlzLiQkZGVmYXVsdE9wdGlvbnMgPSBkZWZhdWx0T3B0aW9uc1xuICAgIHRoaXMuY3JlYXRlKHNldHRpbmdzLCBzaGFyZWRTdGFja2luZylcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGUoXG4gICAgc291cmNlOiBSZWFkb25seTxTdGlja3lTZXR0aW5nW10gfCBTdGlja3lTZXR0aW5nPixcbiAgICBzaGFyZWRTdGFja2luZzogYm9vbGVhbiA9IHRydWVcbiAgKTogU3RpY2t5W10ge1xuICAgIGNvbnN0IHNldHRpbmdzID0gQXJyYXkuaXNBcnJheShzb3VyY2UpID8gc291cmNlIDogW3NvdXJjZV1cbiAgICBjb25zdCByZWdpc3RlcmVkID0gc2V0dGluZ3MucmVkdWNlPFN0aWNreVtdPihcbiAgICAgIChhY2N1bXVsYXRvciwgc2V0dGluZyk6IFN0aWNreVtdID0+XG4gICAgICAgIGFjY3VtdWxhdG9yLmNvbmNhdCh0aGlzLnJlZ2lzdGVyKHNldHRpbmcsIHNoYXJlZFN0YWNraW5nKSksXG4gICAgICBbXVxuICAgIClcbiAgICBpZiAocmVnaXN0ZXJlZC5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBbXVxuICAgIH1cbiAgICB0aGlzLiQkbWFuYWdlci51cGRhdGUoKVxuICAgIHJldHVybiByZWdpc3RlcmVkXG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyKFxuICAgIHsgc2VsZWN0b3IsIGVsZW1lbnQsIC4uLm9wdGlvbnMgfTogU3RpY2t5U2V0dGluZyxcbiAgICBzaGFyZWRTdGFja2luZzogYm9vbGVhbiA9IHRydWVcbiAgKTogU3RpY2t5W10ge1xuICAgIGNvbnN0IHJlZ2lzdGVyZWRJbnN0YW5jZUVsZW1lbnRzID0gdGhpcy4kJG1hbmFnZXIuc3RpY2t5RWxlbWVudHNcbiAgICBjb25zdCBzdGlja2llcyA9IGdldEVsZW1lbnRzQXJyYXlGcm9tU2V0dGluZyh7IHNlbGVjdG9yLCBlbGVtZW50IH0pXG4gICAgICAuZmlsdGVyKHRhcmdldCA9PiAhcmVnaXN0ZXJlZEluc3RhbmNlRWxlbWVudHMuaW5jbHVkZXModGFyZ2V0KSlcbiAgICAgIC5tYXAoXG4gICAgICAgIChuZXdFbGVtZW50KTogU3RpY2t5ID0+XG4gICAgICAgICAgbmV3IFN0aWNreUltcGwoXG4gICAgICAgICAgICBuZXdFbGVtZW50LFxuICAgICAgICAgICAgeyAuLi50aGlzLiQkZGVmYXVsdE9wdGlvbnMsIC4uLm9wdGlvbnMgfSxcbiAgICAgICAgICAgIGZhbHNlLFxuICAgICAgICAgICAgKCk6IHZvaWQgPT4ge1xuICAgICAgICAgICAgICB0aGlzLiQkbWFuYWdlci51cGRhdGUoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIClcbiAgICAgIClcblxuICAgIHRoaXMuJCRtYW5hZ2VyLmFkZFN0aWNraWVzKHNoYXJlZFN0YWNraW5nLCAuLi5zdGlja2llcylcbiAgICB0aGlzLiQkaW5zdGFuY2VzID0gWy4uLnRoaXMuJCRpbnN0YW5jZXMsIC4uLnN0aWNraWVzXVxuICAgIHJldHVybiBzdGlja2llc1xuICB9XG5cbiAgcHVibGljIGdldCBzdGlja2llcygpOiByZWFkb25seSBTdGlja3lbXSB7XG4gICAgcmV0dXJuIHRoaXMuJCRpbnN0YW5jZXNcbiAgfVxuXG4gIHB1YmxpYyBkZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuJCRtYW5hZ2VyLnVucmVnaXN0ZXIodGhpcylcbiAgICB0aGlzLiQkaW5zdGFuY2VzID0gW11cbiAgfVxufVxuIiwiaW1wb3J0IFBsYWNlaG9sZGVyIGZyb20gJy4vcGxhY2Vob2xkZXInXG5pbXBvcnQgU3RpY2t5IGZyb20gJy4vc3RpY2t5SW1wbCdcbmltcG9ydCBTdHVjayBmcm9tICcuL3N0dWNrSW1wbCdcblxuZXhwb3J0IHsgUGxhY2Vob2xkZXIsIFN0aWNreSwgU3R1Y2sgfVxuZXhwb3J0IGRlZmF1bHQgU3R1Y2tcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Q0FBQSxJQUFhLGFBQW1CLENBQUM7OztDQ0VqQyxJQUFxQixjQUFyQixNQUFxQixZQUFZO0VBVy9CLElBQVcsa0JBQTJCO0dBQ3BDLE9BQU8sQ0FBQyxLQUFLLG1CQUFtQixLQUFLO0VBQ3ZDO0VBRUEsSUFBVyxnQkFBZ0IsT0FBZ0I7R0FDekMsSUFBSSxLQUFLLG9CQUFvQixPQUMzQjtHQUdGLEtBQUssb0JBQW9CO0dBQ3pCLEtBQUssT0FBTyxJQUFJO0VBQ2xCO0VBRUEsWUFDRSxTQUNBLFVBQW1CLE1BQ25CLFdBQXVCLE1BQ3ZCOzRCQXBCbUM7c0JBQ047R0FvQjdCLEtBQUssV0FBVztHQUNoQixLQUFLLFdBQVcsT0FBTyxhQUFhLGFBQWEsV0FBVztHQUU1RCxLQUFLLHdCQUF3QixPQUFPLGlCQUFpQixLQUFLLFFBQVE7R0FDbEUsS0FBSyxrQkFBa0IsS0FBSyxzQkFBc0IsWUFBWTtHQUU5RCxJQUFJLEtBQUssaUJBQ1AsS0FBSyx3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