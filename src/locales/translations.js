const translations = {
  zh: {
    appTitle: '测试助手',
    requestBuilder: 'API',
    history: '历史记录',
    collections: '集合',
    settings: '设置',
    send: '发送',
    loading: '发送中...',
    url: '请输入URL',
    error: '请求发送失败',
    headers: '请求头',
    params: '参数',
    body: '请求体',
    language: '语言',
    theme: '主题',
    light: '浅色',
    dark: '深色',
    wuxia: '科技风',
    auto: '自动',
    autoSave: '自动保存',
    chinese: '中文',
    english: 'English'
  },
  en: {
    appTitle: 'Test Assistant',
    requestBuilder: 'API',
    history: 'History',
    collections: 'Collections',
    settings: 'Settings',
    send: 'Send',
    loading: 'Loading...',
    url: 'Please enter URL',
    error: 'Request failed',
    headers: 'Headers',
    params: 'Params',
    body: 'Body',
    language: 'Language',
    theme: 'Theme',
    light: 'Light',
    dark: 'Dark',
    wuxia: 'Tech',
    auto: 'Auto',
    autoSave: 'Auto Save',
    chinese: '中文',
    english: 'English'
  }
};

export const getTranslation = (language, key) => {
  return translations[language]?.[key] || translations.en[key] || key;
};

export default translations; 