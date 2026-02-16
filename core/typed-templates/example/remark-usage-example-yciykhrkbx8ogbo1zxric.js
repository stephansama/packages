// create a map of different handlebar schemas
//
import * as z from "zod";
import { createHandlebarSchemaMap, createHandlebarSchemaSingleton, getFileContext } from "../dist/index.cjs";
const {
  isLinting,
  templateDirectory
} = getFileContext(import.meta.url);
export const schemaMap = createHandlebarSchemaMap({
  constList: {
    path: "../tests/fixtures/map/const-list.ts.hbs",
    schema: z.object({
      body: z.unknown(),
      name: z.string(),
      plural_name: z.string()
    })
  },
  constMap: {
    path: "../tests/fixtures/map/const-map.ts.hbs",
    schema: z.object({
      items: z.array(z.object({
        key: z.string(),
        value: z.unknown()
      })),
      map_type: z.string(),
      name: z.string()
    })
  }
}, {
  templateDirectory
});
if (isLinting()) await schemaMap.audit();

// or create a singleton schema used to validate multiple templates

export const singleSchema = createHandlebarSchemaSingleton(["../tests/fixtures/singleton/valid.hbs", "../tests/fixtures/singleton/valid2.hbs"], z.object({
  items: z.array(z.object({
    key: z.string(),
    value: z.string()
  })),
  map_type: z.string(),
  name: z.string()
}), {
  templateDirectory
});
if (isLinting()) await singleSchema.audit();

// then later on in the code in another file:

export async function useTemplate() {
  return await schemaMap.compile("constList", {
    body: "body",
    name: "Name",
    plural_name: "Plural"
  });
}