import store from './store'
export default class Transfer{
	constructor(){
		this.tran_go = 'slide-left'
		this.tran_back = 'slide-right'
	}

	go(self, link, param){
		store.commit('nextPage')
		this.closeToasts()
		let path = param?link +'\/'+ param:link
		self.$router.push(path)
	}

	back(self, link, param){
		store.commit('backPage')
		this.closeToasts()
		let path = param?link +'\/'+ param:link
		self.$router.push(path)
	}

	noTransfer(self, link){
		store.commit('noTransfer')
		this.closeToasts()
		self.$router.push(link)
	}

	closeToasts(){
		let toasts = document.querySelectorAll('.mint-toast')
		if (toasts.length >0) Array.from(toasts).forEach(item => item.parentNode.removeChild(item))
	}
}