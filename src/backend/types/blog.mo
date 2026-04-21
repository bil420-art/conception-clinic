import Common "common";

module {
  public type BlogPostStatus = {
    #draft;
    #published;
  };

  public type BlogPost = {
    id : Nat;
    var title : Text;
    var content : Text;
    var excerpt : Text;
    var featuredImageUrl : ?Text;
    var status : BlogPostStatus;
    createdAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type BlogPostPublic = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    featuredImageUrl : ?Text;
    status : BlogPostStatus;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateBlogPostRequest = {
    title : Text;
    content : Text;
    excerpt : Text;
    featuredImageUrl : ?Text;
    status : BlogPostStatus;
  };

  public type UpdateBlogPostRequest = {
    id : Nat;
    title : Text;
    content : Text;
    excerpt : Text;
    featuredImageUrl : ?Text;
    status : BlogPostStatus;
  };
};
