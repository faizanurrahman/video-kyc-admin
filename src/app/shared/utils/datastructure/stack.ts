export class Stack {
  private items: any[] = [];
  private top: number = -1;

  constructor() {
    this.items = [];
    this.top = -1;
  }

  isEmpty() {
    return this.top === -1;
  }

  // Push an element onto the stack
  push(element: any) {
    this.items[++this.top] = element;
  }

  // Pop an element off the stack
  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }

    return this.items[--this.top];
  }

  currentItems() {
    const items = [];
    for (let i = 0; i <= this.top; i++) {
      items.push(this.items[i]);
    }
    return items;
  }

  size() {
    return this.top + 1;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error('stack empty');
    }
    return this.items[this.top];
  }
}

