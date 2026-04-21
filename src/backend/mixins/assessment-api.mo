import AssessmentTypes "../types/assessment";
import AssessmentLib "../lib/assessment";
import Common "../types/common";
import List "mo:core/List";

mixin (
  assessments : List.List<AssessmentTypes.Assessment>,
  nextAssessmentId : Common.Counter,
) {
  public shared query ({ caller }) func getMyLatestAssessment() : async ?AssessmentTypes.Assessment {
    AssessmentLib.getLatestAssessment(assessments, caller);
  };

  public shared query ({ caller }) func canRetakeAssessment() : async Bool {
    AssessmentLib.canRetake(assessments, caller);
  };

  public shared ({ caller }) func submitAssessment(req : AssessmentTypes.SubmitAssessmentRequest) : async AssessmentTypes.Assessment {
    let id = nextAssessmentId.value;
    nextAssessmentId.value += 1;
    AssessmentLib.submitAssessment(assessments, id, caller, req);
  };
};
