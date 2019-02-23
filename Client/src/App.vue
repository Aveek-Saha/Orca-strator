<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <!-- Navbar content -->
        <a class="navbar-brand" href="/">Selfieless Acts</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <!-- <a class="nav-item nav-link " href="/">Home <span class="sr-only">(current)</span></a> -->
                
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Category</a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" v-for="(category , index) in categories" :key="index" @click="filter(category)">{{ category }}</a>
                    </div>
                </li>

                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"> + New </a>
                    <div class="dropdown-menu">
                        <!-- <a class="dropdown-item"></a> -->
                        <a href="" class="dropdown-item" data-toggle="modal" data-target="#exampleModal">Act</a>

                        <a href="" class="dropdown-item" data-toggle="modal" data-target="#userModal">User</a>

                        <a href="" class="dropdown-item" data-toggle="modal" data-target="#categoryModal">Category</a>
                    </div>
                </li>
            </div>
            
        </div>
        <!-- <div class="navbar-collapse">
            <ul class="navbar-nav ml-auto">
                
                
            </ul>
        </div> -->
    </nav>

    <div class="modal fade" id="categoryModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">New Category</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        
                        <div class="form-group">
                            <label for="username">Category Name</label>
                            <input type="text" class="form-control" id="username" v-model="categoryAdd" >
                        </div>
                    </form>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="addCategory" data-dismiss="modal">Add</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="userModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">New User</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" v-model="userForm" >
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="text" class="form-control" id="password" v-model="password" >

                        </div>
                    </form>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="addUser" data-dismiss="modal">Add</button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">New Act</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form>
                        
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" class="form-control" id="username" v-model="username" >
                        </div>
                        <div class="form-group">
                            <label for="category">Category</label>
                            <select class="form-control" id="category" v-model="formCategory">
                                <option v-for="(category , index) in categories" :key="index"> {{ category }} </option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="content">Content</label>
                            <textarea class="form-control" id="content" v-model="content" ></textarea>
                        </div>
                        <div class="input-group">
                            <div class="custom-file">
                                <input type="file" class="custom-file-input" id="file" @change="convertImg"  accept="image/*">
                                <label class="custom-file-label" for="file">{{imgName}}</label>
                            </div>
                        </div>
                    </form>
                    
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" @click="postAct" data-dismiss="modal">Add</button>
                </div>
            </div>
        </div>
    </div>
    <!-- <Home /> -->
    <div class="container">
        <!-- <div class="col-lg-2"></div> -->
        <br>

        <div class="spinner" v-if="loading" >
              <div class="rect1"></div>
              <div class="rect2"></div>
              <div class="rect3"></div>
              <div class="rect4"></div>
              <div class="rect5"></div>
              <div class="rect6"></div>
        </div>

        <div class="col-lg-6 offset-lg-3">
            <Post v-for="(act , index) in acts" :key="index" v-bind:act="act"></Post>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

import Home from './components/Home.vue'
import Post from './components/Post.vue'

export default {
  name: 'app',
  components: {
    Home,
    Post
  },
  data() {
    return {
      categories: [],
      acts: [],
      actURL:"http://3.208.136.128/api/v1/acts",
      catURL: "http://3.208.136.128/api/v1/categories",
      userUrl: "http://3.208.136.128/api/v1/users",
      username: "",
      userForm: "",
      password: "",
      formCategory: "",
      categoryAdd: "",
      content: "",
      image: "",
      imgName: "",

      loading: false
    }
  },
  methods: {
    getCategories: function(){
        var that = this
        // console.log("hello");
        this.categories = []

        axios.get(this.catURL)
        .then(function (response) {
            var data = response.data;

            Object.keys(data).forEach(element => {
                that.categories.push(element)
            });
            
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    getActs: function(){
        var that = this
        // console.log("hello");
        this.loading = true
        this.acts = []
        axios.get(this.actURL)
        .then(function (response) {
            var data = response.data;
            // console.log(data);
            data.forEach(act => {
              that.acts.push(act)
            });
            that.loading = false
        })
        .catch(function (error) {
            console.log(error);
            that.loading = false

        });
    },
    postAct: function(){
        var that = this
        
        if(this.username !="" && this.formCategory!= "" && this.content != "" && this.image!= ""){
            axios.post(this.actURL, {
                actId: Math.floor(1000 + Math.random() * 9000),
                username: that.username,
                timestamp: that.getDate(),
                categoryName: that.formCategory,
                caption: that.content,
                imgB64: that.image
            })
            .then(function (response) {
                // console.log(response);
                that.username =""
                that.formCategory = "" 
                that.content = "" 
                that.image = ""
                that.getActs()
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        
    },
    addUser: function(){
        var that = this
        
        if(this.username !="" && this.password!= ""){
            axios.post(this.userURL , {
                username: that.userForm,
                password: that.password
            })
            .then(function (response) {
                console.log(response.data);
                // that.getActs()
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        
    },
    addCategory: function(){
        var that = this
        
        if(this.categoryAdd !=""){
            axios.post(this.catURL , [this.categoryAdd])
            .then(function (response) {
                // console.log(response.data);
                that.getCategories();
                // that.getActs()
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        
    },
    filter: function(catName) {
        var that = this
        // console.log("hello");
        this.acts = []
        this.loading = true

        axios.get(this.actURL)
        .then(function (response) {
            var data = response.data;
            // console.log(data);
            data.forEach(act => {
                if(act.category == catName)
                    that.acts.push(act)
            });
            that.loading = false            
        })
        .catch(function (error) {
            console.log(error);
        });
    },
    convertImg: function(event) {
        var that = this
        
        var input = event.target;

        if (input.files && input.files[0]) {
            // console.log(input.files[0]);
            this.imgName = input.files[0].name
            var reader = new FileReader();
            
            reader.onload = (e) => {
                
                that.image = e.target.result;
                // console.log(e.target.result);

            }
            
            reader.readAsDataURL(input.files[0]);
        }
    },
    getDate: function() {
        var date = new Date();
        var aaaa = date.getFullYear();
        var gg = date.getDate();
        var mm = (date.getMonth() + 1);

        if (gg < 10)
            gg = "0" + gg;
        if (mm < 10)
            mm = "0" + mm;

        var cur_day = gg + "-" + mm + "-" + aaaa;
        var hours = date.getHours()
        var minutes = date.getMinutes()
        var seconds = date.getSeconds();

        if (hours < 10)
            hours = "0" + hours;
        if (minutes < 10)
            minutes = "0" + minutes;
        if (seconds < 10)
            seconds = "0" + seconds;

        var final = cur_day + ":" + seconds + "-" + minutes + "-" + hours;
        // console.log(final);
        
        return final
    }

  },
  created: function(){
    this.getActs()
    this.getCategories()
  },
  mounted: function(){
    // console.log(this.$children[0].$options.methods);

  }
}
</script>

<style>
.spinner {
  margin: 100px auto;
  width: 60px;
  height: 50px;
  text-align: center;
  font-size: 10px;
}
.spinner > div {
  background-color: #333;
  height: 100%;
  width: 6px;
  display: inline-block;
  margin: 2px;
  
  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}
.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}
.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}
.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}
.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}
.spinner .rect6 {
  -webkit-animation-delay: -0.7s;
  animation-delay: -0.7s;
}
@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }  
  20% { -webkit-transform: scaleY(1.0) }
}
@keyframes sk-stretchdelay {
  0%, 40%, 100% { 
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% { 
    transform: scaleY(1.0);
    -webkit-transform: scaleY(1.0);
  }
}
</style>
