function M(){}function ct(t,e){for(const n in e)t[n]=e[n];return t}function U(t){return t()}function I(){return Object.create(null)}function $(t){t.forEach(U)}function V(t){return typeof t=="function"}function At(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}let k;function Mt(t,e){return k||(k=document.createElement("a")),k.href=e,t===k.href}function lt(t){return Object.keys(t).length===0}function at(t,...e){if(t==null)return M;const n=t.subscribe(...e);return n.unsubscribe?()=>n.unsubscribe():n}function St(t,e,n){t.$$.on_destroy.push(at(e,n))}function Lt(t,e,n,i){if(t){const s=X(t,e,n,i);return t[0](s)}}function X(t,e,n,i){return t[1]&&i?ct(n.ctx.slice(),t[1](i(e))):n.ctx}function Ct(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const c=[],r=Math.max(e.dirty.length,s.length);for(let l=0;l<r;l+=1)c[l]=e.dirty[l]|s[l];return c}return e.dirty|s}return e.dirty}function Ht(t,e,n,i,s,c){if(s){const r=X(e,n,i,c);t.p(r,s)}}function jt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}function qt(t){const e={};for(const n in t)n[0]!=="$"&&(e[n]=t[n]);return e}function Pt(t,e){const n={};e=new Set(e);for(const i in t)!e.has(i)&&i[0]!=="$"&&(n[i]=t[i]);return n}function Dt(t){return t??""}const ut=typeof window<"u"?window:typeof globalThis<"u"?globalThis:global;"WeakMap"in ut;let L=!1;function ft(){L=!0}function dt(){L=!1}function _t(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function ht(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const o=[];for(let a=0;a<e.length;a++){const f=e[a];f.claim_order!==void 0&&o.push(f)}e=o}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let o=0;o<e.length;o++){const a=e[o].claim_order,f=(s>0&&e[n[s]].claim_order<=a?s+1:_t(1,s,d=>e[n[d]].claim_order,a))-1;i[o]=n[f]+1;const _=f+1;n[_]=o,s=Math.max(_,s)}const c=[],r=[];let l=e.length-1;for(let o=n[s]+1;o!=0;o=i[o-1]){for(c.push(e[o-1]);l>=o;l--)r.push(e[l]);l--}for(;l>=0;l--)r.push(e[l]);c.reverse(),r.sort((o,a)=>o.claim_order-a.claim_order);for(let o=0,a=0;o<r.length;o++){for(;a<c.length&&r[o].claim_order>=c[a].claim_order;)a++;const f=a<c.length?c[a]:null;t.insertBefore(r[o],f)}}function mt(t,e){if(L){for(ht(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentNode!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function pt(t,e,n){t.insertBefore(e,n||null)}function yt(t,e,n){L&&!n?mt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function S(t){t.parentNode&&t.parentNode.removeChild(t)}function Bt(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function Y(t){return document.createElement(t)}function Z(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function G(t){return document.createTextNode(t)}function Ot(){return G(" ")}function Wt(){return G("")}function Gt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function gt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function Rt(t,e){for(const n in e)gt(t,n,e[n])}function zt(t){return t===""?null:+t}function xt(t){return Array.from(t.childNodes)}function tt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function et(t,e,n,i,s=!1){tt(t);const c=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const l=t[r];if(e(l)){const o=n(l);return o===void 0?t.splice(r,1):t[r]=o,s||(t.claim_info.last_index=r),l}}for(let r=t.claim_info.last_index-1;r>=0;r--){const l=t[r];if(e(l)){const o=n(l);return o===void 0?t.splice(r,1):t[r]=o,s?o===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,l}}return i()})();return c.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,c}function nt(t,e,n,i){return et(t,s=>s.nodeName===e,s=>{const c=[];for(let r=0;r<s.attributes.length;r++){const l=s.attributes[r];n[l.name]||c.push(l.name)}c.forEach(r=>s.removeAttribute(r))},()=>i(e))}function Ft(t,e,n){return nt(t,e,n,Y)}function It(t,e,n){return nt(t,e,n,Z)}function wt(t,e){return et(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>G(e),!0)}function Jt(t){return wt(t," ")}function J(t,e,n){for(let i=n;i<t.length;i+=1){const s=t[i];if(s.nodeType===8&&s.textContent.trim()===e)return i}return t.length}function Kt(t,e){const n=J(t,"HTML_TAG_START",0),i=J(t,"HTML_TAG_END",n);if(n===i)return new K(void 0,e);tt(t);const s=t.splice(n,i-n+1);S(s[0]),S(s[s.length-1]);const c=s.slice(1,s.length-1);for(const r of c)r.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1;return new K(c,e)}function Qt(t,e){e=""+e,t.data!==e&&(t.data=e)}function Ut(t,e){t.value=e??""}function Vt(t,e,n,i){n==null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function Xt(t,e,n){for(let i=0;i<t.options.length;i+=1){const s=t.options[i];if(s.__value===e){s.selected=!0;return}}(!n||e!==void 0)&&(t.selectedIndex=-1)}function Yt(t){const e=t.querySelector(":checked");return e&&e.__value}function Zt(t,e,n){t.classList[n?"add":"remove"](e)}function te(t,e){const n=[];let i=0;for(const s of e.childNodes)if(s.nodeType===8){const c=s.textContent.trim();c===`HEAD_${t}_END`?(i-=1,n.push(s)):c===`HEAD_${t}_START`&&(i+=1,n.push(s))}else i>0&&n.push(s);return n}class bt{constructor(e=!1){this.is_svg=!1,this.is_svg=e,this.e=this.n=null}c(e){this.h(e)}m(e,n,i=null){this.e||(this.is_svg?this.e=Z(n.nodeName):this.e=Y(n.nodeType===11?"TEMPLATE":n.nodeName),this.t=n.tagName!=="TEMPLATE"?n:n.content,this.c(e)),this.i(i)}h(e){this.e.innerHTML=e,this.n=Array.from(this.e.nodeName==="TEMPLATE"?this.e.content.childNodes:this.e.childNodes)}i(e){for(let n=0;n<this.n.length;n+=1)pt(this.t,this.n[n],e)}p(e){this.d(),this.h(e),this.i(this.a)}d(){this.n.forEach(S)}}class K extends bt{constructor(e,n=!1){super(n),this.e=this.n=null,this.l=e}c(e){this.l?this.n=this.l:super.c(e)}i(e){for(let n=0;n<this.n.length;n+=1)yt(this.t,this.n[n],e)}}function ee(t,e){return new t(e)}let T;function E(t){T=t}function C(){if(!T)throw new Error("Function called outside component initialization");return T}function ne(t){C().$$.on_mount.push(t)}function ie(t){C().$$.after_update.push(t)}function se(t,e){return C().$$.context.set(t,e),e}function re(t){return C().$$.context.get(t)}const w=[],Q=[];let b=[];const B=[],it=Promise.resolve();let O=!1;function st(){O||(O=!0,it.then(rt))}function oe(){return st(),it}function W(t){b.push(t)}function ce(t){B.push(t)}const D=new Set;let x=0;function rt(){if(x!==0)return;const t=T;do{try{for(;x<w.length;){const e=w[x];x++,E(e),$t(e.$$)}}catch(e){throw w.length=0,x=0,e}for(E(null),w.length=0,x=0;Q.length;)Q.pop()();for(let e=0;e<b.length;e+=1){const n=b[e];D.has(n)||(D.add(n),n())}b.length=0}while(w.length);for(;B.length;)B.pop()();O=!1,D.clear(),E(t)}function $t(t){if(t.fragment!==null){t.update(),$(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(W)}}function Et(t){const e=[],n=[];b.forEach(i=>t.indexOf(i)===-1?e.push(i):n.push(i)),n.forEach(i=>i()),b=e}const A=new Set;let g;function le(){g={r:0,c:[],p:g}}function ae(){g.r||$(g.c),g=g.p}function ot(t,e){t&&t.i&&(A.delete(t),t.i(e))}function ue(t,e,n,i){if(t&&t.o){if(A.has(t))return;A.add(t),g.c.push(()=>{A.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}else i&&i()}function fe(t,e){t.d(1),e.delete(t.key)}function de(t,e,n,i,s,c,r,l,o,a,f,_){let d=t.length,m=c.length,h=d;const H={};for(;h--;)H[t[h].key]=h;const v=[],j=new Map,q=new Map,R=[];for(h=m;h--;){const u=_(s,c,h),p=n(u);let y=r.get(p);y?i&&R.push(()=>y.p(u,e)):(y=a(p,u),y.c()),j.set(p,v[h]=y),p in H&&q.set(p,Math.abs(h-H[p]))}const z=new Set,F=new Set;function P(u){ot(u,1),u.m(l,f),r.set(u.key,u),f=u.first,m--}for(;d&&m;){const u=v[m-1],p=t[d-1],y=u.key,N=p.key;u===p?(f=u.first,d--,m--):j.has(N)?!r.has(y)||z.has(y)?P(u):F.has(N)?d--:q.get(y)>q.get(N)?(F.add(y),P(u)):(z.add(N),d--):(o(p,r),d--)}for(;d--;){const u=t[d];j.has(u.key)||o(u,r)}for(;m;)P(v[m-1]);return $(R),v}function _e(t,e){const n={},i={},s={$$scope:1};let c=t.length;for(;c--;){const r=t[c],l=e[c];if(l){for(const o in r)o in l||(i[o]=1);for(const o in l)s[o]||(n[o]=l[o],s[o]=1);t[c]=l}else for(const o in r)s[o]=1}for(const r in i)r in n||(n[r]=void 0);return n}const Tt=["allowfullscreen","allowpaymentrequest","async","autofocus","autoplay","checked","controls","default","defer","disabled","formnovalidate","hidden","inert","ismap","loop","multiple","muted","nomodule","novalidate","open","playsinline","readonly","required","reversed","selected"];[...Tt];function he(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function me(t){t&&t.c()}function pe(t,e){t&&t.l(e)}function vt(t,e,n,i){const{fragment:s,after_update:c}=t.$$;s&&s.m(e,n),i||W(()=>{const r=t.$$.on_mount.map(U).filter(V);t.$$.on_destroy?t.$$.on_destroy.push(...r):$(r),t.$$.on_mount=[]}),c.forEach(W)}function Nt(t,e){const n=t.$$;n.fragment!==null&&(Et(n.after_update),$(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function kt(t,e){t.$$.dirty[0]===-1&&(w.push(t),st(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function ye(t,e,n,i,s,c,r,l=[-1]){const o=T;E(t);const a=t.$$={fragment:null,ctx:[],props:c,update:M,not_equal:s,bound:I(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(o?o.$$.context:[])),callbacks:I(),dirty:l,skip_bound:!1,root:e.target||o.$$.root};r&&r(a.root);let f=!1;if(a.ctx=n?n(t,e.props||{},(_,d,...m)=>{const h=m.length?m[0]:d;return a.ctx&&s(a.ctx[_],a.ctx[_]=h)&&(!a.skip_bound&&a.bound[_]&&a.bound[_](h),f&&kt(t,_)),d}):[],a.update(),f=!0,$(a.before_update),a.fragment=i?i(a.ctx):!1,e.target){if(e.hydrate){ft();const _=xt(e.target);a.fragment&&a.fragment.l(_),_.forEach(S)}else a.fragment&&a.fragment.c();e.intro&&ot(t.$$.fragment),vt(t,e.target,e.anchor,e.customElement),dt(),rt()}E(o)}class ge{$destroy(){Nt(this,1),this.$destroy=M}$on(e,n){if(!V(n))return M;const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!lt(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}export{Zt as $,vt as A,Nt as B,te as C,Kt as D,mt as E,M as F,ut as G,K as H,Lt as I,Ht as J,jt as K,Ct as L,St as M,ct as N,Z as O,It as P,Rt as Q,_e as R,ge as S,Bt as T,Pt as U,qt as V,Mt as W,Gt as X,V as Y,$ as Z,Dt as _,Ot as a,de as a0,Yt as a1,zt as a2,fe as a3,W as a4,Xt as a5,Ut as a6,he as a7,ce as a8,se as a9,re as aa,yt as b,Jt as c,ue as d,Wt as e,ae as f,ot as g,S as h,ye as i,ie as j,Y as k,Ft as l,xt as m,gt as n,ne as o,Vt as p,G as q,wt as r,At as s,oe as t,Qt as u,le as v,Q as w,ee as x,me as y,pe as z};
