<template>
  <view class="win-banner">
    <text class="win-banner-message">{{ bannerMessage }}</text>
  </view>
</template>

<script>
export default {
  props: {
    bannerMessage: String
  }
};
</script>

<style>
.win-banner {
  background-color: white;
  width: 100%;
  height: 150px;
  text-align: center;
  justify-content: center;
}
.win-banner-message {
  color: black;
  font-size: 70px;
  text-align: center;
}
</style>