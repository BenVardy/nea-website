import katex from 'katex';

export default function Four0Four(pageRoot: HTMLElement): void {
    katex.render(`
        \\begin{bmatrix}
            3 & -2 & 6 \\\\
            2 & 1 & -8 \\\\
            -2 & -1 & 12
        \\end{bmatrix}
        \\begin{bmatrix}
            2 \\\\ 4 \\\\ 1
        \\end{bmatrix}
        =
        \\begin{bmatrix}
            4 \\\\ 0 \\\\ 4
        \\end{bmatrix}`,
        pageRoot
    );

    let message = document.createElement('div');
    message.innerHTML = 'Page not found';
    pageRoot.appendChild(message);
}
