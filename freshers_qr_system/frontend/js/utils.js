// Frontend Utility Functions for Freshers Party 2025
// GET-ONLY VERSION to avoid CORS issues

const API_URL = "https://script.google.com/macros/s/AKfycbzaINod-TiU9pTdu7gpGc9GdvkUJrmzAoI_OjbWOrzM6FoHojcGvcMMXuOjzaXMnyGx_w/exec";

// Helper function to select DOM elements
function qs(selector) {
  return document.querySelector(selector);
}

// Display message to user
function showMsg(message, isError = false) {
  const msgEl = document.getElementById('msg');
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.style.color = isError ? '#ff6b6b' : '#06d6a0';
    msgEl.style.background = isError ? 'rgba(255, 107, 107, 0.1)' : 'rgba(6, 214, 160, 0.1)';
    msgEl.style.borderLeft = isError ? '4px solid #ff6b6b' : '4px solid #06d6a0';
    msgEl.style.display = 'block';
    setTimeout(() => {
      msgEl.textContent = '';
      msgEl.style.display = 'none';
    }, 5000);
  } else {
    alert(message);
  }
}

// GET request only - no CORS issues
async function apiGet(params) {
  try {
    const url = new URL(API_URL);
    
    // Add all parameters as query string
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    console.log('🌐 Making GET request:', url.toString());
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✅ API Response:', data);
    return data;
    
  } catch (error) {
    console.error('❌ API Error:', error);
    throw new Error('Network error. Please check your connection and try again.');
  }
}

// Convert POST to GET for registration
async function apiPost(data) {
  // Convert POST data to GET parameters
  const params = {
    action: data.action
  };
  
  if (data.data) {
    params.data = JSON.stringify(data.data);
  }
  if (data.transactionId) {
    params.transactionId = data.transactionId;
  }
  if (data.regNo) {
    params.regNo = data.regNo;
  }
  
  console.log('🔄 Converted POST to GET:', params);
  return await apiGet(params);
}

// Test API connection
async function testApiConnection() {
  try {
    console.log('🔍 Testing API connection...');
    const response = await apiGet({ action: 'getStats' });
    
    if (response.status === 'ok') {
      console.log('✅ API connection successful!');
      return true;
    } else {
      console.error('❌ API returned error:', response.message);
      return false;
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return false;
  }
}

// Initialize page
function initializePage() {
  console.log('🚀 Page initialized');
  
  // Test API connection on load (silent test)
  testApiConnection().then(success => {
    if (success) {
      console.log('✅ API is working correctly');
    } else {
      console.warn('⚠️ API connection issues');
    }
  });
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
