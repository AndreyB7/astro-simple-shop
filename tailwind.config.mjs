/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}" ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#161925",
        primary: "#0088E6",
        secondary: "rgba(0,136,230,0.7)",
      },
    },
    typography: (theme) => ( {
      DEFAULT: {
        css: {
          'p': {
            fontSize: theme('fontSize.lg'),
            lineHeight: theme('lineHeight.relaxed'),
            marginBottom: theme('spacing.4'),
          },
        },
      },
    } ),
    plugins: [ require("tailwind-scrollbar") ],
  },
};
