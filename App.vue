<template>
  <app-navigator></app-navigator>
</template>

<script>
import {
  createAppContainer,
  createStackNavigator,
} from "vue-native-router";

import HomeScreen from "./screens/HomeScreen.vue";
import GameScreen from "./screens/GameScreen.vue";
import LoginScreen from "./screens/LoginScreen.vue";

const StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Game: GameScreen,
    Login: LoginScreen
  },
  {
    initialRouteName: 'Home',
  }
);

const AppNavigator = createAppContainer(StackNavigator);


export default {
  components: { AppNavigator }
}
</script>

<style>
.container {
  background-color: white;
  align-items: center;
  justify-content: center;
  flex: 1;
}
.text-color-primary {
  color: blue;
}
</style>
