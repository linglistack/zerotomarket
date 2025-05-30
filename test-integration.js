#!/usr/bin/env node

// ZeroToMarket Integration Test
// Tests the connection between frontend and backend

const axios = require('axios');

const BACKEND_URL = 'http://localhost:8000';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendHealth() {
    console.log('🔍 Testing backend health...');
    try {
        const response = await axios.get(`${BACKEND_URL}/health`);
        console.log('✅ Backend health check passed');
        console.log(`   Status: ${response.data.status}`);
        console.log(`   Agents: ${response.data.agents?.join(', ')}`);
        console.log(`   Sponsors: ${response.data.sponsors?.join(', ')}`);
        return true;
    } catch (error) {
        console.log('❌ Backend health check failed');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testCampaignCreation() {
    console.log('🚀 Testing campaign creation...');
    try {
        const productData = {
            name: 'TestProduct',
            description: 'A test product for integration testing',
            target_audience: 'developers',
            industry: 'tech'
        };
        
        const response = await axios.post(`${BACKEND_URL}/start-campaign`, productData);
        console.log('✅ Campaign creation test passed');
        console.log(`   Campaign ID: ${response.data.campaign_id}`);
        console.log(`   Status: ${response.data.status}`);
        
        // Test campaign status retrieval
        const statusResponse = await axios.get(`${BACKEND_URL}/campaign/${response.data.campaign_id}`);
        console.log('✅ Campaign status retrieval test passed');
        console.log(`   Campaign Status: ${statusResponse.data.status}`);
        
        return true;
    } catch (error) {
        console.log('❌ Campaign creation test failed');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function testFrontendConnection() {
    console.log('🌐 Testing frontend connection...');
    try {
        const response = await axios.get(FRONTEND_URL);
        console.log('✅ Frontend connection test passed');
        console.log(`   Status: ${response.status}`);
        return true;
    } catch (error) {
        console.log('❌ Frontend connection test failed');
        console.log(`   Error: ${error.message}`);
        return false;
    }
}

async function runIntegrationTests() {
    console.log('🧪 ZeroToMarket Integration Tests\n');
    
    const tests = [
        { name: 'Backend Health', test: testBackendHealth },
        { name: 'Campaign Creation', test: testCampaignCreation },
        { name: 'Frontend Connection', test: testFrontendConnection }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const { name, test } of tests) {
        console.log(`\n--- ${name} Test ---`);
        const result = await test();
        if (result) {
            passed++;
        } else {
            failed++;
        }
    }
    
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    
    if (failed === 0) {
        console.log('\n🎉 All integration tests passed! The system is ready for demo.');
    } else {
        console.log('\n⚠️  Some tests failed. Please check the backend and frontend are running.');
        console.log('   Backend: npm run dev (in BACKEND folder)');
        console.log('   Frontend: npm start (in root folder)');
    }
}

// Run tests
runIntegrationTests().catch(console.error); 