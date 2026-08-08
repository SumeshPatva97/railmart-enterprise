interface CacheEntry {
  data: any;
  timestamp: number;
}

export const productsCache = new Map<string, CacheEntry>();

let catSlugMapCache: Map<string, string> | null = null;
let catSlugMapTime = 0;

export function getCatSlugMap() {
  return { catSlugMapCache, catSlugMapTime };
}

export function setCatSlugMap(map: Map<string, string> | null, time: number) {
  catSlugMapCache = map;
  catSlugMapTime = time;
}

export function clearProductsCache() {
  productsCache.clear();
  catSlugMapCache = null;
}
