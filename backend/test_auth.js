
async function testAuth() {
    console.log('--- Testing Registration ---');
    try {
        const regRes = await fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'testauth' + Date.now() + '@example.com',
                username: 'testuser' + Date.now(),
                name: 'Test Agent'
            })
        });
        const regData = await regRes.json();
        console.log('Registration Status:', regRes.status);
        console.log('Registration Data:', regData);
    } catch (error) {
        console.error('Registration Failed:', error.message);
    }

    console.log('\n--- Testing Login ---');
    try {
        const loginRes = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                identifier: 'mauromaiese7@gmail.com'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Data:', loginData);
    } catch (error) {
        console.error('Login Failed:', error.message);
    }
}

testAuth();
