export const ENV =
  window.location.hostname === 'kasigo.com'
    ? 'prod'
    : window.location.hostname.includes('todo: change to non prod matcher')
      ? 'stage'
      : window.location.port === '4173'
        ? 'test'
        : 'dev';

export const getServerUrl = () => {
  switch (ENV) {
    case 'stage':
      return 'todo: change to stage url';
    case 'prod':
      return 'https://kasigo.com';
    case 'test':
      return 'http://localhost:8788';
    case 'dev':
    default:
      return 'http://localhost:8787';
  }
};
