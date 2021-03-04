<template>
 <div class="wrapper fadeInDown">
   <div id="formContent">
     <div class="row fadeIn first">
       <div class="col-lg-12 col-md-12 col-sm-12">
         <img src="/assets/iknkffxblack.png" class="img-fluid" alt="IKNKFFX Logo" />
       </div>
     </div>
      <div class="row form">
        <div class="col-md-12 col-lg-12 col-sm-12">
          <div class="form-group">
            <input type="text" v-model="model.username" class="fadeIn second form-control" name="login" placeholder="login">
          </div>
          <div class="form-group">
               <input type="password" id="password" v-model="model.password" class="fadeIn third form-control" name="login" placeholder="password">
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <button type="button" class="btn btn-block btn-primary mb-2 fadeIn fourth" @click="login">Log In</button>
        </div>
      </div>
   </div>

</div>
</template>

<script>
import logo from "../public/assets/iknkffxblack.png";
export default {
  data(){
    return{
      model:{
        username: null,
        password: null
      }
    }
  },
  methods:{
    login(){
      this.$http.post("/login",this.model).then((res) => {
        if(res.data.isValid){
          this.$router.push("/management");
          this.$toastr.success('Welcome to Discord Admin!','Success');
        }
        if(res.data.errors){
          for(let i=0; i< res.data.errors.length;i+=1){
            this.$toastr.error(res.data.errors[i], 'Error');
          }
        }
      })
    }
  }
}
</script>

<style>
/* BASIC */

/* STRUCTURE */

.wrapper {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  min-height: 100%;
}

#formContent {
  -webkit-border-radius: 10px 10px 10px 10px;
  border-radius: 10px 10px 10px 10px;
  width: 90%;
  padding: 30px;
  max-width: 450px;
  position: relative;
  -webkit-box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  box-shadow: 0 30px 60px 0 rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* ANIMATIONS */

/* Simple CSS3 Fade-in-down Animation */
.fadeInDown {
  -webkit-animation-name: fadeInDown;
  animation-name: fadeInDown;
  -webkit-animation-duration: 0.8s;
  animation-duration: 0.8s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

@-webkit-keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

@keyframes fadeInDown {
  0% {
    opacity: 0;
    -webkit-transform: translate3d(0, -100%, 0);
    transform: translate3d(0, -100%, 0);
  }
  100% {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}

/* Simple CSS3 Fade-in Animation */
@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-moz-keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fadeIn {
  opacity: 0;
  -webkit-animation: fadeIn ease-in 1;
  -moz-animation: fadeIn ease-in 1;
  animation: fadeIn ease-in 1;

  -webkit-animation-fill-mode: forwards;
  -moz-animation-fill-mode: forwards;
  animation-fill-mode: forwards;

  -webkit-animation-duration: 1s;
  -moz-animation-duration: 1s;
  animation-duration: 1s;
}

.fadeIn.first {
  -webkit-animation-delay: 0.2s;
  -moz-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.fadeIn.second {
  -webkit-animation-delay: 0.4s;
  -moz-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.fadeIn.third {
  -webkit-animation-delay: 0.6s;
  -moz-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.fadeIn.fourth {
  -webkit-animation-delay: 0.8s;
  -moz-animation-delay: 0.8s;
  animation-delay: 0.8s;
}
</style>