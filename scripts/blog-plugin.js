import path from "node:path";
import { readPosts, metadataOnly } from "./lib/blog-content.js";
import { generateDocuments } from "./generate-rss.js";
import { localCoverFile, noteThumbnail } from "./lib/note-thumbnail.js";

const prefix = "virtual:blog/";
export function blogPlugin() {
  let root;
  let development = false;
  let posts;
  let now;
  const coverFiles = new Set();
  const snapshot = () => posts ??= readPosts(root, { includeDrafts: development, now });
  return {
    name: "portfolio-blog-content",
    configResolved(config) {
      root = config.root;
      // `vite build --mode development` must still exclude private drafts.
      development = config.command === "serve" && !config.isPreview;
    },
    buildStart() {
      now = Date.now();
      posts = undefined;
      coverFiles.clear();
      for (const folder of development ? ["published", "drafts"] : ["published"]) {
        this.addWatchFile(path.join(root, "src/content/blog", folder));
      }
      snapshot();
    },
    resolveId(id) {
      if (id.startsWith(prefix)) return `\0${id}`;
    },
    async load(id) {
      if (!id.startsWith(`\0${prefix}`)) return;
      const name = id.slice(prefix.length + 1);
      const all = snapshot();
      if (name === "index") {
        const loaders = all.map((post) => `${JSON.stringify(post.slug)}: () => import(${JSON.stringify(`${prefix}post/${post.slug}`)}).then(m => m.default)`);
        const imports = [];
        const entries = all.map((post, index) => {
          const cover = localCoverFile(root, post.heroImage);
          if (cover) imports.push(`import thumbnail${index} from ${JSON.stringify(`${prefix}thumbnail/${post.slug}`)};`);
          return `{...${JSON.stringify(metadataOnly(post))}${cover ? `, thumbnail: thumbnail${index}` : ""}}`;
        });
        return `${imports.join("\n")}\nexport default [${entries.join(",")}];\nexport const loaders = {${loaders.join(",")}};`;
      }
      if (name === "search") {
        const searchable = all;
        return `${searchable.map((post, index) => `import body${index} from ${JSON.stringify(`${prefix}post/${post.slug}`)};`).join("\n")}\nexport default [${searchable.map((post, index) => `({...${JSON.stringify(metadataOnly(post))}, content: body${index}})`).join(",")}];`;
      }
      if (name.startsWith("thumbnail/")) {
        const post = all.find((post) => post.slug === name.slice(10));
        const file = post && localCoverFile(root, post.heroImage);
        if (!file) throw new Error(`Unavailable note thumbnail: ${name}`);
        coverFiles.add(file);
        this.addWatchFile(file);
        const bytes = await noteThumbnail(root, file);
        if (development) return `export default ${JSON.stringify(`data:image/webp;base64,${bytes.toString("base64")}`)};`;
        const reference = this.emitFile({ type: "asset", name: `${post.slug}-thumbnail.webp`, source: bytes });
        return `export default import.meta.ROLLUP_FILE_URL_${reference};`;
      }
      if (name.startsWith("post/")) {
        const post = all.find((post) => post.slug === name.slice(5));
        if (!post) throw new Error(`Unavailable blog post: ${name.slice(5)}`);
        return `export default ${JSON.stringify(post.content)};`;
      }
      throw new Error(`Unknown blog module: ${name}`);
    },
    configureServer(server) {
      const directory = path.join(root, "src/content/blog") + path.sep;
      const changed = (file) => {
        if (!(file.startsWith(directory) && file.endsWith(".md")) && !coverFiles.has(file)) return;
        posts = undefined;
        now = Date.now();
        for (const environment of Object.values(server.environments)) {
          environment.moduleGraph.invalidateAll();
          environment.hot.send({ type: "full-reload", path: "*" });
        }
      };
      for (const event of ["add", "change", "unlink"]) server.watcher.on(event, changed);
      server.httpServer?.once("close", () => {
        for (const event of ["add", "change", "unlink"]) server.watcher.off(event, changed);
      });
    },
    generateBundle() {
      for (const [fileName, source] of Object.entries(generateDocuments(snapshot(), { now }))) {
        this.emitFile({ type: "asset", fileName, source });
      }
    },
  };
}
