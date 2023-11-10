import { Node as Nodes } from './node';



export class LinkedList {

  head: Nodes | null;

  constructor () {
    this.head = null;
  }

  // Function to check if linkedlist is empty
  isEmpty() {
    return this.head === null;
  }

  // Function to insert data a begining
  insertAtBegining(data: any) {
    let node = new Nodes(data);
    node.next = this.head;
    this.head = node;
  }

  // Function to insert data at end
  insertAtEnd(data: any) {
    let newNode = new Nodes(data);


    // if list is empty
    if (this.isEmpty()) {
      this.head = newNode;
      return;
    }

    let current = this.head!;
    while (current.next) {
      current = current.next;
    }

    current.next = newNode;

  }


  // Function to delete a node from the linked list
  delete(data: any) {


    if (this.head === null) {
      return;
    }


    if (this.head.data === data) {
      this.head = this.head.next;
      return;
    }

    // let current = <Node>this.head;
    // while (current.next) {
    //   if (current.next.data === data) {
    //     current.next = current.next.next;
    //     break;
    //   }
    // }

    let current = this.head;
    let previous: Nodes | null = null;

    while (current && current.data !== data) {
      previous = current;
      current = current.next!;
    }

    if (current) {
      previous!.next = current.next;
    } else {
      throw new Error('data not found');
    }



  }

  // Function to search data
  search(item: any) {

    if (this.head === null) {
      return false;
    }

    let current = this.head;
    while (current.next) {
      if (current.data === item) {
        return true;
      }
    }

    return false;
  }

  // Function to add data at specific location
  insertAtIndex(index: number, data: any) {

    let newNode = new Nodes(data);

    let currentIndex = -1;
    let currentNode = this.head;
    let previousNode: Nodes | null = null;

    while (currentNode && currentNode.next && index > 0) {

      previousNode = currentNode;
      currentNode = currentNode.next;
      index--;

    }

    if (index === 0) {
      if (previousNode) {
        previousNode.next = newNode;
        newNode.next = currentNode;
      } else {
        this.insertAtBegining(data);
      }

    } else {
      throw Error('Index not found');
    }


  }


  // Function to traverse the linked list
  toArray() {
    let data = [];
    let current = this.head!;
    while (current) {
      data.push(current.data);
      current = current.next!;
    }
    return data;
  }






}
