(this.webpackJsonppostcard=this.webpackJsonppostcard||[]).push([[0],{13:function(e,a,t){e.exports=t(23)},18:function(e,a,t){},20:function(e,a,t){},23:function(e,a,t){"use strict";t.r(a);var n=t(0),o=t.n(n),c=t(11),r=t.n(c),i=(t(18),t(3)),l=t(9),s=t(26),m=t(25);t(19),t(20);var d=function(){var e,a=new URLSearchParams(window.location.search),t=atob(a.get("card")||""),c=!0;try{e=JSON.parse(t),c=!1}catch(N){e={frontImage:"https://i.imgur.com/TOpuoX2.jpg",latitude:42.3528,longitude:-83.1421,message:"This is the internet version of sending a postcard home. Use this to send and receive unique flippable postcards. Click on any of these text fields or the map to edit them. Click on the card to flip it.",to:"Someone Special",address:"San Francisco, CA",sender:"Brian Sunter"},console.log("could not parse data",N)}var r=Object(n.useState)(!0),d=Object(l.a)(r,2),u=d[0],g=d[1],p=Object(n.useState)(e),f=Object(l.a)(p,2),v=f[0],h=f[1],E=[v.latitude,v.longitude],b=btoa(JSON.stringify(v));return o.a.createElement("div",{className:"App","data-testid":"home"},o.a.createElement("div",{className:"post-card"},o.a.createElement("div",{className:"flip-card"},o.a.createElement("div",{onClick:function(){return g(!u)},className:"flip-card-inner ".concat(u?"flip-card-togggle-on":"flip-card-toggle-off")},o.a.createElement("div",{className:"flip-card-front"},o.a.createElement("img",{className:"front-img",src:v.frontImage,alt:"Avatar"})),o.a.createElement("div",{className:"flip-card-back"},o.a.createElement("div",{className:"left-content"},c?o.a.createElement("textarea",{className:"writing",value:v.message,onChange:function(e){h(Object(i.a)(Object(i.a)({},v),{},{message:e.target.value}))},onClick:function(e){e.stopPropagation()}}):o.a.createElement("p",{className:"writing"},v.message)),o.a.createElement("div",{className:"middleLine"}),o.a.createElement("div",{className:"right-content"},o.a.createElement("div",{className:"stamp-container",onClick:function(e){e.preventDefault(),e.stopPropagation()}},o.a.createElement(s.a,{className:"stamp",id:"mapId",center:E,zoom:9,attributionControl:!1,onMoveEnd:function(e){var a=e.target.getCenter(),t=a.lat,n=a.lng;h(Object(i.a)(Object(i.a)({},v),{},{latitude:t,longitude:n}))},zoomControl:!1},o.a.createElement(m.a,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:""}))),c&&o.a.createElement("label",null,"Latitude:",o.a.createElement("textarea",{value:Intl.NumberFormat(navigator.language,{minimumFractionDigits:1,maximumFractionDigits:10}).format(v.latitude),onChange:function(e){var a=parseFloat(e.target.value);a&&h(Object(i.a)(Object(i.a)({},v),{},{latitude:a}))},onClick:function(e){e.stopPropagation()}})),c&&o.a.createElement("label",null,"Longitude:",o.a.createElement("textarea",{value:Intl.NumberFormat(navigator.language,{minimumFractionDigits:1,maximumFractionDigits:10}).format(v.longitude),onChange:function(e){var a=parseFloat(e.target.value);a&&h(Object(i.a)(Object(i.a)({},v),{},{longitude:a}))},onClick:function(e){e.stopPropagation()}})),o.a.createElement("div",{className:"addressBox"},c?o.a.createElement("input",{type:"text",className:"address",value:v.to,onChange:function(e){h(Object(i.a)(Object(i.a)({},v),{},{to:e.target.value}))},onClick:function(e){e.stopPropagation()}}):o.a.createElement("p",{className:"address"},"TO: ",v.to),c?o.a.createElement("input",{type:"text",className:"address",value:v.address,onChange:function(e){h(Object(i.a)(Object(i.a)({},v),{},{address:e.target.value}))},onClick:function(e){e.stopPropagation()}}):o.a.createElement("p",{className:"address"},v.address),c?o.a.createElement("input",{type:"text",className:"address",value:v.sender,onChange:function(e){h(Object(i.a)(Object(i.a)({},v),{},{sender:e.target.value}))},onClick:function(e){e.stopPropagation()}}):o.a.createElement("p",{className:"address"},"FROM: ",v.sender),c&&o.a.createElement("div",null,o.a.createElement("textarea",{value:"".concat(window.location.href,"?card=").concat(b),onClick:function(e){e.stopPropagation()}})))))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(d,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[13,1,2]]]);
//# sourceMappingURL=main.2c4a8e31.chunk.js.map