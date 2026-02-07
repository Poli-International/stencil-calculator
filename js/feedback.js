// Community Feedback Form Handler
// Sends feedback emails to patrick@poli-international.com
// REQUIRED FOR ALL TOOLS

document.addEventListener('DOMContentLoaded', function() {
    const feedbackForm = document.getElementById('feedbackForm');
    const successMsg = document.getElementById('feedbackSuccess');
    const errorMsg = document.getElementById('feedbackError');

    if (feedbackForm) {
        feedbackForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = {
                email: document.getElementById('userEmail').value,
                role: document.getElementById('userRole').value,
                feedback: document.getElementById('feedbackText').value,
                toolName: document.title, // Automatically gets the tool name from page title
                toolUrl: window.location.href,
                timestamp: new Date().toISOString()
            };

            // Hide previous messages
            successMsg.style.display = 'none';
            errorMsg.style.display = 'none';

            // Disable submit button during submission
            const submitBtn = feedbackForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">Sending...</span>';

            try {
                // Using Web3Forms (Free Email Service)
                // Get your free access key at https://web3forms.com
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        access_key: 'ebd0e138-c7aa-4290-b028-74d1c3fa8faa', // Patrick's Web3Forms key
                        subject: `Poli Tools Feedback: ${formData.toolName}`,
                        from_name: formData.email,
                        email: formData.email,
                        message: `
New Feedback Received from Poli Tools!
========================================

FROM: ${formData.email}
ROLE: ${formData.role}
TOOL: ${formData.toolName}
URL: ${formData.toolUrl}
TIME: ${new Date(formData.timestamp).toLocaleString()}

FEEDBACK:
${formData.feedback}

========================================
Reply to: ${formData.email}
                        `
                    })
                });

                const result = await response.json();

                if (result.success) {
                    // Success!
                    successMsg.style.display = 'block';
                    feedbackForm.reset();

                    // Scroll to success message
                    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Hide success message after 10 seconds
                    setTimeout(() => {
                        successMsg.style.display = 'none';
                    }, 10000);
                } else {
                    throw new Error('Submission failed');
                }

            } catch (error) {
                console.error('Feedback submission error:', error);
                errorMsg.style.display = 'block';
                errorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } finally {
                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }
});
