/**
 * Módulo Principal de Lógica Comercial y Selección
 */
document.addEventListener('DOMContentLoaded', () => {
    const selectedItems = new Map();
    let currentCategory = 'agropecuaria';

    const gridContainer = document.getElementById('products-grid');
    const counterBadge = document.getElementById('selection-counter');
    const summaryContainer = document.getElementById('selection-summary');
    const quoteForm = document.getElementById('quote-form');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Validación defensiva para asegurar que CATALOGO_GORRAS existe
    if (typeof CATALOGO_GORRAS === 'undefined') {
        console.error("Error crítico: CATALOGO_GORRAS no está definido. Verifica que catalog-data.js cargue antes.");
        return;
    }

    // Inicializar visualización
    renderProducts(currentCategory);

    // Cambio de pestañas (Agropecuaria / Urbana)
    window.switchCategory = function(category) {
        currentCategory = category;
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'border-black', 'dark:border-white', 'bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
            btn.classList.add('bg-white', 'dark:bg-gray-900', 'text-gray-700', 'dark:text-gray-300', 'border-gray-200', 'dark:border-gray-700');
        });
        
        const activeBtn = document.getElementById(`tab-${category}`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-white', 'dark:bg-gray-900', 'text-gray-700', 'dark:text-gray-300', 'border-gray-200', 'dark:border-gray-700');
            activeBtn.classList.add('active', 'border-black', 'dark:border-white', 'bg-black', 'text-white', 'dark:bg-white', 'dark:text-black');
        }
        renderProducts(category);
    };

    function renderProducts(category) {
        const products = CATALOGO_GORRAS[category] || [];
        gridContainer.innerHTML = '';

        if (products.length === 0) {
            gridContainer.innerHTML = `<p class="col-span-full text-center text-gray-400 py-8">No hay productos disponibles en esta línea.</p>`;
            return;
        }

        products.forEach(product => {
            const itemEntry = selectedItems.get(product.id);
            const quantity = itemEntry ? itemEntry.quantity : 0;
            const isSelected = quantity > 0;

            const card = document.createElement('div');
            card.className = `bg-white dark:bg-gray-800 rounded-xl shadow-sm border ${isSelected ? 'border-green-600 ring-2 ring-green-100 dark:ring-green-900' : 'border-gray-200 dark:border-gray-700'} overflow-hidden transition-all duration-300 flex flex-col`;
            
            card.innerHTML = `
                <div class="relative bg-gray-100 dark:bg-gray-900 h-48 sm:h-56">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22 viewBox=%220 0 400 400%22><rect width=%22400%22 height=%22400%22 fill=%22%23f3f4f6%22/><text x=%2250%%22 y=%2250%%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22sans-serif%22 font-size=%2216%22 fill=%22%239ca3af%22>Foto Próximamente</text></svg>'">
                    <span class="absolute top-2 left-2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-md font-mono">${product.id}</span>
                </div>
                <div class="p-4 flex flex-col grow justify-between">
                    <div>
                        <h3 class="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base mb-1">${product.name}</h3>
                        <p class="text-green-700 dark:text-emerald-400 font-semibold text-sm">$ ${product.price.toLocaleString('es-CO')}</p>
                    </div>
                    <div class="mt-4">
                        ${!isSelected ? `
                            <button type="button" data-id="${product.id}" data-category="${category}" data-action="add"
                                class="qty-btn w-full py-2 px-4 rounded-lg font-medium text-sm transition-all cursor-pointer bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600">
                                + Agregar a mi Separación
                            </button>
                        ` : `
                            <div class="flex items-center justify-between bg-gray-100 dark:bg-gray-900 rounded-lg p-1">
                                <button type="button" data-id="${product.id}" data-category="${category}" data-action="decrease"
                                    class="qty-btn w-9 h-9 flex items-center justify-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md font-bold shadow-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
                                    -
                                </button>
                                <span class="font-bold text-sm text-gray-900 dark:text-white px-3">${quantity} un.</span>
                                <button type="button" data-id="${product.id}" data-category="${category}" data-action="increase"
                                    class="qty-btn w-9 h-9 flex items-center justify-center bg-green-600 text-white rounded-md font-bold shadow-sm hover:bg-green-700 transition cursor-pointer">
                                    +
                                </button>
                            </div>
                        `}
                    </div>
                </div>
            `;
            gridContainer.appendChild(card);
        });
    }

    // --- DELEGACIÓN DE EVENTOS PARA LAS TARJETAS ---
    gridContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.qty-btn');
        if (!button) return;

        const id = button.dataset.id;
        const category = button.dataset.category;
        const action = button.dataset.action;

        let product = null;
        for (const cat in CATALOGO_GORRAS) {
            const found = CATALOGO_GORRAS[cat].find(p => p.id === id);
            if (found) {
                product = found;
                break;
            }
        }
        if (!product) return;

        const current = selectedItems.get(id);
        const currentQty = current ? current.quantity : 0;
        let newQty = currentQty;

        if (action === 'add' || action === 'increase') {
            newQty += 1;
        } else if (action === 'decrease') {
            newQty -= 1;
        }

        if (newQty <= 0) {
            selectedItems.delete(id);
        } else {
            selectedItems.set(id, { product, quantity: newQty });
        }

        renderProducts(currentCategory);
        updateUIState();
    });

    // Función global para actualizar cantidad desde el resumen inferior
    window.updateItemQuantityViaSummary = function(id, delta) {
        const current = selectedItems.get(id);
        if (!current) return;

        const newQty = current.quantity + delta;
        if (newQty <= 0) {
            selectedItems.delete(id);
        } else {
            selectedItems.set(id, { product: current.product, quantity: newQty });
        }

        renderProducts(currentCategory);
        updateUIState();
    };

    function updateUIState() {
        let totalItemsCount = 0;
        selectedItems.forEach(item => {
            totalItemsCount += item.quantity;
        });

        counterBadge.textContent = totalItemsCount;
        const emptyMsg = document.getElementById('empty-selection-msg');

        if (totalItemsCount > 0) {
            summaryContainer.classList.remove('hidden');
            if (emptyMsg) emptyMsg.classList.add('hidden');

            let htmlList = '';
            let total = 0;

            selectedItems.forEach((item, id) => {
                const subtotal = item.product.price * item.quantity;
                total += subtotal;
                htmlList += `
                    <div class="flex justify-between items-center text-sm py-2 border-b border-gray-100 dark:border-gray-800">
                        <div class="flex flex-col">
                            <span><strong class="font-mono">${item.product.id}</strong> - ${item.product.name}</span>
                            <span class="text-xs text-gray-500 dark:text-gray-400">${item.quantity} un. x $ ${item.product.price.toLocaleString('es-CO')}</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <span class="font-semibold text-gray-900 dark:text-white">$ ${subtotal.toLocaleString('es-CO')}</span>
                            <div class="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded p-0.5">
                                <button type="button" onclick="updateItemQuantityViaSummary('${id}', -1)" class="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-700 text-xs text-gray-800 dark:text-white rounded font-bold cursor-pointer">-</button>
                                <span class="text-xs px-1 font-semibold text-gray-800 dark:text-gray-200">${item.quantity}</span>
                                <button type="button" onclick="updateItemQuantityViaSummary('${id}', 1)" class="w-6 h-6 flex items-center justify-center bg-green-600 text-white text-xs rounded font-bold cursor-pointer">+</button>
                            </div>
                        </div>
                    </div>
                `;
            });

            document.getElementById('summary-items').innerHTML = htmlList;
            document.getElementById('summary-total').textContent = `$ ${total.toLocaleString('es-CO')}`;
        } else {
            summaryContainer.classList.add('hidden');
            if (emptyMsg) emptyMsg.classList.remove('hidden');
        }
    }
    
    // Envío del formulario hacia WhatsApp
    // Envío del formulario formateado hacia WhatsApp
    quoteForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (selectedItems.size === 0) {
            alert('Por favor selecciona al menos una gorra antes de enviar tu solicitud.');
            return;
        }

        const nombre = document.getElementById('nombreCliente').value.trim();
        const telefono = document.getElementById('telefonoCliente').value.trim();
        const ciudad = document.getElementById('ciudadCliente').value.trim();
        const notas = document.getElementById('notasCliente').value.trim();

        // Construcción estructurada del mensaje corporativo
        let mensaje = `*¡Hola! Deseo solicitar una pre-cotización / separación de gorras:*\n\n`;
        mensaje += `👤 *Cliente:* ${nombre}\n`;
        mensaje += `📱 *Celular:* ${telefono}\n`;
        mensaje += `📍 *Ciudad/Municipio:* ${ciudad}\n`;
        if (notas) mensaje += `📝 *Notas adicionales:* ${notas}\n`;
        mensaje += `\n📦 *Detalle de Productos (${selectedItems.size}):*\n`;

        let total = 0;
        selectedItems.forEach((item) => {
            mensaje += `• [${item.id}] ${item.name} - $ ${item.price.toLocaleString('es-CO')}\n`;
            total += item.price;
        });

        mensaje += `\n💰 *Total Estimado:* $ ${total.toLocaleString('es-CO')}\n`;
        mensaje += `_Quedo atento(a) para coordinar el pago y el envío._`;

        // WhatsApp corporativo real (Ej: 573232308216)
        const numeroWhatsApp = "573124922470";
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;

        // 1. Abrir WhatsApp en nueva pestaña
        window.open(urlWhatsApp, '_blank');

        // 2. Limpiar selecciones y formulario para evitar duplicados o datos residuales
        selectedItems.clear();
        quoteForm.reset();
        renderProducts(currentCategory);
        updateUIState();

        // 3. Notificación visual de éxito al usuario
        alert(`¡Excelente ${nombre}! Tu pre-cotización se ha preparado y se abrió WhatsApp. Solo presiona "Enviar" en tu chat para finalizar.`);
    });
});
