import React, { useState, useEffect } from 'react';
import { AppV1 } from './v1/AppV1';
import { AppV2 } from './v2/AppV2';

export function App() {
  // 檢測 URL 參數 ?v=1 或 ?v=2，預設為 v2
  const [version, setVersion] = useState<'v1' | 'v2'>(() => {
    const params = new URLSearchParams(window.location.search);
    const vParam = params.get('v');
    if (vParam === '1') return 'v1';
    if (vParam === '2') return 'v2';

    const saved = localStorage.getItem('pace_active_version');
    return saved === 'v1' ? 'v1' : 'v2';
  });

  // 當版本變更時同步至 URL 與 localStorage
  const handleSwitchVersion = (newVersion: 'v1' | 'v2') => {
    setVersion(newVersion);
    localStorage.setItem('pace_active_version', newVersion);

    const url = new URL(window.location.href);
    url.searchParams.set('v', newVersion === 'v1' ? '1' : '2');
    window.history.pushState({}, '', url.toString());
  };

  // 監聽瀏覽器上一頁/下一頁
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const vParam = params.get('v');
      if (vParam === '1') setVersion('v1');
      else if (vParam === '2') setVersion('v2');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (version === 'v1') {
    return <AppV1 onSwitchToV2={() => handleSwitchVersion('v2')} />;
  }

  return <AppV2 onSwitchToV1={() => handleSwitchVersion('v1')} />;
}

export default App;
