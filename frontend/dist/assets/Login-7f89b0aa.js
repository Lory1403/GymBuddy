import{_ as c,o as r,c as p,b as d,s as u,i as f,r as a,a as e,w as g,d as n,e as i,f as b}from"./index-c721f007.js";const w={},v={xmlns:"http://www.w3.org/2000/svg","xmlns:v":"https://vecta.io/nano",width:"30",height:"30",viewBox:"0 0 186.69 190.5"},x=d('<g transform="translate(1184.583 765.171)"><path clip-path="none" mask="none" d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z" fill="#4285f4"></path><path clip-path="none" mask="none" d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z" fill="#34a853"></path><path clip-path="none" mask="none" d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z" fill="#fbbc05"></path><path d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z" fill="#ea4335" clip-path="none" mask="none"></path></g>',1),y=[x];function L(o,t){return r(),p("svg",v,y)}const k=c(w,[["render",L]]);let l;const P={name:"Login",components:{GoogleLogo:k},methods:{redirect(){this.$router.push("/home")},login(){fetch(l+"/autenticazioni",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:inputEmail.value,password:inputPassword.value})}).then(async o=>{let t=await Promise.resolve(o.json());t.success&&(u(t),this.redirect())}).catch(o=>console.error(o))}},created(){l=this.$apiBaseUrl+"/api/v1",f()||this.redirect()}},$={class:"w-50 text-light position-absolute top-50 start-50 translate-middle"},z=d('<div class="mb-3 py-1"><label for="inputEmail" class="form-label">Indirizzo email</label><input type="email" class="form-control" id="inputEmail" placeholder="name@example.com"></div><div class="mb-3 py-1"><label for="inputPassword" class="form-label">Password</label><input type="password" class="form-control" id="inputPassword" placeholder="Password" autocomplete="current-password"></div>',2),N={class:"mt-3 py-2"},S={class:"rounded border bg-white py-2 px-5 shadow hover:bg-gray-100 w-100"},B={class:"items-center justify-center space-x-10"},C=e("span",{class:"p-1 flex-fill text-center items-center align-right font-semibold text-gray-200"},"Login con Google",-1),E=e("label",null,"Sei un nuovo utente? ",-1);function I(o,t,M,V,G,s){const h=a("GoogleLogo"),m=a("RouterLink");return r(),p("form",$,[z,e("button",{type:"submit",class:"mt-3 btn btn-primary py-2 px-5 w-100",onClick:t[0]||(t[0]=g((..._)=>s.login&&s.login(..._),["prevent"]))},"Login"),e("div",N,[e("button",S,[e("div",B,[n(h,{class:"p-1 flex-fill"}),C]),i(" ------ [ IN FASE DI SVILUPPO ] ------ ")])]),e("div",null,[E,n(m,{class:"w-auto nav-link d-inline-block",to:"/registration"},{default:b(()=>[i(" Registrati")]),_:1})])])}const U=c(P,[["render",I]]);export{U as default};
