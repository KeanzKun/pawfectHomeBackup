import blocklist from '../components/disposable_email_blocklist.json';

export async function isDisposable(email) {
  return blocklist.includes(email.split('@')[1]);
}