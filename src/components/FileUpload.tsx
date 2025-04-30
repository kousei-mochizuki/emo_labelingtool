import React, { useRef, useState } from 'react';
import { Upload, FileText } from 'lucide-react';
import { parseCSV } from '../utils/csvParser';
import { useData } from '../contexts/DataContext';
import toast from 'react-hot-toast';
import '../styles/FileUpload.css';


interface FileUploadProps {
  onDataLoaded: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setEntries, setCurrentEntryIndex } = useData();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    await processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file');
      return;
    }

    setIsLoading(true);
    
    try {
      const entries = await parseCSV(file);
      
      if (entries.length === 0) {
        toast.error('No entries found in the CSV file');
        return;
      }
      
      setEntries(entries);
      setCurrentEntryIndex(0);
      onDataLoaded();
      toast.success(`Successfully loaded ${entries.length} entries`);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing CSV file. Make sure the format is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`file-upload-container`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
            <p className="text-gray-600">ファイルを処理中...</p>
          </div>
        ) : (
          <>
            <div className="file-upload-title">
              <Upload className="h-8 w-8 text-primary-600" />
              <h3>
                CSVファイルをアップロード
              </h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              ボタンをクリックしてCSVファイルを選択してください
            </p>
            <button
              onClick={handleButtonClick}
              className="upload-button"
              disabled={isLoading}
            >
              <FileText className="h-4 w-4" />
              <span>ファイルを選択</span>
            </button>
            <div className="mt-6 text-xs text-gray-500">
              推奨: CSV（UTF-8エンコード）
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;