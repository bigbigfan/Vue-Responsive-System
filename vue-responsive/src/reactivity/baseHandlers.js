// 独立维护proxy的拦截函数， 这里只拦截 get 和 set 操作

import { reactive } from "./reactive"
import { isObject, hasOwn } from "../shared" 
import { trigger } from "./effect"
const get = createGetter()
const set = createSetter()
const shallowReactiveGet = createGetter(true)

// 属性读取操作 捕捉器配置
function createGetter(shallow = false) {
   return function get (target, key, receiver) {
       const res = Reflect.get(target, key, receiver) 
       // Reflect.get()允许从对象中取出属性值，同属性访问器，只是形式是函数    
       track(target, "get", key) 
        // track依赖收集   
       if(isObject(res)) {
        //  值也是对象的话 需要嵌套调用reactive
        // res就是target[key]
        // 浅层代理 不需要嵌套
        return shallow ? res : reactive(res)
       }
       return res
   }
}

// 属性设置操作 捕捉器配置

function createSetter() {
    // 如果遇到 setter，receiver则为setter调用时的this值
   return function set (target, key, value, receiver) {
       const res = Reflect.set(target, key, value, receiver)
      //    触发set的时候进行触发依赖
      trigger(target, "set", key)
      return res
   }
}

// in 捕捉器配置
function has(target, key) {
    const res = Reflect.has(target, key)
    track(target, 'has', key)
    return res
}

// delete 捕捉器配置
function deleteProerty(target, key) {
    const hadKey = hasOwn(target, key) 
    const result = Reflect.deleteProperty(target, key)
     //返回值是属性是否删除成功 如果属性不存在也会返回true
    if(result && hadKey) {
        trigger(target, 'delete', key)
    }
    return result
}

export const mutableHandles = {
    get,
    set,
    has,
    deleteProerty
}

export const shallowReactiveHandlers = {
    get: shallowReactiveGet, 
    set,
    has,
    deleteProerty
}