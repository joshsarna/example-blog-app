/* global Vue, VueRouter, axios */

var NewPage = {
  template: "#new-page",
  data: function() {
    return {
      message: "Hi",
      errors: [],
      newPost: {title: "", body: "", image: ""}
    };
  },
  created: function() {},
  methods: {
    addPost: function() {
      var params = {
        title: this.newPost.title,
        body: this.newPost.body
      };
      axios
        .post("/v1/posts", params)
        .then(function(response) {
          console.log(response.data);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var LogoutPage = {
  template: "<h1>Logout</h1>",
  created: function() {
    axios.defaults.headers.common["Authorization"] = undefined;
    localStorage.removeItem("jwt");
    router.push("/");
  }
};

var LoginPage = {
  template: "#login-page",
  data: function() {
    return {
      email: "",
      password: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        auth: {
          email: this.email,
          password: this.password
        }
      };
      axios
        .post("user_token", params)
        .then(function(response) {
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = ["Invalid email or password."];
            this.email = "";
            this.password = "";
          }.bind(this)
        );
    }
  }
};

var SignupPage = {
  template: "#signup-page",
  data: function() {
    return {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      errors: []
    };
  },
  methods: {
    submit: function() {
      var params = {
        name: this.name,
        email: this.email,
        password: this.password,
        password_confirmation: this.passwordConfirmation
      };
      axios
        .post("/v1/users", params)
        .then(function(response) {
          router.push("/login");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  }
};

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      message: "Welcome to Vue.js!",
      posts: [],
      selectedPost: {},
      comments: []
    };
  },
  created: function() {
    axios.get("/v1/posts").then(function(response) {
      console.log(response.data);
      this.posts = response.data;
    }.bind(this));
  },
  methods: {
    changeSelectedPost: function(inputPost) {
      console.log(inputPost);
      this.selectedPost = inputPost;
      var params = {post_id: this.selectedPost.id};
      axios.get("/v1/comments", params).then(function(response) {
        this.comments = response.data;
        console.log(response.data);
      }.bind(this));
    },
    editPost: function() {
      var params = {
        title: this.selectedPost.title,
        body: this.selectedPost.body
      };
      axios
        .patch("/v1/posts/" + this.selectedPost.id, params)
        .then(function(response) {
          console.log(response.data);
          router.push("/");
        })
        .catch(
          function(error) {
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    }
  },
  computed: {}
};

var router = new VueRouter({
  routes: [
    { path: "/", component: HomePage },
    { path: "/signup", component: SignupPage },
    { path: "/login", component: LoginPage },
    { path: "/logout", component: LogoutPage },
    { path: "/posts/new", component: NewPage }
  ],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router,
  created: function() {
    var jwt = localStorage.getItem("jwt");
    if (jwt) {
      axios.defaults.headers.common["Authorization"] = jwt;
    }
  }
});