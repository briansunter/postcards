(this.webpackJsonppostcard=this.webpackJsonppostcard||[]).push([[0],{12:function(e,a,t){e.exports=t(22)},17:function(e,a,t){},19:function(e,a,t){},22:function(e,a,t){"use strict";t.r(a);var n=t(0),o=t.n(n),r=t(9),c=t.n(r),s=(t(17),t(11)),i=t(25),l=t(24);t(18),t(19);var d=function(){var e=new URLSearchParams(window.location.search),a=atob(e.get("card")||""),t={};try{t=JSON.parse(a)}catch(j){console.log("could not parse data",j)}var r=t,c=r.frontImage,d=void 0===c?"https://i.imgur.com/TOpuoX2.jpg":c,m=r.latitude,p=void 0===m?42.3528:m,u=r.longitude,v=void 0===u?-83.1421:u,g=r.message,f=void 0===g?"This is the internet version of sending a postcard home. Use this to send and recieve unique flippable postcards.":g,h=r.to,E=void 0===h?"Someone Special":h,N=r.address,w=void 0===N?"San Francisco, CA":N,b=r.sender,S=void 0===b?"Brian Sunter":b,k=Object(n.useState)(!0),O=Object(s.a)(k,2),y=O[0],B=O[1],C=[p,v];return o.a.createElement("div",{className:"App","data-testid":"home"},o.a.createElement("div",{className:"post-card"},o.a.createElement("div",{className:"flip-card"},o.a.createElement("div",{onClick:function(){return B(!y)},className:"flip-card-inner ".concat(y?"flip-card-togggle-on":"flip-card-toggle-off")},o.a.createElement("div",{className:"flip-card-front"},o.a.createElement("img",{className:"front-img",src:d,alt:"Avatar"})),o.a.createElement("div",{className:"flip-card-back"},o.a.createElement("div",{className:"left-content"},o.a.createElement("p",{className:"writing"},f)),o.a.createElement("div",{className:"right-content"},o.a.createElement("div",{className:"stamp-container"},o.a.createElement(i.a,{className:"stamp",id:"mapId",center:C,zoom:9,attributionControl:!1,zoomControl:!1},o.a.createElement(l.a,{url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",attribution:""}))),o.a.createElement("div",{className:"addressBox"},o.a.createElement("p",{className:"address"},"TO: ",E," "),o.a.createElement("p",{className:"address"}," ",w," "),o.a.createElement("p",{className:"address"},"FROM: ",S," "))))))))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));c.a.render(o.a.createElement(o.a.StrictMode,null,o.a.createElement(d,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}},[[12,1,2]]]);
//# sourceMappingURL=main.e708a421.chunk.js.map