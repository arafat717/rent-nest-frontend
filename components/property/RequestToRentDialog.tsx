/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateRentalRequestMutation } from "@/redux/api/rentalApi";

interface RequestToRentDialogProps {
  propertyId: string;
  disabled?: boolean;
}

export function RequestToRentDialog({
  propertyId,
  disabled,
}: RequestToRentDialogProps) {
  const [open, setOpen] = useState(false);
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [message, setMessage] = useState("");

  const [createRentalRequest, { isLoading: isSubmitting }] =
    useCreateRentalRequestMutation();

  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }
    if (!moveOutDate) {
      toast.error("Please select a move-out date");
      return;
    }
    if (new Date(moveOutDate) <= new Date(moveInDate)) {
      toast.error("Move-out date must be after the move-in date");
      return;
    }

    const toastId = toast.loading("Submitting your request...");

    try {
      await createRentalRequest({
        propertyId,
        moveInDate: new Date(moveInDate).toISOString(),
        moveOutDate: new Date(moveOutDate).toISOString(),
        message: message || undefined,
      }).unwrap();

      toast.success("Request submitted! The landlord will review it shortly.", {
        id: toastId,
      });
      setOpen(false);
      setMoveInDate("");
      setMoveOutDate("");
      setMessage("");
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Failed to submit request. Please try again.",
        { id: toastId },
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" disabled={disabled}>
          {disabled ? "Not Available" : "Request to Rent"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to Rent</DialogTitle>
          <DialogDescription>
            Send a request to the landlord. They&apos;ll review and respond
            soon.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="moveInDate">Move-in Date</Label>
              <Input
                id="moveInDate"
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                min={today}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moveOutDate">Move-out Date</Label>
              <Input
                id="moveOutDate"
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                min={moveInDate || today}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself or ask a question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
