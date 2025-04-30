import Papa from 'papaparse';
import { CSVRow, TextEntry, defaultEmotionLabels } from './types';
import { v4 as uuidv4 } from './uuid';

export const parseCSV = (file: File): Promise<TextEntry[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      encoding: 'UTF-8',
      complete: (results) => {
        const { data, errors } = results;
        
        if (errors.length > 0) {
          reject(new Error('Error parsing CSV file'));
          return;
        }

        // Find the column that contains the text
        // Usually it's the first column in the provided example
        const rows = data as CSVRow[];
        if (rows.length === 0) {
          reject(new Error('No data found in CSV file'));
          return;
        }

        // The first column is the text column in the example
        const firstRow = rows[0];
        const columns = Object.keys(firstRow);
        
        if (columns.length === 0) {
          reject(new Error('No columns found in CSV file'));
          return;
        }

        const textColumn = columns[0];
        
        const entries: TextEntry[] = rows.map((row, index) => {
          const text = row[textColumn] || '';
          return {
            id: uuidv4(),
            text,
            emotions: { ...defaultEmotionLabels },
            originalIndex: index
          };
        });

        resolve(entries);
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};

export const exportToCSV = (entries: TextEntry[]): string => {
  // Sort entries by original index to maintain the original order
  const sortedEntries = [...entries].sort((a, b) => a.originalIndex - b.originalIndex);
  
  // Use Papa.unparse to properly handle CSV formatting
  return Papa.unparse({
    fields: [
      'Text',
      'Joy',
      'Sadness',
      'Anticipation',
      'Surprise',
      'Anger',
      'Fear',
      'Disgust',
      'Trust'
    ],
    data: sortedEntries.map(entry => [
      entry.text,
      entry.emotions.joy,
      entry.emotions.sadness,
      entry.emotions.anticipation,
      entry.emotions.surprise,
      entry.emotions.anger,
      entry.emotions.fear,
      entry.emotions.disgust,
      entry.emotions.trust
    ])
  }, {
    quotes: true, // Always quote fields
    escapeFormulae: true // Prevent CSV injection
  });
};