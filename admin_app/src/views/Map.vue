<template>
	<div>
	  <div class="amap-wrapper">
      <el-amap :vid="'amap-vue'" :center="center" :zoom="zoom" :map-manager="amapManager" :plugin="plugin" :events="events">
      	<el-amap-marker v-for="marker in tankMap" :icon="mark" :position="marker.position" :events="marker.markerEvents"></el-amap-marker>
      <!--   <el-amap-info-window v-for="infowindow in tankMap" :position="infowindow.position" :content="infowindow.content" :open="infowindow.open" :events="infowindow.windowEvents">
        </el-amap-info-window> -->
      </el-amap>
    </div>
	</div>
</template>
<script>
import { AMapManager } from 'vue-amap'
import { mapState, mapActions } from 'vuex'
import agent from '../util/agent'
import Moment from 'moment'
import mark from '../assets/mark.png'
let amapManager = new AMapManager()
export default {
	data() {
		return {
		  vid: 'amap-vue-1',
      zoom: 11,
      mark,
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
      tankMap: []
		}
	},
	computed: {
	},
	created(){
		this.getTankList()
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
    getTankList() {
      agent
        .get('/api/t/list', { map: true })
        .then(data => {
          console.log(data)
          if (data.list.length==0) {
            Message({
              message: '无相关数据',
              type: 'warning'
            });
            return
          }
          let tankMap = []
          data.list.forEach((item, index) => {
            if (item.longitude && item.latitude) {
              let manufactureDate = Moment(item.manufactureDate).format("YYYY-MM-DD HH:mm")
              let deliveredAt = item.deliveredAt ? Moment(item.deliveredAt).format("YYYY-MM-DD HH:mm") : '暂无'
              let content = `
                气罐编号：${item.signId}
                气罐规格：${item.type}
                出厂日期：${manufactureDate}
                配送员工：${item.deliverName}
                联系电话：${item.deliverPhone}
                配送时间：${deliveredAt}
                用户姓名：${item.realname}
                身份证号：${item.idnumber}
              `
              // let content = `
              //   <div>气罐编号：${item.signId}</div>
              //   <div>气罐规格：${item.type}</div>
              //   <div>出厂日期：${manufactureDate}</div>
              // `          
              const h = this.$createElement;
              tankMap.push({
                objectId: item.objectId,
                position: [item.longitude, item.latitude],
                content: content,
                open: true,  
                markerEvents: {
                  click: () => {
                    this.$notify({
                      title: '信息',
                      message: content,
                      duration: 0
                    });
                  }
                }
              })
            }
          })
          this.tankMap = tankMap
        })
        .catch(e => {
          console.log(e.message)
        })      
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