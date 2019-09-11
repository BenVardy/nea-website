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
            return this.arr.splice(this.arr.length - 1, 1)[0];
        } else {
            return this.arr.splice(Math.max(0, this.arr.length - 1 - no), this.arr.length);
        }
    }

    public popAll(): T[] {
        let items: T[] = this.arr.slice().reverse();
        this.arr = [];
        return items;
    }

    public peek(): T;
    public peek(no: number): T[];
    public peek(no?: number): (T|T[]) {
        if (this.isEmpty()) throw new Error('Stack is empty');

        if (no === undefined) {
            return this.arr.slice(this.arr.length - 1)[0];
        } else {
            let startPoint: number = Math.max(0, this.arr.length - 1 - no);
            return this.arr.slice(startPoint);
        }
    }

    public push(item: T): void {
        this.arr.push(item);
    }

    public isEmpty(): boolean {
        return this.arr.length === 0;
    }
}
