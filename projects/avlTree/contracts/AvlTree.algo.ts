/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
import { Contract } from '@algorandfoundation/tealscript';

type Node = {
  data: uint64;
  left: Node | null;
  right: Node | null;
  leftHeight: uint64;
  rightHeight: uint64;
};

// eslint-disable-next-line no-unused-vars
export class AvlTree extends Contract {
  root = GlobalStateMap<uint64, Node>({
    maxKeys: 1,
    allowPotentialCollisions: false,
  });

  list = GlobalStateMap<uint64, uint64[]>({
    maxKeys: 1,
    allowPotentialCollisions: false,
  });

  createApplication(root: Node): void {
    this.root(0).value = root;
  }

  // Utility function to return the height of the node
  @abi.readonly
  getLeftHeight(node: Node | null): uint64 {
    return node ? node.leftHeight : 0;
  }

  @abi.readonly
  getRightHeight(node: Node | null): uint64 {
    return node ? node.rightHeight : 0;
  }

  private updateHeights(node: Node): void {
    node.leftHeight = this.getLeftHeight(node.left) + 1;
    node.rightHeight = this.getRightHeight(node.right) + 1;
  }

  /*
    private getBalanceFactor(node: Node): uint64 {
    const res = this.getHeight(node.left!) - this.getHeight(node.right!);
    return node ? res : 0;
  }
 */

  private rightRotate(y: Node): Node {
    const x = y.left!;
    const T3 = x.right;

    // rotate y -> x.right ; x.right -> y.left
    x.right = y;
    y.left = T3;

    // update heights
    this.updateHeights(y);
    this.updateHeights(x);

    return x;
  }

  private leftRotate(x: Node): Node {
    const y = x.right!;
    const T2 = y.left;

    // rotate x -> y.left ; y.left -> x.right
    y.left = x;
    x.right = T2;

    this.updateHeights(x);
    this.updateHeights(y);

    return y;
  }

  insert(node: Node | null, data: uint64): Node {
    // standard BST insertion
    if (!node) return { data, left: null, right: null, leftHeight: 1, rightHeight: 1 };

    if (data < node.data) {
      node.left = this.insert(node.left, data);
    } else if (data > node.data) {
      node.right = this.insert(node.right, data);
    } else {
      return node;
    }

    this.updateHeights(node);

    // check balance by comparing left and right tree heights
    if (this.getLeftHeight(node) > this.getRightHeight(node) + 1) {
      // Left-heavy tree
      if (data < node.left!.data) {
        // Left-left case
        return this.rightRotate(node);
      }
      // Left-right case
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }

    if (this.getRightHeight(node) > this.getLeftHeight(node) + 1) {
      // Right-heavy tree
      if (data > node.right!.data) {
        // Right-right case
        return this.leftRotate(node);
      }
      // Right-left case
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
    if (data < 0) Error("Data can't be < 0");
    this.root(0).value = this.insert(this.root(0).value, data);
  }

  @abi.readonly
  display(): void {
    this.inOrder(this.root(0).value);
  }
}
