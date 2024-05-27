// middleware/auth.global.ts

import { defineNuxtRouteMiddleware, navigateTo } from '#imports'
import { useNavigationStore } from '~/stores/useNavigationStore'

export default defineNuxtRouteMiddleware((to, from) => {
    const store = useNavigationStore();

    store.addPath(to.fullPath)
  }
)

