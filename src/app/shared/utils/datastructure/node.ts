export class Node {
  public data: any;
  public next: Node | null;

  constructor (data: any) {
    this.data = data;
    this.next = null;
  }

  // get getData() {
  //   return this.data;
  // }
  // set setData(newData: any) {
  //   this.data = newData;
  // }

  // get getNext() {
  //   return this.next;
  // }

  // set setNext(newNext: Node | null) {
  //   this.next = newNext;
  // }
}