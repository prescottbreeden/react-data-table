import { curry, get } from 'lodash';

export const randomString = () => {
  return Math.random().toString(36).substring(7);
};

export const mergeObjects = <T>(obj1: T, obj2: Partial<T>): T => {
  return {
    ...obj1,
    ...obj2,
  };
};

export const prop = curry((property: string, object: any) => {
  return get(object, property);
});

/**
 *   firstMatch :: [[fn -> bool, fn -> fn(x)]] -> x -> fn(x)
 *
 *   Takes a list of [predicate, transformer] pairs and an arg. The
 *   arg is applied to each predicate function until one returns a truthy value,
 *   at which point the transformer function is applied to the arg and returned.
 *
 *   @example
 *   // returns (x: number) => f(x)
 *   const waterAtTemp = firstMatch([
 *     [ equals(0), (T: number) => `Water freezes at ${T} deg C.` ],
 *     [ equals(100), (T: number) => `Water boils at ${T} deg C.` ],
 *     [ () => true, (T: number) => `Nothing special happens at ${T} deg C.` ],
 *   ]);
 */
// export const firstMatch = curry((fns: Function[][], arg: any) => {
//   return fns.reduce((prev: any, curr: Function[]) => {
//     return isNil(prev) && curr[0](arg) ? curr[1](arg) : prev;
//   }, null);
// });
