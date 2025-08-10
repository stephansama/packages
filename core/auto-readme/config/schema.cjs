"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/schema.js
var schema_exports = {};
__export(schema_exports, {
  actionsSchema: () => actionsSchema,
  configSchema: () => configSchema,
  defaultTableHeadings: () => defaultTableHeadings,
  defaultTemplates: () => defaultTemplates,
  formatsSchema: () => formatsSchema,
  headingsSchema: () => headingsSchema,
  languageSchema: () => languageSchema,
  tableHeadingsSchema: () => tableHeadingsSchema,
  templatesSchema: () => templatesSchema
});
module.exports = __toCommonJS(schema_exports);
var import_zod = require("zod");
var actionsSchema = import_zod.z.enum(["ACTION", "PKG", "USAGE", "WORKSPACE", "ZOD"]).describe("Comment action options");
var formatsSchema = import_zod.z.enum(["LIST", "TABLE"]).default("TABLE").optional();
var languageSchema = import_zod.z.enum(["JS", "RS"]).optional().default("JS");
var headingsSchema = import_zod.z.enum([
  "default",
  "description",
  "devDependency",
  "downloads",
  "name",
  "private",
  "required",
  "version"
]).describe("Table heading options");
var tableHeadingsSchema = import_zod.z.record(actionsSchema, headingsSchema.array().optional()).optional().describe("Table heading action configuration").default({
  ACTION: ["name", "required", "default", "description"],
  PKG: ["name", "version", "devDependency"],
  WORKSPACE: ["name", "version", "downloads", "description"],
  ZOD: []
});
var templatesSchema = import_zod.z.object({
  downloadImage: import_zod.z.string().optional().default("https://img.shields.io/npm/dw/{{name}}?labelColor=211F1F"),
  emojis: import_zod.z.record(headingsSchema, import_zod.z.string()).optional().describe("Table heading emojis used when enabled").default({
    default: "\u2699\uFE0F",
    description: "\u{1F4DD}",
    devDependency: "\u{1F4BB}",
    downloads: "\u{1F4E5}",
    name: "\u{1F3F7}\uFE0F",
    private: "\u{1F512}",
    required: "",
    version: ""
  }),
  registryUrl: import_zod.z.string().optional().default("https://www.npmjs.com/package/{{name}}"),
  versionImage: import_zod.z.string().optional().default(
    "https://img.shields.io/npm/v/{{uri_name}}?logo=npm&logoColor=red&color=211F1F&labelColor=211F1F"
  )
});
var defaultTemplates = templatesSchema.parse({});
var defaultTableHeadings = tableHeadingsSchema.parse(void 0);
var _configSchema = import_zod.z.object({
  affectedRegexes: import_zod.z.string().array().optional().default([]),
  defaultLanguage: languageSchema.meta({
    alias: "l",
    description: "Default language to infer projects from"
  }),
  disableEmojis: import_zod.z.boolean().default(false).meta({
    alias: "e",
    description: "Whether or not to use emojis in markdown table headings"
  }),
  disableMarkdownHeadings: import_zod.z.boolean().default(false).meta({
    description: "Whether or not to display markdown headings"
  }),
  enableToc: import_zod.z.boolean().default(false).meta({
    alias: "t",
    description: "generate table of contents for readmes"
  }),
  enableUsage: import_zod.z.boolean().optional().default(false).meta({
    description: "Whether or not to enable usage plugin"
  }),
  headings: tableHeadingsSchema.optional().default(defaultTableHeadings).describe("List of headings for different table outputs"),
  onlyReadmes: import_zod.z.boolean().default(true).meta({
    alias: "r",
    description: "Whether or not to only traverse readmes"
  }),
  onlyShowPublicPackages: import_zod.z.boolean().default(false).meta({
    alias: "p",
    description: "Only show public packages in workspaces"
  }),
  removeScope: import_zod.z.string().optional().default("").meta({
    description: "Remove common workspace scope"
  }),
  templates: templatesSchema.optional().default(defaultTemplates).describe(
    "Handlebars templates used to fuel list and table generation"
  ),
  tocHeading: import_zod.z.string().optional().default("Table of contents").meta({
    description: "Markdown heading used to generate table of contents"
  }),
  usageFile: import_zod.z.string().optional().default("").meta({
    description: "Workspace level usage file"
  }),
  usageHeading: import_zod.z.string().optional().default("Usage").meta({
    description: "Markdown heading used to generate usage example"
  }),
  verbose: import_zod.z.boolean().default(false).meta({
    alias: "v",
    description: "whether or not to display verbose logging"
  })
});
var configSchema = _configSchema.optional();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  actionsSchema,
  configSchema,
  defaultTableHeadings,
  defaultTemplates,
  formatsSchema,
  headingsSchema,
  languageSchema,
  tableHeadingsSchema,
  templatesSchema
});
//# sourceMappingURL=schema.cjs.map