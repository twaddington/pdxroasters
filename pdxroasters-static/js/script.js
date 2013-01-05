$(function() {

    //Create variables from multiple use elements.
    var panelWidth  = $(window).width(),
        panelHeight = $(window).height(),
        navLinks    = $('a.info', 'nav'),
        nav         = $('nav'),
        plus        = $('#plus', 'nav'),
        underline   = $('#active_underline', 'nav'),
        infoPanel   = $('#info_panel'),
        info        = $('#info_wrapper', '#info_panel'),
        map         = $('#map'),
        modals      = $('.modal' , '#map_wrapper'),
        markers     = $('a.roaster_marker', '#map_wrapper'),
        articleWrap = $('#article_wrapper');

    //Size elements to window size.
    function setPanelSize() {
        
        //Panel class for objects that need to be full-window
        $('.panel').css({
            width: panelWidth,
            height: panelHeight
        });
        
        //Make the info wrapper. Three panels, so three times window.
        info.css({
            width: panelWidth * 3,
            'min-height': panelHeight
        });

        // Place the three panels correctly inside the wrapper.
        $('#tab1').css({'left': 0});
        $('#tab2').css({'left': panelWidth});
        $('#tab3').css({'left': panelWidth * 2});

        //Vertically center panel content.
        if(panelHeight > 600){
            $('.panel_content').css({
                'margin-top' : panelHeight / 2 - $('.panel_content').height()
            });
        } else {
            $('.panel_content').css({
                'margin-top' : 0
            });
        }
        // Position InfoWrapper correctly with Classes to create slides
        $('.slide1').css({'left': 0});
        $('.slide2').css({'left': 0 - panelWidth});
        $('.slide3').css({'left': 0 - panelWidth * 2});
    }
    
    //Expand the Nav Bar.
    plus.click(function () {

        if (infoPanel.add(nav).add(plus).hasClass("active")){
            infoPanel.add(nav).add(plus).removeClass("active");
            infoPanel.css({'height':37});
            underline.removeClass('nav1 nav2 nav3');
        } else {
            nav.add(plus).addClass("active");
        }
        return false;

    });

    // Update the Nav and slide content.
    navLinks.click(function () {

        var el = $(this);

        underline.removeClass('nav1 nav2 nav3');

        //Open info panel.
        if ( !infoPanel.hasClass("active") ){
              infoPanel.addClass("active").css({'height':panelHeight});
        }

        //Change the left position of the info wrapper to create slides.
        switch(el.index()){
            case 1: underline.addClass('nav1'); info.removeClass().addClass('slide1');break;
            case 2: underline.addClass('nav2'); info.removeClass().addClass('slide2');break;
            case 3: underline.addClass('nav3'); info.removeClass().addClass('slide3');break;
        }

        setPanelSize();
    
    });
    
    //On resize, update all the values.
    $(window).resize(function() {
        setPanelSize();
        panelWidth = $(window).width();
        panelHeight = $(window).height();
    });

    //Set values on Document Ready.
    setPanelSize();

    markers.click(function () {
        
        modal  = '#' + $(this).data('modal-id');
        modal  = $(modal);
        position = $(this).offset();
        position.left = position.left - (modal.width()/2) - 26;
        position.top = position.top - (modal.height()) - 79;
        position.topStart = position.top - 20;

        if (modal.hasClass("closed")){
            modals.not(modal).hide().addClass('closed').animate({opacity: 0}, 400);
            modal.css('left', position.left).css('top', position.topStart).css('display' , 'block')
                 .animate({
                     opacity: 1,
                     top:position.top}, 400)
                 .removeClass('closed');

        } else {
            modal.animate({
            opacity: 0,
            top:position.topStart}, 400);
            modal.hide();
            modal.addClass('closed');
        }

    });

    // Smooth Scrolling
    $(".scroll").click(function(event){     
        event.preventDefault();
        $('html,body').animate({scrollTop:$(this.hash).offset().top}, 400);
    });

});


