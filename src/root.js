/* eslint-env browser */
import { create as createProject } from "./project.js";
import { dispatchEvent } from "./util.js";

let REFRESH_INTERVAL = 1000;

export let TAG = "lzv-root";

export class LzvRoot extends HTMLElement {
	connectedCallback() {
		this._log = [];
		this._totals = new Map();
		this._active = new Map();

		let container = this.trackers;
		for(let name of this.projects) {
			createProject(name, container);
		}

		this.refresh = this.refresh.bind(this);
		this.addEventListener("lzv:start", this.onStart);
		this.addEventListener("lzv:stop", this.onStop);
	}

	onStart(ev) {
		let { project, timestamp } = ev.detail;
		this._log.push({ type: "start", project, timestamp });

		let active = this._active;
		active.set(project, timestamp);
		if(active.size === 1) {
			this._ticker = setInterval(this.refresh, REFRESH_INTERVAL);
		}

		ev.stopPropagation();
	}

	onStop(ev) {
		let { project, duration } = ev.detail;
		this._log.push({ type: "stop", project, duration });

		let totals = this._totals;
		let sum = (totals.get(project) || 0) + duration;
		totals.set(project, sum);

		let active = this._active;
		active.delete(project);
		if(active.size === 0) {
			clearInterval(this._ticker);
			this._ticker = null;
		}

		ev.stopPropagation();
	}

	refresh() {
		let ts = Date.now();
		let durations = new Map(this._totals);
		for(let [name, start] of this._active) {
			let value = durations.get(name) || 0;
			durations.set(name, value + ts - start);
		}

		dispatchEvent(this, "lzv:tick", {
			durations
		}, { bubbles: false });
	}

	get projects() {
		return [...this.querySelectorAll(".projects li")].
			map(el => el.textContent);
	}

	get trackers() {
		return this.querySelector(".trackers");
	}
}
