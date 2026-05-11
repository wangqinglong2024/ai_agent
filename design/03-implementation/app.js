/* QSDS · app.js
 * 青花宋韵 Design System runtime.
 * Exports `window.qsds`. No build step required.
 *
 * Public API:
 *   qsds.bootstrap()
 *   qsds.setMode(mode)        // 'light' | 'dark' | 'auto'
 *   qsds.toggleMode()
 *   qsds.setAccent(name)      // see listAccents()
 *   qsds.setDensity(density)  // 'default' | 'compact' | 'elder'
 *   qsds.toast(msg, level?)
 *   qsds.bindDropdowns(root?)
 *   qsds.bindModals(root?)
 *   qsds.bindTabs(root?)
 *   qsds.mountSettingsPanel(triggerSelector)
 *   qsds.mountFluid(canvasEl, opts?)
 *   qsds.initFluid(selector?)
 *   qsds.listAccents()
 */
(function (global) {
  'use strict';

  var STORAGE = { mode: 'qsds:mode', accent: 'qsds:accent', density: 'qsds:density' };
  var ACCENTS  = ['ink', 'cinnabar', 'jade', 'gold', 'graphite'];
  var MODES    = ['light', 'dark', 'auto'];
  var DENSITY  = ['default', 'compact', 'elder'];

  function $(s, root) { return (root || document).querySelector(s); }
  function $$(s, root){ return Array.prototype.slice.call((root || document).querySelectorAll(s)); }

  // ------------------------------ theme ------------------------------

  function setMode(m){
    if (MODES.indexOf(m) < 0) return;
    document.documentElement.dataset.mode = m;
    try { localStorage.setItem(STORAGE.mode, m); } catch(e){}
    document.dispatchEvent(new CustomEvent('qsds:modechange', { detail: { mode: m } }));
  }
  function toggleMode(){ setMode(document.documentElement.dataset.mode === 'dark' ? 'light' : 'dark'); }

  function setAccent(a){
    if (ACCENTS.indexOf(a) < 0) return;
    document.documentElement.dataset.accent = a;
    try { localStorage.setItem(STORAGE.accent, a); } catch(e){}
    document.dispatchEvent(new CustomEvent('qsds:accentchange', { detail: { accent: a } }));
  }
  function setDensity(d){
    if (DENSITY.indexOf(d) < 0) return;
    document.documentElement.dataset.density = d;
    try { localStorage.setItem(STORAGE.density, d); } catch(e){}
    document.dispatchEvent(new CustomEvent('qsds:densitychange', { detail: { density: d } }));
  }
  function listAccents(){ return ACCENTS.slice(); }

  // ------------------------------ toast ------------------------------

  function ensureToastStack(){
    var s = $('.toast-stack');
    if (!s) {
      s = document.createElement('div');
      s.className = 'toast-stack';
      s.setAttribute('role', 'status');
      s.setAttribute('aria-live', 'polite');
      document.body.appendChild(s);
    }
    return s;
  }
  function toast(msg, level){
    var stack = ensureToastStack();
    var t = document.createElement('div');
    t.className = 'toast';
    if (level) t.dataset.level = level;
    if (level === 'danger') t.setAttribute('role', 'alert');
    t.textContent = msg;
    stack.appendChild(t);
    setTimeout(function(){
      t.style.transition = 'opacity .25s, transform .25s';
      t.style.opacity = '0';
      t.style.transform = 'translateY(-4px)';
      setTimeout(function(){ t.remove(); }, 260);
    }, 2400);
  }

  // ------------------------------ dropdowns ------------------------------

  function bindDropdowns(root){
    $$('[data-dropdown-trigger]', root).forEach(function(trigger){
      if (trigger.__qsdsBound) return;
      trigger.__qsdsBound = true;
      trigger.setAttribute('aria-haspopup', 'menu');
      trigger.setAttribute('aria-expanded', 'false');
      var targetSel = trigger.getAttribute('data-dropdown-trigger');
      var panel = $(targetSel);
      if (!panel) return;
      panel.style.display = 'none';
      function close(){
        panel.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', onDoc, true);
        document.removeEventListener('keydown', onKey, true);
      }
      function onDoc(e){ if (!panel.contains(e.target) && !trigger.contains(e.target)) close(); }
      function onKey(e){ if (e.key === 'Escape') close(); }
      trigger.addEventListener('click', function(e){
        e.stopPropagation();
        var open = panel.style.display !== 'none';
        if (open) { close(); return; }
        var r = trigger.getBoundingClientRect();
        panel.style.position = 'fixed';
        panel.style.top  = (r.bottom + 6) + 'px';
        panel.style.left = r.left + 'px';
        panel.style.display = 'block';
        trigger.setAttribute('aria-expanded', 'true');
        setTimeout(function(){
          document.addEventListener('click', onDoc, true);
          document.addEventListener('keydown', onKey, true);
        }, 0);
      });
    });
  }

  // ------------------------------ modals ------------------------------

  function bindModals(root){
    $$('[data-modal-open]', root).forEach(function(trigger){
      if (trigger.__qsdsBound) return;
      trigger.__qsdsBound = true;
      trigger.addEventListener('click', function(e){
        e.preventDefault();
        var sel  = trigger.getAttribute('data-modal-open');
        var mask = $(sel);
        if (!mask) return;

        // device-frame trick: 若触发按钮在 .device 容器内，把 mask 移到该容器里
        // 以保证在多设备并排预览时 mask 不溢出整个屏幕
        var device = trigger.closest('.device, [data-device-frame]');
        if (device && mask.parentElement !== device) {
          mask.__qsdsOriginalParent = mask.parentElement;
          mask.style.position = 'absolute';
          device.appendChild(mask);
        }

        mask.classList.add('is-open');
        mask.setAttribute('aria-hidden', 'false');
        mask.__qsdsTrigger = trigger;
        document.body.style.overflow = 'hidden';

        // focus first focusable
        setTimeout(function(){
          var f = mask.querySelector('[autofocus], [data-autofocus], button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (f) try { f.focus(); } catch(e){}
        }, 50);
      });
    });

    $$('.modal-mask, .drawer-mask', root).forEach(function(mask){
      if (mask.__qsdsBound) return;
      mask.__qsdsBound = true;

      function close(){
        mask.classList.remove('is-open');
        mask.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (mask.__qsdsOriginalParent) {
          mask.__qsdsOriginalParent.appendChild(mask);
          mask.style.position = '';
          mask.__qsdsOriginalParent = null;
        }
        if (mask.__qsdsTrigger) try { mask.__qsdsTrigger.focus(); } catch(e){}
      }

      mask.addEventListener('click', function(e){
        if (e.target === mask && mask.dataset.preventMask !== 'true') close();
      });
      $$('[data-modal-close]', mask).forEach(function(b){ b.addEventListener('click', close); });
      document.addEventListener('keydown', function(e){
        if (e.key === 'Escape' && mask.classList.contains('is-open') && mask.dataset.preventEsc !== 'true') close();
      });
    });
  }

  // ------------------------------ tabs ------------------------------

  function bindTabs(root){
    $$('[role="tablist"]', root).forEach(function(list){
      if (list.__qsdsBound) return;
      list.__qsdsBound = true;
      var tabs = $$('[role="tab"]', list);
      tabs.forEach(function(tab, i){
        tab.addEventListener('click', function(){ activate(i); });
        tab.addEventListener('keydown', function(e){
          if (e.key === 'ArrowRight') { activate((i+1) % tabs.length); }
          if (e.key === 'ArrowLeft')  { activate((i-1+tabs.length) % tabs.length); }
        });
      });
      function activate(i){
        tabs.forEach(function(t, j){
          var sel = i === j;
          t.setAttribute('aria-selected', sel ? 'true' : 'false');
          t.tabIndex = sel ? 0 : -1;
          var pid = t.getAttribute('aria-controls');
          var p = pid ? document.getElementById(pid) : null;
          if (p) p.hidden = !sel;
          if (sel) try { t.focus(); } catch(e){}
        });
      }
    });
  }

  // ------------------------------ settings panel ------------------------------

  function mountSettingsPanel(triggerSel){
    var trigger = typeof triggerSel === 'string' ? $(triggerSel) : triggerSel;
    if (!trigger) return;

    var panel = document.createElement('div');
    panel.className = 'popover qsds-settings';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', '显示设置');
    panel.innerHTML = [
      '<div class="qsds-settings__group">',
      '  <h4>模式</h4>',
      '  <div class="qsds-segment" data-segment="mode">',
      '    <button data-value="light">亮</button>',
      '    <button data-value="dark">暗</button>',
      '    <button data-value="auto">跟随系统</button>',
      '  </div>',
      '</div>',
      '<div class="qsds-settings__group">',
      '  <h4>主题色</h4>',
      '  <div class="qsds-swatches" data-segment="accent">',
      '    <button class="qsds-swatch" data-accent="ink"      aria-label="墨青"></button>',
      '    <button class="qsds-swatch" data-accent="cinnabar" aria-label="朱砂"></button>',
      '    <button class="qsds-swatch" data-accent="jade"     aria-label="翠玉"></button>',
      '    <button class="qsds-swatch" data-accent="gold"     aria-label="鎏金"></button>',
      '    <button class="qsds-swatch" data-accent="graphite" aria-label="古墨"></button>',
      '  </div>',
      '</div>',
      '<div class="qsds-settings__group">',
      '  <h4>密度</h4>',
      '  <div class="qsds-segment" data-segment="density">',
      '    <button data-value="default">默认</button>',
      '    <button data-value="compact">紧凑</button>',
      '    <button data-value="elder">适老</button>',
      '  </div>',
      '</div>'
    ].join('');
    document.body.appendChild(panel);
    panel.style.display = 'none';
    panel.style.position = 'fixed';

    function refresh(){
      var d = document.documentElement.dataset;
      $$('button', $('[data-segment="mode"]', panel)).forEach(function(b){
        b.setAttribute('aria-pressed', b.getAttribute('data-value') === (d.mode || 'light'));
      });
      $$('button', $('[data-segment="density"]', panel)).forEach(function(b){
        b.setAttribute('aria-pressed', b.getAttribute('data-value') === (d.density || 'default'));
      });
      $$('button', $('[data-segment="accent"]', panel)).forEach(function(b){
        b.setAttribute('aria-pressed', b.getAttribute('data-accent') === (d.accent || 'ink'));
      });
    }

    panel.addEventListener('click', function(e){
      var t = e.target.closest('button[data-value], button[data-accent]');
      if (!t) return;
      var seg = t.parentElement.getAttribute('data-segment');
      if (seg === 'mode')    setMode(t.getAttribute('data-value'));
      if (seg === 'density') setDensity(t.getAttribute('data-value'));
      if (seg === 'accent')  setAccent(t.getAttribute('data-accent'));
      refresh();
    });

    document.addEventListener('qsds:modechange', refresh);
    document.addEventListener('qsds:accentchange', refresh);
    document.addEventListener('qsds:densitychange', refresh);

    function close(){
      panel.style.display = 'none';
      trigger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('click', onDoc, true);
      document.removeEventListener('keydown', onKey, true);
    }
    function onDoc(e){ if (!panel.contains(e.target) && !trigger.contains(e.target)) close(); }
    function onKey(e){ if (e.key === 'Escape') close(); }

    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', function(e){
      e.stopPropagation();
      if (panel.style.display !== 'none') { close(); return; }
      refresh();
      var r = trigger.getBoundingClientRect();
      panel.style.top  = (r.bottom + 8) + 'px';
      panel.style.left = Math.max(8, r.right - 280) + 'px';
      panel.style.display = 'block';
      trigger.setAttribute('aria-expanded', 'true');
      setTimeout(function(){
        document.addEventListener('click', onDoc, true);
        document.addEventListener('keydown', onKey, true);
      }, 0);
    });
  }

  // ------------------------------ fluid (Three.js) ------------------------------

  function readCssColor(varName, fallback){
    var v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
    if (!v) return fallback;
    if (v.charAt(0) === '#') return v;
    // rgb()
    var m = v.match(/rgba?\(([^)]+)\)/);
    if (m) {
      var p = m[1].split(',').map(function(x){ return parseFloat(x); });
      return '#' + ((1<<24) + (p[0]<<16) + (p[1]<<8) + p[2]).toString(16).slice(1);
    }
    return fallback;
  }

  function mountFluid(canvasEl, opts){
    if (typeof THREE === 'undefined') { console.warn('[qsds] THREE not found, fluid disabled'); return; }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    opts = opts || {};

    var W = canvasEl.clientWidth, H = canvasEl.clientHeight;
    var renderer = new THREE.WebGLRenderer({ canvas: canvasEl, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(40, W/H, 0.1, 100);
    camera.position.set(0, 0, 18);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    var dl = new THREE.DirectionalLight(0xffffff, 0.8);
    dl.position.set(5, 8, 6); scene.add(dl);

    var geom = new THREE.PlaneGeometry(36, 22, 96, 64);
    var mat  = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(opts.baseColor || readCssColor('--color-brand-700', '#1B3A5C')),
      metalness: 0.65, roughness: 0.22,
      transmission: 0.85, ior: 1.45,
      transparent: true, opacity: 0.88,
      clearcoat: 0.6, clearcoatRoughness: 0.3,
      side: THREE.DoubleSide,
    });
    var mesh = new THREE.Mesh(geom, mat);
    mesh.rotation.x = -0.6;
    scene.add(mesh);

    var pos = geom.attributes.position;
    var base = pos.array.slice(0);

    function tick(t){
      t = t * 0.0006;
      for (var i = 0; i < pos.count; i++) {
        var x = base[i*3], y = base[i*3+1];
        pos.array[i*3+2] =
          Math.sin(x*0.42 + t) * Math.cos(y*0.38 + t*0.9) * 1.7 +
          Math.sin(x*0.18 - t*0.6) * 0.85 +
          Math.cos(y*0.22 + t*0.5) * 0.55;
      }
      pos.needsUpdate = true;
      mesh.material.color.set(readCssColor('--color-brand-600', '#244A72'));
      renderer.render(scene, camera);
      mesh.__raf = requestAnimationFrame(tick);
    }
    mesh.__raf = requestAnimationFrame(tick);

    function onResize(){
      W = canvasEl.clientWidth; H = canvasEl.clientHeight;
      camera.aspect = W/H; camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    }
    window.addEventListener('resize', onResize);

    canvasEl.__qsdsFluid = {
      destroy: function(){
        cancelAnimationFrame(mesh.__raf);
        window.removeEventListener('resize', onResize);
        renderer.dispose(); geom.dispose(); mat.dispose();
      }
    };
  }

  function initFluid(selector){
    $$(selector || '.fluid-canvas-wrap canvas').forEach(function(c){ mountFluid(c); });
  }

  // ------------------------------ bootstrap ------------------------------

  function bootstrap(){
    // 同步系统主题（仅 mode=auto 时）
    var mql = matchMedia('(prefers-color-scheme: dark)');
    if (mql.addEventListener) mql.addEventListener('change', function(){
      // CSS 通过 @media 已自处理；仅派发事件供监听者刷新 UI
      document.dispatchEvent(new CustomEvent('qsds:systemtheme', { detail: { dark: mql.matches } }));
    });

    bindDropdowns();
    bindModals();
    bindTabs();
    initFluid();
  }

  global.qsds = {
    bootstrap: bootstrap,
    setMode: setMode, toggleMode: toggleMode,
    setAccent: setAccent, setDensity: setDensity,
    listAccents: listAccents,
    toast: toast,
    bindDropdowns: bindDropdowns,
    bindModals: bindModals,
    bindTabs: bindTabs,
    mountSettingsPanel: mountSettingsPanel,
    mountFluid: mountFluid,
    initFluid: initFluid,
  };
})(window);
