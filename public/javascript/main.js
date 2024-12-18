

jQuery(document).ready(function($) {

	'use strict';
      (function($) {
        $(".accordion > li:eq(0) .accordion-trigger")
          .addClass("active")
          .next()
          .slideDown();

        $(".accordion-trigger").click(function(j) {
          var dropDown = $(this)
            .closest("li")
            .find(".accordion-content");

          $(this)
            .closest(".accordion")
            .find(".accordion-content")
            .not(dropDown)
            .slideUp();

          if ($(this).hasClass("active")) {
            $(this).removeClass("active");
          } else {
            $(this)
              .closest(".accordion")
              .find(".accordion-trigger.active")
              .removeClass("active");
            $(this).addClass("active");
          }

          dropDown.stop(false, true).slideToggle();

          j.preventDefault();
        });
      })(jQuery);


      $('.owl-carousel').owlCarousel({
          loop:true,
          margin:30,
          responsiveClass:true,
          responsive:{
              0:{
                  items:1,
                  nav:true
              },
              500:{
                  items:2,
                  nav:false
              },
              800:{
                  items:3,
                  nav:false
              },
              1000:{
                  items:3,
                  nav:true,
                  loop:false
              },
              1200:{
                  items:4,
                  nav:true,
                  loop:false
              },
              1500:{
                  items:4,
                  nav:true,
                  loop:false
              }
          }
      })

      
    
      /**
     * jquery.responsive-menu.js
     * jQuery + CSS Multi Level Responsive Menu
     */

    jQuery(function($) {
      $.fn.responsivenav = function(args) {
        // Default settings
        var defaults = {
          responsive: true,
          width: 993,                           // Responsive width
          button: $(this).attr('id')+'-button', // Menu button id
          animation: {                          // Menu animation
          effect: 'slide',                    // Accepts 'slide' or 'fade'
          show: 150,
          hide: 100
          },
          selected: 'selected',                 // Selected class
          arrow: 'downarrow'                    // Dropdown arrow class
        };
        var settings = $.extend(defaults, args);
        
        // Initialize the menu and the button
        init($(this).attr('id'), settings.button);
        
        function init(menuid, buttonid) {
          setupMenu(menuid, buttonid);
          // Add a handler function for the resize and orientationchange event
          $(window).bind('resize orientationchange', function(){ resizeMenu(menuid, buttonid); });
          // Trigger initial resize
          resizeMenu(menuid, buttonid);
        }
        
        function setupMenu(menuid, buttonid) {
          var $mainmenu = $('#'+menuid+'>ul');
          
          var $headers = $mainmenu.find("ul").parent();
          // Add dropdown arrows
          $headers.each(function(i) {
            var $curobj = $(this);
            $curobj.children('a:eq(0)').append('<span class="'+settings.arrow+'"></span>');
          });
          
          if ( settings.responsive ) {
            // Menu button click event
            // Displays top-level menu items
            $('#'+buttonid).click(function(e) {
              e.preventDefault();
              
              if ( isSelected($('#'+buttonid)) ) {
                // Close menu
                collapseChildren('#'+menuid);
                animateHide($('#'+menuid), $('#'+buttonid));
              } else {
                // Open menu
                animateShow($('#'+menuid), $('#'+buttonid));
              }
            });
          }
        }
        
        function resizeMenu(menuid, buttonid) {
          var $ww = document.body.clientWidth;
          
          // Add mobile class to elements for CSS use
          // instead of relying on media-query support
          if ( $ww > settings.width || !settings.responsive) {
            $('#'+menuid).removeClass('mobile');
            $('#'+buttonid).removeClass('mobile');
          } else {
            $('#'+menuid).addClass('mobile');
            $('#'+buttonid).addClass('mobile');
          }
          
          var $headers = $('#'+menuid+'>ul').find('ul').parent();
          
          $headers.each(function(i) {
            var $curobj = $(this);
            var $link = $curobj.children('a:eq(0)');
            var $subul = $curobj.find('ul:eq(0)');
            
            // Unbind events
            $curobj.unbind('mouseenter mouseleave');
            $link.unbind('click');
            animateHide($curobj.children('ul:eq(0)'));
            
            if ( $ww > settings.width  || !settings.responsive ) {
              // Full menu
              $curobj.hover(function(e) {
                var $targetul = $(this).children('ul:eq(0)');
                
                var $dims = { w: this.offsetWidth,
                              h: this.offsetHeight,
                              subulw: $subul.outerWidth(),
                              subulh: $subul.outerHeight()
                            };
                var $istopheader = $curobj.parents('ul').length == 1 ? true : false;
                $subul.css($istopheader ? {} : { top: 0 });
                var $offsets = { left: $(this).offset().left, 
                                 top: $(this).offset().top
                               };
                var $menuleft = $istopheader ? 0 : $dims.w;
                $menuleft = ( $offsets.left + $menuleft + $dims.subulw > $(window).width() ) ? ( $istopheader ? -$dims.subulw + $dims.w : -$dims.w ) : $menuleft;
                $targetul.css({ left:$menuleft+'px', 
                               width:$dims.subulw+'px' 
                              });
                
                animateShow($targetul);
              },
              function(e) {
                var $targetul = $(this).children('ul:eq(0)');
                animateHide($targetul);
              });
            } else {
              // Compact menu
              $link.click(function(e) {
                e.preventDefault();

                var $targetul = $curobj.children('ul:eq(0)');
                if ( isSelected($curobj) ) {
                  collapseChildren($targetul);
                  animateHide($targetul);
                } else {
                  //collapseSiblings($curobj);
                  animateShow($targetul);
                }
              });
            }
          });
          
          collapseChildren('#'+menuid);
          
          if ( settings.responsive && isSelected($('#'+buttonid)) ) {
            //collapseChildren('#'+menuid);
            $('#'+menuid).hide();
            $('#'+menuid).removeAttr('style');
            $('#'+buttonid).removeClass(settings.selected);
          }
        }
        
        function collapseChildren(elementid) {
          // Closes all submenus of the specified element
          var $headers = $(elementid).find('ul');
          $headers.each(function(i) {
            if ( isSelected($(this).parent()) ) {
              animateHide($(this));
            }
          });
        }
        
        function collapseSiblings(element) {
          var $siblings = element.siblings('li');
          $siblings.each(function(i) {
            collapseChildren($(this));
          });
        }
        
        function isSelected(element) {
          return element.hasClass(settings.selected);
        }
        
        function animateShow(menu, button) {
          if ( !button ) { var button = menu.parent(); }
          
          button.addClass(settings.selected);
          
          if ( settings.animation.effect == 'fade' ) {
            menu.fadeIn(settings.animation.show);
          } else if ( settings.animation.effect == 'slide' ) {
            menu.slideDown(settings.animation.show);
          } else {
            menu.show();
            menu.removeClass('hide');
          }
        }
        
        function animateHide(menu, button) {
          if ( !button ) { var button = menu.parent(); }
          
          if ( settings.animation.effect == 'fade' ) {
            menu.fadeOut(settings.animation.hide, function() { 
              menu.removeAttr('style');
              button.removeClass(settings.selected);
            });
          } else if ( settings.animation.effect == 'slide' ) {
            menu.slideUp(settings.animation.hide, function() { 
              menu.removeAttr('style');
              button.removeClass(settings.selected);
            });
          } else {
            menu.hide();
            menu.addClass('hide');
            menu.removeAttr('style');
            button.removeClass(settings.selected);
          }
        }
      };
    });

    jQuery(function ($) {
      $('#primary-nav').responsivenav();
      $('#top-nav').responsivenav({responsive:false});
    });
	
});


//******************************************
//*************FUNCTION ETOILE**************
//******************************************

jQuery(document).ready(function () {

  function setRating(rating) {
      $('#rating-input').val(rating);
    
      // fill all the stars assigning the '.selected' class
      $('.rating-star').removeClass('fa-star-o').addClass('selected');
      // empty all the stars to the right of the mouse
      $('.rating-star#rating-' + rating + ' ~ .rating-star').removeClass('selected').addClass('fa-star-o');
  }

  $('.rating-star')
      .on('mouseover', function (e) {
          var rating = $(e.target).data('rating');
        
          // fill all the stars
          $('.rating-star').removeClass('fa-star-o').addClass('fa-star');
          // empty all the stars to the right of the mouse
          $('.rating-star#rating-' + rating + ' ~ .rating-star').removeClass('fa-star').addClass('fa-star-o');
      })
      .on('mouseleave', function (e) {
          // empty all the stars except those with class .selected
          $('.rating-star').removeClass('fa-star').addClass('fa-star-o');
      })
      .on('click', function (e) {
          var rating = $(e.target).data('rating');
          setRating(rating);
          console.log(rating);
      })
      .on('keyup', function (e) {
          // if spacebar is pressed while selecting a star
          if (e.keyCode === 32) {
              // set rating (same as clicking on the star)
              var rating = $(e.target).data('rating');
              setRating(rating);
          }
      });
});





const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

///Get user name and room 
const {username,room} = Qs.parse(location.search,{
 ignoreQueryPrefix:true
});

// console.log( {username,room});


const socket = io();
//connection aux salon 

socket.emit('joinRoom',{username,room})

// utilisateur dans le tchat
socket.on('roomUsers',({room,users})=>{
  outputRoomName(room);
  outputUsers(users);
});

///Message serveur
socket.on('message',message =>{
  console.log(message);
  outputMessage(message);

  ///focus message 
chatMessages.scrollTop = chatMessages.scrollHeight;

});

//Message 

chatForm.addEventListener('submit', (e) =>{
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // emision du message 
  // console.log(msg);
  socket.emit('chatMessage', msg);

  //vider limput 

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus;

});


///message front end 
function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

///Add utulusateur dans le tchat 
function outputRoomName(room){
    roomName.innerText = room
}
///Add utulusateur dans le tchat 
function outputUsers(users){
  userList.innerHTML = `
  ${users.map(user=>`<li>${user.username}</li>`).join('')}
  `
}





