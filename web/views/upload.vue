<template>
<div>
   <div class="row">
    <div class="col-lg-12 col-sm-12 col-md-12">
       <h3 class="mt-2 mb-2">Upload Krypton Users CSV</h3>
      <input type="file" ref="fileInput" class="form-control">
       <div class="mt-2 text-right">
         <button type="button" class="btn btn-primary" @click="upload">Upload</button>
      </div>
    </div>
  </div>
   <div class="row">
    <div class="col-lg-12 col-sm-12 col-md-12">
       <h3 class="mt-2 mb-2">Upload Telegram csvs</h3>
       <div class="form-group">
         <label class="form-label">Payments</label>
      <input type="file" ref="paypalPayments" class="form-control">

       </div>
       <div class="form-group">
         <label class="form-label">Subscriptions</label>
      <input type="file" ref="paypalSubscriptions" class="form-control">

       </div>
       <div class="mt-2 text-right">
         <button type="button" class="btn btn-primary" @click="uploadTelegram">Upload</button>
      </div>
    </div>
  </div>
</div>
</template>
<script>
export default {
  methods:{
      upload(){
      const fileInput = this.$refs.fileInput;
      if(fileInput.files){
          const data = new FormData();
          data.append('file', fileInput.files[0], 'randomname.jpg');
          this.$toastr.info('Uplading csv','Info');
          this.$http.post("/api/v1/krypton/upload",data).then((res) => {
        if(res.data.isValid){
          this.$toastr.success('Csv proccessed and saved','Success');
        }
        if(res.data.errors){
          for(let i=0; i< res.data.errors.length;i+=1){
            this.$toastr.error(res.data.errors[i], 'Error');
          }
        }
      }).catch((err) => {
        if(err.response && err.response.status == 401){
          this.$toastr.error("Session expired","Error");
           this.$router.push("/login")
        }
      })
      }
    },
          uploadTelegram(){
      const payments = this.$refs.paypalPayments;
      const subscriptions = this.$refs.paypalSubscriptions;
      if(payments.files && subscriptions.files){
          const data = new FormData();
          data.append('payments', payments.files[0], 'randomname.jpg');
          data.append('subscriptions', subscriptions.files[0], 'randomname.jpg');
          this.$toastr.info('Uplading csv','Info');
          this.$http.post("/api/v1/telegram/upload",data).then((res) => {
        if(res.data.isValid){
          this.$toastr.success('Csv proccessed and saved','Success');
        }
        if(res.data.errors){
          for(let i=0; i< res.data.errors.length;i+=1){
            this.$toastr.error(res.data.errors[i], 'Error');
          }
        }
      }).catch((err) => {
        if(err.response && err.response.status == 401){
          this.$toastr.error("Session expired","Error");
           this.$router.push("/login")
        }
      })
      }
    },
  }
}
</script>