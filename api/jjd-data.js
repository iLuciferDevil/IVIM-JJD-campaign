import { createSign } from 'node:crypto';
const spreadsheet='1MEBUHEF0vedGumfkgHDVQupEuvBglqLnDN-_DJO0Usc';
const tabs=['Meta Campaign Daily','Meta Ad Set Daily','Meta Creative Daily','Google Campaign Daily','IVIM Funnel Daily'];
function base64url(s){return Buffer.from(s).toString('base64url')}
async function token(){
 const email=process.env.IVIM_SHEETS_CLIENT_EMAIL,key=process.env.IVIM_SHEETS_PRIVATE_KEY?.replace(/\\n/g,'\n');
 if(!email||!key)throw Error('Google Sheets service account is not configured');
 const now=Math.floor(Date.now()/1000),header=base64url(JSON.stringify({alg:'RS256',typ:'JWT'})),body=base64url(JSON.stringify({iss:email,scope:'https://www.googleapis.com/auth/spreadsheets.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600})),unsigned=header+'.'+body;
 const sign=createSign('RSA-SHA256');sign.update(unsigned);sign.end();
 const jwt=unsigned+'.'+sign.sign(key).toString('base64url');
 const res=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:jwt})});
 if(!res.ok)throw Error('Service account authentication failed');
 return (await res.json()).access_token;
}
export default async function handler(req,res){
 if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
 res.setHeader('Cache-Control','private, no-store');
 try{
 const access=await token();
 const qp=new URLSearchParams;tabs.forEach(t=>qp.append('ranges',"'"+t+"'!A1:Z1000"));qp.set('majorDimension','ROWS');
 const r=await fetch('https://sheets.googleapis.com/v4/spreadsheets/'+spreadsheet+'/values:batchGet?'+qp.toString(),{headers:{Authorization:'Bearer '+access}});
 if(!r.ok)throw Error('Could not read JJD spreadsheet ('+r.status+')');
 const data=await r.json();
 const response={updatedAt:new Date().toISOString(),tabs:{}};
 (data.valueRanges||[]).forEach((v,i)=>{const rows=v.values||[];response.tabs[tabs[i]]=rows.length?rows.slice(1).filter(row=>row.some(x=>String(x||'').trim())).map(row=>Object.fromEntries(rows[0].map((h,j)=>[h,row[j]??'']))):[]});
 return res.status(200).json(response);
 }catch(e){return res.status(503).json({error:e.message})}
}
