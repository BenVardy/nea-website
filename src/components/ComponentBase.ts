export default abstract class ComponentBase {
    public className?: string;
    public label?: string;
    public innerHTML?: string;

    public clickHandler?: (e: MouseEvent) => void;
    public changeHandler?: (value: string) => void;

    protected root: HTMLElement;

    public constructor(options?: {[P in keyof ComponentBase]?: ComponentBase[P]}) {
        if (!options) options = {};

        for (let key in options) {
            // Don't override the render method
            if (!Object.getOwnPropertyNames(options).includes(key) || key === 'render') continue;

            (this as {[key: string]: any})[key] = (options as {[key: string]: any})[key];
        }

        this.root = document.createElement('div');
        if (this.className) this.root.classList.add(this.className);
    }

    public render(): HTMLElement {
        return this.root;
    }
}
