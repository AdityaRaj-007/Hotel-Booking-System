import z from "zod";

export const AddReviewSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    rating: z.int(),
    comment: z.string(),
  }),
});
