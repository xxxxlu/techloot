<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-900">Our Products</h1>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Filters -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div class="lg:col-span-1">
          <div class="bg-white shadow rounded-lg p-6 space-y-6">
            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Categories</h3>
              <div class="space-y-3">
                <label v-for="category in categories" :key="category.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="selectedCategories"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-gray-700">{{ category.name }}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm text-gray-700">Min Price (Rs.)</label>
                  <input
                    type="number"
                    v-model="priceRange.min"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label class="block text-sm text-gray-700">Max Price (Rs.)</label>
                  <input
                    type="number"
                    v-model="priceRange.max"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 class="text-lg font-medium text-gray-900 mb-4">Sort By</h3>
              <select
                v-model="sortBy"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name</option>
              </select>
            </div>

            <button
              @click="resetFilters"
              class="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="lg:col-span-3">
          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <h3 class="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p class="text-gray-600">Try adjusting your filters</p>
          </div>
          
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="product in filteredProducts"
              :key="product.id"
              class="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <router-link :to="`/products/${product.id}`" class="block">
                <div class="relative">
                  <div class="aspect-w-1 aspect-h-1">
                    <img
                      :src="product.image"
                      :alt="product.name"
                      class="object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div class="absolute top-2 right-2">
                    <button
                      @click.stop.prevent="toggleWishlist(product.id)"
                      class="p-2 rounded-full bg-white shadow-md hover:bg-primary-50 transition-colors"
                      :class="{ 'text-red-500': isInWishlist(product.id) }"
                    >
                      <HeartIcon class="w-6 h-6" />
                    </button>
                  </div>
                  <div
                    v-if="product.discount"
                    class="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded"
                  >
                    {{ product.discount }}% OFF
                  </div>
                </div>
                <div class="p-4">
                  <h3 class="text-lg font-medium text-gray-900 mb-1">{{ product.name }}</h3>
                  <div class="flex items-center mb-2">
                    <div class="flex">
                      <StarIcon
                        v-for="i in 5"
                        :key="i"
                        class="w-4 h-4"
                        :class="i <= (product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'"
                      />
                    </div>
                    <span class="text-xs text-gray-500 ml-1">{{ product.reviewCount || 0 }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <p class="text-lg font-bold text-primary-600">{{ product.price }}</p>
                    <button
                      @click.stop.prevent="addToCart(product)"
                      class="bg-primary-600 text-white py-1 px-3 rounded-md text-sm hover:bg-primary-700 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <div class="mt-8 flex justify-center">
            <nav class="flex items-center space-x-2">
              <button
                v-for="page in totalPages"
                :key="page"
                @click="currentPage = page"
                class="px-3 py-1 rounded-md"
                :class="currentPage === page ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-primary-50'"
              >
                {{ page }}
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCartNotification" class="fixed bottom-0 right-0 mb-4 mr-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
      <span class="block sm:inline">{{ cartNotificationMessage }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { HeartIcon, StarIcon } from '@heroicons/vue/24/outline';

// Categories
const categories = [
  { id: 'wearables', name: 'Wearables' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'tablets', name: 'Tablets' },
  { id: 'networking', name: 'Networking' },
];

// Products data
const products = [
  {
    id: 1,
    name: "redmi watch 5",
    category: "Wearables",
    price: "Rs. 25,100",
    image: "https://mistore.pk/cdn/shop/files/Redmi_Watch_5_0000s_0000_Layer_1_1_300x.jpg?v=1736769255",
    rating: 4,
    description: "Redmi Watch 5",
    discount: "7% OFF",
    saveAmount: "Save Rs. 1,900",
    onSale: true
  },
  {
    id: 2,
    name: "xiaomi smart band 9 active overview",
    category: "Wearables",
    price: "Rs. 6,600",
    image: "https://mistore.pk/cdn/shop/files/Band9ActiveBlack_300x.jpg?v=1731670089",
    rating: 4,
    description: "Xiaomi Smart Band 9 Active",
    discount: "6% OFF",
    saveAmount: "Save Rs. 400",
    onSale: true
  },
  {
    id: 3,
    name: "xiaomi smart band 9",
    category: "Wearables",
    price: "Rs. 10,000",
    image: "https://mistore.pk/cdn/shop/files/Xiaomi_Smart_Band_9_black_300x.png?v=1727081522",
    rating: 5,
    description: "Xiaomi Smart Band 9",
    discount: "9% OFF",
    saveAmount: "Save Rs. 1,000",
    onSale: true
  },
  {
    id: 4,
    name: "redmi watch 5 lite overview",
    category: "Wearables",
    price: "Rs. 12,100",
    image: "https://mistore.pk/cdn/shop/files/RedmiWatch5LiteBlack_300x.jpg?v=1728636950",
    rating: 4,
    description: "Redmi Watch 5 Lite",
    discount: "7% OFF",
    saveAmount: "Save Rs. 900",
    onSale: true
  },
  {
    id: 5,
    name: "redmi watch 5 active overview",
    category: "Wearables",
    price: "Rs. 8,300",
    image: "https://mistore.pk/cdn/shop/files/RedmiWatch5ActiveBlackFront_300x.jpg?v=1728636441",
    rating: 4,
    description: "Redmi Watch 5 Active",
    discount: "8% OFF",
    saveAmount: "Save Rs. 700",
    onSale: true
  },
  {
    id: 6,
    name: "xiaomi smart band 9 pro overview",
    category: "Wearables",
    price: "Rs. 18,800",
    image: "https://mistore.pk/cdn/shop/files/Band9ProBlack_300x.jpg?v=1731664316",
    rating: 5,
    description: "Xiaomi Smart Band 9 Pro",
    discount: "6% OFF",
    saveAmount: "Save Rs. 1,200",
    onSale: true
  },
  {
    id: 7,
    name: "mi selfie stick tripod",
    category: "Accessories",
    price: "Rs. 5,400",
    image: "https://mistore.pk/cdn/shop/products/selfie_stick_tripod_grande_1a4a0cf8-9f0d-42d5-99fc-ddac096cc0a9_300x.jpg?v=1616613915",
    rating: 4,
    description: "Mi Selfie Stick Tripod",
    discount: "10% OFF",
    saveAmount: "Save Rs. 600",
    onSale: true
  },
  {
    id: 8,
    name: "mi computer monitor light bar",
    category: "Accessories",
    price: "Rs. 13,200",
    image: "https://mistore.pk/cdn/shop/products/MI-COMPUTER-MONITOR-LIGHT-BAR---02_300x.png?v=1617791738",
    rating: 4,
    description: "Mi Computer Monitor Light Bar",
    discount: "6% OFF",
    saveAmount: "Save Rs. 800",
    onSale: true
  },
  {
    id: 9,
    name: "xiaomi smart band 7 strap",
    category: "Accessories",
    price: "Rs. 1,500",
    image: "https://mistore.pk/cdn/shop/files/Band7Strap_300x.png?v=1683106930",
    rating: 4,
    description: "Xiaomi Smart Band 7 Strap",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 10,
    name: "mi lcd writing tablet 13 5",
    category: "Tablets",
    price: "Rs. 8,999",
    image: "https://mistore.pk/cdn/shop/products/Untitled-2-01_300x.png?v=1666785044",
    rating: 4,
    description: "Mi LCD Writing Tablet 13.5",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 11,
    name: "xiaomi smart band 8 pro 1 overview",
    category: "Wearables",
    price: "Rs. 15,999",
    image: "https://mistore.pk/cdn/shop/files/XiaomiSmartBand8pro_300x.jpg?v=1713513161",
    rating: 5,
    description: "Xiaomi Smart Band 8 Pro",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 12,
    name: "xiaomi wireless keyboard and mouse combo overview",
    category: "Accessories",
    price: "Rs. 6,900",
    image: "https://mistore.pk/cdn/shop/products/XiaomiWirelessKeyboardandMouseCombo_300x.png?v=1673508534",
    rating: 4,
    description: "Xiaomi Wireless Keyboard and Mouse Combo",
    discount: "8% OFF",
    saveAmount: "Save Rs. 600",
    onSale: true
  },
  {
    id: 13,
    name: "xiaomi wifi range extender n300",
    category: "Networking",
    price: "Rs. 4,900",
    image: "https://mistore.pk/cdn/shop/files/XiaomiWiFiRangeExtenderN300_300x.jpg?v=1698750648",
    rating: 4,
    description: "Xiaomi WiFi Range Extender N300",
    discount: "11% OFF",
    saveAmount: "Save Rs. 600",
    onSale: true
  },
  {
    id: 14,
    name: "xiaomi wireless mouse lite",
    category: "Accessories",
    price: "Rs. 3,250",
    image: "https://mistore.pk/cdn/shop/products/xiaomiwirelessmouselite_300x.png?v=1674625404",
    rating: 4,
    description: "Xiaomi Wireless Mouse Lite",
    discount: "7% OFF",
    saveAmount: "Save Rs. 250",
    onSale: true
  },
  {
    id: 15,
    name: "xiaomi router ac1200",
    category: "Networking",
    price: "Rs. 8,999",
    image: "https://mistore.pk/cdn/shop/files/routerAC1200_300x.jpg?v=1710919264",
    rating: 4,
    description: "Xiaomi Router AC1200",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 16,
    name: "xiaomi watch 2 overview",
    category: "Wearables",
    price: "Rs. 47,000",
    image: "https://mistore.pk/cdn/shop/files/XiaomiWatch2black_300x.jpg?v=1723097714",
    rating: 5,
    description: "Xiaomi Watch 2",
    discount: "6% OFF",
    saveAmount: "Save Rs. 3,000",
    onSale: true
  },
  {
    id: 17,
    name: "xiaomi wireless mouse 3",
    category: "Accessories",
    price: "Rs. 4,999",
    image: "https://mistore.pk/cdn/shop/files/XiaomiWirelessMouseLite2BlackFront_fb57ed26-c9f7-4089-93ca-3c8947ea0ee9_300x.jpg?v=1722671132",
    rating: 4,
    description: "Xiaomi Wireless Mouse 3",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 18,
    name: "xiaomi wireless mouse lite 2",
    category: "Accessories",
    price: "Rs. 3,600",
    image: "https://mistore.pk/cdn/shop/files/Artboard_1_copy_2_d08dee80-eff7-4417-96cb-ba3075c34f1c_300x.jpg?v=1724499700",
    rating: 4,
    description: "Xiaomi Wireless Mouse Lite 2",
    discount: "11% OFF",
    saveAmount: "Save Rs. 400",
    onSale: true
  },
  {
    id: 19,
    name: "xiaomi wireless mouse comfort edition",
    category: "Accessories",
    price: "Rs. 5,999",
    image: "https://mistore.pk/cdn/shop/files/XiaomiWirelessMouseComfortEdition_Black_White_300x.jpg?v=1739878562",
    rating: 4,
    description: "Xiaomi Wireless Mouse Comfort Edition",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 20,
    name: "xiaomi dual mode wireless mouse 2",
    category: "Accessories",
    price: "Rs. 6,499",
    image: "https://mistore.pk/cdn/shop/files/XiaomiDual-modeWirelessMouse2_White_Black_300x.jpg?v=1739878988",
    rating: 4,
    description: "Xiaomi Dual Mode Wireless Mouse 2",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 21,
    name: "Samsung 970 EVO Plus 1TB NVMe SSD",
    category: "Accessories",
    price: "Rs. 32,499",
    image: "https://m.media-amazon.com/images/I/71OYNmVRFhL._AC_SL1500_.jpg",
    rating: 5,
    description: "High-performance NVMe SSD with exceptional speed and reliability",
    discount: "5% OFF",
    saveAmount: "Save Rs. 1,700",
    onSale: true
  },
  {
    id: 22,
    name: "LG 27GP850-B 27\" Gaming Monitor",
    category: "Accessories",
    price: "Rs. 49,999",
    image: "https://m.media-amazon.com/images/I/81El4887iLL._AC_SL1500_.jpg",
    rating: 4,
    description: "144Hz 1ms GTG IPS Gaming Monitor with HDR",
    discount: "8% OFF",
    saveAmount: "Save Rs. 7,200",
    onSale: true
  },
  {
    id: 23,
    name: "Sony WH-1000XM4 Wireless Headphones",
    category: "Accessories",
    price: "Rs. 45,999",
    image: "https://m.media-amazon.com/images/I/61oqO1AMbdL._AC_SL1500_.jpg",
    rating: 5,
    description: "Premium noise-cancelling wireless headphones",
    discount: "10% OFF",
    saveAmount: "Save Rs. 4,600",
    onSale: true
  },
  {
    id: 24,
    name: "Blue Yeti USB Microphone",
    category: "Accessories",
    price: "Rs. 28,999",
    image: "https://m.media-amazon.com/images/I/61egnO8q6ZL._AC_SL1500_.jpg",
    rating: 4,
    description: "Professional USB microphone for streaming and recording",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 25,
    name: "Razer BlackWidow V3 Pro Keyboard",
    category: "Accessories",
    price: "Rs. 48,999",
    image: "https://m.media-amazon.com/images/I/81Wsrt05uLL._AC_SL1500_.jpg",
    rating: 4,
    description: "Wireless mechanical gaming keyboard with RGB",
    discount: "12% OFF",
    saveAmount: "Save Rs. 6,360",
    onSale: true
  },
  {
    id: 26,
    name: "WD Black SN850X 2TB NVMe SSD",
    category: "Accessories",
    price: "Rs. 45,999",
    image: "https://m.media-amazon.com/images/I/61KeSQhDm4L._AC_SL1500_.jpg",
    rating: 5,
    description: "Next-gen NVMe SSD with PCIe Gen4 technology",
    discount: "7% OFF",
    saveAmount: "Save Rs. 3,220",
    onSale: true
  },
  {
    id: 27,
    name: "Dell S2721DGF 27\" Gaming Monitor",
    category: "Accessories",
    price: "Rs. 42,999",
    image: "https://m.media-amazon.com/images/I/71gtGNw6ZlS._AC_SL1500_.jpg",
    rating: 4,
    description: "165Hz 1ms GTG IPS Gaming Monitor with G-Sync",
    discount: "15% OFF",
    saveAmount: "Save Rs. 12,450",
    onSale: true
  },
  {
    id: 28,
    name: "Bose QuietComfort Earbuds II",
    category: "Accessories",
    price: "Rs. 38,999",
    image: "https://m.media-amazon.com/images/I/51qRS8hb-9L._AC_SL1129_.jpg",
    rating: 5,
    description: "True wireless earbuds with noise cancelling",
    discount: "10% OFF",
    saveAmount: "Save Rs. 3,900",
    onSale: true
  },
  {
    id: 29,
    name: "Shure SM7B Microphone",
    category: "Accessories",
    price: "Rs. 42,999",
    image: "https://m.media-amazon.com/images/I/71LYHO3+wnL._AC_SL1356_.jpg",
    rating: 5,
    description: "Professional dynamic microphone for broadcasting",
    discount: "",
    saveAmount: "",
    onSale: false
  },
  {
    id: 30,
    name: "Logitech G915 TKL Keyboard",
    category: "Accessories",
    price: "Rs. 35,999",
    image: "https://m.media-amazon.com/images/I/61aezyfO5cL._AC_SL1500_.jpg",
    rating: 4,
    description: "Wireless mechanical gaming keyboard with low-profile switches",
    discount: "8% OFF",
    saveAmount: "Save Rs. 2,880",
    onSale: true
  },
  {
    id: 31,
    name: "Crucial P5 Plus 2TB NVMe SSD",
    category: "Accessories",
    price: "Rs. 38,999",
    image: "https://m.media-amazon.com/images/I/41vS+6h89ML._AC_SL1073_.jpg",
    rating: 4,
    description: "PCIe Gen4 NVMe SSD with high performance",
    discount: "5% OFF",
    saveAmount: "Save Rs. 1,950",
    onSale: true
  },
  {
    id: 32,
    name: "ASUS ROG Swift PG279QM Monitor",
    category: "Accessories",
    price: "Rs. 49,999",
    image: "https://m.media-amazon.com/images/I/81SmgyBTqPL._AC_SL1500_.jpg",
    rating: 5,
    description: "27\" 4K 165Hz HDR Gaming Monitor with G-Sync Ultimate",
    discount: "12% OFF",
    saveAmount: "Save Rs. 15,600",
    onSale: true
  }
];

// State
const selectedCategories = ref<string[]>([]);
const priceRange = ref({ min: 0, max: 1000000 });
const sortBy = ref('newest');
const currentPage = ref(1);
const wishlist = ref<number[]>([]);
const itemsPerPage = 9;
const cart = ref<any[]>([]);
const showCartNotification = ref(false);
const cartNotificationMessage = ref('');

// Computed
const filteredProducts = computed(() => {
  let result = [...products];

  // Apply category filter
  if (selectedCategories.value.length > 0) {
    result = result.filter(product =>
      selectedCategories.value.includes(product.category.toLowerCase())
    );
  }

  // Apply price filter
  result = result.filter(product => {
    const price = parseInt(product.price.replace(/[^0-9]/g, ''));
    return price >= priceRange.value.min && price <= priceRange.value.max;
  });

  // Apply sorting
  switch (sortBy.value) {
    case 'price-low':
      result.sort((a, b) => 
        parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, ''))
      );
      break;
    case 'price-high':
      result.sort((a, b) => 
        parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''))
      );
      break;
    case 'name':
      result.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      // 'newest' is default
      break;
  }

  return result;
});

const totalPages = computed(() => 
  Math.ceil(filteredProducts.value.length / itemsPerPage)
);

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredProducts.value.slice(start, end);
});

// Methods
const resetFilters = () => {
  selectedCategories.value = [];
  priceRange.value = { min: 0, max: 1000000 };
  sortBy.value = 'newest';
  currentPage.value = 1;
};

const toggleWishlist = (productId: number) => {
  const index = wishlist.value.indexOf(productId);
  if (index === -1) {
    wishlist.value.push(productId);
  } else {
    wishlist.value.splice(index, 1);
  }
};

const isInWishlist = (productId: number) => wishlist.value.includes(productId);

const addToCart = (product: any) => {
  // Check if product is already in cart
  const existingProduct = cart.value.find(item => item.id === product.id);
  
  if (existingProduct) {
    // Increase quantity if already in cart
    existingProduct.quantity += 1;
    cartNotificationMessage.value = `Increased ${product.name} quantity in cart`;
  } else {
    // Add new product to cart
    cart.value.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
    cartNotificationMessage.value = `Added ${product.name} to cart`;
  }
  
  // Show notification
  showCartNotification.value = true;
  
  // Hide notification after 3 seconds
  setTimeout(() => {
    showCartNotification.value = false;
  }, 3000);
  
  // Save cart to localStorage
  localStorage.setItem('techloot-cart', JSON.stringify(cart.value));
  
  console.log('Cart updated:', cart.value);
};
</script>
