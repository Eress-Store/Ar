/* ════════════════════════════════════════════════════
   ERESS STORE v3 — SHARED COMPONENTS
   Icons, Header, Footer, ProductCard, SearchOverlay, Cart
   ════════════════════════════════════════════════════ */

// ╔══════════════════════════════════════════════════════════════╗
// ║  EDITAR AQUÍ ▼  — Datos del footer (Ayuda + Contacto)         ║
// ║  Cambiá los textos, agregá o quitá líneas y se actualiza solo.║
// ║  Para enlaces externos poné { label: "...", href: "https://" }║
// ║  Para texto sin link poné { label: "...", text: true }        ║
// ╚══════════════════════════════════════════════════════════════╝
const FOOTER_CONFIG = {
  tagline: "Marca formoseña. Más de 170 fragancias árabes y premium curadas. Envíos dentro de la ciudad de Formosa.",
  instagram: "https://instagram.com/perfumesgaleras_",
  whatsapp: "https://wa.me/543128901741",

  boutique: [
    { label: "Catálogo Completo", to: { name: "catalog" } },
    { label: "Perfumes Árabes",   to: { name: "catalog", cat: "Árabe" } },
    { label: "Perfumes Premium",  to: { name: "catalog", cat: "Premium" } },
    { label: "Kits & Combos",     to: { name: "catalog", subcat: "Kit" } },
    { label: "Infantiles",        to: { name: "catalog", cat: "Infantil" } },
  ],

  // Texto plano o links. Editá libremente — si dejás un array vacío [], la columna no aparece.
  ayuda: [
    // Ejemplo: { label: "Envíos y Tiempos", href: "https://..." },
    // Ejemplo: { label: "Política de Cambios", text: true },
  ],

  contacto: [
    { label: "WhatsApp · 312 890 1741", href: "https://wa.me/543128901741" },
    // Ejemplo de email: { label: "hola@eress.store", href: "mailto:hola@eress.store" },
    // Ejemplo de texto: { label: "Atención L–S · 10 a 19h", text: true },
  ],

  copyright: "© 2026 ERESS PARFUM · Arquitectos de Esencia",
  signoff:   "Hecho con ✦ en Argentina",
};
// ╔══════════════════════════════════════════════════════════════╗
// ║  EDITAR AQUÍ ▲  — Fin del bloque editable                     ║
// ╚══════════════════════════════════════════════════════════════╝

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ─── Icon library (inline SVGs, gold-friendly stroke) ───
const Icon = ({ name, size = 20, stroke = 1.5 }) => {
  const paths = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></>,
    bag: <><path d="M5 7h14l-1.4 13.1a2 2 0 0 1-2 1.9H8.4a2 2 0 0 1-2-1.9L5 7Z"/><path d="M9 7V5a3 3 0 0 1 6 0v2"/></>,
    close: <><path d="M6 6l12 12M18 6L6 18"/></>,
    arrow_right: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    arrow_left: <><path d="M19 12H5M11 18l-6-6 6-6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    minus: <><path d="M5 12h14"/></>,
    filter: <><path d="M3 6h18M6 12h12M10 18h4"/></>,
    sort: <><path d="M3 6h13M3 12h9M3 18h5M17 8l4-4 4 4M21 4v16"/></>,
    sparkle: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></>,
    whatsapp: <><path d="M20.5 3.5A11 11 0 0 0 4.7 18.4L3 22l3.7-1.7A11 11 0 1 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.7 1 .9-2.6-.2-.3a9 9 0 1 1 6.9 3.4Z" fill="currentColor" stroke="none"/><path d="M16.8 14.3c-.3-.1-1.6-.8-1.8-.9-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.4.2-.6.1-.8-.4-1.6-.9-2.3-1.5-.5-.5-1-1.2-1.4-1.9-.1-.2 0-.4.1-.5l.4-.5c.1-.1.2-.3.3-.5 0-.2 0-.3-.1-.4-.1-.1-.7-1.6-.9-2.2-.2-.5-.4-.5-.6-.5h-.5c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4S6.9 13 7.1 13.2c1.3 1.9 3 3.3 5.1 4.2.7.3 1.2.4 1.7.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.2.2-1.3-.1-.2-.3-.3-.6-.4Z" fill="currentColor" stroke="none"/></>,
    trash: <><path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></>,
    truck: <><path d="M1 7h13v9H1zM14 11h4l3 3v2h-7M5.5 19.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4ZM17.5 19.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"/></>,
    shield: <><path d="M12 2 4 6v6c0 5 3.5 9.4 8 10 4.5-.6 8-5 8-10V6l-8-4Z"/><path d="m9 12 2 2 4-4"/></>,
    return_: <><path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7"/></>,
    check: <><path d="m5 12 5 5 9-11"/></>,
    star: <><path d="m12 2 3 7 7 .8-5.3 4.8L18 22l-6-3.5L6 22l1.3-7.4L2 9.8 9 9l3-7Z"/></>,
    sliders: <><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></>,
    menu: <><path d="M3 6h18M3 12h18M3 18h18"/></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></>,
    pin: <><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
         style={{ display: 'block', flexShrink: 0 }}>
      {paths[name] || null}
    </svg>
  );
};

// ─── Header ───
const Header = ({ view, setView, onSearch, cartCount, onCart }) => {
  const isActive = (test) => {
    if (test === 'catalog-all') return view.name === 'catalog' && !view.cat && !view.subcat;
    if (test === 'arabe') return view.name === 'catalog' && view.cat === 'Árabe';
    if (test === 'premium') return view.name === 'catalog' && view.cat === 'Premium';
    if (test === 'kit') return view.name === 'catalog' && view.subcat === 'Kit';
    if (test === 'story') return view.name === 'story';
    return false;
  };
  return (
  <header className="header">
    <div className="header-inner">
      <a className="brand" onClick={() => setView({ name: 'home' })} style={{cursor:'pointer'}}>
        ERESS
        <span className="brand-sub">PARFUM · 2026</span>
      </a>
      <nav className="nav">
        <a className={isActive('catalog-all') ? 'active' : ''} onClick={() => setView({ name: 'catalog' })}>Catálogo</a>
        <a className={isActive('arabe') ? 'active' : ''} onClick={() => setView({ name: 'catalog', cat: 'Árabe' })}>Árabes</a>
        <a className={isActive('premium') ? 'active' : ''} onClick={() => setView({ name: 'catalog', cat: 'Premium' })}>Premium</a>
        <a className={isActive('kit') ? 'active' : ''} onClick={() => setView({ name: 'catalog', subcat: 'Kit' })}>Kits</a>
        <a className={isActive('story') ? 'active' : ''} onClick={() => setView({ name: 'story' })}>Nuestra Historia</a>
      </nav>
      <div className="header-actions">
        <button className="icon-btn" aria-label="Buscar" onClick={onSearch}><Icon name="search"/></button>
        <button className="icon-btn" aria-label="Cuenta"><Icon name="user"/></button>
        <button className="icon-btn" aria-label="Carrito" onClick={onCart}>
          <Icon name="bag"/>
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </button>
      </div>
    </div>
  </header>
  );
};

// ─── Search Overlay (instant search) ───
const SearchOverlay = ({ products, onClose, onPick, setView }) => {
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current && inputRef.current.focus(); }, []);
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    return products
      .map(p => {
        const blob = `${p.nombre} ${p.marca} ${p.notas} ${p.cat} ${p.subcat}`.toLowerCase();
        const score = tokens.reduce((s, t) => s + (blob.includes(t) ? 1 : 0), 0);
        return { p, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(x => x.p);
  }, [q, products]);

  const popularBrands = ['LATTAFA', 'ARMAF', 'AFNAN', 'DIOR', 'CAROLINA HERRERA', 'VERSACE'];
  const quickQueries = ['Oud', 'Yara', 'Vainilla', 'Club de Nuit', 'Sauvage', 'Floral'];

  const goCatalog = (filters) => {
    onClose();
    setView({ name: 'catalog', ...filters });
  };

  return (
    <div className="search-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="search-bar">
        <Icon name="search" size={28}/>
        <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)}
               placeholder="¿Qué fragancia estás buscando hoy?"/>
        <button className="search-close" onClick={onClose} aria-label="Cerrar">
          <Icon name="close"/>
        </button>
      </div>

      {!q && (
        <div className="search-suggestions">
          <div style={{marginBottom: 32}}>
            <div className="eyebrow eyebrow-mute" style={{marginBottom: 14}}>Búsquedas populares</div>
            <div className="search-quick">
              {quickQueries.map(t => (
                <button key={t} className="chip" onClick={() => setQ(t)}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom: 32}}>
            <div className="eyebrow eyebrow-mute" style={{marginBottom: 14}}>Marcas destacadas</div>
            <div className="search-quick">
              {popularBrands.map(m => (
                <button key={m} className="chip" onClick={() => goCatalog({ marca: m })}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <div className="eyebrow eyebrow-mute" style={{marginBottom: 14}}>Atajos</div>
            <div className="search-quick">
              <button className="chip" onClick={() => goCatalog({ cat: 'Árabe' })}>Perfumes Árabes</button>
              <button className="chip" onClick={() => goCatalog({ cat: 'Premium' })}>Premium</button>
              <button className="chip" onClick={() => goCatalog({ cat: 'Infantil' })}>Infantiles</button>
              <button className="chip" onClick={() => goCatalog({ subcat: 'Kit' })}>Kits & Combos</button>
              <button className="chip" onClick={() => goCatalog({ genero: 'F' })}>Para Ella</button>
              <button className="chip" onClick={() => goCatalog({ genero: 'M' })}>Para Él</button>
            </div>
          </div>
        </div>
      )}

      {q && results.length === 0 && (
        <div className="no-results">
          <h3>Sin resultados para "{q}"</h3>
          <p>Probá con otro nombre, marca o nota olfativa.</p>
        </div>
      )}

      {q && results.length > 0 && (
        <>
          <div style={{maxWidth: 1200, margin: '0 auto 24px', width: '100%'}}>
            <div className="eyebrow eyebrow-mute">{results.length} resultado{results.length > 1 ? 's' : ''}</div>
          </div>
          <div className="search-results-grid">
            {results.map(p => <ProductCard key={p.id} p={p} onClick={() => { onClose(); onPick(p); }} compact/>)}
          </div>
          {results.length === 12 && (
            <div style={{textAlign: 'center', marginTop: 32}}>
              <button className="btn btn-ghost" onClick={() => { onClose(); setView({ name: 'catalog', q }); }}>
                Ver todos los resultados
                <Icon name="arrow_right" size={14}/>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// ─── Product Card ───
const ProductCard = ({ p, onClick, compact = false, onAdd }) => {
  const hasImg = !!p.img;
  return (
    <div className="prod-card fade-in" onClick={onClick}>
      <div className="prod-img">
        {hasImg ? (
          <img src={p.img} alt={p.nombre} loading="lazy"
               onError={(e) => { e.target.style.display = 'none'; }}/>
        ) : (
          <div className="prod-img-empty">SIN FOTO</div>
        )}
        <div className="prod-tags">
          {p.notas && p.notas.split('·').slice(0, 2).map((n, i) => (
            <span key={i} className="chip chip-mini" style={{background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)'}}>
              {n.trim()}
            </span>
          ))}
        </div>
        {!compact && onAdd && (
          <div className="prod-quick" onClick={e => e.stopPropagation()}>
            <button className="btn btn-sm" onClick={onClick}>Ver Detalle</button>
            <button className="btn btn-sm btn-solid" onClick={() => onAdd(p)} aria-label="Añadir al carrito">
              <Icon name="bag" size={13}/>
              Añadir
            </button>
          </div>
        )}
      </div>
      <div className="prod-info">
        <div className="prod-brand">{p.marca}</div>
        <div className="prod-name">{p.nombre.replace(/EDP|EDT|EDP\s*\d+ml|EDT\s*\d+ml/g, '').replace(/\s+\d+ml.*/, '').trim()}</div>
        {!compact && p.notas && <div className="prod-notes">{p.notas}</div>}
        <div className="prod-price">
          <span className="currency">$</span>{p.precioARS}
        </div>
      </div>
    </div>
  );
};

// ─── Cart Drawer ───
const CartDrawer = ({ cart, onClose, updateQty, removeItem, products }) => {
  const items = cart.map(c => ({ ...c, p: products.find(p => p.id === c.id) })).filter(x => x.p);
  const subtotal = items.reduce((s, x) => s + parseInt(x.p.precioARS.replace(/\./g, '')) * x.qty, 0);
  const fmt = (n) => n.toLocaleString('es-AR');

  const checkoutWA = () => {
    const lines = items.map(x => `• ${x.p.nombre} × ${x.qty} — $${fmt(parseInt(x.p.precioARS.replace(/\./g, '')) * x.qty)}`);
    const msg = `Hola! Quiero hacer este pedido en Eress Store:%0A%0A${encodeURIComponent(lines.join('\n'))}%0A%0A*Total: $${fmt(subtotal)}*`;
    window.open(`https://wa.me/543128901741?text=${msg}`, '_blank');
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose}/>
      <aside className="drawer">
        <div className="drawer-head">
          <h2>Tu Bolsa <span style={{color:'var(--gold)', fontSize:14, marginLeft:8}}>({items.length})</span></h2>
          <button className="icon-btn" onClick={onClose}><Icon name="close"/></button>
        </div>
        {items.length === 0 ? (
          <div className="drawer-empty">
            <div className="ico"><Icon name="bag" size={28}/></div>
            <h3 style={{fontFamily:'var(--serif)', fontSize:22, color:'var(--fg)', marginBottom:6}}>Tu bolsa está vacía</h3>
            <p style={{fontSize:13, maxWidth: 240}}>Descubrí nuestra colección y empezá tu viaje olfativo.</p>
            <button className="btn btn-ghost" style={{marginTop:24}} onClick={onClose}>Explorar Catálogo</button>
          </div>
        ) : (
          <>
            <div className="drawer-list">
              {items.map(x => (
                <div className="cart-item" key={x.id}>
                  <div className="cart-item-img">
                    {x.p.img && <img src={x.p.img} alt=""/>}
                  </div>
                  <div>
                    <div className="cart-item-brand">{x.p.marca}</div>
                    <div className="cart-item-name">{x.p.nombre}</div>
                    <div className="cart-qty">
                      <button onClick={() => updateQty(x.id, x.qty - 1)}><Icon name="minus" size={12}/></button>
                      <span>{x.qty}</span>
                      <button onClick={() => updateQty(x.id, x.qty + 1)}><Icon name="plus" size={12}/></button>
                    </div>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <button className="cart-item-remove" onClick={() => removeItem(x.id)} aria-label="Remover">
                      <Icon name="trash" size={16}/>
                    </button>
                    <div className="cart-item-price">${x.p.precioARS}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="drawer-totals">
                <div><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
                <div><span>Envío</span><span style={{color:'var(--gold)'}}>A coordinar</span></div>
              </div>
              <div className="drawer-total">
                <span className="lbl">Total</span>
                <span className="val">${fmt(subtotal)}</span>
              </div>
              <button className="btn btn-solid btn-lg" style={{width:'100%', marginTop:16}} onClick={checkoutWA}>
                <Icon name="whatsapp" size={16}/>
                Finalizar por WhatsApp
              </button>
              <button className="btn btn-ghost btn-sm" style={{width:'100%', marginTop:10}} onClick={onClose}>
                Seguir Comprando
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
};

// ─── Footer ───
const FooterCol = ({ title, items, setView }) => {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <h4>{title}</h4>
      <ul>
        {items.map((it, i) => {
          if (it.text) return <li key={i} style={{color:'var(--fg-2)', fontSize:13}}>{it.label}</li>;
          if (it.href) return <li key={i}><a href={it.href} target="_blank" rel="noopener">{it.label}</a></li>;
          if (it.to)   return <li key={i}><a onClick={() => setView(it.to)} style={{cursor:'pointer'}}>{it.label}</a></li>;
          return <li key={i}><a>{it.label}</a></li>;
        })}
      </ul>
    </div>
  );
};

const Footer = ({ setView }) => {
  const cfg = FOOTER_CONFIG;
  // Count populated columns to choose layout
  const cols = [cfg.boutique, cfg.ayuda, cfg.contacto].filter(c => c && c.length > 0).length;
  const gridCols = cols === 0 ? '1fr' : `1.4fr ${'1fr '.repeat(cols).trim()}`;
  return (
  <footer className="footer">
    <div className="footer-grid" style={{gridTemplateColumns: gridCols}}>
      <div>
        <div className="brand" style={{fontSize:30, marginBottom:14}}>
          ERESS<span className="brand-sub">PARFUM · 2026</span>
        </div>
        <p style={{color:'var(--fg-2)', fontSize:13, maxWidth: 320, lineHeight: 1.6}}>
          {cfg.tagline}
        </p>
        <div style={{display:'flex', gap:14, marginTop:20}}>
          {cfg.instagram && (
            <a className="icon-btn" href={cfg.instagram} target="_blank" rel="noopener" style={{width:38, height:38, border:'1px solid var(--fg-mute)'}}>
              <Icon name="instagram" size={16}/>
            </a>
          )}
          {cfg.whatsapp && (
            <a className="icon-btn" href={cfg.whatsapp} target="_blank" rel="noopener" style={{width:38, height:38, border:'1px solid var(--fg-mute)'}}>
              <Icon name="whatsapp" size={16}/>
            </a>
          )}
        </div>
      </div>
      <FooterCol title="Boutique" items={cfg.boutique} setView={setView}/>
      <FooterCol title="Ayuda"    items={cfg.ayuda}    setView={setView}/>
      <FooterCol title="Contacto" items={cfg.contacto} setView={setView}/>
    </div>
    <div className="footer-bottom">
      <span>{cfg.copyright}</span>
      <span>{cfg.signoff}</span>
    </div>
  </footer>
  );
};

Object.assign(window, {
  EressIcon: Icon,
  EressHeader: Header,
  EressFooter: Footer,
  EressSearchOverlay: SearchOverlay,
  EressProductCard: ProductCard,
  EressCartDrawer: CartDrawer,
});
