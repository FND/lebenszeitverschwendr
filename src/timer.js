/* eslint-env browser */
import { TAG as ROOT } from "./root.js";
import { formatDuration } from "./util.js";

export let TAG = "lzv-timer";

export class LzvTimer extends HTMLElement {
	connectedCallback() {
		this.textContent = formatDuration(0);
		this.closest(ROOT).
			addEventListener("lzv:tick", this.onTick.bind(this));
	}

	onTick(ev) {
		let { durations } = ev.detail;
		let { project } = this;
		if(project) {
			this.value = durations.get(project) || 0;
			return;
		}

		let total = 0;
		for(let [, value] of durations) {
			total += value;
		}
		this.value = total;
	}

	set value(ms) { // eslint-disable-line accessor-pairs
		requestAnimationFrame(() => {
			this.textContent = formatDuration(ms);
		});
	}

	get project() {
		return this.getAttribute("project");
	}
}
