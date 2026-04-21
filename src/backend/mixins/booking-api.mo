import BookingTypes "../types/booking";
import BookingLib "../lib/booking";
import Common "../types/common";
import List "mo:core/List";

mixin (
  slots : List.List<BookingTypes.ConsultationSlot>,
  appointments : List.List<BookingTypes.Appointment>,
  nextAppointmentId : Common.Counter,
) {
  public shared query func listAvailableSlots() : async [BookingTypes.ConsultationSlot] {
    BookingLib.listAvailableSlots(slots);
  };

  public shared ({ caller }) func bookAppointment(req : BookingTypes.BookAppointmentRequest) : async BookingTypes.Appointment {
    let id = nextAppointmentId.value;
    nextAppointmentId.value += 1;
    BookingLib.bookAppointment(slots, appointments, id, caller, req);
  };

  public shared query ({ caller }) func getMyAppointments() : async [BookingTypes.Appointment] {
    BookingLib.getUserAppointments(appointments, caller);
  };

  public shared ({ caller }) func cancelAppointment(appointmentId : Common.AppointmentId) : async Bool {
    BookingLib.cancelAppointment(appointments, slots, caller, appointmentId);
  };
};
