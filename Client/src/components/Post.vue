<template>
    <div>
        <div class="row">
            <div class="card" >
                <img class="card-img-top" v-bind:src="act.imgB64" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">{{act.username}}</h5>
                    <h6 class="card-subtitle mb-2 text-muted">{{act.category}}</h6>
                    <p class="card-text">{{act.caption}}</p>
                    <a  style="text-decoration: none;"> {{act.upvotes}}
                        <i class="far fa-heart" @click="upvote(act)"></i>
                    </a> &nbsp; &nbsp;

                    <a  style="text-decoration: none;" @click="deleteAct(act)"> 
                        <i class="far fa-trash-alt"></i>
                    </a>
                    
                </div>
            </div>
        </div>

        <br>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Post',
  props: ['act'],
  data() {
    return {
      
      actURL:"http://3.208.136.128/api/v1/acts",
    }
  },
  methods: {
    upvote: function(item){
        // console.log(item);
        var that = this
        axios.post(this.actURL + "/upvote", [item.actId])
            .then(function (response) {
                // console.log(that.$parent);
                // that.$parent.getActs();
                console.log(item.actId);

                that.getUpvotes(item.actId)
                
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    deleteAct: function(item){
        var that = this
        axios.delete(this.actURL + "/" + item.actId.toString())
            .then(function (response) {
                // console.log(that.$parent);
                that.$parent.getActs();
                
            })
            .catch(function (error) {
                console.log(error);
            });
    },
    getUpvotes: function(actId){
        var that = this
        var newUpvotes = 0;
        // console.log(actId);
        
        axios.get(this.actURL + "/upvote/" + actId.toString())
        .then(function (response) {
            // console.log(response.data);
            that.act.upvotes = response.data.upvotes
            
        })
        .catch(function (error) {
                console.log(error);
            });
        return newUpvotes;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a:hover {
    cursor: pointer;
}
</style>
