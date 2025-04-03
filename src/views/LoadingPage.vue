<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div class="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin"></div>
    <h2 class="text-2xl font-semibold text-gray-900">Processing Your Order</h2>
    <p class="text-gray-600">Please wait while we process your payment...</p>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  // 确保订单信息已保存
  const orderInfo = localStorage.getItem('orderInfo');
  if (!orderInfo) {
    router.push('/');
    return;
  }

  // 模拟支付处理
  setTimeout(() => {
    router.push({
      name: 'PaymentSuccess'  // 使用命名路由进行跳转
    });
  }, 3000);
});
</script>
