const axios = require('axios');

const baseURL = 'http://localhost:5000';

async function testBackend() {
  try {
    console.log('🧪 Testing backend server...');
    
    // Test health endpoint
    console.log('Testing health endpoint...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Health check passed:', healthResponse.data);
    
    // Test advisor submission
    console.log('Testing advisor submission...');
    const testData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@test.com',
      phone: '555-123-4567',
      streetAddress: '123 Test St',
      city: 'Test City',
      state: 'CA',
      zipCode: '12345',
      advisorId: 'TEST001',
      department: 'Sales',
      startDate: '2024-01-15',
      active: true
    };
    
    const submitResponse = await axios.post(`${baseURL}/api/submit-advisor`, testData);
    console.log('✅ Advisor submission passed:', submitResponse.data);
    
    // Test retrieving data
    console.log('Testing data retrieval...');
    const dataResponse = await axios.get(`${baseURL}/api/advisors`);
    console.log('✅ Data retrieval passed. Records found:', dataResponse.data.data.length);
    
    console.log('🎉 All tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

testBackend();