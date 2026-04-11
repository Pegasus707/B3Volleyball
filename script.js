// --- 1. THEME TOGGLE LOGIC ---
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('b3-theme');

// Apply saved theme immediately
if (currentTheme === 'light') {
    document.body.classList.add('light-mode');
    if(themeToggleBtn) themeToggleBtn.textContent = '🌙';
}

if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        
        let theme = 'dark';
        if (document.body.classList.contains('light-mode')) {
            theme = 'light';
            themeToggleBtn.textContent = '🌙'; 
        } else {
            themeToggleBtn.textContent = '☀️'; 
        }
        localStorage.setItem('b3-theme', theme);
    });
}

// --- 2. B3 MASTER ROSTER DATA (With Traits) ---
const b3Roster = [
    { 
        name: "Tanmay Waghmare", ovr: 92, 
        bio: "The main attacking force of B3. His heavy spikes are expertly placed to break right through the opponent's block.", 
        stats: [95, 62, 75, 80], 
        traits: ['Cannon Arm', 'Clutch'],
        image: "images/tanmay.png" 
    },
    { 
        name: "Archit Surve", ovr: 94, 
        bio: "The defensive wall. He reads the court perfectly and specializes in digging up 'impossible' spikes to keep the rally alive.", 
        stats: [45, 99, 88, 95], 
        traits: ['Brick Wall', 'Court General'],
        image: "images/archit.png" 
    },
    { 
        name: "Dhruv Rohinikar", ovr: 90, 
        bio: "A perfect balance of attack and defense. A highly reliable spiker who can seamlessly transition into a steady receiver.", 
        stats: [88, 86, 82, 84], 
        traits: ['All-Rounder', 'Consistent'],
        image: "images/dhruv.png" 
    },
    { 
        name: "Varun Shinde", ovr: 89, 
        bio: "An aggressive frontline spiker. His main job is to convert tight sets near the net into guaranteed points.", 
        stats: [92, 65, 70, 78], 
        traits: ['Net Enforcer', 'Finisher'],
        image: "images/varun.png" 
    },
    { 
        name: "Aryan Patil", ovr: 88, 
        bio: "Known for his high vertical jump and lightning-fast spikes. He dictates the pace of a fast-tempo game.", 
        stats: [90, 68, 72, 85], 
        traits: ['Airborne', 'Quick Tempo'],
        image: "images/aryan.png" 
    },
    { 
        name: "Sahil Satpute", ovr: 87, 
        bio: "The receiving specialist. He absorbs heavy serves and delivers them with pinpoint accuracy right to the setter.", 
        stats: [50, 94, 85, 82], 
        traits: ['Laser Pass', 'Anchor'],
        image: "images/sahil.png" 
    },
    { 
        name: "Rishikesh", ovr: 91, 
        bio: "The ultimate utility player. Whether stepping up as a clutch spiker or a secondary libero, he delivers under pressure.", 
        stats: [86, 92, 78, 88], 
        traits: ['Utility Knife', 'Ice Cold'],
        image: "images/rishikesh.png" 
    },
    { 
        name: "Soham Loke", ovr: 88, 
        bio: "A pure power hitter. His swing is designed to put maximum pressure on the opponent's backcourt defense.", 
        stats: [94, 60, 68, 82], 
        traits: ['Powerhouse', 'Intimidator'],
        image: "images/Soham.png" 
    },
    { 
        name: "Vedant Nage", ovr: 87, 
        bio: "A high-energy spiker. His fast-paced approach and aggressive swings make him incredibly hard to time for a block.", 
        stats: [91, 64, 72, 84], 
        traits: ['High Energy', 'Unpredictable'],
        image: "images/vedant.png" 
    }
];

// --- 3. HOME PAGE LOGIC (Carousel) ---
const heroCarousel = document.getElementById('hero-carousel');
if (heroCarousel) {
    const slides = document.querySelectorAll('.carousel-slide');
    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    setInterval(nextSlide, 5000); // Rotates every 5 seconds
}

// --- 4. SQUAD PAGE LOGIC (Grid & 3D Modal) ---
const squadGrid = document.getElementById('squad-grid');
if (squadGrid) {
    const modalOverlay = document.getElementById('player-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modalCardContainer = document.getElementById('modal-card-container');
    let currentChart = null;

    // Render the Square Portraits Grid
    function renderGrid() {
        b3Roster.forEach((player, index) => {
            const squareHTML = `
                <div class="square-portrait" onclick="openPlayerCard(${index})">
                    <img src="${player.image}" alt="${player.name}" class="portrait-img">
                    <div class="portrait-overlay">
                        <span class="portrait-name">${player.name}</span>
                        <span class="portrait-ovr">${player.ovr} OVR</span>
                    </div>
                </div>
            `;
            squadGrid.insertAdjacentHTML('beforeend', squareHTML);
        });
    }

    // Open Modal, Inject Traits, Draw Chart, and Init 3D Tilt
    window.openPlayerCard = function(index) {
        const player = b3Roster[index];
        
        // Generate the HTML for the traits
        const traitsHTML = player.traits.map(trait => `<span class="trait-badge">${trait}</span>`).join('');

        modalCardContainer.innerHTML = `
            <div class="player-card" id="tilt-card">
                <div class="card-image" style="background-image: url('${player.image}');"></div>
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="player-name">${player.name}</h3>
                        <div class="ovr-badge">${player.ovr} OVR</div>
                    </div>
                    <div class="player-traits">
                        ${traitsHTML}
                    </div>
                    <p class="bio">${player.bio}</p>
                    <div class="chart-container">
                        <canvas id="modal-chart"></canvas>
                    </div>
                </div>
            </div>
        `;
        
        modalOverlay.classList.remove('hidden');
        drawChart(player);

        // Initialize the VanillaTilt 3D Effect
        if (typeof VanillaTilt !== 'undefined') {
            VanillaTilt.init(document.querySelector("#tilt-card"), {
                max: 12,
                speed: 400,
                glare: true,
                "max-glare": 0.25,
                scale: 1.02
            });
        }
    };

    // Draw Radar Chart
    function drawChart(player) {
        const ctx = document.getElementById('modal-chart').getContext('2d');
        if (currentChart) currentChart.destroy(); 
        
        currentChart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['POWER', 'DEFENSE', 'PRECISION', 'SPEED'],
                datasets: [{
                    label: 'Stats', 
                    data: player.stats,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: '#ffffff', 
                    pointBackgroundColor: '#000000',
                    pointBorderColor: '#ffffff', 
                    borderWidth: 2, 
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: { color: '#888888', font: { family: 'Inter', size: 10, weight: '600' } },
                        ticks: { display: false, min: 0, max: 100 }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    }

    // Modal Close Listeners
    closeModalBtn.addEventListener('click', () => modalOverlay.classList.add('hidden'));
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) modalOverlay.classList.add('hidden');
    });

    // Initialize Grid on load
    renderGrid();
}