<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-gray-900">Shopping Cart</h1>
    
    <template v-if="cartItems.length === 0">
      <p class="text-gray-600">Your cart is empty</p>
    </template>
    
    <template v-else>
      <div class="space-y-4">
        <div
          v-for="item in cartItems"
          :key="item.id"
          class="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-md"
        >
          <img
            :src="item.image"
            :alt="item.name"
            class="w-24 h-24 object-cover rounded-md"
          />
          <div class="flex-1">
            <h2 class="text-xl font-semibold text-gray-900">{{ item.name }}</h2>
            <p class="text-green-600">{{ item.price }}</p>
          </div>
          <div class="flex items-center space-x-2">
            <label :for="`quantity-${item.id}`" class="sr-only">Quantity</label>
            <input
              type="number"
              :id="`quantity-${item.id}`"
              v-model="item.quantity"
              min="1"
              @input="updateQuantity(item)"
              class="w-16 rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
            />
            <button
              @click="removeItem(item.id)"
              class="text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <span class="text-xl font-semibold text-gray-900">Total:</span>
          <span class="text-2xl font-bold text-green-600">{{ total }}</span>
        </div>
        
        <button
          @click="proceedToCheckout"
          class="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
        >
          Proceed to Checkout
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Cart items from localStorage
const cartItems = ref<any[]>([]);

// Load cart items from localStorage
onMounted(() => {
  const savedCart = localStorage.getItem('techloot-cart');
  if (savedCart) {
    cartItems.value = JSON.parse(savedCart);
  }
});

// Calculate total price
const total = computed(() => {
  if (cartItems.value.length === 0) return 'Rs. 0';
  
  const totalAmount = cartItems.value.reduce((sum, item) => {
    // Extract numeric value from price string (e.g., "Rs. 25,100" -> 25100)
    const priceValue = parseInt(item.price.replace(/[^0-9]/g, ''));
    return sum + (priceValue * item.quantity);
  }, 0);
  
  // Format total with thousand separators
  return `Rs. ${totalAmount.toLocaleString()}`;
});

const removeItem = (id: number) => {
  const index = cartItems.value.findIndex(item => item.id === id);
  if (index !== -1) {
    cartItems.value.splice(index, 1);
    // Update localStorage
    localStorage.setItem('techloot-cart', JSON.stringify(cartItems.value));
  }
};

const updateQuantity = (item: any) => {
  // Ensure quantity is at least 1
  if (item.quantity < 1) item.quantity = 1;
  // Update localStorage
  localStorage.setItem('techloot-cart', JSON.stringify(cartItems.value));
};

const proceedToCheckout = () => {
  router.push('/checkout');
};
</script>
