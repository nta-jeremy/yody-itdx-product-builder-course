import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';

const markdownText = `
![Cửa sổ ngữ cảnh giới hạn - Nhồi nhiều không tốt hơn](../images/l1.1_03.png)
<!--
> **[IMAGE-INSIGHT]** Minh họa "cửa sổ" có kích thước cố định chứa các token. Khi nhồi quá nhiều, phần token ở đầu bị đẩy ra ngoài và rơi đi. Caption: "Nhồi nhiều ≠ tốt hơn". Phong cách: flat editorial illustration, màu #2a2b86 và #fcaf16.
> *(Prompt tạo hình: "A bounded rectangular window holding tokens as small blocks; extra tokens overflowing and falling out the back — illustrating limited working memory; caption 'more input ≠ better output' — modern flat editorial illustration, confident hand-drawn linework, brand palette deep indigo #2a2b86 and warm amber #fcaf16 on off-white background, Montserrat-like labels, 16:9.")*
-->
`;

async function run() {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true });
  
  const hast = processor.runSync(processor.parse(markdownText));
  console.log("=== HAST ===");
  console.log(JSON.stringify(hast, null, 2));
}

run().catch(console.error);
