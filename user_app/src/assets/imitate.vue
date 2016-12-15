<template>
  <div id="app">
    <mt-field label="Phone" placeholder="Input PhoneNumber" v-model='PhoneNumber'></mt-field>
    <mt-field label="VerifyCode" placeholder="Input VerifyCode" v-model='VerifyCode'></mt-field>
    <!-- <mt-button size='large' plain type='danger' @click="fetchVerifyCode()">Fetch VerifyCode</mt-button>  -->
    <mt-button size='large' plain @click="login()">Log In</mt-button> 
    <mt-field label="Address" placeholder="Input address" v-model='Address'></mt-field>
    <mt-field label="TimeSlot" placeholder="Input timeSlot" v-model='TimeSlot'></mt-field>
    <mt-field label="AreaCode" placeholder="Input areaCode" v-model='AreaCode'></mt-field>
    <mt-button size='large' plain @click="submit()">submit order</mt-button>
  </div>
</template>

<script>
import agent from './util/agent'
export default {
  name: 'app',
  data () {
    return {
      PhoneNumber: '13588277370',
      VerifyCode: '438811',
      Address: 'xx街道xx号',
      TimeSlot: '9:00',
      AreaCode: '0',
      test: 'test'
    }
  },
  methods: {
    login () {
      agent
        .post('/api/u/logIn', {
          phoneNumber: this.PhoneNumber,
          verifyCode: this.VerifyCode
        })
        .then(res => {
          console.log(res)
        })
    },
    fetchVerifyCode () {
      agent
        .post('/api/u/verifyCode', {
          phoneNumber: this.PhoneNumber
        })
        .then(res => {
          console.log(res)
        })
    },
    submit () {
      agent
        .post('/api/order/create', {
          address: this.Address,
          timeSlot: this.TimeSlot,
          areaCode: this.AreaCode
        })
        .then(res => {
          console.log(res)
        })
    }
  },
  created () {
    agent
      .get('/api/app/orderOption')
      .then(res => {
        console.log(res)
      })
  }
}
</script>

<style scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
* {
  margin-top: 10px
}
</style>
