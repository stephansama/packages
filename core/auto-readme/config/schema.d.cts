import { z } from 'zod';

declare const actionsSchema: z.ZodEnum<{
    ACTION: "ACTION";
    PKG: "PKG";
    USAGE: "USAGE";
    WORKSPACE: "WORKSPACE";
    ZOD: "ZOD";
}>;
declare const formatsSchema: z.ZodOptional<z.ZodDefault<z.ZodEnum<{
    LIST: "LIST";
    TABLE: "TABLE";
}>>>;
declare const languageSchema: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
    JS: "JS";
    RS: "RS";
}>>>;
declare const headingsSchema: z.ZodEnum<{
    default: "default";
    description: "description";
    devDependency: "devDependency";
    downloads: "downloads";
    name: "name";
    private: "private";
    required: "required";
    version: "version";
}>;
declare const tableHeadingsSchema: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
    ACTION: "ACTION";
    PKG: "PKG";
    USAGE: "USAGE";
    WORKSPACE: "WORKSPACE";
    ZOD: "ZOD";
}>, z.ZodOptional<z.ZodArray<z.ZodEnum<{
    default: "default";
    description: "description";
    devDependency: "devDependency";
    downloads: "downloads";
    name: "name";
    private: "private";
    required: "required";
    version: "version";
}>>>>>>;
declare const templatesSchema: z.ZodObject<{
    downloadImage: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    emojis: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        default: "default";
        description: "description";
        devDependency: "devDependency";
        downloads: "downloads";
        name: "name";
        private: "private";
        required: "required";
        version: "version";
    }>, z.ZodString>>>;
    registryUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    versionImage: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
declare const defaultTemplates: {
    downloadImage: string;
    emojis: Record<"default" | "description" | "devDependency" | "downloads" | "name" | "private" | "required" | "version", string>;
    registryUrl: string;
    versionImage: string;
};
declare const defaultTableHeadings: Record<"ACTION" | "PKG" | "USAGE" | "WORKSPACE" | "ZOD", ("default" | "description" | "devDependency" | "downloads" | "name" | "private" | "required" | "version")[] | undefined>;
declare const configSchema: z.ZodOptional<z.ZodObject<{
    affectedRegexes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    defaultLanguage: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        JS: "JS";
        RS: "RS";
    }>>>;
    disableEmojis: z.ZodDefault<z.ZodBoolean>;
    disableMarkdownHeadings: z.ZodDefault<z.ZodBoolean>;
    enableToc: z.ZodDefault<z.ZodBoolean>;
    enableUsage: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    headings: z.ZodDefault<z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        ACTION: "ACTION";
        PKG: "PKG";
        USAGE: "USAGE";
        WORKSPACE: "WORKSPACE";
        ZOD: "ZOD";
    }>, z.ZodOptional<z.ZodArray<z.ZodEnum<{
        default: "default";
        description: "description";
        devDependency: "devDependency";
        downloads: "downloads";
        name: "name";
        private: "private";
        required: "required";
        version: "version";
    }>>>>>>>>;
    onlyReadmes: z.ZodDefault<z.ZodBoolean>;
    onlyShowPublicPackages: z.ZodDefault<z.ZodBoolean>;
    removeScope: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    templates: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        downloadImage: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        emojis: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            default: "default";
            description: "description";
            devDependency: "devDependency";
            downloads: "downloads";
            name: "name";
            private: "private";
            required: "required";
            version: "version";
        }>, z.ZodString>>>;
        registryUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        versionImage: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    tocHeading: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    usageFile: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    usageHeading: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    verbose: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>>;
type Config = Partial<z.infer<typeof _configSchema>>;

declare const _configSchema: z.ZodObject<{
    affectedRegexes: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    defaultLanguage: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
        JS: "JS";
        RS: "RS";
    }>>>;
    disableEmojis: z.ZodDefault<z.ZodBoolean>;
    disableMarkdownHeadings: z.ZodDefault<z.ZodBoolean>;
    enableToc: z.ZodDefault<z.ZodBoolean>;
    enableUsage: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    headings: z.ZodDefault<z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
        ACTION: "ACTION";
        PKG: "PKG";
        USAGE: "USAGE";
        WORKSPACE: "WORKSPACE";
        ZOD: "ZOD";
    }>, z.ZodOptional<z.ZodArray<z.ZodEnum<{
        default: "default";
        description: "description";
        devDependency: "devDependency";
        downloads: "downloads";
        name: "name";
        private: "private";
        required: "required";
        version: "version";
    }>>>>>>>>;
    onlyReadmes: z.ZodDefault<z.ZodBoolean>;
    onlyShowPublicPackages: z.ZodDefault<z.ZodBoolean>;
    removeScope: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    templates: z.ZodDefault<z.ZodOptional<z.ZodObject<{
        downloadImage: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        emojis: z.ZodDefault<z.ZodOptional<z.ZodRecord<z.ZodEnum<{
            default: "default";
            description: "description";
            devDependency: "devDependency";
            downloads: "downloads";
            name: "name";
            private: "private";
            required: "required";
            version: "version";
        }>, z.ZodString>>>;
        registryUrl: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        versionImage: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>>;
    tocHeading: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    usageFile: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    usageHeading: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    verbose: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;

export { type Config, actionsSchema, configSchema, defaultTableHeadings, defaultTemplates, formatsSchema, headingsSchema, languageSchema, tableHeadingsSchema, templatesSchema };
