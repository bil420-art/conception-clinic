import Common "common";

module {
  public type ArticleCategory = {
    #nutrition;
    #lifestyle;
    #stress;
    #sexualHealth;
    #reproductiveTesting;
    #general;
  };

  public type Citation = {
    authors : Text;
    title : Text;
    source : Text;
    year : Nat;
  };

  public type Article = {
    id : Common.ArticleId;
    title : Text;
    content : Text;
    category : ArticleCategory;
    citations : [Citation];
    publishedAt : Common.Timestamp;
    var updatedAt : Common.Timestamp;
  };

  public type ArticlePublic = {
    id : Common.ArticleId;
    title : Text;
    content : Text;
    category : ArticleCategory;
    citations : [Citation];
    publishedAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CreateArticleRequest = {
    title : Text;
    content : Text;
    category : ArticleCategory;
    citations : [Citation];
  };
};
