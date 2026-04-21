import Common "common";

module {
  public type QuestionId = Nat;

  public type AnswerValue = {
    #text_ : Text;
    #nat_ : Nat;
    #bool_ : Bool;
  };

  public type Answer = {
    questionId : QuestionId;
    value : AnswerValue;
  };

  public type RiskLevel = {
    #optimized;
    #areasToImprove;
    #consultSpecialist;
  };

  public type Recommendation = {
    category : Text;
    title : Text;
    description : Text;
  };

  public type RiskProfile = {
    overallRisk : RiskLevel;
    recommendations : [Recommendation];
    completedAt : Common.Timestamp;
  };

  public type Assessment = {
    id : Common.AssessmentId;
    userId : Common.UserId;
    answers : [Answer];
    riskProfile : RiskProfile;
    createdAt : Common.Timestamp;
  };

  public type SubmitAssessmentRequest = {
    answers : [Answer];
  };
};
