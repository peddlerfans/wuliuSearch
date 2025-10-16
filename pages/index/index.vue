<template>
	<view class="login-content">
		<view class="login-tabs">
			<!-- <view class="login-tab" :class="{ active: loginType === 'customer' }" @click="loginType = 'customer'">
				客户登录
			</view>
			<view class="login-tab" :class="{ active: loginType === 'employee' }" @click="loginType = 'employee'">
				员工登录
			</view> -->
		</view>
		<view class="login-form">
			<input class="login-input" type="number" v-model="phone" placeholder="请输入手机号" />
			<input class="login-input" type="password" v-model="password" placeholder="请输入密码" />
			<view class="login-agreement">
				<checkbox-group @change="onCheckChange">
					<checkbox :value="'agree'" :checked="checked" />
				</checkbox-group>
				<text>
					我已阅读并同意
					<text class="link" @click="openAgreement('user')">《用户协议》</text>
					和
					<text class="link" @click="openAgreement('privacy')">《隐私政策》</text>
				</text>
			</view>
			<button class="login-btn" :disabled="!canSubmit" @click="submitLogin">
				登录
			</button>
		</view>
	</view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { login } from "@/api/login" // 假设有一个登录的API

const loginType = ref('employee')
const checked = ref(false)
const password = ref('')
const phone = ref('')
function onCheckChange(e) {
	checked.value = e.detail.value.includes('agree')
}

const canSubmit = computed(() => {
	return phone.value.trim() !== '' && password.value.trim() !== '' && checked.value
})

function openAgreement(type) {
	if (type === 'user') {
		uni.navigateTo({ url: '/pages/agreement/user' })
	} else {
		uni.navigateTo({ url: '/pages/agreement/privacy' })
	}
}

function submitLogin() {
	login({
		phone: phone.value,
		password: password.value
	}).then(res => {
		if (res.code == 200) {			
			uni.setStorageSync('token', res.data.token)
			uni.showToast({ title: '登录成功', icon: 'success' })
			if (loginType.value === 'employee') {
				uni.reLaunch({ url: '/pages/staff/index' })
				uni.setStorageSync('userType', 'employee')
			} else {
				uni.reLaunch({ url: '/pages/userSearch/index' })
				uni.setStorageSync('userType', 'customer')
			}
			
		} else {
			uni.showToast({ title: res.message || '登录失败', icon: 'none' })
		}
	}).catch(() => {
		uni.showToast({ title: '网络错误，请稍后重试', icon: 'none' })
	})
}
</script>

<style>
.login-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 60rpx 40rpx 0 40rpx;
}

.login-tabs {
	display: flex;
	width: 100%;
	justify-content: center;
	margin-bottom: 40rpx;
}

.login-tab {
	font-size: 32rpx;
	padding: 0 40rpx 20rpx 40rpx;
	color: #888;
	border-bottom: 4rpx solid transparent;
	cursor: pointer;
}

.login-tab.active {
	color: #007aff;
	border-bottom: 4rpx solid #007aff;
	font-weight: bold;
}

.login-form {
	width: 100%;
	max-width: 500rpx;
	display: flex;
	flex-direction: column;
	align-items: stretch;
}

.login-input {
	height: 80rpx;
	border: 1rpx solid #ddd;
	border-radius: 8rpx;
	margin-bottom: 32rpx;
	padding: 0 24rpx;
	font-size: 30rpx;
	background: #fff;
}

.login-agreement {
	display: flex;
	align-items: center;
	font-size: 24rpx;
	color: #888;
	margin-bottom: 32rpx;
}

.login-agreement .link {
	color: #007aff;
	margin: 0 6rpx;
	text-decoration: underline;
}

.login-btn {
	height: 80rpx;
	background: #007aff;
	color: #fff;
	font-size: 32rpx;
	border-radius: 8rpx;
	border: none;
	margin-top: 12rpx;
}

.login-btn:disabled {
	background: #b0c4de;
	color: #fff;
}
</style>
