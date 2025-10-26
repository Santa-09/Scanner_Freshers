// Frontend Utility Functions for Freshers Party 2025
// ⚠️ IMPORTANT: Replace this URL with your deployed Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbzuLyHSkJDzB9wzMd5C7TfXyGvHJzUTbWCmm4BO2JRTJmjEzxxRSg-rtFmBfy0kCtFdhw/exec";

// Helper function to select DOM elements
function qs(selector) {
  return document.querySelector(selector);
}

// Helper function to select all DOM elements
function qsAll(selector) {
  return document.querySelectorAll(selector);
}

// Parse QR code content into object
function parseQRContent(text) {
  const result = {};
  
  try {
    const pairs = text.split('|');
    pairs.forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value) {
        result[key.trim()] = value.trim();
      }
    });
  } catch (error) {
    console.error('QR Parse Error:', error);
  }
  
  return result;
}

// Display message to user
function showMsg(message, isError = false) {
  const msgEl = document.getElementById('msg');
  
  if (msgEl) {
    msgEl.textContent = message;
    msgEl.style.display = 'block';
    
    if (isError) {
      msgEl.style.color = '#ff6b6b';
      msgEl.style.background = 'rgba(255, 107, 107, 0.1)';
      msgEl.style.borderLeft = '4px solid #ff6b6b';
    } else {
      msgEl.style.color = '#06d6a0';
      msgEl.style.background = 'rgba(6, 214, 160, 0.1)';
      msgEl.style.borderLeft = '4px solid #06d6a0';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      msgEl.style.display = 'none';
      msgEl.textContent = '';
    }, 5000);
  } else {
    // Fallback to alert if msg element not found
    alert(message);
  }
}

// GET request to API
async function apiGet(params) {
  try {
    const url = new URL(API_URL);
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    console.log('API GET Request:', url.toString());
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API GET Response:', data);
    
    return data;
    
  } catch (error) {
    console.error('API GET Error:', error);
    throw error;
  }
}

// POST request to API
async function apiPost(data) {
  try {
    console.log('API POST Request:', data);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API POST Response:', result);
    
    return result;
    
  } catch (error) {
    console.error('API POST Error:', error);
    throw error;
  }
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate registration number
function isValidRegNo(regNo) {
  // At least 3 characters, alphanumeric
  return regNo && regNo.length >= 3 && /^[a-zA-Z0-9]+$/.test(regNo);
}

// Format date to readable string
function formatDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch (error) {
    return dateString;
  }
}

// Get URL parameter
function getUrlParameter(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

// Disable form submission
function disableForm(formId, buttonId, loadingText = 'Processing...') {
  const form = document.getElementById(formId);
  const button = document.getElementById(buttonId);
  
  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => input.disabled = true);
  }
  
  if (button) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
  }
}

// Enable form submission
function enableForm(formId, buttonId, buttonText = 'Submit') {
  const form = document.getElementById(formId);
  const button = document.getElementById(buttonId);
  
  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => input.disabled = false);
  }
  
  if (button) {
    button.disabled = false;
    button.innerHTML = buttonText;
  }
}

// Show loading spinner
function showLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '<div style="text-align: center; padding: 20px;"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--primary);"></i><p>Loading...</p></div>';
  }
}

// Hide loading spinner
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
}

// Copy text to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      showMsg('Copied to clipboard!', false);
    }).catch(err => {
      console.error('Copy failed:', err);
      showMsg('Failed to copy', true);
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      showMsg('Copied to clipboard!', false);
    } catch (err) {
      console.error('Copy failed:', err);
      showMsg('Failed to copy', true);
    }
    
    document.body.removeChild(textArea);
  }
}

// Download QR code as image
function downloadQRCode(canvas, filename = 'qr-code.png') {
  try {
    if (!canvas) {
      showMsg('QR code not available', true);
      return;
    }
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMsg('QR code downloaded!', false);
  } catch (error) {
    console.error('Download error:', error);
    showMsg('Failed to download QR code', true);
  }
}

// Check API connection
async function testApiConnection() {
  try {
    console.log('Testing API connection...');
    const response = await apiGet({ action: 'stats' });
    
    if (response.status === 'ok') {
      console.log('✓ API connection successful!');
      return true;
    } else {
      console.error('✗ API returned error:', response.message);
      return false;
    }
  } catch (error) {
    console.error('✗ API connection failed:', error);
    return false;
  }
}

// Initialize page - call this on page load
function initializePage() {
  console.log('Page initialized');
  console.log('API URL:', API_URL);
  
  // Test API connection in development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    testApiConnection();
  }
  
  // Add form validation listeners
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let isValid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = '#ff6b6b';
        } else {
          field.style.borderColor = '';
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        showMsg('Please fill all required fields', true);
      }
    });
  });
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}

// Export functions for use in other scripts
window.freshersApp = {
  API_URL,
  qs,
  qsAll,
  parseQRContent,
  showMsg,
  apiGet,
  apiPost,
  isValidEmail,
  isValidRegNo,
  formatDate,
  getUrlParameter,
  disableForm,
  enableForm,
  showLoading,
  hideLoading,
  copyToClipboard,
  downloadQRCode,
  testApiConnection
};

console.log('Utils.js loaded successfully');
