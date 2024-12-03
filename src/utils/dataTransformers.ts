interface DataTransformer {
  // CSV 변환
  toCSV: {
    parse<T extends Record<string, any>>(csv: string, headers?: string[]): T[];
    stringify<T extends Record<string, any>>(data: T[], headers?: string[]): string;
  };
  
  // JSON 변환
  toJSON: {
    parse<T>(jsonString: string): T;
    stringify<T>(data: T): string;
  };
  
  // 날짜 변환
  dates: {
    toUTC(date: Date): Date;
    toLocal(date: Date): Date;
    toISO(date: Date): string;
    fromISO(isoString: string): Date;
  };
}

export const dataTransformers: DataTransformer = {
  toCSV: {
    parse<T extends Record<string, any>>(csv: string, headers?: string[]): T[] {
      const lines = csv.split('\n');
      const result: T[] = [];
      
      const csvHeaders = headers || lines[0].split(',');
      const dataLines = headers ? lines : lines.slice(1);
      
      dataLines.forEach(line => {
        if (!line.trim()) return;
        
        const values = line.split(',');
        const obj: Record<string, any> = {};
        
        csvHeaders.forEach((header, index) => {
          obj[header.trim()] = values[index]?.trim();
        });
        
        result.push(obj as T);
      });
      
      return result;
    },

    stringify<T extends Record<string, any>>(data: T[], headers?: string[]): string {
      if (!data.length) return '';
      
      const csvHeaders = headers || Object.keys(data[0]);
      const headerRow = csvHeaders.join(',');
      
      const rows = data.map(item => {
        return csvHeaders.map(header => {
          const value = item[header];
          return `${value}`;
        }).join(',');
      });
      
      return [headerRow, ...rows].join('\n');
    }
  },

  toJSON: {
    parse<T>(jsonString: string): T {
      try {
        return JSON.parse(jsonString);
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        throw error;
      }
    },

    stringify<T>(data: T): string {
      try {
        return JSON.stringify(data, null, 2);
      } catch (error) {
        console.error('JSON 변환 오류:', error);
        throw error;
      }
    }
  },

  dates: {
    toUTC(date: Date): Date {
      return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    },

    toLocal(date: Date): Date {
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    },

    toISO(date: Date): string {
      return date.toISOString();
    },

    fromISO(isoString: string): Date {
      return new Date(isoString);
    }
  }
}; 