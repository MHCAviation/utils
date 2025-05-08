
import type { ImageDimensions, Pixels } from "../../types/utility.ts";
import { brand } from "../typing.ts";

/**
 * same as `object-fit: contain` in CSS of <img>
 * @param aspectRatio = width / height
 */
export function scaleToFit(aspectRatio: number, targetSize: { width: number, height: number }) {
    const fullHeightWidth = Math.round(targetSize.height * aspectRatio);
    const fullWidthHeight = Math.round(targetSize.width / aspectRatio);
    return fullHeightWidth <= targetSize.width
        ? { height: targetSize.height, width: fullHeightWidth }
        : { height: fullWidthHeight, width: targetSize.width };
}

/**
 * kudos to chatGPT -_-
 */
export function getPngDimensions(arrayBuffer: ArrayBuffer): ImageDimensions {
    const dataView = new DataView(arrayBuffer);

    // Check the PNG signature (first 8 bytes)
    const signature = [137, 80, 78, 71, 13, 10, 26, 10];
    for (let i = 0; i < signature.length; i++) {
        if (dataView.getUint8(i) !== signature[i]) {
            throw new Error("Not a PNG file.");
        }
    }

    // IHDR chunk starts at byte 12 (after 8-byte signature and 4-byte chunk length)
    // Width: 4 bytes starting at byte 16
    // Height: 4 bytes starting at byte 20
    const width = brand<Pixels>(dataView.getUint32(16));
    const height = brand<Pixels>(dataView.getUint32(20));

    return { width, height };
}
