<template>
  <div class="wrapper">
    <img class="icon" src="../../assets/img/logo.png" alt="icon" />
    <p>{{ $t("layout.dragMouseUp") }}</p>
  </div>
</template>

<script>
export default {
  name: "drag"
};
</script>

<style lang="less">
.wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000;
  z-index: 100;
  opacity: 0.4;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  p {
    font-size: 40px;
    letter-spacing: 3px;
    color: rgb(57, 120, 178);
  }
  .icon {
    width: 300px;
    height: 300px;
  }
}
</style>
