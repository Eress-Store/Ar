/* ════════════════════════════════════════════════════
   ERESS STORE v3 — VIEWS
   Home (editorial) + Catalog (instant filter)
   ════════════════════════════════════════════════════ */

const { useState: _useState, useEffect: _useEffect, useMemo: _useMemo, useRef: _useRef } = React;

const Icon = window.EressIcon;
const ProductCard = window.EressProductCard;

// ─── Home view ───
const HomeView = ({ products, setView, onPick, onAdd }) => {
  // Pick hero product (Lattafa His Confession / dramatic ones)
  const heroProduct = products.find(p => p.id === 91) || products.find(p => p.id === 97) || products[0];

  // Curated bands
  const featured = useMemo(() => {
    const ids = [97, 83, 43, 47, 22, 91, 158, 122]; // mix of arabe + premium bestsellers
    return ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  }, [products]);

  const newArrivals = useMemo(() => {
    return products
      .filter(p => p.cat === 'Premium' && p.img)
      .slice(0, 4);
  }, [products]);

  return (
    <main>
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg"/>
        <div className="hero-grid"/>
        <div className="hero-inner">
          <div>
            <div className="eyebrow">Eress Parfum · Edición 2026</div>
            <h1 className="hero-title">
              El arte de<br/>
              encontrar tu<br/>
              <em>esencia.</em>
            </h1>
            <p className="hero-lead">
              Más de 170 fragancias curadas — del oud profundo de Medio Oriente
              a los clásicos europeos atemporales. Pensadas para quienes
              entienden que un perfume es una firma.
            </p>
            <div className="hero-actions">
              <button className="btn btn-solid btn-lg" onClick={() => setView({ name: 'catalog' })}>
                Explorar Catálogo
                <Icon name="arrow_right" size={14}/>
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setView({ name: 'catalog', cat: 'Árabe' })}>
                Solo Árabes
              </button>
            </div>
            <div className="hero-meta">
              <div className="hero-meta-item">
                <span className="num">170+</span>
                <span className="lbl">Fragancias</span>
              </div>
              <div className="hero-meta-item">
                <span className="num">22</span>
                <span className="lbl">Marcas</span>
              </div>
              <div className="hero-meta-item">
                <span className="num">100%</span>
                <span className="lbl">Originales</span>
              </div>
            </div>
          </div>
          <div className="hero-stack" onClick={() => onPick(heroProduct)} style={{cursor:'pointer'}}>
            <div className="hero-ring spin"/>
            <div className="hero-name-overlay">{heroProduct.marca.split(' ')[0]}</div>
            <div className="hero-bottle">
              {heroProduct.img ? (
                <img src={heroProduct.img} alt={heroProduct.nombre}/>
              ) : (
                <div className="prod-img-empty">PRODUCT HERO</div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORY TILES ── */}
      <section className="sect container">
        <div className="sect-head">
          <div>
            <div className="eyebrow" style={{marginBottom:14}}>Universos olfativos</div>
            <h2 className="sect-title">Elegí tu <em>camino.</em></h2>
          </div>
          <p className="sect-lead">
            Cada universo es una historia distinta. Empezá donde tu instinto te lleve.
          </p>
        </div>
        <div className="cats">
          <CatTile
            label="Árabes"
            title="El oriente en tu piel"
            count={products.filter(p => p.cat === 'Árabe').length}
            img={products.find(p => p.id === 97)?.img}
            onClick={() => setView({ name: 'catalog', cat: 'Árabe' })}
          />
          <CatTile
            label="Premium"
            title="Clásicos eternos"
            count={products.filter(p => p.cat === 'Premium').length}
            img={products.find(p => p.id === 158)?.img}
            onClick={() => setView({ name: 'catalog', cat: 'Premium' })}
          />
          <CatTile
            label="Kits & Combos"
            title="Regalos curados"
            count={products.filter(p => p.subcat === 'Kit').length}
            img={products.find(p => p.id === 9)?.img}
            onClick={() => setView({ name: 'catalog', subcat: 'Kit' })}
          />
        </div>
      </section>

      {/* ── FEATURED ── */}
      <section className="sect container" style={{paddingTop:0}}>
        <div className="sect-head">
          <div>
            <div className="eyebrow" style={{marginBottom:14}}>La Colección</div>
            <h2 className="sect-title">Los más <em>deseados.</em></h2>
          </div>
          <a className="ulink" onClick={() => setView({ name: 'catalog' })}>Ver Todos →</a>
        </div>
        <div className="grid-4">
          {featured.map(p => (
            <ProductCard key={p.id} p={p} onClick={() => onPick(p)} onAdd={onAdd}/>
          ))}
        </div>
      </section>

      {/* ── SCENT FINDER STRIP ── */}
      <section style={{background:'var(--bg-2)', borderTop:'1px solid var(--fg-mute)', borderBottom:'1px solid var(--fg-mute)'}}>
        <div className="container" style={{padding:'80px var(--margin)'}}>
          <div style={{
            display:'grid',
            gridTemplateColumns: '1fr 1.2fr',
            gap: 60,
            alignItems: 'center',
          }} className="finder-grid">
            <div>
              <div className="eyebrow" style={{marginBottom:18}}>Buscador de fragancias</div>
              <h2 style={{fontFamily:'var(--serif)', fontSize:'clamp(34px, 5vw, 56px)', fontWeight:600, lineHeight:1, letterSpacing:'-0.02em'}}>
                ¿No sabés por dónde<br/>empezar?
              </h2>
              <p style={{color:'var(--fg-2)', marginTop:18, maxWidth:480, fontSize:16, lineHeight:1.6}}>
                Filtrá por familia olfativa, ocasión o personalidad. Encontrá tu
                próxima firma en menos de un minuto.
              </p>
              <div className="quick-pills">
                <Pill icon="sparkle" label="Dulce y gourmand" onClick={() => setView({ name: 'catalog', q: 'vainilla caramelo' })}/>
                <Pill icon="sparkle" label="Oud profundo" onClick={() => setView({ name: 'catalog', q: 'oud' })}/>
                <Pill icon="sparkle" label="Fresco cítrico" onClick={() => setView({ name: 'catalog', q: 'cítrico fresco' })}/>
                <Pill icon="sparkle" label="Floral elegante" onClick={() => setView({ name: 'catalog', q: 'floral' })}/>
                <Pill icon="sparkle" label="Amaderado especiado" onClick={() => setView({ name: 'catalog', q: 'amaderado especiado' })}/>
              </div>
            </div>
            <div style={{position:'relative', aspectRatio:'1/1'}}>
              <FinderVisual products={products}/>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS / PREMIUM ── */}
      <section className="sect container">
        <div className="sect-head">
          <div>
            <div className="eyebrow" style={{marginBottom:14}}>Premium</div>
            <h2 className="sect-title">Los clásicos <em>europeos.</em></h2>
          </div>
          <a className="ulink" onClick={() => setView({ name: 'catalog', cat: 'Premium' })}>Ver Premium →</a>
        </div>
        <div className="grid-4">
          {newArrivals.map(p => (
            <ProductCard key={p.id} p={p} onClick={() => onPick(p)} onAdd={onAdd}/>
          ))}
        </div>
      </section>

      {/* ── STORY ── */}
      <section className="container">
        <div className="story">
          <div className="story-visual bg-rich" style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
            <img src="v3/eress-logo.jpeg" alt="Eress Store" style={{
              width: '78%',
              aspectRatio: '1/1',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              filter: 'drop-shadow(0 0 60px rgba(212, 175, 55, 0.25))',
            }}/>
          </div>
          <div>
            <div className="eyebrow" style={{marginBottom:18}}>Nuestra Historia</div>
            <h2 style={{fontFamily:'var(--serif)', fontSize:'clamp(34px, 5vw, 56px)', fontWeight:600, lineHeight:1.05, letterSpacing:'-0.02em', marginBottom:24}}>
              Curaduría, no <em style={{fontStyle:'italic', color:'var(--gold)', fontWeight:400}}>catálogo.</em>
            </h2>
            <p style={{color:'var(--fg-2)', marginBottom:16, fontSize:16, lineHeight:1.7}}>
              No vendemos cualquier perfume. Probamos cada referencia, conocemos
              cada marca, y solo traemos las que valen la pena. Desde el oud
              profundo de Lattafa hasta los íconos atemporales de Dior, cada
              fragancia tiene su porqué.
            </p>
            <p style={{color:'var(--fg-2)', marginBottom:32, fontSize:16, lineHeight:1.7}}>
              Marca formoseña, atención humana por WhatsApp y envíos dentro de
              la ciudad de Formosa. Autenticidad garantizada en cada frasco.
            </p>
            <button className="btn btn-ghost" onClick={() => setView({ name: 'catalog' })}>
              Ver Catálogo Completo
              <Icon name="arrow_right" size={14}/>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

const Pill = ({ icon, label, onClick }) => (
  <button className="chip" onClick={onClick} style={{padding:'10px 16px'}}>
    <Icon name={icon} size={12}/>
    {label}
  </button>
);

const CatTile = ({ label, title, count, img, onClick }) => (
  <div className="cat-tile bg-rich" onClick={onClick}>
    <div className="cat-tile-img">
      {img ? <img src={img} alt=""/> : <div style={{color:'var(--fg-3)'}}>•</div>}
    </div>
    <div className="cat-tile-grad"/>
    <div className="cat-tile-content">
      <div className="cat-tile-eyebrow">{label}</div>
      <div className="cat-tile-title">{title}</div>
      <div className="cat-tile-meta">
        <span>{count} fragancias</span>
        <span style={{color:'var(--gold)'}}>→</span>
      </div>
    </div>
  </div>
);

const FinderVisual = ({ products }) => {
  // Compose 4-tile mini-grid using actual products
  const tiles = [products[12], products[46], products[157], products[91]].filter(Boolean);
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'1fr 1fr', gridTemplateRows:'1fr 1fr',
      gap: 4, aspectRatio:'1/1', position:'relative'
    }}>
      {tiles.map((p, i) => (
        <div key={i} className="bg-rich" style={{
          position:'relative', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
          border: '1px solid rgba(212, 175, 55, 0.15)',
        }}>
          {p?.img && <img src={p.img} alt="" style={{width:'70%', height:'70%', objectFit:'contain', filter:'drop-shadow(0 10px 20px rgba(0,0,0,0.4))'}}/>}
        </div>
      ))}
      <div style={{
        position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        width: 110, height: 110, borderRadius:'50%',
        background:'rgba(13,13,13,0.95)', backdropFilter:'blur(10px)',
        border:'1px solid var(--gold)',
        display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column',
      }}>
        <Icon name="sparkle" size={24}/>
        <span style={{fontSize:9, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold)', marginTop:6, fontWeight:600}}>Find Your Scent</span>
      </div>
    </div>
  );
};

// ─── Catalog view ───
const CatalogView = ({ products, view, setView, onPick, onAdd }) => {
  const [q, setQ] = useState(view.q || '');
  const [cat, setCat] = useState(view.cat || 'all');
  const [marca, setMarca] = useState(view.marca || 'all');
  const [genero, setGenero] = useState(view.genero || 'all');
  const [subcat, setSubcat] = useState(view.subcat || 'all');
  const [sort, setSort] = useState('relevant');
  const [limit, setLimit] = useState(20);

  // Sync from view
  useEffect(() => {
    if (view.q !== undefined) setQ(view.q);
    if (view.cat) setCat(view.cat);
    if (view.marca) setMarca(view.marca);
    if (view.genero) setGenero(view.genero);
    if (view.subcat) setSubcat(view.subcat);
  }, [view]);

  const cats = ['all', 'Árabe', 'Premium', 'Infantil'];
  const generos = [
    { v: 'all', l: 'Todos' },
    { v: 'F', l: 'Para Ella' },
    { v: 'M', l: 'Para Él' },
    { v: 'U', l: 'Unisex' },
    { v: 'I', l: 'Niños' },
  ];
  const subcats = ['all', 'Kit', 'Masculino', 'Femenino', 'Unisex', 'Ultra Premium', 'Decant'];
  const marcas = useMemo(() => {
    const set = new Set(products.map(p => p.marca));
    return ['all', ...Array.from(set).sort()];
  }, [products]);

  const filtered = useMemo(() => {
    let arr = products;
    if (cat !== 'all') arr = arr.filter(p => p.cat === cat);
    if (subcat !== 'all') arr = arr.filter(p => p.subcat === subcat);
    if (marca !== 'all') arr = arr.filter(p => p.marca === marca);
    if (genero !== 'all') arr = arr.filter(p => p.genero === genero);
    if (q.trim()) {
      const tokens = q.toLowerCase().split(/\s+/).filter(Boolean);
      arr = arr.filter(p => {
        const blob = `${p.nombre} ${p.marca} ${p.notas} ${p.desc}`.toLowerCase();
        return tokens.every(t => blob.includes(t));
      });
    }
    // sort
    const num = (s) => parseInt(String(s).replace(/\./g, '')) || 0;
    if (sort === 'price-asc') arr = [...arr].sort((a,b) => num(a.precioARS) - num(b.precioARS));
    else if (sort === 'price-desc') arr = [...arr].sort((a,b) => num(b.precioARS) - num(a.precioARS));
    else if (sort === 'name') arr = [...arr].sort((a,b) => a.nombre.localeCompare(b.nombre));
    return arr;
  }, [products, q, cat, marca, genero, subcat, sort]);

  // Reset limit on filter change
  useEffect(() => { setLimit(20); }, [q, cat, marca, genero, subcat]);

  const visible = filtered.slice(0, limit);

  return (
    <main>
      <div className="page-head">
        <div className="eyebrow" style={{marginBottom:18}}>
          {cat === 'all' ? 'Catálogo Completo' : `Catálogo · ${cat}`}
        </div>
        <h1>La <em>colección</em></h1>
        <p>
          Descubrí nuestra selección curada de fragancias árabes y premium.
          Filtros instantáneos — encontrá tu próxima firma en segundos.
        </p>
      </div>

      <div className="filter-row">
        <span className="filter-label">Categoría:</span>
        {cats.map(c => (
          <button key={c} className={`chip ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>
            {c === 'all' ? 'Todos' : c}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <span className="filter-label">Para:</span>
        {generos.map(g => (
          <button key={g.v} className={`chip ${genero === g.v ? 'active' : ''}`} onClick={() => setGenero(g.v)}>
            {g.l}
          </button>
        ))}
      </div>
      <div className="filter-row">
        <span className="filter-label">Tipo:</span>
        {subcats.map(s => (
          <button key={s} className={`chip ${subcat === s ? 'active' : ''}`} onClick={() => setSubcat(s)}>
            {s === 'all' ? 'Todos' : s}
          </button>
        ))}
      </div>

      <div className="toolbar" style={{marginTop: 24, position:'static'}}>
        <div className="toolbar-inner">
          <div className="toolbar-search">
            <Icon name="search" size={16}/>
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre, marca o nota olfativa…"/>
            {q && <button onClick={() => setQ('')} aria-label="Limpiar"><Icon name="close" size={14}/></button>}
          </div>
          <select className="toolbar-select" value={marca} onChange={e => setMarca(e.target.value)}>
            {marcas.map(m => <option key={m} value={m}>{m === 'all' ? 'Todas las marcas' : m}</option>)}
          </select>
          <select className="toolbar-select" value={sort} onChange={e => setSort(e.target.value)}>
            <option value="relevant">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="name">Nombre A-Z</option>
          </select>
          <span className="toolbar-count">{filtered.length} resultados</span>
        </div>
      </div>

      <section className="container" style={{padding:'40px var(--margin)'}}>
        {filtered.length === 0 ? (
          <div className="no-results">
            <h3>Sin resultados</h3>
            <p>Probá quitando algún filtro o usá otro término de búsqueda.</p>
            <button className="btn btn-ghost" style={{marginTop:24}} onClick={() => {
              setQ(''); setCat('all'); setMarca('all'); setGenero('all'); setSubcat('all');
            }}>Limpiar Filtros</button>
          </div>
        ) : (
          <>
            <div className="grid-4">
              {visible.map(p => (
                <ProductCard key={p.id} p={p} onClick={() => onPick(p)} onAdd={onAdd}/>
              ))}
            </div>
            {limit < filtered.length && (
              <div className="load-more-row">
                <button className="btn btn-ghost btn-lg" onClick={() => setLimit(l => l + 20)}>
                  Cargar Más · {filtered.length - limit} restantes
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
};

// ─── Story view ───
const StoryView = ({ setView }) => (
  <main>
    <div className="page-head">
      <div className="eyebrow" style={{marginBottom:18}}>Nuestra Historia</div>
      <h1>Arquitectos de <em>esencia</em>.</h1>
    </div>
    <section className="container" style={{padding:'40px var(--margin) 120px'}}>
      <div style={{maxWidth: 720, margin: '0 auto'}}>
        <p style={{fontSize: 22, lineHeight: 1.6, color: 'var(--fg)', fontFamily: 'var(--serif)', fontStyle: 'italic', marginBottom: 40}}>
          "Un perfume no es un accesorio. Es una firma invisible que entra a la
          habitación antes que vos."
        </p>
        <p style={{color:'var(--fg-2)', marginBottom: 24, fontSize: 16, lineHeight: 1.8}}>
          Eress es una marca <strong style={{color:'var(--gold)', fontWeight: 600}}>formoseña</strong> que
          nació en 2026 con una obsesión simple: traer a Formosa las fragancias que
          realmente valen la pena. Empezamos con un puñado de marcas árabes
          —Lattafa, Armaf, Afnan— porque sentíamos que la perfumería de Medio
          Oriente estaba mal contada acá. Hoy curamos más de 170 referencias entre
          árabes y premium europeos.
        </p>
        <p style={{color:'var(--fg-2)', marginBottom: 24, fontSize: 16, lineHeight: 1.8}}>
          Cada producto pasa por nosotros antes de subir al catálogo. Probamos,
          comparamos, descartamos. Solo queda lo que nos quemaría no recomendar.
        </p>
        <p style={{color:'var(--fg-2)', marginBottom: 48, fontSize: 16, lineHeight: 1.8}}>
          Por ahora trabajamos <strong style={{color:'var(--gold)', fontWeight: 600}}>solo en la ciudad de Formosa</strong>:
          coordinamos entrega por WhatsApp y hacemos envíos dentro de la ciudad.
          Autenticidad garantizada, atención humana, sin algoritmos. Solo perfume bueno.
        </p>
        <button className="btn btn-solid btn-lg" onClick={() => setView({ name: 'catalog' })}>
          Ver Catálogo
          <Icon name="arrow_right" size={14}/>
        </button>
      </div>
    </section>
  </main>
);

Object.assign(window, {
  EressHomeView: HomeView,
  EressCatalogView: CatalogView,
  EressStoryView: StoryView,
});
