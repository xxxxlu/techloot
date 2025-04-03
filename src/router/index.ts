import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('../views/Home.vue'),
    },
    {
      path: '/products',
      component: () => import('../views/Products.vue'),
    },
    {
      path: '/products/:id',
      component: () => import('../views/ProductDetail.vue'),
    },
    {
      path: '/cart',
      component: () => import('../views/Cart.vue'),
    },
    {
      path: '/checkout',
      component: () => import('../views/Checkout.vue'),
    },
    {
      path: '/loading',
      component: () => import('../views/LoadingPage.vue'),
    },
    {
      path: '/login',
      component: () => import('../views/Login.vue'),
    },
    {
      path: '/register',
      component: () => import('../views/Register.vue'),
    },
    {
      path: '/payment-success',
      name: 'PaymentSuccess',
      component: () => import('../views/PaymentSuccess.vue')
    }
  ],
});

export default router;
