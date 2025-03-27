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
const productId = computed(() => Number(route.params.id));
const showNotification = ref(false);
const notificationMessage = ref('');

// Show notification function
const showNotificationMessage = (message: string) => {
  notificationMessage.value = message;
  showNotification.value = true;
  setTimeout(() => {
    showNotification.value = false;
  }, 3000);
};

// All products data
const allProducts = [
  {
    id: 1,
    name: "Redmi Watch 5",
    category: "Wearables",
    price: "Rs. 12,100",
    image: "https://mistore.pk/cdn/shop/files/Redmi_Watch_5_0000s_0000_Layer_1_1_300x.jpg?v=1736769255",
    rating: 4,
    reviewCount: 128,
    discount: 5,
    inStock: true,
    description: 'Experience the latest Redmi Watch 5 with dynamic island, featuring a stunning 1.1-inch AMOLED display, heart rate monitoring, and an advanced fitness tracking system.',
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
      { size: '128GB', price: 'Rs. 12,100' },
      { size: '256GB', price: 'Rs. 13,999' }
    ],
    specifications: [
      { name: 'Display', value: '1.1-inch AMOLED' },
      { name: 'Processor', value: 'Qualcomm Snapdragon Wear 4100' },
      { name: 'Battery', value: 'Up to 10 days battery life' },
      { name: 'OS', value: 'MIUI for Watch' },
      { name: 'Water Resistance', value: 'IP67' }
    ]
  },
  {
    id: 2,
    name: "Redmi Watch 5 Lite",
    category: "Wearables",
    price: "Rs. 8,300",
    image: "https://mistore.pk/cdn/shop/files/RedmiWatch5LiteBlack_300x.jpg?v=1728636950",
    rating: 4,
    reviewCount: 98,
    discount: 10,
    inStock: true,
    description: 'The affordable Redmi Watch 5 Lite offers essential fitness tracking features with a bright display and long battery life in a lightweight design.',
    images: [
      'https://mistore.pk/cdn/shop/files/RedmiWatch5LiteBlack_300x.jpg?v=1728636950',
      'https://mistore.pk/cdn/shop/files/RedmiWatch5LiteBlackSide_300x.jpg?v=1728636950',
      'https://mistore.pk/cdn/shop/files/RedmiWatch5LiteBlackBack_300x.jpg?v=1728636950'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Silver', value: '#F5F5F7' }
    ],
    storage: [
      { size: '32GB', price: 'Rs. 8,300' }
    ],
    specifications: [
      { name: 'Display', value: '1.0-inch LCD' },
      { name: 'Battery', value: 'Up to 7 days battery life' },
      { name: 'Water Resistance', value: 'IP68' },
      { name: 'Sensors', value: 'Heart rate, Accelerometer' }
    ]
  },
  {
    id: 3,
    name: "Xiaomi Smart Band 9 Active",
    category: "Wearables",
    price: "Rs. 6,600",
    image: "https://mistore.pk/cdn/shop/files/Band9ActiveBlack_300x.jpg?v=1731670089",
    rating: 5,
    reviewCount: 156,
    discount: 0,
    inStock: true,
    description: 'The Xiaomi Smart Band 9 Active is the perfect fitness companion with its lightweight design, heart rate monitoring, and extended battery life.',
    images: [
      'https://mistore.pk/cdn/shop/files/Band9ActiveBlack_300x.jpg?v=1731670089',
      'https://mistore.pk/cdn/shop/files/Band9ActiveBlackSide_300x.jpg?v=1731670089',
      'https://mistore.pk/cdn/shop/files/Band9ActiveBlackBack_300x.jpg?v=1731670089'
    ],
    colors: [
      { name: 'Black', value: '#000000' },
      { name: 'Blue', value: '#0000FF' }
    ],
    specifications: [
      { name: 'Display', value: '0.96-inch AMOLED' },
      { name: 'Battery', value: 'Up to 14 days battery life' },
      { name: 'Water Resistance', value: '5ATM' },
      { name: 'Sensors', value: 'Heart rate, SpO2, Accelerometer' }
    ]
  }
  // More products can be added here
];

// Get current product based on route ID
const product = computed(() => {
  const foundProduct = allProducts.find(p => p.id === productId.value);
  if (!foundProduct) {
    // Redirect to products page if product not found
    router.push('/products');
    return allProducts[0]; // Return default product to prevent errors
  }
  return foundProduct;
});

// Get related products (excluding current product)
const relatedProducts = computed(() => {
  return allProducts
    .filter(p => p.id !== productId.value && p.category === product.value.category)
    .slice(0, 4);
});

onMounted(() => {
  // Set initial selected image
  if (product.value && product.value.images && product.value.images.length > 0) {
    selectedImage.value = product.value.images[0];
  }
  
  // Set initial storage option if available
  if (product.value && product.value.storage && product.value.storage.length > 0) {
    selectedStorage.value = product.value.storage[0];
  }
  
  // Set initial color if available
  if (product.value && product.value.colors && product.value.colors.length > 0) {
    selectedColor.value = product.value.colors[0];
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
  
  // Show notification
  showNotificationMessage(`Added ${quantity.value} ${product.value.name} to cart`);
};

const buyNow = () => {
  addToCart();
  router.push('/checkout');
};
</script>
