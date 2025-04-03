<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
    
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧账单信息 -->
      <div class="lg:col-span-2">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h2 class="text-xl font-semibold text-gray-900 mb-6">Billing Details</h2>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">First name *</label>
                <input
                  type="text"
                  v-model="billingDetails.firstName"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Last name *</label>
                <input
                  type="text"
                  v-model="billingDetails.lastName"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Company name (optional)</label>
              <input
                type="text"
                v-model="billingDetails.company"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Country / Region *</label>
              <select
                v-model="billingDetails.country"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              >
                <option value="">Select a country / region</option>
                <option value="Pakistan">Pakistan</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Street address *</label>
              <input
                type="text"
                v-model="billingDetails.street"
                required
                placeholder="House number and street name"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">Town / City *</label>
                <input
                  type="text"
                  v-model="billingDetails.city"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">State *</label>
                <input
                  type="text"
                  v-model="billingDetails.state"
                  required
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">ZIP / Postal code *</label>
              <input
                type="text"
                v-model="billingDetails.zip"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Phone *</label>
              <input
                type="tel"
                v-model="billingDetails.phone"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Email address *</label>
              <input
                type="email"
                v-model="billingDetails.email"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Order notes (optional)</label>
              <textarea
                v-model="billingDetails.notes"
                rows="4"
                placeholder="Notes about your order, e.g. special delivery instructions"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              />
            </div>
          </form>
        </div>
      </div>

      <!-- 右侧支付信息 -->
      <div class="lg:col-span-1">
        <div class="bg-white p-6 rounded-lg shadow-md space-y-6 sticky top-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
            <!-- 添加商品列表 -->
            <div class="space-y-4 mb-4">
              <div v-for="item in cart" :key="item.id" class="flex justify-between items-center py-2 border-b">
                <div class="flex-1">
                  <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                  <p class="text-sm text-gray-500">Quantity: {{ item.quantity }}</p>
                </div>
                <div class="text-sm font-medium text-gray-900">{{ item.price }}</div>
              </div>
            </div>
            <!-- 总价 -->
            <div class="flex justify-between text-lg pt-4 border-t">
              <span>Total Amount:</span>
              <span class="font-semibold text-green-600">Rs. {{ totalAmount.toLocaleString() }}</span>
            </div>
          </div>
          
          <!-- 其他支付相关内容保持不变 -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Select Payment Method</h2>
            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                :class="{
                  'flex items-center space-x-3 p-4 border rounded-lg cursor-pointer': true,
                  'border-green-600 bg-green-50': selectedPayment === method.id,
                  'border-gray-200': selectedPayment !== method.id
                }"
              >
                <input
                  type="radio"
                  name="payment"
                  :value="method.id"
                  v-model="selectedPayment"
                  class="text-green-600 focus:ring-green-500"
                />
                <div class="flex items-center space-x-3">
                  <img
                    :src="method.image"
                    :alt="method.name"
                    class="w-8 h-8 object-contain"
                  />
                  <span class="font-medium text-gray-900">{{ method.name }}</span>
                </div>
              </label>
            </div>
          </div>
          
          <button
            @click="handleSubmit"
            :disabled="!selectedPayment || !isFormValid"
            class="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedPayment = ref('');
const cart = ref<any[]>([]);

// 账单信息
const billingDetails = ref({
  firstName: '',
  lastName: '',
  company: '',
  country: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  email: '',
  notes: ''
});

// 表单验证
const isFormValid = computed(() => {
  const { firstName, lastName, country, street, city, state, zip, phone, email } = billingDetails.value;
  return firstName && lastName && country && street && city && state && zip && phone && email;
});

// 初始化购物车数据
const initCart = () => {
  const savedCart = localStorage.getItem('techloot-cart');
  cart.value = savedCart ? JSON.parse(savedCart) : [];
};

// 计算总价格
const totalAmount = computed(() => {
  return cart.value.reduce((total, item) => {
    const price = parseInt(item.price.replace(/[^0-9]/g, ''));
    return total + (price * item.quantity);
  }, 0);
});

// 在组件创建时初始化购物车
initCart();

const paymentMethods = [
  { id: 'easypaisa', name: 'EasyPaisa', image: '/src/assets/easypaisa.png' },
  { id: 'jazzcash', name: 'JazzCash', image: '/src/assets/jazzcash.png' },
];

const handleSubmit = () => {
  if (!isFormValid.value || !selectedPayment.value) return;
  
  // 保存订单信息到 orderInfo，用于支付成功页面显示
  const orderInfo = {
    phone: billingDetails.value.phone,
    email: billingDetails.value.email,
    items: cart.value,
    total: `Rs. ${totalAmount.value.toLocaleString()}`
  };
  
  // 先保存订单信息
  localStorage.setItem('orderInfo', JSON.stringify(orderInfo));
  
  // 保存完整订单数据
  const orderData = {
    billingDetails: billingDetails.value,
    paymentMethod: selectedPayment.value,
    totalAmount: totalAmount.value,
    items: cart.value,
    orderDate: new Date().toISOString()
  };
  localStorage.setItem('techloot-last-order', JSON.stringify(orderData));
  
  // 最后再清空购物车
  localStorage.removeItem('techloot-cart');
  cart.value = [];
  
  // 跳转到加载页面
  router.push('/loading');
};
</script>
