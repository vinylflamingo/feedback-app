// stores/useNavigationStore.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNavigationStore = defineStore('navigation', () => {
  const paths = ref<string[]>([]);

  function addPath(path: string) {
    paths.value.push(path);
  }

  function removeLastPath() {
    paths.value.pop();
  }

  function getPreviousPath(): string | null {
    return paths.value.length > 1 ? paths.value[paths.value.length - 2] : null;
  }

  return {
    paths,
    addPath,
    removeLastPath,
    getPreviousPath
  };
});
