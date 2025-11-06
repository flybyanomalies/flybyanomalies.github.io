// 左の実幅を取得し、:root に --left-w を設定する
(() => {
  const left = document.getElementById('left');
  const root = document.documentElement;

  if (!left) return;

  const update = () => {
    // 表示上の実幅（サブピクセル対応のため getBoundingClientRect を使用）
    let w = left.getBoundingClientRect().width;

    // ビューポートより大きくなるケースをケア
    const vw = window.innerWidth || document.documentElement.clientWidth;
    w = Math.min(w, vw);

    // 0未満になることはないが、念のためガード
    w = Math.max(0, Math.round(w));

    root.style.setProperty('--left-w', `${w}px`);
  };

  // 初期化：DOM・画像・フォント読み込み後にも再計算
  window.addEventListener('load', update);
  window.addEventListener('resize', update);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(update);
  }

  // 左の内容が動的に変わる場合に備えて ResizeObserver で監視
  const ro = new ResizeObserver(() => {
    // レイアウト連続更新を抑えるため rAF で1フレームに集約
    requestAnimationFrame(update);
  });
  ro.observe(left);

  // 初回実行
  update();
})();
