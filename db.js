/* ============================================================
   DB — client-side data layer over localStorage.
   This is the single seam to swap for a real backend (Supabase,
   Postgres, etc.): keep the method signatures, change the bodies.
   ============================================================ */
(function (global) {
  const KEY = "agentos_db_v1";

  function seed() {
    return {
      listings: global.SEED_LISTINGS || [],
      agents: global.SEED_AGENTS || [],
      users: [
        // Seeded demo account so login works out of the box.
        { id: "u_demo", name: "Demo Agent", email: "demo@agentos.demo", password: "demo1234", role: "agent", avatar: "" }
      ],
      favorites: {},     // userId -> [listingId]
      savedSearches: {}, // userId -> [{q, ts}]
      session: null      // userId of logged-in user
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const s = seed();
        localStorage.setItem(KEY, JSON.stringify(s));
        return s;
      }
      const data = JSON.parse(raw);
      // Always refresh listings/agents from seed so content stays current,
      // while preserving user-generated state.
      data.listings = global.SEED_LISTINGS || data.listings;
      data.agents = global.SEED_AGENTS || data.agents;
      return data;
    } catch (e) {
      const s = seed();
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {}
      return s;
    }
  }

  function save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (_) {}
  }

  const DB = {
    /* ---------- Listings ---------- */
    listings(filter) {
      let rows = load().listings.slice();
      if (!filter) return rows;
      const f = filter;
      if (f.q) {
        const q = f.q.toLowerCase();
        rows = rows.filter(l =>
          (l.address + " " + l.city + " " + l.state + " " + l.zip + " " + l.type).toLowerCase().includes(q));
      }
      if (f.city && f.city !== "all") rows = rows.filter(l => l.city === f.city);
      if (f.type && f.type !== "all") rows = rows.filter(l => l.type === f.type);
      if (f.minPrice) rows = rows.filter(l => l.price >= +f.minPrice);
      if (f.maxPrice) rows = rows.filter(l => l.price <= +f.maxPrice);
      if (f.beds && f.beds !== "any") rows = rows.filter(l => l.beds >= +f.beds);
      if (f.status && f.status !== "all") rows = rows.filter(l => l.status === f.status);
      if (f.sort === "low") rows.sort((a, b) => a.price - b.price);
      else if (f.sort === "high") rows.sort((a, b) => b.price - a.price);
      else if (f.sort === "sqft") rows.sort((a, b) => b.sqft - a.sqft);
      return rows;
    },
    listing(id) { return load().listings.find(l => l.id === id) || null; },
    cities() { return Array.from(new Set(load().listings.map(l => l.city))).sort(); },
    types() { return Array.from(new Set(load().listings.map(l => l.type))).sort(); },

    /* ---------- Agents ---------- */
    agents(q) {
      let rows = load().agents.slice();
      if (q) {
        const s = q.toLowerCase();
        rows = rows.filter(a => (a.name + " " + a.market + " " + a.title).toLowerCase().includes(s));
      }
      return rows;
    },
    agent(id) { return load().agents.find(a => a.id === id) || null; },
    agentListings(agentId) { return load().listings.filter(l => l.agent === agentId); },

    /* ---------- Auth ---------- */
    currentUser() {
      const d = load();
      if (!d.session) return null;
      return d.users.find(u => u.id === d.session) || null;
    },
    login(email, password) {
      const d = load();
      const u = d.users.find(x => x.email.toLowerCase() === String(email).toLowerCase());
      if (!u || u.password !== password) return { ok: false, error: "Incorrect email or password." };
      d.session = u.id; save(d);
      return { ok: true, user: u };
    },
    signup({ name, email, password }) {
      const d = load();
      if (d.users.some(x => x.email.toLowerCase() === String(email).toLowerCase()))
        return { ok: false, error: "An account with that email already exists." };
      const u = { id: "u_" + Date.now(), name, email, password, role: "agent", avatar: "" };
      d.users.push(u); d.session = u.id; save(d);
      return { ok: true, user: u };
    },
    logout() { const d = load(); d.session = null; save(d); },

    /* ---------- Favorites ---------- */
    favorites(userId) { return (load().favorites[userId] || []).slice(); },
    isFavorite(userId, listingId) { return (load().favorites[userId] || []).includes(listingId); },
    toggleFavorite(userId, listingId) {
      const d = load();
      const arr = d.favorites[userId] || [];
      const i = arr.indexOf(listingId);
      if (i >= 0) arr.splice(i, 1); else arr.push(listingId);
      d.favorites[userId] = arr; save(d);
      return arr.includes(listingId);
    },

    /* ---------- Saved searches ---------- */
    saveSearch(userId, q) {
      const d = load();
      const arr = d.savedSearches[userId] || [];
      arr.unshift({ q, ts: Date.now() });
      d.savedSearches[userId] = arr.slice(0, 12); save(d);
    },
    savedSearches(userId) { return (load().savedSearches[userId] || []).slice(); },

    reset() { localStorage.removeItem(KEY); }
  };

  global.DB = DB;
})(window);
