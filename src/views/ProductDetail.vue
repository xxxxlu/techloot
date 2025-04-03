<template>
  <div class="bg-white">
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Breadcrumb -->
      <nav class="flex mb-8" aria-label="Breadcrumb">
        <ol class="flex items-center space-x-2">
          <li>
            <router-link to="/" class="text-gray-500 hover:text-primary-600">Home</router-link>
          </li>
          <li>
            <span class="text-gray-400 mx-2">/</span>
            <router-link to="/products" class="text-gray-500 hover:text-primary-600">Products</router-link>
          </li>
          <li>
            <span class="text-gray-400 mx-2">/</span>
            <span class="text-gray-900">{{ product.name }}</span>
          </li>
        </ol>
      </nav>

      <!-- Product Info -->
      <div class="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <!-- Image Gallery -->
        <div class="mb-8 lg:mb-0">
          <div class="relative">
            <div class="aspect-w-1 aspect-h-1">
              <img
                :src="selectedImage"
                :alt="product.name"
                class="w-full h-full object-cover rounded-lg"
              />
            </div>
            <button
              v-if="isInWishlist"
              @click="toggleWishlist"
              class="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md text-red-500 hover:bg-primary-50 transition-colors"
            >
              <HeartIcon class="w-6 h-6" />
            </button>
            <button
              v-else
              @click="toggleWishlist"
              class="absolute top-4 right-4 p-2 rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
            >
              <HeartIcon class="w-6 h-6" />
            </button>
          </div>
          
          <!-- Thumbnail Gallery -->
          <div v-if="product.images && product.images.length > 1" class="mt-4 grid grid-cols-4 gap-4">
            <button
              v-for="(image, index) in product.images"
              :key="index"
              @click="selectedImage = image"
              class="relative aspect-w-1 aspect-h-1 rounded-lg overflow-hidden"
              :class="{ 'ring-2 ring-primary-600': selectedImage === image }"
            >
              <img :src="image" :alt="product.name" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="space-y-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
            <p class="mt-2 text-sm text-gray-500">{{ product.category }}</p>
          </div>

          <!-- Rating -->
          <div class="flex items-center space-x-4">
            <div class="flex items-center">
              <StarIcon
                v-for="i in 5"
                :key="i"
                class="w-5 h-5"
                :class="i <= product.rating ? 'text-yellow-400' : 'text-gray-300'"
              />
            </div>
            <span class="text-sm text-gray-600">({{ product.rating }} reviews)</span>
          </div>

          <!-- Price -->
          <div class="flex items-center space-x-4">
            <p class="text-3xl font-bold text-primary-600">{{ product.price }}</p>
            <span v-if="product.discount" class="text-sm text-red-600 font-medium">
              {{ product.discount }}% OFF
            </span>
          </div>

          <!-- Stock Status -->
          <div>
            <span
              :class="product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ product.inStock ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <!-- Color Selection -->
          <div v-if="product.colors && product.colors.length > 0">
            <h3 class="text-sm font-medium text-gray-900">Color</h3>
            <div class="mt-2 flex items-center space-x-3">
              <button
                v-for="color in product.colors"
                :key="color.name"
                @click="selectedColor = color"
                class="relative rounded-full h-8 w-8 border-2 focus:outline-none"
                :class="selectedColor === color ? 'border-primary-600' : 'border-transparent'"
                :style="{ backgroundColor: color.value }"
                :title="color.name"
              ></button>
            </div>
            <p v-if="selectedColor" class="mt-1 text-sm text-gray-500">
              Selected: {{ selectedColor.name }}
            </p>
          </div>

          <!-- Storage Selection -->
          <div v-if="product.storage && product.storage.length > 0">
            <h3 class="text-sm font-medium text-gray-900">Storage</h3>
            <div class="mt-2 flex flex-wrap gap-3">
              <button
                v-for="option in product.storage"
                :key="option.size"
                @click="selectedStorage = option"
                class="px-4 py-2 border rounded-md text-sm font-medium"
                :class="selectedStorage === option ? 'border-primary-600 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-700'"
              >
                {{ option.size }}
              </button>
            </div>
            <p v-if="selectedStorage" class="mt-1 text-sm text-gray-500">
              {{ selectedStorage.size }}: {{ selectedStorage.price }}
            </p>
          </div>

          <!-- Quantity -->
          <div>
            <h3 class="text-sm font-medium text-gray-900">Quantity</h3>
            <div class="mt-2 flex items-center space-x-3">
              <button
                @click="decrementQuantity"
                class="p-2 border border-gray-300 rounded-md"
                :disabled="quantity <= 1"
                :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
              >
                <MinusIcon class="w-4 h-4" />
              </button>
              <span class="w-8 text-center">{{ quantity }}</span>
              <button
                @click="incrementQuantity"
                class="p-2 border border-gray-300 rounded-md"
                :disabled="quantity >= 10"
                :class="{ 'opacity-50 cursor-not-allowed': quantity >= 10 }"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex space-x-4">
            <button
              @click="addToCart"
              class="flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors"
              :disabled="!product.inStock"
              :class="{ 'opacity-50 cursor-not-allowed': !product.inStock }"
            >
              Add to Cart
            </button>
            <button
              @click="buyNow"
              class="flex-1 bg-gray-900 text-white py-3 px-6 rounded-md hover:bg-gray-800 transition-colors"
              :disabled="!product.inStock"
              :class="{ 'opacity-50 cursor-not-allowed': !product.inStock }"
            >
              Buy Now
            </button>
          </div>

          <!-- Description -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p class="text-gray-600">{{ product.description }}</p>
          </div>

          <!-- Specifications -->
          <div v-if="product.specifications && product.specifications.length > 0" class="border-t pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div v-for="(spec, index) in product.specifications" :key="index" class="flex space-x-3">
                <dt class="text-sm font-medium text-gray-500">{{ spec.name }}:</dt>
                <dd class="text-sm text-gray-900">{{ spec.value }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="relatedProduct in relatedProducts"
            :key="relatedProduct.id"
            class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
          >
            <router-link :to="`/products/${relatedProduct.id}`" class="block">
              <div class="aspect-w-1 aspect-h-1">
                <img
                  :src="relatedProduct.image"
                  :alt="relatedProduct.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-4">
                <h3 class="text-lg font-medium text-gray-900 mb-2">{{ relatedProduct.name }}</h3>
                <p class="text-primary-600 font-bold">{{ relatedProduct.price }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notification -->
    <div v-if="showNotification" class="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md" role="alert">
      <span class="block sm:inline">{{ notificationMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HeartIcon, StarIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

const productId = computed(() => Number(route.params.id));
const selectedImage = ref('');
const selectedColor = ref(null);
const selectedStorage = ref(null);
const quantity = ref(1);
const isInWishlist = ref(false);
const showNotification = ref(false);
const notificationMessage = ref('');

// 获取商品数据
const product = computed(() => {
  const products = JSON.parse(localStorage.getItem('techloot-products') || '[]');
  const foundProduct = products.find(p => p.id === productId.value);
  if (!foundProduct) {
    router.push('/products');
    return {};
  }
  return foundProduct;
});

// 获取相关商品
const relatedProducts = computed(() => {
  const products = JSON.parse(localStorage.getItem('techloot-products') || '[]');
  return products
    .filter(p => p.category === product.value.category && p.id !== productId.value)
    .slice(0, 4);
});

onMounted(() => {
  if (product.value.image) {
    selectedImage.value = product.value.image;
  }
});

// Methods
const incrementQuantity = () => {
  if (quantity.value < 10) {
    quantity.value++;
  }
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value;
};

const addToCart = () => {
  // Get existing cart or initialize empty array
  const existingCart = localStorage.getItem('techloot-cart');
  const cart = existingCart ? JSON.parse(existingCart) : [];
  
  // Check if product already exists in cart
  const existingProduct = cart.find(item => item.id === product.value.id);
  
  if (existingProduct) {
    // Update quantity if product already in cart
    existingProduct.quantity += quantity.value;
  } else {
    // Add new product to cart
    cart.push({
      id: product.value.id,
      name: product.value.name,
      price: product.value.price,
      image: product.value.image || product.value.images[0],
      quantity: quantity.value
    });
  }
  
  // Save updated cart to localStorage
  localStorage.setItem('techloot-cart', JSON.stringify(cart));
};

const buyNow = () => {
  addToCart();
  router.push('/checkout');
};
</script>
