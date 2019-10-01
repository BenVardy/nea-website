export default class Questions {
    private root: HTMLElement;

    public constructor(root: HTMLElement) {
        this.root = root;

        this.update();
    }

    public update() {
        this.root.innerHTML = '';

        let matrixMultButton = document.createElement('div');
        matrixMultButton.className = 'button';
        matrixMultButton.innerHTML = 'Matrix Multiplication';
        matrixMultButton.addEventListener('click', () => {
            this.getQuestion('matrixmult', {})
            .then(res => res.json())
            .then(json => {
                console.log(json);
            })
            .catch(err => console.error(err));
        });

        this.root.appendChild(matrixMultButton);
    }

    private async getQuestion(type: string, options: {[key: string]: string}): Promise<any> {
        return fetch(`/api/question/${type}/?${Object.keys(options).reduce((acc: string[], key) => acc.concat(`${key}=${encodeURIComponent(options[key])}`), []).join('&')}`);
    }
}
