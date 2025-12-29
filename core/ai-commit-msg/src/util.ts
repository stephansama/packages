import pkg from "../package.json";

export const moduleName = pkg.name.split("/").at(-1)!.replace(/-/g, "");
