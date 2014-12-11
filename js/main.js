// MT1.11 Compat
var $E = function(selector, filter){
	return ($(filter) || document).getElement(selector);
};

var $ES = function(selector, filter){
	return ($(filter) || document).getElements(selector);
};

var trackOptimizely = function(ev) {
    window['optimizely'] = window['optimizely'] || [];
    window.optimizely.push(["trackEvent", ev]);
};

jQuery( document ).ready(function( $ ) {

    var closeOverlay = function() {
        $('.overlay.email').removeClass('visible');
        $('.overlay.phone').removeClass('visible');
        setTimeout(function() {
            $('.overlay.email').css('display', 'none');
            $('.overlay.phone').css('display', 'none');
        }, 500);
    }

    var validatePhone = function(num) {
        num = num.replace(/\s/g, '').replace(/\(/g, '').replace(/\)/g, '');
        num = num.replace("+", "").replace(/\-/g, '');

        if (num.charAt(0) == "1")
            num = num.substr(1);

        if (num.length != 10)
            return false;

        return num;
    }

    var send_phone = function(phone) {

        if (!validatePhone(phone))
            return alert('Please enter a valid US phone number!');

        var data = {
            campaignId: 'fcc-blanket', 
            userPhone: validatePhone(phone),
            zipcode: '95051'
        }

        $.ajax({
            url: 'https://call-congress.fightforthefuture.org/create',
            type: "get",
            dataType: "json",
            data: data,
            success: function(res) {
                trackOptimizely('call_fcc');
                console.log('Placed call-congress call: ', res);
            }
        });
        
        $('.overlay.phone').css('display', 'table');
        setTimeout(function() {
            $('.overlay.phone').addClass('visible');
            $('.overlay.email').removeClass('visible');
            setTimeout(function() {
                $('.overlay.phone .modal .inner').addClass('visible');
            }, 10);
            setTimeout(function() {
                $('.overlay.email').css('display', 'none');
            }, 500);
        }, 100);
    }

    var send_email = function(email) {
        if (!validateEmail(email))
            return alert('Please enter a valid email address!');

        $.ajax({
            url: 'https://queue.fightforthefuture.org/email_fcc_blanket',
            //url: 'http://debbie:9001/email_fcc_blanket',
            type: "get",
            dataType: "json",
            data: {email: email},
            success: function(res) {
                trackOptimizely('email_fcc');
                console.log('Sent email fcc request: ', res);
            }
        });

        $('.overlay.email').css('display', 'table');
        setTimeout(function() {
            $('.overlay.email').addClass('visible');
            $('.overlay.phone').removeClass('visible');
            setTimeout(function() {
                $('.overlay.email .modal .inner').addClass('visible');
            }, 10);
            setTimeout(function() {
                $('.overlay.phone').css('display', 'none');
            }, 500);
        }, 100);
    }

    $('.overlay').click(function(e) {
        console.log(e.target);
        if (e.target.className.indexOf('modal') != -1)
            closeOverlay();
    });

    $('.close').click(function(e) {
        e.preventDefault();
        closeOverlay();
    });

    $('#phoneForm').submit(function(e) {
        e.preventDefault();
        $('#call_button').click();
    });
    $('#phoneForm2').submit(function(e) {
        e.preventDefault();
        $('#phone_secondary_button').click();
    });

    $('#call_button').click(function(e) {
        send_phone($('#phone').val());
    });
    $('#phone_secondary_button').click(function(e) {
        send_phone($('#phone_secondary').val());
    });
    $('#email_button_main').click(function(e) {
        send_email($('#email_main').val());
    });
    $('#email_button').click(function(e) {
        send_email($('#email').val());
    });

    $('#emailForm').submit(function(e) {
        e.preventDefault();
        $('#email_button').click();
    });
    $('#emailFormMain').submit(function(e) {
        e.preventDefault();
        $('#email_button_main').click();
    });

    $('a.twitter').click(function(e) {

        e.preventDefault();

        trackOptimizely('share');

        var tw_text = encodeURIComponent(TWEET_TEXT);
        window.open('https://twitter.com/intent/tweet?hashtags=&text='+ tw_text +'&related=fightfortheftr');

    });

    $('.a.facebook').click(function(e) {
        trackOptimizely('share');
    });



});



function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 