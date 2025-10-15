<template>
    <view class="container">
        <!-- 查询区域 -->
        <view class="search-bar" v-if="!result">
            <input v-model="tradeNo" placeholder="请输入运单号" class="input" />
            <button @click="onSearch" class="search-btn">查询</button>
        </view>

        <!-- 查询结果 -->
        <view v-if="result" class="result-section">
            <view class="header">
                <view class="left">
                    运单号：{{ result.trade_no }}
                </view>
                <view class="right" :class="{ 'signed': result.status === 2, 'unsigned': result.status !== 2 }">
                    {{ result.status === 2 ? '已签收' : '待签收' }}
                </view>
            </view>
            <view class="receiver-info">
                <text>{{ result.consignee_name || '-' }}</text>
                <text style="margin-left: 16rpx;">电话：{{ result.consignee_phone || '-' }}</text>
            </view>

            <!-- 产品表格 -->
            <view class="product-table">
                <view class="table-header">
                    <view class="th">产品型号</view>
                    <view class="th">技术规范</view>
                    <view class="th">数量</view>
                    <view class="th">单位</view>
                    <!-- <view class="th">批号</view>
                    <view class="th">合同号</view>
                    <view class="th">合格证</view> -->
                </view>
                <view class="table-row" v-for="(item, idx) in products" :key="item.id">
                    <view class="td">{{ item.product_model }}</view>
                    <view class="td">{{ item.technical_spec }}</view>
                    <view class="td">{{ item.product_num }}</view>
                    <view class="td">{{ item.product_unit }}</view>
                    <!-- <view class="td">{{ item.batch_number }}</view>
                    <view class="td">{{ item.contract_no }}</view>
                    <view class="td">{{ item.c_o_c }}</view> -->
                </view>
            </view>

            <!-- 额外信息输入框 -->
            <view class="extra-info">
                <view class="extra-row">
                    <text class="label">remark：</text>
                    <input v-if="result.status !== 2" v-model="remark" class="editable" placeholder="请输入" />
                    <text v-else>{{ remark }}</text>
                </view>
                <view class="extra-row">
                    <text class="label">部门：</text>
                    <input v-if="result.status !== 2" v-model="deptName" class="editable" placeholder="请输入" />
                    <text v-else>{{ deptName }}</text>
                </view>
                <view class="extra-row">
                    <text class="label">签收人：</text>
                    <input v-if="result.status !== 2" v-model="consigneeName" class="editable" placeholder="请输入" />
                    <text v-else>{{ consigneeName }}</text>
                </view>
            </view>

            <!-- 操作按钮 -->
            <view v-if="result.status !== 2" class="action-btns">
                <button class="confirm-btn" @click="onConfirm">确定</button>
                <button class="cancel-btn" @click="onCancel">取消</button>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import { staffDetail } from '@/api/staff'
const tradeNo = ref('')
const result = ref(null)
const products = ref([])

const remark = ref('')
const deptName = ref('')
const consigneeName = ref('')

const onSearch = async () => {
    if (!tradeNo.value) {
        uni.showToast({ title: '请输入运单号', icon: 'none' })
        return
    }
    staffDetail({ trade_no: tradeNo.value }).then((res) => {
        // 处理成功逻辑
        if (res.code == 200 || res.code == 0) {
            result.value = res.data
            products.value = result.value.products || []
            // 赋值remark、部门、签收人
            remark.value = result.value.remark || ''
            deptName.value = result.value.dept_name || ''
            consigneeName.value = result.value.consignee_name || ''
        } else {
            uni.showToast({ title: res.msg || '查询失败', icon: 'none' })
            result.value = null
            products.value = []
            remark.value = ''
            deptName.value = ''
            consigneeName.value = ''
        }
    }).catch((e) => { console.log(e); })
}

const onConfirm = () => {
    // 提交签收逻辑
    uni.showToast({ title: '已提交', icon: 'success' })
}

const onCancel = () => {
    // 取消签收逻辑
    uni.showToast({ title: '已取消', icon: 'none' })
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
    border-radius: 8rpx;
    padding: 16rpx;
    margin-right: 16rpx;
}

.search-btn {
    background: #007aff;
    color: #fff;
    border-radius: 8rpx;
    padding: 10rpx 62rpx;
    margin-top: 40rpx;
}

.result-section {
    background: #fff;
    border-radius: 16rpx;
    padding: 24rpx;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16rpx;
}

.header .right.signed {
    color: #67c23a;
}

.header .right.unsigned {
    color: #f56c6c;
}

.receiver-info {
    text-align: center;
    margin-bottom: 16rpx;
    color: #666;
}

.product-table {
    border: 1px solid #eee;
    border-radius: 8rpx;
    overflow: hidden;
    margin-bottom: 24rpx;
}

.table-header,
.table-row {
    display: flex;
    align-items: center;
}

.th,
.td {
    flex: 1;
    padding: 12rpx 8rpx;
    border-bottom: 1px solid #f0f0f0;
    font-size: 26rpx;
}

.extra-info {
    margin-bottom: 24rpx;
}

.extra-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.label {
    width: 120rpx;
    color: #333;
}

.editable {
    border: 1px solid #eee;
    border-radius: 4rpx;
    padding: 8rpx;
    width: 100%;
}

.action-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 24rpx;
}

.confirm-btn {
    background: #007aff;
    color: #fff;
    border-radius: 8rpx;
    padding: 16rpx 32rpx;
    margin-right: 16rpx;
}

.cancel-btn {
    background: #f5f5f5;
    color: #333;
    border-radius: 8rpx;
    padding: 16rpx 32rpx;
}
</style>