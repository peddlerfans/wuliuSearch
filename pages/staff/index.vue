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
                <!-- Top: 运单号 (原单号) -->
                <view class="waybill-header">
                    <text class="waybill-no">{{ item.waybillNo }}</text>
                    <text v-if="item.originalNo" class="original-no">（{{ item.originalNo }}）</text>
                </view>
                <!-- Middle: 收件人、电话、状态、箭头 -->
                <view class="waybill-info">
                    <view class="info-left">
                        <text class="recipient">{{ item.recipient }}</text>
                        <text class="phone">{{ item.phone }}</text>
                    </view>
                    <view class="info-right"></view>
                    <text :class="['status', item.statusClass]">{{ item.statusText }}</text>
                    <text class="arrow">➔</text>
                </view>
            </view>
            <!-- Bottom: 详情按钮 -->
            <view class="waybill-footer">
                <button class="detail-btn" @tap="goToDetail(item)">详情</button>
            </view>
        </view>
        <view v-if="filteredList.length === 0" class="empty">暂无数据</view>

        <!-- 固定右下角按钮 -->
        <button class="fixed-btn">固定按钮</button>
    </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const tabs = [
    { label: '全部', value: 'all' },
    { label: '待签收', value: 'pending' },
    { label: '有疑义', value: 'questioned' },
    { label: '已签收', value: 'signed' }
]
const currentTab = ref('all')

// 示例数据
const waybillList = ref([
    {
        id: 1,
        waybillNo: 'WB20240601001',
        originalNo: 'OD20240531001',
        recipient: '张三',
        phone: '13800138000',
        status: 'pending'
    },
    {
        id: 2,
        waybillNo: 'WB20240601002',
        recipient: '李四',
        phone: '13900139000',
        status: 'signed'
    },
    {
        id: 3,
        waybillNo: 'WB20240601003',
        recipient: '王五',
        phone: '13700137000',
        status: 'questioned'
    }
])

const statusMap = {
    pending: { text: '待签收', class: 'pending' },
    questioned: { text: '有疑义', class: 'questioned' },
    signed: { text: '已签收', class: 'signed' }
}

const filteredList = computed(() => {
    if (currentTab.value === 'all') return waybillList.value.map(addStatusText)
    return waybillList.value
        .filter(item => item.status === currentTab.value)
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
    // 跳转到详情页逻辑
    uni.navigateTo({
        url: `/pages/staff/detail?id=${item.id}`
    })
}
</script>

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
    justify-content: space-between;
    align-items: center;

    .info-left {
        display: flex;
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

    .info-right {
        display: flex;
        align-items: center;
        gap: 16rpx;

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
    position: fixed;
    right: 48rpx;
    bottom: 48rpx;
    z-index: 100;
    background: #1677ff;
    color: #fff;
    border: none;
    border-radius: 50rpx;
    padding: 20rpx 48rpx;
    font-size: 30rpx;
    font-weight: 600;
    box-shadow: 0 4rpx 16rpx rgba(22, 119, 255, 0.15);
}
</style>