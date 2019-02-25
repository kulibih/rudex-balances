(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{206:function(e,t,n){e.exports=n(431)},211:function(e,t,n){},212:function(e,t,n){},213:function(e,t){},230:function(e,t){},232:function(e,t){},258:function(e,t){},431:function(e,t,n){"use strict";n.r(t);var a=n(1),c=n.n(a),o=n(7),r=n.n(o),s=(n(211),n(59)),i=n(60),u=n(62),l=n(61),m=n(63),d=n(434),p=n(436),f=(n(212),n(433)),h=function(e){function t(){return Object(s.a)(this,t),Object(u.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"shouldComponentUpdate",value:function(e){return this.props.precision!==e.precision||this.props.replace!==e.replace||this.props.asset!==e.asset||this.props.amount!==e.amount}},{key:"render",value:function(){var e=this.props,t=e.precision,n=e.asset,a=e.amount;return n?(a=void 0!==t?a.toFixed(t):a.toFixed(),c.a.createElement("span",null,a," ",c.a.createElement("small",null,n.replace("RUDEX.","")))):null}}]),t}(a.Component),E=n(33),b=n(64),y=n(35),g=n.n(y),k=["PPY","RUDEX.WLS","RUDEX.SMOKE","RUDEX.STEEM","RUDEX.SBD","RUDEX.GOLOS","RUDEX.GBG","RUDEX.BTC","RUDEX.ETH","RUDEX.EOS","RUDEX.KRM","RUDEX.GRC","RUDEX.SCR"],O="1.3.0",j="BTS",v=5,R=g()(50),D=g()(50),w=g()(100),S=g()(100),X=function(e){function t(e){var n;return Object(s.a)(this,t),(n=Object(u.a)(this,Object(l.a)(t).call(this,e))).state={data:[],loading:!1},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.fetch()}},{key:"fetch",value:function(){var e=this,t=this.state.data;k.forEach(function(e){t.push({token:e,account:null,balance:null,supply:null,feePool:null,accumulatedFees:null})}),this.setState({data:t}),E.Apis.instance("wss://france.bitshares.apasia.tech/ws",!0).init_promise.then(function(){b.ChainStore.init(!1).then(function(){k.forEach(function(t){Object(b.FetchChain)("getAsset",t).then(function(n){Object(b.FetchChain)("getAccount",n.get("issuer")).then(function(n){Object(b.FetchChain)("getObject",n.getIn(["balances",O])).then(function(a){var c=e.state.data,o=c.find(function(e){return e.token===t}),r=g()(a.get("balance")).shiftedBy(-v),s=j;o.account=n.get("name"),o.balance={amount:r,asset:s},e.setState({data:c})})}),Object(b.FetchChain)("getObject",n.get("dynamic_asset_data_id")).then(function(a){var c=e.state.data,o=c.find(function(e){return e.token===t});o.supply={amount:g()(a.get("current_supply")).shiftedBy(-n.get("precision")),asset:n.get("symbol")},o.accumulatedFees={amount:g()(a.get("accumulated_fees")).shiftedBy(-n.get("precision")),asset:n.get("symbol")},o.feePool={amount:g()(a.get("fee_pool")).shiftedBy(-v),asset:j},e.setState({data:c})})})})})})}},{key:"render",value:function(){var e=this.state,t=e.data,n=e.loading,a=[{title:"Token",dataIndex:"token",key:"token",render:function(e,t,n){if(e)return c.a.createElement("a",{href:"https://market.rudex.org/#/asset/".concat(e),target:"_blank",rel:"noopener noreferrer"},e)}},{title:"Account",dataIndex:"account",key:"account",render:function(e,t,n){if(e)return c.a.createElement("a",{href:"https://market.rudex.org/#/account/".concat(e),target:"_blank",rel:"noopener noreferrer"},e)}},{title:"Balance (BTS)",dataIndex:"balance",key:"balance",render:function(e,t,n){if(e){var a=null;return e.amount.isLessThan(R)?a="warn":e.amount.isGreaterThan(w)&&(a="success"),c.a.createElement("span",{className:a},c.a.createElement(h,{precision:0,amount:e.amount,asset:e.asset}))}}},{title:"Pool (BTS)",dataIndex:"feePool",key:"feePool",render:function(e,t,n){if(e){var a=null;return e.amount.isLessThan(D)?a="warn":e.amount.isGreaterThan(S)&&(a="success"),c.a.createElement("span",{className:a},c.a.createElement(h,{precision:0,amount:e.amount,asset:e.asset}))}}},{title:"Accumulated Fees",dataIndex:"accumulatedFees",key:"accumulatedFees",render:function(e,t,n){if(e)return c.a.createElement("span",null,c.a.createElement(h,{amount:e.amount,asset:e.asset}))}},{title:"Supply",dataIndex:"supply",key:"supply",render:function(e,t,n){if(e)return c.a.createElement("span",null,c.a.createElement(h,{amount:e.amount,asset:e.asset}))}}];return c.a.createElement(f.a,{dataSource:t,columns:a,pagination:!1,loading:n,size:"small"})}}]),t}(a.Component),x=n(435),B=x.a.Content,U=x.a.Header,C=x.a.Footer,F=function(e){function t(){return Object(s.a)(this,t),Object(u.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return c.a.createElement(d.a,null,c.a.createElement(x.a,{className:"layout"},c.a.createElement(U,null,c.a.createElement("h1",{className:"header"},"RuDEX Balances")),c.a.createElement(B,{style:{padding:"10px"}},c.a.createElement("div",null,c.a.createElement(p.a,{exact:!0,path:"/",component:X}))),c.a.createElement(C,{style:{textAlign:"center",position:"sticky",bottom:"0"}},"RuDEX \xa9 2019")))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(c.a.createElement(F,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[206,1,2]]]);
//# sourceMappingURL=main.d3e2a121.chunk.js.map