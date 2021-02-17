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
    width: 300px;
    height: 100px;
    background-color: #ffce00;
    align-items: center;
    justify-content:center;
    margin-bottom: 10px;

}
.btn-text {
    font-size: 28px;
    font-weight: 700;
    text-transform: uppercase;
}
</style>