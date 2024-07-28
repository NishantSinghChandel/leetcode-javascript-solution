const showdown = require("showdown");
const hljs = require("highlight.js");
// Load specific language modules (or load all if needed)
hljs.registerLanguage(
  "plaintext",
  require("highlight.js/lib/languages/plaintext")
);
hljs.registerLanguage(
  "javascript",
  require("highlight.js/lib/languages/javascript")
);
const renderCode = function (code, lang = "plaintext") {
  const str = code.replace(/¨D/g, "$");
  let html = "";
  let cls = "";
  if (!lang || !hljs.getLanguage(lang)) {
    console.warn(
      `Language '${lang}' is not loaded or invalid, falling back to auto-detection.`
    );
    html = hljs.highlightAuto(str).value;
  } else {
    try {
      html = hljs.highlight(lang, str).value;
    } catch (e) {
      console.error(`Error highlighting code: ${e.message}`);
      html = hljs.highlightAuto(str).value;
    }
  }
  cls = lang ? ` lang-${lang}` : "";
  return `<pre><code class="hljs${cls}">${html}\n</code></pre>`;
};

const renderer = new showdown.Converter({
  ghCompatibleHeaderId: true,
  headerLevelStart: 1,
  parseImgDimensions: true,
  strikethrough: true,
  tables: true,
  tasklists: true,
  smartIndentationFix: true,
  requireSpaceBeforeHeadingText: true,
  extensions: [
    () => {
      const codes = {};
      return [
        {
          type: "lang",
          regex: /#([\s\S]*?)##/,
          replace: "##",
        },
        {
          type: "lang",
          regex: /```(.*?)```/g,
          replace: (_, code) => `<code>${code}</code>`,
        },
        {
          type: "lang",
          regex: /```([a-zA-Z0-9_\-]*)\n([\s\S]*?)\n```/g,
          replace: (_, lang, code, offset) => {
            codes[offset] = {
              lang,
              code,
            };
            return `<!--CODEBLOCK_${offset}-->`;
          },
        },
        {
          type: "output",
          regex: /<a\s+href="/g,
          replace: '<a target="_blank" href="',
        },
        {
          type: "output",
          regex: /<!--CODEBLOCK_(\d+)-->/g,
          replace: (_, id) => {
            return renderCode(codes[id].code, codes[id]?.lang);
          },
        },
        {
          type: "output",
          regex: /<!--[\s\S]*?-->/g,
          replace: "",
        },
      ];
    },
  ],
});

const markdownRender = function (markdown) {
  return renderer.makeHtml(markdown);
};

module.exports = markdownRender;
