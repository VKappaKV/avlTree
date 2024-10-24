/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { Contract } from '@algorandfoundation/tealscript';

type Node = {
  data: uint64;
  left: Node | null;
  right: Node | null;
  height: uint64;
};

// eslint-disable-next-line no-unused-vars
export class AvlTree extends Contract {
  root = GlobalStateMap<uint64, Node>({
    maxKeys: 1,
    allowPotentialCollisions: false,
  });

  createApplication(root: Node): void {
    this.root(0).value = root;
  }

  // Utility function to return the height of the node
  @abi.readonly
  getHeight(node: Node): uint64 {
    return node ? node.height : 0;
  }

  private getBalanceFactor(node: Node): uint64 {
    const res = this.getHeight(node.left!) - this.getHeight(node.right!);
    return node ? res : 0;
  }

  private rightRotate(y: Node): Node {
    const x = y.left!;
    const T3 = x.right;

    // rotate y -> x.right ; x.right -> y.left
    x.right = y;
    y.left = T3;

    // update heights
    y.height = Math.max(this.getHeight(y.left!), this.getHeight(y.right!)) + 1;
    x.height = Math.max(this.getHeight(x.left!), this.getHeight(x.right)) + 1;

    return x;
  }

  private leftRotate(x: Node): Node {
    const y = x.right!;
    const T2 = y.left;

    // rotate x -> y.left ; y.left -> x.right
    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left!), this.getHeight(x.right!)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right!)) + 1;

    return y;
  }

  insert(node: Node | null, data: uint64): Node {
    // standard BST insertion
    if (!node) return { data, left: null, right: null, height: 1 };

    if (data < node.data) {
      node.left = this.insert(node.left, data);
    } else if (data > node.data) {
      node.right = this.insert(node.right, data);
    } else {
      return node;
    }

    node.height = 1 + Math.max(this.getHeight(node.left!), this.getHeight(node.right!));

    const balance = this.getBalanceFactor(node);

    if (balance > 1 && data < node.left!.data) {
      return this.rightRotate(node);
    }

    if (balance < -1 && data < node.right!.data) {
      return this.leftRotate(node);
    }

    if (balance > 1 && data > node.left!.data) {
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }

    if (balance < -1 && data > node.right!.data) {
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  @abi.readonly
  inOrder(node: Node | null) {
    if (node) {
      this.inOrder(node.left);
      log(itob(node.data));
      this.inOrder(node.right);
    }
  }

  add(data: uint64): void {
    this.root(0).value = this.insert(this.root(0).value, data);
  }

  @abi.readonly
  display(): void {
    this.inOrder(this.root(0).value);
  }
}
