<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="relative bg-primary-600 text-white py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div class="space-y-8">
            <h1 class="text-5xl font-bold leading-tight">
              Your Premier Tech Store in Pakistan
            </h1>
            <p class="text-xl text-primary-100">
              Discover the latest electronics and gadgets at unbeatable prices
            </p>
            <div class="flex space-x-4">
              <router-link
                to="/products"
                class="inline-flex items-center px-6 py-3 border-2 border-white rounded-lg text-lg font-medium hover:bg-white hover:text-primary-600 transition-colors"
              >
                Shop Now
              </router-link>
              <router-link
                to="/register"
                class="inline-flex items-center px-6 py-3 bg-white text-primary-600 rounded-lg text-lg font-medium hover:bg-primary-100 transition-colors"
              >
                Join Us
              </router-link>
            </div>
          </div>
          <div class="mt-12 lg:mt-0">
            <img
              alt="Latest devices"
              src="https://mistore.pk/cdn/shop/files/Artboard_1_copy_2_d08dee80-eff7-4417-96cb-ba3075c34f1c_300x.jpg?v=1724499700"
              class="w-full object-cover rounded-lg shadow-xl animate-pulse-slow"
            />
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50"></div>
    </section>

    <!-- Featured Categories -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Featured Categories</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          v-for="category in categories"
          :key="category.id"
          class="group relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="aspect-w-3 aspect-h-2">
            <img
              :src="category.image"
              :alt="category.name"
              class="object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-6">
            <h3 class="text-2xl font-bold text-white mb-2">{{ category.name }}</h3>
            <p class="text-primary-200 mb-4">{{ category.description }}</p>
            <router-link
              :to="category.link"
              class="inline-flex items-center text-white hover:text-primary-200"
            >
              Explore More
              <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Products -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Latest Products</h2>
        <router-link
          to="/products"
          class="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          View All
          <svg class="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="product in latestProducts"
          :key="product.id"
          class="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
        >
          <div class="aspect-w-1 aspect-h-1">
            <img
              :src="product.image"
              :alt="product.name"
              class="object-cover transform group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ product.name }}</h3>
            <p class="text-primary-600 font-bold mb-2">{{ product.price }}</p>
            <router-link
              :to="'/products/' + product.id"
              class="block w-full text-center bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="bg-primary-50 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose TechLoot?</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div
            v-for="feature in features"
            :key="feature.id"
            class="text-center"
          >
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-4">
              <component :is="feature.icon" class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  TruckIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ChatBubbleBottomCenterTextIcon
} from '@heroicons/vue/24/outline';

const categories = [
  {
    id: 1,
    name: 'Wearables',
    description: 'Smart watches, bands and fitness trackers',
    image: 'https://mistore.pk/cdn/shop/files/Redmi_Watch_5_0000s_0000_Layer_1_1_300x.jpg?v=1736769255',
    link: '/products?category=wearables'
  },
  {
    id: 2,
    name: 'Accessories',
    description: 'Keyboards, mice and other tech accessories',
    image: 'https://mistore.pk/cdn/shop/products/XiaomiWirelessKeyboardandMouseCombo_300x.png?v=1673508534',
    link: '/products?category=accessories'
  },
  {
    id: 3,
    name: 'Networking',
    description: 'Routers, range extenders and networking gear',
    image: 'https://mistore.pk/cdn/shop/files/routerAC1200_300x.jpg?v=1710919264',
    link: '/products?category=networking'
  }
];

const latestProducts = [
  {
    id: 1,
    name: "redmi watch 5",
    price: "Rs. 25,100",
    image: "https://mistore.pk/cdn/shop/files/Redmi_Watch_5_0000s_0000_Layer_1_1_300x.jpg?v=1736769255",
    discount: "7% OFF",
    saveAmount: "Save Rs. 1,900",
    onSale: true
  },
  {
    id: 2,
    name: "xiaomi smart band 9",
    price: "Rs. 10,000",
    image: "https://mistore.pk/cdn/shop/files/Xiaomi_Smart_Band_9_black_300x.png?v=1727081522",
    discount: "9% OFF",
    saveAmount: "Save Rs. 1,000",
    onSale: true
  },
  {
    id: 3,
    name: "xiaomi watch 2 overview",
    price: "Rs. 47,000",
    image: "https://mistore.pk/cdn/shop/files/XiaomiWatch2black_300x.jpg?v=1723097714",
    discount: "6% OFF",
    saveAmount: "Save Rs. 3,000",
    onSale: true
  },
  {
    id: 4,
    name: "xiaomi wireless keyboard and mouse combo overview",
    price: "Rs. 6,900",
    image: "https://mistore.pk/cdn/shop/products/XiaomiWirelessKeyboardandMouseCombo_300x.png?v=1673508534",
    discount: "8% OFF",
    saveAmount: "Save Rs. 600",
    onSale: true
  }
];

const features = [
  {
    id: 1,
    icon: TruckIcon,
    title: 'Fast Delivery',
    description: 'Free delivery across Pakistan on orders above Rs. 50,000'
  },
  {
    id: 2,
    icon: ShieldCheckIcon,
    title: 'Secure Shopping',
    description: 'Your security is our top priority'
  },
  {
    id: 3,
    icon: CurrencyDollarIcon,
    title: 'Best Prices',
    description: 'We offer competitive prices on all products'
  },
  {
    id: 4,
    icon: ChatBubbleBottomCenterTextIcon,
    title: '24/7 Support',
    description: 'Get help anytime via chat or phone'
  }
];
</script>
