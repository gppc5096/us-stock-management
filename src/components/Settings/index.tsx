import React, { useRef } from 'react';

export const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReset = () => {
    if (window.confirm('모든 데이터가 삭제됩니다. 계속하시겠습니까?')) {
      localStorage.clear();
      window.dispatchEvent(new Event('storage'));
      alert('모든 데이터가 초기화되었습니다.');
    }
  };

  const handleBackup = () => {
    const data = {
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      brokers: JSON.parse(localStorage.getItem('brokers') || '[]'),
      // 필요한 다른 데이터도 여기에 추가
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (window.confirm('기존 데이터가 백업 데이터로 대체됩니다. 계속하시겠습니까?')) {
          // 기존 데이터 초기화
          localStorage.clear();
          
          // 백업 데이터 복원
          Object.entries(data).forEach(([key, value]) => {
            localStorage.setItem(key, JSON.stringify(value));
          });
          
          window.dispatchEvent(new Event('storage'));
          alert('데이터가 성공적으로 복원되었습니다.');
        }
      } catch (error) {
        alert('올바르지 않은 백업 파일입니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-6">설정</h2>
      
      <div className="space-y-4">
        {/* 초기화 섹션 */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">데이터 초기화</h3>
          <p className="text-sm text-gray-600 mb-3">
            모든 데이터를 초기화합니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <button
            onClick={handleReset}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            초기화
          </button>
        </div>

        {/* 백업 및 복원 섹션 */}
        <div className="p-4 bg-white rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-3">데이터 백업 및 복원</h3>
          <div className="space-y-3">
            <div>
              <button
                onClick={handleBackup}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mr-4"
              >
                데이터 백업하기
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleRestore}
                accept=".json"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                데이터 가져오기
              </button>
            </div>
            <p className="text-sm text-gray-600">
              데이터를 JSON 파일로 백업하거나, 백업된 데이터를 복원할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 