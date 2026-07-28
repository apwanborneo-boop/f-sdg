/* =====================================================================
   F-SDG.ORG — shared app logic
   Configure the three values below to make the actions "live":
     - formEndpoint : a Formspree/Jotform/webhook URL that receives POSTs.
                      Leave "" to fall back to an email (mailto) draft.
     - donationUrl  : a PayPal.me / Stripe / bank link for donations.
                      Leave "" to collect donation interest by form instead.
     - contactEmail : where mailto fallbacks are sent.
   ===================================================================== */
window.FSDG_CONFIG = {
  formEndpoint: "",                 // optional custom endpoint (unused when Jotform IDs below are set)
  donationUrl:  "",                 // optional direct PayPal/Stripe link (overrides the donate form if set)
  contactEmail: "info@f-sdg.org",
  // Jotform forms — each action opens its form, pre-tagged with the SDG/project context.
  jotform: {
    donate:  "262080488114051",
    join:    "262081329022044",
    enquiry: "262080606433047",
    submit:  "262080960645055"
  }
};

(function(){
  "use strict";
  var C = window.FSDG_CONFIG;

  /* ---------- utilities ---------- */
  function qs(name){ return new URLSearchParams(location.search).get(name); }
  function esc(s){ return String(s==null?"":s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];}); }
  window.FSDG = { qs:qs, esc:esc };

  /* ---------- nav scroll state ---------- */
  document.addEventListener("DOMContentLoaded", function(){
    var nav = document.querySelector("header.nav");
    if(nav){
      var onScroll=function(){ nav.classList.toggle("scrolled", window.scrollY>32); };
      onScroll(); window.addEventListener("scroll",onScroll,{passive:true});
    }
    // auto-render based on data-render attribute on <body>
    var mode = document.body.getAttribute("data-render");
    if(mode==="sdg-grid") renderGrid(document.getElementById("sdg-grid"));
    if(mode==="sdg-page") renderSDGPage();
    if(mode==="project-page") renderProjectPage();
  });

  /* ---------- icon helper: real SDG icon, else coloured numbered tile ---------- */
  function iconMarkup(m, cls){
    var ic = window.SDG_ICONS && window.SDG_ICONS[m.n];
    if(ic){ return '<img class="'+cls+' sdg-ico" src="'+ic+'" alt="SDG '+m.n+' '+esc(m.name)+'" loading="lazy">'; }
    return '<span class="'+cls+'" style="background:'+m.color+'">'+m.n+'</span>';
  }
  window.FSDG.iconMarkup = iconMarkup;

  /* ---------- render: 17-goal grid ---------- */
  function renderGrid(el){
    if(!el) return;
    el.innerHTML = (window.SDG_META||[]).map(function(m){
      var count = window.SDG.forSDG(m.n).length;
      var cnt = count>0 ? (count+" project"+(count>1?"s":"")) : "Open for projects";
      return '<a class="sdg-tile" href="sdg.html?n='+m.n+'">'+
        iconMarkup(m, "sdg-num")+
        '<span class="sdg-tx"><b>'+esc(m.name)+'</b><span class="zh">'+esc(m.zh)+'</span>'+
        '<span class="cnt">'+cnt+' &rarr;</span></span></a>';
    }).join("");
  }

  /* ---------- render: one SDG page ---------- */
  function renderSDGPage(){
    var n = Number(qs("n"))||1;
    var m = window.SDG.meta(n);
    if(!m){ document.getElementById("sdg-root").innerHTML='<div class="wrap band"><p>Goal not found.</p></div>'; return; }
    document.title = "SDG "+m.n+" "+m.name+" · F-SDG Foundation";

    var hero = document.getElementById("sdg-hero");
    hero.style.background = "linear-gradient(140deg,"+m.color+" 0%,"+shade(m.color,-18)+" 100%)";
    hero.innerHTML =
      '<div class="wrap">'+
        '<div class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>'+
        '<a href="sdgs.html">The 17 Goals</a><span class="sep">/</span>SDG '+m.n+'</div>'+
        (window.SDG_ICONS&&window.SDG_ICONS[m.n]
          ? '<img class="badge badge-ico" src="'+window.SDG_ICONS[m.n]+'" alt="SDG '+m.n+'">'
          : '<div class="badge">'+m.n+'</div>')+
        '<h1>'+esc(m.name)+'</h1>'+
        '<div class="zh">'+esc(m.zh)+'</div>'+
        '<p class="tag">'+esc(m.tag)+'</p>'+
      '</div>';

    var projects = window.SDG.forSDG(n);
    var list = document.getElementById("sdg-projects");
    if(projects.length===0){
      list.innerHTML = '<div class="empty"><p>No projects listed for this goal yet.</p>'+
        '<div class="actions" style="justify-content:center;margin-top:18px">'+
        '<button class="btn btn-primary" onclick="FSDG.action(\'submit\',{sdg:'+n+'})">Propose a project &rarr;</button></div></div>';
    } else {
      list.innerHTML = '<div class="proj-grid">'+projects.map(function(p){
        return '<div class="proj-card">'+
          '<div class="loc">'+esc(p.location||"")+'</div>'+
          '<h3>'+esc(p.title)+'</h3>'+
          '<p>'+esc(p.description||"")+'</p>'+
          '<div class="row">'+
            (p.kpi?'<span class="chip">KPI tracked</span>':'')+
            (Number(p.revenue)>0?'<span class="chip">$'+Number(p.revenue).toLocaleString()+'</span>':'')+
            (p.welcome? '<span class="chip">Welcoming members</span>':'<span class="chip no">Members: by invitation</span>')+
          '</div>'+
          '<a class="go" href="project.html?id='+encodeURIComponent(p.id)+'">View project &amp; take action &rarr;</a>'+
        '</div>';
      }).join("")+'</div>';
    }

    // SDG-level actions
    document.getElementById("sdg-actions").innerHTML = actionBar({sdg:n});
    document.getElementById("sdg-accent").style.setProperty("--accent", m.color);
  }

  /* ---------- render: one project page ---------- */
  function renderProjectPage(){
    var id = qs("id");
    var p = window.SDG.get(id);
    if(!p){ document.getElementById("project-root").innerHTML='<div class="wrap pagetop band"><p>Project not found. <a href="sdgs.html">Browse all goals &rarr;</a></p></div>'; return; }
    var m = window.SDG.meta(p.sdg);
    document.title = p.title+" · F-SDG Foundation";

    var hero = document.getElementById("project-hero");
    hero.style.background = "linear-gradient(140deg,"+m.color+" 0%,"+shade(m.color,-18)+" 100%)";
    hero.innerHTML =
      '<div class="wrap">'+
        '<div class="crumbs"><a href="index.html">Home</a><span class="sep">/</span>'+
        '<a href="sdgs.html">The 17 Goals</a><span class="sep">/</span>'+
        '<a href="sdg.html?n='+m.n+'">SDG '+m.n+'</a><span class="sep">/</span>Project</div>'+
        (window.SDG_ICONS&&window.SDG_ICONS[m.n]
          ? '<img class="badge badge-ico" src="'+window.SDG_ICONS[m.n]+'" alt="SDG '+m.n+'">'
          : '<div class="badge">'+m.n+'</div>')+
        '<h1>'+esc(p.title)+'</h1>'+
        '<div class="tag">'+esc(p.location||"")+' &middot; '+esc(m.name)+'</div>'+
      '</div>';

    document.getElementById("project-body").innerHTML =
      '<h2>About this project</h2><p>'+esc(p.description||"")+'</p>'+
      (p.kpi? '<h2>Key performance indicators</h2><p>'+esc(p.kpi)+'</p>':'')+
      (p.donationReturn? '<h2>What donors receive</h2><p>'+esc(p.donationReturn)+'</p>':'')+
      '<div class="actions">'+actionBar({sdg:p.sdg, project:p.title, id:p.id})+'</div>';

    document.getElementById("project-facts").innerHTML =
      '<div class="f"><div class="l">Goal</div><div class="v">SDG '+m.n+' — '+esc(m.name)+'</div></div>'+
      '<div class="f"><div class="l">Location</div><div class="v">'+esc(p.location||"—")+'</div></div>'+
      (Number(p.revenue)>0?'<div class="f"><div class="l">Revenue target</div><div class="v rev">$'+Number(p.revenue).toLocaleString()+'</div></div>':'')+
      '<div class="f"><div class="l">Open to new members</div><div class="v">'+(p.welcome?"Yes — applications welcome":"By invitation")+'</div></div>';
  }

  /* ---------- action bar markup ---------- */
  function actionBar(ctx){
    var c = JSON.stringify(ctx).replace(/"/g,"&quot;");
    return '<button class="btn btn-primary btn-sm" onclick=\'FSDG.action("donate",'+c+')\'>Donate</button>'+
           '<button class="btn btn-gold btn-sm" onclick=\'FSDG.action("join",'+c+')\'>Apply to join</button>'+
           '<button class="btn btn-ghost btn-sm" onclick=\'FSDG.action("enquiry",'+c+')\'>Enquire</button>'+
           '<button class="btn btn-ghost btn-sm" onclick=\'FSDG.action("submit",'+c+')\'>Submit a project</button>';
  }

  /* ---------- action modal ---------- */
  var TYPES = {
    donate:  { title:"Make a donation",      sub:"Support this work. Your details reach the Foundation team.", cta:"Continue" },
    join:    { title:"Apply to join",        sub:"Tell us how you'd like to contribute to this project.",      cta:"Send application" },
    enquiry: { title:"Enquire",              sub:"Ask us anything about this project.",                          cta:"Send enquiry" },
    submit:  { title:"Submit a new project", sub:"Propose a project for the Foundation to consider.",            cta:"Send proposal" }
  };

  function action(type, ctx){
    ctx = ctx||{};
    // Donation: a direct payment link always wins if configured.
    if(type==="donate" && C.donationUrl){ window.open(C.donationUrl, "_blank"); return; }

    // Preferred path: open the embedded form page on f-sdg.org, pre-tagged with context.
    var jf = C.jotform && C.jotform[type];
    if(jf){
      var q = "?type=" + encodeURIComponent(type);
      if(ctx.sdg){ q += "&sdg=" + encodeURIComponent(ctx.sdg); }
      if(ctx.project){ q += "&project=" + encodeURIComponent(ctx.project); }
      window.location.href = "form.html" + q;
      return;
    }

    var t = TYPES[type] || TYPES.enquiry;
    var ctxLine = ctx.project ? ("Project: "+ctx.project) : (ctx.sdg ? ("SDG "+ctx.sdg) : "General");
    var extra = "";
    if(type==="submit"){
      extra =
        '<label class="fl">Which SDG?</label>'+sdgSelect(ctx.sdg)+
        '<label class="fl">Project title</label><input class="inp" name="title" required>'+
        '<label class="fl">Location</label><input class="inp" name="location" placeholder="Country / region">'+
        '<label class="fl">Description</label><textarea class="inp" name="description" required></textarea>'+
        '<label class="fl">Key KPI(s)</label><input class="inp" name="kpi" placeholder="What you will measure">';
    }
    if(type==="donate"){
      extra = '<label class="fl">Amount (USD)</label><input class="inp" name="amount" type="number" min="1" placeholder="100">';
    }

    var html =
      '<div class="modal" role="dialog" aria-modal="true">'+
        '<button class="modal-close" onclick="FSDG.closeModal()" aria-label="Close">&times;</button>'+
        '<h3>'+t.title+'</h3>'+
        '<div class="sub">'+t.sub+'<br><b style="color:var(--text)">'+esc(ctxLine)+'</b></div>'+
        '<form id="fsdg-form">'+
          '<input type="hidden" name="_action" value="'+type+'">'+
          '<input type="hidden" name="_context" value="'+esc(ctxLine)+'">'+
          '<label class="fl">Your name</label><input class="inp" name="name" required>'+
          '<label class="fl">Email</label><input class="inp" name="email" type="email" required>'+
          extra+
          (type==="join"?'<label class="fl">How would you like to contribute?</label><textarea class="inp" name="message"></textarea>':'')+
          (type==="enquiry"?'<label class="fl">Your enquiry</label><textarea class="inp" name="message" required></textarea>':'')+
          '<div class="form-actions">'+
            '<button type="submit" class="btn btn-primary btn-sm">'+t.cta+'</button>'+
            '<button type="button" class="btn btn-ghost btn-sm" onclick="FSDG.closeModal()">Cancel</button>'+
          '</div>'+
          '<div class="note" id="fsdg-note"></div>'+
        '</form>'+
      '</div>';

    var back = ensureBack();
    back.innerHTML = html;
    back.classList.add("open");
    var form = document.getElementById("fsdg-form");
    form.addEventListener("submit", function(e){ e.preventDefault(); handleSubmit(type, ctx, form); });
  }

  function handleSubmit(type, ctx, form){
    var data = {}; new FormData(form).forEach(function(v,k){ data[k]=v; });
    var note = document.getElementById("fsdg-note");

    // "submit a project" adds to the local catalog too (instant preview), and also notifies.
    if(type==="submit"){
      window.SDG.addLocal({
        sdg:Number(data.sdg||ctx.sdg||1), title:data.title, location:data.location||"",
        description:data.description||"", kpi:data.kpi||"", revenue:0,
        donationReturn:"", welcome:true
      });
    }

    if(C.formEndpoint){
      fetch(C.formEndpoint,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify(data)})
        .then(function(r){ done(true); })
        .catch(function(){ done(false); });
    } else {
      // mailto fallback
      var subject = encodeURIComponent("["+type.toUpperCase()+"] "+(data.title||data._context||"F-SDG"));
      var lines = Object.keys(data).filter(function(k){return k[0]!=="_";}).map(function(k){return k+": "+data[k];});
      var body = encodeURIComponent(lines.join("\n"));
      window.location.href = "mailto:"+C.contactEmail+"?subject="+subject+"&body="+body;
      done(true, true);
    }

    function done(ok, mail){
      note.innerHTML = '<div class="ok-msg">'+
        (type==="submit"?"Thank you — your project has been recorded and sent for review.":"Thank you — your message is on its way.")+
        (mail?" (Your email app should now open.)":"")+
        '</div>';
      form.querySelector('button[type=submit]').disabled = true;
      if(type==="submit"){ setTimeout(function(){ location.reload(); }, 1400); }
    }
  }

  // Build a context query string for Jotform prefill.
  // Passes the goal/project so each submission is tagged with what it refers to.
  function buildJotformQuery(ctx){
    var parts = [];
    if(ctx.sdg){
      var m = window.SDG.meta(ctx.sdg);
      parts.push("sdg=" + encodeURIComponent(m ? ("SDG "+m.n+" — "+m.name) : ("SDG "+ctx.sdg)));
    }
    if(ctx.project){ parts.push("project=" + encodeURIComponent(ctx.project)); }
    return parts.length ? ("?" + parts.join("&")) : "";
  }

  function sdgSelect(sel){
    return '<select class="inp" name="sdg" required>'+ (window.SDG_META||[]).map(function(m){
      return '<option value="'+m.n+'"'+(Number(sel)===m.n?" selected":"")+'>SDG '+m.n+' — '+esc(m.name)+'</option>';
    }).join("")+'</select>';
  }
  window.FSDG.sdgSelect = sdgSelect;

  function ensureBack(){
    var b = document.getElementById("fsdg-modal-back");
    if(!b){ b=document.createElement("div"); b.id="fsdg-modal-back"; b.className="modal-back";
      b.addEventListener("click",function(e){ if(e.target===b) closeModal(); });
      document.body.appendChild(b); }
    return b;
  }
  function closeModal(){ var b=document.getElementById("fsdg-modal-back"); if(b){ b.classList.remove("open"); b.innerHTML=""; } }

  /* ---------- tiny colour shade helper ---------- */
  function shade(hex,pct){
    var n=parseInt(hex.replace("#",""),16), r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    var f=function(x){ return Math.max(0,Math.min(255,Math.round(x+(x*pct/100)))); };
    return "#"+((1<<24)+(f(r)<<16)+(f(g)<<8)+f(b)).toString(16).slice(1);
  }

  window.FSDG.action = action;
  window.FSDG.closeModal = closeModal;
  window.FSDG.renderGrid = renderGrid;
})();
