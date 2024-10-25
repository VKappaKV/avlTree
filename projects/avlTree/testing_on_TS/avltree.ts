/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-use-before-define */
/* eslint-disable max-classes-per-file */
type TreeNode = {
  data: number;

  left: TreeNode | null;

  right: TreeNode | null;

  height: number;
};

// AVL Tree class
class AVLTree {
  root: TreeNode | null = null;

  // Utility function to get the height of a TreeNode
  getHeight(TreeNode: TreeNode | null): number {
    if (!TreeNode) return 0;
    return TreeNode.height;
  }

  // Utility function to get the balance factor of a TreeNode
  getBalance(TreeNode: TreeNode | null): number {
    if (!TreeNode) return 0;
    return this.getHeight(TreeNode.left) - this.getHeight(TreeNode.right);
  }

  // Right Rotate to balance the AVL Tree
  rightRotate(y: TreeNode): TreeNode {
    const x = y.left!;
    const T3 = x.right;

    // Perform rotation
    x.right = y;
    y.left = T3;

    // Update heights
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x; // Return new root
  }

  // Left Rotate to balance the AVL Tree
  leftRotate(x: TreeNode): TreeNode {
    const y = x.right!;
    const T2 = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    // Update heights
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y; // Return new root
  }

  // Insert a TreeNode in the AVL Tree and balance the tree
  insert(TreeNode: TreeNode | null, data: number): TreeNode {
    // 1. Standard BST Insertion
    if (!TreeNode) return { data, left: null, right: null, height: 1 };

    if (data < TreeNode.data) {
      TreeNode.left = this.insert(TreeNode.left, data);
    } else if (data > TreeNode.data) {
      TreeNode.right = this.insert(TreeNode.right, data);
    } else {
      return TreeNode; // Duplicate values are not allowed
    }

    // 2. Update height of the current TreeNode
    TreeNode.height = 1 + Math.max(this.getHeight(TreeNode.left), this.getHeight(TreeNode.right));

    // 3. Get the balance factor to check if it's unbalanced
    const balance = this.getBalance(TreeNode);

    // 4. Balance the TreeNode if it's unbalanced
    // Left Left Case
    if (balance > 1 && data < TreeNode.left!.data) {
      return this.rightRotate(TreeNode);
    }
    // Right Right Case
    if (balance < -1 && data > TreeNode.right!.data) {
      return this.leftRotate(TreeNode);
    }
    // Left Right Case
    if (balance > 1 && data > TreeNode.left!.data) {
      TreeNode.left = this.leftRotate(TreeNode.left!);
      return this.rightRotate(TreeNode);
    }
    // Right Left Case
    if (balance < -1 && data < TreeNode.right!.data) {
      TreeNode.right = this.rightRotate(TreeNode.right!);
      return this.leftRotate(TreeNode);
    }

    return TreeNode;
  }

  // Recursive in-order traversal to display the AVL Tree
  inOrder(TreeNode: TreeNode | null): void {
    if (TreeNode) {
      this.inOrder(TreeNode.left);
      console.log(TreeNode.data);
      this.inOrder(TreeNode.right);
    }
  }

  // Insert data into the AVL Tree
  add(data: number): void {
    this.root = this.insert(this.root, data);
  }

  // Display the AVL Tree
  display(): void {
    this.inOrder(this.root);
  }
}

// Test the AVLTree class
const avl = new AVLTree();
avl.add(10);
avl.add(20);
avl.add(30);
avl.add(25);
avl.display();
