<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16 items-center">
          <router-link to="/" class="flex items-center">
            <span class="text-2xl font-bold text-green-600">TechLoot</span>
          </router-link>
          <div class="flex space-x-6">
            <router-link to="/products" class="flex items-center text-gray-700 hover:text-green-600">
              <ShoppingBagIcon class="w-5 h-5 mr-1" />
              <span>Products</span>
            </router-link>
            <router-link to="/cart" class="flex items-center text-gray-700 hover:text-green-600">
              <ShoppingCartIcon class="w-5 h-5 mr-1" />
              <span>Cart</span>
            </router-link>
            <router-link to="/login" class="flex items-center text-gray-700 hover:text-green-600">
              <UserIcon class="w-5 h-5 mr-1" />
              <span>Login</span>
            </router-link>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="bg-white mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <p class="text-center text-gray-500">
          Copyright 2025 | Powered by Data Network Solutions
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBagIcon, ShoppingCartIcon, UserIcon } from '@heroicons/vue/24/outline';
// Component logic here
</script>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;
</style>
