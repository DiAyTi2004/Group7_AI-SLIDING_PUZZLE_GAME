var defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8']
};

function shoot() {
    confetti({
        ...defaults,
        particleCount: 40,
        scalar: 1.2,
        shapes: ['star']
    });

    confetti({
        ...defaults,
        particleCount: 10,
        scalar: 0.75,
        shapes: ['circle']
    });

    confetti({
        ...defaults,
        particleCount: 80,
        scalar: 1.2,
        shapes: ['star']
    });
}