<template>
    <view class="container">
        <!-- 上传前提示 -->
        <view v-if="!uploadSuccess" class="info-text">
            点击按钮导入装箱单
        </view>

        <!-- 上传后显示结果 -->
        <view v-else class="result">
            <view class="waybill">运单号：{{ waybillNo }}</view>

            <view class="material-table-wrapper">
                <view class="material-table">
                    <view class="table-header">
                        <view class="table-cell">物料型号</view>
                        <view class="table-cell">数量</view>
                    </view>
                    <view v-for="(item, idx) in materialList" :key="idx" class="table-row">
                        <view class="table-cell">{{ item.product_model }}</view>
                        <view class="table-cell">{{ item.product_num }}</view>
                    </view>
                </view>
            </view>

            <view class="action-btns">
                <button class="cancel-btn" @click="handleCancel">取消</button>
                <button class="confirm-btn" @click="handleConfirm">确定</button>
            </view>

            <view class="tip-text">
                点击确认后，该识别结果将存入数据库
            </view>
        </view>

        <!-- 上传按钮 -->
        <button v-if="!uploadSuccess" class="upload-btn" @click="handleUpload" :loading="loading" :disabled="loading">
            {{ loading ? '上传中...' : '开始' }}
        </button>
    </view>
</template>

<script setup>
import { ref ,onMounted} from 'vue'
import { staffConfirm } from '@/api/staff'
const BASEURL = 'https://djtestweb.youyong.org.cn'

const uploadSuccess = ref(false)
const loading = ref(false)
const waybillNo = ref('')
const materialList = ref([])

onMounted(() => {
    const storedData = uni.getStorageSync('uploadData')
    if (storedData) {
        waybillNo.value = storedData.trade_no || ''
        materialList.value = storedData.products || []
        uploadSuccess.value = true
        uni.removeStorageSync('uploadData') // 清除缓存，防止重复使用
    }
})

function handleUpload() {
    uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            loading.value = true
            uni.showLoading({ title: '上传中...' })
            uni.uploadFile({
                url: BASEURL + '/api/upload/image',
                filePath: res.tempFilePaths[0],
                header: {
                    'Authorization': 'Bearer ' + uni.getStorageSync("token")
                },
                name: 'file',
                success: uploadFileRes => {
                    try {
                        const result = JSON.parse(uploadFileRes.data)
                        if ((result.code === 200 || result.code === 0) && result.data) {
                            const data = result.data
                            waybillNo.value = data.trade_no || ''
                            materialList.value = data.products || []
                            uploadSuccess.value = true
                        } else {
                            uni.showToast({ title: '上传失败：' + (result.msg || '未知错误'), icon: 'none' })
                        }
                    } catch (e) {
                        console.error('解析失败', e)
                        uni.showToast({ title: '返回数据异常', icon: 'none' })
                    }
                    loading.value = false
                    uni.hideLoading()
                },
                fail: err => {
                    console.error('上传失败', err)
                    loading.value = false
                    uni.hideLoading()
                    uni.showToast({ title: '上传失败', icon: 'none' })
                }
            })
        }
    })
}

function handleCancel() {
    // uploadSuccess.value = false
    uni.showLoading({ title: '取消中...' })
    staffConfirm({ trade_no: waybillNo.value, status: 1 })
        .then(() => {
            uni.hideLoading()
            uni.showToast({ title: '取消成功', icon: 'success' })
            uploadSuccess.value = false
        })
        .catch(err => {
            console.error(err)
            uni.hideLoading()
            uni.showToast({ title: '提交失败', icon: 'none' })
        })
}

function handleConfirm() {
    if (!waybillNo.value) {
        uni.showToast({ title: '未识别到运单号', icon: 'none' })
        return
    }
    uni.showLoading({ title: '提交中...' })
    staffConfirm({ trade_no: waybillNo.value, status: 1 })
        .then(() => {
            uni.hideLoading()
            uni.showToast({ title: '确认成功', icon: 'success' })
            uploadSuccess.value = false
        })
        .catch(err => {
            console.error(err)
            uni.hideLoading()
            uni.showToast({ title: '提交失败', icon: 'none' })
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
