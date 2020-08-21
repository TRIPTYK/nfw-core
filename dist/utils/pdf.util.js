"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfToBase64 = void 0;
const base64_stream_1 = require("base64-stream");
exports.pdfToBase64 = (pdfDoc) => {
    let base64stream = pdfDoc.pipe(new base64_stream_1.Base64Encode());
    pdfDoc.end();
    let tempFileBase64 = '';
    base64stream.on('data', function (buffer) {
        let part = buffer.toString();
        tempFileBase64 += part;
    });
    return new Promise((resolve, reject) => base64stream.on('end', () => resolve(tempFileBase64)));
};
