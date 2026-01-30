export const basePdfStyles = `
    body {
        font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
        margin: 40px;
        color: #111;
    }

    h1 {
        font-size: 24px;
        margin-bottom: 4px;
    }

    .meta {
        font-size: 12px;
        color: #555;
        margin-bottom: 24px;
    }

    .section {
        margin-bottom: 24px;
    }

    .label {
        font-size: 12px;
        text-transform: uppercase;
        color: #666;
        margin-bottom: 6px;
        font-weight: 600;
    }

    .content {
        font-size: 14px;
        white-space: pre-wrap;
        line-height: 1.6;
    }

    .mood {
        display: inline-block;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 12px;
        font-weight: 600;
    }

    .success {
        background: #e6f9f0;
        color: #067647;
    }

    .neutral {
        background: #eef2ff;
        color: #3730a3;
    }

    .blocked {
        background: #fee2e2;
        color: #991b1b;
    }

    .images {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .images img {
        width: 100%;
        border-radius: 8px;
        object-fit: contain;
    }

    .divider {
        height: 1px;
        background: #e5e7eb;
        margin: 32px 0;
    }
`;
