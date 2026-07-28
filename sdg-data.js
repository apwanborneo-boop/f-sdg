/* =====================================================================
   F-SDG.ORG — SDG data layer
   - SDG_META: the 17 UN Global Goals (official colours)
   - SEED_PROJECTS: starter projects (edit freely)
   - Storage helpers: admin-added projects live in localStorage and are
     merged on top of the seed list. Use submit.html "Export data" to make
     additions permanent (download this file, re-upload to the repo).
   ===================================================================== */

window.SDG_META = [
  { n:1,  name:"No Poverty",                              zh:"无贫穷",            color:"#E5243B", tag:"End poverty in all its forms everywhere." },
  { n:2,  name:"Zero Hunger",                             zh:"零饥饿",            color:"#DDA63A", tag:"End hunger, achieve food security and improved nutrition." },
  { n:3,  name:"Good Health and Well-being",             zh:"良好健康与福祉",     color:"#4C9F38", tag:"Ensure healthy lives and promote well-being for all." },
  { n:4,  name:"Quality Education",                       zh:"优质教育",          color:"#C5192D", tag:"Ensure inclusive and equitable quality education." },
  { n:5,  name:"Gender Equality",                         zh:"性别平等",          color:"#FF3A21", tag:"Achieve gender equality and empower all women and girls." },
  { n:6,  name:"Clean Water and Sanitation",             zh:"清洁饮水和卫生设施", color:"#26BDE2", tag:"Ensure availability and sustainable management of water." },
  { n:7,  name:"Affordable and Clean Energy",            zh:"经济适用的清洁能源", color:"#FCC30B", tag:"Ensure access to affordable, reliable, sustainable energy." },
  { n:8,  name:"Decent Work and Economic Growth",        zh:"体面工作和经济增长", color:"#A21942", tag:"Promote sustained, inclusive economic growth and decent work." },
  { n:9,  name:"Industry, Innovation and Infrastructure",zh:"产业、创新和基础设施",color:"#FD6925", tag:"Build resilient infrastructure and foster innovation." },
  { n:10, name:"Reduced Inequalities",                    zh:"减少不平等",        color:"#DD1367", tag:"Reduce inequality within and among countries." },
  { n:11, name:"Sustainable Cities and Communities",     zh:"可持续城市和社区",   color:"#FD9D24", tag:"Make cities inclusive, safe, resilient and sustainable." },
  { n:12, name:"Responsible Consumption and Production", zh:"负责任消费和生产",   color:"#BF8B2E", tag:"Ensure sustainable consumption and production patterns." },
  { n:13, name:"Climate Action",                          zh:"气候行动",          color:"#3F7E44", tag:"Take urgent action to combat climate change and its impacts." },
  { n:14, name:"Life Below Water",                        zh:"水下生物",          color:"#0A97D9", tag:"Conserve and sustainably use the oceans, seas and marine resources." },
  { n:15, name:"Life on Land",                            zh:"陆地生物",          color:"#56C02B", tag:"Protect, restore and promote sustainable use of ecosystems." },
  { n:16, name:"Peace, Justice and Strong Institutions", zh:"和平、正义与强大机构",color:"#00689D", tag:"Promote peaceful and inclusive societies and strong institutions." },
  { n:17, name:"Partnerships for the Goals",             zh:"促进目标实现的伙伴关系",color:"#19486A", tag:"Strengthen the means of implementation and global partnership." }
];

/* Seed projects — drawn from the examples you provided.
   Descriptions are short editable drafts. Edit anytime (or via submit.html). */
window.SEED_PROJECTS = [
  // SDG 7 — Affordable & Clean Energy
  { id:"7-solar-thailand", sdg:7, title:"Solar Project — Thailand", location:"Thailand",
    description:"Community solar installations providing affordable, reliable clean energy to off-grid and under-served areas in Thailand.",
    kpi:"MWp installed; households connected; tonnes CO₂ avoided/year", revenue:0,
    donationReturn:"Named panel sponsorship, annual impact report, and site-visit invitation for major donors.", welcome:true },
  { id:"7-solar-sarawak", sdg:7, title:"Solar Project — Sarawak", location:"Sarawak, Malaysia",
    description:"Rural electrification through solar micro-grids for remote longhouse communities in Sarawak.",
    kpi:"Micro-grids deployed; villages powered; kWh generated/year", revenue:0,
    donationReturn:"Community naming rights, annual impact report, recognition on project page.", welcome:true },

  // SDG 2 — Zero Hunger
  { id:"2-zerohunger-thailand", sdg:2, title:"Zero Hunger Project — Thailand", location:"Thailand",
    description:"Food security and nutrition programme supporting smallholder farmers and vulnerable families in Thailand.",
    kpi:"Meals provided; farmers supported; food-insecure households reached", revenue:0,
    donationReturn:"Impact report and donor recognition.", welcome:true },
  { id:"2-zerohunger-indonesia", sdg:2, title:"Zero Hunger Project — Indonesia", location:"Indonesia",
    description:"Nutrition and sustainable-agriculture initiative addressing hunger in Indonesian communities.",
    kpi:"Meals provided; hectares cultivated; families reached", revenue:0,
    donationReturn:"Impact report and donor recognition.", welcome:true },
  { id:"2-zerohunger-malaysia", sdg:2, title:"Zero Hunger Project — Malaysia", location:"Malaysia",
    description:"Food-relief and urban-farming programme tackling hunger and food waste in Malaysia.",
    kpi:"Meals provided; food-banks supported; families reached", revenue:0,
    donationReturn:"Impact report and donor recognition.", welcome:true },

  // SDG 3 — Good Health & Well-being
  { id:"3-medicine-thailand", sdg:3, title:"Medicine Project — Thailand", location:"Thailand",
    description:"Access-to-medicine and primary-healthcare programme for under-served communities in Thailand.",
    kpi:"Patients treated; clinics supported; medicine units distributed", revenue:0,
    donationReturn:"Impact report and donor recognition.", welcome:true },

  // SDG 4 — Quality Education
  { id:"4-education-thailand", sdg:4, title:"Education Project — Thailand", location:"Thailand",
    description:"Scholarships, learning materials and teacher support to improve education access in Thailand.",
    kpi:"Students supported; schools reached; scholarships awarded", revenue:0,
    donationReturn:"Named scholarship, impact report, donor recognition.", welcome:true },

  // SDG 9 — Industry, Innovation & Infrastructure
  { id:"9-esg-institute", sdg:9, title:"ESG Institute — International", location:"International",
    description:"An international ESG institute building capacity, standards and research for sustainable industry and innovation.",
    kpi:"Programmes delivered; professionals trained; partner institutions", revenue:0,
    donationReturn:"Founding-partner recognition, research access, event invitations.", welcome:true },

  // SDG 11 — Sustainable Cities & Communities
  { id:"11-housing-malaysia", sdg:11, title:"Housing Development — Malaysia", location:"Malaysia",
    description:"Affordable and sustainable housing development for communities in Malaysia.",
    kpi:"Homes built; families housed; sustainability rating", revenue:0,
    donationReturn:"Recognition on project page and impact report.", welcome:true },

  // SDG 16 — Peace, Justice & Strong Institutions
  { id:"16-gainway-peace", sdg:16, title:"Gainway Peace — Bicycle Ride for Peace", location:"Malaysia",
    description:"The Gainway Peace initiative — a Bicycle Ride for Peace promoting peaceful, inclusive communities in Malaysia.",
    kpi:"Riders engaged; km ridden; communities reached", revenue:0,
    donationReturn:"Rider sponsorship, event recognition, impact report.", welcome:true }
];

/* ---------- storage + merge helpers ---------- */
window.SDG = (function () {
  var LS_KEY = "fsdg_projects_v1";

  function slug(s){ return String(s||"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"").slice(0,48); }

  function loadLocal(){
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch(e){ return []; }
  }
  function saveLocal(list){
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); return true; }
    catch(e){ return false; }
  }
  function addLocal(project){
    var list = loadLocal();
    if(!project.id){ project.id = project.sdg + "-" + slug(project.title) + "-" + Date.now().toString(36).slice(-4); }
    list.push(project);
    return saveLocal(list) ? project : null;
  }

  function all(){
    // seed first, then local additions (local can also override by id)
    var byId = {};
    (window.SEED_PROJECTS||[]).forEach(function(p){ byId[p.id] = p; });
    loadLocal().forEach(function(p){ byId[p.id] = p; });
    return Object.keys(byId).map(function(k){ return byId[k]; });
  }
  function forSDG(n){ return all().filter(function(p){ return Number(p.sdg) === Number(n); }); }
  function get(id){ return all().filter(function(p){ return p.id === id; })[0] || null; }
  function meta(n){ return (window.SDG_META||[]).filter(function(m){ return Number(m.n)===Number(n); })[0] || null; }

  // export the current local additions merged as a ready-to-commit seed file
  function exportDataFile(){
    var merged = all();
    var body =
"/* F-SDG.ORG — exported project data ("+ new Date().toISOString().slice(0,10) +")\n"+
"   Replace the SEED_PROJECTS array in sdg-data.js with the array below,\n"+
"   then re-upload sdg-data.js to the repo to publish for all visitors. */\n\n"+
"window.SEED_PROJECTS = " + JSON.stringify(merged, null, 2) + ";\n";
    var blob = new Blob([body], {type:"text/javascript"});
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url; a.download = "seed-projects.js";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 1000);
  }

  return { all:all, forSDG:forSDG, get:get, meta:meta, addLocal:addLocal, loadLocal:loadLocal, exportDataFile:exportDataFile, slug:slug };
})();
