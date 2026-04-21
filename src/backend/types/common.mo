module {
  public type UserId = Principal;
  public type Timestamp = Int; // nanoseconds since epoch (Time.now())
  public type ArticleId = Nat;
  public type AssessmentId = Nat;
  public type AppointmentId = Nat;
  public type Counter = { var value : Nat };
};
