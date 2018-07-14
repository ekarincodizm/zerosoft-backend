$(document).ready(function(){

	var body = $("body")

	$(document).on('click', '#btn-expand-sidebar-toggle', function(){

		if(body.attr('class').indexOf('sidebar-expanded') !== -1) {
			body.removeClass('sidebar-regular sidebar-expanded')
			body.addClass('sidebar-regular')
      // $('ul.sidebar-menu > li').each(function(){
      //   let t = this
      //   $(this).find('ul li').each(function(){
      //     if($(this).attr('class') !== undefined) {
      //       if($(this).attr('class').indexOf('active') >= 0) {
      //         $(t).find('i.current').show()
      //       }
      //     }
      //   })
      // })
		} else {
			body.removeClass('sidebar-regular sidebar-expanded')
			body.addClass('sidebar-expanded')
      //$('ul.sidebar-menu > li i.current').hide()
		}

		$('.sidebar-menu li').removeClass('opened')

		let isSidebarRegular = $('body').attr('class').indexOf('sidebar-regular') >= 0

		if(isSidebarRegular) {
			// find active submenus
			$('#sidebar > ul > li').each(function(i){
				let sidebar = $(this)
				let sub = $(this).find('li').each(function(){
					if($(this).attr('class').indexOf('active') >= 0) {
						sidebar.addClass('active')
					}
				})
			})
		} else {
			$('#sidebar > ul > li').each(function(i){
				let sidebar = $(this)
				let sub = $(this).find('li').each(function(){
					if($(this).attr('class').indexOf('active') >= 0) {
						sidebar
						.removeClass('active')
						.addClass('opened')
					}
				})
			})
		}

		window.dispatchEvent(new Event('resize'))
	})

	$(document).on('click', '.sidebar-menu > li.sub-menu > a', function(e){
    if($('body').attr('class').indexOf('sidebar-expanded') >= 0) {
  		if($(this).parent().attr('class').indexOf('opened') == -1) {
  			//$('.sidebar-menu li').removeClass('opened')
  			$(this).parent().addClass('opened')
  		} else {
  			$(this).parent().removeClass('opened')
  		}
    }
	})

	$(document).on('click', '.sidebar-menu li.sub-menu a', function(e){
		if($('body').attr('class').indexOf('sidebar-opened') >= 0) {
			if($(this).attr('href') !== undefined) {
				toggleSideBar()
			}
		}
		if($('body').attr('class').indexOf('sidebar-regular') >= 0) {
			if($(this).attr('href') !== undefined) {
				$(this).parent().parent().parent().removeClass('opened')
			}
		}
	})
	$(document).on('click', '.sidebar-menu li.no-sub-menu a', function(e){
		if($('body').attr('class').indexOf('sidebar-opened') >= 0) {
			toggleSideBar()
		}
	})

	$(document).on('mouseenter', '.sidebar-menu > li', function(){
		if($('body').attr('class').indexOf('sidebar-expanded') == -1) {
			$(this).addClass('opened')
			var y = $(this).height()+0
			$(this).find('ul li').each(function(i){
        $(this).css({
          top: y + 'px',
        })
        y += $(this).height()+0
			})
      //
			var isBtnExpendSidebar = $(this).attr('id') == 'btn-expand-sidebar-toggle'
      $('ul.sidebar-menu > li').each(function(i){
				// $('ul.sidebar-menu > li:first-of-type').attr('class').indexOf('opened') == -1
        if(!isBtnExpendSidebar) {
          if(i > 0) $(this).css({opacity: .15})
        }
      })
		}
	})
	.on('mouseleave', '.sidebar-menu > li', function(){
		if($('body').attr('class').indexOf('sidebar-expanded') == -1) {
			$(this).removeClass('opened')
			var y = $(this).height()
			$($(this).find('ul li')).each(function(i){
        $(this).css({
          top: '0px',
        })
        y += $(this).height()
			})
      //
      $('ul.sidebar-menu > li').css({opacity: 1})
		}
	})

	$(document).on('click', '#btn-show-sidebar-toggle, #sidebar .overlay', function(){
		toggleSideBar()
	})

	$(document).on('click', '.text-select-all', function () {
	   $(this).select();
	})
})

function toggleSideBar() {
	let sidebar = $('#sidebar')
	let body = $('body')
	if(sidebar.css('display') == 'none') {
		sidebar.css({
			display: 'inline-grid'
		})
		sidebar.find('.overlay').show()
		body.addClass('sidebar-opened')
	} else {
		sidebar.hide()
		sidebar.find('.overlay').hide()
		body.removeClass('sidebar-opened')
	}
}

function setupUI() {
	let md = new MobileDetect(window.navigator.userAgent)
	let body = $('body')
	if(md.mobile()) {
		body.attr('device', 'mobile')
	} else {
		body.attr('device', 'desktop')
	}
}

// function resetUI() {
//
// }

$(document).ready(function(){
	setupUI()
})

// window.onresize = function(event) {
//
// }
