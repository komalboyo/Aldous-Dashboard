document.addEventListener('DOMContentLoaded', () => {
    fetchChatRecords();
});

async function fetchChatRecords() {
    try {
        console.log('Attempting to fetch chat records...');
        
        const response = await fetch('/api/chat-records');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error('Network response was not ok');
        }
        
        const chatRecords = await response.json();
        
        console.log('Received chat records:', chatRecords);
        
        displayChatRecords(chatRecords);
    } catch (error) {
        console.error('Comprehensive Error:', error);
        
        // Display error on the page
        const container = document.getElementById('chatRecords');
        container.innerHTML = `
            <div style="color: red;">
                <h2>Error Fetching Records</h2>
                <p>${error.message}</p>
            </div>
        `;
    }
}

function displayChatRecords(chatRecords) {
    const container = document.getElementById('chatRecords');
    container.innerHTML = ''; // Clear previous content

    if (chatRecords.length === 0) {
        container.innerHTML = '<p>No records found.</p>';
        return;
    }

    chatRecords.forEach((record, index) => {
        const recordDiv = document.createElement('div');
        recordDiv.className = 'record';

        const recordText = document.createElement('pre');
        recordText.textContent = JSON.stringify(record, null, 2);

        recordDiv.appendChild(recordText);
        container.appendChild(recordDiv);
    });
}