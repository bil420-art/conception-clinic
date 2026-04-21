import Types "../types/blog";
import Common "../types/common";
import List "mo:core/List";
import Time "mo:core/Time";

module {
  public func listPublishedBlogPosts(
    posts : List.List<Types.BlogPost>
  ) : [Types.BlogPostPublic] {
    posts.filter(func(p : Types.BlogPost) : Bool {
      switch (p.status) { case (#published) true; case (#draft) false }
    }).map<Types.BlogPost, Types.BlogPostPublic>(func(p) { toPublic(p) }).toArray();
  };

  public func listAllBlogPosts(
    posts : List.List<Types.BlogPost>
  ) : [Types.BlogPostPublic] {
    posts.map<Types.BlogPost, Types.BlogPostPublic>(func(p) { toPublic(p) }).toArray();
  };

  public func getBlogPost(
    posts : List.List<Types.BlogPost>,
    postId : Nat,
  ) : ?Types.BlogPostPublic {
    switch (posts.find(func(p : Types.BlogPost) : Bool { p.id == postId })) {
      case (?p) ?toPublic(p);
      case null null;
    };
  };

  public func createBlogPost(
    posts : List.List<Types.BlogPost>,
    nextId : Nat,
    req : Types.CreateBlogPostRequest,
  ) : Types.BlogPostPublic {
    let now = Time.now();
    let post : Types.BlogPost = {
      id = nextId;
      var title = req.title;
      var content = req.content;
      var excerpt = req.excerpt;
      var featuredImageUrl = req.featuredImageUrl;
      var status = req.status;
      createdAt = now;
      var updatedAt = now;
    };
    posts.add(post);
    toPublic(post);
  };

  public func updateBlogPost(
    posts : List.List<Types.BlogPost>,
    req : Types.UpdateBlogPostRequest,
  ) : ?Types.BlogPostPublic {
    var found = false;
    posts.mapInPlace(func(p : Types.BlogPost) : Types.BlogPost {
      if (p.id == req.id) {
        found := true;
        p.title := req.title;
        p.content := req.content;
        p.excerpt := req.excerpt;
        p.featuredImageUrl := req.featuredImageUrl;
        p.status := req.status;
        p.updatedAt := Time.now();
        p;
      } else { p };
    });
    if (found) {
      switch (posts.find(func(p : Types.BlogPost) : Bool { p.id == req.id })) {
        case (?p) ?toPublic(p);
        case null null;
      };
    } else {
      null;
    };
  };

  public func deleteBlogPost(
    posts : List.List<Types.BlogPost>,
    postId : Nat,
  ) : Bool {
    let sizeBefore = posts.size();
    let filtered = posts.filter(func(p : Types.BlogPost) : Bool { p.id != postId });
    posts.clear();
    posts.append(filtered);
    posts.size() < sizeBefore;
  };

  public func toPublic(post : Types.BlogPost) : Types.BlogPostPublic {
    {
      id = post.id;
      title = post.title;
      content = post.content;
      excerpt = post.excerpt;
      featuredImageUrl = post.featuredImageUrl;
      status = post.status;
      createdAt = post.createdAt;
      updatedAt = post.updatedAt;
    };
  };
};
