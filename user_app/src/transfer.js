import store from '../vuex/store'
export default class Transfer{
	constructor(){
		this.tran_go = 'slide-left'
		this.tran_back = 'slide-right'
	}

	go(self, link, param){
		// Pointer.$emit('transfer',this.tran_go )
		store.commit('nextPage')
		this.closeToasts()
		let path = param?link +'\/'+ param:link
		self.$router.replace(path)
	}

	back(self, link, param){
		// Pointer.$emit('transfer', this.tran_back)
		store.commit('backPage')
		this.closeToasts()
		let path = param?link +'\/'+ param:link
		self.$router.replace(path)
	}

	noTransfer(self, link){
		store.commit('noTransfer')
		this.closeToasts()
		self.$router.replace(link)
	}

	closeToasts(){
		let toasts = document.querySelectorAll('.mint-toast')
		if (toasts.length >0) Array.from(toasts).forEach(item => item.parentNode.removeChild(item))
	}
}