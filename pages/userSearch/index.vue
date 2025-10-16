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
                    <view class="th checkbox-th"></view>
                    <view class="th">产品型号</view>
                    <view class="th">技术规范</view>
                    <view class="th">数量</view>
                    <view class="th">单位</view>
                </view>
                <checkbox-group v-model="checkedProducts" @change="(e) => checkedProducts = e.detail.value">
                    <view class="table-row" v-for="(item, idx) in products" :key="item.id">
                        <view class="td checkbox-td">
                            <checkbox
                                :value="String(item.id)"
                                :disabled="result.status == 2"
                                :checked="result.status == 2 ? (item.status == 1) : checkedProducts.includes(String(item.id))"
                                class="checkbox"
                                @click.stop
                            />
                        </view>
                        <view class="td">{{ item.product_model }}</view>
                        <view class="td">{{ item.technical_spec }}</view>
                        <view class="td">{{ item.product_num }}</view>
                        <view class="td">{{ item.product_unit }}</view>
                    </view>
                </checkbox-group>
            </view>

            <!-- 额外信息输入框 -->
            <view class="extra-info">
                <view class="extra-row">
                    <text class="label">remark：</text>
                    <textarea
                        v-if="result.status !== 2"
                        v-model="remark"
                        class="editable remark-textarea"
                        placeholder="请输入"
                        rows="4"
                    />
                    <text v-else>{{ remark || '-' }}</text>
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
import { staffDetail ,customConfirm} from '@/api/staff'
const tradeNo = ref('')
const result = ref(null)
const products = ref([])
const checkedProducts = ref([])

const remark = ref('')
const deptName = ref('')
const consigneeName = ref('')

const onSearch = async () => {
    if (!tradeNo.value) {
        uni.showToast({ title: '请输入运单号', icon: 'none' })
        return
    }
    staffDetail({ trade_no: tradeNo.value }).then((res) => {
        if (res.code == 200 || res.code == 0) {
            result.value = res.data
            products.value = result.value.products || []
            remark.value = result.value.remark || ''
            deptName.value = result.value.dept_name || ''
            consigneeName.value = result.value.consignee_name || ''
            checkedProducts.value = []
        } else {
            uni.showToast({ title: res.msg || '查询失败', icon: 'none' })
            result.value = null
            products.value = []
            remark.value = ''
            deptName.value = ''
            consigneeName.value = ''
            checkedProducts.value = []
        }
    }).catch((e) => { console.log(e); })
}

const onConfirm = () => {
    // return
    // 校验必填项
    if (!deptName.value) {
        uni.showToast({ title: '请输入部门', icon: 'none' })
        return
    }
    if (!consigneeName.value) {
        uni.showToast({ title: '请输入签收人', icon: 'none' })
        return
    }
    if (!checkedProducts.value.length) {
        uni.showToast({ title: '请选择产品', icon: 'none' })
        return
    }
    customConfirm({
        trade_no: tradeNo.value,
        check_ids: checkedProducts.value.join(','),
        remark: remark.value,
        dept_name: deptName.value,
        consignee_name: consigneeName.value
    }).then((res) => {
        if (res.code == 200 || res.code == 0) {
            uni.showToast({ title: '确认成功', icon: 'success' })
            // 更新为最新返回数据，状态变为已签收
            result.value = res.data
            products.value = res.data.products || []
            remark.value = res.data.remark || ''
            deptName.value = res.data.dept_name || ''
            consigneeName.value = res.data.consignee_name || ''
            checkedProducts.value = []
        } else {
            uni.showToast({ title: res.msg || '确认失败', icon: 'none' })
        }
    }).catch((e) => { console.log(e); })
}

const onCancel = () => {
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
    margin-top: 24rpx;
}

.table-header,
.table-row {
    display: flex;
    align-items: center;
}

.th,
.td {
    flex: 1;
    padding: 16rpx 8rpx;
    border-bottom: 1px solid #f0f0f0;
    font-size: 28rpx;
}

.checkbox-th,
.checkbox-td {
    flex: 0 0 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
}

.checkbox {
    width: 36rpx;
    height: 36rpx;
    border-radius: 50%;
    border: 1px solid #bbb;
    accent-color: #007aff;
}

.extra-info {
    margin-bottom: 24rpx;
    margin-top: 48rpx;
}

.extra-row {
    display: flex;
    align-items: center;
    margin-bottom: 16rpx;
}

.label {
    width: 120rpx;
    color: #333;
    font-size: 28rpx;
}

.editable {
    border: 1px solid #eee;
    border-radius: 16rpx;
    padding: 16rpx;
    width: 100%;
    font-size: 30rpx;
    min-height: 56rpx;
}

.remark-textarea {
    min-height: 120rpx;
    height: 120rpx;
    resize: none;
    font-size: 30rpx;
}

.action-btns {
    display: flex;
    justify-content: flex-end;
    margin-top: 44rpx;
}

.confirm-btn {
    background: #007aff;
    color: #fff;
    border-radius: 16rpx;
    padding: 8rpx 80rpx;
    margin-right: 16rpx;
    font-size: 32rpx;
}

.cancel-btn {
    background: #f5f5f5;
    color: #333;
    border-radius: 16rpx;
    padding: 8rpx 80rpx;
    font-size: 32rpx;
}
</style>