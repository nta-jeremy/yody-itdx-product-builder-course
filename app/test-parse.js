async function run() {
  const { default: React } = await import('react');
  const { renderToString } = await import('react-dom/server');
  const { default: Markdown } = await import('react-markdown');
  const { default: remarkGfm } = await import('remark-gfm');
  const { remarkImagePlaceholder, REHYPE_IMAGE_PLACEHOLDER_TAG } = await import('./src/components/markdown/remark-image-placeholder.js');

  const markdownText = `
# Test Session

![Cửa sổ ngữ cảnh](../images/l1.1_03.png)

<!--
> **[IMAGE-INSIGHT]** This is a hidden prompt that should be completely stripped.
> *(Prompt tạo hình: "hidden")*
-->

> **[IMAGE-INSIGHT]** This is a visible placeholder that should be rendered.
> *(Prompt tạo hình: "visible")*

Some text after.
`;

  const components = {
    [REHYPE_IMAGE_PLACEHOLDER_TAG]: ({ "data-prompt": prompt }) => {
      return React.createElement("div", { className: "placeholder", "data-prompt": prompt }, `Placeholder: ${prompt}`);
    }
  };

  const html = renderToString(
    React.createElement(Markdown, {
      remarkPlugins: [remarkGfm, remarkImagePlaceholder],
      components: components
    }, markdownText)
  );
  console.log("=== RENDERED HTML ===");
  console.log(html);
}

run().catch(console.error);
