// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  devServer: {
    port: 3005,
  },
  runtimeConfig: {
    spoonacular: {
      apiKey: process.env.NUXT_SPOONACULAR_API_KEY,
    },
  },
  $development: {
    nitro: {
      storage: {
        recipes: {
          driver: "fs",
          base: "recipes",
        },
      },
    },
  },
});
