<template>
    <view class="container">
        <view v-if="!uploadSuccess" class="info-text">
            点击按钮导入装箱单
        </view>
        <view v-else class="result">
            <view class="waybill">运单号：{{ waybillNo }}</view>
            <view class="material-table-wrapper">
                <view class="material-table">
                    <view class="table-header">
                        <view class="table-cell">物料名称</view>
                        <view class="table-cell">数量</view>
                    </view>
                    <view v-for="(item, idx) in materialList" :key="idx" class="table-row">
                        <view class="table-cell">{{ item.name }}</view>
                        <view class="table-cell">{{ item.count }}</view>
                    </view>
                </view>
            </view>
            <view class="action-btns">
                <button class="cancel-btn" @click="uploadSuccess = false">取消</button>
                <button class="confirm-btn" @click="handleConfirm">确定</button>
            </view>
            <view class="tip-text">
                点击确认后，该识别结果将存入数据库
            </view>
        </view>
        <button v-if="!uploadSuccess" class="upload-btn" @click="handleUpload" :loading="loading" :disabled="loading">
            {{ uploadSuccess ? '重新上传' : '开始' }}
        </button>
    </view>
</template>

<script setup>
import { ref } from 'vue'

const uploadSuccess = ref(false)
const loading = ref(false)
const waybillNo = ref('')
const materialList = ref([])

function mockUploadApi() {
    // 模拟接口，实际应替换为真实API调用
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 随机成功或失败
            if (Math.random() > 0.3) {
                resolve({
                    waybillNo: 'WB123456789',
                    materialList: [
                        { name: '物料A', count: 10 },
                        { name: '物料B', count: 5 }
                    ]
                })
            } else {
                reject(new Error('上传失败，请重试'))
            }
        }, 1500)
    })
}

function handleUpload() {
    loading.value = true
    uploadSuccess.value = false
    waybillNo.value = ''
    materialList.value = []
    mockUploadApi()
        .then(res => {
            waybillNo.value = res.waybillNo
            materialList.value = res.materialList
            uploadSuccess.value = true
        })
        .catch(err => {
            uni.showToast({
                title: err.message || '上传失败',
                icon: 'none'
            })
        })
        .finally(() => {
            loading.value = false
        })
}

function handleConfirm() {
    // 这里可以添加存入数据库的逻辑
    uni.showToast({
        title: '已存入数据库',
        icon: 'success'
    })
}
</script>

<style lang="scss" scoped>
.container {
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.info-text {
    font-size: 32rpx;
    margin-bottom: 60rpx;
    color: #666;
}

.result {
    width: 100%;
    margin-bottom: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.waybill {
    font-weight: bold;
    font-size: 30rpx;
    margin-bottom: 20rpx;
    width: 100%;
}

.material-table-wrapper {
    width: 100%;
    margin-bottom: 30rpx;
    display: flex;
    justify-content: center;
}

.material-table {
    width: 90%;
    background: #f7f7f7;
    border-radius: 12rpx;
    overflow: hidden;
    border: 1rpx solid #e0e0e0;
}

.table-header,
.table-row {
    display: flex;
    flex-direction: row;
}

.table-header {
    background: #eaeaea;
    font-weight: bold;
}

.table-cell {
    flex: 1;
    padding: 18rpx 0;
    text-align: center;
    font-size: 28rpx;
    border-bottom: 1rpx solid #e0e0e0;
}

.table-header .table-cell {
    border-bottom: 2rpx solid #d0d0d0;
}

.table-row:last-child .table-cell {
    border-bottom: none;
}

.action-btns {
    width: 90%;
    display: flex;
    justify-content: space-between;
    margin: 30rpx 0 10rpx 0;
}

.cancel-btn,
.confirm-btn {
    width: 45%;
    height: 70rpx;
    font-size: 30rpx;
    border-radius: 35rpx;
}

.cancel-btn {
    background: #f5f5f5;
    color: #333;
    border: 1rpx solid #ccc;
}

.confirm-btn {
    background: #007aff;
    color: #fff;
    border: none;
}

.tip-text {
    width: 90%;
    text-align: center;
    color: #ff9900;
    font-size: 26rpx;
    margin-top: 10rpx;
}

.upload-btn {
    width: 300rpx;
    height: 80rpx;
    font-size: 32rpx;
    background: #007aff;
    color: #fff;
    border-radius: 40rpx;
}
</style>