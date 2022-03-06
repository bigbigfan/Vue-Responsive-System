// 在 track 函数中，我们可以使用一个巨大的 tragetMap 去存储依赖关系。
// 1，map 的 key 是我们要代理的 target 对象，值还是一个 depsMap，存储这每一个 key 依赖的函数，每一个 key 都可以依赖多个 effect。

// 格式：
//   targetMap = {
//       target: {
//           key1 : [回调1， 回调2],
//           key2 : [回调3， 回调4],
//       },
//       traget1: {
//           key3: [回调5]
//       }
//   }


let activeEffect = null   // 全局变量 通过触发get把该变量存储到依赖地图中完成依赖收集
const targetMap = new WeakMap()  // 全局依赖地图  提供track trigger 共同调用

// effect

export function effect(fn, options = {}) {
    const effectFn = () => {
        try {
          activeEffect = effectFn
        //   fn执行的时候 内部读取响应式数据的时候 就能在get配置里读取到activeEffect
          return fn()
        } finally {
           activeEffect = null 
        }
    }
    if (!options.lazy) {
        // 没有配置lazy 直接执行
        effectFn()
    } 
    effectFn.scheduler = options.scheduler // 手动控制函数调度时机 watchEffect会用到
    return effectFn
}





export function track(target, type, key){
     console.log(`触发track -> target: ${target} type: ${type} key:${key}`);  
     
    //  1，基于target找对应的dep 
    // 如果是第一次需要初始化 
    // { // target1: {//depsmap // key:[effect1,effect2] // } // }
    let depsMap = targetMap.get(target)
    if(!depsMap) {
        // 初始化depsMap的逻辑
        // depsMap = new Map()
        // targetMap.set(target, depsMap)
        // 上面两行可以简写成下面的 
        targetMap.set(target, (depsMap = new Map()))
    }
    // 2, 基于key找对应的回调 第一次需要初始化一个
    let deps = depsMap.get(key)
    if(!deps) {
        deps = new Set() 
    }
    if(!deps.has(activeEffect) && activeEffect) {
        // 防止重复注册
        deps.add(activeEffect)
    }
    depsMap.set(key, deps)
}




// trigger做的事就是遍历track收集的依赖然后执行关联的回调

export function trigger(target, type, key) {
    console.log(`触发 trigger -> target: type:${type} key:${key}`)
    //找对象依赖
    const depsMap = targetMap.get(target)  
    if(!depsMap) {
        // 如果没有相关依赖
        return
    }
    // 找对象关联key的回调
    const deps = depsMap.get(key)
    if(!deps) {
        return
    }
    // 取出回调执行
    deps.forEach((effectFn) => {
        if(effectFn.scheduler) {
            effectFn.scheduler()
        } else {
            effectFn()
        }
    })
} 

// 可以看到执行的是 effect 的 scheduler 或者 run 函数，这是因为我们需要在 effect 函数中把依赖函数进行包装，并对依赖函数的执行时机进行控制，这是一个小的设计点。






// scheduler 怎么用你可以看下面的代码，我们使用数组管理传递的执行任务，最后使用 Promise.resolve 只执行最后一次，这也是 Vue 中 watchEffect 函数的大致原理。

// 响应式 之所以封装这么多层就是因为，Vue 的响应式本身有很多的横向扩展，除了响应式的封装，还有只读的拦截、浅层数据的拦截等等，这样，响应式系统本身也变得更加灵活和易于扩展，我们自己在设计公用函数的时候也可以借鉴类似的思路



//  reactive响应式大致思路
//  proxy 代理对象 其配置项函数baseHandlers 单独抽离封装 

//  effect => 1，targetMap依赖地图 2, get 触发 track()收集依赖 3， set 触发 trigger() 遍历执行依赖 4,前两者使用的都是Map嵌套