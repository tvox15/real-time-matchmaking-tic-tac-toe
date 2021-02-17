<template>
      <touchable-opacity class="button" :on-press="action">
      <text class="btn-text">{{title}}</text>
      </touchable-opacity>
</template>

<script>

export default {
    props: {
       title: String,
       action: Function
    }
}
</script>

<style>
.button {
    width: 200px;
    height: 50px;
    margin-left: 2px;
    background-color: black;
    align-items: center;
    justify-content:center;
    margin-bottom: 10px;
}

.btn-text {
    color: white;
    font-size:15px;
    font-weight: 400;
    text-transform: uppercase;
}
</style>