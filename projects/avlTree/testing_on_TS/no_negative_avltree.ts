/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
import { testInsertions } from './tests';

type TreeNodeAVM = {
  data: number;
  left: TreeNodeAVM | null;
  right: TreeNodeAVM | null;
  leftHeight: number; // Height of the left subtree
  rightHeight: number; // Height of the right subtree
};

// AVL Tree class
class AVLTreeAVM {
  root: TreeNodeAVM | null = null;

  // Utility function to get the height of a TreeNodeAVM's left and right subtrees
  getLeftHeight(node: TreeNodeAVM | null): number {
    return node ? node.leftHeight : 0;
  }

  getRightHeight(node: TreeNodeAVM | null): number {
    return node ? node.rightHeight : 0;
  }

  // Update the left and right heights of a given node
  updateHeights(node: TreeNodeAVM): void {
    node.leftHeight = this.getLeftHeight(node.left) + 1;
    node.rightHeight = this.getRightHeight(node.right) + 1;
  }

  // Perform right rotation for left-heavy unbalance
  rightRotate(y: TreeNodeAVM): TreeNodeAVM {
    const x = y.left!;
    const T3 = x.right;

    // Rotate nodes
    x.right = y;
    y.left = T3;

    // Update heights
    this.updateHeights(y);
    this.updateHeights(x);

    return x;
  }

  // Perform left rotation for right-heavy unbalance
  leftRotate(x: TreeNodeAVM): TreeNodeAVM {
    const y = x.right!;
    const T2 = y.left;

    // Rotate nodes
    y.left = x;
    x.right = T2;

    // Update heights
    this.updateHeights(x);
    this.updateHeights(y);

    return y;
  }

  // Insert a node in the AVL Tree and balance the tree
  insert(node: TreeNodeAVM | null, data: number): TreeNodeAVM {
    if (!node) {
      return { data, left: null, right: null, leftHeight: 1, rightHeight: 1 };
    }

    // Perform standard BST insert
    if (data < node.data) {
      node.left = this.insert(node.left, data);
    } else if (data > node.data) {
      node.right = this.insert(node.right, data);
    } else {
      return node; // Duplicate data not allowed
    }

    // Update the left and right subtree heights
    this.updateHeights(node);

    // Check balance by comparing leftHeight and rightHeight
    if (this.getLeftHeight(node) > this.getRightHeight(node) + 1) {
      // Left-heavy tree
      if (data < node.left!.data) {
        // Left-Left case
        return this.rightRotate(node);
      }
      // Left-Right case
      node.left = this.leftRotate(node.left!);
      return this.rightRotate(node);
    }
    if (this.getRightHeight(node) > this.getLeftHeight(node) + 1) {
      // Right-heavy tree
      if (data > node.right!.data) {
        // Right-Right case
        return this.leftRotate(node);
      }
      // Right-Left case
      node.right = this.rightRotate(node.right!);
      return this.leftRotate(node);
    }

    return node;
  }

  // Public method to add data into the AVL Tree
  add(data: number): void {
    if (data < 0) throw new Error('Negative values are not allowed in number');
    this.root = this.insert(this.root, data);
  }

  // In-order traversal to display the AVL Tree
  inOrder(node: TreeNodeAVM | null): void {
    if (node) {
      this.inOrder(node.left);
      // console.log(node.data, node.leftHeight, node.rightHeight, node);
      console.log(node.data);
      this.inOrder(node.right);
    }
  }

  // Display the AVL Tree in order
  display(): void {
    this.inOrder(this.root);
  }

  toJSON(node: TreeNodeAVM | null = this.root): any {
    if (!node) return null;
    return {
      data: node.data,
      left: this.toJSON(node.left),
      right: this.toJSON(node.right),
    };
  }
}

// Test the AVLTree class
const avl2 = new AVLTreeAVM();

testInsertions.forEach((value) => avl2.add(value));
console.log('In-order Traversal of AVL Tree:');
avl2.display();
const treeJSON = avl2.toJSON();
console.log(JSON.stringify(treeJSON));
