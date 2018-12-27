<template>
  <div >
    <a class="btn" @click="toggleShow">set avatar</a>
    <my-upload field="file"
               v-model="show"
               :width="300"
               :height="300"
               url="http://localhost:8000/fileUpload"
               :withCredentials=false
               :params="params"
               :headers="headers">
    </my-upload>
    <img :src="imgDataUrl">
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
export default {
  name: 'UploadImage',
  components: {
    'my-upload': myUpload
  },
  data(){
    return{
      show: true,
      params: {
        user_id: 2,
        // name: 'avatar'
      },
      headers: {
      },
      imgDataUrl: '' // the datebase64 url of created image
    }
  },
  methods: {
    toggleShow() {
      this.show = !this.show;
    }
  },
  events: {
    /**
     * crop success
     *
     * [param] imgDataUrl
     * [param] field
     */
    cropSuccess(imgDataUrl, field){
      console.log('-------- crop success --------');
      this.imgDataUrl = imgDataUrl;
    },
    /**
     * upload success
     *
     * [param] jsonData   服务器返回数据，已进行json转码
     * [param] field
     */
    cropUploadSuccess(jsonData, field){
      console.log('-------- upload success --------');
      console.log(jsonData);
      console.log('field: ' + field);
    },
    /**
     * upload fail
     *
     * [param] status    server api return error status, like 500
     * [param] field
     */
    cropUploadFail(status, field){
      console.log('-------- upload fail --------');
      console.log(status);
      console.log('field: ' + field);
    }
  }
}
</script>

<style scoped>

</style>
