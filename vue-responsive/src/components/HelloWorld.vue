<script>
export default {
  name: 'wzfyyds'
}
</script>
<script setup>
import { ref, reactive, nextTick } from 'vue'
import   { myRef }  from '../reactivity/ref'
// import { effect } from '../reactivity/effect'
defineProps({
  msg: String
})

const divRef = ref(null)

const list = reactive([
  {name: 'a', id: 1},
  {name: 'b', id: 2},
  {name: 'c', id: 3},
])
let counter = 4
function addItem() {
  while(counter < 7) {
    list.push({
    name: 'extraItem', 
    id: counter++
  })
  }
  console.log(divRef.value);
  // 因为是异步渲染DOM的所以这里的同步任务先执行了拿不到最后的值
  nextTick(() => {
    console.log(document.querySelectorAll('li').length);
    // console.log(divRef.value.childNodes.length);
  })
}

// const count = ref(0)

// const myRefCount = myRef(0)

// effect(() => {
//   console.log(myRefCount.value);
// })

// console.log(myRefCount.value += 1)




// const obj = reactive({
//   objCount: 0
// })


// function asyncAdd() {
//   return new Promise((resolve, reject) => {
//     resolve(1)
//   }).then(res => {
//     count.value++
//   }) 
// }


</script>

<template>
  <!-- <h1>{{ msg }}</h1> -->

  <!-- <button type="button" @click="asyncAdd()">count is: {{ count }}</button>

  <button type="button" @click="obj.objCount++">count is: {{ obj.objCount }}</button>
  
  <input type="text" :value="count"> -->
  <div>
     <ul ref="divRef">
        <li v-for="item in list" :key="item.id">{{item.name}}</li>
     </ul>
     <button @click="addItem">addItem</button>
  </div>
</template>

<style scoped>

</style>
