// src/schema.js
import { z } from "zod";
var actionsSchema = z.enum(["ACTION", "PKG", "USAGE", "WORKSPACE", "ZOD"]).describe("Comment action options");
var formatsSchema = z.enum(["LIST", "TABLE"]).default("TABLE").optional();
var languageSchema = z.enum(["JS", "RS"]).optional().default("JS");
var headingsSchema = z.enum([
  "default",
  "description",
  "devDependency",
  "downloads",
  "name",
  "private",
  "required",
  "version"
]).describe("Table heading options");
var tableHeadingsSchema = z.record(actionsSchema, headingsSchema.array().optional()).optional().describe("Table heading action configuration").default({
  ACTION: ["name", "required", "default", "description"],
  PKG: ["name", "version", "devDependency"],
  WORKSPACE: ["name", "version", "downloads", "description"],
  ZOD: []
});
var templatesSchema = z.object({
  downloadImage: z.string().optional().default("https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F"),
  emojis: z.record(headingsSchema, z.string()).optional().describe("Table heading emojis used when enabled").default({
    default: "\u2699\uFE0F",
    description: "\u{1F4DD}",
    devDependency: "\u{1F4BB}",
    downloads: "\u{1F4E5}",
    name: "\u{1F3F7}\uFE0F",
    private: "\u{1F512}",
    required: "",
    version: ""
  }),
  registryUrl: z.string().optional().default("https://www.npmjs.com/package/{{name}}"),
  versionImage: z.string().optional().default(
    "https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F"
  )
});
var defaultTemplates = templatesSchema.parse({});
var defaultTableHeadings = tableHeadingsSchema.parse(void 0);
var _configSchema = z.object({
  affectedRegexes: z.string().array().optional().default([]),
  defaultLanguage: languageSchema.meta({
    alias: "l",
    description: "Default language to infer projects from"
  }),
  disableEmojis: z.boolean().default(false).meta({
    alias: "e",
    description: "Whether or not to use emojis in markdown table headings"
  }),
  disableMarkdownHeadings: z.boolean().default(false).meta({
    description: "Whether or not to display markdown headings"
  }),
  enableToc: z.boolean().default(false).meta({
    alias: "t",
    description: "generate table of contents for readmes"
  }),
  enableUsage: z.boolean().optional().default(false).meta({
    description: "Whether or not to enable usage plugin"
  }),
  headings: tableHeadingsSchema.optional().default(defaultTableHeadings).describe("List of headings for different table outputs"),
  onlyReadmes: z.boolean().default(true).meta({
    alias: "r",
    description: "Whether or not to only traverse readmes"
  }),
  onlyShowPublicPackages: z.boolean().default(false).meta({
    alias: "p",
    description: "Only show public packages in workspaces"
  }),
  removeScope: z.string().optional().default("").meta({
    description: "Remove common workspace scope"
  }),
  templates: templatesSchema.optional().default(defaultTemplates).describe(
    "Handlebars templates used to fuel list and table generation"
  ),
  tocHeading: z.string().optional().default("Table of contents").meta({
    description: "Markdown heading used to generate table of contents"
  }),
  usageFile: z.string().optional().default("").meta({
    description: "Workspace level usage file"
  }),
  usageHeading: z.string().optional().default("Usage").meta({
    description: "Markdown heading used to generate usage example"
  }),
  verbose: z.boolean().default(false).meta({
    alias: "v",
    description: "whether or not to display verbose logging"
  })
});
var configSchema = _configSchema.optional();
export {
  actionsSchema,
  configSchema,
  defaultTableHeadings,
  defaultTemplates,
  formatsSchema,
  headingsSchema,
  languageSchema,
  tableHeadingsSchema,
  templatesSchema
};
//# sourceMappingURL=schema.js.map