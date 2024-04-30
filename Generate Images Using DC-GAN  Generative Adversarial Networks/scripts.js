document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('generatedCanvas');
    const ctx = canvas.getContext('2d');
    const generateBtn = document.getElementById('generateBtn');

    generateBtn.addEventListener('click', function() {
        generateImage();
    });

    function generateImage() {
        $.ajax({
            url: 'http://127.0.0.1:5000/generate_image', // Corrected endpoint URL
            type: 'GET',
            success: function(response) {
                // Assuming response contains the generated image data
                const generatedImageData = response.image;
                drawImage(generatedImageData);
            },
            error: function(xhr, status, error) {
                console.error(error);
            }
        });
    }

    function drawImage(imageData) {
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        img.src = 'data:image/png;base64,' + imageData; // Assuming image data is sent as base64 encoded string
    }
});
