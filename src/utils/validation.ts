export const isValidShortCode = (shortCode: any) => typeof shortCode === "string" && /^([a-zA-Z0-9]{6,10})$/.test(shortCode);
