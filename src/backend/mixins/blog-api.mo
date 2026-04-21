import BlogTypes "../types/blog";
import BlogLib "../lib/blog";
import Common "../types/common";
import List "mo:core/List";

mixin (
  blogPosts : List.List<BlogTypes.BlogPost>,
  nextBlogPostId : Common.Counter,
) {
  public shared query func listPublishedBlogPosts() : async [BlogTypes.BlogPostPublic] {
    BlogLib.listPublishedBlogPosts(blogPosts);
  };

  public shared query func listAllBlogPosts() : async [BlogTypes.BlogPostPublic] {
    BlogLib.listAllBlogPosts(blogPosts);
  };

  public shared query func getBlogPost(postId : Nat) : async ?BlogTypes.BlogPostPublic {
    BlogLib.getBlogPost(blogPosts, postId);
  };

  public shared func createBlogPost(req : BlogTypes.CreateBlogPostRequest) : async BlogTypes.BlogPostPublic {
    let id = nextBlogPostId.value;
    nextBlogPostId.value += 1;
    BlogLib.createBlogPost(blogPosts, id, req);
  };

  public shared func updateBlogPost(req : BlogTypes.UpdateBlogPostRequest) : async ?BlogTypes.BlogPostPublic {
    BlogLib.updateBlogPost(blogPosts, req);
  };

  public shared func deleteBlogPost(postId : Nat) : async Bool {
    BlogLib.deleteBlogPost(blogPosts, postId);
  };
};
