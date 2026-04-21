import Common "common";

module {
  public type PlanningTimeline = {
    #within3Months;
    #within6Months;
    #within1Year;
    #moreThan1Year;
    #notSure;
  };

  public type UserProfile = {
    id : Common.UserId;
    var displayName : Text;
    var age : ?Nat;
    var planningTimeline : ?PlanningTimeline;
    var healthHistoryConsent : Bool;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type UserProfilePublic = {
    id : Common.UserId;
    displayName : Text;
    age : ?Nat;
    planningTimeline : ?PlanningTimeline;
    healthHistoryConsent : Bool;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type UpdateProfileRequest = {
    displayName : Text;
    age : ?Nat;
    planningTimeline : ?PlanningTimeline;
    healthHistoryConsent : Bool;
  };
};
