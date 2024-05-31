<template>
  <nav role="navigation">
    <div id="menuToggle">
      <input type="checkbox" v-model="localOpenState" @change="updateOpenState" />
      <span></span>
      <span></span>
      <span></span>
      <ul id="menu"></ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface MobileMenuButtonProps {
  openState: boolean;
}

const props = defineProps<MobileMenuButtonProps>();
const emit = defineEmits(['update-open-state']);
const localOpenState = ref(props.openState);

watch(() => props.openState, (newVal) => {
  localOpenState.value = newVal;
});

const updateOpenState = () => {
  emit('update-open-state', localOpenState.value);
};
</script>
  
  <style scoped>
  #menuToggle {
    display: block;
    position: relative;
    width: 20px;
    height: 17px;
    z-index: 1;
    -webkit-user-select: none;
    user-select: none;
  }
  
  #menuToggle input {
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    opacity: 0;
    z-index: 2;
    -webkit-touch-callout: none;
  }
  
  #menuToggle span {
    display: block;
    width: 20px;
    height: 3px;
    margin-bottom: 3px;
    background: white;
    z-index: 1;
    transform-origin: 1px 0px;
    transition: transform 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0), background 0.5s cubic-bezier(0.77, 0.2, 0.05, 1.0), opacity 0.55s ease;
  }
  
  #menuToggle span:first-child {
    transform-origin: 0% 0%;
  }
  
  #menuToggle span:nth-last-child(2) {
    transform-origin: 0% 100%;
  }
  
  #menuToggle input:checked ~ span {
    opacity: 1;
    transform: rotate(45deg) translate(0, -1px);
    background: white;
  }
  
  #menuToggle input:checked ~ span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(0deg) scale(0.2, 0.2);
  }
  
  #menuToggle input:checked ~ span:nth-last-child(2) {
    transform: rotate(-45deg) translate(1px,1px);
  }
  
  #menu {
    display: none; /* No menu needed */
  }
  </style>
  