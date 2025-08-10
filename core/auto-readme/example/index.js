// remark-usage-ignore-next
/* eslint no-console: ["off"] */
// remark-usage-ignore-next
import * as templates from "./templates.js";

// In order to run the script you need to do two things
// 1. Create either a heading or a comment to enable the corresponding feature
// 2. Run the following command:

console.log("sh", templates.shScript);

// To turn on table of content enable the setting `enableToc` and add the following header

console.log("md", templates.mdTocExample);

// To turn on the usage generator enable the setting `enableUsage` and add the following header

console.log("md", templates.mdUsageExample);

// To use the zod generator add the following comments

console.log("md", templates.mdZodExample);

// There are more [Actions](#actions) that you can use in conjunction with different [languages](#language) and [formats](#formats) like so:

console.log("md", templates.mdLanguageFormatAction);

// You can run `auto-readme` as a pre-commit git hook to automatically keep your `README`s up to date. For example, you can use `husky` to add the following to your `.husky/pre-commit` file:

console.log("sh", templates.huskyScript);

// This will run `auto-readme` only when affected `README` files are changed
