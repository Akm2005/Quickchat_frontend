async function postData(url, data) {
    try {
        console.log('POST Request URL:', url);
        console.log('POST Request Data:', JSON.stringify(data, null, 2));

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseBody = await response.text(); // Get raw text first
        console.log('Response Status:', response.status);
        console.log('Response Body:', responseBody);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseBody}`);
        }

        return JSON.parse(responseBody); // Parse JSON if successful
    } catch (error) {
        console.error('Error in POST request:', error.message);
        throw error;
    }
}
async function getData(url) {
    try {
        console.log('POST Request URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });

        const responseBody = await response.text(); // Get raw text first
        console.log('Response Status:', response.status);
        console.log('Response Body:', responseBody);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, body: ${responseBody}`);
        }

        return JSON.parse(responseBody); // Parse JSON if successful
    } catch (error) {
        console.error('Error in POST request:', error.message);
        throw error;
    }
}

export{postData,getData}