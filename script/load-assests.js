const { getFullPath, getImage, getText } = require("./file-service");

async function loadAssests() {
    try {
        return {
            // Style
            "/stylesheet/style.css": await getImage(getFullPath("stylesheet", "style.css")),

            // templates
            "/?": await getImage(getFullPath(".", "index.html")),
            "/": await getImage(getFullPath(".", "index.html")),
            "/js/main.js": await getImage(getFullPath("js", "main.js")),
            "/component/navbar.html": await getImage(getFullPath("component", "navbar.html")),
            "/component/hero.html": await getImage(getFullPath("component", "hero.html")),
            "/component/offers.html": await getImage(getFullPath("component", "offers.html")),
            "/component/menu.html": await getImage(getFullPath("component", "menu.html")),
            "/component/about.html": await getImage(getFullPath("component", "about.html")),
            "/component/book-table.html": await getImage(getFullPath("component", "book-table.html")),
            "/component/cart-model.html": await getImage(getFullPath("component", "cart-model.html")),
            "/component/login-model.html": await getImage(getFullPath("component", "login-model.html")),
            "/component/checkout-overlay.html": await getImage(getFullPath("component", "checkout-overlay.html")),
            "/component/search-modal.html": await getImage(getFullPath("component", "search-modal.html")),

            // images
            "/images/o1.jpg": await getImage(getFullPath("images", "o1.jpg")),
            "/images/o2.jpg": await getImage(getFullPath("images", "o2.jpg")),
            "/images/f1-image.png": await getImage(getFullPath("images", "f1-image.png")),
            "/images/f2image.png": await getImage(getFullPath("images", "f2image.png")),
            "/images/f3image.png": await getImage(getFullPath("images", "f3image.png")),
            "/images/f4image.png": await getImage(getFullPath("images", "f4image.png")),
            "/images/f5image.png": await getImage(getFullPath("images", "f5image.png")),
            "/images/f6.png": await getImage(getFullPath("images", "f6.png")),
            "/images/f7.png": await getImage(getFullPath("images", "f7.png")),
            "/images/f8.png": await getImage(getFullPath("images", "f8.png")),
            "/images/f9.png": await getImage(getFullPath("images", "f9.png")),
            "/images/about-img.png": await getImage(getFullPath("images", "about-img.png")),
            "/images/client2.jpg": await getImage(getFullPath("images", "client2.jpg")),
            "/images/client1.jpg": await getImage(getFullPath("images", "client1.jpg")),
            "/images/hero-bg.jpg": await getImage(getFullPath("images", "hero-bg.jpg")),
        };
    } catch (error) {
        return undefined;
    }
}

module.exports = { loadAssests };
