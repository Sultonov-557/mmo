import Noise = require("noisejs");

const noise = new (Noise as any).Noise(1234567);

export function perlin(x: number, y: number): number {
	// Scale inputs for more natural terrain
	const scale = 0.05;
	const scaledX = x * scale;
	const scaledY = y * scale;
	
	// Get noise value between -1 and 1
	const value = noise.perlin2(scaledX, scaledY);
	
	// Convert to range 0-1
	return (value + 1) / 2;
}
