import type { MarkdownRenderer } from 'vitepress';

const MermaidExample = async (md: MarkdownRenderer) => {
  const defaultRenderer = md.renderer.rules.fence;

  if (!defaultRenderer) {
    throw new Error('defaultRenderer is undefined');
  }

  md.renderer.rules.fence = (tokens, index, options, env, slf) => {
    const token = tokens[index];

    if (token.info.trim() === 'mermaid-example') {
      if (!md.options.highlight) {
        // this function is always created by vitepress, but we need to check it
        // anyway to make TypeScript happy
        throw new Error(
          'Missing MarkdownIt highlight function (should be automatically created by vitepress'
        );
      }
      return '';
    } else if (token.info.trim() === 'mermaid') {
      const key = index;
      return `
      <Suspense> 
      <template #default>
      <Mermaid id="mermaid-${key}"  graph="${encodeURIComponent(token.content)}"></Mermaid>
      </template>
        <!-- loading state via #fallback slot -->
        <template #fallback>
          Loading...
        </template>
      </Suspense>
`;
    }
    if (token.info.trim() === 'warning') {
      return `<div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>${token.content}}</p></div>`;
    }

    if (token.info.trim() === 'note') {
      return `<div class="tip custom-block"><p class="custom-block-title">NOTE</p><p>${token.content}}</p></div>`;
    }

    if (token.info.trim() === 'regexp') {
      // shiki doesn't yet support regexp code blocks, but the javascript
      // one still makes RegExes look good
      token.info = 'javascript';
      // use trimEnd to move trailing `\n` outside if the JavaScript regex `/` block
      token.content = `/${token.content.trimEnd()}/\n`;
      return defaultRenderer(tokens, index, options, env, slf);
    }

    if (token.info.trim() === 'jison') {
      return `<div class="language-">
      <button class="copy"></button>
      <span class="lang">jison</span>
      <pre>
      <code>${token.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
      </pre>
      </div>`;
    }

    return defaultRenderer(tokens, index, options, env, slf);
  };
};

export default MermaidExample;
