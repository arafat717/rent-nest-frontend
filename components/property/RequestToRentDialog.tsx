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
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!moveInDate) {
      toast.error("Please select a move-in date");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Submitting your request...");

    try {
      // TODO: wire up to createRentalRequest mutation once the tenant auth flow is built
      // await createRentalRequest({ propertyId, moveInDate, message }).unwrap();
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Request submitted! The landlord will review it shortly.", {
        id: toastId,
      });
      setOpen(false);
      setMoveInDate("");
      setMessage("");
    } catch {
      toast.error("Failed to submit request. Please try again.", {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
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
          <div className="space-y-2">
            <Label htmlFor="moveInDate">Preferred Move-in Date</Label>
            <Input
              id="moveInDate"
              type="date"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message (optional)</Label>
            <textarea
              id="message"
              placeholder="Introduce yourself or ask a question..."
              value={message}
              onChange={(e:any) => setMessage(e.target.value)}
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
