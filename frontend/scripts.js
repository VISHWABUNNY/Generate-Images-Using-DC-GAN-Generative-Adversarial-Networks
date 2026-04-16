document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("generatedCanvas");
    const ctx = canvas.getContext("2d");
    const generateBtn = document.getElementById("generateBtn");
    const statusChip = document.getElementById("status");

    generateBtn.addEventListener("click", generateImage);

    function setStatus(text, variant = "ready") {
        statusChip.textContent = text;
        statusChip.style.background = variant === "error"
            ? "rgba(255, 92, 92, 0.18)"
            : variant === "loading"
            ? "rgba(75, 172, 255, 0.16)"
            : "rgba(0, 255, 164, 0.15)";
        statusChip.style.color = variant === "error" ? "#ffe7e7" : "#b3ffe1";
    }

    async function generateImage() {
        setStatus("Generating...");
        generateBtn.disabled = true;

        try {
            const response = await fetch("http://127.0.0.1:5000/generate_image");
            if (!response.ok) {
                throw new Error(`Backend responded with status ${response.status}`);
            }
            const data = await response.json();
            drawImage(data.image);
            setStatus("Image generated", "success");
        } catch (error) {
            console.error("Failed to generate image:", error);
            setStatus("Backend error", "error");
            alert("Could not generate image. Make sure the backend is running.");
        } finally {
            generateBtn.disabled = false;
        }
    }

    function drawImage(imageData) {
        let imgArray = imageData;
        if (Array.isArray(imgArray) && imgArray.length === 1 && Array.isArray(imgArray[0])) {
            imgArray = imgArray[0];
        }

        const height = imgArray.length;
        const width = Array.isArray(imgArray[0]) ? imgArray[0].length : 0;
        const pixels = new Uint8ClampedArray(width * height * 4);

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let pixel = imgArray[y][x];
                if (!Array.isArray(pixel)) {
                    pixel = [pixel];
                }
                if (pixel.length === 1) {
                    pixel = [pixel[0], pixel[0], pixel[0]];
                }

                const r = Math.round(pixel[0] * 255);
                const g = Math.round((pixel[1] ?? pixel[0]) * 255);
                const b = Math.round((pixel[2] ?? pixel[0]) * 255);
                const offset = (y * width + x) * 4;

                pixels[offset] = r;
                pixels[offset + 1] = g;
                pixels[offset + 2] = b;
                pixels[offset + 3] = 255;
            }
        }

        const offscreen = document.createElement("canvas");
        offscreen.width = width;
        offscreen.height = height;
        const offscreenCtx = offscreen.getContext("2d");
        offscreenCtx.putImageData(new ImageData(pixels, width, height), 0, 0);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
    }
});
