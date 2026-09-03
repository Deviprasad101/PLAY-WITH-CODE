document.addEventListener('DOMContentLoaded', () => {
    const helicopterImg = document.getElementById('helicopter-img');
    const helicopter = document.getElementById('helicopter');
    const loginForm = document.getElementById('loginForm');
    const skyContainer = document.querySelector('.sky-container');

    // Remove solid blue background from the sticker using Canvas
    function removeBlueBackground(imgElement) {
        if (!imgElement.complete) {
            imgElement.onload = () => processImage(imgElement);
        } else {
            processImage(imgElement);
        }
    }

    function processImage(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Get background color from top-left pixel
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];
        
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i+1];
            const b = data[i+2];
            
            // Calculate color distance
            const dist = Math.sqrt(
                Math.pow(r - bgR, 2) + 
                Math.pow(g - bgG, 2) + 
                Math.pow(b - bgB, 2)
            );
            
            // If close to background color, make transparent (tolerance 65)
            if (dist < 65) {
                data[i+3] = 0;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        img.src = canvas.toDataURL('image/png');
    }

    removeBlueBackground(helicopterImg);

    // Wait for helicopter to fly in, then start bobbing and unroll the banner
    setTimeout(() => {
        helicopter.style.animation = 'none'; // Stop fly in
        helicopter.classList.add('bobbing'); // Start infinite bob
        
        // Unroll the 3D banner
        setTimeout(() => {
            loginForm.classList.add('unrolled');
        }, 300);
        
    }, 6000); // Fly in animation is 6s

    // Add subtle parallax to clouds on mouse move
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 10;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        
        skyContainer.style.backgroundPosition = `${50 + x}% ${50 + y}%`;
    });
});
