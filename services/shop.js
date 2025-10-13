import { api } from './api.js'

export const shopService = {
	async listGoods(params = {}) {
		// return api.get('/goods', params)
		return [
			{ id: 1, name: '智能手环 Pro', brief: '心率/血氧/睡眠监测', price: 39900, cover: '', category: 'running', tags: ['新品', '热销'], sales: 1234 },
			{ id: 2, name: '蓝牙体脂秤', brief: '多维身体评估', price: 19900, cover: '', category: 'fitness', tags: ['推荐'], sales: 856 },
			{ id: 3, name: '运动耳机', brief: '防水降噪蓝牙耳机', price: 29900, cover: '', category: 'running', tags: ['热销'], sales: 2341 },
			{ id: 4, name: '瑜伽垫', brief: '防滑加厚专业瑜伽垫', price: 8900, cover: '', category: 'yoga', tags: ['推荐'], sales: 567 },
			{ id: 5, name: '智能跳绳', brief: '计数卡路里燃烧', price: 15900, cover: '', category: 'fitness', tags: ['新品'], sales: 432 },
			{ id: 6, name: '游泳镜', brief: '高清防雾专业泳镜', price: 12900, cover: '', category: 'swimming', tags: [], sales: 234 }
		]
	},
	
	async getCategories() {
		return [
			{ id: 'running', name: '跑步', icon: 'fire-fill', color: '#ff6b35', count: 45 },
			{ id: 'fitness', name: '健身', icon: 'star-fill', color: '#f7931e', count: 38 },
			{ id: 'swimming', name: '游泳', icon: 'heart-fill', color: '#ffd23f', count: 23 },
			{ id: 'yoga', name: '瑜伽', icon: 'gift-fill', color: '#34c759', count: 31 }
		]
	},
	
	async getDetail(id) {
		// return api.get(`/goods/${id}`)
		const products = {
			1: { 
				id: 1, 
				name: '智能手环 Pro', 
				brief: '心率/血氧/睡眠监测', 
				desc: '采用高精度传感器，24小时不间断监测您的健康数据。支持心率、血氧、睡眠质量分析，运动模式自动识别，防水等级IP68，续航时间长达7天。', 
				price: 39900, 
				gallery: [],
				specs: [
					{ label: '材质', value: '高级硅胶' },
					{ label: '防水等级', value: 'IP68' },
					{ label: '续航时间', value: '7天' },
					{ label: '重量', value: '25g' },
					{ label: '屏幕', value: '1.4英寸AMOLED' },
					{ label: '兼容性', value: 'iOS 10.0+/Android 5.0+' }
				],
				features: ['心率监测', '血氧检测', '睡眠分析', '运动识别', '消息提醒', '天气显示'],
				reviews: [
					{ user: '张**', rating: 5, comment: '功能很全面，续航也不错', date: '2024-01-15' },
					{ user: '李**', rating: 4, comment: '监测数据很准确，推荐购买', date: '2024-01-10' }
				]
			},
			2: { 
				id: 2, 
				name: '蓝牙体脂秤', 
				brief: '多维身体评估', 
				desc: '采用生物电阻抗技术，精准测量体重、体脂率、肌肉量、骨量等多项身体指标。支持多人数据管理，数据同步到手机APP，帮助您科学管理健康。', 
				price: 19900, 
				gallery: [],
				specs: [
					{ label: '材质', value: '钢化玻璃' },
					{ label: '最大承重', value: '150kg' },
					{ label: '精度', value: '0.1kg' },
					{ label: '电池', value: '4节AAA' },
					{ label: '尺寸', value: '300×300×25mm' },
					{ label: '连接', value: '蓝牙4.0' }
				],
				features: ['体重测量', '体脂率', '肌肉量', '骨量', '水分率', '多人管理'],
				reviews: [
					{ user: '王**', rating: 5, comment: '测量很准确，APP功能强大', date: '2024-01-12' },
					{ user: '赵**', rating: 4, comment: '性价比很高，推荐', date: '2024-01-08' }
				]
			}
		}
		return products[id] || products[1]
	},
	
	async searchGoods(keyword, category = '') {
		const allGoods = await this.listGoods()
		let results = allGoods
		
		if (keyword) {
			results = results.filter(item => 
				item.name.toLowerCase().includes(keyword.toLowerCase()) ||
				item.brief.toLowerCase().includes(keyword.toLowerCase())
			)
		}
		
		if (category) {
			results = results.filter(item => item.category === category)
		}
		
		return results
	},
	
	async getRecommendations() {
		return [
			{ id: 7, name: '运动水壶', brief: '大容量保温水壶', price: 6900, cover: '', category: 'fitness' },
			{ id: 8, name: '护膝', brief: '专业运动护膝', price: 8900, cover: '', category: 'running' }
		]
	},
	
	async getCart() {
		return uni.getStorageSync('cart') || []
	},
	
	async addToCart(item, qty = 1) {
		const cart = (uni.getStorageSync('cart') || [])
		const idx = cart.findIndex(i => i.id === item.id)
		if (idx >= 0) cart[idx].qty += qty
		else cart.push({ id: item.id, name: item.name, price: item.price, qty, category: item.category })
		uni.setStorageSync('cart', cart)
		return cart
	},
	
	async updateCart(itemId, qty) {
		let cart = (uni.getStorageSync('cart') || [])
		cart = cart.map(i => i.id === itemId ? { ...i, qty } : i).filter(i => i.qty > 0)
		uni.setStorageSync('cart', cart)
		return cart
	},
	
	async submitOrder(order) {
		// const data = await api.post('/orders', order)
		const data = { id: Date.now(), amount: order.items.reduce((s, i) => s + i.price * i.qty, 0) }
		return data
	},
	
	async payOrder(orderId, provider = 'alipay') {
		return new Promise((resolve) => {
			setTimeout(() => resolve({ success: true, orderId }), 600)
		})
	}
}


