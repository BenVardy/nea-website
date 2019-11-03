/**
 * A stack data structure
 */
export default class Stack<T> {
    // Properties
    private arr: T[] = [];

    // Methods
    /**
     * Gets the number of items in the stack
     */
    public get length(): number {
        return this.arr.length;
    }

    /**
     * Removes and returns the top element of the stack
     */
    public pop(): T;
    /**
     * Removes and returns the top n elements from the stack
     * @param n The number of elements to remove
     */
    public pop(n: number): T[];
    public pop(n?: number): (T|T[]) {
        if (this.isEmpty()) throw new Error('Stack is empty');

        if (n === undefined) {
            return this.arr.pop() || [];
        } else {
            return this.arr.splice(Math.max(0, this.arr.length - n), n);
        }
    }

    /**
     * Empties the stack
     */
    public popAll(): T[] {
        let items: T[] = this.arr.slice().reverse();
        this.arr = [];
        return items;
    }

    /**
     * Returns the top element of the stack
     */
    public peek(): T;
    /**
     * Returns the top n elements of the stack
     *
     * @param n The number of elements to remove
     */
    public peek(n: number): T[];
    public peek(n?: number): (T|T[]) {
        if (this.isEmpty()) throw new Error('Stack is empty');

        if (n === undefined) {
            return this.arr.slice(this.arr.length - 1)[0];
        } else {
            let startPoint: number = Math.max(0, this.arr.length - 1 - n);
            return this.arr.slice(startPoint);
        }
    }

    /**
     * Adds an item to the top of the stack
     *
     * @param item The item to add
     */
    public push(item: T): void {
        this.arr.push(item);
    }

    /**
     * Checks if the stack is empty
     */
    public isEmpty(): boolean {
        return this.arr.length === 0;
    }
}
