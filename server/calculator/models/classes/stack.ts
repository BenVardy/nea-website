export default class Stack<T> {

    private arr: T[] = [];

    public get length(): number {
        return this.arr.length;
    }

    public pop(): T;
    public pop(no: number): T[];
    public pop(no?: number): (T|T[]) {
        if (this.isEmpty()) throw new Error('Stack is empty');

        if (no === undefined) {
            return this.arr.splice(0, 1)[0];
        } else {
            return this.arr.splice(0, Math.min(this.arr.length, no));
        }
    }

    public popAll(): T[] {
        let items: T[] = this.arr.slice();
        this.arr = [];
        return items;
    }

    public peek(): T;
    public peek(no: number): T[];
    public peek(no?: number): (T|T[]) {
        if (this.isEmpty()) throw new Error('Stack is empty');

        if (no === undefined) {
            return this.arr.slice(0, 1)[0];
        } else {
            return this.arr.slice(0, Math.min(this.arr.length, no));
        }
    }

    public push(item: T): void {
        this.arr.unshift(item);
    }

    public isEmpty(): boolean {
        return this.arr.length === 0;
    }
}
