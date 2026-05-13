-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CUSTOMER', 'OWNER');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('CONFIRMED', 'CANCELLED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "phone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" VARCHAR(255) NOT NULL,
    "owner_id" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "amenities" JSONB NOT NULL DEFAULT '[]',
    "rating" DECIMAL(2,1) NOT NULL DEFAULT 0.0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rooms" (
    "id" VARCHAR(255) NOT NULL,
    "hotel_id" VARCHAR(255) NOT NULL,
    "room_number" VARCHAR(255) NOT NULL,
    "room_type" VARCHAR(255) NOT NULL,
    "price_per_night" DECIMAL(10,2) NOT NULL,
    "max_occupancy" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,
    "room_id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "check_in_date" TIMESTAMP(3) NOT NULL,
    "check_out_date" TIMESTAMP(3) NOT NULL,
    "guests" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "booking_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "curent_at" TIMESTAMP(3),

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" VARCHAR(255) NOT NULL,
    "user_id" TEXT NOT NULL,
    "hotel_id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "rooms_hotel_id_room_number_key" ON "rooms"("hotel_id", "room_number");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_booking_id_key" ON "reviews"("user_id", "booking_id");

-- AddForeignKey
ALTER TABLE "hotels" ADD CONSTRAINT "hotels_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_hotel_id_fkey" FOREIGN KEY ("hotel_id") REFERENCES "hotels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
