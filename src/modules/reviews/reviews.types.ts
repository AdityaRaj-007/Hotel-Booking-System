import { Role } from "../../generated/prisma/enums";

export type AddReview = {
  user: {
    email: string;
    role: Role;
  };
  payload: {
    bookingId: string;
    rating: number;
    comment: string;
  };
};
