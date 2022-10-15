import { curry, get } from 'lodash';

/**
 * Generates a random string.  Neato aye?
 */
export const randomString = () => {
  return Math.random().toString(36).substring(7);
};

/**
 * const g = n => n + 1;
 * const f = n => n * 2;
 * // replace `x => f(g(x))` with `compose(f, g)`
 * const h = compose(f, g);
 * h(20); //=> 42
 * @param fns comma separated functions
 * @returns new function
 */
export const compose = (...fns: Function[]) => (x: any) =>
  fns.reduceRight((y: any, f: any) => f(y), x);

export const mergeObjects = <T>(obj1: T, obj2: Partial<T>): T => {
  return {
    ...obj1,
    ...obj2,
  };
};

export const cMergeObjects = curry((obj1: any, obj2: any) => {
  return mergeObjects(obj1, obj2);
});

/**
 * generate curried function for easy mapping that takes the property, then an object
 * @param property string of the key to extract from object
 * @param object the current object
 * @returns curried function
 */
export const prop = curry((property: string, object: any) => {
  return get(object, property);
});

/**
 * generate curried function for easy mapping that takes an object, then a property
 * @param object the current object
 * @param property string of the key to extract from object
 * @returns curried function
 */
export const propObject = curry((object: any, property: string) => {
  return get(object, property);
});

/**
 * Gets the year as a string from a date object
 * @function
 * @param { Date } value Date value to get the year from
 * @returns string
 */
export const getFullYear = (value: Date): string => {
  return new Date(value).getFullYear().toString();
};

/**
 * takes a function requiring 2 arguments and an array of functions. each func
 * in the array will be applied against the argument of the returned function
 * and then passed as the arguments to the first function.
 * @example converge(concat, [prop('firstName'), prop('lastName')]);
 * @param fn the function to be called last
 * @param wraps array of functions to supply as arguments to fn
 * @returns (...args) => fn(...args)
 */
export const converge = (fn: Function, wraps: Function[]) => (arg: any) =>
  fn(...wraps.map((wrap: Function) => wrap(arg)));

// removed string method .concat to avoid run time crash if null or undefined
// great use case for using Maybe pattern here
export const concatEnd = curry(
  (toEnd: string, toFront: string) => `${toFront}${toEnd}`
);

// removed string method .concat to avoid run time crash if null or undefined
// great use case for using Maybe pattern here
export const concatFront = curry(
  (toFront: string, toEnd: string) => `${toFront}${toEnd}`
);

export const len = (arr: any[]): number => {
  return arr ? arr.length : 0;
};

export const notNull = (val: any) => {
  return not(isNull(val));
};

export const isNull = (val: any): boolean => {
  return val === null;
};

export const not = (val: any) => {
  return !!!val;
};

export const both = curry((a: Function, b: Function, c: any) => {
  return a(c) && b(c);
});

export const either = curry((a: Function, b: Function, c: any) => {
  return a(c) || b(c);
});

export const isFalse = (val: any) => {
  return val === false;
};

export const isTruthy = (val: any) => {
  return !!val;
};

// wrapStringInParens :: string -> string
export const wrapStringInParens = (str: string) => {
  return `(${str})`;
};

// safeGet :: obj -> string -> a | undefined
export function safeGet<T>(entity: T) {
  return function (property: keyof T) {
    return prop(property as string, entity);
  };
}

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

// always :: a -> b -> a
export const always = curry((a: any, _: any) => a);

// identity :: a -> a
export const identity = (value: any) => value;

