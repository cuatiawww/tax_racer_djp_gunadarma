document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('mylegend_canvas');
    const ctx = canvas.getContext('2d');

    // Daftar logo dengan ukuran yang diinginkan
    const logos = [
        { src: './images/logo1.png', width: 600, height: 185 }, 
        { src: './images/logo2.png', width: 634, height: 393 }, 
        { src: './images/logo3.png', width: 634, height: 393 }
    ];
    let currentLogo = 0;
    let opacity = 0;
    let fadeIn = true;

    function showNextLogo() {
        if (currentLogo < logos.length) {
            const img = new Image();
            img.src = logos[currentLogo].src;
            img.onload = () => {
                const fadeInterval = setInterval(() => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = opacity;
                    
                    // Mengatur ukuran gambar
                    const logoWidth = logos[currentLogo].width;
                    const logoHeight = logos[currentLogo].height;
                    const xPos = (canvas.width - logoWidth) / 2;  // Posisi tengah horizontal
                    const yPos = (canvas.height - logoHeight) / 2; // Posisi tengah vertikal
                    
                    ctx.drawImage(img, xPos, yPos, logoWidth, logoHeight);

                    if (fadeIn) {
                        opacity += 0.05;
                        if (opacity >= 1) {
                            fadeIn = false;
                            setTimeout(() => {
                                fadeIn = true;
                                clearInterval(fadeInterval);
                                opacity = 0;
                                currentLogo++;
                                showNextLogo();
                            }, 1000); // Durasi logo terlihat penuh sebelum fade out
                        }
                    }
                }, 50); // Interval untuk efek fade
            };
        } else {
            // Remove the canvas element after the transition
            canvas.parentElement.removeChild(canvas);
            
            // Call the loadGame function to start the pre_loader and menu
            loadGame();
        }
    }

    showNextLogo();
});
