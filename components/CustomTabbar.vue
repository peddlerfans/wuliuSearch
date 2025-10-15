<template>
  <view class="tabbar">
    <view
      v-for="(item, index) in tabs"
      :key="index"
      class="tab-item"
      @click="switchTab(item.pagePath)"
    >
      <text :class="['tab-text', current === item.pagePath ? 'active' : '']">
        {{ item.text }}
      </text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
const props = defineProps({
  tabs: Array,
  current: String
})

function switchTab(path) {
  if (path !== props.current) {
    uni.redirectTo({ url: '/' + path })
  }
}
</script>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100rpx;
  background-color: #fff;
  border-top: 1px solid #eee;
  display: flex;
}
.tab-item {
  flex: 1;
  text-align: center;
  line-height: 100rpx;
  font-size: 28rpx;
  color: #666;
}
.tab-text.active {
  color: #1677FF;
  font-weight: bold;
}
</style>
