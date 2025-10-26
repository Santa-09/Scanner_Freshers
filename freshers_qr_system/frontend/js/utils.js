const API_URL = "https://script.google.com/macros/s/AKfycbxzNWxLREtoVlj_36rU5znZgB-l7uc_2Pbq-qkvS4-HPJXvXPTk2apJE56NfHc7uJs5og/exec";

function qs(selector) {
  return document.querySelector(selector);
}

function parseQRContent(text) {
  const result = {};
  const pairs = text.split('|');
  pairs.forEach(pair => {
    const [key, value] = pair.split(':');
    if (key && value) {
      result[key.trim()] = value.trim();
    }
  });
  return result;
}

function showMsg(message, isError = false) {
  const msgEl = document.getElementById('msg');
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.style.color = isError ? 'red' : 'green';
    msgEl.style.display = 'block';
    setTimeout(() => {
      msgEl.textContent = '';
      msgEl.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

async function apiGet(params) {
  const url = new URL(API_URL);
  Object.keys(params).forEach(k => url.searchParams.append(k, params[k]));
  const res = await fetch(url);
  return await res.json();
}

async function apiPost(data) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" }
  });
  return await res.json();
}
