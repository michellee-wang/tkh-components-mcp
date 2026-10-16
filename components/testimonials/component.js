(() => {
  document.querySelectorAll('.tkh-testi').forEach((root) => {
    const vp = root.querySelector('.tkh-testi__viewport');
    const track = root.querySelector('.tkh-testi__track');
    const real = [...track.children];
    const n = real.length; if (!n) return;
    const speed = +root.dataset.speed || 1000, delay = +root.dataset.autoplay || 8000;
    track.prepend(real[n - 1].cloneNode(true));
    track.append(real[0].cloneNode(true));
    let i = 1, busy = false, timer;
    const cur = root.querySelector('.tkh-testi__cur');
    const setH = () => { vp.style.height = track.children[i].offsetHeight + 'px'; };
    const go = (to, animate = true) => {
      i = to;
      track.style.transition = animate ? 'transform ' + speed + 'ms ease' : 'none';
      track.style.transform = 'translateX(' + (-100 * i) + '%)';
      cur.textContent = ((i - 1 + n) % n) + 1;
      setH();
    };
    track.addEventListener('transitionend', (e) => {
      if (e.target !== track) return;
      busy = false;
      if (i === 0) go(n, false);
      if (i === n + 1) go(1, false);
    });
    const step = (d) => { if (busy) return; busy = true; go(i + d); };
    const restart = () => { clearInterval(timer); timer = setInterval(() => step(1), delay); };
    root.querySelector('.tkh-testi__prev').addEventListener('click', () => { step(-1); restart(); });
    root.querySelector('.tkh-testi__next').addEventListener('click', () => { step(1); restart(); });
    window.addEventListener('resize', setH);
    window.addEventListener('load', setH);
    go(1, false); restart();
  });
})();
