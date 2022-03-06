export const isObject = (val) => {
   return typeof val === 'object' && val !== null
}

// hasOwnProperty 与 in 不同 会忽略原型链上继承的属性
export const hasOwn = (target, key) => {
   return Object.prototype.hasOwnProperty.call(target, key)
}
