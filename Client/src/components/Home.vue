<template>
  <div class="container">
        <!-- <div class="col-lg-2"></div> -->
        <br>

        <div class="col-lg-6 offset-lg-3">
            <Post v-for="(act , index) in acts" :key="index" v-bind:act="act"></Post>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Post from './Post.vue'

export default {
  name: 'Home',
  components: {
    Post
  },
  props: {
    
  },
  data() {
    return {
      acts: [],
      actURL:"http://localhost:8000/api/v1/acts",

    }
  },
  methods: {
    getActs: function(){
        var that = this
        // console.log("hello");

        axios.get(this.actURL)
        .then(function (response) {
            var data = response.data;
            // console.log(data);
            data.forEach(act => {
              that.acts.push(act)
            });
            
        })
        .catch(function (error) {
            console.log(error);
        });
    }

  },
  created: function(){
    this.getActs()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
