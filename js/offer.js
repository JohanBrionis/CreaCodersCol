(() => {
  const KEY = 'creacoders:welcome-offer:v2-5000';
  const DAY = 24 * 60 * 60 * 1000;
  let started = null;
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === null) {
      started = Date.now();
      localStorage.setItem(KEY, String(started));
    } else {
      const value = Number(saved);
      if (saved.trim() && Number.isFinite(value) && value > 0 && value <= Date.now()) started = value;
    }
  } catch { /* Without durable storage, show normal pricing. */ }
  const all = (selector, action) => document.querySelectorAll(selector).forEach(action);
  function render() {
    const remaining = started === null ? 0 : Math.max(0, started + DAY - Date.now());
    const active = remaining > 0;
    const price = active ? '$3.000' : '$40.000';
    const seconds = Math.ceil(remaining / 1000);
    const clock = [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60].map(n => String(n).padStart(2, '0')).join(':');
    all('[data-price]', el => el.textContent = price + ' COP');
    all('[data-cart-headline]', el => el.textContent = active ? 'Todo por $3.000.' : 'Todo por $40.000.');
    all('[data-item-price]', el => el.textContent = active ? '$750' : '$10.000');
    all('[data-item-original]', el => el.hidden = !active);
    all('[data-item-discount]', el => el.textContent = active ? '−92,5% en el combo' : 'Precio normal');
    all('[data-discount-row]', el => el.hidden = !active);
    all('[data-allocation]', el => el.textContent = active ? 'Solo $750 por pack dentro del combo. Los 4 se compran juntos por $3.000 COP.' : 'Los 4 packs juntos por $40.000 COP. Acceso permanente.');

    all('[data-offer-title]', el => el.textContent = active ? 'OFERTA ACTIVA · LOS 4 PACKS' : 'LOS 4 PACKS · PRECIO NORMAL');
    all('[data-saving]', el => el.textContent = active ? 'Valor por separado: $40.000 COP. Ahorras $37.000 (92,5%).' : '$10.000 COP cada pack · $40.000 COP por los cuatro.');
    all('[data-timer]', el => el.textContent = active ? 'Termina en ' + clock : started === null ? 'Oferta no disponible sin un registro local válido.' : 'Tu oferta de 24 horas ha terminado.');
    all('[data-deadline]', el => el.textContent = active ? 'Vence el ' + new Date(started + DAY).toLocaleString('es-CO', {dateStyle:'medium', timeStyle:'short'}) + ' (hora de tu dispositivo).' : 'Puedes comprar los packs a su precio normal.');
    all('[data-activation]', el => el.textContent = active ? '¡Tu oferta de bienvenida está activa! Tienes 24 horas desde tu primera visita: los 4 packs por $3.000 COP.' : 'Cada pack cuesta $10.000 COP. Acceso permanente con un solo pago.');
    all('[data-included]', el => el.textContent = active ? '✓ Incluido: los 4 por $3.000 COP' : 'Disponible por $10.000 COP');
    all('[data-sticky-price]', el => el.textContent = '4 packs · ' + price + ' COP');
    all('[data-sticky-note]', el => el.textContent = active ? 'Te quedan ' + clock : 'Acceso permanente · precio normal');
    const message = active ? 'Hola, quiero tomar la oferta de los 4 packs (Premium, Python, Java y Web Fullstack) por $3.000 COP en total, con acceso permanente.' : 'Hola, quiero comprar el combo completo de los 4 packs (Premium, Python, Java y Web Fullstack) por $40.000 COP en total, con acceso permanente.';
    all('[data-buy]', el => {
      el.textContent = active ? 'Continuar por WhatsApp →' : 'Comprar combo por WhatsApp →';
      el.href = 'https://wa.me/573026656161?text=' + encodeURIComponent(message);
    });
  }
  render();
  setInterval(render, 1000);
  document.addEventListener('visibilitychange', render);
  document.addEventListener('click', event => { if (event.target.closest('[data-buy]')) render(); });
  window.addEventListener('storage', event => {
    if (event.key === KEY || event.key === null) {
      try {
        const raw = localStorage.getItem(KEY);
        const value = Number(raw);
        started = raw && Number.isFinite(value) && value > 0 && value <= Date.now() ? value : null;
      } catch { started = null; }
      render();
    }
  });
  const search = document.querySelector('#search');
  const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  search?.addEventListener('input', () => {
    const query = normalize(search.value.trim());
    let count = 0;
    all('#syllabus details', section => {
      let matches = 0;
      section.querySelectorAll('li').forEach(row => {
        row.hidden = !normalize(row.textContent).includes(query);
        if (!row.hidden) matches++;
      });
      section.hidden = matches === 0;
      section.open = Boolean(query) && matches > 0;
      count += matches;
    });
    document.querySelector('#search-status').textContent = query ? count + ' resultados' : '';
  });
})();
