jQuery(function(b){var a=!!("undefined"!=typeof isRtl&&isRtl);b("#site-search-input").autocomplete({source:ajaxurl+"?action=autocomplete-site",delay:500,minLength:2,position:a?{my:"right top",at:"right bottom",offset:"0, -1"}:{offset:"0, -1"},open:function(d,c){b(this).addClass("open")},close:function(d,c){b(this).removeClass("open")}})});