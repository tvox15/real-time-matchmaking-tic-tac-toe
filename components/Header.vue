<template>
  <view class="header">
      <text class="title">{{title}}</text>
  </view>
</template>

<script>

export default {
    props: {
        title: String
    }
}
</script>

<style>
.header{
    height: 60px;
    background-color: #171717;
  align-items: center;
  justify-content: center;
}
.title{
    color: #f3f3f3;
    font-size: 28px;
    font-weight: 900;   
    text-transform: uppercase;
}
</style>