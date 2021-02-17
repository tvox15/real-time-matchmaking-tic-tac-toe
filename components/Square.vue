<template>
  <touchable-opacity class="box" @press="selectBox(index)">
   <text class="box-text"> {{ value }}</text>
  </touchable-opacity>
</template>

<script>

export default {
  props: {
    value: String,
    selectBox: {Type: Function},
    index: String
  },

};
</script>


<style>
.box {
    width: 20px;
    height: 20px;
    border-style: black solid 1px;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.box-text{
  font-size: 70px;
  padding-right: 15px;
}
</style>


