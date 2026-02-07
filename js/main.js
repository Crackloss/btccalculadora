/**
 * Bitcoin Calculadora - JavaScript principal
 * https://bitcoincalculadora.com
 */

const SITE_URL = 'https://bitcoincalculadora.com';

/**
 * APIs para obtener precio de BTC con fallback
 */
const API_SOURCES = [
  {
    name: 'CoinGecko',
    url: 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur',
    parsePrice: (data) => data.bitcoin.eur
  },
  {
    name: 'Blockchain.info',
    url: 'https://blockchain.info/ticker',
    parsePrice: (data) => data.EUR.last
  },
  {
    name: 'CoinCap',
    url: 'https://api.coincap.io/v2/assets/bitcoin',
    parsePrice: (data) => parseFloat(data.data.priceUsd) * 0.92
  }
];

let btcPrice = null;
let currentApiSource = null;

/**
 * Obtener precio de BTC con fallback entre APIs
 */
async function fetchBtcPrice() {
  const priceDot = document.getElementById('price-dot');
  const priceDisplay = document.getElementById('btc-price');
  const apiSourceDisplay = document.getElementById('api-source');

  if (priceDot) priceDot.className = 'price-dot loading';

  for (const api of API_SOURCES) {
    try {
      const response = await fetch(api.url);
      if (!response.ok) continue;
      
      const data = await response.json();
      btcPrice = api.parsePrice(data);
      currentApiSource = api.name;
      
      if (priceDisplay) {
        priceDisplay.textContent = formatEur(btcPrice);
      }
      if (apiSourceDisplay) {
        apiSourceDisplay.textContent = `vía ${api.name}`;
      }
      if (priceDot) {
        priceDot.className = 'price-dot';
      }
      
      // Disparar evento para que las calculadoras se actualicen
      window.dispatchEvent(new CustomEvent('btcPriceUpdated', { detail: { price: btcPrice } }));
      
      return btcPrice;
      
    } catch (error) {
      console.warn(`API ${api.name} falló:`, error);
      continue;
    }
  }

  if (priceDisplay) priceDisplay.textContent = 'sin conexión';
  if (priceDot) priceDot.className = 'price-dot error';
  
  return null;
}

/**
 * Formatear número grande con M para millones
 */
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  return num.toLocaleString('es-ES');
}

/**
 * Formatear como euros
 */
function formatEur(num) {
  return num.toLocaleString('es-ES', { maximumFractionDigits: 0 }) + ' €';
}

/**
 * Formatear BTC
 */
function formatBtc(num) {
  return num.toFixed(8) + ' BTC';
}

/**
 * Formatear satoshis
 */
function formatSats(sats) {
  return formatNumber(sats) + ' sats';
}

/**
 * Formatear satoshis con ambos formatos
 */
function formatSatsFull(sats) {
  return `${formatNumber(sats)} sats (${sats.toLocaleString('es-ES')} sats)`;
}

/**
 * Convertir EUR a BTC
 */
function eurToBtc(eur) {
  if (!btcPrice || eur <= 0) return 0;
  return eur / btcPrice;
}

/**
 * Convertir EUR a Satoshis
 */
function eurToSats(eur) {
  return Math.round(eurToBtc(eur) * 100000000);
}

/**
 * Convertir BTC a EUR
 */
function btcToEur(btc) {
  if (!btcPrice || btc <= 0) return 0;
  return btc * btcPrice;
}

/**
 * Convertir Satoshis a EUR
 */
function satsToEur(sats) {
  return btcToEur(sats / 100000000);
}

/**
 * Compartir en Twitter/X
 */
function shareOnTwitter(text, url = SITE_URL) {
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(tweetUrl, '_blank', 'width=550,height=420');
}

/**
 * Inicializar precio y auto-actualización
 */
function initPriceUpdates(intervalMs = 60000) {
  fetchBtcPrice();
  setInterval(fetchBtcPrice, intervalMs);
  
  // Botón de refrescar precio manual
  const refreshBtn = document.getElementById('refresh-price');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fetchBtcPrice();
    });
  }
}

/**
 * Getter para precio actual
 */
function getBtcPrice() {
  return btcPrice;
}

// Exportar funciones si se usa como módulo
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchBtcPrice,
    formatNumber,
    formatEur,
    formatBtc,
    formatSats,
    formatSatsFull,
    eurToBtc,
    eurToSats,
    btcToEur,
    satsToEur,
    shareOnTwitter,
    initPriceUpdates,
    getBtcPrice,
    SITE_URL
  };
}
