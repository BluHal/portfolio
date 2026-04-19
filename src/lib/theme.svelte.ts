export type Theme = 'classic' | 'dark';
export type WallpaperType = 'teal' | 'dots' | 'bricks' | 'plaid' | 'waves' | 'custom';

export const themeState = $state<{
	theme: Theme;
	wallpaper: WallpaperType;
	wallpaperUrl: string;
}>({
	theme: 'classic',
	wallpaper: 'teal',
	wallpaperUrl: ''
});

/** Returns a CSS `background` shorthand string for the given wallpaper type. */
export function getWallpaperStyle(wallpaper: WallpaperType, url: string): string {
	switch (wallpaper) {
		case 'teal':
			return 'background: #008080';
		case 'dots':
			return 'background: radial-gradient(circle, #005050 1px, transparent 1px) 0 0 / 12px 12px #008080';
		case 'bricks':
			return [
				'background:',
				'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(0,0,0,.15) 20px, rgba(0,0,0,.15) 22px),',
				'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(0,0,0,.15) 10px, rgba(0,0,0,.15) 12px)',
				'#008080'
			].join(' ');
		case 'plaid':
			return [
				'background:',
				'repeating-linear-gradient(45deg, rgba(0,0,0,.1) 0, rgba(0,0,0,.1) 1px, transparent 0, transparent 50%) 0 0 / 8px 8px,',
				'repeating-linear-gradient(-45deg, rgba(0,0,0,.1) 0, rgba(0,0,0,.1) 1px, transparent 0, transparent 50%) 0 0 / 8px 8px',
				'#008080'
			].join(' ');
		case 'waves':
			return 'background: repeating-radial-gradient(circle at 0 0, transparent 0, #006666 5px) 0 0 / 20px 20px, #008080';
		case 'custom':
			return url ? `background: url('${url}') center / cover no-repeat` : 'background: #008080';
	}
}
