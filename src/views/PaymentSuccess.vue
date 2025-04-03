<template>
  <div class="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-12">
      <div class="mb-4">
        <svg class="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-gray-900">Payment successful!</h1>
      <p class="mt-2 text-lg text-gray-600">Thank you for your purchase</p>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- 订单信息 -->
      <div class="p-6 border-b">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Information</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600">Contact Number</p>
            <p class="font-medium">{{ orderInfo.phone }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Email</p>
            <p class="font-medium">{{ orderInfo.email }}</p>
          </div>
        </div>
      </div>

      <!-- 商品列表 -->
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Purchase Products</h2>
        <div class="space-y-4">
          <div v-for="item in orderInfo.items" :key="item.id" class="flex items-center space-x-4">
            <img :src="item.image" :alt="item.name" class="w-16 h-16 object-cover rounded">
            <div class="flex-1">
              <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
              <p class="text-sm text-gray-600">quantity: {{ item.quantity }}</p>
            </div>
            <p class="font-medium text-gray-900">{{ item.price }}</p>
          </div>
        </div>
      </div>

      <!-- 总计 -->
      <div class="p-6 bg-gray-50">
        <div class="flex justify-between items-center text-lg font-semibold">
          <span>Total</span>
          <span>{{ orderInfo.total }}</span>
        </div>
      </div>
    </div>

    <div class="mt-8 text-center space-x-4">
      <router-link 
        to="/" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
      >
      Back to Home
      </router-link>
      <router-link 
        to="/products" 
        class="inline-flex items-center px-4 py-2 border border-primary-600 rounded-md shadow-sm text-sm font-medium text-primary-600 hover:bg-primary-50"
      >
      Continue shopping
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';

const orderInfo = ref({
  phone: '',
  email: '',
  items: [],
  total: ''
});

const savedOrderInfo = localStorage.getItem('orderInfo');
if (savedOrderInfo) {
  orderInfo.value = JSON.parse(savedOrderInfo);
}

// 组件卸载时清除订单信息
onUnmounted(() => {
  localStorage.removeItem('orderInfo');
});
</script>