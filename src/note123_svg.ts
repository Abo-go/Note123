module Note123
{

export const gFontSize = 30;
export const gFontWidth = 20;
export const gUnderLineSpace = 3;

document.getElementById('svgDiv');
const svg = createSvgNode(document.getElementById('svgDiv'), 'svg');
svg.setAttribute('width', 500);
svg.setAttribute('height', 500);

const rect = createSvgNode(svg, 'rect');
rect.setAttribute('width', 500);
rect.setAttribute('height', 500);
rect.setAttribute('fill', 'pink');

export const g1 = createSvgNode(svg, 'g');
g1.setAttribute('font-size', gFontSize);
g1.setAttribute('text-anchor', 'start');
g1.setAttribute('stroke', 'black');

export function createSvgNode(parent, name)
{
    var node = document.createElementNS('http://www.w3.org/2000/svg', name);
    parent.appendChild(node);
    return node;
}

export function createSvgText(text, x, y)
{
    var node = createSvgNode(g1, 'text');
    node.setAttribute('x', x);
    node.setAttribute('y', y);
    node.textContent = text;
}

// 绘制小节线
export function createBarLine(x, y)
{
    var node = createSvgNode(g1, 'line');
    node.setAttribute('x1', x);
    node.setAttribute('y1', y);
    node.setAttribute('x2', x);
    node.setAttribute('y2', y + gFontSize);

}

export function createLine(startX: number, startY: number, moveX: number, moveY: number)
{
    var node = createSvgNode(g1, 'line');
    node.setAttribute('x1', startX);
    node.setAttribute('y1', startY);
    node.setAttribute('x2', startX + moveX);
    node.setAttribute('y2', startY + moveY);
}

}