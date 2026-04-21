import ProfileTypes "../types/profile";
import ProfileLib "../lib/profile";
import List "mo:core/List";

mixin (profiles : List.List<ProfileTypes.UserProfile>) {
  public shared query ({ caller }) func getMyProfile() : async ?ProfileTypes.UserProfilePublic {
    ProfileLib.getProfile(profiles, caller);
  };

  public shared ({ caller }) func upsertMyProfile(req : ProfileTypes.UpdateProfileRequest) : async ProfileTypes.UserProfilePublic {
    ProfileLib.upsertProfile(profiles, caller, req);
  };
};
