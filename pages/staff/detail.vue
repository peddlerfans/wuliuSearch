<template>
    <view class="container">
        <!-- 顶部：运单号和状态 -->
        <view class="top-bar">
            <view class="waybill-no">运单号：1234567890</view>
            <view class="status">状态：已签收</view>
        </view>

        <!-- 收件人和电话 -->
        <view class="recipient">
            <view>收件人：张三</view>
            <view>电话：13800000000</view>
        </view>

        <!-- 物料表格 -->
        <view class="material-table">
            <view class="table-header">
                <view class="col name">物料名称</view>
                <view class="col qty">数量</view>
            </view>
            <view class="table-row" v-for="item in materials" :key="item.id">
                <view class="col name">{{ item.name }}</view>
                <view class="col qty">{{ item.qty }}</view>
            </view>
        </view>

        <!-- 留言框 -->
        <view class="messages">
            <view class="msg-title">订单留言</view>
            <view class="msg-list">
                <view class="msg-item" v-for="msg in messages" :key="msg.id">
                    <view class="msg-content">{{ msg.content }}</view>
                    <view class="msg-time">{{ msg.time }}</view>
                </view>
            </view>
        </view>

        <!-- 反馈时间 -->
        <view class="feedback-time">
            反馈时间：2024-06-01 10:00
        </view>

        <!-- 底部：部门和签收人 -->
        <view class="bottom-bar">
            <view class="dept">部门：物流部</view>
            <view class="signer">签收人：李四</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'

const materials = ref([
    { id: 1, name: '物料A', qty: 10 },
    { id: 2, name: '物料B', qty: 5 }
])

const messages = ref([
    { id: 1, content: '请尽快处理', time: '2024-06-01 09:00' },
    { id: 2, content: '已收到', time: '2024-06-01 09:30' }
])
</script>

<style lang="scss" scoped>
.container {
    padding: 24rpx;
    background: #fff;
    min-height: 100vh;
    box-sizing: border-box;
}
.top-bar {
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    margin-bottom: 24rpx;
}
.recipient {
    display: flex;
    justify-content: center;
    gap: 40rpx;
    margin-bottom: 24rpx;
    font-size: 28rpx;
}
.material-table {
    margin-bottom: 24rpx;
    .table-header, .table-row {
        display: flex;
        border-bottom: 1px solid #eee;
        padding: 12rpx 0;
    }
    .table-header {
        font-weight: bold;
        background: #f7f7f7;
    }
    .col {
        flex: 1;
        &.name { text-align: left; }
        &.qty { text-align: right; }
    }
}
.messages {
    margin-bottom: 24rpx;
    .msg-title {
        font-weight: bold;
        margin-bottom: 12rpx;
    }
    .msg-list {
        .msg-item {
            background: #f5f5f5;
            border-radius: 8rpx;
            padding: 12rpx;
            margin-bottom: 8rpx;
            .msg-content { margin-bottom: 4rpx; }
            .msg-time { font-size: 22rpx; color: #888; }
        }
    }
}
.feedback-time {
    text-align: right;
    color: #888;
    font-size: 24rpx;
    margin-bottom: 24rpx;
}
.bottom-bar {
    display: flex;
    justify-content: space-between;
    font-size: 28rpx;
    border-top: 1px solid #eee;
    padding-top: 16rpx;
    margin-top: 24rpx;
}
</style>