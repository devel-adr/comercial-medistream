import { supabase } from "@/integrations/supabase/client";

interface ClassificationData {
  areaTerapeutica?: string;
  farmaco?: string;
  molecula?: string;
}

export class AreaClassificationService {
  private static cache = new Map<string, string>();

  static async classifyArea(data: ClassificationData): Promise<string> {
    // Create a cache key based on the input data
    const cacheKey = `${data.areaTerapeutica || ''}-${data.farmaco || ''}-${data.molecula || ''}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const { data: result, error } = await supabase.functions.invoke('area-classifier', {
        body: {
          areaTerapeutica: data.areaTerapeutica,
          farmaco: data.farmaco,
          molecula: data.molecula
        }
      });

      if (error) {
        console.error('Area classification error:', error);
        return 'other';
      }

      const area = result?.area || 'other';
      
      // Cache the result
      this.cache.set(cacheKey, area);
      
      return area;
    } catch (error) {
      console.error('Error calling area classification service:', error);
      return 'other';
    }
  }

  static async classifyMultipleAreas(items: any[], dataExtractor: (item: any) => ClassificationData): Promise<Map<any, string>> {
    const results = new Map<any, string>();
    
    // Process items in batches to avoid overwhelming the API
    const batchSize = 5;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      
      const promises = batch.map(async (item) => {
        const data = dataExtractor(item);
        const area = await this.classifyArea(data);
        return { item, area };
      });

      const batchResults = await Promise.all(promises);
      batchResults.forEach(({ item, area }) => {
        results.set(item, area);
      });

      // Small delay between batches
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return results;
  }

  static clearCache(): void {
    this.cache.clear();
  }
}