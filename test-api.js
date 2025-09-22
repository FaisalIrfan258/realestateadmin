// Simple test script to verify the properties API endpoint
// Run with: node test-api.js

async function testPropertiesAPI() {
  const propertyData = {
    category: 'apartment',
    title: 'Test Property',
    description: 'This is a test property',
    price: 250000,
    location: 'Karachi, Pakistan',
    area: '1200 sq ft',
    bedrooms: 2,
    bathrooms: 2,
    amenities: ['parking', 'gym', 'pool'],
    images: [
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/property1.jpg',
      'https://res.cloudinary.com/your-cloud/image/upload/v1234567890/property2.jpg'
    ],
    videos: [
      'https://res.cloudinary.com/your-cloud/video/upload/v1234567890/property-tour.mp4'
    ]
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
    console.log('API Response:', result);
    
    if (response.ok) {
      console.log('✅ API test successful!');
      console.log('Property created with data:', result.data);
    } else {
      console.log('❌ API test failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the test
testPropertiesAPI();