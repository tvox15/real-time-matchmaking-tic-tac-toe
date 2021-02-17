<template>
  <view class="container">
    <text-input class="text-input-box" v-model="name" />
    <view v-if="currentView === 'matchmakingView'" class="center-wrapper">
      <text class="enter-username-text"> Enter your username: </text>
      <text-input v-model="name" class="text-input" />
      <MenuButton title="Search for game" :action="joinRoom" />
      <text class="error">{{ blankUsernameError }}</text>
    </view>
    <view v-if="currentView === 'searchView'" class="searching-view">
      <text class="searching-text"> Searching for game...</text>
      <activity-indicator size="large" color="white" />
    </view>
    <view v-if="currentView === 'gameView'">
      <view class="your-turn-text-wrapper">
      <text class="your-turn-text">{{currentTurn}} {{ yourTurnText }}</text>
      </view>
      <Board
        class="board"
        :boardData="gameData.gameState.boxes"
        :selectBox="selectBox"
      />
      <view v-if="gameData.winner !== ''" class="won-view">
      <Banner :bannerMessage="gameEndText" />
      <view class="button-row">
        <SmallMenuButton
          class="menu-button"
          title="Play Again"
          :action="playAgain"
        />
        <SmallMenuButton
          class="menu-button"
          title="Quit"
          :action="exitGameScreen"
        />
      </view>
    </view>
    </view>
    
  </view>
</template>

<script src="http://hostmydb.com:5000/socket.io/socket.io.js"></script>
<script>
import io from "socket.io-client";
import axios from "axios";

var connectionOptions = {
  //"force new connection" : true,
  //"reconnectionAttempts": "Infinity", //avoid having user reconnect manually in order to prevent dead clients after a server restart
  //"timeout" : 10000, //before connect_error and connect_timeout are emitted.
  transports: ["websocket"]
};
var socket = io("http://hostmydb.com:5000/", connectionOptions);

import Board from "../components/Board.vue";
import MenuButton from "../components/MenuButton.vue";
import SmallMenuButton from "../components/SmallMenuButton.vue";
import Banner from "../components/Banner.vue";

export default {
  components: { Board, MenuButton, SmallMenuButton, Banner },
  // Declare `navigation` as a prop
  props: {
    navigation: {
      type: Object
    }
  },
  data() {
    return {
      name: "",
      roomName: "",
      whichPlayer: "",
      whichSide: "",
      currentView: "matchmakingView",
      gameData: "",
      submitClicked: false,
      currentTurn: 0
    };
  },
  computed: {
    isMyTurn() {
      if (this.currentView === "gameView") {
        return this.whichPlayer === this.gameData.gameState.whichPlayerTurn;
      } else {
        return "";
      }
    },
    blankUsernameError() {
      return this.submitClicked
        ? this.name === ""
          ? "Must enter a username"
          : ""
        : "";
    },
    yourTurnText() {
      return this.isMyTurn === true ? 'Your Turn!' : '';
    },
    gameEndText() {
      if(this.gameData.winner === 'draw') {
        return "It's a tie!";
      } else {
      return this.whichPlayer === this.gameData.gameState.whichPlayerTurn
        ? "YOU WON!"
        : "YOU LOST!";
      }
    }
  },


  created() {
    var vm = this;
    //console.log(socket);
    socket.on("receiveMessage", function(data) {
      console.log("receiving message");
      console.log(data);
      vm.returnMessage = data;
    });

    socket.on("player1Tag", function(data) {
      vm.whichPlayer = data;
      vm.whichSide = "O";
    });

    socket.on("joinedRoom", function(data) {
      console.log("joinedRoom");
      vm.currentView = "gameView";
      vm.gameData = data;
      if (vm.whichPlayer === "") {
        vm.whichPlayer = "player2";
        vm.whichSide = "X";
      }
    });

    socket.on("updatedGame", function(data) {
        vm.currentTurn++;
        vm.gameData = data;
          if (vm.gameData.winner !== "") {
            //vm.currentView = "wonView";
            vm.leaveRoom();
          } 
    });
  },

  methods: {
    updateGame(action, data = []) {
      switch (action) {
        case "SELECT_BOX":
          socket.emit("updateGame", {
            roomId: this.gameData.roomId,
            action,
            other: data
          });
          break;
      }
    },
    goToHomeScreen() {
      this.navigation.navigate("Home");
    },
    sendMessage() {
      console.log("emitting send message");
      socket.emit("sendMessage", {
        message: this.message
      });
    },
    joinRoom() {
      this.submitClicked = true;
      if (!this.blankUsernameError) {
        this.currentView = "searchView";
        console.log("emitting join room");
        socket.emit("joinRoom", {
          name: this.name
        });
      }
    },
    leaveRoom() {
      socket.emit("leaveRoom", {
        roomId: this.gameData.roomId
      })
    },

    selectBox(boxIndex) {
      if (this.isMyTurn && this.gameData.gameState.boxes[boxIndex] === "") {
        this.updateGame("SELECT_BOX", boxIndex);
      }
    },
    resetData(view) {
      this.roomName = "";
      this.whichPlayer = "";
      this.whichSide = "";
      this.currentView = view;
      this.gameData = "";
      this.submitClicked = false;
      this.currentTurn = 0;
      this.gameData = "";
    },
    playAgain() {
      this.resetData('searchView');
       this.joinRoom();
    },
    exitGameScreen() {
      this.resetData("matchmakingView");
      this.leaveRoom();
      this.navigation.navigate("Home");
    }
  }
};
</script>


<style>
.container {
  background-color: black;
  height: 100%;
}
.text-input-box {
  height: 40px;
  border-color: black;
}
.center-wrapper {
  align-items: center;
  justify-content: center;
  width: 100%;
  background-color: black;
}
.enter-username-text {
  color: white;
  font-size: 20px;
  margin-bottom: 10px;
}
.text-input {
  background-color: white;
  width: 70%;
  height: 40px;
  margin-bottom: 10;
  font-size: 30px;
}
.error {
  color: red;
  font-size: 20px;
}
.searching-view {
  height: 500px;
  flex: 1;
  justify-content: center;
  align-items: center;
}
.searching-text {
  height: 100px;
  color: white;
  font-size: 20px;
}
.win-text {
  height: 100px;
  color: white;
  font-size: 20px;
}
.button-row {
  flex-direction: row;
  justify-content: space-evenly;
  background-color: white;
  align-items: center;
  height: 100px;
}
.menu-button {
  font-size: 20px;
  width: 30%;
}
.your-turn-text-wrapper{
  justify-content: space-evenly;
  align-items: center;
  height: 20px;
}
.your-turn-text{
   color: white;
   font-size:20px;
}
</style>
