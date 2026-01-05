const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

app.get('/descargar', async (req, res) => {
    let browser;
    try {
        const htmlContent = `
        <html lang="es">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: sans-serif; padding: 50px; background-color: #f9fafb; }
        .card { 
            background: white; 
            padding: 20px; 
            border-radius: 10px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: auto;
        }
        h2 { color: #111827; text-align: center; font-size: 1.5rem; }
        
        /* Contenedor del gráfico */
        .chart-container {
            position: relative;
            width: 100%;
            height: 200px;
            margin-top: 20px;
        }

        svg {
            width: 100%;
            height: 100%;
            display: block;
        }

        /* La línea del gráfico */
        .line {
            fill: none;
            stroke: #2563eb; /* Azul */
            stroke-width: 4;
            stroke-linecap: round;
            stroke-linejoin: round;
            /* Forzar color en PDF */
            -webkit-print-color-adjust: exact;
        }

        /* Área sombreada bajo la línea */
        .area {
            fill: rgba(37, 99, 235, 0.1);
            -webkit-print-color-adjust: exact;
        }

        .grid-line {
            stroke: #e5e7eb;
            stroke-width: 1;
        }
    </style>
</head>
<body>
    <div class="card">
        <h2>Gráfico Ejemplo</h2>
        <div class="chart-container">
            <svg viewBox="0 0 500 200" preserveAspectRatio="none">
                <!-- Líneas de fondo (Grid) -->
                <line x1="0" y1="50" x2="500" y2="50" class="grid-line" />
                <line x1="0" y1="100" x2="500" y2="100" class="grid-line" />
                <line x1="0" y1="150" x2="500" y2="150" class="grid-line" />

                <!-- Área sombreada -->
                <path d="M0,200 L0,150 L125,80 L250,120 L375,40 L500,90 L500,200 Z" class="area"></path>

                <!-- Línea de datos (X,Y) -->
                <!-- Puntos: (0,150), (125,80), (250,120), (375,40), (500,90) -->
                <polyline points="0,150 125,80 250,120 375,40 500,90" class="line" />
            </svg>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; color: #6b7280; font-size: 12px;">
            <span>Sem 1</span><span>Sem 2</span><span>Sem 3</span><span>Sem 4</span><span>Sem 5</span>
        </div>
    </div>
</body>
</html>
`;

        browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Cargamos el HTML directamente
        await page.setContent(htmlContent, { waitUntil: 'load' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // CLAVE: para que se vean los colores
            margin: { top: '20px', bottom: '20px' }
        });

        await browser.close();

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="grafico.pdf"'
        });
        res.send(pdfBuffer);

    } catch (error) {
        if (browser) await browser.close();
        res.status(500).send("Error: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Endpoint de descarga en: http://localhost:${port}/descargar`);
});
