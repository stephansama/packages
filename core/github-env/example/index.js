// remark-usage-ignore-next
/* eslint no-console: ["off"] */
// remark-usage-ignore-next
import { tsComment, tsConfig } from "./templates.js";

// In order to enable the GitHub environment variables into your local scope you can either add the following to your `tsconfig.json`

console.log("json", tsConfig);

// or add the following reference to any typescript file
console.log("ts", tsComment);

// 🎉 Now you have access to GitHub environment variables in your TypeScript files!
