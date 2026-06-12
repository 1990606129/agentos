/* ============================================================
   APP — shared UI: nav, footer, formatting, card rendering.
   Injects a consistent header/footer on every page and exposes
   helpers used across the site.
   ============================================================ */
(function (global) {
  const App = {};

  /* ---------- Formatting ---------- */
  App.fmtPrice = n => "$" + Number(n).toLocaleString("en-US");
  App.fmtPriceShort = n => {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(n % 1e6 === 0 ? 0 : 2).replace(/\.0+$/, "") + "M";
    if (n >= 1e3) return "$" + Math.round(n / 1e3) + "K";
    return "$" + n;
  };
  App.initials = name => name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
  App.qs = k => new URLSearchParams(location.search).get(k);

  const STATUS_BADGE = {
    new: '<span class="badge new">New</span>',
    sold: '<span class="badge sold">Sold</span>',
    open: l => `<span class="badge">Open ${l.openHouse || ""}</span>`,
    active: ""
  };

  /* ---------- Listing card ---------- */
  App.listingCard = (l, opts = {}) => {
    let badge = STATUS_BADGE[l.status] || "";
    if (typeof badge === "function") badge = badge(l);
    const fav = opts.favActive ? "active" : "";
    const favBtn = opts.showFav
      ? `<button class="fav-btn ${fav}" data-fav="${l.id}" aria-label="Save home" onclick="event.preventDefault();event.stopPropagation();App.onFav&&App.onFav('${l.id}',this)">♥</button>`
      : "";
    return `<a class="card" href="listing.html?id=${l.id}">
      <div class="card-img">${badge}${favBtn}
        <img loading="lazy" src="${l.photos[0]}" alt="${l.address}, ${l.city}">
      </div>
      <div class="card-body">
        <div class="price">${App.fmtPrice(l.price)}</div>
        <div class="specs"><span>${l.beds} bd</span><span>${l.baths} ba</span><span>${l.sqft.toLocaleString()} sqft</span><span>${l.type}</span></div>
        <div class="addr">${l.address}, ${l.city}, ${l.state}</div>
      </div>
    </a>`;
  };

  /* ---------- Nav ---------- */
  App.buildNav = (active) => {
    const mount = document.getElementById("site-nav");
    if (!mount) return;
    const user = global.DB ? DB.currentUser() : null;
    const links = [
      ["listings.html", "Buy", "buy"],
      ["sell.html", "Sell", "sell"],
      ["agents.html", "Find an Agent", "agents"],
      ["news.html", "News", "news"],
      ["join.html", "Join eXp", "join"]
    ];
    const navLinks = links.map(([href, label, id]) =>
      `<a href="${href}" class="${active === id ? "active" : ""}">${label}</a>`).join("");

    const right = user
      ? `<a href="tech.html" class="agnt-pill"><span class="dot"></span>Agent OS</a>
         <button class="avatar-btn" onclick="location.href='dashboard.html'">
           ${user.avatar ? `<img src="${user.avatar}" alt="">` : `<span class="ph">${App.initials(user.name)}</span>`}
           <b>${user.name.split(" ")[0]}</b>
         </button>`
      : `<a href="tech.html" class="agnt-pill"><span class="dot"></span>Agent OS</a>
         <a href="login.html" class="login">Log in</a>
         <a href="signup.html" class="btn btn-navy">Get started</a>`;

    mount.innerHTML = `
      <div style="background:#0C2340;color:#9FC2FF;font-size:12.5px;font-weight:600;text-align:center;padding:7px 16px;letter-spacing:.02em">CONCEPT DEMO — internal eXp marketing prototype, not the official eXp Realty website</div>
      <header class="nav">
        <div class="nav-inner">
          <a href="index.html" class="logo">e<span>X</span>p<span class="sub">REALTY</span></a>
          <nav class="nav-links" aria-label="Primary">${navLinks}</nav>
          <div class="nav-right">${right}
            <button class="menu-btn" aria-label="Menu" onclick="App.toggleMenu()">☰</button>
          </div>
        </div>
        <div class="mobile-menu" id="mobile-menu">
          ${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join("")}
          ${user ? `<a href="dashboard.html">Dashboard</a><a href="#" onclick="DB.logout();location.reload();return false;">Log out</a>`
                 : `<a href="login.html">Log in</a><a href="signup.html">Get started</a>`}
        </div>
      </header>`;
  };
  App.toggleMenu = () => document.getElementById("mobile-menu").classList.toggle("open");

  /* ---------- Footer ---------- */
  App.buildFooter = () => {
    const mount = document.getElementById("site-footer");
    if (!mount) return;
    const ig = '<svg viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.36 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .36-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.36-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.36 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.8-11.2a1.54 1.54 0 1 1-1.54-1.54 1.54 1.54 0 0 1 1.54 1.54z"/></svg>';
    const x = '<svg viewBox="0 0 24 24"><path d="M18.2 2.2h3.3l-7.2 8.2 8.5 11.4h-6.7l-5.2-6.8-6 6.8H1.6l7.7-8.8L1 2.2h6.8l4.7 6.2zm-1.2 17.6h1.8L7.1 4.1H5.2z"/></svg>';
    const li = '<svg viewBox="0 0 24 24"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.3c0-1.3 0-2.9-1.8-2.9s-2 1.4-2 2.8V21H9z"/></svg>';
    const yt = '<svg viewBox="0 0 24 24"><path d="M23 7.5a3 3 0 0 0-2.1-2.1C19 4.9 12 4.9 12 4.9s-7 0-8.9.5A3 3 0 0 0 1 7.5 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.5a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.5 31 31 0 0 0-.5-4.5zM9.8 15.3V8.7l5.7 3.3z"/></svg>';
    const fb = '<svg viewBox="0 0 24 24"><path d="M13.5 21v-8.3h2.8l.4-3.2h-3.2V7.4c0-.9.3-1.6 1.7-1.6h1.6V3c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.5H7.6v3.2h2.8V21z"/></svg>';
    mount.innerHTML = `
      <footer>
        <div class="wrap-wide">
          <div class="foot-grid">
            <div>
              <div class="logo">e<span>X</span>p<span class="sub">REALTY</span></div>
              <p>Where the pros go to grow. The world's largest independent brokerage — 80,000+ agents, 29 markets, one AI-powered platform.</p>
              <div class="socials">
                <a href="https://www.instagram.com/exprealty" target="_blank" rel="noopener" aria-label="Instagram">${ig}</a>
                <a href="https://x.com/exprealty" target="_blank" rel="noopener" aria-label="X">${x}</a>
                <a href="https://www.facebook.com/eXpRealty/" target="_blank" rel="noopener" aria-label="Facebook">${fb}</a>
                <a href="https://www.linkedin.com/company/exp-realty" target="_blank" rel="noopener" aria-label="LinkedIn">${li}</a>
                <a href="https://www.youtube.com/@eXpRealty" target="_blank" rel="noopener" aria-label="YouTube">${yt}</a>
              </div>
            </div>
            <div><h4>Explore</h4><ul>
              <li><a href="listings.html">Buy a home</a></li>
              <li><a href="sell.html">Sell a home</a></li>
              <li><a href="agents.html">Find an agent</a></li>
              <li><a href="guides.html">Home Guides</a></li>
              <li><a href="news.html">News</a></li>
            </ul></div>
            <div><h4>Divisions</h4><ul>
              <li><a href="luxury.html">eXp Luxury</a></li>
              <li><a href="commercial.html">eXp Commercial</a></li>
              <li><a href="ranch.html">eXp Land &amp; Ranch</a></li>
              <li><a href="tech.html">AGENT OS</a></li>
            </ul></div>
            <div><h4>Agent OS</h4><ul>
              <li><a href="tech.html#myexp">MyeXp</a></li>
              <li><a href="tech.html#mira">MIRA AI</a></li>
              <li><a href="tech.html#hub">eXp HUB</a></li>
              <li><a href="tech.html#referral">Global Referral</a></li>
              <li><a href="tech.html#world">eXp World</a></li>
              <li><a href="tech.html#crm">CRM of Choice</a></li>
            </ul></div>
            <div><h4>Company</h4><ul>
              <li><a href="about.html">About</a></li>
              <li><a href="join.html">Join eXp</a></li>
              <li><a href="investors.html">Investors</a></li>
              <li><a href="about.html#careers">Careers</a></li>
              <li><a href="about.html#contact">Contact</a></li>
              <li><a href="dashboard.html">Agent login</a></li>
            </ul></div>
          </div>
          <div class="foot-bottom">
            <span>© 2026 eXp Realty — internal concept demo. Demo data, not real listings. Not the production exprealty.com site.</span>
            <span class="legal"><a href="#">Privacy</a> · <a href="#">Terms</a> · <a href="#">Accessibility</a> · Equal Housing Opportunity</span>
          </div>
        </div>
      </footer>`;
  };

  /* ---------- Page init ---------- */
  App.initChrome = (active) => { App.buildNav(active); App.buildFooter(); };

  global.App = App;
})(window);
