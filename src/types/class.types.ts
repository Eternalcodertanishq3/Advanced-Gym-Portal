import { GymClass, Trainer, ClassSchedule, ClassBooking, Member } from "@prisma/client";

export interface ClassWithTrainer extends GymClass {
  trainer: Trainer;
}

export interface ClassScheduleWithBookings extends ClassSchedule {
  class: GymClass;
  bookings: ClassBooking[];
}

export interface ClassBookingWithDetails extends ClassBooking {
  member: Member;
  schedule: ClassScheduleWithBookings;
}