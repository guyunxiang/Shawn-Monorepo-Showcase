export async function loadThemeImages(theme: string): Promise<HTMLImageElement[]> {
  try {
    console.log(theme);
    const response = await fetch(`/theme/${theme}.json`);
    if (!response.ok) throw new Error(`Failed to load theme JSON: ${response.statusText}`);

    const imageNames: string[] = await response.json();

    const images = await Promise.all(imageNames.map(name => new Promise<HTMLImageElement>(resolve => {
      const img = new Image();
      img.src = `/assets/${theme}/${name}`;
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.error(`Failed to load image ${name}`);
        resolve(img);
      };
    })));

    return images;
  } catch (error) {
    console.error("Error loading theme images:", error);
    return [];
  }
}
