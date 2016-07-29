/**
 * Created by fanz on 7/4/16.
 */

$(document).ready(function() {
    $('.more').css('display','none');

    $('.showmore').click(function(){
        $(this).hide();
        $(this).siblings('.more').transition('slide down');
    });

    $('.showless').click(function(){
        $(this).parents('.more').transition('slide down');
        $(this).parents('.more').siblings('.showmore').show();
    })
});
