import { PDFDocument, StandardFonts, rgb } from 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm';

// Start Elm app
const app = Elm.Main.init({
    node: document.getElementById("elm")
});

// Get current month and year
app.ports.getMonthandYear.subscribe(function () {
    const now = new Date();

    const month = now.toLocaleString('de-DE', {
        month: 'long'
    });

    const year = now.getFullYear().toString();

    app.ports.receiveMonthandYear.send({
        month: month,
        year: year
    });
});

function getFileExtension(fileName) {
    const match = String(fileName || "").match(/\.([^.]+)$/);
    return match ? `.${match[1]}` : "";
}

function getFileDescription(mimeType) {
    if (mimeType === "application/pdf") return "PDF-Datei";
    if (mimeType === "application/json") return "JSON-Datei";
    if (mimeType === "image/png") return "PNG-Bild";
    if (mimeType === "text/plain") return "Textdatei";
    return "Datei";
}

async function requestSaveFileHandle(fileName, mimeType) {
    if (!window.showSaveFilePicker) {
        return undefined;
    }

    const extension = getFileExtension(fileName);

    try {
        return await window.showSaveFilePicker({
            suggestedName: fileName || "download",
            types: [
                {
                    description: getFileDescription(mimeType),
                    accept: {
                        [mimeType]: extension ? [extension] : [],
                    },
                },
            ],
        });
    } catch (error) {
        if (error.name === "AbortError") {
            return null;
        }

        console.warn("Save dialog is not available, falling back to browser download:", error);
        return undefined;
    }
}

async function saveBlob(blob, fileName, mimeType, fileHandle, options = {}) {
    if (fileHandle) {
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
    }

    const url = URL.createObjectURL(blob);

    if (mimeType === "application/pdf" && options.openInNewTab) {
        const previewWindow = options.previewWindow;

        if (previewWindow && !previewWindow.closed) {
            previewWindow.location.href = url;
            setTimeout(() => URL.revokeObjectURL(url), 60000);
            return;
        }

        const openedWindow = window.open(url, "_blank");
        if (openedWindow) {
            setTimeout(() => URL.revokeObjectURL(url), 60000);
            return;
        }

        if (options.openInCurrentTabOnPopupBlock) {
            window.location.href = url;
            setTimeout(() => URL.revokeObjectURL(url), 60000);
            return;
        }
    }

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "download";
    a.style.display = "none";

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Generate PDF
app.ports.generatePdf.subscribe(async (data) => {
    const pdfFileName = "ausgleichsanspruch.pdf";
    const pdfMimeType = "application/pdf";
    const saveHandle = await requestSaveFileHandle(pdfFileName, pdfMimeType);

    if (saveHandle === null) {
        return;
    }

    const shouldOpenPdfInNewTab = saveHandle === undefined;
    const pdfPreviewWindow = shouldOpenPdfInNewTab ? window.open("", "_blank") : undefined;

    if (pdfPreviewWindow) {
        pdfPreviewWindow.document.title = pdfFileName;
        pdfPreviewWindow.document.body.textContent = "PDF wird erstellt ...";
    }

    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 12;

    let page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
    let y = A4_HEIGHT - 50;

    const wrapText = (text, textFont, textSize, maxWidth) => {
        const words = String(text || "").split(/\s+/);
        const lines = [];
        let currentLine = "";

        const pushLongWord = (word) => {
            let part = "";
            for (const char of word) {
                const nextPart = part + char;
                if (part && textFont.widthOfTextAtSize(nextPart, textSize) > maxWidth) {
                    lines.push(part);
                    part = char;
                } else {
                    part = nextPart;
                }
            }
            return part;
        };

        for (const word of words) {
            if (!word) {
                continue;
            }

            const nextLine = currentLine ? `${currentLine} ${word}` : word;
            if (textFont.widthOfTextAtSize(nextLine, textSize) <= maxWidth) {
                currentLine = nextLine;
                continue;
            }

            if (currentLine) {
                lines.push(currentLine);
                currentLine = "";
            }

            if (textFont.widthOfTextAtSize(word, textSize) > maxWidth) {
                currentLine = pushLongWord(word);
            } else {
                currentLine = word;
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.length ? lines : [""];
    };

    const logoUrl = '/assets/JTCLogo.png';
    const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
    const logoImage = await pdfDoc.embedPng(logoImageBytes);

    const logoWidth = 100;
    const logoHeight = (logoImage.height / logoImage.width) * logoWidth;

    // Draw logo top-right corner with 50pt margin from top and right
    page.drawImage(logoImage, {
        x: A4_WIDTH - logoWidth - 50,
        y: A4_HEIGHT - logoHeight - 50,
        width: logoWidth,
        height: logoHeight,
    });

    // Function to draw side-by-side tables
    const drawSideBySideTables = (leftTitle, leftRows, rightTitle, rightRows, leftFooterText = "", rightFooterText = "", rowHeight = 20) => {
        const { width } = page.getSize();
        const fontSize = 11;
        const titleFontSize = 13;
        const margin = 50;
        const gap = 20; // Space between tables
        const tableWidth = (width - 2 * margin - gap) / 2;
        const cellPadding = 5;
        const lineHeight = 13;

        const getTableLayout = (rows) => {
            // Keep the amount column wide enough for currency values without shrinking labels too far.
            let maxBetragWidth = font.widthOfTextAtSize("Betrag", fontSize);

            for (const [, value] of rows) {
                const valueWidth = font.widthOfTextAtSize(value, fontSize);
                if (valueWidth > maxBetragWidth) maxBetragWidth = valueWidth;
            }

            // Add padding to widths
            maxBetragWidth += 10;

            // Ensure minimum width for Betrag and calculate Bezeichnung to fill remaining space
            const minBetragWidth = 80;
            const betragWidth = Math.min(Math.max(minBetragWidth, maxBetragWidth), tableWidth * 0.45);
            const bezeichnungWidth = tableWidth - betragWidth;

            return { bezeichnungWidth, betragWidth };
        };

        const getWrappedRow = ([key, value], layout) => {
            const keyLines = String(key)
                .split("\n")
                .flatMap(rawLine => {
                    const leadingSpaces = rawLine.match(/^[ \u00A0]*/)[0].length;
                    const indent = leadingSpaces * 8;
                    const availableWidth = layout.bezeichnungWidth - cellPadding * 2 - indent;

                    return wrapText(rawLine.trimStart(), font, fontSize, availableWidth)
                        .map(text => ({ text, indent }));
                });
            const valueLines = wrapText(value, font, fontSize, layout.betragWidth - cellPadding * 2);
            const height = Math.max(rowHeight, Math.max(keyLines.length, valueLines.length) * lineHeight + cellPadding * 2);

            return { keyLines, valueLines, height };
        };

        const estimateTableHeight = (rows, footerText) => {
            const layout = getTableLayout(rows);
            const rowsHeight = rows.reduce((total, row) => total + getWrappedRow(row, layout).height, rowHeight);
            const footerHeight = footerText ? footerText.split('\n').length * 16 + 15 : 0;

            return rowsHeight + footerHeight + 30;
        };

        const estimatedHeight = Math.max(
            estimateTableHeight(leftRows, leftFooterText),
            estimateTableHeight(rightRows, rightFooterText)
        );

        checkSpace(Math.ceil(estimatedHeight / 18));
        y -= 20; // Space before tables
        // Draw titles outside the tables
        page.drawText(leftTitle, {
            x: margin,
            y,
            size: titleFontSize,
            font: boldFont,
            color: rgb(0, 0, 0),
        });

        page.drawText(rightTitle, {
            x: margin + tableWidth + gap,
            y,
            size: titleFontSize,
            font: boldFont,
            color: rgb(0, 0, 0),
        });

        y -= 10;

        const drawSingleTable = (rows, startX) => {
            let localY = y;
            const { bezeichnungWidth, betragWidth } = getTableLayout(rows);

            // Draw header row with "Bezeichnung" and "Betrag"
            page.drawRectangle({
                x: startX,
                y: localY - rowHeight,
                width: tableWidth,
                height: rowHeight,
                color: rgb(0.9, 0.9, 0.9),
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.25,
            });

            // Draw vertical line between header cells
            page.drawLine({
                start: { x: startX + bezeichnungWidth, y: localY - rowHeight },
                end: { x: startX + bezeichnungWidth, y: localY },
                thickness: 0.25,
                color: rgb(0, 0, 0),
            });

            // Draw "Bezeichnung" header
            page.drawText("Bezeichnung", {
                x: startX + 5,
                y: localY - rowHeight + 6,
                size: fontSize,
                font: boldFont,
                color: rgb(0, 0, 0),
            });

            // Draw "Betrag" header
            page.drawText("Betrag", {
                x: startX + bezeichnungWidth + 5,
                y: localY - rowHeight + 6,
                size: fontSize,
                font: boldFont,
                color: rgb(0, 0, 0),
            });

            localY -= rowHeight;

            // Draw data rows
            for (const [key, value] of rows) {
                const { keyLines, valueLines, height: dataRowHeight } = getWrappedRow([key, value], { bezeichnungWidth, betragWidth });

                // Draw Bezeichnung cell
                page.drawRectangle({
                    x: startX,
                    y: localY - dataRowHeight,
                    width: bezeichnungWidth,
                    height: dataRowHeight,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0.25,
                });

                keyLines.forEach(({ text, indent }, index) => {
                    page.drawText(text, {
                        x: startX + cellPadding + indent,
                        y: localY - cellPadding - fontSize - index * lineHeight,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });
                });

                // Draw Betrag cell
                page.drawRectangle({
                    x: startX + bezeichnungWidth,
                    y: localY - dataRowHeight,
                    width: betragWidth,
                    height: dataRowHeight,
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0.25,
                });

                valueLines.forEach((line, index) => {
                    const valueTextWidth = font.widthOfTextAtSize(line, fontSize);
                    const rightAlignedX = startX + bezeichnungWidth + betragWidth - valueTextWidth - cellPadding;

                    page.drawText(line, {
                        x: rightAlignedX,
                        y: localY - cellPadding - fontSize - index * lineHeight,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });
                });

                localY -= dataRowHeight;
            }

            return localY;
        };


        const drawMultiLineText = (text, startX, startY, maxWidth) => {
            if (!text) return startY;

            const lines = text.split('\n');
            let currentY = startY;
            const { width } = page.getSize();
            const fontSize = 11;
            const margin = 50;
            const gap = 20; // Space between texts
            const textWidth = (width - 2 * margin - gap) / 2;

            for (const line of lines) {
                page.drawText(line, {
                    x: startX,
                    y: currentY,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                    maxWidth: textWidth,
                    lineHeight: 14,
                });
                currentY -= 16; // Line height
            }

            return currentY;
        };

        // Draw left table
        const leftTableEndY = drawSingleTable(leftRows, margin);

        // Draw left footer text immediately after left table
        let leftFooterEndY = leftTableEndY;
        if (leftFooterText) {
            leftFooterEndY = drawMultiLineText(leftFooterText, margin, leftTableEndY - 15, tableWidth);
        }
        // Draw right table
        const rightTableEndY = drawSingleTable(rightRows, margin + tableWidth + gap);

        // Draw right footer text immediately after right table
        let rightFooterEndY = rightTableEndY;
        if (rightFooterText) {
            rightFooterEndY = drawMultiLineText(rightFooterText, margin + tableWidth + gap, rightTableEndY - 15, tableWidth);
        }

        y = Math.min(leftFooterEndY, rightFooterEndY) - 20;
    };
    // side-by-side text
    const drawSideBySideText = (textLeft, textRight) => {
        const { width } = page.getSize();
        const fontSize = 11;
        const lineHeight = 14;
        const spacingAfter = 4;
        const margin = 50;
        const gap = 20; // Space between texts
        const textWidth = (width - 2 * margin - gap) / 2;
        checkSpace(2);
        page.drawText(textLeft, {
            x: margin,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: textWidth,
            lineHeight,
        });
        page.drawText(textRight, {
            x: margin + textWidth + gap,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: textWidth,
            lineHeight,
        });
        const lineCount = Math.max(
            textLeft.split('\n').length,
            textRight.split('\n').length
        );
        y -= lineCount * lineHeight + spacingAfter;
    };

    const parseEuro = (value) => {
        if (typeof value === "number") return value;
        const normalized = String(value || "0")
            .replace(/\s/g, "")
            .replace(/€/g, "")
            .replace(/\./g, "")
            .replace(",", ".");
        const parsed = Number.parseFloat(normalized);
        return Number.isFinite(parsed) ? parsed : 0;
    };

    const formatEuroNumber = (value) => {
        return new Intl.NumberFormat("de-DE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value || 0);
    };

    const drawZusatzbedarfLeistungenTable = (title, leftRows, rightRows) => {
        const margin = 50;
        const gap = 20;
        const fontSize = 10;
        const titleFontSize = 12;
        const lineHeight = 12;
        const cellPadding = 5;
        const tableWidth = A4_WIDTH - 2 * margin;
        const columnWidth = (tableWidth - gap) / 2;

        const normalizeRows = (rows) => rows.length ? rows : ["Keine"];
        const rows = normalizeRows(leftRows).map((left, index) => [
            left,
            normalizeRows(rightRows)[index] || "",
        ]);
        const rightNormalized = normalizeRows(rightRows);
        for (let i = rows.length; i < rightNormalized.length; i += 1) {
            rows.push(["", rightNormalized[i]]);
        }

        const wrappedRows = rows.map(([left, right]) => {
            const leftLines = String(left).split("\n").flatMap(line => wrapText(line, font, fontSize, columnWidth - cellPadding * 2));
            const rightLines = String(right).split("\n").flatMap(line => wrapText(line, font, fontSize, columnWidth - cellPadding * 2));
            const height = Math.max(leftLines.length, rightLines.length, 1) * lineHeight + cellPadding * 2;
            return { leftLines, rightLines, height };
        });

        const totalHeight = 22 + 20 + wrappedRows.reduce((sum, row) => sum + row.height, 0) + 10;
        checkSpace(Math.ceil(totalHeight / 18));

        page.drawText(title, {
            x: margin,
            y,
            size: titleFontSize,
            font: boldFont,
            color: rgb(0, 0, 0),
        });
        y -= 22;

        const drawHeaderCell = (x, textValue) => {
            page.drawRectangle({
                x,
                y: y - 20,
                width: columnWidth,
                height: 20,
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.25,
                color: rgb(0.92, 0.92, 0.92),
            });
            page.drawText(textValue, {
                x: x + cellPadding,
                y: y - 14,
                size: fontSize,
                font: boldFont,
                color: rgb(0, 0, 0),
            });
        };

        drawHeaderCell(margin, "Vater");
        drawHeaderCell(margin + columnWidth + gap, "Mutter");
        y -= 20;

        const drawCell = (x, rowY, height, lines) => {
            page.drawRectangle({
                x,
                y: rowY - height,
                width: columnWidth,
                height,
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.25,
            });
            lines.forEach((line, index) => {
                page.drawText(line, {
                    x: x + cellPadding,
                    y: rowY - cellPadding - fontSize - index * lineHeight,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
            });
        };

        wrappedRows.forEach(({ leftLines, rightLines, height }) => {
            drawCell(margin, y, height, leftLines);
            drawCell(margin + columnWidth + gap, y, height, rightLines);
            y -= height;
        });

        y -= 12;
    };

    const newPage = () => {
        page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
        y = A4_HEIGHT - 50;
    };
    const checkSpace = (lines = 1) => {
        const footerSpace = 80;
        if (y - lines * 18 < footerSpace) {
            newPage();
        }
    };
    const drawFullWidthHinweis = (text) => {
        const boxX = 50;
        const boxWidth = A4_WIDTH - 100;
        const boxPadding = 10;
        const hinweisFontSize = 10;
        const hinweisLineHeight = 13;
        const lines = String(text)
            .split(/\r?\n/)
            .flatMap(line => wrapText(line, font, hinweisFontSize, boxWidth - 2 * boxPadding));
        const boxHeight = lines.length * hinweisLineHeight + 2 * boxPadding;

        checkSpace(Math.ceil((boxHeight + 15) / 18));
        page.drawRectangle({
            x: boxX,
            y: y - boxHeight,
            width: boxWidth,
            height: boxHeight,
            color: rgb(1, 1, 1),
            borderColor: rgb(0, 0, 0),
            borderWidth: 0.5,
        });

        lines.forEach((line, index) => {
            page.drawText(line, {
                x: boxX + boxPadding,
                y: y - boxPadding - hinweisFontSize - index * hinweisLineHeight,
                size: hinweisFontSize,
                font,
                color: rgb(0, 0, 0),
            });
        });
        y -= boxHeight + 15;
    };
    const drawHeader = (title) => {
        checkSpace(5);
        y -= 30

        page.drawText(title, {
            x: 50,
            y,
            size: 14,
            font: boldFont,
            color: rgb(0, 0, 0),
        });
        y -= 22;
    };

    drawHeader("Berechnung Ausgleichsanspruch im Wechselmodell");
    checkSpace(2);
    page.drawText(`${data.monat} ${data.jahr}`, {
        x: 50,
        y,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    y -= 5;
    page.drawLine({
        start: { x: 50, y },
        end: { x: A4_WIDTH - 50, y },
        thickness: 1,
        color: rgb(0, 0, 0),
    });

    y -= 16; // Move down for next line
    const currentDate = new Date();
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = currentDate.toLocaleDateString('de-DE', options);

    page.drawText(`Stand: ${formattedDate}`, {
        x: 50,
        y,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    y -= 26;

    // Vater Daten
    const vaterRows = [
        ["Einkommen", `${data.vater.einkommen || 0} €`],
        [" Einkünfte aus Haupttätigkeit", `${data.vater.haupttaetigkeit || 0} €`],
        [" Weitere Einkünfte Gesamt", `${data.vater.weitereEinkuenfteGesamt || 0} €`]
    ];

    if (data.vater.weitereEinkuenfte && data.vater.weitereEinkuenfte.length > 0) {
        data.vater.weitereEinkuenfte.forEach(item => {
            if (item.kos != "0,00") {
                vaterRows.push([`  ${item.bez}`, `${item.kos || 0} €`]);
            }

        });
    }

    vaterRows.push(["Abzug Gesamt", `${data.vater.abzuegeGesamt || 0} €`]
    );

    if (data.vater.abzugsposten && data.vater.abzugsposten.length > 0) {
        data.vater.abzugsposten.forEach(item => {
            if (item.kos != "0,00") {
                vaterRows.push([`  Abzug ${item.bez}`, `${item.kos || 0} €`]);
            }
        });
    }

    vaterRows.push(
        ["Bereinigtes Einkommen", `${data.vater.bereinigtesEinkommen || 0} €`],
        [`Selbstbehalt `, `${data.vater.selbstbehalt.betrag || 0} €`],
        ["= verteilbarer Betrag", `${data.vater.verteilbarerBetrag || 0} €`]
    );


    // Mutter Daten

    const mutterRows = [
        ["Einkommen", `${data.mutter.einkommen || 0} €`],
        [" Einkünfte aus Haupttätigkeit", `${data.mutter.haupttaetigkeit || 0} €`],
        [" Weitere Einkünfte Gesamt", `${data.mutter.weitereEinkuenfteGesamt || 0} €`]
    ];

    if (data.mutter.weitereEinkuenfte && data.mutter.weitereEinkuenfte.length > 0) {
        data.mutter.weitereEinkuenfte.forEach(item => {
            if (item.kos != "0,00") {
                mutterRows.push([`  ${item.bez}`, `${item.kos || 0} €`]);
            }
        });
    }

    mutterRows.push(["Abzug Gesamt", `${data.mutter.abzuegeGesamt || 0} €`]
    );

    if (data.mutter.abzugsposten && data.mutter.abzugsposten.length > 0) {
        data.mutter.abzugsposten.forEach(item => {
            if (item.kos != "0,00") {
                mutterRows.push([`  Abzug ${item.bez}`, `${item.kos || 0} €`]);
            }
        });
    }

    mutterRows.push(
        ["Bereinigtes Einkommen", `${data.mutter.bereinigtesEinkommen || 0} €`],
        [`Selbstbehalt`, `${data.mutter.selbstbehalt.betrag || 0} €`],
        ["= verteilbarer Betrag", `${data.mutter.verteilbarerBetrag || 0} €`]
    );

    function renderSelbstbehaltText(dataSelbstbehalt) {
        if (dataSelbstbehalt === "Angemessen") {
            return "angemessene Selbstbehalt";
        } else if (dataSelbstbehalt === "NotwendigErwerbstaetig") {
            return "notwendige Selbstbehalt für Erwerbstätige";
        } else if (dataSelbstbehalt === "NotwendigNichtErwerbstaetig") {
            return "notwendige Selbstbehalt für Nicht-Erwerbstätige";
        } else {
            return "benutzerdefinierte Selbstbehalt";
        }
    }


    drawSideBySideTables("Vater", vaterRows, "Mutter", mutterRows,
        `Für den Kindsvater wurde der ${renderSelbstbehaltText(data.vater.selbstbehalt.typ)} berücksichtigt.`,
        `Für die Kindsmutter wurde der ${renderSelbstbehaltText(data.mutter.selbstbehalt.typ)} berücksichtigt.`
    );

    // Center the text on the page

    const margin = 50;

    const text1 = `Relevantes Gesamteinkommen für den Regelbedarf: ${data.gesamtEinkommen} €`;
    const text1Width = font.widthOfTextAtSize(text1, fontSize);
    checkSpace(2);
    page.drawText(text1, {
        x: (A4_WIDTH - text1Width) / 2,  // Center horizontally
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
    });

    y -= 20;

    const text2 = `Verteilbarer Betrag Gesamt: ${data.verteilbarerBetragGesamt} €`;
    const text2Width = font.widthOfTextAtSize(text2, fontSize);
    page.drawText(text2, {
        x: (A4_WIDTH - text2Width) / 2,  // Center horizontally
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
    });

    y -= 30;

    drawSideBySideText(`Haftungsanteil Vater: ${data.vater.haftungsanteil}%`,
        `Haftungsanteil Mutter: ${data.mutter.haftungsanteil}%`);

    if (parseEuro(data.vater.haftungsanteil) === 0) {
        drawFullWidthHinweis(
            "Da der Haftungsanteil des Vaters bei 0 Prozent liegt, berechnet sich der Regelbedarf des Kindes allein aufgrund des Einkommens der Mutter."
        );
    } else if (parseEuro(data.mutter.haftungsanteil) === 0) {
        drawFullWidthHinweis(
            "Da der Haftungsanteil der Mutter bei 0 Prozent liegt, berechnet sich der Regelbedarf des Kindes allein aufgrund des Einkommens des Vaters."
        );
    }


    // Kind Daten
    const kindRows = [];

    kindRows.push([`Regelbedarf${data.customRegelbedarf ? "**" : ""}`,
    `${data.regelbedarf || 0} €`],
        ["Zusatzbedarf", `${data.zusatzbedarfSum || 0} €`],
        ["davon Mehrbedarf", `${data.mehrbedarfSum || 0} €`]
    );

    if (data.mehrbedarf && data.mehrbedarf.length > 0) {
        data.mehrbedarf.forEach(item => {
            if (item.kos != "0,00") {
                kindRows.push([` ${item.bez}`, `${item.kos || 0} €`]);
                kindRows.push([`  Bereits bezahlt von:`, `${item.bezahltVon}`]);
            }
        });
    }

    kindRows.push(["davon Sonderbedarf", `${data.sonderbedarfSum || 0} €`]);

    if (data.sonderbedarf && data.sonderbedarf.length > 0) {
        data.sonderbedarf.forEach(item => {
            if (item.kos != "0,00") {
                kindRows.push([` ${item.bez}`, `${item.kos || 0} €`]);
                kindRows.push([`   Bereits bezahlt von:`, `${item.bezahltVon}`]);
            }
        });
    }

    const einkuenfteDetails = (data.kindeinkuenfte || [])
        .filter(item => parseEuro(item.kos) !== 0)
        .map(item => ` ${String(item.bez || "").trim() || "Ohne Bezeichnung"}: ${item.kos || "0,00"} €`)
        .join("\n");

    const einkuenfteGesamt = parseEuro(data.einkuenfteGesamt);

    if (einkuenfteDetails) {
        if (data.kindsalter < 18) {
            kindRows.push([
                `Abzug hälftiger Einkünfte des Kindes i. H. v. ${data.einkuenfteGesamt || "0,00"} €`
                + (einkuenfteDetails ? `\n${einkuenfteDetails}` : ""),
                `${formatEuroNumber(einkuenfteGesamt / 2)} €`
            ]);
        }
        else {
            kindRows.push([
                `Abzug vollständiger Einkünfte des Kindes i. H. v. ${data.einkuenfteGesamt || "0,00"} €`
                + `\n${einkuenfteDetails}`,
                `${data.einkuenfteGesamt || "0,00"} €`
            ]);
        }

    }

    kindRows.push(
        ["Abzug hälftiges Kindergeld", `${data.haelftigesKindergeld || 0} €`],
        ["Gesamtbedarf", `${data.gesamtbedarf_mitGetrageneZusatzbedarf || 0} €`]
    );


    const kindergeldRows = [
        ["Kindergeld", `${data.kindergeld || 0} €`],
        ["Kindergeld Empfänger", data.kindergeldEmpfaenger || ""],
        ["Betreuungsanteil Mutter", `${data.mutter.betreuungsanteil || 0} €`],
        ["Baranteil Mutter", `${data.mutter.baranteil || 0} €`],
        ["Betreuungsanteil Vater", `${data.vater.betreuungsanteil || 0} €`],
        ["Baranteil Vater", `${data.vater.baranteil || 0} €`]
    ];


    const nichtKindergeldEmpfaenger = data.kindergeldEmpfaenger === "Vater" ? "Mutter" : "Vater";
    const kindergeldVerrechnungText = "Durch den Abzug des hälftigen Kindergeldes vom Bedarf wurde der Baranteil bereits abgegolten. "
        + "Verbleibend ist allein die Verrechnung des Betreuungsanteils in Höhe von "
        + `${data.kindergeldBetreuungsanteilAusgleich || "0,00"}€ von ${data.kindergeldEmpfaenger || ""} an ${nichtKindergeldEmpfaenger}:`;

    const kindTitle = "Angaben zum Kind (Alter: " + data.kindsalter + " Jahre)";
    drawSideBySideTables(kindTitle, kindRows, "Kindergeldverrechnung", kindergeldRows,
        "",
        ""
    );

    const vaterBegrenzt = parseEuro(data.haftungsbetragVaterVorBegrenzung) > parseEuro(data.haftungsbetragVater);
    const mutterBegrenzt = parseEuro(data.haftungsbetragMutterVorBegrenzung) > parseEuro(data.haftungsbetragMutter);
    const textAnteilVater = "Anteil Vater am Gesamtbedarf: "
        + (data.haftungsbetragVater || "0,00") + " €" + (vaterBegrenzt ? "¹" : "");
    const textAnteilMutter = "Anteil Mutter am Gesamtbedarf: "
        + (data.haftungsbetragMutter || "0,00") + " €" + (mutterBegrenzt ? "¹" : "");

    drawSideBySideText(textAnteilVater, textAnteilMutter);

    if (data.hftInput === "Individuell") {
        const gap = 20;
        const boxWidth = (A4_WIDTH - 2 * margin - gap) / 2;
        const boxPadding = 8;
        const hinweisFontSize = 10;
        const hinweisLineHeight = 13;
        const textWidth = boxWidth - 2 * boxPadding;
        const vaterInput = String(data.haftungsbetragVaterInput || "").trim();
        const mutterInput = String(data.haftungsbetragMutterInput || "").trim();
        const buildInputHinweis = (input) =>
            `Vom Benutzer individuell eingegeben: ${formatEuroNumber(parseEuro(input))} €`;
        const vaterInputZeilen = vaterInput
            ? wrapText(buildInputHinweis(vaterInput), font, hinweisFontSize, textWidth)
            : [];
        const mutterInputZeilen = mutterInput
            ? wrapText(buildInputHinweis(mutterInput), font, hinweisFontSize, textWidth)
            : [];

        if (vaterInputZeilen.length || mutterInputZeilen.length) {
            const boxHeight = Math.max(vaterInputZeilen.length, mutterInputZeilen.length) * hinweisLineHeight
                + 2 * boxPadding;

            checkSpace(Math.ceil((boxHeight + 10) / 18));

            const drawInputBox = (x, lines) => {
                if (!lines.length) return;

                page.drawRectangle({
                    x,
                    y: y - boxHeight,
                    width: boxWidth,
                    height: boxHeight,
                    color: rgb(1, 1, 1),
                    borderColor: rgb(0, 0, 0),
                    borderWidth: 0.5,
                });

                lines.forEach((line, index) => {
                    page.drawText(line, {
                        x: x + boxPadding,
                        y: y - boxPadding - hinweisFontSize - index * hinweisLineHeight,
                        size: hinweisFontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });
                });
            };

            drawInputBox(margin, vaterInputZeilen);
            drawInputBox(margin + boxWidth + gap, mutterInputZeilen);
            y -= boxHeight + 15;
        }
    }

    if (vaterBegrenzt || mutterBegrenzt) {
        const gap = 20;
        const boxWidth = (A4_WIDTH - 2 * margin - gap) / 2;
        const boxPadding = 10;
        const hinweisFontSize = 10;
        const hinweisLineHeight = 13;
        const textWidth = boxWidth - 2 * boxPadding;
        const buildBegrenzungText = (elternteilGenitiv, urspruenglicherBetrag, verteilbarerBetrag) =>
            `¹ Der ursprünglich berechnete Haftungsbetrag ${elternteilGenitiv} von `
            + `${urspruenglicherBetrag || "0,00"} € übersteigt den verteilbaren Betrag von `
            + `${verteilbarerBetrag || "0,00"} €. Der Haftungsbetrag wurde entsprechend begrenzt.`;
        const vaterHinweisZeilen = vaterBegrenzt
            ? wrapText(
                buildBegrenzungText("Vaters", data.haftungsbetragVaterVorBegrenzung, data.vater.verteilbarerBetrag),
                font,
                hinweisFontSize,
                textWidth
            )
            : [];
        const mutterHinweisZeilen = mutterBegrenzt
            ? wrapText(
                buildBegrenzungText("Mutters", data.haftungsbetragMutterVorBegrenzung, data.mutter.verteilbarerBetrag),
                font,
                hinweisFontSize,
                textWidth
            )
            : [];
        const boxHeight = Math.max(vaterHinweisZeilen.length, mutterHinweisZeilen.length) * hinweisLineHeight
            + 2 * boxPadding;

        checkSpace(Math.ceil((boxHeight + 10) / 18));

        const drawBegrenzungBox = (x, lines) => {
            if (!lines.length) return;

            page.drawRectangle({
                x,
                y: y - boxHeight,
                width: boxWidth,
                height: boxHeight,
                color: rgb(1, 1, 1),
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.5,
            });

            lines.forEach((line, index) => {
                page.drawText(line, {
                    x: x + boxPadding,
                    y: y - boxPadding - hinweisFontSize - index * hinweisLineHeight,
                    size: hinweisFontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
            });
        };

        drawBegrenzungBox(margin, vaterHinweisZeilen);
        drawBegrenzungBox(margin + boxWidth + gap, mutterHinweisZeilen);
        y -= boxHeight + 15;
    }

    let hinweisAnteilVater = "";
    let hinweisAnteilMutter = "";
    // Vorgeschlagenen Haftungsanteil übernehmen
    if (data.hftInput === "Vorschlag") {
        if (parseEuro(data.haftungsbetragVaterSpiegel) > parseEuro(data.haftungsbetragVater)) {
            hinweisAnteilVater = "Der Haftungsbetrag von Kindsvater " + (data.haftungsbetragVaterSpiegel || "0,00") + " ist höher als der Zahlungsbetrag, der im Residenzmodell zu leisten wäre. Daher wird der Haftungsanteil auf diesen Zahlungsbetrag gedeckelt. Daher der Haftungsanteil von Kindsvater: " + (data.haftungsbetragVater || "0,00") + " €";
        }
        if (parseEuro(data.haftungsbetragMutterSpiegel) > parseEuro(data.haftungsbetragMutter)) {
            hinweisAnteilMutter = "Der Haftungsbetrag von Kindsmutter " + (data.haftungsbetragMutterSpiegel || "0,00") + " ist höher als der Zahlungsbetrag, der im Residenzmodell zu leisten wäre. Daher wird der Haftungsanteil auf diesen Zahlungsbetrag gedeckelt. Daher der Haftungsanteil von Kindsmutter: " + (data.haftungsbetragMutter || "0,00") + " €";
        }
    }

    if (hinweisAnteilVater || hinweisAnteilMutter) {
        const gap = 20;
        const boxWidth = (A4_WIDTH - 2 * margin - gap) / 2;
        const boxPadding = 10;
        const hinweisFontSize = 10;
        const hinweisLineHeight = 13;
        const textWidth = boxWidth - 2 * boxPadding;
        const vaterHinweisZeilen = hinweisAnteilVater
            ? wrapText(hinweisAnteilVater, font, hinweisFontSize, textWidth)
            : [];
        const mutterHinweisZeilen = hinweisAnteilMutter
            ? wrapText(hinweisAnteilMutter, font, hinweisFontSize, textWidth)
            : [];
        const boxHeight = Math.max(vaterHinweisZeilen.length, mutterHinweisZeilen.length) * hinweisLineHeight
            + 2 * boxPadding;

        checkSpace(Math.ceil((boxHeight + 10) / 18));

        const drawVorschlagBox = (x, lines) => {
            if (!lines.length) return;

            page.drawRectangle({
                x,
                y: y - boxHeight,
                width: boxWidth,
                height: boxHeight,
                color: rgb(1, 1, 1),
                borderColor: rgb(0, 0, 0),
                borderWidth: 0.5,
            });

            lines.forEach((line, index) => {
                page.drawText(line, {
                    x: x + boxPadding,
                    y: y - boxPadding - hinweisFontSize - index * hinweisLineHeight,
                    size: hinweisFontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
            });
        };

        drawVorschlagBox(margin, vaterHinweisZeilen);
        drawVorschlagBox(margin + boxWidth + gap, mutterHinweisZeilen);
        y -= boxHeight + 15;
    }

    const ungedeckterKindsbedarf = parseEuro(data.gesamtbedarf_mitGetrageneZusatzbedarf)
        - parseEuro(data.verteilbarerBetragGesamt);
    if (ungedeckterKindsbedarf > 0) {
        const ungedeckterBedarfErklaerung = data.vater.selbstbehalt.typ === "Angemessen"
            ? "Es sollte gegebenenfalls in Erwägung gezogen werden, statt des angemessenen Selbstbehalts den notwendigen Selbstbehalt anzusetzen."
            : "Da der Bedarf des Kindes nicht durch die Eltern gedeckt werden kann, sollte geprüft werden, ob ergänzende finanzielle Unterstützungsmöglichkeiten in Anspruch genommen werden können, z. B. durch sozialrechtliche Leistungen.";

        drawFullWidthHinweis(
            `Ungedeckter Kindsbedarf: ${formatEuroNumber(ungedeckterKindsbedarf)} €\n`
            + `Hinweis: Der Bedarf des Kindes ist höher als der verteilbare Betrag. ${ungedeckterBedarfErklaerung}`
        );
    }

    const typedZusatzbedarfItems = [
        ...(data.mehrbedarf || []).map(item => ({ ...item, typ: "Mehrbedarf" })),
        ...(data.sonderbedarf || []).map(item => ({ ...item, typ: "Sonderbedarf" })),
        ...(data.erbrachteLeistungen || []).map(item => ({ ...item, typ: "Erbrachte Leistung" })),
    ].filter(item => parseEuro(item.kos) !== 0);

    const paidItemsBy = (person) => typedZusatzbedarfItems.filter(item => item.bezahltVon === person);
    const sumPaidItems = (items) => items.reduce((sum, item) => sum + parseEuro(item.kos), 0);
    const renderPaidItems = (items) => {
        if (!items.length) return "Keine";
        return items
            .map(item => `${item.typ}: ${item.bez || "Ohne Bezeichnung"} - ${item.kos || "0,00"} €`)
            .join("\n");
    };

    const paidByVaterItems = paidItemsBy("Vater");
    const paidByMutterItems = paidItemsBy("Mutter");
    const paidByVater = sumPaidItems(paidByVaterItems);
    const paidByMutter = sumPaidItems(paidByMutterItems);
    const abzugVater = data.kindergeldEmpfaenger === "Vater" ? parseEuro(data.haelftigesKindergeld) : 0;
    const abzugMutter = data.kindergeldEmpfaenger === "Mutter" ? parseEuro(data.haelftigesKindergeld) : 0;

    drawZusatzbedarfLeistungenTable(
        "Bereits getragene Zusatzbedarfe und erbrachte Leistungen",
        [
            renderPaidItems(paidByVaterItems),
            `Summe: ${formatEuroNumber(paidByVater)} €`,
            "Anrechnung hälftiges Kindergeld beim Kindergeldempfänger:",
            `${data.haftungsbetragVater || "0,00"} - ${formatEuroNumber(paidByVater)} + ${formatEuroNumber(abzugVater)} = ${data.anteilVaterGesamtbedarf || "0,00"} €`,
            `Haftungsbetrag nach Anrechnung Vater: ${data.anteilVaterGesamtbedarf || "0,00"} €`,
        ],
        [
            renderPaidItems(paidByMutterItems),
            `Summe: ${formatEuroNumber(paidByMutter)} €`,
            "Anrechnung hälftiges Kindergeld beim Kindergeldempfänger:",
            `${data.haftungsbetragMutter || "0,00"} - ${formatEuroNumber(paidByMutter)} + ${formatEuroNumber(abzugMutter)} = ${data.anteilMutterGesamtbedarf || "0,00"} €`,
            `Haftungsbetrag nach Anrechnung Mutter: ${data.anteilMutterGesamtbedarf || "0,00"} €`,
        ]
    );

    const anrechnungAusgleichText = "Differenz: " + (data.differenzNachAnrechnung || "0,00") + " €"
        + "\nAuszugleichender Betrag (1/2) von "
        + (data.nichtAnspruchsberechtigtNachAnrechnung || "")
        + " zu leisten an "
        + (data.anspruchsberechtigtNachAnrechnung || "")
        + ": "
        + (data.auszugleichenderBetragNachAnrechnung || "0,00")
        + " €";

    checkSpace(5);
    page.drawText(anrechnungAusgleichText, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: A4_WIDTH - 100,
        lineHeight: 14,
    });
    y -= (anrechnungAusgleichText.split('\n').length * 14) + 10;

    page.drawLine({
        start: { x: margin, y },
        end: { x: A4_WIDTH - margin, y },
        thickness: 0.5,
        color: rgb(0, 0, 0),
    });
    y -= 20;

    const kindergeldVerrechnungFontSize = 11;
    const kindergeldVerrechnungLineHeight = 12;
    const kindergeldVerrechnungLines = wrapText(
        kindergeldVerrechnungText,
        font,
        kindergeldVerrechnungFontSize,
        A4_WIDTH - 100
    );
    checkSpace(kindergeldVerrechnungLines.length + 2);

    for (const line of kindergeldVerrechnungLines) {
        page.drawText(line, {
            x: margin,
            y,
            size: kindergeldVerrechnungFontSize,
            font,
            color: rgb(0, 0, 0),
        });
        y -= kindergeldVerrechnungLineHeight;
    }

    y -= 20;
    const kindergeldWirdAddiert = data.anspruchsberechtigtNachAnrechnung === nichtKindergeldEmpfaenger;
    const ausgleichsanspruchRechenzeichen = kindergeldWirdAddiert ? "+" : "-";
    const ausgleichsanspruch = parseEuro(data.ausgleichsanspruchNachAnrechnung);
    const zwischenschritteRows = [
        ["Auszugleichender Betrag (1/2)", `${data.auszugleichenderBetragNachAnrechnung || "0,00"} €`],
        [
            `Betreuungsanteil Kindergeld von ${data.kindergeldEmpfaenger || ""} an ${nichtKindergeldEmpfaenger}`,
            `${ausgleichsanspruchRechenzeichen} ${data.kindergeldBetreuungsanteilAusgleich || "0,00"} €`,
        ],
        [
            "Rechnung Ausgleichsanspruch",
            `${data.auszugleichenderBetragNachAnrechnung || "0,00"} € ${ausgleichsanspruchRechenzeichen} ${data.kindergeldBetreuungsanteilAusgleich || "0,00"} € = ${data.ausgleichsanspruchNachAnrechnung || "0,00"} €`,
        ],
    ];

    checkSpace(10);
    const zwischenschrittTableX = margin;
    const zwischenschrittTableWidth = A4_WIDTH - 2 * margin;
    const zwischenschrittLabelWidth = zwischenschrittTableWidth * 0.55;
    const zwischenschrittValueWidth = zwischenschrittTableWidth - zwischenschrittLabelWidth;
    const zwischenschrittRowHeight = 24;

    page.drawText("Zwischenschritt", {
        x: zwischenschrittTableX + 5,
        y: y - 16,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    page.drawText("Betrag", {
        x: zwischenschrittTableX + zwischenschrittLabelWidth + 5,
        y: y - 16,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    page.drawRectangle({
        x: zwischenschrittTableX,
        y: y - zwischenschrittRowHeight,
        width: zwischenschrittTableWidth,
        height: zwischenschrittRowHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 0.5,
    });
    page.drawLine({
        start: { x: zwischenschrittTableX + zwischenschrittLabelWidth, y },
        end: { x: zwischenschrittTableX + zwischenschrittLabelWidth, y: y - zwischenschrittRowHeight * (zwischenschritteRows.length + 1) },
        thickness: 0.5,
        color: rgb(0, 0, 0),
    });
    y -= zwischenschrittRowHeight;

    for (const [label, amount] of zwischenschritteRows) {
        page.drawRectangle({
            x: zwischenschrittTableX,
            y: y - zwischenschrittRowHeight,
            width: zwischenschrittTableWidth,
            height: zwischenschrittRowHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 0.5,
        });
        page.drawText(label, {
            x: zwischenschrittTableX + 5,
            y: y - 16,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: zwischenschrittLabelWidth - 10,
        });
        page.drawText(amount, {
            x: zwischenschrittTableX + zwischenschrittLabelWidth + 5,
            y: y - 16,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),
            maxWidth: zwischenschrittValueWidth - 10,
        });
        y -= zwischenschrittRowHeight;
    }

    y -= 14;
    page.drawText("Der Ausgleichsanspruch ist auf volle Euro aufzurunden.", {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
    });
    y -= 30;

    const ausgleichsText =
        ausgleichsanspruch < 0
            ? `Von ${data.anspruchsberechtigtNachAnrechnung || ""} an ${data.nichtAnspruchsberechtigtNachAnrechnung || ""} zu leistende Ausgleichszahlung: ${formatEuroNumber(Math.ceil(Math.abs(ausgleichsanspruch)))} €`
            : `Von ${data.nichtAnspruchsberechtigtNachAnrechnung || ""} an ${data.anspruchsberechtigtNachAnrechnung || ""} zu leistende Ausgleichszahlung: ${formatEuroNumber(Math.ceil(ausgleichsanspruch))} €`;

    // Calculate text dimensions for the box
    const textHeight = 20;
    const padding = 10;
    const boxWidth = A4_WIDTH - 100; // Full width with 50pt margins on each side
    const boxHeight = textHeight + (padding * 2);

    // Start at left margin
    const boxX = 50;

    // Draw the main box (full width)
    page.drawRectangle({
        x: boxX,
        y: y - boxHeight,
        width: boxWidth,
        height: boxHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
        color: rgb(0.95, 0.95, 0.95), // Light gray background
    });

    // Calculate text position to center it in the full-width box
    const textWidth = boldFont.widthOfTextAtSize(ausgleichsText, 12);
    const textX = boxX + (boxWidth - textWidth) / 2; // Center the text horizontally

    // Draw the text inside the box (centered)
    page.drawText(ausgleichsText, {
        x: textX,
        y: y - boxHeight + padding + 5,
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
    });

    y -= boxHeight + 10; // Move y position down past the box
    y -= 30;
    page.drawText(`Erläuterungen und Anmerkungen`, {
        x: 50,
        y,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0),
    });
    if (data.customRegelbedarf) {
        y -= 16;
        page.drawText(`** Individueller Regelbedarf wurde verwendet.` || "", {
            x: 50,
            y,
            size: fontSize,
            font,
            color: rgb(0, 0, 0),

        });
    }
    y -= 16;
    page.drawText(data.freitext || "", {
        x: 50,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        maxWidth: A4_WIDTH - 100,
        lineHeight: 14,
    });

    if (data.qrCodeBase64) {
        // Create a new page for the QR code
        newPage();

        const qrImage = await pdfDoc.embedPng(data.qrCodeBase64);

        const qrSize = 400; // 400x400pt bigger QR code

        // Center the QR code on the page
        const qrX = (A4_WIDTH - qrSize) / 2;
        const qrY = (A4_HEIGHT - qrSize) / 2;

        page.drawImage(qrImage, {
            x: qrX,
            y: qrY,
            width: qrSize,
            height: qrSize,
        });

        const qrText = "Scannen zum Importieren";
        const textWidth = font.widthOfTextAtSize(qrText, 14);
        const textX = (A4_WIDTH - textWidth) / 2;

        page.drawText(qrText, {
            x: textX,
            y: qrY - 30, // 30pt below the QR code
            size: 14,
            font,
            color: rgb(0, 0, 0),
        });

        const titleText = "QR-Code zum Importieren der Daten";
        const titleWidth = font.widthOfTextAtSize(titleText, 16);
        const titleX = (A4_WIDTH - titleWidth) / 2;

        page.drawText(titleText, {
            x: titleX,
            y: qrY + qrSize + 40,  // 40pt above the QR code
            size: 16,
            font: boldFont,
            color: rgb(0, 0, 0),
        });
    }

    let totalPages;

    const pages = pdfDoc.getPages();
    totalPages = pages.length;

    pages.forEach((currentPage, index) => {
        page = currentPage;

        const footerY = 30;
        const footerFontSize = 10;
        const pageNumber = index + 1;

        const line1 = "Diese Berechnung wurde mithilfe des ASGLA-Rechners (https://asgla-rechner.jtc.uni-halle.de)";
        const line2 = "vom LegalTech Lab JTC der Martin-Luther-Universität Halle-Wittenberg erstellt.";
        const pageInfo = `Seite ${pageNumber} von ${totalPages}`;

        // Draw footer line
        page.drawLine({
            start: { x: 50, y: footerY + 35 },
            end: { x: A4_WIDTH - 50, y: footerY + 35 },
            thickness: 0.5,
            color: rgb(0.8, 0.8, 0.8),
        });

        // Draw footer text
        page.drawText(line1, {
            x: 50,
            y: footerY + 20,
            size: footerFontSize,
            font,
            color: rgb(0.5, 0.5, 0.5),
        });

        page.drawText(line2, {
            x: 50,
            y: footerY + 8,
            size: footerFontSize,
            font,
            color: rgb(0.5, 0.5, 0.5),
        });

        // Draw page number (right-aligned)
        const pageInfoWidth = font.widthOfTextAtSize(pageInfo, footerFontSize);
        page.drawText(pageInfo, {
            x: A4_WIDTH - 50 - pageInfoWidth,
            y: footerY,
            size: footerFontSize,
            font,
            color: rgb(0.5, 0.5, 0.5),
        });
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: pdfMimeType });
    await saveBlob(blob, pdfFileName, pdfMimeType, saveHandle, {
        openInNewTab: shouldOpenPdfInNewTab,
        previewWindow: pdfPreviewWindow,
    });
});

// Get URL from QR Code
app.ports.sendImageForQRDecode.subscribe(function (imageDataUrl) {

    decodeQRCodefromImage(imageDataUrl);
    //console.log("image data url received for QR decode:", imageDataUrl);
});

// Decode QR code from image URL
function decodeQRCodefromImage(imageUrl) {

    // Create temporary container for HTML5-QRCode
    const tempContainer = document.createElement('div');
    tempContainer.id = 'qr-reader';
    tempContainer.style.display = 'none';  // Hide the element
    document.body.appendChild(tempContainer);

    const html5QrCode = new Html5Qrcode("qr-reader", {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
        }
    });
    const image = new Image();
    image.onload = async function () {
        try {
            const canvas = document.createElement("canvas");
            const minSize = 400;
            const scale = Math.max(1, minSize / Math.min(image.width, image.height));
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;

            const ctx = canvas.getContext("2d");
            // Disable image smoothing for better QR detection
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);


            canvas.toBlob(async (blob) => {
                const file = new File([blob], "qr-image.png", { type: "image/png" });

                try {
                    const result = await html5QrCode.scanFile(file, /* showImage */ false);
                    //console.log("QR Code found!");
                    //console.log("Raw Decoded Text:", result);

                    try {
                        const jsonData = JSON.parse(result);
                        //console.log("Valid JSON found:", jsonData);
                        app.ports.qrDecoded.send(result);
                    } catch (jsonError) {
                        //console.error("JSON parse error:", jsonError);
                        app.ports.qrError.send("Invalid QR code format");
                    }
                } catch (qrError) {
                    //console.warn("QR scan failed:", qrError);
                    app.ports.qrError.send("Could not read QR code");
                } finally {
                    // Cleanup
                    canvas.remove();
                    html5QrCode.clear();
                    tempContainer.remove();  // Remove temporary container
                }
            }, 'image/png');

        } catch (error) {
            //console.error('Processing error:', error);
            app.ports.qrError.send("Error processing image: " + error.message);
            html5QrCode.clear();
            tempContainer.remove();  // Remove temporary container
        }
    };

    image.onerror = function () {
        //console.error('Error loading image:', imageUrl);
        app.ports.qrError.send("Failed to load image");
        html5QrCode.clear();
        tempContainer.remove();  // Remove temporary container
    };

    image.src = imageUrl;
    //console.log("Decoding QR code from image:", imageUrl);
}

let html5QrCode = null;
let isScanning = false;

app.ports.startCameraScanner.subscribe(function () {
    startQRCameraScanner();
});

app.ports.stopCameraScanner.subscribe(function () {
    stopQRCameraScanner();
});

function waitForElementById(id, timeoutMs = 1500) {
    const startedAt = Date.now();

    return new Promise((resolve, reject) => {
        const check = () => {
            const element = document.getElementById(id);
            if (element) {
                resolve(element);
                return;
            }

            if (Date.now() - startedAt > timeoutMs) {
                reject(new Error(`Element #${id} not found`));
                return;
            }

            requestAnimationFrame(check);
        };

        check();
    });
}

function cleanupQRCameraScanner() {
    isScanning = false;

    if (html5QrCode) {
        try {
            html5QrCode.clear();
        } catch (clearError) {
            //console.error("Error clearing Html5Qrcode:", clearError);
        }

        html5QrCode = null;
    }
}

function withTimeout(promise, timeoutMs, message) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => reject(new Error(message)), timeoutMs);
        })
    ]);
}

function ensureScannerVideoVisible() {
    const video = document.querySelector("#qr-camera-reader video");
    if (!video) {
        //console.warn("QR scanner started, but no video element was found.");
        return;
    }

    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.muted = true;
    video.style.display = "block";
    video.style.width = "100%";
    video.style.height = "auto";
    video.style.maxHeight = "70vh";
    video.style.objectFit = "cover";

    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => {
            //console.warn("Camera video play() failed:", error);
        });
    }
}

// Start QR code scanner
async function startQRCameraScanner() {
    if (html5QrCode !== null && isScanning) {
        //console.log("Scanner already initialized");
        return;
    }

    cleanupQRCameraScanner();

    if (!window.isSecureContext) {
        app.ports.qrError.send("Kamera-Zugriff ist nur über HTTPS oder localhost möglich.");
        app.ports.cameraScannerStarted.send(false);
        return;
    }

    if (typeof Html5Qrcode === "undefined" || typeof Html5QrcodeSupportedFormats === "undefined") {
        app.ports.qrError.send("QR-Scanner konnte nicht geladen werden.");
        app.ports.cameraScannerStarted.send(false);
        return;
    }

    try {
        await waitForElementById('qr-camera-reader');
    } catch (error) {
        app.ports.qrError.send("Camera container not found");
        app.ports.cameraScannerStarted.send(false);
        return;
    }

    html5QrCode = new Html5Qrcode("qr-camera-reader", {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
    });

    const config = {
        fps: 10,
        qrbox: function (viewfinderWidth, viewfinderHeight) {
            const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(Math.min(280, minEdge * 0.72));
            return { width: qrboxSize, height: qrboxSize };
        },
        aspectRatio: 1.333
    };

    const cameraStartSources = [
        { facingMode: "environment" },
        { facingMode: "user" },
        {}
    ];

    await tryNextConstraint(0);

    async function tryNextConstraint(index) {
        if (index >= cameraStartSources.length) {
            cleanupQRCameraScanner();
            app.ports.qrError.send("Kamera konnte nicht gestartet werden. Bitte Berechtigung prüfen und sicherstellen, dass die Seite über HTTPS geöffnet ist.");
            app.ports.cameraScannerStarted.send(false);
            return;
        }

        const cameraSource = cameraStartSources[index];
        //console.log("Trying camera source:", cameraSource);

        try {
            await withTimeout(
                html5QrCode.start(
                    cameraSource,
                    config,
                    function (decodedText) {
                        if (!isScanning) {
                            return;
                        }

                        //console.log("Raw QR content:", decodedText);

                        try {
                            const jsonData = JSON.parse(decodedText);
                            //console.log("Valid JSON found:", jsonData);

                            app.ports.qrDecoded.send(decodedText);

                            setTimeout(() => {
                                stopQRCameraScanner();
                            }, 100);
                        } catch (jsonError) {
                            //console.error("JSON parse error:", jsonError);
                            //console.log("Invalid QR content (not JSON):", decodedText);
                            app.ports.qrError.send("Invalid QR code format - expecting JSON");
                        }
                    },
                    function () {
                        // Decode misses are expected while the camera is open.
                    }
                ),
                20000,
                "Camera start timed out"
            );

            isScanning = true;
            ensureScannerVideoVisible();
            //console.log("QR Camera scanner started successfully with source:", cameraSource);
            app.ports.cameraScannerStarted.send(true);
        } catch (err) {
            //console.error("Camera start failed with source:", cameraSource, "Error:", err);
            cleanupQRCameraScanner();

            if (index + 1 < cameraStartSources.length) {
                html5QrCode = new Html5Qrcode("qr-camera-reader", {
                    formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
                });
                await tryNextConstraint(index + 1);
            } else {
                app.ports.qrError.send("Kamera konnte nicht gestartet werden. Bitte Berechtigung prüfen und sicherstellen, dass die Seite über HTTPS geöffnet ist.");
                app.ports.cameraScannerStarted.send(false);
            }
        }
    }
}

// Stop QR code scanner
function stopQRCameraScanner() {
    if (html5QrCode && isScanning) {
        html5QrCode.stop()
            .then(() => {
                //console.log("QR Camera scanner stopped");
                app.ports.cameraScannerStarted.send(false);
                cleanupQRCameraScanner();
            })
            .catch(err => {
                //console.error("Error stopping camera:", err);
                app.ports.cameraScannerStarted.send(false);
                cleanupQRCameraScanner();
            });
    } else {
        cleanupQRCameraScanner();
        app.ports.cameraScannerStarted.send(false);
    }
}

// Copy to clipboard
app.ports.copyToClipboard.subscribe(function (text) {
    navigator.clipboard.writeText(text).then(function () {
        //console.log("Copied to clipboard");
    }).catch(function (err) {
        //console.error("Could not copy text: ", err);
    });
});

// Open a static PDF as a temporary Blob URL in the browser PDF viewer.
async function openPdfInTab(pdfPath) {
    const previewWindow = window.open("", "_blank");

    if (previewWindow) {
        previewWindow.document.title = "Skript/Anleitung";
        previewWindow.document.body.textContent = "PDF wird geladen ...";
    }

    try {
        const response = await fetch(pdfPath);
        if (!response.ok) {
            throw new Error(`PDF konnte nicht geladen werden (${response.status}).`);
        }

        const pdfData = await response.arrayBuffer();
        const pdfBlob = new Blob([pdfData], { type: "application/pdf" });
        await saveBlob(
            pdfBlob,
            "Skript_ASGLA.pdf",
            "application/pdf",
            undefined,
            {
                openInNewTab: true,
                previewWindow,
                openInCurrentTabOnPopupBlock: true,
            }
        );
    } catch (error) {
        if (previewWindow && !previewWindow.closed) {
            previewWindow.close();
        }
        //console.error("Error opening PDF:", error);
    }
}

// Skript als Slider von rechts (Markdown aus skript.md, gerendert mit marked).
(function () {
    var panel = null;
    var lastFocus = null;

    function loadMarked() {
        if (window.marked) return Promise.resolve();
        return new Promise(function (resolve, reject) {
            var s = document.createElement("script");
            s.src = "vendor/marked.min.js";
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    var WIDTH_KEY = "asgla-skript-breite";

    function slug(text) {
        return text.toLowerCase().replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
            .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    }

    function scrollToAnchor(id) {
        if (!panel) return;
        var el = panel.querySelector("#skript-" + id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            el.classList.add("skript-flash");
            setTimeout(function () { el.classList.remove("skript-flash"); }, 1800);
        }
    }

    function buildToc(body, nav) {
        var list = document.createElement("ul");
        var links = [];
        var seen = {};
        var heads = body.querySelectorAll("h2, h3, h4");
        heads.forEach(function (h) {
            var id = slug(h.textContent);
            if (seen[id]) { seen[id] += 1; id = id + "-" + seen[id]; } else { seen[id] = 1; }
            h.id = "skript-" + id;
            if (h.tagName === "H4") return; // nur Anker, nicht im Inhaltsverzeichnis
            var li = document.createElement("li");
            li.className = h.tagName === "H3" ? "skript-toc-sub" : "";
            var a = document.createElement("a");
            a.href = "#" + h.id;
            a.textContent = h.textContent;
            a.addEventListener("click", function (e) {
                e.preventDefault();
                var det = a.closest("details");
                if (det) det.removeAttribute("open");
                h.scrollIntoView({ behavior: "smooth", block: "start" });
            });
            li.appendChild(a);
            list.appendChild(li);
            links.push({ head: h, link: a });
        });
        nav.appendChild(list);

        // Scrollspy: aktuelle Überschrift im Inhaltsverzeichnis markieren
        function update() {
            var top = body.getBoundingClientRect().top + 24;
            var current = links[0];
            links.forEach(function (l) { if (l.head.getBoundingClientRect().top <= top) current = l; });
            links.forEach(function (l) {
                var active = l === current;
                l.link.classList.toggle("is-active", active);
                if (active) l.link.setAttribute("aria-current", "location"); else l.link.removeAttribute("aria-current");
            });
            var summary = panel && panel.querySelector(".skript-toc-aktuell");
            if (summary && current) summary.textContent = current.link.textContent;
        }
        body.addEventListener("scroll", update, { passive: true });
        update();
    }

    function setupResize(handle, aside) {
        var saved = null;
        try { saved = parseInt(localStorage.getItem(WIDTH_KEY), 10); } catch (e) {}
        if (saved) aside.style.width = Math.min(Math.max(saved, 320), window.innerWidth * 0.95) + "px";
        function move(e) {
            var w = Math.min(Math.max(window.innerWidth - e.clientX, 320), window.innerWidth * 0.95);
            aside.style.width = w + "px";
        }
        function stop(e) {
            handle.releasePointerCapture(e.pointerId);
            handle.removeEventListener("pointermove", move);
            handle.removeEventListener("pointerup", stop);
            aside.classList.remove("is-resizing");
            try { localStorage.setItem(WIDTH_KEY, String(parseInt(aside.style.width, 10))); } catch (err) {}
        }
        handle.addEventListener("pointerdown", function (e) {
            e.preventDefault();
            handle.setPointerCapture(e.pointerId);
            aside.classList.add("is-resizing");
            handle.addEventListener("pointermove", move);
            handle.addEventListener("pointerup", stop);
        });
        handle.addEventListener("keydown", function (e) {
            var cur = aside.getBoundingClientRect().width, step = 40;
            if (e.key === "ArrowLeft") { aside.style.width = Math.min(cur + step, window.innerWidth * 0.95) + "px"; e.preventDefault(); }
            if (e.key === "ArrowRight") { aside.style.width = Math.max(cur - step, 320) + "px"; e.preventDefault(); }
        });
    }

    function close() {
        if (!panel) return;
        panel.classList.remove("is-open");
        document.removeEventListener("keydown", onKey, true);
        var p = panel;
        panel = null;
        setTimeout(function () { p.remove(); }, 250);
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function onKey(e) {
        if (!panel) return;
        if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); close(); return; }
        if (e.key === "Tab") {
            var f = panel.querySelectorAll("a[href], button, summary, [tabindex]:not([tabindex='-1'])");
            if (!f.length) return;
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            else if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
        }
    }

    async function open(pdfPath, anchor) {
        if (panel) { if (anchor) scrollToAnchor(anchor); return; }
        lastFocus = document.activeElement;
        try {
            var res = await fetch("skript.md");
            if (!res.ok) throw new Error("skript.md " + res.status);
            var md = await res.text();
            await loadMarked();
            panel = document.createElement("div");
            panel.className = "skript-overlay";
            panel.innerHTML =
                '<div class="skript-backdrop"></div>' +
                '<aside class="skript-panel" role="dialog" aria-modal="true" aria-labelledby="skript-titel">' +
                '<div class="skript-resize" role="separator" aria-orientation="vertical" aria-label="Breite der Seitenleiste ändern (Pfeiltasten links/rechts)" tabindex="0" title="Zum Vergrößern nach links ziehen"></div>' +
                '<header class="skript-head"><h2 id="skript-titel">Skript/Anleitung</h2>' +
                '<a class="skript-pdf" href="' + pdfPath + '" download><i class="fas fa-download" aria-hidden="true"></i> PDF herunterladen</a>' +
                '<button type="button" class="skript-close" aria-label="Skript schließen">&times;</button></header>' +
                '<details class="skript-toc"><summary>Inhaltsverzeichnis<span class="skript-toc-aktuell"></span></summary><nav aria-label="Inhaltsverzeichnis"></nav></details>' +
                '<div class="skript-body content"></div></aside>';
            var body = panel.querySelector(".skript-body");
            body.innerHTML = window.marked.parse(md);
            body.querySelectorAll("a[href^='http']").forEach(function (a) { a.target = "_blank"; a.rel = "noopener noreferrer"; });
            buildToc(body, panel.querySelector(".skript-toc nav"));
            panel.querySelector(".skript-backdrop").addEventListener("click", close);
            panel.querySelector(".skript-close").addEventListener("click", close);
            document.body.appendChild(panel);
            setupResize(panel.querySelector(".skript-resize"), panel.querySelector(".skript-panel"));
            document.addEventListener("keydown", onKey, true);
            requestAnimationFrame(function () {
                panel.classList.add("is-open");
                panel.querySelector(".skript-close").focus();
                if (anchor) setTimeout(function () { scrollToAnchor(anchor); }, 300);
            });
        } catch (error) {
            panel = null;
            openPdfInTab(pdfPath);
        }
    }

    app.ports.openPdfBlob.subscribe(function (pdfPath) { open(pdfPath); });

    // Begriffe im Rechner können das Skript an einer Stelle öffnen: <a data-skript="sockelbetrag">
    document.addEventListener("click", function (e) {
        var t = e.target.closest && e.target.closest("[data-skript]");
        if (!t) return;
        e.preventDefault();
        open("Skript_ASGLA.pdf", t.getAttribute("data-skript"));
    });
})();

// Escape schließt das Zwischenspeichern-Fenster (ohne den Skript-Slider zu stören)
document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape" || document.querySelector(".skript-overlay")) return;
    var modal = document.querySelector(".modal.is-active");
    if (!modal) return;
    var closeBtn = modal.querySelector(".delete, .modal-close, [aria-label*='chließen']");
    if (closeBtn) { e.preventDefault(); closeBtn.click(); }
});

// Download file handler
app.ports.downloadFile.subscribe(async function (file) {
    var blob;

    if (file.mimeType === "image/png") {
        if (!file.content) {
            //console.error("PNG content is empty");
            return;
        }

        try {
            // Remove data URL prefix if present (e.g., "data:image/png;base64,")
            var base64Data = file.content.replace(/^data:image\/png;base64,/, '');

            var binary = atob(base64Data); // decode base64
            var array = new Uint8Array(binary.length);
            for (var i = 0; i < binary.length; i++) {
                array[i] = binary.charCodeAt(i);
            }
            blob = new Blob([array], { type: file.mimeType });
        } catch (error) {
            //console.error("Error processing PNG data:", error);
            return;
        }
    } else if (file.mimeType === "text/plain" || file.mimeType === "application/json") {
        // Handle text files (including JSON)
        if (!file.content && file.content !== "") {
            //console.error("Text content is empty");
            return;
        }
        blob = new Blob([file.content], { type: file.mimeType });
    } else {
        //console.error("Unsupported file type:", file.mimeType);
        return;
    }

    const saveHandle = await requestSaveFileHandle(file.name || "download", file.mimeType);
    if (saveHandle === null) {
        return;
    }

    try {
        await saveBlob(blob, file.name || "download", file.mimeType, saveHandle);
    } catch (error) {
        //console.error("Error triggering download:", error);
    }
});


// Handle page unload to clean up camera resources
window.addEventListener('beforeunload', function () {
    if (isScanning) {
        //console.log("Page unloading, cleaning up QR scanner");
        stopQRCameraScanner();
    }
});

// Darstellung: Nach „Berechnen“ bzw. bei einer Fehlermeldung zur Ergebniskarte oder Meldung scrollen.
// Elm (Browser.document) rendert in document.body, daher wird dort beobachtet.
(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ziele = ".ergebnis-karte, .form-error";

    new MutationObserver((eintraege) => {
        for (const eintrag of eintraege) {
            for (const knoten of eintrag.addedNodes) {
                if (!(knoten instanceof Element)) continue;
                const ziel = knoten.matches(ziele) ? knoten : knoten.querySelector(ziele);
                if (ziel) {
                    ziel.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
                    return;
                }
            }
        }
    }).observe(document.body, { childList: true, subtree: true });
})();
