/* eslint-env browser */
import * as root from "./root.js";
import * as project from "./project.js";
import * as timer from "./timer.js";

customElements.define(root.TAG, root.LzvRoot);
customElements.define(project.TAG, project.LzvProject);
customElements.define(timer.TAG, timer.LzvTimer);
