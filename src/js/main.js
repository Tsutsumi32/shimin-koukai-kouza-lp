/************************************************************
 * main.js（動的 import なし／静的 import 版）
 * - JS が実行できた時点で .is_nojs を外す
 * - fetch は「常に静的 import」※ no-op なので実害なし（必要なら下の注釈B参照）
 * - ページ固有が無ければ pages/common.js にフォールバック
 ************************************************************/

// ❶ fetch ポリフィル（whatwg-fetch は自前で fetch がある環境では何もしない＝no-op）
import 'whatwg-fetch';

// ❷ ページモジュールを静的 import（必要な分だけ追加）
import * as common from './pages/common.js';
import * as top from './pages/top.js';
// import * as contactPage from './pages/contactPage.js';
// …ほかのページもここに列挙

// ❸ 例外ルーティング（ファイル名が規則外のものだけキー変換）
const aliasMap = {
  // 'contact-us': 'contactPage',
};

// ❹ ページキーを決定（/ → top, /about.html → about）
function getPageKey() {
  const u = new URL(location.href);
  const pathname = u.pathname.endsWith('/') ? u.pathname.slice(0, -1) : u.pathname;
  let key = decodeURIComponent(pathname.substring(pathname.lastIndexOf('/') + 1))
    .replace(/(\.html|\.php)$/i, '')
    .trim();
  if (!key || key === 'index') key = 'top';
  return aliasMap[key] || key;
}

// ❺ 登録表（上の静的 import と同じキーで並べる）
const PAGES = {
  common,
  top,
  // contactPage,
};

// ❻ JS 実行できている＝no-JS モード解除
document.body.classList.remove('is_nojs');

// ❼ 該当モジュールの init() を呼ぶ（default.init / init 両対応）
(function run() {
  let pageKey = getPageKey();
  let mod = PAGES[pageKey];

  if (!mod) {
    console.warn(`"${pageKey}" が見つからず common にフォールバック`);
    pageKey = 'common';
    mod = PAGES.common;
  }

  const init =
    (mod?.default && typeof mod.default.init === 'function' && mod.default.init) ||
    (typeof mod?.init === 'function' && mod.init) ||
    null;

  if (!init) {
    console.warn(`"${pageKey}" に init() が見つかりませんでした`);
    return;
  }

  const start = () => {
    try {
      init();
    } catch (e) {
      console.error(`${pageKey}.init() エラー`, e);
    }
  };
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', start, { once: true })
    : start();
})();
