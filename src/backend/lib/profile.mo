import Types "../types/profile";
import Common "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  public func getProfile(
    profiles : List.List<Types.UserProfile>,
    userId : Common.UserId,
  ) : ?Types.UserProfilePublic {
    switch (profiles.find(func(p : Types.UserProfile) : Bool { Principal.equal(p.id, userId) })) {
      case (?p) ?toPublic(p);
      case null null;
    };
  };

  public func upsertProfile(
    profiles : List.List<Types.UserProfile>,
    userId : Common.UserId,
    req : Types.UpdateProfileRequest,
  ) : Types.UserProfilePublic {
    let now = Time.now();
    switch (profiles.find(func(p : Types.UserProfile) : Bool { Principal.equal(p.id, userId) })) {
      case (?p) {
        p.displayName := req.displayName;
        p.age := req.age;
        p.planningTimeline := req.planningTimeline;
        p.healthHistoryConsent := req.healthHistoryConsent;
        p.updatedAt := now;
        toPublic(p);
      };
      case null {
        let profile : Types.UserProfile = {
          id = userId;
          var displayName = req.displayName;
          var age = req.age;
          var planningTimeline = req.planningTimeline;
          var healthHistoryConsent = req.healthHistoryConsent;
          createdAt = now;
          var updatedAt = now;
        };
        profiles.add(profile);
        toPublic(profile);
      };
    };
  };

  public func toPublic(profile : Types.UserProfile) : Types.UserProfilePublic {
    {
      id = profile.id;
      displayName = profile.displayName;
      age = profile.age;
      planningTimeline = profile.planningTimeline;
      healthHistoryConsent = profile.healthHistoryConsent;
      createdAt = profile.createdAt;
      updatedAt = profile.updatedAt;
    };
  };
};
