/* ════════════════════════════════════════════════════
   ERESS STORE v3 — MAIN APP
   State + Product modal + Tweaks integration
   ════════════════════════════════════════════════════ */

const { useState, useEffect, useMemo } = React;

const Icon = window.EressIcon;
const Header = window.EressHeader;
const Footer = window.EressFooter;
const SearchOverlay = window.EressSearchOverlay;
const CartDrawer = window.EressCartDrawer;
const ProductCard = window.EressProductCard;
const HomeView = window.EressHomeView;
const CatalogView = window.EressCatalogView;
const StoryView = window.EressStoryView;

// ─── Product Detail Modal ───
const ProductModal = ({ p, products, onClose, onAdd, onPick }) => {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const related = useMemo(() => {
    return products
      .filter(x => x.id !== p.id && (x.marca === p.marca || x.subcat === p.subcat))
      .slice(0, 4);
  }, [p, products]);

  const notes = (p.notas || '').split('·').map(s => s.trim()).filter(Boolean);
  const generoLabel = { F: 'Femenino', M: 'Masculino', U: 'Unisex', I: 'Infantil' }[p.genero] || '';

  const buyWA = () => {
    const msg = `Hola! Me interesa: *${p.nombre}* — $${p.precioARS}`;
    window.open(`https://wa.me/543128901741?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <button className="modal-close" onClick={onClose} aria-label="Cerrar"><Icon name="close"/></button>
        <div className="pdp">
          <div className="pdp-img bg-rich">
            <span className="pdp-img-badge">{p.cat}</span>
            {p.img ? <img src={p.img} alt={p.nombre}/> : <div className="prod-img-empty">SIN FOTO</div>}
          </div>
          <div>
            <div className="pdp-brand">{p.marca} {generoLabel && `· ${generoLabel}`}</div>
            <h2 className="pdp-name">{p.nombre}</h2>
            <p className="pdp-quote">"{p.desc}"</p>

            <div className="pdp-section">
              <h3>Pirámide Olfativa</h3>
              <div className="pdp-notes">
                {notes.map((n, i) => <span key={i} className="chip">{n}</span>)}
              </div>
            </div>

            <div className="pdp-price-row">
              <div>
                <div className="pdp-price"><span className="currency">$</span>{p.precioARS}</div>
                {p.usd && <div className="pdp-price-usd">REF · USD {p.usd}</div>}
              </div>
              <div style={{textAlign:'right', fontSize:11, color:'var(--fg-3)', letterSpacing:'0.1em'}}>
                STOCK<br/>
                <span style={{color:'var(--gold)', fontWeight:600, letterSpacing:'0.05em'}}>DISPONIBLE</span>
              </div>
            </div>

            <div className="pdp-actions">
              <button className="btn btn-solid" onClick={() => { onAdd(p); onClose(); }}>
                <Icon name="bag" size={14}/>
                Añadir a la Bolsa
              </button>
              <button className="btn btn-wa" onClick={buyWA}>
                <Icon name="whatsapp" size={14}/>
                Comprar por WhatsApp
              </button>
            </div>

            <div className="pdp-perks">
              <div className="pdp-perk">
                <Icon name="shield" size={20}/>
                Autenticidad<br/>Garantizada
              </div>
              <div className="pdp-perk">
                <Icon name="truck" size={20}/>
                Envíos dentro<br/>de Formosa
              </div>
              <div className="pdp-perk">
                <Icon name="return_" size={20}/>
                Cambios sin<br/>complicación
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="pdp-related">
            <div className="pdp-related-head">
              <div>
                <div className="eyebrow eyebrow-mute" style={{marginBottom:6}}>También te puede gustar</div>
                <h3 style={{fontFamily:'var(--serif)', fontSize:24, fontWeight:600}}>Más de {p.marca}</h3>
              </div>
            </div>
            <div className="pdp-related-row">
              {related.map(r => (
                <ProductCard key={r.id} p={r} compact onClick={() => onPick(r)}/>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Eress Tweaks Panel ───
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "gold",
  "layout": "editorial",
  "showHeroOverlay": true,
  "showQuickAdd": true,
  "cardSize": "comfortable"
}/*EDITMODE-END*/;

const EressTweaks = () => {
  const { TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor, useTweaks } = window.Tweaks;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent
  useEffect(() => {
    const accents = {
      gold: { gold: '#d4af37', gold2: '#e9c349', gold3: '#f2ca50' },
      copper: { gold: '#c47b50', gold2: '#d99a6e', gold3: '#e8b189' },
      platinum: { gold: '#b8b8c0', gold2: '#d0d0d5', gold3: '#e5e5ea' },
      crimson: { gold: '#a83b3b', gold2: '#c25555', gold3: '#d77373' },
    };
    const a = accents[t.accent] || accents.gold;
    document.documentElement.style.setProperty('--gold', a.gold);
    document.documentElement.style.setProperty('--gold-2', a.gold2);
    document.documentElement.style.setProperty('--gold-3', a.gold3);
  }, [t.accent]);

  // Apply card size
  useEffect(() => {
    const sizes = { compact: '180px', comfortable: '220px', spacious: '280px' };
    document.documentElement.style.setProperty('--card-min', sizes[t.cardSize] || '220px');
  }, [t.cardSize]);

  return (
    <TweaksPanel title="Tweaks Eress">
      <TweakSection title="Acento">
        <TweakColor t={t} setTweak={setTweak} keyName="accent" label="Color"
          options={[
            { value: 'gold', color: '#d4af37' },
            { value: 'copper', color: '#c47b50' },
            { value: 'platinum', color: '#b8b8c0' },
            { value: 'crimson', color: '#a83b3b' },
          ]}/>
      </TweakSection>
      <TweakSection title="Comportamiento">
        <TweakToggle t={t} setTweak={setTweak} keyName="showQuickAdd" label="Quick-add en hover"/>
        <TweakToggle t={t} setTweak={setTweak} keyName="showHeroOverlay" label="Marca gigante sobre hero"/>
      </TweakSection>
      <TweakSection title="Densidad de cards">
        <TweakRadio t={t} setTweak={setTweak} keyName="cardSize" label=""
          options={[{value:'compact', label:'Compact'}, {value:'comfortable', label:'Cómodo'}, {value:'spacious', label:'Espaciado'}]}/>
      </TweakSection>
    </TweaksPanel>
  );
};

// ─── App ───
const App = () => {
  const products = window.ERESS_PRODUCTS || [];

  const [view, setView] = useState({ name: 'home' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('eress_cart_v3') || '[]'); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('eress_cart_v3', JSON.stringify(cart));
  }, [cart]);

  // Keyboard shortcuts: / opens search
  useEffect(() => {
    const onKey = (e) => {
      if ((e.key === '/' || (e.metaKey && e.key === 'k') || (e.ctrlKey && e.key === 'k')) && !searchOpen) {
        const target = e.target;
        const tag = (target.tagName || '').toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          setSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [searchOpen]);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [view.name, view.cat, view.marca, view.subcat]);

  const addToCart = (p) => {
    setCart(c => {
      const ex = c.find(x => x.id === p.id);
      if (ex) return c.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x);
      return [...c, { id: p.id, qty: 1 }];
    });
    setCartOpen(true);
  };
  const updateQty = (id, qty) => {
    if (qty <= 0) return setCart(c => c.filter(x => x.id !== id));
    setCart(c => c.map(x => x.id === id ? { ...x, qty } : x));
  };
  const removeItem = (id) => setCart(c => c.filter(x => x.id !== id));

  const cartCount = cart.reduce((s, x) => s + x.qty, 0);

  return (
    <>
      <Header
        view={view}
        setView={setView}
        onSearch={() => setSearchOpen(true)}
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
      />
      <div data-screen-label={`Eress / ${view.name}`}>
        {view.name === 'home' && (
          <HomeView products={products} setView={setView} onPick={setActiveProduct} onAdd={addToCart}/>
        )}
        {view.name === 'catalog' && (
          <CatalogView products={products} view={view} setView={setView} onPick={setActiveProduct} onAdd={addToCart}/>
        )}
        {view.name === 'story' && (
          <StoryView setView={setView}/>
        )}
      </div>
      <Footer setView={setView}/>

      {searchOpen && (
        <SearchOverlay
          products={products}
          onClose={() => setSearchOpen(false)}
          onPick={setActiveProduct}
          setView={setView}
        />
      )}

      {activeProduct && (
        <ProductModal
          p={activeProduct}
          products={products}
          onClose={() => setActiveProduct(null)}
          onAdd={addToCart}
          onPick={(p) => setActiveProduct(p)}
        />
      )}

      {cartOpen && (
        <CartDrawer
          cart={cart}
          products={products}
          onClose={() => setCartOpen(false)}
          updateQty={updateQty}
          removeItem={removeItem}
        />
      )}

      <a className="wa-float" href="https://wa.me/543128901741" target="_blank" rel="noopener" aria-label="WhatsApp">
        <Icon name="whatsapp" size={26}/>
      </a>

      {window.Tweaks && <EressTweaks/>}
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
