<template>
  <div class="max-w-2xl mx-auto space-y-8">
    <h1 class="text-3xl font-bold text-gray-900">Checkout</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
        <div class="flex justify-between text-lg">
          <span>Total Amount:</span>
          <span class="font-semibold text-green-600">Rs. 299,999</span>
        </div>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Select Payment Method</h2>
          <div class="grid grid-cols-2 gap-4">
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
          type="submit"
          :disabled="!selectedPayment"
          class="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Place Order
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedPayment = ref('');

const paymentMethods = [
  { id: 'easypaisa', name: 'EasyPaisa', image: '/src/assets/easypaisa.png' },
  { id: 'jazzcash', name: 'JazzCash', image: '/src/assets/jazzcash.png' },
];

const handleSubmit = () => {
  // Process payment here
  router.push('/loading');
};</script>
