import{q as o,aq as p,ar as u,as as l,at as c,au as f,av as d,aw as m,ax as h,ay as A,az as g,$ as v,g as P,u as _,v as w,D as y,aA as C,aB as R,aC as E,aD as D}from"./chunks/framework.BaIhpFQU.js";import{R as T}from"./chunks/theme.DaqnFYIa.js";function i(e){if(e.extends){const a=i(e.extends);return{...a,...e,async enhanceApp(t){a.enhanceApp&&await a.enhanceApp(t),e.enhanceApp&&await e.enhanceApp(t)}}}return e}const s=i(T),b=P({name:"VitePressApp",setup(){const{site:e,lang:a,dir:t}=_();return w(()=>{y(()=>{document.documentElement.lang=a.value,document.documentElement.dir=t.value})}),e.value.router.prefetchLinks&&C(),R(),E(),s.setup&&s.setup(),()=>D(s.Layout)}});async function S(){globalThis.__VITEPRESS__=!0;const e=L(),a=x();a.provide(u,e);const t=l(e.route);return a.provide(c,t),a.component("Content",f),a.component("ClientOnly",d),Object.defineProperties(a.config.globalProperties,{$frontmatter:{get(){return t.frontmatter.value}},$params:{get(){return t.page.value.params}}}),s.enhanceApp&&await s.enhanceApp({app:a,router:e,siteData:m}),{app:a,router:e,data:t}}function x(){return h(b)}function L(){let e=o,a;return A(t=>{let n=g(t),r=null;return n&&(e&&(a=n),(e||a===n)&&(n=n.replace(/\.js$/,".lean.js")),r=v(()=>import(n),[])),o&&(e=!1),r},s.NotFound)}o&&S().then(({app:e,router:a,data:t})=>{a.go().then(()=>{p(a.route,t.site),e.mount("#app")})});export{S as createApp};
