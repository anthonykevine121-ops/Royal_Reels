const menuToggle = document.querySelector(".menu-toggle");
const navPanel = document.querySelector(".nav-panel");
const mobileBottomNavItems = document.querySelectorAll(".mobile-bottom-nav-item[data-section]");
const heroVideo = document.querySelector(".hero-video");
const siteHeader = document.querySelector(".site-header");

function setMenuOpen(isOpen) {
	if (!menuToggle || !navPanel) {
		return;
	}

	menuToggle.setAttribute("aria-expanded", String(isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
	navPanel.classList.toggle("is-open", isOpen);
}

if (menuToggle && navPanel) {
	menuToggle.addEventListener("click", () => {
		const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
		setMenuOpen(!isOpen);
	});

	navPanel.addEventListener("click", (event) => {
		if (event.target.closest("a")) {
			setMenuOpen(false);
		}
	});
}

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		setMenuOpen(false);
	}
});

function updateHeaderAppearance() {
	if (siteHeader) {
		siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
	}
}

updateHeaderAppearance();
window.addEventListener("scroll", updateHeaderAppearance, { passive: true });

function setActiveMobileNavItem(sectionId) {
	mobileBottomNavItems.forEach((item) => {
		const isActive = item.dataset.section === sectionId;
		item.classList.toggle("is-active", isActive);
		if (isActive) {
			item.setAttribute("aria-current", "location");
		} else {
			item.removeAttribute("aria-current");
		}
	});
}

function updateActiveMobileNavItem() {
	const activePosition = window.innerHeight * 0.35;
	const activeItem = [...mobileBottomNavItems].find((item) => {
		const section = document.getElementById(item.dataset.section);
		if (!section) {
			return false;
		}

		const bounds = section.getBoundingClientRect();
		return bounds.top <= activePosition && bounds.bottom > activePosition;
	});

	if (activeItem) {
		setActiveMobileNavItem(activeItem.dataset.section);
	}
}

mobileBottomNavItems.forEach((item) => {
	item.addEventListener("click", () => setActiveMobileNavItem(item.dataset.section));
});

window.addEventListener("scroll", updateActiveMobileNavItem, { passive: true });
window.addEventListener("resize", updateActiveMobileNavItem);
updateActiveMobileNavItem();

if (heroVideo) {
	heroVideo.muted = true;
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		heroVideo.pause();
	} else {
		heroVideo.play().catch(() => {});
	}
}
document.addEventListener('DOMContentLoaded', () => {
    // 1. Filtering Functionality
    const filterButtons = document.querySelectorAll('.portfolio-filter');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('is-active');
                btn.setAttribute('aria-pressed', 'false');
            });

            button.classList.add('is-active');
            button.setAttribute('aria-pressed', 'true');

            const filterValue = button.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('is-hidden');
                } else {
                    item.classList.add('is-hidden');
                }
            });
        });
    });

    // 2. Hover Preview Player
    const cards = document.querySelectorAll('.portfolio-card');
    cards.forEach(card => {
        const previewVideo = card.querySelector('.portfolio-preview-video');
        if (!previewVideo) return;

        card.addEventListener('mouseenter', () => {
            previewVideo.currentTime = 0;
            previewVideo.play().catch(() => {}); // Prevent unhandled autoplay errors
        });

        card.addEventListener('mouseleave', () => {
            previewVideo.pause();
        });
    });

    // 3. Lightbox / Video Dialog Player
    const dialog = document.querySelector('.portfolio-dialog');
    const dialogTitle = document.getElementById('portfolio-video-title');
    const dialogVideo = dialog ? dialog.querySelector('.portfolio-dialog-video') : null;
    const dialogEmbed = dialog ? dialog.querySelector('.portfolio-dialog-embed') : null;
    const closeBtn = dialog ? dialog.querySelector('.portfolio-dialog-close') : null;
    const controls = dialog ? dialog.querySelector('.portfolio-controls') : null;

    // Control Elements
    const playToggle = dialog ? dialog.querySelector('.portfolio-play-toggle') : null;
    const progress = dialog ? dialog.querySelector('.portfolio-progress') : null;
    const currentTimeEl = dialog ? dialog.querySelector('.portfolio-time-current') : null;
    const durationTimeEl = dialog ? dialog.querySelector('.portfolio-time-duration') : null;
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60) || 0;
        const secs = Math.floor(seconds % 60) || 0;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const getGoogleDrivePreviewUrl = (videoUrl) => {
        const url = new URL(videoUrl, window.location.href);
        if (url.hostname !== 'drive.google.com') return null;

        const fileId = url.pathname.match(/^\/file\/d\/([^/]+)/)?.[1];
        return fileId ? `https://drive.google.com/file/d/${encodeURIComponent(fileId)}/preview` : null;
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            if (!dialog || !dialogVideo || !dialogEmbed) return;

            const previewVideo = card.querySelector('.portfolio-preview-video source');
            const videoTitle = card.getAttribute('data-video-title') || 'Portfolio preview';
            const videoUrl = card.dataset.video || previewVideo?.src;
            if (!videoUrl) return;

            dialogTitle.textContent = videoTitle;
            dialog.showModal();
            const drivePreviewUrl = getGoogleDrivePreviewUrl(videoUrl);

            if (drivePreviewUrl) {
                dialogVideo.pause();
                dialogVideo.removeAttribute('src');
                dialogVideo.load();
                dialogVideo.hidden = true;
                dialogEmbed.src = drivePreviewUrl;
                dialogEmbed.hidden = false;
                if (controls) controls.hidden = true;
                return;
            }

            dialogEmbed.removeAttribute('src');
            dialogEmbed.hidden = true;
            dialogVideo.hidden = false;
            if (controls) controls.hidden = false;
            dialogVideo.src = videoUrl;
            dialogVideo.muted = true;
            dialogVideo.play();
            if (playToggle) playToggle.innerHTML = '<span aria-hidden="true">&#10074;&#10074;</span>';
        });
    });

    const closeDialog = () => {
        if (!dialog) return;
        dialogVideo.pause();
        dialogVideo.removeAttribute('src');
        dialogVideo.load();
        dialogEmbed.removeAttribute('src');
        dialogEmbed.hidden = true;
        dialogVideo.hidden = false;
        if (controls) controls.hidden = false;
        dialog.close();
    };

    if (closeBtn) closeBtn.addEventListener('click', closeDialog);
    if (dialog) {
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) closeDialog();
        });
    }

    // Controls Implementation
    if (dialogVideo) {
        if (playToggle) {
            playToggle.addEventListener('click', () => {
                if (dialogVideo.paused) {
                    dialogVideo.play();
                    playToggle.innerHTML = '<span aria-hidden="true">&#10074;&#10074;</span>';
                } else {
                    dialogVideo.pause();
                    playToggle.innerHTML = '<span aria-hidden="true">&#9654;</span>';
                }
            });
        }

        dialogVideo.addEventListener('timeupdate', () => {
            if (!progress) return;
            const percentage = (dialogVideo.currentTime / dialogVideo.duration) * 100 || 0;
            progress.value = percentage;
            if (currentTimeEl) currentTimeEl.textContent = formatTime(dialogVideo.currentTime);
            if (durationTimeEl) durationTimeEl.textContent = formatTime(dialogVideo.duration);
        });

        if (progress) {
            progress.addEventListener('input', () => {
                const time = (progress.value / 100) * dialogVideo.duration;
                dialogVideo.currentTime = time;
            });
        }

    }
});