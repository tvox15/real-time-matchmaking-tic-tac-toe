<template>
  <view class="board">
          
    <view class="row">
   <Square class="box" :value="boardData[0]" index="0" :selectBox="selectBox" />
   <Square class="box" :value="boardData[1]" index="1" :selectBox="selectBox" />
   <Square class="box" :value="boardData[2]" index="2" :selectBox="selectBox" />
    </view>
     <view class="row">
    <Square class="box" :value="boardData[3]" index="3" :selectBox="selectBox" />
    <Square class="box" :value="boardData[4]" index="4" :selectBox="selectBox" />
    <Square class="box" :value="boardData[5]" index="5" :selectBox="selectBox" />

    </view>
     <view class="row">
    <Square class="box" :value="boardData[6]" index="6" :selectBox="selectBox" />
   <Square class="box" :value="boardData[7]" index="7" :selectBox="selectBox" />
   <Square class="box" :value="boardData[8]" index="8" :selectBox="selectBox" />

    </view>
     
  </view>
</template>
<script>

import Square from './Square.vue';

export default {
  props: {
   boardData: { Type: Array},
   selectBox: {Type: Function}
  },
  components: {
      Square
  }
};
</script>

<style>
.box {
    background-color: white;
    width: 30%;
    height: 100%;
    border-style: black solid 1px;
    margin: 5px;
}
.board {
    margin: auto;
    justify-content: center;
    width: 50%;
    height: 300px;
    width: 100%;
    background-color: black;
}
.row {
    margin-top: 10px;
    width: 100%;
    flex: 1;
    flex-direction: row;
}
</style>