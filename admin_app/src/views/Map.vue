<template>
	<div>
	  <div class="amap-wrapper">
      <el-amap :vid="'amap-vue'" :center="center" :zoom="zoom" :map-manager="amapManager" :plugin="plugin" :events="events">
      	<el-amap-marker v-for="marker in markers" :position="marker"></el-amap-marker>
      </el-amap>
	    <button v-on:click="getMap">get map</button>
	    <button type="button" name="button" v-on:click="addZoom">zoom++</button>
	    <button type="button" name="button" v-on:click="subZoom">zoom--</button>
	    <button type="button" name="button" v-on:click="changeCenter">change center</button>
    </div>
	</div>
</template>
<script>
import { AMapManager } from 'vue-amap';
let amapManager = new AMapManager();
export default {
	data() {
		return {
		  vid: 'amap-vue-1',
      zoom: 10,
      center: [121.59996, 31.197646],
      events: {
        'moveend': () => {
          let mapCenter = this.amapManager.getMap().getCenter();
          this.center = [mapCenter.getLng(), mapCenter.getLat()];
        },
        'zoomchange': () => {
          this.zoom = this.amapManager.getMap().getZoom();
        },
        // 'click': (e) => {
        //   alert('map clicked');
        // }
      },
      plugin: ['ToolBar'],
      amapManager: amapManager,
      markers: [
				[121.59996, 31.197646],
				[121.40018, 31.197622],
				[121.69991, 31.207649]
      ]	
		}
	},
	methods: {
    getMap: function() {
      // 高德map对象实例
      let amap = this.amapManager.getMap();
      console.log(amap);
    },
    addZoom() {
      this.zoom++;
    },
    subZoom() {
      this.zoom--;
    },
    changeCenter() {
      this.center = [this.center[0] + 0.1, this.center[1] + 0.1];
    }
	}
}
</script>
<style lang="stylus">
@import '../assets/colors'
.amap-wrapper
  width 100%
  height 650px
</style>