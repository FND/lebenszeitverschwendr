/* eslint-env browser */

export function dispatchEvent(emitter, name, payload, options = { bubbles: true }) {
	if(payload) {
		options.detail = payload;
	}
	let ev = new CustomEvent(name, options);
	emitter.dispatchEvent(ev);
}

export function createElement(tag, attribs, { text, parent } = {}) {
	let el = document.createElement(tag);
	Object.entries(attribs || {}).forEach(([name, value]) => {
		el.setAttribute(name, value);
	});
	if(text) {
		el.textContent = text;
	}
	if(parent) {
		parent.appendChild(el);
	}
	return el;
}

export function formatDuration(ms) {
	let s = Math.floor(ms / 1000);
	let m = Math.floor(s / 60);
	let h = Math.floor(m / 60);
	return [h, m % 60, s % 60].
		map(v => Math.floor(v).toString().padStart(2, 0)).
		join(":");
}
