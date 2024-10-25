export const testInsertions: number[] = [
  15, // Base insertion to build tree depth
  5, // Left-side insertion, simple case
  25, // Right-side insertion, simple case
  3, // Left-Left unbalance
  7, // Balance around left side
  20, // Right-Left case
  30, // Right-Right case to enforce left rotation
  1, // Insert on extreme left
  40, // Insert on extreme right, causing right skew
  35, // Right-Left case in a right-heavy branch
  50, // Another Right-Right case
  45, // Right-heavy insertion, with left rotations
  2, // Fills out the left side, close to root
  60, // Extreme right-heavy node
  17, // Left insertion around middle depth
  27, // Balances around existing right side
  55, // Higher-end value to continue right skew
  4, // Balances small left side cases
  48, // Mid-right insertion near large values
  18, // Adds another node to test rotations at root
];
