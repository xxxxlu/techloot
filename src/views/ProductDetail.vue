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
          <div class="mt-4 grid grid-cols-4 gap-4">
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
            <span class="text-sm text-gray-600">({{ product.reviewCount }} reviews)</span>
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
          <div v-if="product.colors">
            <h3 class="text-sm font-medium text-gray-900">Color</h3>
            <div class="mt-2 flex items-center space-x-3">
              <button
                v-for="color in product.colors"
                :key="color.name"
                @click="selectedColor = color"
                class="relative p-0.5 rounded-full flex items-center justify-center"
                :class="selectedColor === color ? 'ring-2 ring-primary-600' : ''"
              >
                <span
                  class="h-8 w-8 rounded-full border"
                  :style="{ backgroundColor: color.value }"
                />
              </button>
            </div>
          </div>

          <!-- Storage Selection -->
          <div v-if="product.storage">
            <h3 class="text-sm font-medium text-gray-900">Storage</h3>
            <div class="mt-2 grid grid-cols-3 gap-3">
              <button
                v-for="option in product.storage"
                :key="option.size"
                @click="selectedStorage = option"
                class="border rounded-md py-2 px-3 flex items-center justify-center text-sm font-medium"
                :class="selectedStorage === option ? 'border-primary-600 bg-primary-50 text-primary-600' : 'border-gray-300 text-gray-900 hover:bg-gray-50'"
              >
                {{ option.size }}
              </button>
            </div>
          </div>

          <!-- Quantity -->
          <div>
            <h3 class="text-sm font-medium text-gray-900">Quantity</h3>
            <div class="mt-2 flex items-center space-x-3">
              <button
                @click="decrementQuantity"
                class="p-2 border rounded-md hover:bg-gray-50"
                :disabled="quantity <= 1"
              >
                <MinusIcon class="w-5 h-5" />
              </button>
              <span class="text-lg font-medium text-gray-900">{{ quantity }}</span>
              <button
                @click="incrementQuantity"
                class="p-2 border rounded-md hover:bg-gray-50"
                :disabled="quantity >= 10"
              >
                <PlusIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <!-- Add to Cart -->
          <div class="flex space-x-4">
            <button
              @click="addToCart"
              class="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors"
              :disabled="!product.inStock"
            >
              Add to Cart
            </button>
            <button
              @click="buyNow"
              class="flex-1 border border-primary-600 text-primary-600 py-3 px-6 rounded-lg hover:bg-primary-50 transition-colors"
              :disabled="!product.inStock"
            >
              Buy Now
            </button>
          </div>

          <!-- Product Description -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Description</h3>
            <div class="prose prose-sm text-gray-600">
              <p>{{ product.description }}</p>
            </div>
          </div>

          <!-- Specifications -->
          <div class="border-t pt-6">
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
      <div class="mt-16">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="product in relatedProducts"
            :key="product.id"
            class="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div class="aspect-w-1 aspect-h-1">
              <img
                :src="product.image"
                :alt="product.name"
                class="object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {{ product.name }}
              </h3>
              <p class="text-primary-600 font-bold mt-2">{{ product.price }}</p>
              <router-link
                :to="'/products/' + product.id"
                class="mt-4 block w-full text-center bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                View Details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  HeartIcon,
  StarIcon,
  MinusIcon,
  PlusIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

// State
const quantity = ref(1);
const isInWishlist = ref(false);
const selectedColor = ref(null);
const selectedStorage = ref(null);
const selectedImage = ref('');

// Mock product data
const product = ref({
  id: 1,
  name: 'Redmi Watch 5',
  category: 'Smartwatches',
  price: 'Rs. 12,100',
  rating: 5,
  reviewCount: 128,
  description: 'Experience the latest Redmi Watch 5 with dynamic island, featuring a stunning 1.1-inch AMOLED display, heart rate monitoring, and an advanced fitness tracking system.',
  inStock: true,
  discount: 5,
  images: [
    'https://mistore.pk/cdn/shop/files/Redmi_Watch_5_0000s_0000_Layer_1_1_300x.jpg?v=1736769255',
    'https://mistore.pk/cdn/shop/files/Xiaomi_Smart_Band_9_black_300x.png?v=1727081522',
    'https://mistore.pk/cdn/shop/files/XiaomiWatch2black_300x.jpg?v=1723097714',
    'https://mistore.pk/cdn/shop/files/Band9ProBlack_300x.jpg?v=1731664316'
  ],
  colors: [
    { name: 'Deep Purple', value: '#5B4B8A' },
    { name: 'Gold', value: '#F4E8CE' },
    { name: 'Silver', value: '#F5F5F7' },
    { name: 'Space Black', value: '#4E4E4E' }
  ],
  storage: [
    { size: '128GB', price: 'Rs. 299,999' },
    { size: '256GB', price: 'Rs. 329,999' },
    { size: '512GB', price: 'Rs. 389,999' }
  ],
  specifications: [
    { name: 'Display', value: '1.1-inch AMOLED' },
    { name: 'Processor', value: 'Qualcomm Snapdragon Wear 4100' },
    { name: 'Camera', value: 'No camera' },
    { name: 'Battery', value: 'Up to 10 days battery life' },
    { name: 'OS', value: 'MIUI for Watch' },
    { name: 'Water Resistance', value: 'IP67' }
  ]
});

// Mock related products
const relatedProducts = ref([
  {
    id: 2,
    name: 'Redmi Watch 5 Lite',
    price: 'Rs. 12,100',
    image: 'https://mistore.pk/cdn/shop/files/RedmiWatch5LiteBlack_300x.jpg?v=1728636950'
  },
  {
    id: 3,
    name: 'Xiaomi Smart Band 9 Active',
    price: 'Rs. 6,600',
    image: 'https://mistore.pk/cdn/shop/files/Band9ActiveBlack_300x.jpg?v=1731670089'
  },
  {
    id: 4,
    name: 'Xiaomi Smart Band 8 Pro',
    price: 'Rs. 15,999',
    image: 'https://mistore.pk/cdn/shop/files/XiaomiSmartBand8pro_300x.jpg?v=1713513161'
  },
  {
    id: 5,
    name: 'Redmi Watch 5 Active',
    price: 'Rs. 8,300',
    image: 'https://mistore.pk/cdn/shop/files/RedmiWatch5ActiveBlackFront_300x.jpg?v=1728636441'
  }
]);

onMounted(() => {
  // Set initial selected image
  selectedImage.value = product.value.images[0];
  // Set initial storage option
  selectedStorage.value = product.value.storage[0];
  // Set initial color
  selectedColor.value = product.value.colors[0];
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
  // Add to cart logic here
  console.log('Adding to cart:', {
    product: product.value,
    quantity: quantity.value,
    color: selectedColor.value,
    storage: selectedStorage.value
  });
};

const buyNow = () => {
  // Add to cart and redirect to checkout
  addToCart();
  router.push('/checkout');
};
</script>
