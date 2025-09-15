const fs = require("fs");
const pdfParse = require("pdf-parse");

const pdfPath = "C:\\Users\\hp\\OneDrive - Amity University\\Documents\\PragatiResume-0021.pdf";  // Corrected path with double backslashes
// Or alternatively, you can use forward slashes:
// const pdfPath = "C:/Users/hp/OneDrive - Amity University/Documents/PragatiResume-0021.pdf";

fs.readFile(pdfPath, async (err, dataBuffer) => {
    if (err) {
        console.error("Error reading PDF:", err);
        return;
    }
    try {
        const data = await pdfParse(dataBuffer);
        console.log("Extracted Text:", data.text);
    } catch (error) {
        console.error("PDF Parsing Error:", error);
    }
});
