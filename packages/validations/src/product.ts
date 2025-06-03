import { z } from "zod";

export const RentPeriodSchema = z.enum([
  "HOURLY",
  "DAILY",
  "WEEKLY",
  "MONTHLY",
]);
export type RentPeriod = z.infer<typeof RentPeriodSchema>;

export const CategorySchema = z.enum([
  "ELECTRONICS",
  "FURNITURE",
  "HOME_APPLIANCES",
  "SPORTING_GOODS",
  "OUTDOOR",
  "TOYS",
]);
export type Category = z.infer<typeof CategorySchema>;

export const NameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters");
export const PhoneSchema = z
  .string()
  .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number");
export const PositiveNumberSchema = z
  .number()
  .positive("Must be a positive number");

export const ProductTitleStepSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title too long"),
});

export const ProductCategoriesStepSchema = z.object({
  categories: z.array(CategorySchema).nonempty("Select at least one category"),
});

export const ProductDescriptionStepSchema = z.object({
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000, "Description too long"),
});

export const ProductPricingStepSchema = z.object({
  price: PositiveNumberSchema,
  rentPrice: PositiveNumberSchema,
  rentPeriod: RentPeriodSchema,
});

export const ProductSummaryStepSchema = z
  .object({})
  .merge(ProductTitleStepSchema)
  .merge(ProductCategoriesStepSchema)
  .merge(ProductDescriptionStepSchema)
  .merge(ProductPricingStepSchema);

// Complete product validation
export const ProductSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(1000),
  price: PositiveNumberSchema,
  rentPrice: PositiveNumberSchema,
  rentPeriod: RentPeriodSchema,
  categories: z.array(CategorySchema).min(1),
});

export const ProductFormSessionSchema = z.object({
  currentStep: z.number().int().min(1).max(5),
  totalSteps: z.literal(5),
  formData: z
    .object({
      title: z.string().min(5).max(100),
      categories: z.array(CategorySchema),
      description: z.string().min(20).max(1000),
      price: PositiveNumberSchema,
      rentPrice: PositiveNumberSchema,
      rentPeriod: RentPeriodSchema,
    })
    .partial(), // All fields optional during intermediate steps
});

export const ProductResponseSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  rentPrice: z.number(),
  rentPeriod: RentPeriodSchema,
  categories: z.array(CategorySchema),
  user: z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// for exports

export const validateProductStep = (step: number, data: unknown) => {
  switch (step) {
    case 1:
      return ProductTitleStepSchema.parse(data);
    case 2:
      return ProductCategoriesStepSchema.parse(data);
    case 3:
      return ProductDescriptionStepSchema.parse(data);
    case 4:
      return ProductPricingStepSchema.parse(data);
    case 5:
      return ProductSummaryStepSchema.parse(data);
    default:
      throw new Error("Invalid step number");
  }
};

export const validateCompleteProduct = (data: unknown) => {
  return ProductSchema.parse(data);
};

export const validateProductFormSession = (data: unknown) => {
  return ProductFormSessionSchema.parse(data);
};

export const validateProductResponse = (data: unknown) => {
  return ProductResponseSchema.parse(data);
};

export type ProductInput = z.infer<typeof ProductSchema>;
export type ProductFormSession = z.infer<typeof ProductFormSessionSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
