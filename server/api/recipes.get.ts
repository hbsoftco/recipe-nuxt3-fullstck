import * as z from "valibot";

const recipeSchema = z.object({
  vegetarian: z.boolean(),
  vegan: z.boolean(),
  glutenFree: z.boolean(),
  dairyFree: z.boolean(),
  veryHealthy: z.boolean(),
  cheap: z.boolean(),
  veryPopular: z.boolean(),
  sustainable: z.boolean(),
  lowFodmap: z.boolean(),
  weightWatcherSmartPoints: z.number(),
  gaps: z.string(),
  preparationMinutes: z.nullable(z.number()),
  cookingMinutes: z.nullable(z.number()),
  aggregateLikes: z.number(),
  healthScore: z.number(),
  creditsText: z.string(),
  license: z.optional(z.string()),
  sourceName: z.string(),
  pricePerServing: z.number(),
  extendedIngredients: z.array(
    z.object({
      id: z.number(),
      aisle: z.nullable(z.string()),
      image: z.nullable(z.string()),
      consistency: z.string(),
      name: z.string(),
      nameClean: z.nullable(z.string()),
      original: z.string(),
      originalName: z.string(),
      amount: z.number(),
      unit: z.string(),
      meta: z.array(z.any()),
      measures: z.object({
        us: z.object({
          amount: z.number(),
          unitShort: z.string(),
          unitLong: z.string(),
        }),
        metric: z.object({
          amount: z.number(),
          unitShort: z.string(),
          unitLong: z.string(),
        }),
      }),
    })
  ),
  id: z.number(),
  title: z.string(),
  readyInMinutes: z.number(),
  servings: z.number(),
  sourceUrl: z.string(),
  image: z.optional(z.string()),
  imageType: z.optional(z.string()),
  summary: z.string(),
  cuisines: z.array(z.any()),
  dishTypes: z.array(z.string()),
  diets: z.array(z.string()),
  occasions: z.array(z.string()),
  instructions: z.string(),
  analyzedInstructions: z.array(
    z.object({
      name: z.string(),
      steps: z.array(
        z.object({
          number: z.number(),
          step: z.string(),
          ingredients: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              localizedName: z.string(),
              image: z.string(),
            })
          ),
          equipment: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              localizedName: z.string(),
              image: z.string(),
            })
          ),
          length: z.optional(
            z.object({
              number: z.number(),
              unit: z.string(),
            })
          ),
        })
      ),
    })
  ),
  originalId: z.optional(z.any()),
  spoonacularScore: z.number(),
  spoonacularSourceUrl: z.string(),
});

export default defineCachedEventHandler(
  async () => {
    console.log("making fresh recipes request");

    const { recipes } = await $fetch<{ recipes: unknown }>(
      "https://api.spoonacular.com/recipes/random",
      {
        query: {
          limitLicense: true,
          number: 100,
          apiKey: useRuntimeConfig().spoonacular.apiKey,
        },
      }
    );

    try {
      return z.parse(z.array(recipeSchema), recipes);
    } catch (error: any) {
      console.log(error.issues.map((i: any) => i.path));
      return [];
    }
  },
  {
    base: "recipes",
    getKey: () => "recipes",
    shouldBypassCache: () => false,
    maxAge: 1000 * 60 * 60 * 24,
    staleMaxAge: 1000 * 60 * 60 * 24 * 7,
  }
);
