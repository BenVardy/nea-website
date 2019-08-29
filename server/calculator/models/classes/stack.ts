export default class Stack<T> {

    private arr: T[] = [];

    public get length(): number {
        return this.arr.length;
    }

    public pop(no?: number): T[] {
        if (no === undefined) no = 1;

        if (this.isEmpty()) return [];
        return this.arr.splice(0, no);
    }

    public peek(no?: number): T[] {
        if (no === undefined) no = 1;

        if (this.isEmpty()) return [];
        return this.arr.slice(0, no);
    }

    public push(item: T): void {
        this.arr.splice(0, 0, item);
    }

    public isEmpty(): boolean {
        return this.arr.length === 0;
    }
}
