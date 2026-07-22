/**
 * Banner utility functions
 */

function closeBanner() {
    const banner = document.getElementById('v2-banner');
    const sidebar = document.getElementById('chat-sidebar');
    const workspace = document.getElementById('workspace');

    if (banner && sidebar && workspace) {
        banner.style.display = 'none';
        sidebar.style.marginTop = '0';
        workspace.style.marginTop = '0';
    }
}

// Make function globally available
window.closeBanner = closeBanner;