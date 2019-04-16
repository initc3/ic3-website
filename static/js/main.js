/**
 * Created by fanz on 7/4/16.
 */


 var SponsorUrlMap = {
   'chain': 'http://www.chain.com/',
   'fidelitylabs': 'http://www.fidelitylabs.com/',
   'microsoft': 'https://www.microsoft.com',
   'jpmorganchase': 'https://www.jpmorganchase.com/',
   'cisco': 'http://www.cisco.com/',
   'tendermint': 'https://tendermint.com/',
   '21co': 'https://21.co/',
   'neuralcapital': 'http://www.neuralcapital.com/',
   'digitalasset': 'http://digitalasset.com/',
   'intel': 'http://intel.com',
   'ibm': 'http://ibm.com',
   'jpm': 'https://www.jpmorgan.com/country/US/en/jpmorgan',
   'cypherium': 'https://www.cypherium.io/',
   'siemens': 'http://www.siemens.com',
   'chainlink': 'http://www.smartcontract.com/link',
   'aeternity': 'http://www.aeternity.com',
   'protocollabs': 'https://www.protocol.ai/',
   'tezos': 'http://www.tezos.com'
 };

$(document).ready(function() {
    $('.more').css('display','none');

    $('.showmore').click(function(){
        $(this).hide();
        $(this).siblings('.more').transition('slide down');
    });

    $('.showless').click(function(){
        $(this).parents('.more').transition('slide down');
        $(this).parents('.more').siblings('.showmore').show();
    });

    $('img.logo').each(function(){
      id = $(this).attr('id');
      $(this).wrap("<a href='" + SponsorUrlMap[id] + "'></a>");
    });
});
