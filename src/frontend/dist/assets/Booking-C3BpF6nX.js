import { r as reactExports, j as jsxRuntimeExports, L as Layout, B as Button, S as Skeleton } from "./index-DAu_OpgI.js";
import { L as Label, I as Input } from "./label-BZOY4DM9.js";
import { i as useListAvailableSlots, j as useBookAppointment } from "./useBackend-C2LF4Rc0.js";
import { u as ue } from "./index-3noMWPg1.js";
import { C as CircleCheckBig } from "./circle-check-big-BDmBJTWE.js";
import { C as CalendarDays } from "./calendar-days-_TjAWpk2.js";
import { C as Clock } from "./clock-BIeCU2FF.js";
const DEFAULT_FORM = {
  name: "",
  email: "",
  phone: "",
  reasonForVisit: ""
};
function BookingPage() {
  const { data: slots, isLoading: loadingSlots } = useListAvailableSlots();
  const { mutateAsync: bookAppointment, isPending } = useBookAppointment();
  const [selectedSlot, setSelectedSlot] = reactExports.useState(
    null
  );
  const [form, setForm] = reactExports.useState(DEFAULT_FORM);
  const [confirmed, setConfirmed] = reactExports.useState(false);
  const [errors, setErrors] = reactExports.useState({});
  const availableSlots = (slots ?? []).filter((s) => s.isAvailable);
  function handleInput(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  }
  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Valid email is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.reasonForVisit.trim())
      errs.reasonForVisit = "Please describe your reason for visit";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedSlot) {
      ue.error("Please select an appointment slot.");
      return;
    }
    if (!validate()) return;
    try {
      await bookAppointment({
        slotId: selectedSlot.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        reasonForVisit: form.reasonForVisit
      });
      setConfirmed(true);
      ue.success("Appointment booked successfully!");
    } catch {
      ue.error("Failed to book appointment. Please try again.");
    }
  }
  if (confirmed) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Layout, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center py-16 px-4",
        "data-ocid": "booking.success_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-16 h-16 text-secondary mx-auto" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-semibold text-foreground", children: "Booking Confirmed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-muted-foreground font-body text-sm leading-relaxed", children: [
            "Your consultation has been successfully booked. We'll send a confirmation to ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: form.email }),
            " shortly."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body", children: "If you need to make changes, please visit your dashboard or contact us at contact@conceptionclinic.health" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: () => {
                window.location.href = "/dashboard";
              },
              className: "bg-primary text-primary-foreground",
              "data-ocid": "booking.go_dashboard_button",
              children: "View My Dashboard"
            }
          )
        ] })
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Layout, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-card border-b border-border py-10 px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto max-w-4xl", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display text-3xl font-semibold text-foreground mb-2", children: "Book a Consultation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "Schedule a one-on-one session with one of our reproductive health specialists." })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "section",
      {
        className: "bg-background flex-1 py-10 px-4 sm:px-6 lg:px-8",
        "data-ocid": "booking.form_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto max-w-4xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { size: 18, className: "text-primary" }),
              "Available Time Slots"
            ] }),
            loadingSlots ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "space-y-3",
                "data-ocid": "booking.slots_loading_state",
                children: [1, 2, 3, 4].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-14 w-full rounded-lg" }, n))
              }
            ) : availableSlots.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-muted/30 border border-border rounded-lg p-6 text-center",
                "data-ocid": "booking.slots_empty_state",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "w-8 h-8 text-muted-foreground/40 mx-auto mb-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground font-body text-sm", children: "No available slots at the moment." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Please check back later or contact us directly." })
                ]
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", "data-ocid": "booking.slots_list", children: availableSlots.map((slot, i) => {
              const startDate = new Date(
                Number(slot.startTime) / 1e6
              );
              const isSelected = (selectedSlot == null ? void 0 : selectedSlot.id) === slot.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSelectedSlot(slot),
                  "data-ocid": `booking.slot.${i + 1}`,
                  className: `w-full text-left px-4 py-3 rounded-lg border transition-smooth ${isSelected ? "border-primary bg-primary/8 shadow-clinical" : "border-border bg-card hover:border-primary/50 hover:bg-muted/30"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-body font-medium text-sm text-foreground", children: startDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "short",
                        day: "numeric"
                      }) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-muted-foreground mt-0.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 11 }),
                        startDate.toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit"
                        }),
                        " · ",
                        Number(slot.durationMinutes),
                        " min"
                      ] })
                    ] }),
                    isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      CircleCheckBig,
                      {
                        size: 16,
                        className: "text-primary flex-shrink-0"
                      }
                    )
                  ] })
                },
                slot.id.toString()
              );
            }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-lg font-semibold text-foreground mb-4", children: "Your Details" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "form",
              {
                onSubmit: handleSubmit,
                className: "space-y-4",
                "data-ocid": "booking.details_form",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "name", className: "font-body text-sm", children: "Full Name" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "name",
                        value: form.name,
                        onChange: (e) => handleInput("name", e.target.value),
                        placeholder: "Your full name",
                        "data-ocid": "booking.name_input",
                        className: errors.name ? "border-destructive" : ""
                      }
                    ),
                    errors.name && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-destructive font-body",
                        "data-ocid": "booking.name_field_error",
                        children: errors.name
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "email", className: "font-body text-sm", children: "Email Address" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "email",
                        type: "email",
                        value: form.email,
                        onChange: (e) => handleInput("email", e.target.value),
                        placeholder: "you@example.com",
                        "data-ocid": "booking.email_input",
                        className: errors.email ? "border-destructive" : ""
                      }
                    ),
                    errors.email && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-destructive font-body",
                        "data-ocid": "booking.email_field_error",
                        children: errors.email
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "phone", className: "font-body text-sm", children: "Phone Number" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Input,
                      {
                        id: "phone",
                        type: "tel",
                        value: form.phone,
                        onChange: (e) => handleInput("phone", e.target.value),
                        placeholder: "+1 (555) 000-0000",
                        "data-ocid": "booking.phone_input",
                        className: errors.phone ? "border-destructive" : ""
                      }
                    ),
                    errors.phone && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-destructive font-body",
                        "data-ocid": "booking.phone_field_error",
                        children: errors.phone
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "reason", className: "font-body text-sm", children: "Reason for Visit" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "textarea",
                      {
                        id: "reason",
                        value: form.reasonForVisit,
                        onChange: (e) => handleInput("reasonForVisit", e.target.value),
                        placeholder: "Brief description of what you'd like to discuss...",
                        rows: 3,
                        "data-ocid": "booking.reason_textarea",
                        className: `w-full px-3 py-2 rounded-lg border bg-background text-foreground font-body text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-smooth ${errors.reasonForVisit ? "border-destructive" : "border-input"}`
                      }
                    ),
                    errors.reasonForVisit && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-xs text-destructive font-body",
                        "data-ocid": "booking.reason_field_error",
                        children: errors.reasonForVisit
                      }
                    )
                  ] }),
                  !selectedSlot && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-body bg-muted/40 rounded px-3 py-2 border border-border", children: "Please select a time slot on the left to proceed." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      type: "submit",
                      disabled: isPending || !selectedSlot,
                      "data-ocid": "booking.submit_button",
                      className: "w-full bg-primary text-primary-foreground disabled:opacity-50",
                      children: isPending ? "Booking…" : "Confirm Booking"
                    }
                  )
                ]
              }
            )
          ] })
        ] }) })
      }
    )
  ] });
}
export {
  BookingPage
};
