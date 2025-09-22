// Test script for Cloudinary upload API (without presets)
// Run with: node test-upload-api.js

const fs = require('fs');
const FormData = require('form-data');

async function testUploadAPI() {
  console.log('Testing Cloudinary upload API...');
  
  // Test with a simple text file (you can replace with actual image)
  const testContent = 'This is a test file for Cloudinary upload';
  const testFile = Buffer.from(testContent);
  
  const formData = new FormData();
  formData.append('file', testFile, {
    filename: 'test-image.txt',
    contentType: 'text/plain'
  });
  formData.append('resourceType', 'raw'); // Use 'raw' for text files, 'image' for images
  
  try {
    const response = await fetch('http://localhost:3000/api/upload/cloudinary', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    console.log('Upload API Response:', result);
    
    if (response.ok) {
      console.log('✅ Upload test successful!');
      console.log('Secure URL:', result.secure_url);
      return result.secure_url;
    } else {
      console.log('❌ Upload test failed:', result.error);
      return null;
    }
  } catch (error) {
    console.error('❌ Upload test error:', error.message);
    return null;
  }
}

async function testPropertyAPI(imageUrl) {
  console.log('\nTesting Property API with uploaded image...');
  
  const propertyData = {
    category: 'apartment',
    title: 'Test Property with Upload',
    description: 'This property was created with uploaded files',
    price: 250000,
    location: 'Karachi, Pakistan',
    area: '1200 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['parking', 'gym', 'pool'],
    images: imageUrl ? [imageUrl] : [],
    videos: []
  };
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/properties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(propertyData),
    });
    
    const result = await response.json();
    console.log('Property API Response:', result);
    
    if (response.ok) {
      console.log('✅ Property creation test successful!');
    } else {
      console.log('❌ Property creation test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Property test error:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  // Test upload first
  const uploadedUrl = await testUploadAPI();
  
  // Test property creation with uploaded URL
  await testPropertyAPI(uploadedUrl);
  
  console.log('\n✨ Tests completed!');
}

runTests();