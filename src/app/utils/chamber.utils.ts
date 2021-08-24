import { ActivatedRouteSnapshot } from "@angular/router";

export function getRouteParamKey(key: string, route: ActivatedRouteSnapshot, recursiveParent: boolean = false) {
  const value = route.params[key];
  if (value) {
    return value;
  }

  if (recursiveParent && route.parent) {
    return getRouteParamKey(key, route.parent, recursiveParent);
  } else {
    return null;
  }
}

export function capitalize(str: string) {
  if (!str) {
    return '';
  } else if (str.length < 2) {
    return str.toUpperCase();
  }
  const Str = str.toLowerCase();
  const capitalized = Str.charAt(0).toUpperCase() + Str.slice(1);
  return capitalized;
}

/**
 * Check Primitive
 * ---
 *
 * Check if argument is a primitive by evaluating via `typeOf`.
 *
 * @param {*} obj
 * @returns {boolean}
 */

 export const checkPrimitive = (obj) => {
  if (obj === undefined) {
    console.warn(`'obj' argument was undefined; returning true...`);
    return true;
  }
  const objType = typeof(obj);
  const isPrimitive = (
    obj === null ||
    objType === 'boolean' ||
    objType === 'number' ||
    objType === 'bigint' ||
    objType === 'string' ||
    objType === 'symbol'
  );
  return isPrimitive;
};

export type Primitive =
  string |
  number |
  boolean |
  bigint |
  undefined |
  null |
  symbol;

/**
 * Copy Object
 * ---
 *
 * Deep copy object via recursion call.
 * - for primitives, just return the given argument.
 * - for Dates, call new Date instance with argument and return it
 * - for arrays, create new array and push recursive call for each item
 * - for object, create new object and set each key to recursive call
 *
 * @param {*} obj 
 * @returns {object}
 */
export function clone<T>  (obj): T  {
  const isPrimitive = checkPrimitive(obj);
  if (isPrimitive) {
    return obj;
  }
  if (obj.constructor === Date) {
    const newDate = new Date(obj);
    return newDate as unknown as T;
  }

  let copy;
  if (obj.constructor === Array) {
    copy = [];
    for (const item of <Array<any>> obj) {
      const copyItem = clone(item);
      copy.push(copyItem);
    }
  } else if (obj.constructor === Object) {
    copy = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const copyItem = clone(obj[key]);
      copy[key] = copyItem;
    }
  } else if (obj.constructor === Map) {
    copy = new Map();
    (<Map<any, any>> obj).forEach((value, key) => {
      const copyItem = clone(value);
      copy.set(key, copyItem);
    });
  }

  const typedCopy = copy as T;
  return typedCopy;
};

/**
 * Copy Object
 * ---
 *
 * Deep copy object via recursion call.
 * - for primitives, just return the given argument.
 * - for Dates, call new Date instance with argument and return it
 * - for arrays, create new array and push recursive call for each item
 * - for object, create new object and set each key to recursive call
 *
 * @param {*} obj 
 * @returns {object}
 */
 export const copyObj = (obj) => {
  const isPrimitive = checkPrimitive(obj);
  if (isPrimitive) {
    return obj;
  }
  if (obj.constructor === Date) {
    return new Date(obj);
  }
  let copy;
  if (obj.constructor === Array) {
    copy = [];
    for (const item of obj) {
      const copyItem = copyObj(item);
      copy.push(copyItem);
    }
  } else if (obj.constructor === Object) {
    copy = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
      const copyItem = copyObj(obj[key]);
      copy[key] = copyItem;
    }
  }

  return copy;
};