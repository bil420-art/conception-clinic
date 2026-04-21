import Types "../types/content";
import Common "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func listArticles(
    articles : List.List<Types.Article>
  ) : [Types.ArticlePublic] {
    articles.map<Types.Article, Types.ArticlePublic>(func(a) { toPublic(a) }).toArray();
  };

  public func listArticlesByCategory(
    articles : List.List<Types.Article>,
    category : Types.ArticleCategory,
  ) : [Types.ArticlePublic] {
    articles.filter(func(a : Types.Article) : Bool {
      articleCategoryEqual(a.category, category)
    }).map<Types.Article, Types.ArticlePublic>(func(a) { toPublic(a) }).toArray();
  };

  public func getArticle(
    articles : List.List<Types.Article>,
    articleId : Common.ArticleId,
  ) : ?Types.ArticlePublic {
    switch (articles.find(func(a : Types.Article) : Bool { a.id == articleId })) {
      case (?a) ?toPublic(a);
      case null null;
    };
  };

  public func createArticle(
    articles : List.List<Types.Article>,
    nextId : Nat,
    req : Types.CreateArticleRequest,
  ) : Types.ArticlePublic {
    let now = Time.now();
    let article : Types.Article = {
      id = nextId;
      title = req.title;
      content = req.content;
      category = req.category;
      citations = req.citations;
      publishedAt = now;
      var updatedAt = now;
    };
    articles.add(article);
    toPublic(article);
  };

  public func toPublic(article : Types.Article) : Types.ArticlePublic {
    {
      id = article.id;
      title = article.title;
      content = article.content;
      category = article.category;
      citations = article.citations;
      publishedAt = article.publishedAt;
      updatedAt = article.updatedAt;
    };
  };

  private func articleCategoryEqual(a : Types.ArticleCategory, b : Types.ArticleCategory) : Bool {
    switch (a, b) {
      case (#nutrition, #nutrition) true;
      case (#lifestyle, #lifestyle) true;
      case (#stress, #stress) true;
      case (#sexualHealth, #sexualHealth) true;
      case (#reproductiveTesting, #reproductiveTesting) true;
      case (#general, #general) true;
      case _ false;
    };
  };
};
