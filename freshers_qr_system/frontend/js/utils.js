// Frontend Utility Functions for Freshers Party 2025
// Enhanced CORS Handling Version

// ⚠️ IMPORTANT: Replace this URL with your deployed Web App URL
const API_URL = "https://script.google.com/macros/s/AKfycbwBIpyl1MyfNkA8M3tfZqes-miMFunrUi9I58DCNSwI3TNYzHH1dbYuhsKz9UYU0HaPbQ/exec";

// Configuration
const CONFIG = {
  timeout: 15000, // 15 seconds timeout
  retryAttempts: 2,
  useCorsProxy: false, // Set to true if CORS issues persist
  corsProxyUrl: 'https://cors-anywhere.herokuapp.com/'
};

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
    const alertType = isError ? 'error' : 'success';
    showToast(message, alertType);
  }
}

// Toast notification fallback
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 8px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    animation: slideIn 0.3s ease;
  `;
  
  const colors = {
    success: '#06d6a0',
    error: '#ff6b6b',
    warning: '#ffd166',
    info: '#118ab2'
  };
  
  toast.style.background = colors[type] || colors.info;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 4000);
}

// Enhanced GET request with CORS handling
async function apiGet(params, retryCount = 0) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
  
  try {
    let url;
    
    if (CONFIG.useCorsProxy) {
      url = new URL(CONFIG.corsProxyUrl + API_URL);
    } else {
      url = new URL(API_URL);
    }
    
    // Add query parameters
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    console.log('🔸 API GET Request:', url.toString());
    
    const fetchOptions = {
      method: 'GET',
      mode: CONFIG.useCorsProxy ? 'cors' : 'no-cors',
      cache: 'no-cache',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    };
    
    const response = await fetch(url.toString(), fetchOptions);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // For no-cors mode, we can't read the response
    if (response.type === 'opaque') {
      console.log('⚠️ No-CORS mode: Response details unavailable');
      return { status: 'ok', message: 'Request sent (no-cors mode)' };
    }
    
    const data = await response.json();
    console.log('✅ API GET Response:', data);
    
    return data;
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ API GET Error:', error);
    
    // Retry logic
    if (retryCount < CONFIG.retryAttempts) {
      console.log(`🔄 Retrying API call (${retryCount + 1}/${CONFIG.retryAttempts})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return apiGet(params, retryCount + 1);
    }
    
    // Enhanced error messages
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Server is not responding. Please try again.');
    } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      throw new Error('Network error: Cannot connect to server. Please check:\n• Your internet connection\n• API URL configuration\n• CORS settings');
    } else if (error.message.includes('CORS')) {
      throw new Error('CORS error: Cross-origin request blocked. Trying alternative method...');
    }
    
    throw error;
  }
}

// Enhanced POST request with CORS handling
async function apiPost(data, retryCount = 0) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);
  
  try {
    let url = CONFIG.useCorsProxy ? CONFIG.corsProxyUrl + API_URL : API_URL;
    
    console.log('🔸 API POST Request:', data);
    
    const fetchOptions = {
      method: 'POST',
      mode: CONFIG.useCorsProxy ? 'cors' : 'no-cors',
      cache: 'no-cache',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify(data)
    };
    
    const response = await fetch(url, fetchOptions);
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    // For no-cors mode
    if (response.type === 'opaque') {
      console.log('⚠️ No-CORS mode: Response details unavailable');
      return { status: 'ok', message: 'Request sent (no-cors mode)' };
    }
    
    const result = await response.json();
    console.log('✅ API POST Response:', result);
    
    return result;
    
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('❌ API POST Error:', error);
    
    // Retry logic
    if (retryCount < CONFIG.retryAttempts) {
      console.log(`🔄 Retrying API call (${retryCount + 1}/${CONFIG.retryAttempts})...`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return apiPost(data, retryCount + 1);
    }
    
    // Enhanced error messages
    if (error.name === 'AbortError') {
      throw new Error('Request timeout: Server is not responding. Please try again.');
    } else if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      // Try alternative method: Convert POST to GET
      console.log('🔄 Trying POST-to-GET conversion...');
      return await convertPostToGet(data);
    }
    
    throw error;
  }
}

// Alternative: Convert POST to GET for CORS compatibility
async function convertPostToGet(data) {
  try {
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
    
    console.log('🔄 Converted POST to GET with params:', params);
    return await apiGet(params);
  } catch (error) {
    console.error('❌ POST-to-GET conversion failed:', error);
    throw new Error('All connection methods failed. Please check your network and try again.');
  }
}

// JSONP fallback for maximum compatibility
function apiJsonp(params) {
  return new Promise((resolve, reject) => {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    const url = new URL(API_URL);
    
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    url.searchParams.append('callback', callbackName);
    
    window[callbackName] = function(data) {
      delete window[callbackName];
      document.body.removeChild(script);
      console.log('✅ JSONP Response:', data);
      resolve(data);
    };
    
    const script = document.createElement('script');
    script.src = url.toString();
    script.onerror = () => {
      delete window[callbackName];
      document.body.removeChild(script);
      reject(new Error('JSONP request failed'));
    };
    
    document.body.appendChild(script);
    
    // Timeout
    setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        document.body.removeChild(script);
        reject(new Error('JSONP request timeout'));
      }
    }, CONFIG.timeout);
  });
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate registration number
function isValidRegNo(regNo) {
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

// Get all URL parameters as object
function getAllUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};
  for (const [key, value] of urlParams) {
    params[key] = value;
  }
  return params;
}

// Disable form submission
function disableForm(formId, buttonId, loadingText = 'Processing...') {
  const form = document.getElementById(formId);
  const button = buttonId ? document.getElementById(buttonId) : form?.querySelector('button[type="submit"]');
  
  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
      input.disabled = true;
      input.style.opacity = '0.7';
    });
  }
  
  if (button) {
    button.disabled = true;
    const originalText = button.getAttribute('data-original-text') || button.innerHTML;
    button.setAttribute('data-original-text', originalText);
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${loadingText}`;
  }
}

// Enable form submission
function enableForm(formId, buttonId, buttonText = null) {
  const form = document.getElementById(formId);
  const button = buttonId ? document.getElementById(buttonId) : form?.querySelector('button[type="submit"]');
  
  if (form) {
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => {
      input.disabled = false;
      input.style.opacity = '';
    });
  }
  
  if (button) {
    button.disabled = false;
    const originalText = button.getAttribute('data-original-text') || buttonText || 'Submit';
    button.innerHTML = originalText;
  }
}

// Show loading spinner
function showLoading(elementId, message = 'Loading...') {
  const element = document.getElementById(elementId);
  if (element) {
    const originalContent = element.innerHTML;
    element.setAttribute('data-original-content', originalContent);
    element.innerHTML = `
      <div style="text-align: center; padding: 20px;">
        <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: #8a2be2; margin-bottom: 10px;"></i>
        <p style="color: #666; margin: 0;">${message}</p>
      </div>
    `;
  }
}

// Hide loading spinner
function hideLoading(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    const originalContent = element.getAttribute('data-original-content');
    if (originalContent) {
      element.innerHTML = originalContent;
    }
  }
}

// Copy text to clipboard
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      showMsg('Copied to clipboard!', false);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        showMsg('Copied to clipboard!', false);
        return true;
      } else {
        throw new Error('Copy command failed');
      }
    }
  } catch (error) {
    console.error('Copy failed:', error);
    showMsg('Failed to copy to clipboard', true);
    return false;
  }
}

// Download QR code as image
function downloadQRCode(canvas, filename = 'freshers-pass.png') {
  try {
    if (!canvas) {
      showMsg('QR code not available for download', true);
      return false;
    }
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showMsg('QR code downloaded successfully!', false);
    return true;
  } catch (error) {
    console.error('Download error:', error);
    showMsg('Failed to download QR code', true);
    return false;
  }
}

// Check API connection
async function testApiConnection() {
  try {
    console.log('🔍 Testing API connection...');
    const response = await apiGet({ action: 'getStats' });
    
    if (response.status === 'ok') {
      console.log('✅ API connection successful!');
      return { success: true, data: response };
    } else {
      console.error('❌ API returned error:', response.message);
      return { success: false, error: response.message };
    }
  } catch (error) {
    console.error('❌ API connection failed:', error);
    return { success: false, error: error.message };
  }
}

// Generate QR code using QRCode.js
function generateQRCode(elementId, text, options = {}) {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(elementId);
    if (!element) {
      reject(new Error(`Element with id '${elementId}' not found`));
      return;
    }

    // Clear previous content
    element.innerHTML = '';

    const defaultOptions = {
      width: 256,
      height: 256,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    };

    const qrOptions = { ...defaultOptions, ...options, text };

    try {
      new QRCode(element, qrOptions);
      
      // Wait for QR code to render
      setTimeout(() => {
        const canvas = element.querySelector('canvas');
        if (canvas) {
          resolve(canvas);
        } else {
          reject(new Error('QR code generation failed'));
        }
      }, 100);
    } catch (error) {
      reject(error);
    }
  });
}

// Initialize page - call this on page load
function initializePage() {
  console.log('🚀 Page initialized');
  console.log('🔗 API URL:', API_URL);
  console.log('⚙️  Configuration:', CONFIG);
  
  // Add CSS animations for toasts
  if (!document.querySelector('#toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Test API connection in development
  if (window.location.hostname === 'localhost' || window.location.hostname.includes('vercel')) {
    console.log('🧪 Development mode: Testing API connection...');
    testApiConnection().then(result => {
      if (result.success) {
        console.log('✅ API is working correctly');
      } else {
        console.warn('⚠️ API connection issues:', result.error);
      }
    });
  }
  
  // Add global error handler
  window.addEventListener('error', (event) => {
    console.error('🌐 Global error:', event.error);
  });
  
  // Add unhandled rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    console.error('🌐 Unhandled promise rejection:', event.reason);
  });
}

// Enhanced form validation
function setupFormValidation(formSelector) {
  const forms = document.querySelectorAll(formSelector);
  
  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
      // Real-time validation
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      // Clear error on input
      input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(255, 107, 107)') {
          this.style.borderColor = '';
          const errorElement = this.parentNode.querySelector('.field-error');
          if (errorElement) {
            errorElement.remove();
          }
        }
      });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });
      
      if (!isValid) {
        e.preventDefault();
        showMsg('Please fix the errors in the form before submitting.', true);
      }
    });
  });
}

// Validate individual form field
function validateField(field) {
  let isValid = true;
  let errorMessage = '';
  
  // Clear previous error
  const existingError = field.parentNode.querySelector('.field-error');
  if (existingError) {
    existingError.remove();
  }
  
  // Required field validation
  if (field.hasAttribute('required') && !field.value.trim()) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  
  // Email validation
  if (field.type === 'email' && field.value.trim() && !isValidEmail(field.value)) {
    isValid = false;
    errorMessage = 'Please enter a valid email address';
  }
  
  // Registration number validation
  if (field.name === 'regNo' && field.value.trim() && !isValidRegNo(field.value)) {
    isValid = false;
    errorMessage = 'Registration number must be at least 3 characters (letters and numbers only)';
  }
  
  // Show error
  if (!isValid) {
    field.style.borderColor = '#ff6b6b';
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.style.cssText = 'color: #ff6b6b; font-size: 0.8rem; margin-top: 4px;';
    errorElement.textContent = errorMessage;
    field.parentNode.appendChild(errorElement);
  } else {
    field.style.borderColor = '#06d6a0';
  }
  
  return isValid;
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
  CONFIG,
  qs,
  qsAll,
  parseQRContent,
  showMsg,
  showToast,
  apiGet,
  apiPost,
  apiJsonp,
  convertPostToGet,
  isValidEmail,
  isValidRegNo,
  formatDate,
  getUrlParameter,
  getAllUrlParameters,
  disableForm,
  enableForm,
  showLoading,
  hideLoading,
  copyToClipboard,
  downloadQRCode,
  testApiConnection,
  generateQRCode,
  setupFormValidation,
  validateField
};

console.log('✅ Utils.js loaded successfully with enhanced CORS handling');
