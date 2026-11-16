"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { createBooking } from "@/lib/action/booking";
import { TCommonApiResponse, TService, TUser } from "@/types";
import React from "react";

const PayNowButton = ({
  service,
  user,
}: {
  service: TService;
  user: TUser | null;
}) => {
  const handleCreateBooking = async () => {
    // API call

    try {
      const res = (await createBooking({
        serviceId: service._id,
        userEmail: user?.email || "",
      })) as TCommonApiResponse<{ redirectUrl: string }>;

      if (res.success) {
        // Redirect to the checkout page
        console.log(res, "res");
        window.location.href = res.data.redirectUrl;
      }
    } catch (e: any) {
      console.error("Error creating booking:", e);

      toast.add({
        title: e.message || "Booking failed",
        description:
          "Something went wrong while creating the booking. Please try again.",
      });
    }
  };
  return (
    <Button
      onClick={handleCreateBooking}
      className="mt-4 w-full bg-[#15295e] text-white hover:bg-[#1e3a80]"
    >
      Pay Now
    </Button>
  );
};

export default PayNowButton;
