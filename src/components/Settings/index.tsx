import React, { useRef, useState } from 'react';

export const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [backupFileName, setBackupFileName] = useState('');

  const handleReset = () => {
    if (window.confirm('모든 데이터가 삭제됩니다. 계속하시겠습니까?')) {
      localStorage.clear();
      window.dispatchEvent(new Event('storage'));
      alert('모든 데이터가 초기화되었습니다.');
    }
  };

  const openBackupModal = () => {
    const today = new Date().toISOString().split('T')[0];
    setBackupFileName(`stock-portfolio-backup-${today}`);
    setIsBackupModalOpen(true);
  };

  const handleBackup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      brokers: JSON.parse(localStorage.getItem('brokers') || '[]'),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${backupFileName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setIsBackupModalOpen(false);
  };

  const handleRestore = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        if (window.confirm('기존 데이터가 백업 데이터로 대체됩니다. 계속하시겠습니까?')) {
          localStorage.clear();
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
                onClick={openBackupModal}
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

      {/* 백업 파일명 입력 모달 */}
      {isBackupModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">백업 파일 이름 설정</h3>
            <form onSubmit={handleBackup}>
              <div className="mb-4">
                <input
                  type="text"
                  value={backupFileName}
                  onChange={(e) => setBackupFileName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="파일명을 입력하세요"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">.json 확장자가 자동으로 추가됩니다</p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsBackupModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  다운로드
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 