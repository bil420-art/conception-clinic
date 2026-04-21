import Common "common";

module {
  public type SlotId = Nat;

  public type ConsultationSlot = {
    id : SlotId;
    startTime : Common.Timestamp;
    durationMinutes : Nat;
    isAvailable : Bool;
  };

  public type AppointmentStatus = {
    #pending;
    #confirmed;
    #cancelled;
  };

  public type Appointment = {
    id : Common.AppointmentId;
    userId : Common.UserId;
    slotId : SlotId;
    name : Text;
    email : Text;
    phone : Text;
    reasonForVisit : Text;
    status : AppointmentStatus;
    slotStartTime : Common.Timestamp;
    createdAt : Common.Timestamp;
  };

  public type BookAppointmentRequest = {
    slotId : SlotId;
    name : Text;
    email : Text;
    phone : Text;
    reasonForVisit : Text;
  };
};
