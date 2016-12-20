function Animation(duration, progress, easing) {
	this.duration = duration
	this.progress = progress
	this.easing = easing || function(p) {return p}
}

Animation.prototype.start = function(finished) {
	var startTime = Date.now(),
			duration = this.duration,
			self = this

	var step = function() {
		var p = (Date.now() - startTime) / duration
		var ep = self.easing(p)
		var next = true
		
		if(p < 1.0){
			self.progress(ep, p)
		} else {
			if(({}).toString.call(finished) === '[object Function]') {
				next = finished() === false
			} else {
				next = finished === false
			}

			if(next) {
				startTime += duration
			}
				self.progress(slef.easing(1.0), 1.0)
		}

		if(next){
			requestAnimationFrame(step)
		}
	}
	requestAnimationFrame(step)
}

