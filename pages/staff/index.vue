<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app';
import { staffList } from '@/api/staff'
const BASEURL = 'https://djtestweb.youyong.org.cn'
const tabs = [
    { label: '全部', value: 'all' },
    { label: '待签收', value: 1 },
    { label: '有异议', value: 3 },
    { label: '已签收', value: 2 },
    { label: '已作废', value: 0 }
]

const currentTab = ref('all')

const waybillList = ref([])

onShow(() => {
    fetchWaybillList()
})

function fetchWaybillList() {
    staffList({ page: 1, size: 50 }).then(res => {
        if (res && res.data) {
            waybillList.value = res.data.map(item => ({
                id: item.id,
                trade_no: item.trade_no,
                companyName: item.company_name,
                packerName: item.packer_name,
                inspectorName: item.inspector_name,
                createTime: item.create_time,
                status: item.status,
                remark: item.remark
            }))
        }
    }).catch(err => {
        console.error('获取运单列表失败', err)
    })
}

const statusMap = {
    0: { text: '已作废', class: 'abandoned' },
    1: { text: '待签收', class: 'pending' },
    2: { text: '已签收', class: 'signed' },
    3: { text: '有异议', class: 'questioned' }
}

const filteredList = computed(() => {
    if (currentTab.value === 'all') return waybillList.value.map(addStatusText)
    // 注意 currentTab 可能是字符串 '1'，item.status 是数字
    return waybillList.value
        .filter(item => String(item.status) === String(currentTab.value))
        .map(addStatusText)
})

function addStatusText(item) {
    const status = statusMap[item.status] || {}
    return {
        ...item,
        statusText: status.text || '',
        statusClass: status.class || ''
    }
}

function goToDetail(item) {
    uni.navigateTo({
        url: `/pages/staff/detail?trade_no=${item.trade_no}`
    })
}

function chooseImg(){
     uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
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
                            uni.setStorageSync('uploadData', result.data)
                            uni.navigateTo({
                                url: '/pages/staff/uploadImg'
                            })
                            // const data = result.data
                            // waybillNo.value = data.trade_no || ''
                            // materialList.value = data.products || []
                            // uploadSuccess.value = true
                        } else {
                            uni.showToast({ title: '上传失败：' + (result.msg || '未知错误'), icon: 'none' })
                        }
                    } catch (e) {
                        console.error('解析失败', e)
                        uni.showToast({ title: '返回数据异常', icon: 'none' })
                    }
                    uni.hideLoading()
                },
                fail: err => {
                    console.error('上传失败', err)
                    uni.hideLoading()
                    uni.showToast({ title: '上传失败', icon: 'none' })
                }
            })
        }
    })
}

</script>

<template>
    <view class="staff-page">
        <!-- Tabs -->
        <view class="tabs">
            <view v-for="(tab, idx) in tabs" :key="tab.value" :class="['tab', { active: currentTab === tab.value }]"
                @tap="currentTab = tab.value">
                {{ tab.label }}
            </view>
        </view>

        <!-- List -->
        <view class="waybill-list">
            <view v-for="item in filteredList" :key="item.id" class="waybill-item">
                <view class="waybill-header">
                    <text class="waybill-no">{{ item.trade_no }}</text>
                    <text class="company-name">{{ item.companyName }}</text>
                </view>
                <view class="waybill-info">
                    <view class="info-left">
                        <text class="packer">打包: {{ item.packerName }}</text>
                        <text class="inspector">验货: {{ item.inspectorName }}</text>
                    </view>
                    <view class="info-left">
                        <text class="create-time">{{ item.createTime }}</text>
                        <text :class="['status', item.statusClass]">{{ item.statusText }}</text>
                    </view>
                </view>
                <view class="info-right" @tap="goToDetail(item)">
                    <text>详情</text>
                    <text class="arrow">➔</text>
                </view>
            </view>
        </view>
        <view v-if="filteredList.length === 0" class="empty">暂无数据</view>
        <view class="fixed-btn" @click="chooseImg">上传</view>
    </view>

</template>


<style lang="scss" scoped>
.staff-page {
    background: #f7f8fa;
    min-height: 100vh;
    padding-bottom: 20rpx;
    position: relative;
}

.tabs {
    display: flex;
    background: #fff;
    border-radius: 16rpx;
    margin: 24rpx 24rpx 0 24rpx;
    overflow: hidden;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
}

.tab {
    flex: 1;
    text-align: center;
    padding: 24rpx 0;
    font-size: 30rpx;
    color: #888;
    background: #fff;
    transition: color 0.2s, background 0.2s;

    &.active {
        color: #1677ff;
        background: #e6f0ff;
        font-weight: bold;
    }
}

.waybill-list {
    margin: 24rpx;
}

.waybill-item {
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 24rpx;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.03);
    padding: 32rpx 24rpx 24rpx 24rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
}

.waybill-header {
    font-size: 32rpx;
    font-weight: 600;
    color: #222;

    .original-no {
        font-size: 26rpx;
        color: #999;
        margin-left: 12rpx;
    }
}

.waybill-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-bottom: 1px solid #eee;

    .info-left {
        display: flex;
        justify-content: space-between;
        gap: 32rpx;

        .recipient {
            font-size: 28rpx;
            color: #444;
        }

        .phone {
            font-size: 26rpx;
            color: #888;
        }
    }

    .status {
        font-size: 26rpx;
        padding: 4rpx 16rpx;
        border-radius: 24rpx;

        &.pending {
            background: #fffbe6;
            color: #faad14;
        }

        &.questioned {
            background: #fff1f0;
            color: #f5222d;
        }

        &.signed {
            background: #f6ffed;
            color: #52c41a;
        }
    }

    .info-right {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16rpx;


        .arrow {
            font-size: 32rpx;
            color: #bbb;
            margin-left: 8rpx;
        }
    }
}

.waybill-footer {
    display: flex;
    justify-content: flex-end;

    .detail-btn {
        background: #1677ff;
        color: #fff;
        border: none;
        border-radius: 24rpx;
        padding: 8rpx 32rpx;
        font-size: 26rpx;
        font-weight: 500;
        box-shadow: 0 2rpx 8rpx rgba(22, 119, 255, 0.08);
    }
}

.empty {
    text-align: center;
    color: #bbb;
    font-size: 28rpx;
    margin-top: 80rpx;
}

.fixed-btn {
    width: 120rpx;
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    position: fixed;
    right: 48rpx;
    bottom: 88rpx;
    z-index: 100;
    background: #e32d2d;
    color: #fff;
    border: none;
    border-radius: 50%;
    font-size: 30rpx;
    font-weight: 600;
    box-shadow: 0 4rpx 16rpx rgba(22, 119, 255, 0.15);
}
</style>