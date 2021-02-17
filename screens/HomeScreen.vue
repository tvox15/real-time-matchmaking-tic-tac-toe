<template>
  <view class="container">
    <Header title="TIC TAC TOE" />
    <view class="menu-buttons">
      <MenuButton title="Online Game" :action="goToGameScreen" />
      <MenuButton title="Log In" :action="goToLoginScreen" />
    </view>
  </view>
</template>

<script>
import Header from "../components/Header.vue";
import Banner from "../components/Banner.vue";
import MenuButton from "../components/MenuButton.vue";

export default {
  // Declare `navigation` as a prop
  props: {
    navigation: {
      type: Object
    } 
  },
  components: {
    Header,
    Banner,
    MenuButton
  },
  data: function() {
    return {
      test: "test",
    };
  },
  mounted: function() {
    console.log(window);
  },
  methods: {
    goToGameScreen() {
      this.navigation.navigate("Game");
    },
     goToLoginScreen() {
      this.navigation.navigate("Login");
    }
  }
};
</script>

<style scoped>
.container {
  background-color: black;
}
.menu-buttons {
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 400px;
  background-color: black;
}
</style>
