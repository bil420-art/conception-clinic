import Types "../types/booking";
import Common "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

module {
  // 48 hours in nanoseconds (48 * 60 * 60 * 1_000_000_000)
  let FORTY_EIGHT_HOURS_NS : Int = 172_800_000_000_000;

  public func listAvailableSlots(
    slots : List.List<Types.ConsultationSlot>
  ) : [Types.ConsultationSlot] {
    slots.filter(func(s : Types.ConsultationSlot) : Bool { s.isAvailable }).toArray();
  };

  public func bookAppointment(
    slots : List.List<Types.ConsultationSlot>,
    appointments : List.List<Types.Appointment>,
    nextId : Nat,
    userId : Common.UserId,
    req : Types.BookAppointmentRequest,
  ) : Types.Appointment {
    // Find the slot
    let slot = switch (slots.find(func(s : Types.ConsultationSlot) : Bool { s.id == req.slotId })) {
      case (?s) s;
      case null Runtime.trap("Slot not found");
    };
    if (not slot.isAvailable) {
      Runtime.trap("Slot is not available");
    };
    // Mark slot as unavailable — update in place
    slots.mapInPlace(func(s : Types.ConsultationSlot) : Types.ConsultationSlot {
      if (s.id == req.slotId) { { s with isAvailable = false } } else { s };
    });
    let appointment : Types.Appointment = {
      id = nextId;
      userId = userId;
      slotId = req.slotId;
      name = req.name;
      email = req.email;
      phone = req.phone;
      reasonForVisit = req.reasonForVisit;
      status = #confirmed;
      slotStartTime = slot.startTime;
      createdAt = Time.now();
    };
    appointments.add(appointment);
    appointment;
  };

  public func getUserAppointments(
    appointments : List.List<Types.Appointment>,
    userId : Common.UserId,
  ) : [Types.Appointment] {
    appointments.filter(func(a : Types.Appointment) : Bool {
      Principal.equal(a.userId, userId)
    }).toArray();
  };

  public func cancelAppointment(
    appointments : List.List<Types.Appointment>,
    slots : List.List<Types.ConsultationSlot>,
    userId : Common.UserId,
    appointmentId : Common.AppointmentId,
  ) : Bool {
    var found = false;
    var slotToFree : ?Types.SlotId = null;

    appointments.mapInPlace(func(a : Types.Appointment) : Types.Appointment {
      if (a.id == appointmentId and Principal.equal(a.userId, userId) and a.status == #confirmed) {
        if (canCancel(a)) {
          found := true;
          slotToFree := ?a.slotId;
          { a with status = #cancelled };
        } else {
          a;
        };
      } else { a };
    });

    // Free the slot so it becomes available again
    switch (slotToFree) {
      case (?sid) {
        slots.mapInPlace(func(s : Types.ConsultationSlot) : Types.ConsultationSlot {
          if (s.id == sid) { { s with isAvailable = true } } else { s };
        });
      };
      case null {};
    };

    found;
  };

  public func canCancel(appointment : Types.Appointment) : Bool {
    let now = Time.now();
    let timeUntilSlot : Int = appointment.slotStartTime - now;
    timeUntilSlot >= FORTY_EIGHT_HOURS_NS;
  };
};
