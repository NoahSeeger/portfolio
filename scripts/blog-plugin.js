import path from "node:path";
import { readPosts, metadataOnly } from "./lib/blog-content.js";
import { generateDocuments } from "./generate-rss.js";

const prefix = "virtual:blog/";
export function blogPlugin() {
  let root;
  let development = false;
  let posts;
  let now;
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
      for (const folder of development ? ["published", "drafts"] : ["published"]) {
        this.addWatchFile(path.join(root, "src/content/blog", folder));
      }
      snapshot();
    },
    resolveId(id) {
      if (id.startsWith(prefix)) return `\0${id}`;
    },
    load(id) {
      if (!id.startsWith(`\0${prefix}`)) return;
      const name = id.slice(prefix.length + 1);
      const all = snapshot();
      if (name === "index") {
        const loaders = all.map((post) => `${JSON.stringify(post.slug)}: () => import(${JSON.stringify(`${prefix}post/${post.slug}`)}).then(m => m.default)`);
        return `export default ${JSON.stringify(all.map(metadataOnly))};\nexport const loaders = {${loaders.join(",")}};`;
      }
      if (name === "search") {
        const searchable = all.filter((post) => post.status !== "archived");
        return `${searchable.map((post, index) => `import body${index} from ${JSON.stringify(`${prefix}post/${post.slug}`)};`).join("\n")}\nexport default [${searchable.map((post, index) => `({...${JSON.stringify(metadataOnly(post))}, content: body${index}})`).join(",")}];`;
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
        if (!file.startsWith(directory) || !file.endsWith(".md")) return;
        posts = undefined;
        now = Date.now();
        server.moduleGraph.invalidateAll();
        server.ws.send({ type: "full-reload" });
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
