/**
 * WorkshopChart — React chart component embedded in Django statistics page.
 *
 * ✅ All styling via React inline styles (no external CSS classes)
 * ✅ React 18 createRoot API
 * ✅ Chart.js 2.x (gradient bar + doughnut)
 * ✅ Summary stat pills, tab switcher, animated entry, close button
 *
 * Usage (called from Django template after this script loads):
 *   window.WorkshopChart.mount(domNode, data)
 *   window.WorkshopChart.show('state' | 'type')
 */
(function () {
  'use strict';

  /* ── Inject minimal keyframe animation (can't be done inline) ─── */
  var styleTag = document.createElement('style');
  styleTag.textContent = [
    '@keyframes wc-slide-in{from{opacity:0;transform:translateY(-16px)}to{opacity:1;transform:translateY(0)}}',
    '@keyframes wc-fade-in{from{opacity:0}to{opacity:1}}',
  ].join('');
  document.head.appendChild(styleTag);

  /* ── Shorthand ───────────────────────────────────────────────── */
  var h          = React.createElement;
  var useState   = React.useState;
  var useEffect  = React.useEffect;
  var useRef     = React.useRef;
  var useCallback = React.useCallback;

  /* ── Design tokens (single source of truth) ──────────────────── */
  var TOKEN = {
    purple : '#667eea',
    violet : '#764ba2',
    white  : '#ffffff',
    text   : '#374151',
    muted  : '#6b7280',
    border : 'rgba(102,126,234,0.14)',
    radius : { card: '18px', btn: '10px', pill: '10px', circle: '50%' },
    shadow : { card: '0 8px 32px rgba(102,126,234,0.16)', pill: '0 2px 8px rgba(102,126,234,0.08)' },
    gradH  : 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',  /* header gradient */
  };

  /* ── Inline-style objects ────────────────────────────────────── */
  var S = {
    wrapper: {
      animation: 'wc-slide-in 0.38s cubic-bezier(0.4,0,0.2,1)',
      marginBottom: '1.5rem',
    },
    card: {
      background: TOKEN.white,
      borderRadius: TOKEN.radius.card,
      boxShadow: TOKEN.shadow.card,
      border: '1px solid ' + TOKEN.border,
      overflow: 'hidden',
      fontFamily: 'Inter, system-ui, sans-serif',
    },
    /* ── Header ── */
    header: {
      background: TOKEN.gradH,
      padding: '1rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '0.75rem',
    },
    headerLeft: {
      display: 'flex', alignItems: 'center', gap: '0.85rem', color: TOKEN.white,
    },
    headerIcon: {
      fontSize: '1.8rem',
      background: 'rgba(255,255,255,0.18)',
      borderRadius: TOKEN.radius.btn,
      padding: '0.3rem',
      display: 'inline-flex',
    },
    headerTitle: {
      fontSize: '1.05rem', fontWeight: 700, color: TOKEN.white, letterSpacing: '0.2px', margin: 0,
    },
    headerSub: {
      fontSize: '0.8rem', color: 'rgba(255,255,255,0.72)', marginTop: '0.15rem',
    },
    headerRight: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    },
    /* ── Tab switcher ── */
    tabs: {
      display: 'flex',
      background: 'rgba(255,255,255,0.15)',
      borderRadius: TOKEN.radius.btn,
      padding: '3px',
      gap: '2px',
    },
    tabBase: {
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.4rem 0.85rem',
      border: 'none', borderRadius: '8px',
      fontSize: '0.82rem', fontWeight: 600,
      cursor: 'pointer', transition: 'all 0.2s ease',
      fontFamily: 'inherit',
    },
    tabInactive: { background: 'transparent', color: 'rgba(255,255,255,0.75)' },
    tabActive:   { background: TOKEN.white, color: TOKEN.purple, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
    /* ── Close button ── */
    closeBtn: {
      background: 'rgba(255,255,255,0.15)', border: 'none',
      borderRadius: TOKEN.radius.circle,
      width: '32px', height: '32px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'rgba(255,255,255,0.8)',
      cursor: 'pointer', transition: 'all 0.2s ease',
      flexShrink: 0,
    },
    /* ── Stat pills row ── */
    pillsRow: {
      display: 'flex', gap: '0.85rem', flexWrap: 'wrap',
      padding: '0.9rem 1.5rem',
      background: 'linear-gradient(90deg,rgba(102,126,234,0.05),rgba(118,75,162,0.05))',
      borderBottom: '1px solid rgba(102,126,234,0.08)',
    },
    pillBase: {
      display: 'flex', flexDirection: 'column', gap: '0.1rem',
      padding: '0.5rem 1.1rem',
      background: TOKEN.white,
      borderRadius: TOKEN.radius.pill,
      border: '1px solid rgba(102,126,234,0.15)',
      boxShadow: TOKEN.shadow.pill,
      minWidth: '110px',
    },
    pillAccent: {
      background: 'linear-gradient(135deg,rgba(102,126,234,0.09),rgba(118,75,162,0.09))',
      border: '1px solid rgba(102,126,234,0.25)',
    },
    pillVal: {
      fontSize: '1.2rem', fontWeight: 700, color: TOKEN.purple, lineHeight: 1,
    },
    pillLabel: {
      fontSize: '0.7rem', fontWeight: 600, color: TOKEN.muted,
      textTransform: 'uppercase', letterSpacing: '0.4px',
    },
    /* ── Chart area ── */
    chartArea: {
      padding: '1.25rem 1.5rem 1.5rem',
      height: '340px',
      position: 'relative',
    },
    canvas: { width: '100%', height: '100%' },
  };

  /* ═══════════════════════════════════════════════════════════════
     ChartCanvas — wraps Chart.js inside React
  ═══════════════════════════════════════════════════════════════ */
  function ChartCanvas(props) {
    var canvasRef = useRef(null);
    var chartRef  = useRef(null);

    useEffect(function () {
      if (!canvasRef.current) return;
      if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }

      var ctx  = canvasRef.current.getContext('2d');
      var grad = ctx.createLinearGradient(0, 0, 0, 300);
      grad.addColorStop(0,   props.colorFrom);
      grad.addColorStop(1,   props.colorTo);

      var isDonut = props.chartType === 'doughnut';

      chartRef.current = new Chart(ctx, {
        type: props.chartType,
        data: {
          labels: props.labels,
          datasets: [{
            label: props.title,
            data: props.data,
            backgroundColor: isDonut
              ? ['#667eea','#764ba2','#11998e','#f7971e','#ee0979','#43cea2','#4facfe','#f093fb']
                  .slice(0, props.data.length)
              : grad,
            borderColor: isDonut ? TOKEN.white : props.colorFrom,
            borderWidth: isDonut ? 2 : 2,
            hoverBackgroundColor: isDonut ? undefined : props.colorFrom,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: isDonut,
            position: 'right',
            labels: { boxWidth: 13, padding: 14, fontSize: 12, fontFamily: 'Inter,sans-serif' },
          },
          tooltips: {
            backgroundColor: 'rgba(30,30,30,0.92)',
            titleFontFamily: 'Inter,sans-serif',
            bodyFontFamily: 'Inter,sans-serif',
            cornerRadius: 8,
            callbacks: {
              label: function (item, d) {
                return isDonut
                  ? ' ' + d.labels[item.index] + ': ' + d.datasets[0].data[item.index]
                  : ' ' + item.yLabel;
              }
            }
          },
          scales: isDonut ? {} : {
            yAxes: [{
              ticks: { beginAtZero: true, precision: 0, fontFamily: 'Inter,sans-serif', fontSize: 12 },
              gridLines: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
            }],
            xAxes: [{
              ticks: { fontFamily: 'Inter,sans-serif', fontSize: 11, maxRotation: 40, autoSkip: true, maxTicksLimit: 14 },
              gridLines: { display: false },
            }],
          },
          animation: { duration: 550, easing: 'easeOutQuart' },
        },
      });

      return function () {
        if (chartRef.current) { chartRef.current.destroy(); chartRef.current = null; }
      };
    // eslint-disable-next-line
    }, [props.chartType, props.labels, props.data]);

    return h('canvas', { ref: canvasRef, style: S.canvas });
  }

  /* ═══════════════════════════════════════════════════════════════
     TabBar
  ═══════════════════════════════════════════════════════════════ */
  function TabBar(props) {
    var tabs = [
      { key: 'bar',      icon: 'bar_chart',   label: 'Bar' },
      { key: 'doughnut', icon: 'donut_large',  label: 'Donut' },
    ];
    return h('div', { style: S.tabs },
      tabs.map(function (t) {
        var active = props.active === t.key;
        return h('button', {
          key: t.key,
          style: Object.assign({}, S.tabBase, active ? S.tabActive : S.tabInactive),
          onClick: function () { props.onChange(t.key); },
        },
          h('span', { className: 'material-icons', style: { fontSize: '1rem' } }, t.icon),
          t.label
        );
      })
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     StatPills
  ═══════════════════════════════════════════════════════════════ */
  function StatPills(props) {
    if (!props.labels || !props.data || props.data.length === 0) return null;
    var total  = props.data.reduce(function (a, b) { return a + (b || 0); }, 0);
    var maxVal = Math.max.apply(null, props.data);
    var topIdx = props.data.indexOf(maxVal);

    var pills = [
      { val: total,                       label: 'Total Workshops', accent: false },
      { val: props.labels[topIdx] || '—', label: 'Top Category',   accent: true  },
      { val: props.labels.length,         label: 'Categories',      accent: false },
    ];

    return h('div', { style: S.pillsRow },
      pills.map(function (p, i) {
        return h('div', {
          key: i,
          style: Object.assign({}, S.pillBase, p.accent ? S.pillAccent : {}),
        },
          h('span', { style: S.pillVal }, p.val),
          h('span', { style: S.pillLabel }, p.label)
        );
      })
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     ChartCard — the full card rendered by React
  ═══════════════════════════════════════════════════════════════ */
  function ChartCard(props) {
    var typeState   = useState('bar');
    var chartType   = typeState[0];
    var setChartType = typeState[1];
    var hovClose    = useState(false);
    var isHovClose  = hovClose[0];
    var setHovClose = hovClose[1];

    var cfg = props.config;
    if (!cfg) return null;

    return h('div', { style: S.card },

      /* ─ Header ─ */
      h('div', { style: S.header },
        h('div', { style: S.headerLeft },
          h('span', { className: 'material-icons', style: S.headerIcon }, cfg.icon),
          h('div', null,
            h('div', { style: S.headerTitle }, cfg.title),
            h('div', { style: S.headerSub },  cfg.subtitle)
          )
        ),
        h('div', { style: S.headerRight },
          h(TabBar, { active: chartType, onChange: setChartType }),
          h('button', {
            style: Object.assign({}, S.closeBtn, isHovClose
              ? { background: 'rgba(255,255,255,0.28)', color: TOKEN.white, transform: 'scale(1.12)' }
              : {}
            ),
            onMouseEnter: function () { setHovClose(true); },
            onMouseLeave: function () { setHovClose(false); },
            onClick: props.onClose,
            'aria-label': 'Close chart',
          },
            h('span', { className: 'material-icons', style: { fontSize: '1.05rem' } }, 'close')
          )
        )
      ),

      /* ─ Stat pills ─ */
      h(StatPills, { labels: cfg.labels, data: cfg.data }),

      /* ─ Chart canvas ─ */
      h('div', { style: S.chartArea },
        h(ChartCanvas, {
          key: cfg.key + '-' + chartType,   /* force remount on tab switch */
          chartType:  chartType,
          labels:     cfg.labels,
          data:       cfg.data,
          title:      cfg.title,
          colorFrom:  cfg.colorFrom,
          colorTo:    cfg.colorTo,
        })
      )
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     ChartApp — root React component, manages which chart is visible
  ═══════════════════════════════════════════════════════════════ */
  function ChartApp(props) {
    var activeState = useState(null);
    var active      = activeState[0];
    var setActive   = activeState[1];

    /* Expose setter to the page (Django button click handlers) */
    useEffect(function () {
      window.WorkshopChart._setActive = setActive;
    }, [setActive]);

    var CONFIGS = {
      state: {
        key:       'state',
        icon:      'map',
        title:     'State-wise Workshops',
        subtitle:  'Completed workshops per state',
        labels:    props.data.stateLabels,
        data:      props.data.stateData,
        colorFrom: '#667eea',
        colorTo:   'rgba(102,126,234,0.12)',
      },
      type: {
        key:       'type',
        icon:      'donut_large',
        title:     'Workshop Type Distribution',
        subtitle:  'Breakdown by workshop type',
        labels:    props.data.typeLabels,
        data:      props.data.typeData,
        colorFrom: '#764ba2',
        colorTo:   'rgba(118,75,162,0.12)',
      },
    };

    if (!active || !CONFIGS[active]) return null;

    return h('div', { style: S.wrapper },
      h(ChartCard, {
        config:  CONFIGS[active],
        onClose: function () { setActive(null); },
      })
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     Public API  —  window.WorkshopChart
  ═══════════════════════════════════════════════════════════════ */
  var _root = null;

  window.WorkshopChart = {
    _setActive: null,

    /** Mount the React app once into a DOM node */
    mount: function (node, data) {
      if (!node) { console.error('[WorkshopChart] mount node not found'); return; }
      if (typeof ReactDOM.createRoot === 'function') {
        /* React 18 */
        _root = ReactDOM.createRoot(node);
        _root.render(h(ChartApp, { data: data }));
      } else {
        /* React 16/17 legacy fallback */
        ReactDOM.render(h(ChartApp, { data: data }), node);
      }
    },

    /** Show a chart — called from button click handlers */
    show: function (chartKey) {
      if (typeof window.WorkshopChart._setActive === 'function') {
        window.WorkshopChart._setActive(chartKey);
      } else {
        console.warn('[WorkshopChart] not mounted yet');
      }
    },

    /** Hide the chart */
    hide: function () {
      if (typeof window.WorkshopChart._setActive === 'function') {
        window.WorkshopChart._setActive(null);
      }
    },
  };

}());
