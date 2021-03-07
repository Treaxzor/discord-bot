<template>
<div>
  <div class="row">
    <div class="col-md-4 col-lg-4 col-sm-4">
      <h3 class="mt-2 mb-2">Add customer</h3>
      <input type="text" v-model="addModel.email" class="form-control" placeholder="email...">
      <div class="mt-2 text-right">
         <button type="button" class="btn btn-primary" @click="add">Add</button>
      </div>
    </div>
     <div class="col-md-4 col-lg-4 col-sm-4">
      <h3 class="mt-2 mb-2">Remove customer</h3>
      <input type="text" v-model="removeModel.email" class="form-control" placeholder="email...">
      <div class="mt-2 text-right">
         <button type="button" class="btn btn-primary" @click="remove">Remove</button>
      </div>
    </div>
     <div class="col-md-4 col-lg-4 col-sm-4">
      <h3 class="mt-2 mb-2">Unlink customer</h3>
      <input type="text" v-model="unlinkModel.email" class="form-control" placeholder="email...">
      <div class="mt-2 text-right">
         <button type="button" class="btn btn-primary" @click="unlink">Unlink</button>
      </div>
    </div>
  </div>
  <div class="divider"/>
  <div class="row">
    <div class="col-md-12 col-lg-12 col-sm-12">
        <BootstrapTable
        ref="table"
    :columns="columns"
    :data="data"
    :options="options"
  />
    </div>
  </div>
  </div>
</template>

<script>
import BootstrapTable from 'bootstrap-table/dist/bootstrap-table-vue.esm.js'
export default {
  components:{
    BootstrapTable
  },
  data(){
    return{
      addModel:{
        email: null,
      },
      removeModel:{
        email: null,
      },
      unlinkModel:{
        email: null,
      },
      columns: [
        {
          field: 'email',
          title: 'Email'
        },
        {
          field: 'invoice',
          title: 'Invoice'
        },
        {
          field: 'hasKrypton',
          title: 'Has Krypton'
        },
         {
          field: 'hasTelegram',
          title: 'Has Telegram'
        },
         {
          field: 'subscriptionId',
          title: 'Subscription Id'
        },
         {
          field: 'isManual',
          title: 'Manually Added'
        },
         {
          field: 'discordUserName',
          title: 'Discord User Name'
        }
      ],
      data: [
        {
          id: 1,
          name: 'Item 1',
          price: '$1'
        }
      ],
      options: {
        search: true,
        showColumns: true,
        sidePagination: 'server',
        url: 'api/v1/filter',
        pagination:true,
        onLoadError: this.handleError
      }
    }
  },
  methods:{
    add(){
       this.$http.post("/api/v1/add",this.addModel).then((res) => {
        if(res.data.isValid){
          this.$toastr.success('Email added','Success');
          this.$refs.table.refresh();
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
      this.addModel.email = null;
    },
    remove(){
       this.$http.post("/api/v1/remove",this.removeModel).then((res) => {
        if(res.data.isValid){
          this.$toastr.success('Email removed','Success');
          this.$refs.table.refresh();
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
      this.removeModel.email = null;
    },
    unlink(){
      this.$http.post("/api/v1/unlink",this.unlinkModel).then((res) => {
        if(res.data.isValid){
          this.$toastr.success('Email unlinked from discord','Success');
          this.$refs.table.refresh();
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
      this.unlinkModel.email = null;
    },
    handleError(status){
      if(status == 401){
        this.$toastr.error("Session expired","Error");
        this.$router.push("/login")
      }
    }
  }
}
</script>

<style>
.divider {
  height: 3px;
  width: 100%;
  background-color: #999;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>