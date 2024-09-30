import { pixiv } from "./lib/functions.js";

const data = await pixiv("freefire", true);
console.log(data);
