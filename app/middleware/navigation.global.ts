import type { RouteLocationNormalized } from 'vue-router';
import { useNavigationStore } from '~/stores/useNavigationStore'

export default defineNuxtRouteMiddleware((to, from) => {
    addToHistory(to)
})

function addToHistory(to: RouteLocationNormalized) {
  const store = useNavigationStore();
  store.addPath(to.fullPath)
}
