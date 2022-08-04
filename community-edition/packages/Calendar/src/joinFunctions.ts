/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export default (a: any, b: any) => {
  if (a && b) {
    return (...args: any[]) => {
      a(...args);
      b(...args);
    };
  }

  return a || b;
};
