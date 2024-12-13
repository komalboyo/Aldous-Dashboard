document.addEventListener('DOMContentLoaded', () => {
    fetchChatRecords();
});

async function fetchChatRecords() {
    try {
        const response = await fetch('/api/chat-records');
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error('Network response was not ok: ' + errorText);
        }
        
        const chatRecords = await response.json();
        displayChatRecords(chatRecords);
    } catch (error) {
        displayErrorMessage(error.message);
    }
}

function displayErrorMessage(message) {
    const container = document.getElementById('chatRecords');
    container.innerHTML = `
        <div class="no-records">
            <h2>Error Fetching Records</h2>
            <p>${message}</p>
        </div>
    `;
}

function displayChatRecords(chatRecords) {
    const container = document.getElementById('chatRecords');
    container.innerHTML = ''; // Clear previous content

    if (!chatRecords || chatRecords.length === 0) {
        container.innerHTML = '<div class="no-records">No chat records found.</div>';
        return;
    }

    chatRecords.forEach((record, index) => {
        const sessionDiv = document.createElement('div');
        sessionDiv.className = 'chat-session';

        // Parse the provided timestamp format
        const createdAt = new Date(record.created_at).toLocaleString();

        // Create session header
        const headerDiv = document.createElement('div');
        headerDiv.className = 'session-header';
        headerDiv.innerHTML = `
            <h3>Chat Session ${index + 1}</h3>
            <span>${createdAt}</span>
            <i class="fas fa-chevron-down toggle-icon"></i>
        `;

        // Create QA pairs container
        const qaPairsDiv = document.createElement('div');
        qaPairsDiv.className = 'qa-pairs';

        if (record.qa_pairs && Array.isArray(record.qa_pairs)) {
            record.qa_pairs.forEach(qa => {
                const qaPairDiv = document.createElement('div');
                qaPairDiv.className = 'qa-pair';

                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
                questionDiv.textContent = `Q: ${qa.question || 'No question found'}`;

                const answerDiv = document.createElement('div');
                answerDiv.className = 'answer';
                answerDiv.textContent = `A: ${qa.answer || 'No answer found'}`;

                // Parse the provided timestamp format for each QA pair
                const qaTimestamp = new Date(qa.timestamp).toLocaleString();

                const timestampDiv = document.createElement('div');
                timestampDiv.className = 'timestamp';
                timestampDiv.textContent = qaTimestamp;

                qaPairDiv.appendChild(questionDiv);
                qaPairDiv.appendChild(answerDiv);
                qaPairDiv.appendChild(timestampDiv);

                qaPairsDiv.appendChild(qaPairDiv);
            });
        } else {
            qaPairsDiv.innerHTML = '<div class="no-records">No Q&A pairs found for this session.</div>';
        }

        // Add event listener to toggle QA pairs
        headerDiv.addEventListener('click', () => {
            headerDiv.classList.toggle('active');
            qaPairsDiv.style.display = 
                qaPairsDiv.style.display === 'block' ? 'none' : 'block';
        });

        sessionDiv.appendChild(headerDiv);
        sessionDiv.appendChild(qaPairsDiv);
        container.appendChild(sessionDiv);
    });
}