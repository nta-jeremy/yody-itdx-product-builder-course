/**
 * @deprecated Use `./remark-image-placeholder` instead.
 *
 * The earlier rehype-side walker (`rehype-image-placeholder`) was
 * replaced because `remark-rehype` strips HTML comments at the
 * mdast→hast boundary — comments never reach the rehype tree, so
 * walking `raw`/`comment` nodes there was a no-op. The current
 * implementation runs BEFORE `remark-rehype` and stamps `data.hName`
 * on the existing mdast `html` node, which `remark-rehype` honours
 * by emitting a hast `element` with that tag.
 */
export {};
