import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useBookAppointment, useListAvailableSlots } from "@/hooks/useBackend";
import type { ConsultationSlot } from "@/types";
import { CalendarDays, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  reasonForVisit: string;
}

const DEFAULT_FORM: BookingForm = {
  name: "",
  email: "",
  phone: "",
  reasonForVisit: "",
};

export function BookingPage() {
  const { data: slots, isLoading: loadingSlots } = useListAvailableSlots();
  const { mutateAsync: bookAppointment, isPending } = useBookAppointment();

  const [selectedSlot, setSelectedSlot] = useState<ConsultationSlot | null>(
    null,
  );
  const [form, setForm] = useState<BookingForm>(DEFAULT_FORM);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Partial<BookingForm>>({});

  const availableSlots = (slots ?? []).filter((s) => s.isAvailable);

  function handleInput(field: keyof BookingForm, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const errs: Partial<BookingForm> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.reasonForVisit.trim())
      errs.reasonForVisit = "Please describe your reason for visit";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error("Please select an appointment slot.");
      return;
    }
    if (!validate()) return;

    try {
      await bookAppointment({
        slotId: selectedSlot.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        reasonForVisit: form.reasonForVisit,
      });
      setConfirmed(true);
      toast.success("Appointment booked successfully!");
    } catch {
      toast.error("Failed to book appointment. Please try again.");
    }
  }

  if (confirmed) {
    return (
      <Layout>
        <div
          className="flex-1 flex flex-col items-center justify-center py-16 px-4"
          data-ocid="booking.success_state"
        >
          <div className="max-w-md text-center space-y-5">
            <CheckCircle className="w-16 h-16 text-secondary mx-auto" />
            <h2 className="font-display text-2xl font-semibold text-foreground">
              Booking Confirmed
            </h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Your consultation has been successfully booked. We'll send a
              confirmation to <strong>{form.email}</strong> shortly.
            </p>
            <p className="text-xs text-muted-foreground font-body">
              If you need to make changes, please visit your dashboard or
              contact us at contact@conceptionclinic.health
            </p>
            <Button
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="bg-primary text-primary-foreground"
              data-ocid="booking.go_dashboard_button"
            >
              View My Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header */}
      <section className="bg-card border-b border-border py-10 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
            Book a Consultation
          </h1>
          <p className="text-muted-foreground font-body text-sm">
            Schedule a one-on-one session with one of our reproductive health
            specialists.
          </p>
        </div>
      </section>

      <section
        className="bg-background flex-1 py-10 px-4 sm:px-6 lg:px-8"
        data-ocid="booking.form_section"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Slot Selection */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarDays size={18} className="text-primary" />
                Available Time Slots
              </h2>
              {loadingSlots ? (
                <div
                  className="space-y-3"
                  data-ocid="booking.slots_loading_state"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <Skeleton key={n} className="h-14 w-full rounded-lg" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div
                  className="bg-muted/30 border border-border rounded-lg p-6 text-center"
                  data-ocid="booking.slots_empty_state"
                >
                  <CalendarDays className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
                  <p className="text-muted-foreground font-body text-sm">
                    No available slots at the moment.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Please check back later or contact us directly.
                  </p>
                </div>
              ) : (
                <div className="space-y-2" data-ocid="booking.slots_list">
                  {availableSlots.map((slot, i) => {
                    const startDate = new Date(
                      Number(slot.startTime) / 1_000_000,
                    );
                    const isSelected = selectedSlot?.id === slot.id;
                    return (
                      <button
                        type="button"
                        key={slot.id.toString()}
                        onClick={() => setSelectedSlot(slot)}
                        data-ocid={`booking.slot.${i + 1}`}
                        className={`w-full text-left px-4 py-3 rounded-lg border transition-smooth ${
                          isSelected
                            ? "border-primary bg-primary/8 shadow-clinical"
                            : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <p className="font-body font-medium text-sm text-foreground">
                              {startDate.toLocaleDateString("en-US", {
                                weekday: "long",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                              <Clock size={11} />
                              {startDate.toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                              {" · "}
                              {Number(slot.durationMinutes)} min
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle
                              size={16}
                              className="text-primary flex-shrink-0"
                            />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Booking Form */}
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                Your Details
              </h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="booking.details_form"
              >
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="font-body text-sm">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInput("name", e.target.value)}
                    placeholder="Your full name"
                    data-ocid="booking.name_input"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && (
                    <p
                      className="text-xs text-destructive font-body"
                      data-ocid="booking.name_field_error"
                    >
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-body text-sm">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInput("email", e.target.value)}
                    placeholder="you@example.com"
                    data-ocid="booking.email_input"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && (
                    <p
                      className="text-xs text-destructive font-body"
                      data-ocid="booking.email_field_error"
                    >
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="font-body text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleInput("phone", e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    data-ocid="booking.phone_input"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && (
                    <p
                      className="text-xs text-destructive font-body"
                      data-ocid="booking.phone_field_error"
                    >
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="reason" className="font-body text-sm">
                    Reason for Visit
                  </Label>
                  <textarea
                    id="reason"
                    value={form.reasonForVisit}
                    onChange={(e) =>
                      handleInput("reasonForVisit", e.target.value)
                    }
                    placeholder="Brief description of what you'd like to discuss..."
                    rows={3}
                    data-ocid="booking.reason_textarea"
                    className={`w-full px-3 py-2 rounded-lg border bg-background text-foreground font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${errors.reasonForVisit ? "border-destructive" : "border-input"}`}
                  />
                  {errors.reasonForVisit && (
                    <p
                      className="text-xs text-destructive font-body"
                      data-ocid="booking.reason_field_error"
                    >
                      {errors.reasonForVisit}
                    </p>
                  )}
                </div>

                {!selectedSlot && (
                  <p className="text-xs text-muted-foreground font-body bg-muted/40 rounded px-3 py-2 border border-border">
                    Please select a time slot on the left to proceed.
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isPending || !selectedSlot}
                  data-ocid="booking.submit_button"
                  className="w-full bg-primary text-primary-foreground disabled:opacity-50"
                >
                  {isPending ? "Booking…" : "Confirm Booking"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
