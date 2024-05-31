<template>
  <div>
    <label :for="props.fieldName">{{ props.labelText }}</label>
    <div v-if="props.description">
      <small>{{ props.description }}</small>
    </div>
    <client-only>
      <select
        :name="props.fieldName"
        :id="props.fieldName"
        v-model="selected"
      >
        <option v-for="item in props.options" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </client-only>
    <div v-if="validationMessage" class="">
      {{ validationMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';

interface DropdownFieldElementProps {
  fieldName: string;
  labelText: string;
  description?: string | null;
  options: string[];
  defaultValue?: string | null;
}

const props = defineProps<DropdownFieldElementProps>();
const selected = ref('');
const validationMessage = ref<string>('');

// Initialize selected value on mounted
onMounted(() => {
  selected.value = props.defaultValue || '';
});

const validateSelection = (selectedValue: string) => {
  if (!props.options.includes(selectedValue)) {
    validationMessage.value = 'Invalid selection.';
  } else {
    validationMessage.value = '';
  }
};

watch(selected, (newValue) => {
  validateSelection(newValue);
}, { immediate: true });
</script>
