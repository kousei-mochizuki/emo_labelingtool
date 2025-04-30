import React from 'react';
import { FileText, HelpCircle, KeySquare } from 'lucide-react';
import '../styles/EmptyState.css';

const EmptyState: React.FC = () => {
  return (
    <div className="mt-10 bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        テキスト感情ラベリングツールへようこそ
      </h2>
      
      <p className="text-gray-600 mb-6">
        このツールでは、CSVファイルから読み込んだテキストに対して8つの感情からラベル付けすることができます。
      </p>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-500" />
          <span>CSVファイル形式</span>
        </h3>
        <p>CSVファイルの最初の列はテキストデータとして扱われます。</p>
        <p>ファイルには次の列が含まれることが期待されます:</p>
        <div className="info">
          Text,Joy,Sadness,Anticipation,...
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary-500" />
          <span>使い方</span>
        </h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 ml-7">
          <li>上部のセクションでCSVファイルをアップロードします</li>
          <li>テキストが表示されたら、該当する感情を選択します（複数選択可能）</li>
          <li>矢印ボタンまたはキーボードの矢印キーで次のテキストに移動します</li>
          <li>作業が完了したら、上部の「エクスポート」ボタンでラベル付けされたデータをダウンロードします</li>
        </ol>
      </div>
      
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center gap-2">
          <KeySquare className="h-5 w-5 text-primary-500" />
          <span>キーボードショートカット</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 ml-7">
          <div className="flex items-center">
            <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-700 mr-2">1-8</kbd>
            <span>対応する感情を選択/解除</span>
          </div>
          <div className="flex items-center">
            <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-700 mr-2">←</kbd>
            <span>前のテキストへ移動</span>
          </div>
          <div className="flex items-center">
            <kbd className="bg-gray-100 px-2 py-1 rounded border border-gray-300 text-gray-700 mr-2">→</kbd>
            <span>次のテキストへ移動</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;