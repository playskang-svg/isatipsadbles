import { register } from "node:module";
import { PROJECT_ROOT } from "./paths.mjs";

register("./loader.mjs", import.meta.url, { data: { root: PROJECT_ROOT } });
