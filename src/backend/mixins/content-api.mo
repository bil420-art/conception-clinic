import ContentTypes "../types/content";
import ContentLib "../lib/content";
import Common "../types/common";
import List "mo:core/List";

mixin (
  articles : List.List<ContentTypes.Article>,
  nextArticleId : Common.Counter,
) {
  public shared query func listArticles() : async [ContentTypes.ArticlePublic] {
    ContentLib.listArticles(articles);
  };

  public shared query func listArticlesByCategory(category : ContentTypes.ArticleCategory) : async [ContentTypes.ArticlePublic] {
    ContentLib.listArticlesByCategory(articles, category);
  };

  public shared query func getArticle(articleId : Common.ArticleId) : async ?ContentTypes.ArticlePublic {
    ContentLib.getArticle(articles, articleId);
  };

  public shared ({ caller }) func createArticle(req : ContentTypes.CreateArticleRequest) : async ContentTypes.ArticlePublic {
    let id = nextArticleId.value;
    nextArticleId.value += 1;
    ContentLib.createArticle(articles, id, req);
  };
};
