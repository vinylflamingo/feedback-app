<template>
  <div id="layout-container" class="min-h-screen font-jost bg-veryLightBlue flex flex-col items-center w-screen justify-between relative antialiased max-w-full overflow-y-hidden">
    <div class="background-svg-container">
      <svg width="2000" height="2000" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="background-svg spin">
        <rect width="48" height="48" rx="24" fill="url(#paint0_radial_0_2509)"/>
        <defs>
          <radialGradient id="paint0_radial_0_2509" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(49.872 -4.98555) rotate(129.411) scale(80.0716)">
            <stop stop-color="#28A7ED"/>
            <stop offset="0.5" stop-color="#A337F6"/>
            <stop offset="0.4" stop-color="#28A7ED"/>
          </radialGradient>
        </defs>
      </svg>
    </div>
    <div>
      <slot />
    </div>
    <footer class="pb-2 flex flex-col items-center justify-center text-center mt-4">
      <small class="small font-regular text-greyBlue text-[10px] leading-none">made by frank costoya. frankcostoya.com </small>
      <small class="small font-regular text-greyBlue text-[10px] leading-nones" >template from frontendmentor.io </small>
      <small class="small font-regular text-greyBlue text-[10px] leading-none">built with postgres, fastapi, and nuxt 3</small>
    </footer>
  </div>
</template>

<style>
body::-webkit-scrollbar {
  display: none; /* Chrome */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

#layout-container {
  position: relative;
  z-index: 5;
}

.background-svg-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -5;
}

.background-svg {
  position: absolute;
  transform: translateX(-50%);
  opacity: 6%;
  filter: blur(200px);
  z-index: -5; /* Ensure it's behind other content */
}



.spin {
  animation: spin 6s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
