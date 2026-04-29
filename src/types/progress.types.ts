import { Progress, ProgressPhoto, Member } from "@prisma/client";

export interface ProgressWithPhotos extends Progress {
  photos?: ProgressPhoto[];
}