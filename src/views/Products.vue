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
          <!-- <div class="mt-8 flex justify-center">
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
          </div> -->
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
  { id: 'electronics', name: 'electronics' },
  { id: 'footwear', name: 'footwear' },
  { id: 'clothing', name: 'clothing' },
  { id: 'accessories', name: 'accessories' },
  { id: 'Home Appliances', name: 'Home Appliances' },
  { id: 'beauty', name: 'beauty' }
];

// Products data
const products = [
  {
    "id": 1,
    "name": "Samsung Galaxy A15 5G Smartphone",
    "category": "Electronics",
    "price": "Rs. 39,999",
    "image": "https://m.media-amazon.com/images/I/51tgsXtoUkL._AC_UF894,1000_QL80_.jpg",
    "rating": 4.6,
    "description": "6.5\" 90Hz display, 8GB RAM, 256GB storage, triple camera setup",
    "discount": "15% OFF",
    "saveAmount": "Save Rs. 7,000",
    "onSale": true
  },
  {
    "id": 2,
    "name": "Adidas Ultraboost Light Running Shoes",
    "category": "Footwear",
    "price": "Rs. 12,999",
    "image": "http://runnerz.pk/cdn/shop/files/IMG_7825-min_2_141a35cd-6ec6-48bd-b0fd-52c311538460.jpg?v=1708686221",
    "rating": 4.8,
    "description": "Lightweight running shoes with responsive cushioning and breathable mesh upper",
    "discount": "20% OFF",
    "saveAmount": "Save Rs. 3,200",
    "onSale": true
  },
  {
    "id": 3,
    "name": "Vivo S17 Pro Smartphone",
    "category": "Electronics",
    "price": "Rs. 44,999",
    "image": "https://media.licdn.com/dms/image/v2/D5612AQFsLtEDncSkOg/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1721296358443?e=2147483647&v=beta&t=aNx8kzunZWZBKK55JnNgBkbmRehSVylL1Bhi9Mz4aCM",
    "rating": 4.7,
    "description": "50MP camera, AMOLED display, 8GB RAM, 128GB storage, fast charging",
    "discount": "12% OFF",
    "saveAmount": "Save Rs. 6,000",
    "onSale": true
  },
  {
    "id": 4,
    "name": "Nike Revolution 6 Running Shoes",
    "category": "Footwear",
    "price": "Rs. 8,499",
    "image": "https://www.hopkicks.pk/image/cache/catalog/2024/OCT%2024/ISHOES/P3/42/10-500x500.jpg",
    "rating": 4.5,
    "description": "Lightweight mesh upper with soft foam midsole for responsive cushioning",
    "discount": "25% OFF",
    "saveAmount": "Save Rs. 2,800",
    "onSale": true
  },
  {
    "id": 5,
    "name": "OnePlus 12R Smartphone",
    "category": "Electronics",
    "price": "Rs. 49,999",
    "image": "https://miro.medium.com/v2/resize:fit:484/0*39zSSS66Eq1puVu1.jpg",
    "rating": 4.9,
    "description": "Snapdragon 8 Gen 2, 8GB RAM, 128GB storage, 50MP camera, 100W fast charging",
    "discount": "10% OFF",
    "saveAmount": "Save Rs. 5,500",
    "onSale": true
  },
  {
    "id": 6,
    "name": "Adidas Gazelle Casual Sneakers",
    "category": "Footwear",
    "price": "Rs. 9,999",
    "image": "https://footwearnews.com/wp-content/uploads/2024/04/adidas-spezial-sneakers-spring-2024-collection-001.jpg?w=1800&h=1042&crop=1",
    "rating": 4.7,
    "description": "Iconic suede upper with contrasting 3-stripes and rubber outsole",
    "discount": "18% OFF",
    "saveAmount": "Save Rs. 2,200",
    "onSale": true
  },
  {
    "id": 7,
    "name": "Xiaomi Redmi Note 13 Pro",
    "category": "Electronics",
    "price": "Rs. 34,999",
    "image": "https://i.ytimg.com/vi/Gdz1mz0PAag/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDmvuDzHMx0wfdAKe8DZDrYjYx0Yg",
    "rating": 4.5,
    "description": "108MP camera, 6.67\" AMOLED display, 8GB RAM, 5000mAh battery",
    "discount": "15% OFF",
    "saveAmount": "Save Rs. 6,200",
    "onSale": true
  },
  {
    "id": 8,
    "name": "Povo 5G Smartphone 8GB+256GB",
    "category": "Electronics",
    "price": "Rs. 29,999",
    "image": "https://s.alicdn.com/@sc04/kf/Hdb0ec9a640124b06a6f88dbe5f2fb847t.jpg_720x720q50.jpg",
    "rating": 4.3,
    "description": "5G connectivity, 8GB RAM, 256GB storage, dual camera system with night mode",
    "discount": "20% OFF",
    "saveAmount": "Save Rs. 7,500",
    "onSale": true
  },
  {
    "id": 9,
    "name": "Adidas Sport Running Shoes",
    "category": "Footwear",
    "price": "Rs. 7,999",
    "image": "https://runnerz.pk/cdn/shop/files/IMG_5802copy_6619756c-1d7f-4594-8903-ddc0aaeabe30.jpg?v=1725470918",
    "rating": 4.4,
    "description": "Lightweight mesh construction with cushioned midsole for all-day comfort",
    "discount": "30% OFF",
    "saveAmount": "Save Rs. 3,400",
    "onSale": true
  },
  {
    "id": 10,
    "name": "Nokia 235 Feature Phone (2024)",
    "category": "Electronics",
    "price": "Rs. 4,999",
    "image": "https://i.ebayimg.com/images/g/C50AAOSw9vdmXslQ/s-l1200.jpg",
    "rating": 4.2,
    "description": "Dual SIM, 2MP camera with LED flash, AI assistant, long battery life",
    "discount": "10% OFF",
    "saveAmount": "Save Rs. 550",
    "onSale": true
  },
  {
    "id": 11,
    "name": "Adidas 22YDS Cricket Shoes",
    "category": "Footwear",
    "price": "Rs. 14,999",
    "image": "https://www.allroundercricket.com/us/media/catalog/product/cache/16882fc9de905805ba934b71051d18ad/2/2/22yds_boost.png",
    "rating": 4.8,
    "description": "Professional cricket shoes with BOA fit system and responsive cushioning",
    "discount": "15% OFF",
    "saveAmount": "Save Rs. 2,650",
    "onSale": true
  },
  {
    "id": 12,
    "name": "Traditional Pakistani Embroidered Dress",
    "category": "Clothing",
    "price": "Rs. 6,500",
    "image": "https://rangreza.net/cdn/shop/files/Pakistani_Eid_Dresses_Rangreza.jpg?v=1741542924&width=2400",
    "rating": 4.7,
    "description": "Elegant embroidered 3-piece suit with premium fabric and intricate details",
    "discount": "25% OFF",
    "saveAmount": "Save Rs. 2,150",
    "onSale": true
  },
  {
    "id": 13,
    "name": "Adidas Hockey LUX 2.2 Shoes",
    "category": "Footwear",
    "price": "Rs. 11,999",
    "image": "https://www.total-hockey.com/cdn/shop/files/IH0640.png?v=1719579500&width=1080",
    "rating": 4.6,
    "description": "Professional hockey shoes with enhanced grip and lightweight construction",
    "discount": "20% OFF",
    "saveAmount": "Save Rs. 3,000",
    "onSale": true
  },
  {
    "id": 14,
    "name": "Apple AirPods Pro (2nd Generation)",
    "category": "Electronics",
    "price": "Rs. 43,999",
    "image": "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361",
    "rating": 4.9,
    "description": "Active noise cancellation, spatial audio, adaptive EQ, water resistant",
    "discount": "8% OFF",
    "saveAmount": "Save Rs. 3,800",
    "onSale": true
  },
  {
    "id": 15,
    "name": "Luxury Men's Formal Wristwatch",
    "category": "Accessories",
    "price": "Rs. 15,999",
    "image": "https://cdn5.vectorstock.com/i/1000x1000/73/46/luxury-watch-isolated-on-white-background-vector-21377346.jpg",
    "rating": 4.7,
    "description": "Stainless steel chronograph watch with genuine leather strap and water resistance",
    "discount": "35% OFF",
    "saveAmount": "Save Rs. 8,500",
    "onSale": true
  },
  {
    "id": 16,
    "name": "Women's Designer Handbag",
    "category": "Accessories",
    "price": "Rs. 7,999",
    "image": "https://m.media-amazon.com/images/I/71czu7WgGuL._AC_UY1000_.jpg",
    "rating": 4.5,
    "description": "Premium synthetic leather with elegant design, multiple compartments and adjustable straps",
    "discount": "40% OFF",
    "saveAmount": "Save Rs. 5,300",
    "onSale": true
  },
  {
    "id": 17,
    "name": "Men's Premium Business Suit",
    "category": "Clothing",
    "price": "Rs. 18,500",
    "image": "https://m.media-amazon.com/images/I/71w+Fi+ycaL._AC_SX679_.jpg",
    "rating": 4.8,
    "description": "Tailored two-piece business suit in classic navy blue with premium wool blend fabric",
    "discount": "30% OFF",
    "saveAmount": "Save Rs. 7,900",
    "onSale": true
  },
  {
    "id": 18,
    "name": "Xiaomi Robot Vacuum Cleaner",
    "category": "Home Appliances",
    "price": "Rs. 29,999",
    "image": "https://m.media-amazon.com/images/I/41Wl9s9iTqL._AC_SL1500_.jpg",
    "rating": 4.6,
    "description": "Smart robot vacuum with mapping technology, app control and multiple cleaning modes",
    "discount": "15% OFF",
    "saveAmount": "Save Rs. 5,300",
    "onSale": true
  },
  {
    "id": 19,
    "name": "Women's Casual Running Shoes",
    "category": "Footwear",
    "price": "Rs. 5,499",
    "image": "https://jordenduck.com/wp-content/uploads/2024/11/WhatsApp-Image-2024-11-11-at-17.50.13_8a7dd27c-450x600.jpg.webp",
    "rating": 4.3,
    "description": "Breathable mesh upper with cushioned sole for daily walking and running",
    "discount": "25% OFF",
    "saveAmount": "Save Rs. 1,800",
    "onSale": true
  },
  {
    "id": 20,
    "name": "Digital Drawing Tablet",
    "category": "Electronics",
    "price": "Rs. 14,999",
    "image": "https://m.media-amazon.com/images/I/61Dw5Z8LzJL._AC_UF1000,1000_QL80_.jpg",
    "rating": 4.5,
    "description": "Professional drawing tablet with 8192 levels of pressure sensitivity and wireless connectivity",
    "discount": "20% OFF",
    "saveAmount": "Save Rs. 3,750",
    "onSale": true
  },
  {
    "id": 21,
    "name": "Smart LED TV 43-inch",
    "category": "Electronics",
    "price": "Rs. 48,999",
    "image": "https://m.media-amazon.com/images/I/81V8cp87XGL._AC_SL1500_.jpg",
    "rating": 4.7,
    "description": "4K Ultra HD resolution, smart features with built-in streaming apps and voice control",
    "discount": "18% OFF",
    "saveAmount": "Save Rs. 10,700",
    "onSale": true
  },
  {
    "id": 22,
    "name": "Women's Designer Sunglasses",
    "category": "Accessories",
    "price": "Rs. 3,999",
    "image": "https://m.media-amazon.com/images/I/51b88vNJRSL._AC_SX679_.jpg",
    "rating": 4.4,
    "description": "UV400 protection with polarized lenses and lightweight designer frame",
    "discount": "30% OFF",
    "saveAmount": "Save Rs. 1,700",
    "onSale": true
  },
  {
    "id": 23,
    "name": "Premium Leather Wallet for Men",
    "category": "Accessories",
    "price": "Rs. 2,499",
    "image": "https://m.media-amazon.com/images/I/810gCeQqmWL._AC_SL1500_.jpg",
    "rating": 4.5,
    "description": "Genuine leather wallet with multiple card slots and RFID blocking technology",
    "discount": "35% OFF",
    "saveAmount": "Save Rs. 1,350",
    "onSale": true
  },
  {
    "id": 24,
    "name": "Professional Hair Dryer",
    "category": "Beauty & Personal Care",
    "price": "Rs. 5,499",
    "image": "https://m.media-amazon.com/images/I/81T0Th9mUwL._AC_SL1500_.jpg",
    "rating": 4.6,
    "description": "Salon-grade hair dryer with multiple heat settings and ionic technology",
    "discount": "25% OFF",
    "saveAmount": "Save Rs. 1,830",
    "onSale": true
  },
  {
    "id": 25,
    "name": "Smart Fitness Tracker Watch",
    "category": "Electronics",
    "price": "Rs. 8,999",
    "image": "https://m.media-amazon.com/images/I/61k4v-fNKaL._AC_SL1500_.jpg",
    "rating": 4.7,
    "description": "Waterproof fitness tracker with heart rate monitor, sleep tracking and smartphone notifications",
    "discount": "20% OFF",
    "saveAmount": "Save Rs. 2,250",
    "onSale": true
  },
  {
    "id": 26,
    "name": "Premium Bluetooth Speaker",
    "category": "Electronics",
    "price": "Rs. 6,999",
    "image": "https://m.media-amazon.com/images/I/71JB6hM6Z6L._AC_UF1000,1000_QL80_.jpg",
    "rating": 4.5,
    "description": "Portable wireless speaker with 20W output, 12-hour battery life and water resistance",
    "discount": "30% OFF",
    "saveAmount": "Save Rs. 3,000",
    "onSale": true
  },
  {
    "id": 27,
    "name": "Professional DSLR Camera",
    "category": "Electronics",
    "price": "Rs. 49,999",
    "image": "https://m.media-amazon.com/images/I/81WeehnfXrL._AC_SL1500_.jpg",
    "rating": 4.9,
    "description": "24.1MP sensor, 4K video recording, vari-angle touchscreen and built-in Wi-Fi",
    "discount": "10% OFF",
    "saveAmount": "Save Rs. 5,500",
    "onSale": true
  },
  {
    "id": 28,
    "name": "Designer Backpack",
    "category": "Accessories",
    "price": "Rs. 4,999",
    "image": "https://m.media-amazon.com/images/I/91PF4HmzZML._AC_SL1500_.jpg",
    "rating": 4.6,
    "description": "Water-resistant laptop backpack with anti-theft features and multiple compartments",
    "discount": "25% OFF",
    "saveAmount": "Save Rs. 1,670",
    "onSale": true
  },
  {
    "id": 29,
    "name": "Premium Perfume for Women",
    "category": "Beauty & Personal Care",
    "price": "Rs. 7,499",
    "image": "https://m.media-amazon.com/images/I/61ICNVUDIQL._SL1500_.jpg",
    "rating": 4.7,
    "description": "Long-lasting floral fragrance with notes of jasmine, rose, and sandalwood",
    "discount": "35% OFF",
    "saveAmount": "Save Rs. 4,050",
    "onSale": true
  },
  {
    "id": 30,
    "name": "Noise Cancelling Headphones",
    "category": "Electronics",
    "price": "Rs. 12,999",
    "image": "https://m.media-amazon.com/images/I/51JbsHSktkL._AC_UF894,1000_QL80_.jpg",
    "rating": 4.8,
    "description": "Wireless over-ear headphones with active noise cancellation and 30-hour battery life",
    "discount": "22% OFF",
    "saveAmount": "Save Rs. 3,700",
    "onSale": true
  }
]

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
