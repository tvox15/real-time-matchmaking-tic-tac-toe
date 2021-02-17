<template>
  <view class="container">
      <web-view :source="{
          uri: 'http://hostmydb.com:5000/google',
      headers: {
          'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36'
      }
      }" />
  </view>
</template>

<script>
import axios from "axios";
import { WebView } from "react-native-webview";

export default {
  // Declare `navigation` as a prop
  props: {
    navigation: {
      type: Object
    } 
  },
  components: {
    "web-view": WebView
  },
  data: function () {
      return {
          response: '<p>test</p>'
      }
  },
  methods: {
      getLogin() {
          console.log('pressed');
  axios.get("http://hostmydb.com:5000/google").then(response => {
      this.response = response.data;
    }); 
      }
  }
  
};
</script>

<style scoped>
.container {
    width: 100%;
    height: 100%;
}

</style>
