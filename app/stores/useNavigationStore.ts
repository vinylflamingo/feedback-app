// stores/useNavigationStore.ts
import { defineStore } from 'pinia';

export const useNavigationStore = defineStore('navigation', {
  state: () => ({
    paths: [] as string[]
  }),
  actions: {
    addPath(path: string) {
      this.paths.push(path);
    },
    removeLastPath() {
      this.paths.pop();
    },
    getPreviousPath(): string | null {
      return this.paths.length > 1 ? this.paths[this.paths.length - 2] : null;
    }
  }
});
