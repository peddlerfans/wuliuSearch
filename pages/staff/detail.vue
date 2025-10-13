<template>
    <view class="container">
        <!-- 顶部：运单号和状态 -->
        <view class="top-bar">
            <view class="waybill-no">运单号：{{ detail.trade_no }}</view>
            <view class="status">状态：{{ statusText(detail.status) }}</view>
        </view>

        <!-- 收件人和电话 -->
        <view class="recipient">
            <view>收件人：{{ detail.consignee_name || '-' }}</view>
            <view>电话：{{ detail.consignee_phone || '-' }}</view>
        </view>

        <!-- 物料表格 -->
        <view class="material-table">
            <view class="table-header">
                <view class="col name">产品型号</view>
                <view class="col qty">数量</view>
                <view class="col unit">单位</view>
                <view class="col spec">技术规范</view>
            </view>
            <view class="table-row" v-for="item in products" :key="item.id">
                <view class="col name">{{ item.product_model }}</view>
                <view class="col qty">{{ item.product_num }}</view>
                <view class="col unit">{{ item.product_unit }}</view>
                <view class="col spec">{{ item.technical_spec }}</view>
            </view>
        </view>

        <!-- 留言框（接口无数据，先隐藏或留空） -->
        <!-- <view class="messages">
            <view class="msg-title">订单留言</view>
            <view class="msg-list"></view>
        </view> -->

        <!-- 反馈时间（接口无数据，先隐藏或留空） -->
        <!-- <view class="feedback-time">
            反馈时间：
        </view> -->

        <!-- 底部：部门和签收人 -->
        <view class="bottom-bar">
            <view class="dept">部门：{{ detail.dept_name || '-' }}</view>
            <view class="signer">签收人：{{ detail.consignee_name || '-' }}</view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { staffDetail } from '@/api/staff'
import { onLoad } from '@dcloudio/uni-app'

const detail = ref({})
const products = ref([])

function statusText(status) {
    // 根据实际业务调整
    switch (status) {
        case 1: return '已签收'
        case 0: return '未签收'
        default: return '-'
    }
}

onLoad((options) => {
    const trade_no = options.trade_no
    staffDetail({trade_no}).then(res => {
        if (res && res.data) {
            detail.value = res.data
            products.value = res.data.products || []
        }
    }).catch(err => {
        console.error('获取运单详情失败', err)
    })
})
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
        &.unit { text-align: right; }
        &.spec { text-align: right; }
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