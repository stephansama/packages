// remark-usage-ignore-next
/* eslint no-console: ["off"] */
// remark-usage-ignore-next
import { huskyScript, shScript } from "./templates.js";

// In order to run the script you need to do two things
// 1. Create either a heading or a comment to enable the corresponding feature
// 2. Run the following command:

console.log("sh", shScript);

// You can run `auto-readme` as a pre-commit git hook to automatically keep your `README`s up to date. For example, you can use `husky` to add the following to your `.husky/pre-commit` file:

console.log("sh", huskyScript);

//This will run `auto-readme` only when affected `README` files are changed
