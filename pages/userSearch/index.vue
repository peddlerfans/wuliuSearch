<template>
    <view class="container">
        <!-- 查询区域 -->
        <view class="search-bar">
            <input v-model="tradeNo" placeholder="请输入运单号" class="input" />
            <button @click="onSearch" class="search-btn">查询</button>
        </view>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue'
const tradeNo = ref('')
function onSearch() {
    // 触发搜索逻辑
    uni.navigateTo({
        url: '/pages/userSearch/detail?trade_no=' + tradeNo.value
    })
}

</script>

<style scoped>
.container {
    padding: 32rpx;
}

.search-bar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 32rpx;
    margin-top: 100rpx;
}

.input {
    flex: 1;
    border: 1px solid #eee;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-right: 16rpx;
    font-size: 30rpx;
}

.search-btn {
    background: #007aff;
    color: #fff;
    border-radius: 16rpx;
    padding: 6rpx 62rpx;
    margin-top: 40rpx;
    font-size: 32rpx;
}
</style>