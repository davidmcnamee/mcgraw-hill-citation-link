function modifyNode(node: any, urls: string[] | undefined) {
    const newAnchor = document.createElement('span');
    newAnchor.appendChild(node.childNodes[0]);
    function myFunc(e: MouseEvent) {
        if (!urls || urls.length === 0) alert('Error: no url found');
        const newUrls = e.metaKey ? urls.map(u => `https://web.archive.org/web/*/${encodeURI(u)}`) : urls;
        newUrls.forEach(u => window.open(u));
        newAnchor.removeEventListener('click', myFunc);
        newAnchor.click();
        newAnchor.addEventListener('click', myFunc);
    }
    node.appendChild(newAnchor);
    newAnchor.addEventListener('click', myFunc);
}

function extractUrls(text: string): string[] {
    const matches = [...text.matchAll(/(https:\/\/\S+|http:\/\/\S+|\S+\.com\S*|\S*www\S+)/g)]
        .map(m => m[0])
        .map(t => !t.startsWith('http') ? `http://${t}` : t);
    const res = matches.length ? matches : [`https://google.com/search?q=${encodeURI(text)}`];
    return [...new Set(res)];
}

const checkReady = setInterval(() => {
    const citations = ([...document.querySelectorAll('a.epub_footnote > aside > div > div > div > p')] as HTMLParagraphElement[]).map(p => p.innerText.replace(/\s+/g, ' ')).map(p => extractUrls(p));
    const nodes = [...document.querySelectorAll('sup')].map(sup => (sup.childNodes?.[0] as any)?.tagName === 'a' ? sup.childNodes?.[0] : sup);
    if (citations.length === 0 || nodes.length === 0) return;
    clearInterval(checkReady);
    console.log('modifying with: ', JSON.stringify(([...document.querySelectorAll('a.epub_footnote > aside > div > div > div > p')] as HTMLParagraphElement[]).map(p => p.innerText.replace(/\s+/g, ' ')), null, 2), JSON.stringify(citations, null, 2));
    nodes.forEach((n, i) => modifyNode(n, citations[i]));
}, 1000);

// after 30 seconds, stop checking for links
setTimeout(() => {
    clearInterval(checkReady);
}, 30000);
