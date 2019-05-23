import MarkdownIt from "markdown-it";
import './index.css';
import "highlightjs/styles/dracula.css";

window.mdit = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
})
    .use(require("markdown-it-container"), "tip")
    .use(require("markdown-it-container"), "warning")
    .use(require("markdown-it-container"), "danger")
    .use(require("markdown-it-katex"))
    .use(require("markdown-it-underline"))
    .use(require("markdown-it-emoji"))
    .use(require("markdown-it-footnote"))
    .use(require("markdown-it-mark"))
    .use(require("markdown-it-sup"))
    .use(require("markdown-it-sub"))
    .use(require("markdown-it-checkbox"))
    .use(require("markdown-it-abbr"))
    .use(require("markdown-it-toc-and-anchor").default, {
        anchorLink: false
    })
    .use(require("markdown-it-highlightjs"))
    .use(require("markdown-it-plantuml"))
    .use(require("markdown-it-multimd-table"))
    .use(require("markdown-it-meta"));

let defaultRender =
    window.mdit.renderer.rules.link_open ||
    function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
    };
window.mdit.renderer.rules.link_open = function (
    tokens,
    idx,
    options,
    env,
    self
) {
    var aIndex = tokens[idx].attrIndex("target");
    if (aIndex < 0) {
        tokens[idx].attrPush(["target", "_blank"]);
    } else {
        tokens[idx].attrs[aIndex][1] = "_blank";
    }
    return defaultRender(tokens, idx, options, env, self);
};

window.insertStyle = function (style) {
    let ele = document.createElement("style");
    let head = document.head || document.getElementsByTagName("head")[0];
    ele.type = "text/css";
    let node = document.createTextNode(style);
    ele.appendChild(node);
    head.appendChild(ele);
},
    window.renderHTML = function (str) {
        try {
            window.markdownText = str;
            let r = window.mdit.render(str, {
                tocCallback: function (tocMarkdown, tocArray, tocHtml) {
                    let data = {
                        Key: "TOC",
                        Value: JSON.stringify(tocArray)
                    };
                    window.external.notify(JSON.stringify(data));
                }
            });
            let container = document.getElementById("previewContainer");
            container.innerHTML = r;
        } catch (ex) {
            console.log(ex);
        }
    },
    window.exportHoleHTML = function (title, style) {
        let r = window.mdit.render(window.markdownText);
        let basicHTML = `<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>${title}</title><style>${style}</style></head><body>${r}</body></html>`;
        let data = {
            Key: "HTML",
            Value: basicHTML
        };
        window.external.notify(JSON.stringify(data));
    },
    window.exportOnlyHTML = function (title) {
        let r = window.mdit.render(window.markdownText);
        let basicHTML = `<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title>${title}</title></head><body>${r}</body></html>`;
        let data = {
            Key: "HTML",
            Value: basicHTML
        };
        window.external.notify(JSON.stringify(data));
    },
    window.getHTMLWithStyle = function (style) {
        let r = window.mdit.render(window.markdownText);
        let basicHTML = `<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1"><title></title><style>${style}</style></head><body>${r}</body></html>`;
        return basicHTML;
    },
    window.getRenderHTML = function () {
        let r = window.mdit.render(window.markdownText);
        return r;
    }