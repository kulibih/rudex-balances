(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{214:function(e,t,n){e.exports=n(457)},219:function(e,t,n){},220:function(e,t,n){},221:function(e,t){},238:function(e,t){},240:function(e,t){},266:function(e,t){},457:function(e,t,n){"use strict";n.r(t);var a=n(1),c=n.n(a),s=n(7),o=n.n(s),r=(n(219),n(60)),i=n(61),u=n(63),l=n(62),m=n(64),p=n(460),d=n(462),f=(n(220),n(459)),h=function(e){function t(){return Object(r.a)(this,t),Object(u.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"shouldComponentUpdate",value:function(e){return this.props.precision!==e.precision||this.props.replace!==e.replace||this.props.asset!==e.asset||this.props.amount!==e.amount}},{key:"render",value:function(){var e=this.props,t=e.precision,n=e.asset,a=e.amount;return n?(a=void 0!==t?a.toFixed(t):a.toFixed(),c.a.createElement("span",null,a," ",c.a.createElement("small",null,n.replace("RUDEX.","")))):null}}]),t}(a.Component),y=n(36),b=n(65),g=n(20),E=n.n(g),k=n(132),v=n.n(k),O="1.3.0",j="BTS",x=5,w=E()(1),F=E()(100),B=E()(50),A=E()(50),T=E()(100),S=E()(100),C=function(e){function t(e){var n;return Object(r.a)(this,t),(n=Object(u.a)(this,Object(l.a)(t).call(this,e))).state={data:[],prices:{},loading:!1},n}return Object(m.a)(t,e),Object(i.a)(t,[{key:"componentDidMount",value:function(){this.fetch()}},{key:"fetch",value:function(){var e=this;v.a.get("https://gateway.rudex.org/api/v0_3/coins").then(function(t){var n=[];t.data.forEach(function(e){n.push({name:e.symbol,minAmount:e.minAmount,account:e.issuer})}),e.fetchTokens(n),e.fetchPrices(n)}).catch(function(e){console.log(e)})}},{key:"fetchPrices",value:function(e){var t=this;e.forEach(function(e){v.a.get("https://bitsharescan.com/api/asset/".concat(e.name,"/markets?currency=USD&page=1&perPage=10&sort=volume.base&sortDirection=-")).then(function(n){if(n.data.markets){var a=n.data.markets[0].price.USD,c=t.state.prices;c[e.name]=a,t.setState({prices:c})}}).catch(function(e){console.log(e)})})}},{key:"fetchTokens",value:function(e){var t=this,n=this.state.data;e.forEach(function(e){n.push({token:e.name,account:e.account,balance:null,supply:null,feePool:null,accumulatedFees:null,minAmount:null})}),this.setState({data:n}),y.Apis.instance("wss://france.bitshares.apasia.tech/ws",!0).init_promise.then(function(){b.ChainStore.init(!1).then(function(){e.forEach(function(e){Object(b.FetchChain)("getAsset",e.name).then(function(n){Object(b.FetchChain)("getAccount",e.account).then(function(n){Object(b.FetchChain)("getObject",n.getIn(["balances",O])).then(function(a){var c=t.state.data,s=c.find(function(t){return t.token===e.name}),o=E()(a.get("balance")).shiftedBy(-x),r=j;s.account=n.get("name"),s.balance={amount:o,asset:r},t.setState({data:c})})}),Object(b.FetchChain)("getObject",n.get("dynamic_asset_data_id")).then(function(a){var c=t.state.data,s=c.find(function(t){return t.token===e.name});s.supply={amount:E()(a.get("current_supply")).shiftedBy(-n.get("precision")),asset:n.get("symbol")},s.accumulatedFees={amount:E()(a.get("accumulated_fees")).shiftedBy(-n.get("precision")),asset:n.get("symbol")},s.feePool={amount:E()(a.get("fee_pool")).shiftedBy(-x),asset:j},s.minAmount={amount:E()(e.minAmount).shiftedBy(-n.get("precision")),asset:n.get("symbol")},t.setState({data:c})})})})})})}},{key:"render",value:function(){var e=this.state,t=e.data,n=e.prices,a=e.loading,s=[{title:"Token",dataIndex:"token",key:"token",render:function(e,t,n){if(e)return c.a.createElement("a",{href:"https://market.rudex.org/#/asset/".concat(e),target:"_blank",rel:"noopener noreferrer"},e)}},{title:"Account",dataIndex:"account",key:"account",render:function(e,t,n){if(e)return c.a.createElement("a",{href:"https://market.rudex.org/#/account/".concat(e),target:"_blank",rel:"noopener noreferrer"},e)}},{title:"Balance (BTS)",dataIndex:"balance",key:"balance",render:function(e,t,n){if(e){var a=null;return e.amount.isLessThan(B)?a="warn":e.amount.isGreaterThan(T)&&(a="success"),c.a.createElement("span",{className:a},c.a.createElement(h,{precision:0,amount:e.amount,asset:e.asset}))}}},{title:"Fee Pool (BTS)",dataIndex:"feePool",key:"feePool",render:function(e,t,n){if(e){var a=null;return e.amount.isLessThan(A)?a="warn":e.amount.isGreaterThan(S)&&(a="success"),c.a.createElement("span",{className:a},c.a.createElement(h,{precision:0,amount:e.amount,asset:e.asset}))}}},{title:"Min Deposit",dataIndex:"minAmount",key:"minAmount",render:function(e,t,a){if(e){var s=n[e.asset],o=null;if(s){var r=null;(s=E()(s).multipliedBy(e.amount)).isLessThan(w)&&(r="warn"),o=c.a.createElement("span",{className:r},"($",s.toFixed(4),")")}else o=c.a.createElement("span",null,"(?)");return c.a.createElement("span",{className:null},c.a.createElement(h,{amount:e.amount,asset:e.asset})," ",o)}}},{title:"Accumulated Fees",dataIndex:"accumulatedFees",key:"accumulatedFees",render:function(e,t,a){if(e){var s=n[e.asset],o=null;if(s){var r=null;(s=E()(s).multipliedBy(e.amount)).isGreaterThanOrEqualTo(F)&&(r="success"),o=c.a.createElement("span",{className:r},"($",s.toFixed(2),")")}else o=c.a.createElement("span",null,"(?)");return c.a.createElement("span",null,c.a.createElement(h,{amount:e.amount,asset:e.asset})," ",o)}}},{title:"Supply",dataIndex:"supply",key:"supply",render:function(e,t,a){if(e){var s=n[e.asset],o=null;return s?(s=E()(s).multipliedBy(e.amount),o=c.a.createElement("span",null,"($",s.toFixed(2),")")):o=c.a.createElement("span",null,"(?)"),c.a.createElement("span",null,c.a.createElement(h,{amount:e.amount,asset:e.asset})," ",o)}}}];return c.a.createElement(f.a,{dataSource:t,columns:s,pagination:!1,loading:a,size:"small"})}}]),t}(a.Component),_=n(461),I=_.a.Content,D=_.a.Header,P=_.a.Footer,N=function(e){function t(){return Object(r.a)(this,t),Object(u.a)(this,Object(l.a)(t).apply(this,arguments))}return Object(m.a)(t,e),Object(i.a)(t,[{key:"render",value:function(){return c.a.createElement(p.a,null,c.a.createElement(_.a,{className:"layout"},c.a.createElement(D,null,c.a.createElement("h1",{className:"header"},"RuDEX Balances")),c.a.createElement(I,{style:{padding:"10px"}},c.a.createElement("div",null,c.a.createElement(d.a,{exact:!0,path:"/",component:C}))),c.a.createElement(P,{style:{textAlign:"center",position:"sticky",bottom:"0"}},"RuDEX \xa9 2019")))}}]),t}(a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(c.a.createElement(N,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[214,1,2]]]);
//# sourceMappingURL=main.a71838dc.chunk.js.map