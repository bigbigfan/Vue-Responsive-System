import { track, trigger } from "./effect"
import { reactive } from "./reactive"
import { isObject } from "../shared"
export function myRef(val) {
    if (isRef(val)) {
        return val
    }
    return new RefImpl(val)
}

// 判断是否是ref响应式数据
export function isRef(val) {
    return !!(val && val.__isRef) // 强转Boolean 
}

// ref 就是利用面向对象的 的getter 和 setter 拦截了value属性的读写 分别进行 track 和 trigger  这也是为什么vue3操作ref 的.value属性

class RefImpl {
    constructor(val) {
        this.__isRef = true  // 判断标记
        this._val = convert(val)   
    }
   
    get value() {// 劫持了value
      track(this, 'get', 'value') 
      return this._val
    }
    
    set value(val) {// 劫持了value
      if(val !== this._val) {
        this._val = convert(val)  
        trigger(this, 'set', 'value')
      }
    }
    
} 

// ref也可以支持复杂数据结构
function convert (target) {
   return  isObject(target) ? reactive(target) : target
}

