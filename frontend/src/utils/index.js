export { default as dayjs } from './dayjs'

export function html2text(html) {
    const parser = new DOMParser();
    const dom = parser.parseFromString(html, "text/html");
    return dom.body.textContent.trim();
}
