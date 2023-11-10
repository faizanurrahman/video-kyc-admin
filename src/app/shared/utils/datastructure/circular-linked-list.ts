import { Node } from './node';



export class CircularLinkedList {

  head: any;
  tail: any;

  constructor () {
    this.head = null;
    this.tail = null;
  }


  isEmpty() {
    return this.head === null;
  }


  // Function to insert data in circular linkedlist at beginning
  // Step 1:
  insertAtBeginning(data: any) {
    let newNode = new Node(data);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;

    } else {
      newNode.next = this.head;
      this.tail.next = newNode;
      this.head = newNode;
    }

  }

  // Function to insert from end in circular linkedlist
  insertAtEnd(data: any) {
    let newNode = new Node(data);

    if (this.isEmpty()) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
      this.tail.next = this.head;
    }

  }

  // Function to delete data
  delete(data: any) {
    if (this.isEmpty()) {
      return;
    }

    if (this.head.data === data) {
      this.head = this.head.next;
      this.tail.next = this.head;
      return;
    }

    let current = this.head;
    let previous = null;

    while (current.next !== this.head && current.data !== data) {
      previous = current;
      current = current.next;
    }

    if (current.data === data) {
      previous.next = current.next;
      if (current === this.tail) {
        this.tail = previous;
      }
    }



  }





}
