import ico from "ico-endec";
import * as fs from "node:fs";
import sharp from "sharp";

export const ValidSizes = [16, 32, 48, 64, 128, 256] as const;
export type ValidSize = (typeof ValidSizes)[number];

export async function svgToIco({
	compressionLevel = 1,
	input,
	output = "favicon.ico",
	sizes = [16, 32, 48, 64, 128, 256],
}: {
	compressionLevel: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
	input: string;
	output: string;
	sizes: ValidSize[];
}) {
	if (!Number.isInteger(compressionLevel)) {
		throw new Error(
			`compression level must be a number above -1 and below 10 '${compressionLevel}'`,
		);
	}

	if (compressionLevel < 0) {
		throw new Error(`compression level is to low must be above -1`);
	}

	if (compressionLevel > 9) {
		throw new Error(`compression level is to high must be below 10`);
	}

	for (const size of sizes) {
		const png_buffer = await sharp(input)
			.resize(size, size, {
				background: { alpha: 0, b: 0, g: 0, r: 0 },
				fit: "contain",
			})
			.png({ compressionLevel })
			.toBuffer();

		const ico_buffer = ico.encode(png_buffer);

		await fs.promises.writeFile(output, ico_buffer);
	}
}
