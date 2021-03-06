Vue.component('eth-address-input', {
  template: '<input size="44">'
});

Vue.component('eth-address-output', {
  props: {
    address:{},
    shortenTo:{
      default:42 //full length of eth address is "0x" + 40 hex characters
    }
  },
  computed: {
    etherscanAddressURL: function() {
      let etherscanURL;
      let networkId = web3.version.network;
      //ethereum mainnet
      if (networkId == 1) {
        etherscanURL = 'https://etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 3) {
        etherscanURL = 'https://ropsten.etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 4) {
        etherscanURL = 'https://rinkeby.etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 42) {
        etherscanURL = 'https://kovan.etherscan.io/';
      }
      else {
        etherscanURL = 'https://etherscan.io/';
        console.error('unsupported network ID: no block explorer for the current network');
      }
      return etherscanURL + "address/" + this.address;
    },
    popoverHtml: function() {
      return "<span style='font-size:0.6em'>" + this.address + "</span><br><div class='row' style='border:0;padding:0;display:inline-block'><div class='col-sm-6' style='border:0;padding:0;display:inline-block'><button class='btn btn-basic' style='background-color:white; outline:none' onclick='copyTextToClipboard(" + '"' + this.address + '"' + ")'><img src='resources/copy_icon.png' width=20></button></div><div class='col-sm-6' style='border:0;padding:0;display:inline-block'><a href='" + this.etherscanAddressURL + "' target='_blank' class='btn btn-basic' style='background-color:white;border:1'><img src='resources/chain_icon.png' width=20></button></div></div>";
    },
    formattedAddress: function() {
      if (this.shortenTo <42) {
        return this.address.substring(0, this.shortenTo) + "...";
      } else {
        return this.address;
      }
    }
  },
  template: "<a tabindex=0 data-trigger='focus' data-toggle='popover' data-placement='bottom' data-html='true' :data-content='popoverHtml' style='cursor:pointer; outline:none;'>{{formattedAddress}}</a>"
});

Vue.component('duration-output', {
  props: ['seconds'],
  computed: {
    formattedInterval: function() {
      return humanizeDuration(this.seconds*1000, {largest:2});
    }
  },
  template: "<span>{{formattedInterval}}</span>"
});

Vue.component('ether-output', {
  props: ['wei'],
  computed: {
    formatted: function() {
      if (typeof web3 === "undefined") {
          var web3 = new Web3();
      }
      var ether = web3.fromWei(this.wei, "ether");
      if (this.wei.toString().length > 12)
          return ether + " Ether";
      else if (this.wei.toString().length > 6)
          return ether * 1000000000 + " Gwei";
      else if (this.wei.toString().length > 1)
          return this.wei.toString() + " wei";
      else
          return this.wei.toString() + " Ether";
    }
  },
  template: "<span>{{formatted}}</span>"
});

Vue.component('bop-state-output', {
  props: ['state'],
  computed: {
    formattedState: function() {
      if (this.state == 0)
        return "Open";
      else if (this.state == 1)
        return "Committed";
      else if (this.state == 2)
        return "Closed";
    },
    color: function() {
      if (this.state == 0)
        return "#ccffcc";
      else if (this.state == 1)
        return "cyan";
      else if (this.state == 2)
        return "#aaaaaa";
    }
  },
  template: "<div class='well well-sm' style='display:inline-block;margin-bottom:0; color:black;' v-bind:style='{backgroundColor:color}'><h3 style='margin-top:0;margin-bottom:0'>{{formattedState}}</h3></div>"
});

Vue.component('create-result-row', {
  props: ['result'],
  computed: {
    etherscanURL: function() {
      let etherscanURL;
      let networkId = web3.version.network;
      //ethereum mainnet
      if (networkId == 1) {
        etherscanURL = 'https://etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 3) {
        etherscanURL = 'https://ropsten.etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 4) {
        etherscanURL = 'https://rinkeby.etherscan.io/';
      }
      //ethereum testnet
      else if (networkId == 42) {
        etherscanURL = 'https://kovan.etherscan.io/';
      }
      else {
        etherscanURL = 'https://etherscan.io/';
        console.error('unsupported network ID: no block explorer for the current network');
      }
      return etherscanURL;
    }
  },
  template:
`<div v-if="!(this.result.mined)">Waiting for transaction to be mined: <a target="_blank" :href="this.etherscanURL + 'tx/' + this.result.txHash">{{result.txHash}}</a></div>
<div v-else><a target="_blank" :href="'interact.html?address=' + this.result.BOPAddress">BP created!</a></div>
`
});

Vue.component('blocknum-output', {
  props: ['blocknum','timestamp'],
  computed: {
    formattedBlocknum: function() {
      var blocknumStr = this.blocknum.toString();
      return blocknumStr.slice(-9,-6) +"_"+ blocknumStr.slice(-6,-3) +"_"+ blocknumStr.slice(-3);
    },
    formattedTimestamp: function() {
      return moment.unix(this.timestamp).format("YYYY.MM.DD HH:mm");
    }
  },
  template: `<span style="font-size:0.7rem">@block {{formattedBlocknum}} (~{{formattedTimestamp}})</span>`
});

Vue.component('bop-event-row', {
  props: ['event'],
  computed: {
    formattedPayerStatement: function() {
      return "Payer Statement<br><div class='well well-sm' style='margin-bottom:0;background-color:#aaffff'>"+xssFilters.inHTMLData(this.event.args.statement).replace(/(?:\r\n|\r|\n)/g, '<br />') + "</div>";
    },
    formattedWorkerStatement: function() {
      return "Worker Statement<br><div class='well well-sm' style='margin-bottom:0;background-color:#aaffff'>"+xssFilters.inHTMLData(this.event.args.statement).replace(/(?:\r\n|\r|\n)/g, '<br />') + "</div>";
    }
  },
  template:
`
<div v-if="this.event.event == 'Created'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#dddddd;display:inline-block'>BP created.</div></div>
<div v-else-if="this.event.event == 'FundsAdded'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ccccff;display:inline-block'><ether-output :wei='event.args.amount'></ether-output> deposited by <eth-address-output :address='event.args.from'></eth-address-output>.</div></div>
<div v-else-if="this.event.event == 'PayerStatement'" align='left'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ccffff;display:inline-block;max-width:50%' v-html='formattedPayerStatement'></div></div>
<div v-else-if="this.event.event == 'WorkerStatement'" align='right'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ccffff;display:inline-block;max-width:50%' v-html='formattedWorkerStatement'></div></div>
<div v-else-if="this.event.event == 'FundsRecovered'" align='left'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ff8888;display:inline-block'>Payer cancelled the BP and recovered the funds.</div></div>
<div v-else-if="this.event.event == 'Committed'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ccffcc;display:inline-block'>Worker committed to the BP.</div></div>
<div v-else-if="this.event.event == 'FundsBurned'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ffaaaa;display:inline-block'><ether-output :wei='event.args.amount'></ether-output> burned.</div></div>
<div v-else-if="this.event.event == 'FundsReleased'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ccffcc;display:inline-block'><ether-output :wei='event.args.amount'></ether-output> released.</div></div>
<div v-else-if="this.event.event == 'Closed'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#dddddd;display:inline-block'>Payment closed.</div></div>
<div v-else-if="this.event.event == 'Unclosed'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#dddddd;display:inline-block'>Payment re-opened.</div></div>
<div v-else-if="this.event.event == 'AutoreleaseDelayed'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ffdd99;display:inline-block'>Payer reset the autorelease timer.</div></div>
<div v-else-if="this.event.event == 'AutoreleaseTriggered'" align='center'><blocknum-output :blocknum='event.blockNumber' :timestamp='event.timestamp'></blocknum-output><br><div class='well well-sm' align='left' style='background-color:#ffdd99;display:inline-block'>Worker triggered the autorelease.</div></div>`
});

Vue.component('autorelease-output', {
  props: ['state', 'autoreleaseInterval', 'autoreleaseTime'],
  data: function() {
    return {
      now: Math.floor(Date.now()/1000),
      displayState: null
    }
  },
  methods: {
    calculate: function() {
      this.now = Math.floor(Date.now()/1000);

      //determine display state
      if (this.state == 0 || this.state == 2) {
        this.displayState = 'interval';
      }
      else if (this.state == 1 && this.autoreleaseTime > this.now) {
        this.displayState = 'countdown';
      }
      else if (this.state == 1 && this.autoreleaseTime <= this.now) {
        this.displayState = 'countdownDone';
      }
    }
  },
  computed: {
    labelText: function() {
      if (this.displayState == 'interval')
        return "Autorelease Interval:<br>";
      else if (this.displayState == 'countdown')
        return "Autorelease in<br>";
      else if (this.displayState == 'countdownDone')
        return "Autorelease available!";
    },
    timeText: function() {
      if (this.displayState == 'interval') {
        return humanizeDuration(this.autoreleaseInterval*1000, {largest:2});
        }
      else if (this.displayState == 'countdown') {
        return humanizeDuration((this.autoreleaseTime - this.now)*1000, {largest:2});
        }
    }
  },
  mounted: function() {
    this.calculate();
  },
  template: "<div class='well well-sm text-left' style='margin-bottom:0;display:flex;justify-content:center;flex-direction:column;background-color:#ffdd99;width:160px;height:60px;'><span  v-html='labelText'></span>{{timeText}}</div>"
});
