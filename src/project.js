/* eslint-env browser */
import { TAG as TIMER } from "./timer.js";
import { dispatchEvent, createElement } from "./util.js";

export let TAG = "lzv-project";

export function create(name, parent) {
	let container = createElement(TAG, { name }, { parent });
	let defaults = { parent: container };
	createElement("h3", null, {
		text: name,
		...defaults
	});
	createElement(TIMER, { project: name }, defaults);
	createElement("button", {
		type: "button",
		"data-alt": "stop"
	}, {
		text: "start",
		...defaults
	});
}

export class LzvProject extends HTMLElement {
	connectedCallback() {
		this.addEventListener("click", this.onToggle);
	}

	onToggle(ev) {
		if(!ev.target.matches("button[type=button]")) { // event delegation
			return;
		}

		toggleLabel(this.button, "data-alt");
		let active = this.classList.toggle("active");

		let payload = { project: this.name };
		if(active) {
			var eventName = "lzv:start"; // eslint-disable-line no-var
			this._timestamp = payload.timestamp = Date.now();
		} else {
			eventName = "lzv:stop";
			payload.duration = Date.now() - this._timestamp;
			this._timestamp = null;
		}
		dispatchEvent(this, eventName, payload);
	}

	get button() {
		return this.querySelector("button");
	}

	get name() {
		return this.getAttribute("name");
	}
}

function toggleLabel(el, attr) {
	let txt = el.textContent;
	el.textContent = el.getAttribute(attr);
	el.setAttribute(attr, txt);
}
