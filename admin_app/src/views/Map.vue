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
import { mapState, mapActions } from 'vuex'
let amapManager = new AMapManager();
export default {
	data() {
		return {
		  vid: 'amap-vue-1',
      zoom: 11,
      center: [120.2419049560, 29.28946517],
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
      

		}
	},
	computed: {
		...mapState(['tankList']),
		markers(){	//[longitude,latitude]
			let arr = []
			this.tankList.forEach( function(item, index) {
				let arr1 = []
				if (item.longitude && item.latitude) {
					arr1.push(item.longitude)
					arr1.push(item.latitude)
					arr.push(arr1)
				}
			})
			return arr
		}
	},
	created(){
		this.fetchTankList()
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
    },
    ...mapActions(['fetchTankList'])
	}
}
</script>
<style lang="stylus">
@import '../assets/colors'
.amap-wrapper
  width 100%
  height 650px
</style>