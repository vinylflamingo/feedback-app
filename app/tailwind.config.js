/** @type {import('tailwindcss').Config} */
export default {
  mode: 'jit',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.{js,vue,ts}",
    "./pages/**/*.{js,vue,ts}",
  ],
  theme: {
    colors: {
      purple: {
        DEFAULT: '#AD1FEA',
        light: "#C75AF6"
      },
      blue: {
        DEFAULT: '#4661E6',
        light: '#7C91F9'
      },
      darkBlue: {
        DEFAULT: '#373F68',
      },
      white: {
        DEFAULT: '#FFFFFF',
      },
      lightBlue: {
        DEFAULT: '#F2F4FF',
      },
      veryLightBlue: {
        DEFAULT: '#F7F8FD',
      },
      darkerBlue: {
        DEFAULT: '#3A4374',
        light: "#656EA3"
      },
      greyBlue: {
        DEFAULT: '#647196',
      },
      orange: {
        DEFAULT: '#F49F85',
      },
      red: {
        DEFAULT: '#D73737',
        light: '#E98888'
      },
      cyan: {
        DEFAULT: '#62BCFA',
      },
    },
    screens: {
      'xs': {'max': '360px'},
    },
    fontFamily: {
      jost: ['Jost', 'sans-serif'],
    },
    fontSize: {
      h1: ['24px', { lineHeight: '35px', letterSpacing: '-0.33px' }],
      h2: ['20px', { lineHeight: '29px', letterSpacing: '-0.25px' }],
      h3: ['18px', { lineHeight: '26px', letterSpacing: '-0.25px' }],
      h4: ['14px', { lineHeight: '20px', letterSpacing: '-0.2px' }],
      body1: ['16px', { lineHeight: '23px' }],
      body2: ['15px', { lineHeight: '22px' }],
      body3: ['13px', { lineHeight: '19px' }],
    },
    fontWeight: {
      bold: 700,
      semibold: 600,
      regular: 400,
    },
  },
  plugins: [],
}

