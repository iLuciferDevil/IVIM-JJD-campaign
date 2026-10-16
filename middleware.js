import { next } from '@vercel/functions';
export const config = { matcher: '/(.*)' };
const COOKIE='ivim_jjd_session';
async function authorized(cookie, secret) {
  if (!cookie || !secret) return false;
  const [expires,signature]=cookie.split('.');
  if (!/^\d{10,13}$/.test(expires||'') || !/^[a-f0-9]{64}$/.test(signature||'')) return false;
  if (Number(expires)<Date.now()) return false;
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  const signed=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('ivim-jjd-session-v1:'+expires));
  const expected=Array.from(new Uint8Array(signed),b=>b.toString(16).padStart(2,'0')).join('');
  let mismatch=0;
  for(let i=0;i<64;i++) mismatch |= expected.charCodeAt(i)^signature.charCodeAt(i);
  return mismatch===0;
}
export default async function middleware(request) {
  const path=new URL(request.url).pathname;
  if(path==='/login.html' || path==='/api/auth/login' || path==='/api/auth/logout') return next();
  const secret=process.env.IVIM_JJD_DASHBOARD_PASSWORD;
  if(!secret) return new Response('IVIM dashboard access is not configured.',{status:503,headers:{'Cache-Control':'no-store'}});
  const cookie=(request.headers.get('cookie')||'').split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if(await authorized(cookie,secret))return next();
  if(path.startsWith('/api/'))return new Response(JSON.stringify({error:'Unauthorized'}),{status:401,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
  const target=new URL('/login.html',request.url);
  if(path!=='/'&&path!=='/login.html')target.searchParams.set('next',path);
  return Response.redirect(target,307);
}