import{_ as d,l as u,o as l,c as a,a as t,t as n,F as r,g as c}from"./index-386df3de.js";const _={}.VITE_API_HOST||"http://localhost:8080",h=_+"/api/v1",p={data(){return{nome:null,personale:null,indirizzo:null,indirizzo1:null,indirizzo2:null,abbonamenti:[{id:1,nome:"Mensile",prezzo:10},{id:2,nome:"Trimestrale",prezzo:15},{id:3,nome:"Annuale",prezzo:20}],corsi:[{id:1,nome:"Corso 1",data:"2023-05-18",ora:"10:00"},{id:2,nome:"Corso 2",data:"2023-05-18",ora:"14:00"},{id:3,nome:"Corso 3",data:"2023-05-19",ora:"16:00"}]}},methods:{getPalestra(){fetch(h+window.location.pathname,{method:"GET",headers:{"Content-Type":"application/json","x-access-token":u.token}}).then(async e=>{let i=await Promise.resolve(e.json());this.nome=i.nome,this.personale=i.personale,this.indirizzo=i.indirizzo,this.getIndirizzoP1(i.indirizzo),this.getIndirizzoP2(i.indirizzo)}).catch(e=>console.error(e))},getIndirizzoP1(e){let i="";e.via&&(i+=e.via),e.numeroCivico&&(i+=" "+e.numeroCivico),this.indirizzo1=i},getIndirizzoP2(e){let i="";e.citta&&(i+=e.citta),e.provincia&&(i+=" ("+e.provincia+")"),e.cap&&(i+=" "+e.cap),e.paese&&(i+=" "+e.paese),this.indirizzo2=i}},created(){this.getPalestra()}},z={class:"page"},m={class:"d-flex align-items-center justify-content-center flex-column",style:{height:"300px"}},f={class:"container"},g={class:"subscription-list",style:{width:"400px, margin-right: 3em"}},v=t("h2",null,"ABBONAMENTI ",-1),y={class:"ml-2"},P=t("a",{href:"#",class:"btn btn-secondary btn-lg active",role:"button","aria-pressed":"true"},"Acquista",-1),b={class:"course-list",style:{"margin-left":"3em"}},x=t("h2",null,"CORSI",-1),I={class:"ml-2"},C=t("a",{href:"#",class:"btn btn-secondary btn-lg active",role:"button","aria-pressed":"true"},"Prenota",-1);function T(e,i,k,A,o,B){return l(),a("div",z,[t("div",m,[t("h1",null,n(o.nome),1),t("h2",null,n(o.indirizzo1),1),t("h3",null,n(o.indirizzo2),1)]),t("div",f,[t("div",g,[v,t("ul",null,[(l(!0),a(r,null,c(o.abbonamenti,s=>(l(),a("li",{key:s.id,class:"d-flex justify-content-evenly"},[t("label",y,n(s.nome),1),t("label",null,n(s.prezzo),1),P]))),128))])]),t("div",b,[x,t("ul",null,[(l(!0),a(r,null,c(o.corsi,s=>(l(),a("li",{key:s.id,class:"d-flex"},[t("span",I,n(s.nome),1),t("span",null,n(s.data),1),t("span",null,n(s.ora),1),C]))),128))])])])])}const w=d(p,[["render",T]]);export{w as default};
